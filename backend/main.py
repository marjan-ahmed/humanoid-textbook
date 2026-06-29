from __future__ import annotations

import asyncio
import contextvars
import json
import os
import sys
import uuid
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, AsyncIterator, Literal

from agents import (
    Agent,
    AsyncOpenAI,
    OpenAIChatCompletionsModel,
    Runner,
    function_tool,
    set_default_openai_api,
    set_default_openai_client,
    set_tracing_disabled,
)
from chatkit.agents import AgentContext, ThreadItemConverter, stream_agent_response
from chatkit.server import ChatKitServer, StreamingResult
from chatkit.store import Store
from chatkit.types import (
    AssistantMessageContent,
    AssistantMessageItem,
    Page,
    ThreadItem,
    ThreadItemAddedEvent,
    ThreadItemDoneEvent,
    ThreadItemUpdatedEvent,
    ThreadMetadata,
)
from cohere import ClientV2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent
DOCS_BUILD_DIR = BACKEND_DIR / "static"
FALLBACK_BUILD_DIR = ROOT_DIR / "book_content" / "build"

load_dotenv(ROOT_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env")

COLLECTION_NAME = os.getenv("QDRANT_COLLECTION", "humanoid-textbook-content")
EMBED_MODEL = os.getenv("COHERE_EMBED_MODEL", "embed-english-v3.0")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
BASE_URL = os.getenv("BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/")
THREAD_ASSISTANT_LIMIT = 12

COHERE_CLIENT: ClientV2 | None = None
QDRANT_CLIENT: QdrantClient | None = None
MODEL_CLIENT: OpenAI | None = None
MODEL_ASYNC_CLIENT: AsyncOpenAI | None = None
CHAT_MODEL: OpenAIChatCompletionsModel | None = None
CHATKIT_STORE: "MemoryStore | None" = None
CHATKIT_SERVER: "TextbookChatKitServer | None" = None
REQUEST_CONTEXT: contextvars.ContextVar[str] = contextvars.ContextVar("request_context", default="")

TEXTBOOK_AGENT_INSTRUCTIONS = (
    "You answer only from the Physical AI textbook. "
    "Always call the search_book tool before answering a user question. "
    "Use the retrieved passages as your source of truth, cite chapter and section names in square brackets, "
    "and if the textbook does not contain the answer, say so directly."
)


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} is required")
    return value


def resolve_static_dir() -> Path:
    if (DOCS_BUILD_DIR / "index.html").exists():
        return DOCS_BUILD_DIR
    if (FALLBACK_BUILD_DIR / "index.html").exists():
        return FALLBACK_BUILD_DIR
    return DOCS_BUILD_DIR


def create_clients() -> tuple[ClientV2, QdrantClient, OpenAI, AsyncOpenAI, OpenAIChatCompletionsModel]:
    cohere_api_key = require_env("COHERE_API_KEY")
    qdrant_url = require_env("QDRANT_URL")
    qdrant_api_key = require_env("QDRANT_API_KEY")
    gemini_api_key = require_env("GEMINI_API_KEY")
    base_url = require_env("BASE_URL")
    gemini_model = require_env("GEMINI_MODEL")

    cohere_client = ClientV2(api_key=cohere_api_key)
    qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    model_client = OpenAI(api_key=gemini_api_key, base_url=base_url)
    model_async_client = AsyncOpenAI(api_key=gemini_api_key, base_url=base_url)

    set_default_openai_client(model_async_client, use_for_tracing=False)
    set_default_openai_api("chat_completions")
    set_tracing_disabled(True)

    chat_model = OpenAIChatCompletionsModel(model=gemini_model, openai_client=model_async_client)
    return cohere_client, qdrant_client, model_client, model_async_client, chat_model


def get_collection_vector_size(client: QdrantClient) -> int:
    collection = client.get_collection(COLLECTION_NAME)
    vectors = getattr(getattr(getattr(collection, "config", None), "params", None), "vectors", None)
    current_size = getattr(vectors, "size", None)
    if not current_size:
        raise RuntimeError(f"Could not determine vector size for Qdrant collection {COLLECTION_NAME!r}")
    return int(current_size)


def embed_query(query: str) -> list[float]:
    if COHERE_CLIENT is None:
        raise RuntimeError("Cohere client is not initialized")
    response = COHERE_CLIENT.embed(
        model=EMBED_MODEL,
        texts=[query],
        input_type="search_query",
        embedding_types=["float"],
    )
    return response.embeddings.float[0]


def format_retrieval_context(results: list[qmodels.ScoredPoint]) -> str:
    blocks: list[str] = []
    for index, point in enumerate(results, start=1):
        payload = point.payload or {}
        chapter = payload.get("chapter", "unknown-chapter")
        section = payload.get("section", "unknown-section")
        module = payload.get("module", "unknown-module")
        content = payload.get("content", "")
        score = f"{point.score:.3f}" if point.score is not None else "n/a"
        blocks.append(f"[{index}] {chapter} > {section} | module={module} | score={score}\n{content}")
    return "\n\n".join(blocks)


def search_qdrant(query: str, limit: int = 5) -> list[qmodels.ScoredPoint]:
    if QDRANT_CLIENT is None:
        raise RuntimeError("Qdrant client is not initialized")
    vector = embed_query(query)
    response = QDRANT_CLIENT.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=limit,
        with_payload=True,
    )
    return list(response.points)


def current_scoped_query(query: str) -> str:
    scoped_context = REQUEST_CONTEXT.get().strip()
    if scoped_context:
        return f"Selected text context:\n{scoped_context}\n\nQuestion:\n{query}"
    return query


@function_tool
def search_book(query: str) -> str:
    scoped_query = current_scoped_query(query)
    results = search_qdrant(scoped_query, limit=5)
    if not results:
        return "No relevant textbook passages were found."
    return format_retrieval_context(results)


def extract_message_text(item: Any) -> str:
    content = getattr(item, "content", None) or []
    parts: list[str] = []
    for part in content:
        text = getattr(part, "text", None)
        if isinstance(text, str) and text.strip():
            parts.append(text.strip())
        elif isinstance(part, dict) and isinstance(part.get("text"), str) and part["text"].strip():
            parts.append(part["text"].strip())
    return "\n".join(parts).strip()


def count_assistant_messages(items: list[ThreadItem]) -> int:
    return sum(1 for item in items if isinstance(item, AssistantMessageItem))


def classify_response_size(question: str) -> tuple[Literal["small", "medium"], str]:
    normalized = question.lower().strip()
    words = [word for word in normalized.split() if word]
    complex_markers = (
        "explain",
        "how",
        "why",
        "compare",
        "summarize",
        "walk through",
        "approach",
        "architecture",
        "tradeoff",
        "what does",
    )
    if len(words) <= 8 and not any(marker in normalized for marker in complex_markers):
        return (
            "small",
            "Keep the answer short: 2 to 4 sentences max, or up to 3 tight bullets. Answer only the asked point.",
        )
    return (
        "medium",
        "Keep the answer medium-length: 5 to 8 sentences max, or up to 6 focused bullets. Stay tightly scoped to the question.",
    )


def build_runtime_instructions(question: str) -> str:
    _, size_guidance = classify_response_size(question)
    return f"{TEXTBOOK_AGENT_INSTRUCTIONS} {size_guidance} Avoid unnecessary elaboration."


def build_thread_limit_message(thread: ThreadMetadata, context: dict[str, Any], store: Store[dict[str, Any]]) -> AssistantMessageItem:
    return AssistantMessageItem(
        thread_id=thread.id,
        id=store.generate_item_id("message", thread, context),
        created_at=datetime.now(timezone.utc),
        content=[
            AssistantMessageContent(
                text=(
                    "This thread has reached its usage limit of 12 assistant answers. "
                    "Start a new thread to continue."
                )
            )
        ],
    )


def build_agent(question: str, model: OpenAIChatCompletionsModel | None = None) -> Agent:
    active_model = model or CHAT_MODEL
    if active_model is None:
        raise RuntimeError("Chat model is not initialized")
    return Agent(
        name="TextbookAssistant",
        model=active_model,
        instructions=build_runtime_instructions(question),
        tools=[search_book],
    )


def build_chat_input(message: str, context: str | None) -> str:
    if context:
        return (
            "Use this selected text as the primary scope for retrieval.\n\n"
            f"Selected text:\n{context}\n\n"
            f"Question:\n{message}"
        )
    return message


@dataclass
class ThreadState:
    thread: ThreadMetadata
    items: list[ThreadItem] = field(default_factory=list)


class MemoryStore(Store[dict[str, Any]]):
    def __init__(self) -> None:
        self._threads: dict[str, ThreadState] = {}
        self._attachments: dict[str, Any] = {}

    def generate_thread_id(self, context: dict[str, Any]) -> str:
        return f"thread_{uuid.uuid4().hex[:12]}"

    def generate_item_id(self, item_type: str, thread: ThreadMetadata, context: dict[str, Any]) -> str:
        return f"{item_type}_{uuid.uuid4().hex[:12]}"

    async def load_thread(self, thread_id: str, context: dict[str, Any]) -> ThreadMetadata:
        state = self._threads.get(thread_id)
        if state is not None:
            return state.thread.model_copy(deep=True)

        thread = ThreadMetadata(id=thread_id, created_at=datetime.now(timezone.utc), metadata={})
        self._threads[thread_id] = ThreadState(thread=thread.model_copy(deep=True))
        return thread

    async def save_thread(self, thread: ThreadMetadata, context: dict[str, Any]) -> None:
        state = self._threads.get(thread.id)
        if state is None:
            self._threads[thread.id] = ThreadState(thread=thread.model_copy(deep=True))
            return
        state.thread = thread.model_copy(deep=True)

    async def load_thread_items(self, thread_id: str, after: str | None, limit: int, order: str, context: dict[str, Any]) -> Page[ThreadItem]:
        state = self._threads.get(thread_id)
        items = [item.model_copy(deep=True) for item in (state.items if state else [])]
        items.sort(key=lambda item: getattr(item, "created_at", datetime.now(timezone.utc)), reverse=(order == "desc"))

        start_index = 0
        if after:
            for index, item in enumerate(items):
                if item.id == after:
                    start_index = index + 1
                    break

        window = items[start_index : start_index + limit + 1]
        has_more = len(window) > limit
        data = window[:limit]
        next_after = data[-1].id if has_more and data else None
        return Page(data=data, has_more=has_more, after=next_after)

    async def add_thread_item(self, thread_id: str, item: ThreadItem, context: dict[str, Any]) -> None:
        state = self._threads.get(thread_id)
        if state is None:
            await self.load_thread(thread_id, context)
            state = self._threads[thread_id]

        for index, existing in enumerate(state.items):
            if existing.id == item.id:
                state.items[index] = item.model_copy(deep=True)
                return

        state.items.append(item.model_copy(deep=True))

    async def save_item(self, thread_id: str, item: ThreadItem, context: dict[str, Any]) -> None:
        await self.add_thread_item(thread_id, item, context)

    async def load_item(self, thread_id: str, item_id: str, context: dict[str, Any]) -> ThreadItem:
        state = self._threads.get(thread_id)
        if state is None:
            raise ValueError(f"Thread {thread_id} not found")
        for item in state.items:
            if item.id == item_id:
                return item.model_copy(deep=True)
        raise ValueError(f"Item {item_id} not found")

    async def delete_thread_item(self, thread_id: str, item_id: str, context: dict[str, Any]) -> None:
        state = self._threads.get(thread_id)
        if state is not None:
            state.items = [item for item in state.items if item.id != item_id]

    async def load_threads(self, limit: int, after: str | None, order: str, context: dict[str, Any]) -> Page[ThreadMetadata]:
        threads = [state.thread.model_copy(deep=True) for state in self._threads.values()]
        threads.sort(key=lambda thread: thread.created_at, reverse=(order == "desc"))

        start_index = 0
        if after:
            for index, thread in enumerate(threads):
                if thread.id == after:
                    start_index = index + 1
                    break

        window = threads[start_index : start_index + limit + 1]
        has_more = len(window) > limit
        data = window[:limit]
        next_after = data[-1].id if has_more and data else None
        return Page(data=data, has_more=has_more, after=next_after)

    async def delete_thread(self, thread_id: str, context: dict[str, Any]) -> None:
        self._threads.pop(thread_id, None)

    async def save_attachment(self, attachment: Any, context: dict[str, Any]) -> None:
        self._attachments[attachment.id] = attachment

    async def load_attachment(self, attachment_id: str, context: dict[str, Any]) -> Any:
        if attachment_id not in self._attachments:
            raise ValueError(f"Attachment {attachment_id} not found")
        return self._attachments[attachment_id]

    async def delete_attachment(self, attachment_id: str, context: dict[str, Any]) -> None:
        self._attachments.pop(attachment_id, None)


class TextbookChatKitServer(ChatKitServer[dict[str, Any]]):
    def __init__(self, data_store: Store[dict[str, Any]], model: OpenAIChatCompletionsModel):
        super().__init__(data_store)
        self.model = model
        self.converter = ThreadItemConverter()

    async def respond(
        self,
        thread: ThreadMetadata,
        input: Any,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadItemAddedEvent | ThreadItemDoneEvent | ThreadItemUpdatedEvent]:
        agent_context = AgentContext(thread=thread, store=self.store, request_context=context)
        page = await self.store.load_thread_items(thread.id, after=None, limit=100, order="asc", context=context)
        all_items = list(page.data)
        assistant_count = count_assistant_messages(all_items)
        if assistant_count >= THREAD_ASSISTANT_LIMIT:
            yield ThreadItemDoneEvent(item=build_thread_limit_message(thread, context, self.store))
            return

        if input is not None:
            all_items.append(input)

        question = extract_message_text(input) or "Answer the user's latest question from the textbook."
        agent = build_agent(question, self.model)
        agent_input = await self.converter.to_agent_input(all_items) if all_items else []
        token = REQUEST_CONTEXT.set(str(context.get("context") or context.get("selected_text") or ""))
        id_mapping: dict[str, str] = {}

        try:
            result = Runner.run_streamed(agent, agent_input, context=agent_context)
            async for event in stream_agent_response(agent_context, result):
                if event.type == "thread.item.added" and isinstance(event.item, AssistantMessageItem):
                    original_id = event.item.id
                    if original_id not in id_mapping:
                        id_mapping[original_id] = self.store.generate_item_id("message", thread, context)
                    event.item.id = id_mapping[original_id]
                elif event.type == "thread.item.done" and isinstance(event.item, AssistantMessageItem):
                    mapped_id = id_mapping.get(event.item.id)
                    if mapped_id:
                        event.item.id = mapped_id
                elif event.type == "thread.item.updated":
                    mapped_id = id_mapping.get(event.item_id)
                    if mapped_id:
                        event.item_id = mapped_id
                yield event
        finally:
            REQUEST_CONTEXT.reset(token)


async def run_chat_stream(message: str, context: str | None) -> AsyncIterator[str]:
    agent = build_agent(message)
    token = REQUEST_CONTEXT.set(context or "")
    try:
        result = Runner.run_streamed(agent, input=build_chat_input(message, context))
        async for event in result.stream_events():
            if event.type != "raw_response_event":
                continue
            delta = getattr(event.data, "delta", None)
            if delta:
                payload = json.dumps({"type": "delta", "text": delta}, ensure_ascii=False)
                yield f"data: {payload}\n\n"
        final_text = result.final_output
        if final_text:
            yield f"data: {json.dumps({'type': 'final', 'text': final_text}, ensure_ascii=False)}\n\n"
        yield f"data: {json.dumps({'type': 'done'}, ensure_ascii=False)}\n\n"
    finally:
        REQUEST_CONTEXT.reset(token)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global COHERE_CLIENT, QDRANT_CLIENT, MODEL_CLIENT, MODEL_ASYNC_CLIENT, CHAT_MODEL, CHATKIT_STORE, CHATKIT_SERVER
    COHERE_CLIENT, QDRANT_CLIENT, MODEL_CLIENT, MODEL_ASYNC_CLIENT, CHAT_MODEL = create_clients()
    get_collection_vector_size(QDRANT_CLIENT)
    CHATKIT_STORE = MemoryStore()
    CHATKIT_SERVER = TextbookChatKitServer(CHATKIT_STORE, CHAT_MODEL)
    yield


app = FastAPI(title="Physical AI Textbook RAG Backend", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chatkit")
async def chatkit_endpoint(request: Request) -> Response:
    if CHATKIT_SERVER is None:
        raise HTTPException(status_code=503, detail="ChatKit server is not initialized")

    request_context = {
        "context": request.headers.get("x-selected-text", ""),
        "domain": request.headers.get("origin", ""),
    }
    result = await CHATKIT_SERVER.process(await request.body(), request_context)
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")


@app.post("/api/chat")
async def chat(payload: dict[str, Any]) -> StreamingResponse:
    message = str(payload.get("message") or "").strip()
    context = payload.get("context")

    if not message:
        raise HTTPException(status_code=400, detail="message is required")
    if CHAT_MODEL is None:
        raise HTTPException(status_code=503, detail="Gemini chat model is not initialized")

    if CHATKIT_STORE is not None and payload.get("thread_id"):
        thread_id = str(payload["thread_id"])
        state = CHATKIT_STORE._threads.get(thread_id)
        if state and count_assistant_messages(state.items) >= THREAD_ASSISTANT_LIMIT:
            raise HTTPException(status_code=429, detail="This thread has reached its usage limit of 12 assistant answers")

    return StreamingResponse(
        run_chat_stream(message, context if isinstance(context, str) else None),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


async def run_ingest_subprocess() -> dict[str, object]:
    ingest_path = BACKEND_DIR / "ingest.py"
    process = await asyncio.create_subprocess_exec(
        sys.executable,
        str(ingest_path),
        cwd=str(BACKEND_DIR),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()
    return {
        "returncode": process.returncode,
        "stdout": stdout.decode("utf-8", errors="replace"),
        "stderr": stderr.decode("utf-8", errors="replace"),
    }


@app.post("/api/ingest")
async def ingest_endpoint() -> JSONResponse:
    result = await run_ingest_subprocess()
    status_code = 200 if result["returncode"] == 0 else 500
    return JSONResponse(result, status_code=status_code)


@app.get("/api/health")
async def api_health() -> JSONResponse:
    status: dict[str, object] = {}

    try:
        status["qdrant"] = bool(QDRANT_CLIENT and QDRANT_CLIENT.get_collection(COLLECTION_NAME))
    except Exception as exc:
        status["qdrant"] = False
        status["qdrant_error"] = str(exc)

    status["cohere"] = bool(COHERE_CLIENT and EMBED_MODEL)
    if not status["cohere"]:
        status["cohere_error"] = "Cohere client or embedding model is not configured"

    if MODEL_CLIENT is None:
        status["gemini"] = False
        status["gemini_error"] = "GEMINI_API_KEY, GEMINI_MODEL, and BASE_URL are required"
    else:
        try:
            status["gemini"] = bool(MODEL_CLIENT.models.list())
        except Exception as exc:
            status["gemini"] = False
            status["gemini_error"] = str(exc)

    status["chatkit"] = CHATKIT_SERVER is not None and CHATKIT_STORE is not None
    healthy = bool(status.get("qdrant")) and bool(status.get("cohere")) and bool(status.get("gemini"))
    return JSONResponse({"healthy": healthy, "status": status}, status_code=200 if healthy else 503)


@app.get("/health")
async def health() -> JSONResponse:
    return await api_health()


@app.get("/debug/threads")
@app.get("/api/debug/threads")
async def debug_threads() -> JSONResponse:
    if CHATKIT_STORE is None:
        raise HTTPException(status_code=503, detail="ChatKit store is not initialized")

    result: dict[str, Any] = {}
    for thread_id, state in CHATKIT_STORE._threads.items():
        items = []
        for item in state.items:
            items.append(
                {
                    "id": item.id,
                    "type": type(item).__name__,
                    "text": extract_message_text(item),
                }
            )
        result[thread_id] = {
            "created_at": state.thread.created_at.isoformat(),
            "item_count": len(state.items),
            "assistant_count": count_assistant_messages(state.items),
            "items": items,
        }
    return JSONResponse(result)


static_dir = resolve_static_dir()
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="site")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("BACKEND_PORT", "8000")), reload=False)

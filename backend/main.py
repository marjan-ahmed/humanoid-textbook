from __future__ import annotations

import asyncio
import contextvars
import json
import os
import subprocess
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from agents import Agent, Runner, function_tool
from cohere import ClientV2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
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
OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")
VECTOR_SIZE: int | None = None

COHERE_CLIENT: ClientV2 | None = None
QDRANT_CLIENT: QdrantClient | None = None
OPENAI_CLIENT: OpenAI | None = None
REQUEST_CONTEXT: contextvars.ContextVar[str] = contextvars.ContextVar("request_context", default="")


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


def create_clients() -> tuple[ClientV2, QdrantClient, OpenAI | None]:
    cohere_api_key = require_env("COHERE_API_KEY")
    qdrant_url = require_env("QDRANT_URL")
    qdrant_api_key = require_env("QDRANT_API_KEY")
    openai_api_key = os.environ.get("OPENAI_API_KEY")

    cohere_client = ClientV2(api_key=cohere_api_key)
    qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    openai_client = OpenAI(api_key=openai_api_key) if openai_api_key else None
    return cohere_client, qdrant_client, openai_client


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
    return QDRANT_CLIENT.search(
        collection_name=COLLECTION_NAME,
        query_vector=vector,
        limit=limit,
        with_payload=True,
    )


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


@asynccontextmanager
async def lifespan(app: FastAPI):
    global COHERE_CLIENT, QDRANT_CLIENT, OPENAI_CLIENT, VECTOR_SIZE
    COHERE_CLIENT, QDRANT_CLIENT, OPENAI_CLIENT = create_clients()
    VECTOR_SIZE = get_collection_vector_size(QDRANT_CLIENT)
    yield


app = FastAPI(title="Physical AI Textbook RAG Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_agent() -> Agent:
    return Agent(
        name="TextbookAssistant",
        model=OPENAI_CHAT_MODEL,
        instructions=(
            "You answer only from the Physical AI textbook. "
            "Use the provided retrieved passages as your source of truth. "
            "Cite chapter and section names in square brackets when you make a claim. "
            "If the textbook does not contain the answer, say so directly."
        ),
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


async def run_chat_stream(message: str, context: str | None):
    agent = build_agent()
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
        final_text = getattr(result, "final_output", None)
        if final_text:
            yield f"data: {json.dumps({'type': 'final', 'text': final_text}, ensure_ascii=False)}\n\n"
        yield f"data: {json.dumps({'type': 'done'}, ensure_ascii=False)}\n\n"
    finally:
        REQUEST_CONTEXT.reset(token)


@app.post("/api/chat")
async def chat(payload: dict) -> StreamingResponse:
    message = (payload.get("message") or "").strip()
    context = payload.get("context")

    if not message:
        raise HTTPException(status_code=400, detail="message is required")
    if OPENAI_CLIENT is None:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is required for chat")

    return StreamingResponse(
        run_chat_stream(message, context),
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
async def health() -> JSONResponse:
    status: dict[str, object] = {}

    try:
        status["qdrant"] = bool(QDRANT_CLIENT and QDRANT_CLIENT.get_collection(COLLECTION_NAME))
    except Exception as exc:
        status["qdrant"] = False
        status["qdrant_error"] = str(exc)

    status["cohere"] = bool(COHERE_CLIENT and EMBED_MODEL)
    if not status["cohere"]:
        status["cohere_error"] = "Cohere client or embedding model is not configured"

    if OPENAI_CLIENT is None:
        status["openai"] = False
        status["openai_error"] = "OPENAI_API_KEY is not configured"
    else:
        try:
            status["openai"] = bool(OPENAI_CLIENT.models.list())
        except Exception as exc:
            status["openai"] = False
            status["openai_error"] = str(exc)

    healthy = bool(status.get("qdrant")) and bool(status.get("cohere")) and bool(status.get("openai"))
    return JSONResponse({"healthy": healthy, "status": status}, status_code=200 if healthy else 503)


static_dir = resolve_static_dir()
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="site")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("BACKEND_PORT", "8000")), reload=False)

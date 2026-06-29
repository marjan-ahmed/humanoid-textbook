# Specification: RAG Backend for Humanoid Textbook

## Overview

Build a RAG (Retrieval-Augmented Generation) backend that ingests the textbook's MDX content into Qdrant, exposes a chat API via FastAPI using the OpenAI Agents SDK, and serves the Docusaurus build as static files. The backend is intentionally minimal: two Python files, no class hierarchies, flat function-based architecture.

## User Stories

1. **As a reader**, I can ask questions about the textbook and get grounded answers from the book content.
2. **As a reader**, I can select text in the book and ask questions scoped to that selection.
3. **As a developer**, I can re-ingest content by running a single script.
4. **As a deployer**, I can run one command to start the server that serves both the book and the API.

## Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | Parse all 8 MDX files from `book_content/docs/` into plain text chunks |
| FR-02 | Chunk content by `##` sections with 200-character overlap |
| FR-03 | Embed chunks using OpenAI `text-embedding-3-small` (1536 dimensions) |
| FR-04 | Store embeddings in Qdrant collection `humanoid_textbook` with metadata (chapter, section, module) |
| FR-05 | Expose `POST /api/chat` endpoint: accepts `{ message, context? }`, returns streamed answer |
| FR-06 | Expose `POST /api/ingest` endpoint: triggers re-ingestion of MDX files |
| FR-07 | Expose `GET /api/health` endpoint: returns Qdrant + OpenAI connectivity status |
| FR-08 | Serve Docusaurus build from `backend/static/` as static files |
| FR-09 | Use OpenAI Agents SDK with a `@function_tool` for Qdrant retrieval |
| FR-10 | Support selected-text context: when user highlights text, send it as `context` field to scope retrieval |

## Architecture

```
book_content/docs/*.mdx
        │
        ▼
   ingest.py  ─── parse → chunk → embed → Qdrant
        │
        ▼
   main.py    ─── FastAPI app
   ├── POST /api/chat     →  Agent + Qdrant tool → SSE stream
   ├── POST /api/ingest   →  re-run ingest.py
   ├── GET  /api/health   →  status check
   └── Static files       →  Docusaurus build
```

## File Structure

```
backend/
├── pyproject.toml     # uv project: dependencies, scripts
├── main.py            # FastAPI app, Agent, Qdrant tool, chat endpoint, static serving
├── ingest.py          # MDX parsing, chunking, embedding, Qdrant upload
└── static/            # Docusaurus build output (gitignored, built separately)
```

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Package manager | uv | latest |
| Backend framework | FastAPI[standard] | latest |
| LLM + embeddings | OpenAI Agents SDK (`openai-agents`) | latest |
| Vector database | Qdrant (`qdrant-client`) | latest |
| Embedding model | `text-embedding-3-small` | 1536 dims |
| Chat model | `gpt-4o-mini` | — |
| MDX parsing | `markdown` + `re` | stdlib |
| Server | Uvicorn (via FastAPI standard) | — |

## Data Flow

### Ingestion (ingest.py)
1. Read all `*.mdx` files from `book_content/docs/` (recursively)
2. Strip YAML frontmatter
3. Split by `## ` headings into sections
4. Each section becomes a chunk with metadata: `{ chapter, section_title, module, content }`
5. Embed each chunk via OpenAI `text-embedding-3-small`
6. Upsert into Qdrant collection `humanoid_textbook`

### Chat (POST /api/chat)
1. Receive `{ message: str, context?: str }`
2. If `context` provided (selected text), use it to filter/boost retrieval
3. Embed the query via OpenAI
4. Search Qdrant for top-5 relevant chunks
5. Agent receives chunks as context + user message
6. Agent generates answer via GPT-4o-mini
7. Stream response as SSE

### Agent Setup
```python
from agents import Agent, function_tool

@function_tool
def search_book(query: str) -> str:
    """Search the textbook for relevant content."""
    # embed query → qdrant search → return top chunks
    ...

agent = Agent(
    name="TextbookAssistant",
    instructions="Answer questions about Physical AI and Humanoid Robotics using ONLY the provided textbook context. If the context doesn't contain the answer, say so.",
    tools=[search_book],
    model="gpt-4o-mini",
)
```

## Env Variables

```
OPENAI_API_KEY=sk-...
QDRANT_URL=https://...qdrant.io:6333
QDRANT_API_KEY=...
```

## Success Criteria

| ID | Criteria |
|----|----------|
| SC-01 | `uv run python ingest.py` ingests all 8 chapters into Qdrant |
| SC-02 | `uv run uvicorn main:app` starts server on port 8000 |
| SC-03 | `POST /api/chat` returns grounded answers with source citations |
| SC-04 | Selected-text context narrows retrieval scope |
| SC-05 | Docusaurus build served at `http://localhost:8000/` |
| SC-06 | `POST /api/ingest` re-ingests without restart |

# Plan: RAG Backend for Physical AI Textbook

## Phase 1: Backend Setup
- Create `backend/` at the repository root with `uv init`.
- Add dependencies: `fastapi[standard]`, `openai-agents`, `qdrant-client`, `openai`, `python-dotenv`, and the Cohere client used for embeddings.
- Add environment handling for `COHERE_API_KEY`, `COHERE_EMBED_MODEL`, `QDRANT_URL`, `QDRANT_API_KEY`, and any OpenAI key required by the agent runtime.
- Add backend ignore rules for `static/`, `.env`, and Python cache files.

## Phase 2: Ingestion Pipeline (`ingest.py`)
- Read all `*.mdx` files recursively from `book_content/docs/`.
- Strip YAML frontmatter and split content by `##` headings.
- Derive metadata from each chunk: chapter path, module folder, section title, and chunk text.
- Embed chunks with Cohere `embed-english-v3.0`.
- Upsert embeddings into the existing Qdrant collection `humanoid-textbook-content` using cosine distance.
- Print a summary of files processed, chunks produced, and records written.

## Phase 3: FastAPI App (`main.py`)
- Create a FastAPI app with lifespan startup that initializes shared clients.
- Add CORS and static file hosting for the Docusaurus build at `/`.
- Define a `@function_tool search_book(query)` that embeds the query with Cohere and searches Qdrant.
- Create an agent with a textbook-only system prompt and `gpt-4o-mini` for answer generation.
- Expose `POST /api/chat` to accept `{ message, context? }`, retrieve relevant chunks, and stream SSE answers.
- Expose `POST /api/ingest` to run ingestion without restarting the server.
- Expose `GET /api/health` to verify Qdrant and LLM connectivity.

## Phase 4: Retrieval Behavior
- Support selected-text context by folding `context` into the retrieval query and agent prompt.
- Keep answers grounded in the textbook and require the assistant to say when the book does not support a claim.
- Return citations or source references tied to chapter and section metadata.

## Phase 5: Verification
- Ingest all 8 MDX chapter files successfully.
- Start the server on port 8000 and confirm the static Docusaurus build is served from the same FastAPI process.
- Verify chat queries return grounded answers and selected-text context narrows retrieval.
- Verify the ingest endpoint re-runs ingestion without a server restart.
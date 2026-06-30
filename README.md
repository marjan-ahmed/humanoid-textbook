# Humanoid Textbook

Physical AI and Humanoid Robotics textbook project built around a Docusaurus frontend and a FastAPI RAG backend.

## Project Status

- Frontend: `book_content/` Docusaurus site with textbook content and ChatKit UI.
- Backend: `backend/` FastAPI service with Qdrant retrieval, Cohere embeddings, and Gemini/OpenAI-compatible chat responses.
- Active integration branch: `003-chatkit-integration`.
- Live backend: `https://humanoid-textbook-roan.vercel.app`
- Current backend health endpoint: `https://humanoid-textbook-roan.vercel.app/health`

## Repository Layout

- `book_content/`: Docusaurus textbook site and frontend chat integration.
- `backend/`: FastAPI backend, `pyproject.toml`, `uv.lock`, and deployment configs.
- `specs/`: Specify feature specs, plans, tasks, and contracts.
- `.specify/`: constitution, templates, and workflow helpers.
- `history/`: prompt history and architecture records.
- `hackathon_requirements/`: source hackathon brief and extracted material.

## Frontend and Backend

The frontend chat widget lives in `book_content/src/components/ChatAssistant/`.
The backend ChatKit endpoint is `/chatkit`.

For separate live deployments, configure the frontend with:

- `DOCUSAURUS_CHATKIT_API_URL=https://humanoid-textbook-roan.vercel.app/chatkit`

The backend currently allows cross-origin requests, so the frontend can call the backend from a different domain.

## Backend Runtime

Backend stack:

- FastAPI
- `uv` for dependency management
- Qdrant for vector retrieval
- Cohere for embeddings
- Gemini via OpenAI-compatible base URL for responses
- OpenAI ChatKit for the embedded chat UI protocol

Key backend endpoints:

- `/health`
- `/api/health`
- `/api/chat`
- `/chatkit`
- `/api/ingest`

## Local Development

Frontend:

```bash
cd book_content
npm install
npm run start
```

Backend:

```bash
cd backend
uv sync
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

## Required Backend Environment Variables

- `COHERE_API_KEY`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `GROQ_API_KEY`
- `BASE_URL`
- `GROQ_MODEL`

Groq values:

- `BASE_URL=https://api.groq.com/openai/v1`
- `GROQ_MODEL=llama-3.3-70b-versatile`

## Deployment Notes

- Render / Railway root directory for the backend should be `backend`.
- Vercel backend config exists in `backend/vercel.json` and `backend/pyproject.toml`.
- The backend uses Groq for chat inference (free tier, no daily quota limits).
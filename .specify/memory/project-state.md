# Project State Memory

## Snapshot Date

- Date: 2026-06-30
- Active branch: `003-chatkit-integration`

## Current Architecture

- Frontend: Docusaurus site in `book_content/`
- Backend: FastAPI RAG service in `backend/`
- Retrieval: Qdrant
- Embeddings: Cohere
- Chat/UI protocol: OpenAI ChatKit
- Response model path: Gemini via OpenAI-compatible base URL

## Live Deployment State

- Live backend URL: `https://humanoid-textbook-roan.vercel.app`
- Health endpoint: `https://humanoid-textbook-roan.vercel.app/health`
- Backend is deployed and reachable.
- Qdrant and Cohere are healthy.
- Gemini currently fails due to Google quota exhaustion (`429 RESOURCE_EXHAUSTED`).

## Frontend-to-Backend Wiring

- Production frontend should use:
  `DOCUSAURUS_CHATKIT_API_URL=https://humanoid-textbook-roan.vercel.app/chatkit`
- Chat widget code is in:
  `book_content/src/components/ChatAssistant/index.tsx`
- Docusaurus config now exposes `chatkitApiUrl` through `customFields`.

## Deployment Conventions

- Backend project root for Render / Railway / similar platforms: `backend`
- Vercel backend files:
  - `backend/vercel.json`
  - `backend/pyproject.toml` with `tool.vercel.entrypoint = "main:app"`
- Backend Python is pinned to `3.12` in `backend/pyproject.toml`.

## Known Open Work

- Push or deploy the frontend changes that consume `DOCUSAURUS_CHATKIT_API_URL`.
- Fix Gemini quota in the Google project used by `GEMINI_API_KEY`.
- Review uncommitted textbook content edits in `book_content/docs/` before any broad push.

## Important Endpoints

- `/health`
- `/api/health`
- `/api/chat`
- `/chatkit`
- `/api/ingest`
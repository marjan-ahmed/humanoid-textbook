<p align="center">
  <img src="book_content/static/img/logo.svg" alt="Physical AI Textbook logo" width="96" />
</p>

# Humanoid Textbook

Physical AI and Humanoid Robotics textbook with a Docusaurus learning site, Better Auth personalization, and a retrieval-grounded ChatKit assistant.

The project is built as a simulation-first robotics course: MDX textbook chapters cover embodied AI foundations, ROS 2, digital twins, NVIDIA Isaac, Vision-Language-Action systems, humanoid development, and an autonomous humanoid capstone.

[Open the textbook](https://marjan-ahmed.github.io/humanoid-textbook/) | [Auth server](https://humanoid-textbook.up.railway.app) | [ChatKit backend](https://humanoid-textbook-zeta.vercel.app)

## Features

- Docusaurus 3 textbook site with React 19 and TypeScript.
- OpenAI ChatKit assistant grounded in the textbook corpus.
- FastAPI RAG backend with Qdrant retrieval and Cohere embeddings.
- Better Auth sign-in/sign-up with Neon Postgres persistence.
- Reading progress, bookmarks, personal notes, and preferences.
- Pre-made Urdu and Roman Urdu translations for all textbook chapters.
- GitHub Pages, Railway, and Vercel deployment configuration.

## Architecture

```text
book_content/   Docusaurus site, MDX chapters, React UI, ChatKit widget
auth-server/    Better Auth Express API, Neon-backed user data, translations
backend/        FastAPI ChatKit/RAG service, Qdrant ingestion, health checks
specs/          Product specs, implementation plans, tasks, and contracts
history/        Prompt and planning history
```

The frontend calls:

- `auth-server` for authentication and personalization APIs.
- `backend` for `/chatkit`, `/api/chat`, `/api/ingest`, and health checks.

> [!NOTE]
> The auth token is stored in `localStorage` and sent as a Bearer token. Personalization data itself is stored in Neon, not in browser storage.

## Quick Start

### Frontend

```bash
cd book_content
npm install
npm run start
```

The local Docusaurus server runs on `http://localhost:3000`.

### Auth Server

```bash
cd auth-server
npm install
cp .env.example .env
npm run dev
```

Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` before using real auth flows.

### RAG Backend

```bash
cd backend
uv sync
cp .env.example .env
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

Configure Cohere, Qdrant, and OpenAI-compatible chat model credentials before starting the backend.

## Common Commands

| Area | Command | Purpose |
| --- | --- | --- |
| Frontend | `cd book_content && npm run start` | Start Docusaurus locally |
| Frontend | `cd book_content && npm run build` | Build the production site |
| Frontend | `cd book_content && npm run typecheck` | Run TypeScript checks |
| Auth | `cd auth-server && npm run dev` | Start Express with `tsx watch` |
| Auth | `cd auth-server && npm run build` | Compile the TypeScript server |
| Auth | `cd auth-server && npm run migrate` | Run Better Auth migration hook |
| Backend | `cd backend && uv run uvicorn main:app --host 0.0.0.0 --port 8000` | Start FastAPI locally |
| Backend | `cd backend && uv run python ingest.py` | Ingest MDX content into Qdrant |

## Environment

### Frontend

- `DOCUSAURUS_SITE_URL`
- `DOCUSAURUS_BASE_URL`
- `DOCUSAURUS_CHATKIT_API_URL`
- `DOCUSAURUS_CHATKIT_DOMAIN_KEY`

### Auth Server

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `PORT`

### RAG Backend

- `COHERE_API_KEY`
- `COHERE_EMBED_MODEL`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `QDRANT_COLLECTION`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `BASE_URL`
- `BETTER_AUTH_URL`
- `BACKEND_PORT`

For Groq-backed chat completions, use:

```env
BASE_URL=https://api.groq.com/openai/v1
GEMINI_MODEL=llama-3.3-70b-versatile
```

## Deployment

- GitHub Pages builds `book_content/` from `main` via `.github/workflows/deploy.yml`.
- Railway deploys the Better Auth server from `auth-server/`.
- Vercel deploys the FastAPI backend from `backend/`.

The Docusaurus config defaults to:

```env
DOCUSAURUS_SITE_URL=https://marjan-ahmed.github.io
DOCUSAURUS_BASE_URL=/humanoid-textbook/
DOCUSAURUS_CHATKIT_API_URL=https://humanoid-textbook-zeta.vercel.app/chatkit
```

## Content and Translations

Textbook chapters live in `book_content/docs/` and are organized by `book_content/sidebars.ts`.

Translations are committed in two places:

- `book_content/translations/` for the Docusaurus project.
- `auth-server/translations/` for Railway runtime access.

When adding or updating translated chapters, keep both directories synchronized.

## Health Checks

After deploying or running services locally:

```bash
curl http://localhost:8000/health
curl http://localhost:3001/health
```

Production URLs:

```text
https://humanoid-textbook-zeta.vercel.app/health
https://humanoid-textbook.up.railway.app/health
```

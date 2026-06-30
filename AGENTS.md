# Repository Guidelines

## Project Overview

Humanoid Textbook is a Docusaurus-based Physical AI and Humanoid Robotics textbook with three runtime surfaces:

- `book_content/`: Docusaurus 3 site built with React and TypeScript.
- `auth-server/`: Better Auth + Express API backed by Neon Postgres, deployed on Railway.
- `backend/`: FastAPI RAG and ChatKit backend using Qdrant, Cohere embeddings, and an OpenAI-compatible chat model endpoint, deployed on Vercel.

The public site is hosted from `main` on GitHub Pages at `https://marjan-ahmed.github.io/humanoid-textbook/`.

## Repository Structure

```text
book_content/
  docs/                 # MDX textbook chapters and categories
  src/components/
    Auth/               # AuthContext and frontend auth state integration
    ChatAssistant/      # OpenAI ChatKit UI integration
    Personalization/    # Toolbar, translate, progress, bookmark, and notes UI
  src/lib/
    api.ts              # Authenticated API client
    auth-store.ts       # Module-level auth state and getAuthServer()
  src/pages/            # Homepage, sign-in, sign-up, and auth styles
  static/img/           # Logo, favicon, and social image
  translations/         # Pre-made Urdu and Roman Urdu chapter translations

auth-server/
  auth.ts               # Better Auth config, JWT plugin, Neon connection
  index.ts              # Express server, CORS, auth handler, API routes
  routes/               # Translation, progress, bookmarks, notes, preferences
  translations/         # Bundled translation files for Railway deployment
  db/migrate.ts         # Custom table migration script

backend/
  main.py               # FastAPI app, ChatKit endpoint, RAG agent, health checks
  ingest.py             # MDX ingestion into Qdrant
  pyproject.toml        # Python 3.12 project managed by uv
  vercel.json           # Vercel function config

specs/                  # Feature specs, plans, tasks, contracts, and checklists
history/                # Prompt and planning history
hackathon_requirements/ # Source hackathon material
```

## Setup Commands

Use Node.js 20+ for Docusaurus and Node.js 22 in CI. Use Python 3.12 with `uv` for the FastAPI backend.

### Frontend

```bash
cd book_content
npm install
npm run start
```

Production build and local serve:

```bash
cd book_content
npm run build
npm run serve
```

TypeScript check:

```bash
cd book_content
npm run typecheck
```

### Auth Server

```bash
cd auth-server
npm install
npm run dev
```

Production build and start:

```bash
cd auth-server
npm run build
npm start
```

Custom migration command:

```bash
cd auth-server
npm run migrate
```

### RAG Backend

```bash
cd backend
uv sync
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

Ingest textbook content into Qdrant:

```bash
cd backend
uv run python ingest.py
```

## Environment Variables

### Docusaurus

- `DOCUSAURUS_SITE_URL`: defaults to `https://marjan-ahmed.github.io`.
- `DOCUSAURUS_BASE_URL`: defaults to `/humanoid-textbook/`.
- `DOCUSAURUS_CHATKIT_API_URL`: defaults to `https://humanoid-textbook-zeta.vercel.app/chatkit`.
- `DOCUSAURUS_CHATKIT_DOMAIN_KEY`: ChatKit domain key for the deployed site.

### Auth Server

- `DATABASE_URL`: Neon Postgres connection string.
- `BETTER_AUTH_SECRET`: Better Auth signing secret.
- `BETTER_AUTH_URL`: local `http://localhost:3001`, production `https://humanoid-textbook.up.railway.app`.
- `PORT`: local default is `3000` from code unless provided; Railway injects its own port.

### RAG Backend

- `COHERE_API_KEY`: embedding API key.
- `COHERE_EMBED_MODEL`: defaults to `embed-english-v3.0`.
- `QDRANT_URL`: Qdrant endpoint.
- `QDRANT_API_KEY`: Qdrant API key.
- `QDRANT_COLLECTION`: defaults to `humanoid-textbook-content`.
- `GEMINI_API_KEY`: chat model API key; currently used with Groq-compatible naming.
- `GEMINI_MODEL`: defaults to `llama-3.3-70b-versatile`.
- `BASE_URL`: OpenAI-compatible chat completions base URL, currently `https://api.groq.com/openai/v1`.
- `BETTER_AUTH_URL`: used by the backend to fetch Better Auth JWKS for JWT verification.
- `BACKEND_PORT`: local fallback port, defaults to `8000`.

Never commit real `.env` files or secrets.

## Auth Architecture

- Sign-in and sign-up happen in `book_content/src/pages/signin.tsx` and `book_content/src/pages/signup.tsx`.
- Frontend auth server resolution must go through `getAuthServer()` in `book_content/src/lib/auth-store.ts` or `book_content/src/lib/api.ts`; do not hardcode auth URLs in components.
- Better Auth returns a token that the frontend stores under `better-auth.token`.
- API calls use `Authorization: Bearer <token>`.
- `auth-server/index.ts` defines a custom `/api/auth/session` endpoint because Better Auth's default session helper is cookie-oriented and cross-origin cookies are not reliable for this setup.
- `auth-server/routes/middleware.ts` validates Bearer tokens by querying Neon directly.
- `backend/main.py` verifies Better Auth JWTs with JWKS from `${BETTER_AUTH_URL}/api/auth/jwks`.

## Personalization and Translation

- Reading progress, bookmarks, notes, and preferences belong in Neon through the auth server routes.
- Do not store personalization records in `localStorage`.
- The auth token is intentionally stored in `localStorage`.
- `ChatAssistant` stores UI-only thread/open state in `localStorage`; keep that separate from personalization data.
- Urdu and Roman Urdu translations are pre-generated in both `book_content/translations/` and `auth-server/translations/`.
- Keep the auth-server translation bundle in sync because Railway does not have access to a sibling `book_content/` directory.

## RAG and ChatKit Notes

- `backend/ingest.py` chunks MDX files by `##` sections and writes section payloads to Qdrant.
- `backend/main.py` requires the textbook assistant to call `search_book` before answering.
- ChatKit uses `/chatkit`; the older streaming endpoint `/api/chat` remains available.
- The assistant should answer only from retrieved textbook content and cite Docusaurus slugs as Markdown links.
- Thread usage is capped at 12 assistant answers in memory.

## Testing and Verification

There is no single root test command. Run checks in the package you changed:

- Frontend type check: `cd book_content && npm run typecheck`.
- Frontend production build: `cd book_content && npm run build`.
- Auth server type check/build: `cd auth-server && npm run build`.
- Backend health smoke test after starting locally: `GET http://localhost:8000/health`.
- Auth server health smoke test after starting locally: `GET http://localhost:3001/health` when using `.env.example`; the code falls back to `3000` if `PORT` is unset.

When changing MDX docs, sidebars, Docusaurus config, or shared components, run the frontend build. When changing auth routes or Better Auth config, run the auth server build. When changing backend ingestion or retrieval, run the backend locally and verify `/health`; run ingestion only when Qdrant credentials are configured and the collection state is understood.

## Coding Style

- Frontend code is React + TypeScript.
- Auth server code is TypeScript ESM.
- Backend code is Python 3.12.
- Use CSS Modules for component-specific styles and `book_content/src/css/custom.css` for site-wide theme rules.
- React components use PascalCase; files in `Personalization/` and `Auth/` follow the existing component naming.
- Prefer existing helpers and patterns over introducing new abstractions.
- Keep Docusaurus URLs base-path aware; deployed pages live under `/humanoid-textbook/`.
- Avoid unrelated refactors, lockfile churn, or generated output unless required by the change.

## Deployment

- GitHub Pages deploys `book_content/build` from `main` through `.github/workflows/deploy.yml`.
- Railway deploys `auth-server/` from `main`.
- Vercel deploys `backend/` using `backend/vercel.json`.

Live services:

- Site: `https://marjan-ahmed.github.io/humanoid-textbook/`
- Auth server: `https://humanoid-textbook.up.railway.app`
- ChatKit/RAG backend: `https://humanoid-textbook-zeta.vercel.app`

## Commit Guidelines

- Use clear imperative subjects, for example `Fix auth session lookup`.
- Keep commits scoped to the package or feature being changed.
- Before pushing to `main`, run the relevant package checks listed above.

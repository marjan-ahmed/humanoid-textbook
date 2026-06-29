# ChatKit Integration Design

**Date**: 2026-06-30  
**Status**: Proposed  
**Scope**: Add a floating ChatKit assistant to the Docusaurus frontend and a ChatKit-compatible backend endpoint backed by the existing Qdrant textbook retrieval flow.

## Goal

Integrate OpenAI ChatKit into the textbook frontend in a functioning condition while keeping answers grounded in the textbook corpus stored in Qdrant. The assistant UI should appear as a floating popup on top of the existing Docusaurus site and should match the project's premium robotics-oriented presentation rather than a default chat widget.

## Non-Goals

- Replacing the entire backend with a separate chat service
- Removing `POST /api/chat` during the first integration pass
- Reworking ingestion away from Qdrant
- Building authentication, multi-user persistence, or database-backed thread storage
- Broad site redesign unrelated to the chat assistant

## Recommended Approach

Use a parallel integration path:

1. Keep the existing FastAPI server as the single backend entry point.
2. Add a ChatKit endpoint at `/chatkit` instead of replacing `/api/chat` immediately.
3. Reuse the existing Qdrant retrieval logic for grounding.
4. Replace the current OpenAI chat model path with a Gemini-backed OpenAI Agents SDK-compatible model configuration for the ChatKit flow.
5. Add a branded floating popup ChatKit client into the Docusaurus frontend.

This approach minimizes migration risk, preserves the current backend surface during rollout, and allows the new assistant to be validated without breaking the existing RAG API.

## Architecture

### Frontend

- Docusaurus remains the primary frontend in `book_content/`.
- A client-only React wrapper mounts ChatKit on every textbook page.
- The assistant appears as a floating action button in the bottom-right corner.
- Clicking the button opens a popup panel containing the ChatKit UI.
- The popup persists thread state in local storage so refreshes keep the conversation.

### Backend

- FastAPI in `backend/main.py` remains the main application.
- Add a ChatKit server implementation mounted at `POST /chatkit`.
- Keep `POST /api/ingest` and `GET /api/health`.
- Keep `POST /api/chat` during transition unless it becomes redundant after verification.
- Use an in-memory ChatKit store first because it is sufficient for local development and hackathon evaluation.

### Agent Runtime

- Use the OpenAI Agents SDK for agent orchestration.
- Configure Gemini through the OpenAI-compatible endpoint provided by the user credentials.
- The retrieval tool remains responsible for searching Qdrant and returning formatted textbook passages.
- Agent instructions require grounded answers and explicit citation of chapter and section names.

## Model and Provider Strategy

The backend should use the user's Gemini credentials:

- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-3.5-flash`
- `BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/`

Preferred implementation path:

- Use `AsyncOpenAI` plus `OpenAIChatCompletionsModel` with the provided `BASE_URL`.
- Keep the agent defined with the OpenAI Agents SDK so the rest of the orchestration remains consistent.

Reasoning:

- This matches the user's reference implementation directly.
- It avoids introducing LiteLLM unless ChatKit streaming forces that path.
- If ChatKit event streaming requires the LiteLLM integration path for compatibility, switch to the ChatKit expert's recommended LiteLLM model wrapper and apply the documented assistant message ID remapping fix.

## Components

### 1. Retrieval Layer Reuse

Existing backend functions should be preserved where possible:

- environment loading
- Qdrant client creation
- embedding query generation
- Qdrant search
- retrieval context formatting

Required changes:

- The current backend uses Cohere embeddings. If the collection is already populated with Cohere vectors, retrieval can continue unchanged for this phase as long as query embeddings remain generated with the same model.
- Chat generation should be decoupled from embedding generation so Gemini handles answers while Cohere can still handle retrieval embeddings.

This separation is the lowest-risk path because it does not require immediate re-ingestion of the vector store.

### 2. ChatKit Store

Implement an in-memory store that satisfies all required ChatKit `Store` abstract methods, including attachment methods. This store is acceptable for the current scope because the main goal is working local functionality and hackathon demo readiness rather than durable multi-user state.

### 3. ChatKit Server

Implement a ChatKit server subclass that:

- loads the current thread
- converts thread items into agent input using `ThreadItemConverter`
- runs the agent with full history
- streams assistant events back to the frontend
- remaps assistant message IDs if the provider path can generate collisions

### 4. Docusaurus Chat Wrapper

Add a frontend wrapper component that:

- initializes `useChatKit`
- points to `http://localhost:8000/chatkit` for local development
- includes `domainKey: "localhost"`
- defines project-specific greeting and starter prompts
- stores `threadId` in local storage
- renders a floating trigger button and popup panel

### 5. Styling Layer

The popup should match the textbook visual direction:

- technical, premium, restrained
- no generic neon gradient blob treatment
- dark steel / graphite / warm metal palette compatible with the current site
- typography and spacing aligned with the existing frontend rather than a standalone app shell

The popup should feel like an integrated course assistant, not an embedded third-party widget.

## Data Flow

### Chat Request Flow

1. User opens the floating popup in Docusaurus.
2. ChatKit sends the message payload to `POST /chatkit`.
3. The ChatKit server loads thread history from the in-memory store.
4. `ThreadItemConverter` transforms prior thread items plus the new input into agent input.
5. The agent invokes the textbook retrieval tool.
6. The retrieval tool embeds the query using the existing embedding provider and searches Qdrant.
7. Matching textbook chunks are returned to the agent as grounded context.
8. Gemini generates the answer through the OpenAI-compatible endpoint.
9. ChatKit streams the response back into the popup.
10. Thread state is updated in the store and the thread id is persisted in browser local storage.

### Health and Debug Flow

- `GET /api/health` should continue to report retrieval dependencies.
- Add `GET /debug/threads` to inspect thread storage and verify messages are not being overwritten.

## Error Handling

### Backend

- Return clear startup errors when `GEMINI_API_KEY`, `GEMINI_MODEL`, or `BASE_URL` are missing.
- Preserve explicit Qdrant and embedding-provider health checks.
- If the agent cannot retrieve relevant textbook context, it should say the answer is not present in the textbook instead of hallucinating.
- If ChatKit request parsing fails, return standard FastAPI error responses and log the failure.

### Frontend

- If the ChatKit script is missing or fails to initialize, the popup should fail visibly in development through console errors rather than silently rendering nothing.
- If the backend is unavailable, the widget should still open but surface the request failure through ChatKit's error handling.
- On small screens, the popup should resize to fit within the viewport and remain dismissible.

## Testing and Validation

### Backend Validation

- FastAPI starts successfully with the Gemini environment variables.
- `POST /chatkit` accepts requests and streams responses.
- `GET /debug/threads` shows messages accumulating without overwrite.
- Retrieval answers cite chapter and section names from the textbook.
- `GET /api/health` remains functional.

### Frontend Validation

- The floating action button appears across textbook pages.
- The popup opens and closes reliably.
- The ChatKit UI renders instead of a blank panel.
- A thread persists after page refresh.
- The popup remains usable on desktop and mobile widths.

### End-to-End Validation

- Ask a question clearly answered by the book and confirm the reply is grounded in retrieved content.
- Ask a question outside the book and confirm the agent states the limitation.
- Ask a follow-up question and confirm thread history is retained.

## Implementation Plan

### Phase 1

- Add ChatKit dependencies to the backend and frontend
- Implement in-memory ChatKit store
- Implement Gemini-backed agent configuration
- Add `/chatkit` endpoint and thread debug endpoint

### Phase 2

- Add Docusaurus ChatKit popup wrapper
- Add local thread persistence
- Brand the popup to fit the project

### Phase 3

- Run local verification
- Keep `/api/chat` in place until ChatKit is confirmed stable
- Decide afterward whether to retire or keep the legacy endpoint

## Risks and Mitigations

### Risk: ChatKit Python API mismatch

Mitigation:

- Follow the installed ChatKit expert guidance exactly for imports and store methods.

### Risk: Gemini provider incompatibility with ChatKit streaming

Mitigation:

- Start with the user's OpenAI-compatible Gemini configuration.
- If ChatKit event streaming requires a different provider adapter, move to the LiteLLM path and apply message ID remapping.

### Risk: Retrieval breaks if embedding model changes

Mitigation:

- Keep the current embedding provider for query embeddings unless the vector collection is re-ingested.

### Risk: Docusaurus client-only rendering issues

Mitigation:

- Mount ChatKit in a browser-only component and avoid SSR-dependent access to `window` or `localStorage`.

## Acceptance Criteria

- A floating popup assistant is visible on the textbook frontend.
- The popup streams Gemini-generated answers through ChatKit.
- Answers remain grounded in Qdrant textbook retrieval.
- Conversation history persists through ChatKit thread storage and browser local storage.
- Existing backend ingestion and health endpoints continue to function.

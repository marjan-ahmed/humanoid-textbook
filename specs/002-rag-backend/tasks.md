# Tasks: RAG Backend for Physical AI Textbook

**Input**: Design documents from `/specs/002-rag-backend/`
**Prerequisites**: plan.md, spec.md

**Tests**: Validation is required through the commands in the acceptance criteria and quick manual checks.

**Organization**: Tasks are grouped by story so the backend can be implemented and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete work
- **[Story]**: Maps to a user story from spec.md
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the backend project skeleton and environment wiring.

- [ ] T001 Create `backend/` and initialize the project with `uv init`
- [ ] T002 Add backend dependencies and scripts in `backend/pyproject.toml`
- [ ] T003 [P] Add backend environment example file in `backend/.env.example`
- [ ] T004 [P] Add backend ignore rules for caches, env files, and static output in `backend/.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Set up shared clients, configuration, and serving structure before any story work.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T005 Create shared environment loading and config helpers in `backend/main.py` or a small flat helper section inside the same file
- [ ] T006 Create the Docusaurus static mount path and backend `static/` directory layout in `backend/main.py`
- [ ] T007 Add shared Qdrant collection configuration for `humanoid-textbook-content`
- [ ] T008 Add Cohere embedding configuration for `embed-english-v3.0`
- [ ] T009 Add reusable MDX text preprocessing helpers for frontmatter stripping and section splitting in `backend/ingest.py`

**Checkpoint**: Backend runtime, config, and content preprocessing are ready.

---

## Phase 3: User Story 1 - Ask Questions About the Textbook (Priority: P1) MVP

**Goal**: A reader can ask a textbook question and receive a grounded streamed answer.

**Independent Test**: Call `POST /api/chat` with a question and verify the response is streamed, grounded in book content, and cites chapter/section context.

### Implementation for User Story 1

- [ ] T010 [US1] Implement `search_book(query: str)` as an OpenAI Agents `@function_tool` in `backend/main.py`
- [ ] T011 [US1] Create the agent setup and textbook-only system prompt in `backend/main.py`
- [ ] T012 [US1] Implement `POST /api/chat` with `{ message, context? }` handling and SSE streaming in `backend/main.py`
- [ ] T013 [US1] Add response grounding logic so answers cite retrieved textbook chunks in `backend/main.py`
- [ ] T014 [US1] Add `GET /api/health` checks for Qdrant and AI connectivity in `backend/main.py`

**Checkpoint**: Textbook Q&A works independently.

---

## Phase 4: User Story 2 - Select Text and Scope the Answer (Priority: P2)

**Goal**: A reader can highlight text and have that selection narrow the answer scope.

**Independent Test**: Send `context` with `POST /api/chat` and confirm the returned answer stays aligned to the highlighted passage.

### Implementation for User Story 2

- [ ] T015 [US2] Add context-aware query shaping so selected text influences retrieval in `backend/main.py`
- [ ] T016 [US2] Pass selected-text context into the agent prompt and retrieval results in `backend/main.py`
- [ ] T017 [US2] Confirm the scoped-answer fallback explains when the selection is too narrow or unsupported in `backend/main.py`

**Checkpoint**: Selected-text Q&A works independently.

---

## Phase 5: User Story 3 - Re-ingest Content Reliably (Priority: P2)

**Goal**: A developer can refresh the vector index from the textbook sources without restarting the server.

**Independent Test**: Run the ingestion script directly and via `POST /api/ingest`, then verify the Qdrant collection receives updated records.

### Implementation for User Story 3

- [ ] T018 [US3] Implement recursive MDX discovery for `book_content/docs/**/*.mdx` in `backend/ingest.py`
- [ ] T019 [US3] Implement chunk extraction by `##` headings and metadata creation in `backend/ingest.py`
- [ ] T020 [US3] Implement Cohere embedding calls for each chunk in `backend/ingest.py`
- [ ] T021 [US3] Implement Qdrant upsert into `humanoid-textbook-content` in `backend/ingest.py`
- [ ] T022 [US3] Implement `POST /api/ingest` to invoke ingestion without server restart in `backend/main.py`
- [ ] T023 [US3] Add command-line entry behavior so `uv run python ingest.py` performs a full ingest in `backend/ingest.py`

**Checkpoint**: Ingestion refresh works independently.

---

## Phase 6: User Story 4 - Serve the Book and Backend Together (Priority: P3)

**Goal**: A deployer can run one backend server that serves both the API and the built textbook site.

**Independent Test**: Start the server on port 8000 and verify the Docusaurus build is available at `/`.

### Implementation for User Story 4

- [ ] T024 [US4] Mount the static Docusaurus build output from `backend/static/` in `backend/main.py`
- [ ] T025 [US4] Ensure the server starts on port 8000 and serves the static site root correctly in `backend/main.py`
- [ ] T026 [US4] Add startup validation that the static build directory exists and is ready to serve in `backend/main.py`

**Checkpoint**: Single-process serving works independently.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all backend behavior.

- [ ] T027 Run `uv run python ingest.py` and verify all 8 chapter files are indexed
- [ ] T028 Run `uv run uvicorn main:app --port 8000` and verify API plus static serving
- [ ] T029 Test grounded chat responses with chapter citations and selected-text context
- [ ] T030 Test `POST /api/ingest` re-indexing without restart
- [ ] T031 Verify error handling for missing env vars, empty collections, and empty retrieval results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phases 3-6)**: Depend on Foundational completion.
- **Polish (Phase 7)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 Ask Questions**: First MVP story after foundation.
- **US2 Selected Text Scope**: Depends on the retrieval path from US1.
- **US3 Re-ingest Content**: Can proceed after preprocessing helpers exist and is independent of chat UI concerns.
- **US4 Serve Book and Backend Together**: Depends on the build-serving path established in the backend app.

### Parallel Opportunities

- T003 and T004 can run in parallel.
- T015 through T017 can run in parallel after the chat retrieval path exists.
- T018 through T021 can run in parallel once the preprocessing shape is fixed.
- T027 through T031 are validation tasks and can be run as a final sweep.

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for the basic grounded chat endpoint.
3. Stop and validate that a question can be answered with citations from the textbook.

### Incremental Delivery

1. Foundation: backend project, config, embeddings, static serving structure.
2. US1: question answering.
3. US2: selected-text scoping.
4. US3: ingestion and reindexing.
5. US4: serve the static Docusaurus build from the same server.
6. Polish: verify end-to-end behavior and edge cases.

### Suggested MVP Scope

The smallest usable backend milestone is Phases 1-3: project setup, shared foundation, and question answering. The recommended complete first backend milestone is Phases 1-4 so the chatbot is grounded and context-aware before deployment work begins.
---
id: 002-rag-backend-plan-iteration
title: Rewrite backend RAG plan with Cohere and Qdrant Cloud
stage: plan
date: 2026-06-29
surface: /sp.plan
model: GPT-5
feature: 002-rag-backend
branch: 002-rag-backend
user: user
command: /sp.plan
labels: [spec, plan, rag, backend]
links:
  spec: specs/002-rag-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-rag-backend/spec.md
  - specs/002-rag-backend/plan.md
  - specs/002-rag-backend/tasks.md
tests:
  - n/a
---

## Prompt

Rewrite the backend plan and move to /sp.tasks.

## Response snapshot

Rewrote the backend plan to use Cohere embed-english-v3.0 with Qdrant Cloud collection humanoid-textbook-content, removed the frontend chat widget from scope, and generated a backend-only task breakdown for FastAPI ingestion, retrieval, static serving, and selected-text context.

## Outcome

- ? Impact: Backend scope is now aligned to the user's exact embeddings and vector store choices.
- ?? Tests: Spec/planning validation only; no runtime execution requested in this step.
- ?? Files: Updated specs/002-rag-backend/plan.md and specs/002-rag-backend/tasks.md.
- ?? Next prompts: /sp.tasks implementation planning can now proceed from the rewritten backend plan.
- ?? Reflection: Keeping the backend plan backend-only avoids dragging frontend integration into this iteration.

## Evaluation notes (flywheel)

- Failure modes observed: Initial plan incorrectly included a frontend chat component and OpenAI embeddings; corrected to Cohere + Qdrant Cloud.
- Graders run and results (PASS/FAIL): PASS for spec alignment, PASS for scope narrowing.
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): Start implementation by wiring env/config, then the ingest pipeline.
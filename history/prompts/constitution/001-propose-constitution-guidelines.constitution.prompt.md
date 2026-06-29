---
id: 001
title: Propose Constitution Guidelines
stage: constitution
date: 2026-06-29
surface: agent
model: GPT-5
feature: none
branch: main
user: user
command: /sp.constitution proposal
labels: ["constitution", "hackathon", "guidelines"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/constitution/001-propose-constitution-guidelines.constitution.prompt.md
tests:
  - Read .codex/prompts/sp.constitution.md
  - Read .specify/memory/constitution.md
  - Extracted local hackathon requirements PDF with PyPDF2
  - Read plan, spec, and tasks templates for alignment
---

## Prompt

use /sp.constituition from .specify dir and analyze and understand hakcathon requirements doc afterwards, propose a detailed guideline for the consitituition

## Response snapshot

Analyzed the local /sp.constitution workflow, current placeholder constitution, Specify templates, and hackathon requirements PDF. Proposed a detailed constitution guideline for a Docusaurus AI-native textbook with RAG chatbot, OpenAI Agents/ChatKit, FastAPI, Neon, Qdrant, optional Better Auth, personalization, Urdu translation, and robotics course content.

## Outcome

- Impact: Produced a constitution proposal without overwriting the current template.
- Tests: Local file and PDF inspection completed.
- Files: Created this PHR only.
- Next prompts: User can approve applying the proposal to .specify/memory/constitution.md.
- Reflection: The request used "propose", so the constitution was not modified.

## Evaluation notes (flywheel)

- Failure modes observed: None after PDF extraction rerun with UTF-8 output.
- Graders run and results (PASS/FAIL): Manual inspection PASS.
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Apply approved guidelines as constitution v1.0.0.

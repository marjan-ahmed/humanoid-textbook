---
id: 001
title: Add Agents Guide
stage: general
date: 2026-06-29
surface: agent
model: GPT-5
feature: none
branch: main
user: user
command: Generate AGENTS.md contributor guide
labels: ["documentation", "contributor-guide"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - AGENTS.md
tests:
  - Verified AGENTS.md exists and is 377 words
---

## Prompt

Generate a file named AGENTS.md that serves as a contributor guide for this repository.
Before writing, check whether AGENTS.md already exists in the current working directory. If it does, do not overwrite or modify it.
Your goal is to produce a clear, concise, and well-structured document with descriptive headings and actionable explanations for each section.
Follow the outline below, but adapt as needed — add sections if relevant, and omit those that do not apply to this project.

Document Requirements

- Title the document "Repository Guidelines".
- Use Markdown headings (#, ##, etc.) for structure.
- Keep the document concise. 200-400 words is optimal.
- Keep explanations short, direct, and specific to this repository.
- Provide examples where helpful (commands, directory paths, naming patterns).
- Maintain a professional, instructional tone.

Recommended Sections

Project Structure & Module Organization

- Outline the project structure, including where the source code, tests, and assets are located.

Build, Test, and Development Commands

- List key commands for building, testing, and running locally (e.g., npm test, make build).
- Briefly explain what each command does.

Coding Style & Naming Conventions

- Specify indentation rules, language-specific style preferences, and naming patterns.
- Include any formatting or linting tools used.

Testing Guidelines

- Identify testing frameworks and coverage requirements.
- State test naming conventions and how to run tests.

Commit & Pull Request Guidelines

- Summarize commit message conventions found in the project’s Git history.
- Outline pull request requirements (descriptions, linked issues, screenshots, etc.).

(Optional) Add other sections if relevant, such as Security & Configuration Tips, Architecture Overview, or Agent-Specific Instructions.

## Response snapshot

Created AGENTS.md at the repository root after confirming it did not already exist. The guide documents the current Specify-style structure, helper scripts, naming conventions, testing expectations, and PR guidance for a repository with no existing commits.

## Outcome

- Impact: Added a concise contributor guide tailored to the current repository.
- Tests: Verified AGENTS.md content and word count.
- Files: Created AGENTS.md and this PHR.
- Next prompts: none
- Reflection: The repository has no implementation stack yet, so the guide avoids inventing build or test commands.

## Evaluation notes (flywheel)

- Failure modes observed: Windows sandbox helper failed; commands were rerun with approval.
- Graders run and results (PASS/FAIL): Manual verification PASS.
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Update commands after a language stack is introduced.

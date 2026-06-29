# Repository Guidelines

## Project Structure & Module Organization

This repository is in an early Specify-driven setup. Keep product requirements and planning artifacts under `specs/<feature>/` when features are added. Use `.specify/` for project templates, helper scripts, and constitution files; do not edit generated templates unless updating the workflow itself. Store prompt history under `history/prompts/` and architecture decisions under `history/adr/`. Current input assets live in `hackathon_requirements/`, including the humanoid robotics textbook PDF.

Expected paths:

- `.specify/memory/constitution.md` - project principles and governance
- `.specify/scripts/bash/` - workflow automation scripts
- `.codex/prompts/` and `.codex/rules/` - local agent prompts and rules
- `hackathon_requirements/` - source requirements and reference material

## Build, Test, and Development Commands

No application runtime or package manager is configured yet. Use the existing Specify helper scripts when shaping work:

- `bash .specify/scripts/bash/check-prerequisites.sh` - validate required workflow files for a feature.
- `bash .specify/scripts/bash/create-new-feature.sh "<feature name>"` - scaffold a new feature area.
- `bash .specify/scripts/bash/setup-plan.sh` - prepare planning artifacts for the active feature.

When a language stack is introduced, add the canonical build, lint, and test commands here and in project documentation.

## Coding Style & Naming Conventions

Prefer small, reviewable changes. Use Markdown for specs, ADRs, plans, and task lists. Name feature directories with short kebab-case slugs, for example `specs/navigation-stack/`. Keep generated or reference assets in clearly named folders; avoid mixing source code with PDFs or prompt history. Follow the style tools of the selected stack once implementation code exists.

## Testing Guidelines

No test framework is present yet. For future code, add tests beside the relevant module or under a top-level `tests/` directory, matching the stack convention. Document every new test command in this file. For specification work, include acceptance criteria in `spec.md` and testable tasks in `tasks.md`.

## Commit & Pull Request Guidelines

This repository has no existing commits, so no historical commit convention is established. Use clear, imperative commit subjects such as `Add navigation stack specification`. Pull requests should include a concise summary, linked issue or feature spec, validation steps, and screenshots or artifacts when user-facing output changes.

## Agent-Specific Instructions

Before modifying files, inspect existing structure and avoid overwriting generated or user-authored content. Keep changes scoped to the requested artifact. If a decision affects architecture, propose an ADR instead of silently encoding the decision.

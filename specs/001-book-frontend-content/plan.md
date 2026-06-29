# Implementation Plan: Book Frontend and Content Foundation

**Branch**: `001-book-frontend-content` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-book-frontend-content/spec.md`

## Summary

Transform the existing Docusaurus starter in `book_content` into the first public iteration of the Physical AI & Humanoid Robotics textbook. The implementation will replace starter branding, homepage, navigation, and introductory documentation with a premium robotics-focused landing experience and a structured textbook foundation. This phase intentionally excludes RAG, authentication, personalization, Urdu translation, backend services, database setup, and deployment automation.

## Technical Context

**Language/Version**: TypeScript 6.0.2, React 19, Node.js >=20.0  
**Primary Dependencies**: Docusaurus 3.10.1, @docusaurus/preset-classic, @docusaurus/faster, MDX 3, Infima, prism-react-renderer  
**Storage**: Static MDX/docs content and static assets only  
**Testing**: `npm run typecheck`, `npm run build`, manual responsive/a11y review in browser  
**Target Platform**: Static Docusaurus site served locally and prepared for GitHub Pages or Vercel later  
**Project Type**: Web documentation/frontend project under `book_content/`  
**Performance Goals**: Fast static page load, no layout shift from hero/modules, no heavy runtime dependency for first iteration  
**Constraints**: Avoid starter Docusaurus identity, teal/gradient-dominant AI-site look, generic buzzword copy, inaccessible motion, and mobile overflow  
**Scale/Scope**: One premium homepage, global theme/config update, sidebar/navigation restructure, intro page, chapter scaffold/content standards

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **AI-Native Textbook First**: PASS. Plan centers the Docusaurus textbook and learning structure.
- **Spec-Driven Delivery**: PASS. Work derives from `spec.md`; implementation tasks will be generated after planning.
- **Deployable Book Platform**: PASS. Keeps Docusaurus as static book platform and validates build readiness.
- **RAG Chatbot Core Feature**: DEFERRED WITH RATIONALE. RAG is a hackathon core feature but explicitly excluded from first iteration by user-selected scope A. Later specs must cover it.
- **Personalization and Accessibility**: PASS. Auth/personalization are deferred; accessibility is a gate for this frontend phase.
- **Robotics Accuracy and Safety**: PASS. Intro and chapter standards must distinguish simulation, hardware, and latency risk.
- **Reusable Intelligence, Skills, and Subagents**: PASS. Planning used brainstorming, UI/UX, frontend design, documentation, font/design-system, and React guidance; `find-skills` remains fallback.

## Project Structure

### Documentation (this feature)

```text
specs/001-book-frontend-content/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── frontend-content-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
book_content/
├── docusaurus.config.ts          # Site identity, metadata, navbar/footer
├── sidebars.ts                   # Course/module sidebar structure
├── docs/
│   ├── intro.mdx                 # Book introduction and learning path
│   ├── foundations/              # Physical AI foundations scaffold
│   ├── ros-2/                    # ROS 2 scaffold
│   ├── simulation/               # Gazebo/Unity scaffold
│   ├── nvidia-isaac/             # Isaac scaffold
│   ├── vla/                      # Vision-Language-Action scaffold
│   ├── humanoids/                # Humanoid systems scaffold
│   └── capstone/                 # Capstone scaffold
├── src/
│   ├── pages/index.tsx           # Premium landing page
│   ├── pages/index.module.css    # Landing page styles
│   ├── css/custom.css            # Global theme tokens and Docusaurus overrides
│   └── components/               # Reusable landing/book components as needed
└── static/img/                   # Purposeful visual assets only
```

**Structure Decision**: Keep a single Docusaurus project in `book_content/`. This preserves the existing local workflow and avoids adding a separate frontend app.

## Phase 0: Research Summary

See [research.md](./research.md). Key decisions:

- Use an editorial robotics design direction rather than generic AI gradients.
- Use Docusaurus-native React/MDX patterns and CSS modules to avoid dependency bloat.
- Treat the landing page as a narrative learning product: hero, course pillars, journey, module preview, capstone, and reading CTA.
- Use Diataxis-inspired content standards for chapter scaffolds.

## Phase 1: Design Summary

See [data-model.md](./data-model.md) and [contracts/frontend-content-contract.md](./contracts/frontend-content-contract.md).

Core design objects are Homepage, Landing Section, Book Module, Chapter, Learning Path, Design System Direction, and SEO Copy Set. There are no API contracts in this iteration because no backend or networked user action is in scope.

## Implementation Strategy

1. Replace site identity and metadata in Docusaurus config.
2. Establish global design tokens and remove default green/teal theme variables.
3. Rebuild homepage as a premium, robotics-specific landing page.
4. Replace starter docs with intro page and course module scaffold.
5. Update sidebar/navigation/footer to match the textbook.
6. Validate typecheck, production build, responsive behavior, keyboard navigation, and reduced-motion behavior.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| RAG omitted in first iteration | User selected scope A: frontend + content foundation only | Including RAG now would mix backend architecture into a frontend/content spec and slow the first visible milestone |

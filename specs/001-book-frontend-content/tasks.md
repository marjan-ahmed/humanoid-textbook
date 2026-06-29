# Tasks: Book Frontend and Content Foundation

**Input**: Design documents from `/specs/001-book-frontend-content/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/frontend-content-contract.md, quickstart.md

**Tests**: No automated TDD tests were requested. Validation tasks use the project commands and manual checks from quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete work
- **[Story]**: Maps to a user story from spec.md
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current Docusaurus baseline and prepare shared design/content foundations.

- [X] T001 Inspect current starter homepage structure in `book_content/src/pages/index.tsx` and `book_content/src/components/HomepageFeatures/index.tsx`
- [X] T002 Inspect current theme defaults in `book_content/src/css/custom.css` and `book_content/src/pages/index.module.css`
- [X] T003 Inspect current site identity and navigation in `book_content/docusaurus.config.ts` and `book_content/sidebars.ts`
- [X] T004 [P] Record final design direction notes in `specs/001-book-frontend-content/research.md`
- [X] T005 [P] Record final chapter/content standard notes in `specs/001-book-frontend-content/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared brand, metadata, layout, and docs structure before user-story work.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T006 Replace Docusaurus starter site title, tagline, metadata, navbar labels, footer links, and social image references in `book_content/docusaurus.config.ts`
- [X] T007 Replace default tutorial sidebar with course-aligned module categories in `book_content/sidebars.ts`
- [X] T008 Define global semantic theme tokens, typography variables, focus styles, reduced-motion defaults, and non-teal color system in `book_content/src/css/custom.css`
- [X] T009 Remove or quarantine unused starter feature component imports from `book_content/src/pages/index.tsx`
- [X] T010 Create reusable homepage content arrays for course pillars, learning journey, modules, and capstone preview in `book_content/src/pages/index.tsx`
- [X] T011 Create base course documentation folders in `book_content/docs/foundations/`, `book_content/docs/ros-2/`, `book_content/docs/simulation/`, `book_content/docs/nvidia-isaac/`, `book_content/docs/vla/`, `book_content/docs/humanoids/`, and `book_content/docs/capstone/`

**Checkpoint**: Site identity, theme baseline, and docs skeleton are ready for story implementation.

---

## Phase 3: User Story 1 - Discover the Course Value (Priority: P1) MVP

**Goal**: A visitor immediately understands this is a premium Physical AI & Humanoid Robotics textbook.

**Independent Test**: Open `/` and verify the first viewport communicates book identity, learner promise, and start-reading action in under 10 seconds.

### Implementation for User Story 1

- [X] T012 [US1] Replace starter hero markup with textbook hero content and CTAs in `book_content/src/pages/index.tsx`
- [X] T013 [US1] Implement hero layout, premium editorial typography, CTA states, and first-viewport responsive behavior in `book_content/src/pages/index.module.css`
- [X] T014 [US1] Add project-specific page title and description props to the Docusaurus `Layout` usage in `book_content/src/pages/index.tsx`
- [X] T015 [US1] Ensure the hero primary CTA links to `/docs/intro` and secondary CTA links to the module overview section in `book_content/src/pages/index.tsx`
- [X] T016 [US1] Remove visible starter Docusaurus wording from `book_content/src/pages/index.tsx`

**Checkpoint**: User Story 1 works independently as the MVP homepage first screen.

---

## Phase 4: User Story 2 - Explore a Premium Landing Page (Priority: P1)

**Goal**: The homepage presents a polished, non-generic landing experience with purposeful modern sections.

**Independent Test**: Scroll the homepage on desktop and mobile; verify each section has a clear job, premium styling, and no teal/gradient-heavy AI-template appearance.

### Implementation for User Story 2

- [X] T017 [P] [US2] Implement course pillars bento section markup in `book_content/src/pages/index.tsx`
- [X] T018 [P] [US2] Implement embodied-AI learning journey narrative section markup in `book_content/src/pages/index.tsx`
- [X] T019 [P] [US2] Implement module preview carousel or horizontally scrollable module rail markup in `book_content/src/pages/index.tsx`
- [X] T020 [P] [US2] Implement capstone outcome and final CTA section markup in `book_content/src/pages/index.tsx`
- [X] T021 [US2] Style bento cards, narrative panels, module rail, capstone section, and CTA band in `book_content/src/pages/index.module.css`
- [X] T022 [US2] Add responsive CSS for 375px, 768px, 1024px, and 1440px layouts in `book_content/src/pages/index.module.css`
- [X] T023 [US2] Add reduced-motion fallbacks for parallax-inspired and carousel-like interactions in `book_content/src/pages/index.module.css`
- [X] T024 [US2] Verify landing page copy avoids generic AI buzzwords and update visible section copy in `book_content/src/pages/index.tsx`

**Checkpoint**: User Stories 1 and 2 produce a complete premium landing page.

---

## Phase 5: User Story 3 - Navigate the Textbook Structure (Priority: P1)

**Goal**: Learners can enter a coherent course-aligned textbook structure.

**Independent Test**: Open `/docs/intro` and the docs sidebar; verify intro content and module navigation match the hackathon course.

### Implementation for User Story 3

- [X] T025 [US3] Replace starter intro tutorial with course introduction, target learner, prerequisites, learning path, module overview, and capstone outcome in `book_content/docs/intro.mdx`
- [X] T026 [P] [US3] Create Physical AI foundations scaffold in `book_content/docs/foundations/physical-ai-and-embodiment.mdx`
- [X] T027 [P] [US3] Create ROS 2 scaffold in `book_content/docs/ros-2/robotic-nervous-system.mdx`
- [X] T028 [P] [US3] Create simulation scaffold in `book_content/docs/simulation/digital-twins-gazebo-unity.mdx`
- [X] T029 [P] [US3] Create NVIDIA Isaac scaffold in `book_content/docs/nvidia-isaac/ai-robot-brain.mdx`
- [X] T030 [P] [US3] Create VLA scaffold in `book_content/docs/vla/vision-language-action.mdx`
- [X] T031 [P] [US3] Create humanoid systems scaffold in `book_content/docs/humanoids/humanoid-development.mdx`
- [X] T032 [P] [US3] Create capstone scaffold in `book_content/docs/capstone/autonomous-humanoid.mdx`
- [X] T033 [US3] Add `_category_.json` files for each new docs module folder under `book_content/docs/`
- [X] T034 [US3] Verify sidebar order and labels in `book_content/sidebars.ts` match the learning path

**Checkpoint**: User Story 3 provides the first usable textbook navigation and opening content.

---

## Phase 6: User Story 4 - Read SEO-Ready Technical Copy (Priority: P2)

**Goal**: Visitors and search engines understand the book through accurate headings, metadata, and specific copy.

**Independent Test**: Inspect homepage and intro page titles, descriptions, headings, and visible copy for specific Physical AI and robotics language.

### Implementation for User Story 4

- [X] T035 [US4] Update homepage SEO title, description, and visible H1/H2 hierarchy in `book_content/src/pages/index.tsx`
- [X] T036 [US4] Update Docusaurus global title, tagline, navbar title, and footer copyright in `book_content/docusaurus.config.ts`
- [X] T037 [US4] Add SEO-focused intro metadata and heading structure to `book_content/docs/intro.mdx`
- [X] T038 [US4] Review homepage and intro copy for terms Physical AI, Humanoid Robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, VLA, and AI-native textbook in `book_content/src/pages/index.tsx` and `book_content/docs/intro.mdx`

**Checkpoint**: Public copy is specific, scannable, and search-aware without claiming deferred features.

---

## Phase 7: User Story 5 - Establish Content Production Standards (Priority: P2)

**Goal**: Contributors can continue writing textbook chapters consistently.

**Independent Test**: Review chapter scaffolds and confirm each uses the same learning-oriented pattern.

### Implementation for User Story 5

- [X] T039 [US5] Add chapter structure guidance section to `book_content/docs/intro.mdx`
- [X] T040 [US5] Add learning outcomes, concept explanation, lab/exercise, review prompts, and safety notes placeholders to `book_content/docs/foundations/physical-ai-and-embodiment.mdx`
- [X] T041 [US5] Add learning outcomes, concept explanation, lab/exercise, review prompts, and safety notes placeholders to `book_content/docs/ros-2/robotic-nervous-system.mdx`
- [X] T042 [US5] Add learning outcomes, concept explanation, lab/exercise, review prompts, and safety notes placeholders to `book_content/docs/simulation/digital-twins-gazebo-unity.mdx`
- [X] T043 [US5] Add learning outcomes, concept explanation, lab/exercise, review prompts, and safety notes placeholders to `book_content/docs/nvidia-isaac/ai-robot-brain.mdx`
- [X] T044 [US5] Add learning outcomes, concept explanation, lab/exercise, review prompts, and safety notes placeholders to `book_content/docs/vla/vision-language-action.mdx`
- [X] T045 [US5] Add learning outcomes, concept explanation, lab/exercise, review prompts, and safety notes placeholders to `book_content/docs/humanoids/humanoid-development.mdx`
- [X] T046 [US5] Add learning outcomes, concept explanation, lab/exercise, review prompts, and safety notes placeholders to `book_content/docs/capstone/autonomous-humanoid.mdx`

**Checkpoint**: User Story 5 establishes repeatable textbook writing standards.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full first iteration and remove starter residue.

- [ ] T047 Run `npm run typecheck` from `book_content/` and fix TypeScript issues in `book_content/src/`
- [ ] T048 Run `npm run build` from `book_content/` and fix build, broken link, or MDX issues in `book_content/`
- [ ] T049 Review `book_content/src/pages/index.tsx`, `book_content/docs/`, and `book_content/docusaurus.config.ts` for remaining starter Docusaurus copy or links
- [ ] T050 Manually validate quickstart checklist items in `specs/001-book-frontend-content/quickstart.md`
- [ ] T051 Verify keyboard focus and primary link traversal on `/` and `/docs/intro` in the running Docusaurus site
- [ ] T052 Verify reduced-motion behavior and mobile layouts for 375px, 768px, 1024px, and 1440px in the running Docusaurus site

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phases 3-7)**: Depend on Foundational completion.
- **Polish (Phase 8)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 Discover the Course Value**: First MVP story after foundation.
- **US2 Explore a Premium Landing Page**: Depends on US1 hero direction but sections can be built in parallel.
- **US3 Navigate the Textbook Structure**: Can proceed after foundation in parallel with US2 if files do not conflict.
- **US4 Read SEO-Ready Technical Copy**: Depends on US1 and US3 copy surfaces existing.
- **US5 Establish Content Production Standards**: Depends on US3 chapter scaffold files existing.

### Parallel Opportunities

- T004 and T005 can run in parallel.
- T017 through T020 can run in parallel before shared CSS integration in T021.
- T026 through T032 can run in parallel because each creates a different chapter file.
- T040 through T046 can run in parallel after scaffold files exist.

---

## Parallel Example: User Story 3

```text
Task: "Create Physical AI foundations scaffold in book_content/docs/foundations/physical-ai-and-embodiment.mdx"
Task: "Create ROS 2 scaffold in book_content/docs/ros-2/robotic-nervous-system.mdx"
Task: "Create simulation scaffold in book_content/docs/simulation/digital-twins-gazebo-unity.mdx"
Task: "Create NVIDIA Isaac scaffold in book_content/docs/nvidia-isaac/ai-robot-brain.mdx"
Task: "Create VLA scaffold in book_content/docs/vla/vision-language-action.mdx"
Task: "Create humanoid systems scaffold in book_content/docs/humanoids/humanoid-development.mdx"
Task: "Create capstone scaffold in book_content/docs/capstone/autonomous-humanoid.mdx"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for the homepage first viewport.
3. Stop and validate that a judge can identify the textbook purpose within 10 seconds.

### Incremental Delivery

1. Foundation: site identity, theme tokens, sidebar baseline.
2. US1: hero and first impression.
3. US2: full premium landing experience.
4. US3: docs intro and course module navigation.
5. US4: SEO and search-aware copy pass.
6. US5: chapter writing standards.
7. Polish: typecheck, build, responsive, keyboard, reduced-motion validation.

### Suggested MVP Scope

The smallest demonstrable MVP is Phases 1-3: shared foundation plus User Story 1. The recommended first complete milestone is Phases 1-5, because it gives both homepage and book navigation.

---

## Notes

- No backend, RAG, auth, database, personalization, Urdu translation, or deployment automation tasks are included in this first iteration.
- Keep implementation inside `book_content/` unless updating specification artifacts.
- Use existing Docusaurus/React patterns before adding dependencies.
- Preserve accessibility and reduced-motion behavior while adding premium visual treatments.


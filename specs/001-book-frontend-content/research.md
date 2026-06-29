# Research: Book Frontend and Content Foundation

## Decision: Keep Docusaurus as the single frontend/book platform

**Rationale**: The existing project already uses Docusaurus 3.10.1 with React 19 and TypeScript. The hackathon requires a Docusaurus book, and keeping one app avoids platform churn.

**Alternatives considered**:
- Separate marketing frontend: rejected because it splits homepage and book navigation too early.
- Static HTML outside Docusaurus: rejected because it weakens docs/sidebar integration.

## Decision: Use Docusaurus-native components, MDX, CSS modules, and global CSS tokens

**Rationale**: The first iteration needs polish without adding unnecessary dependencies. Docusaurus supports custom React pages, MDX docs, sidebars, navbar/footer config, and Infima token overrides.

**Alternatives considered**:
- Add a component library: rejected for first iteration to avoid style mismatch and bundle cost.
- Add animation libraries: rejected unless later implementation proves CSS cannot meet the interaction goals.

## Decision: Editorial robotics visual direction

**Rationale**: The user explicitly rejected generic AI styling, teal, and gradient-heavy sites. The visual direction should feel like a premium technical textbook: graphite, white, muted metal, restrained amber/gold accents, precise typography, technical diagrams, and tactile section surfaces.

**Alternatives considered**:
- Liquid glass: rejected because it can read as generic AI/SaaS and has contrast/performance risks.
- Neon/cyberpunk: rejected because it overpowers the educational textbook purpose.
- Default Docusaurus theme: rejected because starter branding is a core problem.

## Decision: Landing page as narrative learning path

**Rationale**: The homepage must quickly persuade judges and orient learners. The strongest structure is a scroll narrative: hero thesis, course pillars, embodied-AI transition, module previews, capstone outcome, and final reading CTA.

**Alternatives considered**:
- Simple documentation homepage: rejected because it would not meet the premium landing requirement.
- Pure marketing page: rejected because the project is a textbook, not a SaaS product.

## Decision: Bento grid plus carousel/module preview

**Rationale**: A bento grid lets dense course pillars remain scannable. A carousel or comparable module preview helps show breadth without forcing visitors through long text.

**Alternatives considered**:
- Long list of modules: rejected because it feels static and less premium.
- Overly animated cards: rejected because motion must support learning and respect reduced-motion.

## Decision: Diataxis-inspired chapter standards

**Rationale**: The book needs repeatable chapter quality. Each chapter should define learning goals, explanation, practical lab/how-to, reference notes, assessment prompts, and robotics safety/hardware assumptions where relevant.

**Alternatives considered**:
- Free-form chapters: rejected because they create inconsistent textbook quality.
- Only tutorial-style chapters: rejected because robotics learners also need reference and conceptual explanation.

## Decision: No backend contracts for this phase

**Rationale**: The selected first iteration excludes RAG, auth, personalization, translation implementation, backend APIs, and databases. Contracts should describe frontend/content obligations instead.

**Alternatives considered**:
- Draft future RAG API contracts now: rejected because it would confuse phase boundaries and require separate architecture decisions.

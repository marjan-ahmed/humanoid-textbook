# Frontend and Content Contract

This iteration has no backend API contract. The contract below defines the observable frontend and content obligations that implementation must satisfy.

## Homepage Contract

- Route `/` presents the Physical AI & Humanoid Robotics textbook landing page.
- First viewport includes textbook identity, learner promise, and a start-reading action.
- Homepage includes hero, course pillars, learning journey, module preview, capstone outcome, and final CTA sections.
- Starter Docusaurus wording, starter images, and default tutorial CTA are absent.
- Motion-enhanced sections provide reduced-motion fallback.

## Navigation Contract

- Navbar links route to the book/docs and relevant overview content.
- Sidebar exposes course-aligned modules instead of starter tutorial categories.
- Footer avoids Docusaurus starter community links unless intentionally replaced with project links.

## Content Contract

- Intro page defines target learner, prerequisites, course goal, module overview, and capstone outcome.
- Chapter scaffolds use the standard: learning outcomes, explanation, exercise/lab, review prompts, and safety notes when applicable.
- Robotics content distinguishes simulated, edge, and physical deployment contexts.

## Design Contract

- Global visual identity uses semantic tokens for color, typography, surfaces, borders, focus, and motion.
- Palette avoids teal-dominant and gradient-dominant AI-template appearance.
- Cards and surfaces are sleek and premium, but content remains readable and accessible.
- Components support 375px, 768px, 1024px, and 1440px widths.

## SEO Contract

- Homepage title and description mention Physical AI, Humanoid Robotics, and AI-native textbook/course learning.
- Section headings use specific educational and robotics terminology.
- Copy does not claim implemented RAG, auth, personalization, or Urdu translation in this phase.

## Validation Contract

- `npm run typecheck` passes.
- `npm run build` passes.
- Manual review confirms no horizontal overflow at target viewport widths.
- Keyboard navigation reaches all primary links and calls to action with visible focus.
- Reduced-motion setting does not hide required content.

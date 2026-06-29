# Quickstart: Book Frontend and Content Foundation

## Prerequisites

- Node.js 20 or newer
- Existing Docusaurus project in `book_content/`

## Run Locally

```powershell
cd book_content
npm start
```

Open `http://localhost:3000`.

## Validate the First Iteration

```powershell
cd book_content
npm run typecheck
npm run build
```

## Manual Review Checklist

1. Open `/` and confirm the first viewport identifies the Physical AI & Humanoid Robotics textbook.
2. Confirm starter Docusaurus hero, tutorial CTA, navbar labels, footer links, and starter feature cards are gone.
3. Review homepage sections: hero, course pillars, learning journey, module preview, capstone outcome, and final CTA.
4. Resize to 375px, 768px, 1024px, and 1440px; confirm no horizontal overflow or text overlap.
5. Navigate with keyboard only; confirm focus is visible on nav links and CTAs.
6. Enable reduced motion in the OS or browser; confirm content is still fully available.
7. Open docs intro and confirm target learner, prerequisites, learning path, module overview, and capstone outcome are present.
8. Inspect sidebar and confirm course modules replace default tutorial categories.

## Out of Scope for This Iteration

- RAG chatbot
- Selected-text Q&A
- FastAPI backend
- OpenAI Agents/ChatKit integration
- Neon or Qdrant setup
- Better Auth
- Personalization
- Urdu translation implementation
- Deployment automation

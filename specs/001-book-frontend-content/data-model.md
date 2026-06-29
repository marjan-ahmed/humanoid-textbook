# Data Model: Book Frontend and Content Foundation

## Entity: Homepage

**Purpose**: Public entry page that communicates the textbook's identity and routes visitors into the book.

**Fields**:
- title: Book or course title shown in hero and metadata
- subtitle: Specific learner promise
- primaryCta: Link to start reading
- secondaryCta: Optional link to module overview or capstone preview
- sections: Ordered landing sections
- seo: SEO Copy Set

**Validation Rules**:
- Must not contain starter Docusaurus copy.
- Must identify Physical AI and Humanoid Robotics within the first viewport.
- Must include at least five purposeful sections.

## Entity: Landing Section

**Purpose**: A visible homepage block with one clear communication job.

**Fields**:
- id: Stable section identifier
- heading: Section headline
- purpose: Hero, pillars, journey, module preview, capstone, or CTA
- content: Short project-specific copy
- visualTreatment: Bento, narrative panel, carousel, diagram, or CTA band
- accessibilityNotes: Keyboard, contrast, reduced-motion requirements

**Validation Rules**:
- Each section has one primary message.
- Motion is optional and cannot be required to understand content.

## Entity: Book Module

**Purpose**: Major course area in docs navigation.

**Fields**:
- slug: URL-safe module slug
- title: Learner-facing module title
- summary: What the module teaches
- outcomes: Learning outcomes
- chapters: Ordered chapter list

**Validation Rules**:
- Must map to hackathon course scope.
- First iteration must expose at least six course-aligned modules.

## Entity: Chapter

**Purpose**: Learner-facing textbook unit.

**Fields**:
- slug: URL-safe chapter slug
- title: Chapter title
- module: Parent Book Module
- learningOutcomes: What the learner can do after reading
- explanation: Conceptual teaching content
- labOrExercise: Practical activity or assessment prompt
- safetyNotes: Hardware, simulation, or latency notes when relevant
- references: Tool or concept references when relevant

**Validation Rules**:
- Must follow the chapter-writing standard.
- Must distinguish simulation from physical deployment when hardware is discussed.

## Entity: Learning Path

**Purpose**: Ordered journey from foundations to capstone.

**Fields**:
- stages: Ordered modules or milestones
- prerequisites: Required learner background
- capstoneOutcome: Final project expectation

**Validation Rules**:
- Must be visible in intro content.
- Must align with weekly/module flow from the hackathon brief.

## Entity: Design System Direction

**Purpose**: Visual language used by homepage and docs shell.

**Fields**:
- palette: Named semantic colors
- typography: Display, body, and mono roles
- components: Hero, bento cards, module preview, CTA, navigation
- motion: Allowed animation patterns and reduced-motion fallback

**Validation Rules**:
- Must avoid teal-dominant and generic gradient-heavy identity.
- Must meet contrast and responsive layout requirements.

## Entity: SEO Copy Set

**Purpose**: Discoverability and scanning language.

**Fields**:
- pageTitle
- metaDescription
- h1
- sectionHeadings
- keywords

**Validation Rules**:
- Must include domain-specific terms naturally.
- Must not overstate implemented features such as RAG or personalization in this phase.

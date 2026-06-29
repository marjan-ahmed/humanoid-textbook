<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Placeholder principles -> I. AI-Native Textbook First
- Placeholder principles -> II. Spec-Driven Delivery
- Placeholder principles -> III. Deployable Book Platform
- Placeholder principles -> IV. RAG Chatbot as a Core Feature
- Placeholder principles -> V. Personalization and Accessibility
- Placeholder principles -> VI. Robotics Accuracy and Safety
- Placeholder principles -> VII. Reusable Intelligence, Skills, and Subagents
Added sections:
- Hackathon Technical Baseline
- Development Workflow and Quality Gates
Removed sections:
- Template placeholder section names and descriptions
Templates requiring updates:
- pending: .specify/templates/plan-template.md
- pending: .specify/templates/spec-template.md
- pending: .specify/templates/tasks-template.md
Deferred items:
- TODO(RATIFICATION_DATE): Confirm the formal adoption date with project owner.
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. AI-Native Textbook First

The project MUST produce a unified technical textbook for teaching Physical AI
and Humanoid Robotics. The book MUST use Docusaurus and MUST teach the course
goal: bridging AI software, embodied intelligence, simulation, and humanoid
robotics. Each chapter MUST include learning outcomes, practical explanation,
and assessment-ready exercises or activities.

Rationale: The hackathon deliverable is not only software; it is a complete
AI-native textbook that can be evaluated as a learning product.

### II. Spec-Driven Delivery

All major work MUST begin with Specify artifacts before implementation:
`spec.md`, `plan.md`, and `tasks.md`. Requirements MUST be traceable to the
hackathon deliverables: public repository, published book, embedded chatbot,
demo video, and optional bonus features. Tasks MUST be grouped by independently
testable user story.

Rationale: The project is required to use Spec-Kit Plus, and traceability keeps
book content, platform work, and chatbot behavior aligned.

### III. Deployable Book Platform

The book MUST be deployable to GitHub Pages or Vercel. Docusaurus routing,
assets, navigation, and generated pages MUST be validated before release.
Broken links, missing pages, unrendered diagrams, inaccessible assets, or failed
deployment checks are release blockers.

Rationale: The published book link is a required submission artifact.

### IV. RAG Chatbot as a Core Feature

The published book MUST embed a Retrieval-Augmented Generation chatbot that
answers questions about the book content. The chatbot SHOULD use OpenAI
Agents/ChatKit, FastAPI, Neon Serverless Postgres, and Qdrant Cloud unless an
ADR documents a justified alternative. It MUST answer both book-wide questions
and questions constrained to text selected by the user.

Rationale: The embedded chatbot is part of the base 100-point functionality.

### V. Personalization and Accessibility

If authentication is implemented, Better Auth SHOULD be used unless an ADR
documents an alternative. Signup SHOULD collect software and hardware background
so content can be personalized. Chapter-level personalization and Urdu
translation controls SHOULD be treated as bonus features, but MUST NOT degrade
the core reading, navigation, or chatbot experience.

Rationale: Authentication, personalization, and Urdu translation are explicit
bonus opportunities and should be integrated without weakening the base product.

### VI. Robotics Accuracy and Safety

Robotics content MUST distinguish simulation, edge deployment, and physical
robot control. Guidance involving ROS 2, Gazebo, Unity, NVIDIA Isaac, Jetson,
RealSense, IMUs, microphones, robot platforms, cloud workstations, or latency
MUST state constraints, assumptions, and risks. Cloud-to-real robot control MUST
warn against latency-sensitive operation.

Rationale: Physical AI content can affect expensive hardware and safety-critical
systems; the book must be technically grounded and explicit about risk.

### VII. Reusable Intelligence, Skills, and Subagents

Contributors and agents MUST use relevant skills, subagents, prompts, and
workflow helpers when they improve quality, repeatability, or speed for tasks
such as chapter drafting, technical review, RAG ingestion, testing, deployment,
translation, and assessment generation. If the correct skill is unclear, the
agent MUST use the `find-skills` skill to search for an appropriate skill before
falling back to general capability. Reusable intelligence assets MUST be
documented and kept separate from textbook source content.

Rationale: The hackathon awards bonus credit for reusable intelligence, and
skill discovery prevents ad hoc work when a better specialized workflow exists.

## Hackathon Technical Baseline

The technical baseline SHOULD reflect the hackathon requirements: Docusaurus,
GitHub Pages or Vercel, OpenAI Agents/ChatKit, FastAPI, Neon Serverless
Postgres, Qdrant Cloud, Better Auth where applicable, ROS 2, Gazebo, Unity,
NVIDIA Isaac, Whisper, GPT models, and Ubuntu/Linux-oriented robotics workflows.

Course content SHOULD cover ROS 2 nodes, topics, services, actions, `rclpy`,
URDF, Gazebo, Unity, sensors, digital twins, Isaac Sim, Isaac ROS, VSLAM, Nav2,
synthetic data, Vision-Language-Action workflows, voice-to-action robotics,
hardware tiers, cloud lab tradeoffs, and sim-to-real constraints.

## Development Workflow and Quality Gates

Every feature MUST pass these gates:

1. Specification includes prioritized user stories and acceptance criteria.
2. Plan documents architecture, dependencies, deployment target, data stores,
   reusable skills or subagents, and risks.
3. Tasks are grouped by independently testable user story.
4. Implementation validates book rendering, chatbot behavior, and deployment.
5. Major stack changes or architecture deviations trigger an ADR proposal.

## Governance

This constitution supersedes conflicting project plans, specs, and task files.
Amendments require a clear rationale, semantic version bump, amendment date,
and impact review against `.specify/templates/plan-template.md`,
`.specify/templates/spec-template.md`, and `.specify/templates/tasks-template.md`.

Versioning policy:

- MAJOR: Removes or redefines core principles.
- MINOR: Adds principles, governance sections, or required quality gates.
- PATCH: Clarifies wording without changing obligations.

Compliance MUST be checked during planning, task generation, implementation
review, and release preparation. Any intentional violation MUST be documented in
the plan's complexity tracking section with the simpler alternative considered.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Confirm formal adoption date | **Last Amended**: 2026-06-29

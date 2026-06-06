---
name: to-prd
version: 1.0.0
description: >-
  Turn the current conversation + codebase understanding into a PRD and publish it to the
  project issue tracker. Owned by @product (shared with @eng, @growth). Use when the user wants
  a PRD from the current context. Does NOT interview — synthesizes what you already know.
---

# to-prd — synthesize a PRD from context

Take what's already in the conversation + codebase and produce a PRD. **Don't interview** — you
already have the context; synthesize it. (The issue-tracker + label vocabulary should be in
AGENTS.md / docs/agents; see `setup-matt-pocock-skills` if not.)

## Trigger
- "Write this up as a PRD", "turn this into a PRD", "create a PRD from what we discussed".

## Procedure
1. **Ground in the repo** — explore current state if you haven't; use the domain glossary
   (CONTEXT.md) vocabulary throughout; respect ADRs in the area.
2. **Sketch the modules** to build/modify — actively look to extract **deep modules** (lots of
   behaviour behind a simple, testable interface). Confirm the modules + which ones get tests
   with the user.
3. **Write the PRD** to the template, then publish to the issue tracker with the
   `ready-for-agent` label.

### PRD template
- **Problem Statement** — the problem, from the user's perspective.
- **Solution** — the solution, from the user's perspective.
- **User Stories** — a long numbered list: "As an <actor>, I want <feature>, so that <benefit>." Extensive; cover all aspects.
- **Implementation Decisions** — modules + their interfaces, technical clarifications, architecture, schema, API contracts. No file paths / code snippets (they go stale) — exception: a prototype-derived snippet that encodes a decision precisely (state machine, schema, type), trimmed to the decision.
- **Testing Decisions** — what makes a good test (external behaviour, not internals), which modules get tested, prior art in the codebase.
- **Out of Scope** — what this PRD excludes.
- **Further Notes**.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Don't interview — synthesize. No file paths/snippets
in the PRD (except decision-encoding prototype snippets). Use domain vocabulary; respect ADRs.

## Evidence (what "done" must show)
The published PRD (issue URL/id) with all template sections and the `ready-for-agent` label.

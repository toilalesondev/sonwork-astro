---
name: document-generate
version: 1.0.0
description: >-
  Generate missing documentation from scratch using the Diataxis framework (tutorial / how-to /
  reference / explanation). Owned by @backend (shared with @chief/@growth/@ops). Use to "write
  docs / generate documentation / document this feature / create a tutorial / explain this module".
---

# document-generate — write the docs that don't exist yet

Author complete, structured docs from scratch. Owned by `@backend` (shared). (To SYNC docs after
a ship, see `document-release`.)

## Trigger
- "Write docs / generate documentation / document this feature / create a tutorial / explain this module".

## Procedure
1. **Scope & intent** — what to document + who reads it.
2. **Codebase archaeology** — read the code to document reality, not assumptions; use the domain
   glossary (CONTEXT.md) vocabulary.
3. **Diataxis partition** — split the need into the four modes:
   - **Reference** — what it is (API, options, types). Write this first; it's the factual base.
   - **How-to** — task recipes ("how do I X").
   - **Tutorial** — a guided first success for a newcomer.
   - **Explanation** — the why (design, trade-offs, concepts).
4. **Write** each needed mode to the project's docs location, cross-linked. Reference docs:
   API/interface · options/config · examples · related.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Document what the code ACTUALLY does (read it) — never
invent behavior. Use the right Diataxis mode for the need (don't write a tutorial when they need
reference). Domain vocabulary throughout.

## Evidence (what "done" must show)
The docs written (paths) mapped to their Diataxis mode, grounded in real code references.

---
name: grill
version: 1.0.0
description: >-
  Interview the user relentlessly about a plan or design until shared understanding — one
  question at a time, recommending an answer each time, resolving the decision tree branch by
  branch. Owned by @eng (shared). Use when the user wants to stress-test a plan, "grill me",
  pressure-test a design, or (docs mode) challenge it against the project's domain model + docs.
---

# grill — stress-test a plan until it's sharp

Interview relentlessly about every aspect of the plan/design until you reach shared
understanding. Walk down each branch of the decision tree, resolving dependencies one by one.
**Ask one question at a time, wait for the answer, recommend your answer to each.** If a question
can be answered by reading the codebase, read it instead of asking.

## Trigger
- "Grill me", "stress-test this plan", "pressure-test this design", "poke holes in this".
- **Docs mode** — "challenge this against our domain model / decisions": also sharpen terminology
  and update CONTEXT.md / ADRs inline.

## Procedure

### Base mode — the interview
- One falsifiable question at a time, each with your recommended answer + why.
- Resolve dependencies between decisions in order (don't ask about X before its prerequisite Y).
- Stress-test relationships with **concrete scenarios** that force precision about boundaries.
- When the user states how something works, **cross-check the code**; surface contradictions:
  "your code cancels whole Orders, but you said partial cancellation is possible — which is right?"
- Stop when the decision tree is resolved (every branch has an answer) — not before.

### Docs mode (add when challenging against the domain model)
First, during exploration, find the docs layout: a single `CONTEXT.md` + `docs/adr/`, or a
`CONTEXT-MAP.md` at root pointing to per-context `CONTEXT.md` files. Create files lazily — only
when you have something to write. Then, inline as decisions crystallise:
- **Glossary conflict** — a term clashes with CONTEXT.md → call it out immediately.
- **Fuzzy term** — propose a precise canonical name ("'account' → Customer or User?").
- **Term resolved** — update CONTEXT.md right there (don't batch). CONTEXT.md is a **glossary
  only** — no implementation details, not a spec or scratchpad.
- **Load-bearing rejection** — offer an ADR only when all three hold: hard to reverse · surprising
  without context · the result of a real trade-off. Otherwise skip it.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. One question at a time — never dump a questionnaire.
Always recommend an answer (don't just interrogate). Prefer reading the code over asking when the
answer is in the code. Docs mode: CONTEXT.md stays a pure glossary.

## Evidence (what "done" must show)
The resolved decision tree (the questions + agreed answers), and — in docs mode — the
CONTEXT.md/ADR edits made inline (path + what changed).

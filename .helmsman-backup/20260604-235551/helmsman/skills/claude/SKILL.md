---
name: claude
version: 1.0.0
description: >-
  Get an independent second opinion from another model/CLI on a risky diff — review, adversarial
  challenge, or a read-only repo consult. Owned by @ship. Use for "second opinion", "outside
  voice", "challenge this", "have another model review". Tool-aware: uses an external model CLI when present.
---

# claude — an outside model's second opinion

An independent reviewer from a different model, for high-stakes diffs where one perspective isn't
enough. Owned by `@ship`. **Tool-aware:** uses an external model CLI (e.g. `claude -p`, or any
configured second model) when present; if none is available, say so and fall back to a careful
self-review labeled as such.

## Trigger
- "Second opinion", "outside voice", "challenge this", "have another model look at it".

## Procedure (three modes)
- **review** — pipe the diff to the external model for an independent code review; report its
  findings alongside ours (agreements + disagreements).
- **challenge** — adversarial failure-mode review: ask it to find how this breaks (auth, races,
  data loss, edge cases).
- **consult** — ask it a focused question about the repo with read-only file access.

Always attribute findings to the outside model and reconcile with our own review — don't merge
blindly.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Tool-aware: if no external model is configured, state
that — never fabricate a "second opinion". Attribute the outside findings; reconcile, don't rubber-stamp.

## Evidence (what "done" must show)
The external model invoked (or the honest "none available"), its findings verbatim, and how they
reconcile with our own review.

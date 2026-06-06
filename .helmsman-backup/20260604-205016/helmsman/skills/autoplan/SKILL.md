---
name: autoplan
version: 1.0.0
description: >-
  Run the full plan-review gauntlet automatically — all relevant reviews (plan-ceo-review,
  plan-eng-review, plan-design-review, plan-devex-review),
  devex) in sequence with auto-decisions, surfacing only the genuine taste calls at a final
  gate. Owned by @product. Use when the user has a plan and wants it fully reviewed without
  answering 15–30 intermediate questions — "auto review", "autoplan", "run all reviews".
---

# autoplan — one command, fully-reviewed plan out

Orchestrates the four `plan-*-review` skills (ceo/eng/design/devex), auto-deciding the clear calls and
escalating only the real taste decisions. Turns a 30-question gauntlet into one pass.

## Trigger
- "Auto review", "autoplan", "run all the reviews", "review this plan automatically", "make the
  decisions for me".

## Procedure

### 0. Intake + restore point
Read the plan from `process/active/`. Snapshot it (git) so the whole review is revertible.

### 1. Run the reviews in sequence
Run the relevant `plan-*-review` skills in order — typically **plan-ceo-review → plan-eng-review
→ plan-design-review → plan-devex-review** (skip ones that don't apply, e.g. no UI → skip design).
Each rates its dimensions + proposes fixes.

### 2. Auto-decide by the decision principles
Apply fixes automatically when the call is clear. The principles:
1. **Reversible + low-risk → just do it.** 2. **Matches an established project convention → apply it.**
3. **Strictly improves with no scope cost → apply it.** 4. **A genuine trade-off → defer to the gate.**
5. **Expands scope → defer to the gate.** 6. **Lenses disagree → defer to the gate.**
Run sequentially (each lens sees the prior lens's fixes) — never in parallel.

### 3. Surface ONLY taste decisions at a final gate
Collect the deferred calls (trade-offs, scope expansions, cross-lens disagreements) and present
them together for one human decision — not 30 scattered questions.

### 4. Write the reviewed plan
Apply the gate decisions; write the sharpened plan back to `process/active/`. Provide re-run
instructions.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Sequential lens execution (order matters). Auto-decide
only the clear cases; never auto-decide a scope expansion or a cross-lens conflict — those go to
the gate. Snapshot first so the whole pass is revertible.

## Evidence (what "done" must show)
Which lenses ran, the auto-decisions made (with which principle), the taste decisions surfaced at
the gate + their resolution, and the reviewed plan written back.

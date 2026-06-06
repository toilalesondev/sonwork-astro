---
name: plan-review
version: 1.0.0
description: >-
  Review a plan through a chosen lens — ceo (scope/ambition), eng (architecture/execution),
  design (UX/visual), or devex (developer experience) — interactively, rating dimensions and
  fixing the plan to a 10. Owned by @product (ceo) / @eng (eng) / @design (design) /
  @backend (devex). Use before BUILD when asked to "review the plan", "is this ambitious
  enough", "lock in the architecture", "design critique", or "DX review".
---

# plan-review — sharpen a plan before BUILD, through a lens

One review engine, four **lenses**. Same flow: assess scope → review the plan against the lens's
principles → rate each dimension 0–10 with "what would make it a 10" → fix the plan to get there.
Interactive; one issue at a time with an opinionated recommendation.

## Trigger & lens
- **`ceo`** (@product) — "think bigger / is this ambitious enough / rethink this / strategy review".
- **`eng`** (@eng) — "review the architecture / lock in the plan / execution review".
- **`design`** (@design) — "review the design plan / design critique" (plan-stage, before build).
- **`devex`** (@backend) — "DX review / API-SDK-CLI design review / onboarding review".

## Procedure

### Step 0 — Scope + mode
First, right-size the plan. Pick a mode:
- **EXPAND** — the plan could be a better product / stronger advantage (ceo: 10-star product;
  devex: competitive DX). Dream bigger, then cherry-pick.
- **HOLD** — scope is right; apply maximum rigor to what's there.
- **REDUCE** — strip to the essential wedge.
Agree the mode + scope with the user before reviewing.

### Step 1 — Review through the lens's principles
- **ceo** — challenge premises; find the 10-star version; engineering/product taste; "is the
  problem even framed right?" Expand scope only when it makes a materially better product.
- **eng** — architecture, data flow, diagrams, edge cases, test coverage, performance, failure
  modes. Lock the execution plan; surface risks before code.
- **design** — visual hierarchy, IA, cognitive load, UX reality (how users actually behave),
  accessibility, motion; check against DESIGN.md. (Plan-stage; live-site audit is `impeccable`.)
- **devex** — the developer's path: TTHW (time to hello world), the 7 DX characteristics,
  friction points, error messages, API/CLI shape, docs. Score against a 0–10 DX rubric.

### Step 2 — Rate dimensions 0–10, "what makes it a 10"
For each dimension of the lens, give a score, the gap to 10, and the concrete change that closes
it. Confidence-calibrate (state how sure you are). Walk the user through issues one at a time
with a recommended fix.

### Step 3 — Fix the plan
Apply the agreed fixes back into the plan doc (`process/active/<plan>.md`) so BUILD starts from
the sharpened version. (`autoplan` runs all four lenses in sequence.)

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Recommend, don't dictate — the user owns scope.
Rate honestly (a 6 is a 6); always pair a score with the specific change that raises it. EXPAND
only when it genuinely makes a better product, not for its own sake.

## Evidence (what "done" must show)
The chosen lens + mode, the per-dimension 0–10 scores with the "to make it a 10" change each, and
the fixes written back into the plan doc.

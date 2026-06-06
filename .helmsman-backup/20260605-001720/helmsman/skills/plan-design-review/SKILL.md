---
name: plan-design-review
version: 1.0.0
description: >-
  Designer-lens plan review (plan-stage, before build) — rate visual hierarchy, IA, cognitive
  load, UX reality, accessibility, motion against DESIGN.md. Owned by @design. Use when asked to
  "review the design plan / design critique" before implementation. (Live-site audit = impeccable.)
---

# plan-design-review — sharpen the design before it's built

Review a plan through the designer lens, at plan stage. For auditing a SHIPPED UI, use
`impeccable` (audit mode) instead. Owned by `@design`. Interactive; one issue at a time.

## Trigger
- "Review the design plan / design critique" (before implementation).

## Procedure
1. **Scope + mode** — agree EXPAND/HOLD/REDUCE on the design's ambition with the user first.
2. **Review through the design lens** — visual hierarchy, information architecture, cognitive
   load, **UX reality** (how users actually behave, not how we wish), accessibility, motion.
   Check against `DESIGN.md` (the system source of truth).
3. **Rate dimensions 0–10** — for each (hierarchy, IA, cognitive load, UX reality, a11y, motion),
   give a score, the gap to 10, and the concrete change that closes it. Confidence-calibrate.
4. **Fix the plan** — apply agreed changes back into `process/active/<plan>.md`.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Recommend, don't dictate. Rate honestly; pair every
score with the specific change that raises it. Plan-stage only — judge against DESIGN.md, don't
audit a live site here (that's `impeccable`).

## Evidence (what "done" must show)
The mode, the per-dimension 0–10 scores with the "to make it a 10" change each, the DESIGN.md
conformance check, and the fixes written back into the plan doc.

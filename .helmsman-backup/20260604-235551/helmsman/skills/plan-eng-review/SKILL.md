---
name: plan-eng-review
version: 1.0.0
description: >-
  Engineering-manager-lens plan review — lock the execution plan: architecture, data flow,
  edge cases, test coverage, performance, failure modes. Owned by @eng. Use before BUILD when
  asked to "review the architecture / lock in the plan / engineering review / execution review".
---

# plan-eng-review — lock the execution plan before code

Review a plan through the eng-manager lens: is the architecture sound, the data flow clear, the
edge cases covered, the risks surfaced — before any code. Owned by `@eng`. Interactive; one issue
at a time, recommended fix each.

## Trigger
- "Review the architecture / lock in the plan / engineering review / execution review".

## Procedure
1. **Scope + mode** — HOLD (scope right; maximum rigor) is the usual eng mode; EXPAND/REDUCE if
   the plan's surface area is wrong. Agree with the user first.
2. **Review through the eng lens** — architecture, data flow + diagrams, edge cases, test
   coverage, performance, failure modes. Lock the execution plan; surface risks before code.
3. **Rate dimensions 0–10** — for each (architecture, data flow, edge cases, test coverage,
   performance), give a score, the gap to 10, and the concrete change that closes it.
   Confidence-calibrate.
4. **Fix the plan** — apply agreed changes back into `process/active/<plan>.md`.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Recommend, don't dictate. Rate honestly; pair every
score with the specific change that raises it. Surface failure modes/risks explicitly — the point
is to catch them before BUILD.

## Evidence (what "done" must show)
The mode, the per-dimension 0–10 scores with the "to make it a 10" change each, the risks
surfaced, and the fixes written back into the plan doc.

---
name: plan-devex-review
version: 1.0.0
description: >-
  Developer-experience-lens plan review — score the developer's path: TTHW, the 7 DX
  characteristics, friction, error messages, API/CLI shape, docs. Owned by @backend. Use before
  BUILD for a developer-facing product when asked to "DX review / API-SDK-CLI design review /
  onboarding review". (Live DX audit = devex-review.)
---

# plan-devex-review — design the developer's path before building it

Review a plan through the developer-experience lens, at plan stage. For TESTING the shipped DX,
use `devex-review`. Owned by `@backend`. Interactive; one issue at a time.

## Trigger
- "DX review / API-SDK-CLI design review / onboarding review" for an API/SDK/CLI/platform/docs plan.

## Procedure
1. **Scope + mode** — EXPAND (competitive-advantage DX) / HOLD / REDUCE. Agree with the user first.
2. **Review through the DX lens** — the developer's path: **TTHW** (time to hello world), the 7
   DX characteristics, friction points, error messages, API/CLI shape, docs coverage. Trace what
   a newcomer actually hits.
3. **Rate dimensions 0–10** — score against a DX rubric (TTHW, clarity, errors, consistency,
   docs, discoverability); give each a score, the gap to 10, and the concrete change. Confidence-calibrate.
4. **Fix the plan** — apply agreed changes back into `process/active/<plan>.md`.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Recommend, don't dictate. Rate honestly; pair every
score with the specific change that raises it. Plan-stage — for measuring real TTHW on a shipped
product, that's `devex-review`.

## Evidence (what "done" must show)
The mode, the per-dimension 0–10 DX scores with the "to make it a 10" change each, and the fixes
written back into the plan doc.

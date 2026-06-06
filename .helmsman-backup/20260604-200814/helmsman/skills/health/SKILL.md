---
name: health
version: 1.0.0
description: >-
  Code-quality dashboard — run the project's existing checks (type-check, lint, tests, dead-code,
  shell-lint), roll them into a weighted 0-10 score, and track the trend. Owned by @ship (shared
  with @helm). Use for "health check / code quality / how healthy is the codebase / quality score".
---

# health — one quality score from the checks you already have

Wrap the project's own tools into a single composite read + a trend. Owned by `@ship`/`@helm`.

## Trigger
- "Health check / code quality / how healthy is the codebase / run all checks / quality score".

## Procedure
1. **Detect the project's tools** — type checker, linter, test runner, dead-code detector,
   shell-linter (whatever the stack defines; don't impose new ones).
2. **Run each**, capture pass/fail + counts (errors, failing tests, dead exports, lint warnings).
3. **Composite 0-10** — weight by severity (type/test failures heavier than lint nits). Show the
   per-check breakdown, not just the number.
4. **Trend** — compare to the last run; report improving/regressing per dimension.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Wrap EXISTING project tools — don't invent checks the
project doesn't use. The score must trace to real tool output (Rule 1); show the breakdown.

## Evidence (what "done" must show)
The actual output of each check, the composite score with its weighting, and the trend vs last run.

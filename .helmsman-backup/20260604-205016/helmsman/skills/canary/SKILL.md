---
name: canary
version: 1.0.0
description: >-
  Post-deploy canary monitoring — watch live production for console errors, failed requests,
  performance regressions, and broken pages against a pre-deploy baseline. Owned by @ship. Use
  for "monitor the deploy / canary / post-deploy check / watch production". Tool-aware (browser tool).
---

# canary — watch production right after a deploy

Catch a bad deploy in the canary window. Owned by `@ship`. Tool-aware: uses the browser tool when present.

## Trigger
- "Monitor the deploy / canary / post-deploy check / watch production".

## Procedure
1. **Baseline** — take or load a pre-deploy baseline (key pages, expected content, error budget).
2. **Watch the window** — load key pages (browser tool); watch for console errors, failed
   network requests, performance regressions, and broken/blank pages. Periodic screenshots vs baseline.
3. **Alert on anomalies** — flag any regression against baseline with the evidence (which page,
   which error).
4. **Go / no-go** — report a clear verdict for the deploy; recommend rollback if the canary fails.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Always compare against a **baseline** (an absolute
reading is noise). Tool-aware: say so if no browser tool is available — never claim prod is
healthy without actually loading it (Rule 1).

## Evidence (what "done" must show)
The baseline, the pages watched + any errors/regressions found (with screenshots), and the
go/no-go verdict.

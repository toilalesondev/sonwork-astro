---
name: canary
version: 1.0.0
description: >-
  Post-deploy canary monitoring — watch live production for console errors, failed requests,
  performance regressions, and broken pages against a pre-deploy baseline. Owned by @ship. Use
  for "monitor the deploy / canary / post-deploy check / watch production". Uses hbrowse (Playwright); honest when unavailable.
---

# canary — watch production right after a deploy

Catch a bad deploy in the canary window. Owned by `@ship`. Watches prod via **`hbrowse`**.

> **Tool:** `hbrowse <verb>` (see `browse`). If unavailable, say so — never report prod healthy
> without actually loading it (Rule 1/3).

## Trigger
- "Monitor the deploy / canary / post-deploy check / watch production".

## Procedure
1. **Baseline** — take or load a pre-deploy baseline (key pages, expected content, `hbrowse
   screenshot` per page, error budget).
2. **Watch the window** — for each key page: `hbrowse goto <url>` → check `goto` status is 2xx →
   `hbrowse console` (JS errors) → `hbrowse network` (failed/4xx+ requests) → `hbrowse text`/
   `is-visible` (page not blank/broken) → `hbrowse screenshot` vs baseline. Repeat across the window.
3. **Alert on anomalies** — flag any regression vs baseline with the evidence (page + the error/diff).
4. **Go / no-go** — report a clear verdict; recommend rollback if the canary fails. `hbrowse cleanup` when done.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Always compare against a **baseline** (an absolute
reading is noise). Say so if hbrowse/Playwright is unavailable — never claim prod is
healthy without actually loading it (Rule 1).

## Evidence (what "done" must show)
The baseline, the pages watched + any errors/regressions found (with screenshots), and the
go/no-go verdict.

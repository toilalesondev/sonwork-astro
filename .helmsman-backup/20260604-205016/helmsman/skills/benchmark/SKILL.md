---
name: benchmark
version: 1.0.0
description: >-
  Page-performance regression check — measure load time, Core Web Vitals (LCP/CLS/INP), and
  resource/bundle sizes against a baseline; flag regressions; track the trend. Owned by @ship
  (shared with @chief). Use for "check performance / page speed / web vitals / bundle size / load time".
---

# benchmark — catch performance regressions

Measure page performance and compare to a baseline. Owned by `@ship` (shared with `@chief` for
the numbers). Tool-aware (browser tool / lighthouse when present).

## Trigger
- "Check performance / page speed / web vitals / bundle size / load time".

## Procedure
1. **Baseline** — establish or load a baseline: load time, Core Web Vitals (LCP, CLS, INP),
   resource + bundle sizes.
2. **Measure current** — run the same measurement on the current build.
3. **Diff vs baseline** — flag any metric that regressed past threshold; quantify the delta.
4. **Trend** — track over runs so slow drift is visible, not just single-run regressions.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Always measure against a **baseline** (a lone number
is noise). Report the before→after delta; don't claim a regression without the numbers (Rule 1).
Tool-aware: state when the measurement tool isn't available.

## Evidence (what "done" must show)
The baseline + current numbers + the delta per metric, the flagged regressions, and the trend vs prior runs.

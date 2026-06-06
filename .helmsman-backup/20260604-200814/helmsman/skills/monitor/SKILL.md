---
name: monitor
version: 1.0.0
description: >-
  Post-deploy + performance monitoring — three modes: canary (watch live prod for errors/
  regressions after a deploy), perf (page-speed / web-vitals regression vs baseline), and
  models (cross-model benchmark of a prompt). Owned by @ship. Use after a deploy or for
  "monitor prod / canary / check performance / benchmark / which model is best".
---

# monitor — watch prod + measure performance

One skill, three modes, all baseline-vs-current. Owned by `@ship`. Tool-aware (browser tool for
canary/perf; provider access for models).

## Trigger
- **canary** — "monitor the deploy / watch production / post-deploy check".
- **perf** — "check performance / page speed / web vitals / bundle size / load time".
- **models** — "benchmark models / which model is best for X / model shootout".

## Procedure

### canary (post-deploy watch)
Take/compare against a pre-deploy baseline. For the canary window: load key pages (browser tool),
watch for console errors, failed requests, performance regressions, broken pages. Periodic
screenshots vs baseline. Alert on anomalies; report a go/no-go.

### perf (page-speed regression)
Establish a baseline (load time, Core Web Vitals — LCP/CLS/INP, resource/bundle sizes). Measure
current; diff vs baseline; flag regressions over threshold. Track the trend over runs.

### models (cross-model benchmark)
Run the same prompt across providers (e.g. Claude / GPT / Gemini); compare latency, tokens, cost,
and — optionally — quality via an LLM judge. Answer "which model for this task?" with data.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Always measure against a **baseline** — a number with
no baseline is noise. Tool-aware: state when the browser/provider tool isn't available rather than
inventing metrics (Rule 1). Don't claim a regression without the before/after numbers.

## Evidence (what "done" must show)
The baseline + current numbers (and the delta), screenshots for canary, and the concrete
go/no-go or "which model" answer backed by the measured data.

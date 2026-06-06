---
name: benchmark-models
version: 1.0.0
description: >-
  Cross-model benchmark — run the same prompt across providers (Claude / GPT / Gemini / …) and
  compare latency, tokens, cost, and optionally quality via an LLM judge. Owned by @ship (shared
  with @chief). Use for "benchmark models / which model is best for X / cross-model comparison / model shootout".
---

# benchmark-models — which model is actually best, with data

Answer "which model for this task?" with measurements, not vibes. Owned by `@ship` (shared with
`@chief`). Tool-aware: needs access to the providers being compared.

## Trigger
- "Benchmark models / which model is best for X / cross-model comparison / model shootout".

## Procedure
1. **Define the task** — the exact prompt + the candidate models/providers to compare.
2. **Run identically** — the same prompt across each provider; capture latency, token counts, cost.
3. **Quality (optional)** — score outputs via an LLM judge or a task-specific rubric.
4. **Compare** — a table: model · latency · tokens · cost · quality → a clear recommendation for this task.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Same prompt to every model (fair comparison). Report
real measured numbers — never estimate latency/cost without running (Rule 1). Tool-aware: say so
if a provider isn't reachable.

## Evidence (what "done" must show)
The comparison table (latency/tokens/cost/quality per model) and the recommendation, backed by
the actual runs.

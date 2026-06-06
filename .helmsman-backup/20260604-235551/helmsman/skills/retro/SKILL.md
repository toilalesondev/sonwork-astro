---
name: retro
version: 1.0.0
description: >-
  Engineering retrospective — analyze commit history, work patterns, and quality metrics over a
  window, with per-person breakdown (praise + growth) and trend tracking. Owned by @ops (shared
  with @ship). Use for "weekly retro / what did we ship / engineering retrospective", or at a sprint end.
---

# retro — what shipped, what to improve

A periodic look-back grounded in real history. Owned by `@ops` (shared with `@ship`).

## Trigger
- "Weekly retro / what did we ship / engineering retrospective", end of a week/sprint.

## Procedure
1. **Window** — pick the period (default last week). Pull `git log` for it (commits, files,
   authors), merged PRs, and the `health` trend if available.
2. **Synthesize** — what shipped (features/fixes), work patterns (cadence, churn hotspots), and
   quality movement.
3. **Per-person** (team mode) — contributions with **praise** (what went well) + one growth area,
   grounded in real commits — fair and specific, never inflammatory.
4. **Trend** — compare to prior retros (velocity, quality direction).
5. **Takeaways** — 2-3 concrete process improvements for next period.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Ground every claim in real history (commits/PRs) —
no invented stats. Per-person notes are fair + specific + constructive, never a callout.

## Evidence (what "done" must show)
The window analyzed, the commit/PR data it rests on, the per-person breakdown, the trend vs prior
retros, and the concrete takeaways.

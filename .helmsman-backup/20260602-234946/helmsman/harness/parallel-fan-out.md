# Parallel Fan-Out

When work spans independent directions, the orchestrator can spawn **parallel
explorer/reviewer subagents** (via the Task tool) instead of going sequential. This is
Helmsman's parallelism — it works in any runtime with a Task/subagent tool. It covers
the real need: parallel read-only exploration and parallel review.

## Fan-out score — 5 signals (+1 each)

1. **Multi-package / multi-surface** — touches 3+ packages or domains.
2. **Schema / API / auth / RLS surface** touched.
3. **3+ viable directions** identified.
4. **Phase-program** classification (large multi-phase effort).
5. **User explicitly requests depth / parallelism.**

Auto-skip: single-file or trivial work always goes sequential.

## Thresholds

| Score | Action |
|-------|--------|
| 0–1 | Skip silently (sequential). |
| 2 | Mention fan-out availability. |
| 3+ | Recommend fan-out with a one-line reason. |

## Lifecycle checkpoints

1. **EXPLORE fan-out** — split fact-gathering across domains/dirs (e.g. `@scout` on
   frontend, `@backend` on the DB layer) in parallel.
2. **Plan-validation fan-out** (score ≥2) — parallel reviewers each take a dimension:
   infra fit · test coverage · breaking changes (API/schema/RLS) · security surface.
3. **Post-build review fan-out** (≥MEDIUM or 5+ files) — parallel `verify` + `code-review`.

## Structured output (required)

Each parallel agent returns a fixed shape — no free-form essays:

```
Dimension: <name>
Status:    PASS | CONCERN | FAIL
Findings:  <bullets>
Confidence:<low|med|high>
```

## Synthesis rules

- Agreements first, then contradictions.
- The orchestrator **never silently resolves** a contradiction — it surfaces it.
- Any FAIL is surfaced to the user.
- **Partial failure:** if a subagent times out / is BLOCKED, proceed with available
  results and name the missing dimension.

## Durability

Fan-out output is **ephemeral** unless the user asks for a durable report or it feeds
WRITE-BACK. This is deliberate anti-clutter.

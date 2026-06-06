# Agent Memory — Loop C (per-agent learned facts)

Owner: every agent. Each specialist accumulates domain-specific learnings as gbrain
pages under a reserved namespace, recalled at the start of its work.

## Namespace convention

```
agent-memory/<agent>/<topic>
```

Examples:
- `agent-memory/ship/flaky-tests` — tests that flake; how to stabilize
- `agent-memory/backend/rls-gotchas` — Supabase RLS pitfalls hit before
- `agent-memory/design/brand-violations` — slop patterns caught in review
- `agent-memory/eng/failure-patterns` — recurring bug shapes + root causes

## Per-project boundary (the SOURCE is the project)

Agent memory is **per-project by default**. Each installed project is its own isolated
gbrain source, so `agent-memory/<agent>/<topic>` written there does NOT surface in other
projects — an `@backend` RLS gotcha learned on one app's source stays with that app.

- **Project-scoped (default):** written to the active project's isolated source. The
  *source* is the boundary — never encode the project name in the slug.
- **Cross-cutting (opt-in):** genuinely project-agnostic lessons go to the shared
  `default` source as `agent-memory/_shared/<agent>/<topic>`.

## How it works (memory contract verbs — see harness/memory.md)

### Recall (start of work)
Before acting, an agent recalls its own memory:
```
recall_agent_memory(self, topic)
```
(gbrain mapping: `gbrain query "agent-memory/<self>/<topic>" --source <project>`)
e.g. `@ship` recalls `agent-memory/ship/flaky-tests` before trusting a green run.

### Store (end of work, via WRITE-BACK)
When an agent learns something reusable, it proposes (in Loop A's numbered list):
```
remember_agent_memory(self, topic, md)
```
(gbrain mapping: `gbrain put "agent-memory/<self>/<topic>" --source <project>`, verified
with `gbrain get`). Promote to `agent-memory/_shared/...` only when project-agnostic.

## What belongs here (vs elsewhere)

| Goes in agent-memory (C) | Goes in central memory (A) | Goes in refine (B) |
|---|---|---|
| flaky-test list, failure patterns, domain gotchas | architecture, decisions, cross-repo knowledge | a change to how the agent *always* behaves |

## Graduation — when a landmine becomes a skill (Loop C → skill)

A landmine that recurs **3+ times** is no longer a note — it's a pattern worth a reusable
skill. The `evolve-memory` skill (owned by `@helm`) clusters recurring agent-memory pages
+ high-weight gbrain takes/facts and proposes a `SKILL.md` from the cluster (user-approved).

```
observation → landmine (agent-memory) → recurrence (3+) → cluster → proposed skill
```

This is gbrain-native: confidence comes from gbrain's existing `weight` + recency on
takes/facts — no separate instinct/TTL store. One-offs stay landmines; only repeated
lessons graduate. See `skills/evolve-memory/SKILL.md`.

## Why gbrain, not gitignored flat files

Vibecode stores agent memory in gitignored `.claude/agent-memory/` (local, ephemeral,
per-machine). Helmsman stores it in gbrain — searchable, cross-machine, and it survives
re-installs. `@ship` on your laptop and on the VPS share the same flaky-test memory.

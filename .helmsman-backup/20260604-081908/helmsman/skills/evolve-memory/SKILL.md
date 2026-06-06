---
name: evolve-memory
version: 1.0.0
description: gbrain-native learning graduation. Owned by @helm. Clusters recurring agent-memory landmines (and gbrain takes/facts) into a proposed reusable skill — the "observation -> landmine -> skill" pipeline. Use when an agent keeps re-learning the same lesson, "turn our learnings into a skill", "what patterns have we repeated", or periodically to harvest durable knowledge into skills.
---

# evolve-memory — graduate recurring learnings into skills

Owned by `@helm`. The harness gets smarter by turning **repeated** lessons into reusable
skills. Unlike ECC's flat-file instinct system, this is **gbrain-native**: we already have
agent-memory pages + takes/facts (with weight/confidence), so we cluster those instead of
maintaining a separate confidence store.

> **Run clustering/scoring at the `evolver` tier (`light`).** Graduation quality is
> tier-insensitive — producing the delta is flat across model tiers (see
> `harness/model-routing.md` role axis). Don't burn the solve tier on it.

> **Benefit ceiling (prune aggressively).** On a strong solver, marginal skills yield
> *diminishing* benefit AND raise adherence load (more to follow = more to drift from — see
> `harness/adherence.md`). The ≥0.7 / 3+ bar is the *quality* brake; this is the *bloat*
> brake. Favor fewer, higher-signal artifacts over a large library.

## The pipeline (observation → skill)

```
1. OBSERVATION   an agent hits something non-obvious during work
2. LANDMINE      it writes agent-memory/<agent>/<topic> (Loop C) — local + gbrain
3. RECURRENCE    the same/similar landmine shows up 3+ times (across tasks/projects)
4. CLUSTER       evolve-memory groups them by similarity
5. PROPOSE       it drafts a SKILL.md from the cluster — user approves
6. SKILL         the lesson is now a first-class, discoverable skill
```

## When to run
- An agent keeps re-learning the same thing (you notice repetition).
- Periodically (e.g. a monthly harvest) to promote durable knowledge.
- "turn our learnings into a skill" / "what have we repeated."

## Procedure

### 1. Gather candidates (mode-aware — read `.helmsman/backend`)
- **gbrain mode:** `gbrain query "agent-memory" --source <project>` (and `_shared`) +
  `gbrain takes list --sort_by weight` for weighted, recurring decisions. Also read the
  local `process/context/` packs.
- **standalone mode:** read `process/agent-memory/<agent>/*.md` + `process/context/` packs +
  the file takes-ledger `process/takes/*.jsonl`. (No gbrain — files are the corpus.)

### 2. Cluster by similarity
Group landmines/takes that express the same underlying lesson (same trigger + same fix).

### 3. Score each cluster on a 0.3–0.9 confidence scale
`confidence = f(recurrence, weight/strength, recency)` — computed from whatever the active
mode tracks, no separate store:
- **gbrain mode:** recurrence = matching agent-memory pages; weight = gbrain take weight;
  recency = page effective_date.
- **standalone mode:** recurrence = how many `process/agent-memory/<agent>/*.md` files (or
  sections) mention the lesson; weight = ledger take weight if present; recency = file mtime.
Same 0.3–0.9 scale + ≥0.7 graduation threshold either way.

| Confidence | Meaning | Action |
|-----------|---------|--------|
| **0.3** | tentative (1–2 sightings, low weight) | stays a landmine; note it |
| **0.5** | moderate (a few sightings) | watch; not yet a skill |
| **0.7** | strong (3+ sightings, decent weight, recent) | **graduate candidate** — propose a skill |
| **0.9** | near-certain (many sightings, high weight, fresh) | strong graduate; high priority |

- **Raises confidence:** repeated observation, high take weight, recent recurrence,
  independent sources agreeing.
- **Lowers confidence:** a user correction/contradiction, no sightings for a long stretch,
  conflicting evidence.
- **Graduation threshold: ≥0.7.** Below that, it stays a landmine (don't over-promote
  one-offs). Rank clusters by confidence; take the strongest first.

### 4. Draft a proposed skill (don't install yet)
For the top cluster, draft `skills/<name>/SKILL.md`: name, description (as a routing
trigger), the procedure the lesson implies, evidence requirements. Cite the source
landmines/takes (slugs) so the provenance is clear.

### 5. User approves → install
On approval, write the skill, wire it into the relevant agent's `skills:` list, and note
in the source landmines that they graduated (so they're not re-clustered).

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Never fabricate a pattern** — a cluster must
cite ≥3 real source landmines/takes (slugs). If nothing has recurred 3+ times, say so:
"no clusters ready to graduate" is a valid, honest result.

## Evidence (what "done" must show)
- The candidate count + the clusters found (with member slugs).
- For any proposed skill: the draft path + the ≥3 source slugs it's built from.
- "No clusters ready" when that's the truth — do not invent a skill to seem productive.

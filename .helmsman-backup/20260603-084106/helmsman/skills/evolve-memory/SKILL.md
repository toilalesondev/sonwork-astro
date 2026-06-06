---
name: evolve-memory
description: gbrain-native learning graduation. Owned by @helm. Clusters recurring agent-memory landmines (and gbrain takes/facts) into a proposed reusable skill — the "observation -> landmine -> skill" pipeline. Use when an agent keeps re-learning the same lesson, "turn our learnings into a skill", "what patterns have we repeated", or periodically to harvest durable knowledge into skills.
---

# evolve-memory — graduate recurring learnings into skills

Owned by `@helm`. The harness gets smarter by turning **repeated** lessons into reusable
skills. Unlike ECC's flat-file instinct system, this is **gbrain-native**: we already have
agent-memory pages + takes/facts (with weight/confidence), so we cluster those instead of
maintaining a separate confidence store.

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

### 1. Gather candidates
Pull agent-memory + high-weight takes/facts from gbrain:
- `gbrain query "agent-memory" --source <project>` (and `_shared`).
- `gbrain takes list --sort_by weight` for weighted, recurring decisions.
Read the local `process/context/` packs too — recurring inline notes are candidates.

### 2. Cluster by similarity
Group landmines/takes that express the same underlying lesson (same trigger + same fix).
A cluster needs **3+ members** to graduate (one-offs stay as landmines — don't over-promote).

### 3. Score with what gbrain already gives us
Confidence = function of (count, take weight, recency). No separate TTL/confidence store —
gbrain's `weight` and recency ARE the signal. Rank clusters; take the strongest.

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

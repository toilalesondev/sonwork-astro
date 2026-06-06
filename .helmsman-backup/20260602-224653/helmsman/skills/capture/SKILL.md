---
name: capture
description: gbrain-native write-back (Loop A). After non-trivial work, @brain analyzes the session and proposes a numbered list of gbrain writes (pages/facts/takes) plus plan archival, backlog capture, and agent-memory updates. User approves; @brain writes and verifies each with gbrain get, then regenerates the process/ ledger. Replaces the old brv-based capture entirely.
---

# capture — gbrain-native write-back (Loop A)

The harness-learns mechanic. Owned by `@brain`. Runs after meaningful work. This
**replaces** the old brv `curate → dream → sync` chain — knowledge goes straight to
gbrain.

## Trigger

A decision was made, non-obvious behavior discovered, a non-trivial bug fixed, a new
pattern established, or a plan finished. Skip for typos / copy / config bumps.

## Procedure (6 steps)

### 1. Analyze the session
What changed, what was decided, what deviated from the plan, did any agent fail the
flow (→ Loop B), what's worth remembering across repos.

### 2. Propose a numbered list (nothing written yet)
1. **Pages** — `gbrain put <slug>` for durable knowledge. Slug convention:
   `projects/<name>/<area>/<topic>` (e.g. `projects/perfeat/landing/share-modal`).
2. **Facts** — structured claims about entities (`gbrain_extract_facts_ide`).
3. **Takes** — weighted decisions with rationale.
4. **Plan archival** — `process/active/<plan>` → `process/completed/`.
5. **Backlog** — deferred TODOs → `process/backlog/`.
6. **Agent-memory** (Loop C) — `gbrain put "agent-memory/<agent>/<topic>" --source
   <project>` (per-project; the source is the boundary). Promote to
   `agent-memory/_shared/<agent>/<topic>` only for cross-cutting lessons.
7. **Agent-refine** (Loop B) — if a flow failure was seen, the responsible agent
   proposes a definition edit.

### 3. User approves
e.g. "1 yes, 2 no, 3 yes". Only approved items proceed.

### 4. Write
Execute approved `gbrain put` / facts / takes.

### 5. Verify (mandatory)
`gbrain get <slug>` for each write. Never report "saved" without reading it back — the
CLI/MCP response can succeed while the page is empty.

### 6. Regenerate process/ + report
Regenerate the affected `process/{active,completed,backlog}` files so the
human-readable ledger matches gbrain. Report slugs written, plans archived, items
deferred.

## Why gbrain, not brv

gbrain is semantic, graph-linked, and cross-machine. Knowledge written from
perfeat-landing is recallable from perfeat-mobile and the VPS. brv was project-local
and duplicated this at extra token cost — it is retired from the flow.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- Report the `gbrain get` read-back of each written slug — 'saved' without read-back is not done.

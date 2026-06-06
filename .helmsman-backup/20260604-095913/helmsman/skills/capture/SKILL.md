---
name: capture
version: 1.1.0
description: Write-back (Loop A), mode-aware. The agent that did the work (or @helm in a curation pass) analyzes the session and proposes a numbered list of memory writes (pages/facts/takes/agent-memory) plus plan archival + backlog. User approves; the agent writes and verifies each by read-back, then regenerates the process/ ledger. Works in BOTH modes — standalone (write process/ files) and gbrain (write gbrain + mirror). Memory is a shared capability — see harness/memory.md.
---

# capture — write-back (Loop A), mode-aware

The harness-learns mechanic. Run by **the agent that did the work** (memory is a shared
capability, not an agent — see `harness/memory.md`); `@helm` runs it in cross-cutting
curation passes. Runs after meaningful work.

> **Run write-back at the `evolver` tier (`light`).** Producing the memory delta is flat
> across model tiers (see `harness/model-routing.md` role axis) — the solve tier was for the
> work; the capture that follows is cheap.

## Step 0 — read the mode (`.helmsman/backend`)

Capture works in **both** first-class modes; how you "write" + "verify" depends on the mode:

| | STANDALONE (`backend=file`) | GBRAIN (`backend=gbrain`) |
|---|---|---|
| **write a page** | append/update `process/context/<domain>/all-<domain>.md` | `gbrain put <slug>` AND update the local pack |
| **agent-memory** | write `process/agent-memory/<agent>/<topic>.md` | `gbrain put "agent-memory/<agent>/<topic>" --source <project>` + local |
| **takes** | append a row to `process/takes/<holder>.jsonl` | gbrain takes (typed/weighted) + the ledger |
| **verify** | re-read the file (`cat`/Read) | `gbrain get <slug>` AND the file |

The verb names never change — only the backend action does. In gbrain mode, knowledge goes
straight to gbrain (this replaces the old brv `curate → dream → sync` chain).

## Trigger

A decision was made, non-obvious behavior discovered, a non-trivial bug fixed, a new
pattern established, or a plan finished. Skip for typos / copy / config bumps.

## Procedure (6 steps)

### 1. Analyze the session
What changed, what was decided, what deviated from the plan, did any agent fail the
flow (→ Loop B), what's worth remembering across repos.

### 2. Propose a numbered list (nothing written yet)
1. **Pages** — durable knowledge. gbrain: `gbrain put <slug>` (slug
   `projects/<name>/<area>/<topic>`). standalone: the `process/context/<domain>/` pack.
2. **Facts** — structured claims about entities (gbrain mode only; skip in standalone).
3. **Takes** — weighted decisions with rationale (gbrain takes OR `process/takes/*.jsonl`).
4. **Plan archival** — `process/active/<plan>` → `process/completed/` (both modes).
5. **Backlog** — deferred TODOs → `process/backlog/` (both modes).
6. **Agent-memory** (Loop C) — gbrain: `gbrain put "agent-memory/<agent>/<topic>" --source
   <project>`; standalone: `process/agent-memory/<agent>/<topic>.md`. Per-project; promote
   to `_shared/` only for cross-cutting lessons (gbrain mode).
7. **Agent-refine** (Loop B) — if a flow failure was seen, the responsible agent
   proposes a definition edit (both modes — it's a file/git edit).

### 3. User approves
e.g. "1 yes, 2 no, 3 yes". Only approved items proceed.

### 4. Write (per the mode from Step 0)
- **standalone:** write the `process/` files, then `git add`/commit is the user's call.
- **gbrain:** execute approved `gbrain put` / facts / takes AND update the local pack.

### 5. Verify (mandatory — Rule 1)
Read back EACH write:
- **standalone:** re-read the file you wrote (Read/`cat`) — confirm the content landed.
- **gbrain:** `gbrain get <slug>` for each (the CLI/MCP response can succeed while the page
  is empty) AND confirm the local pack updated.
Never report "saved" without the read-back.

### 6. Regenerate process/ + report
Regenerate the affected `process/{active,completed,backlog}` files so the
human-readable ledger matches gbrain. Report slugs written, plans archived, items
deferred.

## Mode notes

- **gbrain mode:** knowledge is semantic, graph-linked, cross-machine — written from one
  project, recallable from another and any machine sharing the brain. (Replaces brv.)
- **standalone mode:** `process/` IS the durable memory — portable, offline, git-versioned.
  No cross-project recall (that's gbrain mode's edge), but fully self-contained.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- Report the read-back of each write (file re-read in standalone; `gbrain get` in gbrain) —
  'saved' without read-back is not done.

## Validate (final step)

After producing the write-back report, prove it's a proper proposal with read-back:
```
node .helmsman/skills/capture/scripts/validate-capture.mjs <path/to/report.md>
```
Checks: numbered proposal (approvable item-by-item) + each write has a read-back
confirmation — `gbrain get` (gbrain mode) OR a file re-read (standalone) (Rule 1). Fix and
re-run until green.

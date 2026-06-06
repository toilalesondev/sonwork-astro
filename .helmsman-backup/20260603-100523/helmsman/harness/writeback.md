# Write-Back — Loop A (two-tier memory)

Owner: `@brain`. Runs after a non-trivial BUILD/SHIP. This is the "harness learns"
mechanic. It writes to **both** memory tiers (see `memory.md`): the **local** domain pack
(`process/context/<domain>/`) for instant in-session reuse, AND **gbrain** for durable,
searchable, cross-project knowledge. Local keeps the agent fast; gbrain makes it compound.

## Trigger

After meaningful work completes (a decision was made, non-obvious behavior discovered,
a non-trivial bug fixed, a new pattern established, or a plan finished). Skip for
typos, copy tweaks, config bumps.

## Procedure (6 steps)

### 1. Analyze the session
What changed, what was decided, what deviated from the plan, did any agent fail the
flow (feeds Loop B), what's worth remembering across repos.

### 2. Propose a numbered list
Categorize every proposed write by target. Present as a numbered list — nothing is
written before approval:

> These are the `remember`/`write_back` contract verbs (see `harness/memory.md`).
> The gbrain mapping is shown concretely below; a future backend changes only memory.md.

1. **pages** (`remember`) — write to BOTH tiers: (a) update the local domain pack
   `process/context/<domain>/all-<domain>.md`, AND (b) `gbrain put <slug>` for durable
   knowledge. Use clear slugs: `projects/<name>/<area>/<topic>`.
2. **gbrain facts** — `gbrain` extract for structured claims about entities.
3. **gbrain takes** — typed/weighted decisions with rationale.
4. **Plan archival** — move `process/active/<plan>` → `process/completed/`.
5. **Backlog capture** — deferred TODOs → `process/backlog/`.
6. **Agent-memory** (Loop C) — per-agent learnings → `agent-memory/<name>/...`.
7. **Agent-refine** (Loop B) — if a flow failure was seen, the responsible agent
   proposes an edit to its own definition.

### 3. User approves
You respond e.g. "1 yes, 2 no, 3 yes, …". Only approved items proceed.

### 4. Write
Execute approved writes. **Verify each** with `gbrain get <slug>` — never claim a
write landed without reading it back.

### 5. Update the local tier + ledger
`process/context/` is the **live local memory** (not just a mirror) — update the relevant
domain pack(s) so the next task reads the new knowledge instantly. Also update the
`active/completed/backlog` ledger so the human-readable record matches. (gbrain is the
durable tier; `process/context/` is the fast tier — keep both current.)

### 6. Report
List what was written (with slugs), what was archived, what was deferred.

## Why gbrain, not flat files

gbrain knowledge is semantically searchable, graph-linked, and shared across every
repo and machine. The 100th feature inherits everything from the first 99 — and
cross-cutting lessons surface across every project source, not siloed per repo.

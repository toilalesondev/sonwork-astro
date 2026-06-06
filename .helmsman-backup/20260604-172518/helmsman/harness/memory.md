# Memory Contract — Two First-Class Modes

**Memory is a shared capability, not an agent.** Every agent recalls before acting and
runs write-back after its own work — directly, no hand-off to a "memory agent" (that relay
loses fidelity across isolated context windows). The discipline lives in this contract +
`writeback.md`, inherited by all agents via `operating-rules.md`. The cross-cutting memory
ops that AREN'T any one builder's job — curation/dedup, cross-repo recall, Loop-E
calibration — are owned by **`@helm`** (the fleet owner).

## READ `.helmsman/backend` FIRST — it names the mode

Helmsman runs in **one of two first-class modes**, chosen at install (`install.sh --mode`)
and recorded in **`.helmsman/backend`** (`gbrain` | `file`). Agents read this flag (the
session-hydrate hook also injects it) and behave natively for the mode. **Both modes work
great** — `file` is not a degraded fallback, it's a full portable mode.

Agents call **memory verbs**, not a specific backend; the verb→action mapping is by mode:

### Mode: STANDALONE (`backend=file`) — `process/` IS the source of truth
- Zero-dependency, offline, portable, clone-and-go. The local tree IS the durable memory.
- `recall` = read `process/context/` (+ `process/agent-memory/`). `remember`/`write_back` =
  write those files + `git commit`. Calibration uses the file takes-ledger
  (`process/takes/`, see `calibration.md`). **No gbrain calls — ever.**

### Mode: GBRAIN (`backend=gbrain`) — two tiers, durable + cross-project
- **Tier 1 — LOCAL** (`process/context/`): instant, offline, survives compaction. The live
  working set read on every task.
- **Tier 2 — DURABLE** (gbrain): semantic search, graph links, shared across every machine
  and project. The 100th feature inherits the first 99.
- Tiers are **complementary**: read local first then gbrain for depth; write lands in
  **both**; hydrate refreshes local from gbrain on session start.

> Pick the mode at install. `--mode standalone` for a portable single-repo brain; `--mode
> gbrain` for durable cross-project memory. The flow, agents, routing, and the local
> `process/` tier are identical in both — only the durable layer differs.

## The verbs (what agents reference)

| Verb | Meaning |
|------|---------|
| `recall(query)` | retrieve prior knowledge before acting (local first, then gbrain) |
| `remember(slug, md)` | store durable knowledge in BOTH tiers (then verify it landed) |
| `recall_agent_memory(agent, topic)` | retrieve an agent's own learned landmines |
| `remember_agent_memory(agent, topic, md)` | store an agent's landmine (per-project) |
| `write_back(numbered_list)` | Loop A — the agent who did the work proposes + (on your approval) commits memory writes to both tiers, verified by read-back |

## Tier 1 — LOCAL (`process/context/`)

A domain-routed knowledge tree (see `context-routing.md`):

```
process/context/
├── all-context.md          # router — points to the domain packs, loaded first
├── <domain>/all-<domain>.md  # one pack per domain (backend, uxui, tests, …)
```

| Verb | Local action |
|------|--------------|
| `recall` | read `all-context.md` router → open the relevant domain pack(s) |
| `remember` | append/update the right `process/context/<domain>/all-<domain>.md` |
| `recall_agent_memory` | read `process/agent-memory/<agent>/<topic>.md` (file backend) |
| `remember_agent_memory` | write `process/agent-memory/<agent>/<topic>.md` |

Local is the **default read** every task — it's free and instant. It is the truth the
agent works from in-session.

## Tier 2 — DURABLE (gbrain)

| Verb | gbrain command / MCP |
|------|----------------------|
| `recall` | `gbrain query "..."` · MCP `gbrain_query_ide` (for depth / cross-project) |
| `remember` | `gbrain put <slug>` · MCP `gbrain_put_page_ide` → **verify with `gbrain get <slug>`** |
| `recall_agent_memory` | `gbrain query "agent-memory/<agent>/<topic>" --source <project>` |
| `remember_agent_memory` | `gbrain put "agent-memory/<agent>/<topic>" --source <project>` |
| `write_back` | numbered `gbrain put`/facts/takes, user-approved, each verified by read-back |

gbrain is **per-project by source**: each installed project is its own isolated source
(`gbrain sources add <project> --path <repo>`). A lesson on one project's source does NOT
surface on another's. Cross-cutting lessons go to the shared `default` source as
`agent-memory/_shared/<agent>/<topic>`.

## How the two tiers stay in sync

- **write_back (Loop A)** writes to BOTH: the local domain pack AND gbrain — each verified.
  The agent that did the work runs it (it has the context); no relay to a memory agent.
- **session-hydrate hook** (see `../hooks/`) re-injects the local contract + active plan on
  session start / after compaction; deeper, `@helm` can pull gbrain → refresh local packs
  during a curation pass.
- **`process/` is NOT a throwaway mirror** — it is the live local tier. gbrain is the
  durable tier. Both are first-class.

## Footgun guard (sources)

- **Never** run bare `gbrain sync --repo <path>` — it repoints the *default* source.
  Always `gbrain sync --source <project-id>`.
- Before any sync, assert the default source still points at the shared brain home.

## The curation pass (owned by `@helm` — keep the corpus clean)

Per-task write-back is every agent's job; keeping the *whole corpus* healthy is `@helm`'s
cross-cutting job. Run this **periodically** (e.g. weekly, or when memory feels noisy /
after a burst of write-backs), per source:

### When to run
- A weekly/monthly cadence, OR after lots of write-backs, OR when recall returns dups /
  stale facts, OR on demand ("clean up memory", "what have we repeated").

### Procedure (read-mostly; @helm proposes, you approve destructive edits)
1. **Recall the corpus** — `gbrain query "agent-memory"` + browse recent pages per source.
2. **Dedup** — find pages saying the same thing. Keep the clearest; supersede/forget the
   rest (`gbrain forget` / mark superseded). Never silently delete — propose, you approve.
3. **Slug hygiene** — enforce `projects/<p>/<area>/<topic>` + `agent-memory/<agent>/<topic>`;
   fix stragglers so recall stays predictable.
4. **Prune stale** — facts contradicted by newer reality → forget/supersede with a reason.
5. **Graduate (evolve-memory)** — cluster recurring landmines; **a cluster of 3+ at
   confidence ≥0.7 → propose a reusable skill** (`gbrain forget` / mark superseded). Below 0.7 stays a landmine. (See
   `agent-memory.md` + `skills/evolve-memory`.) **Benefit ceiling:** on a strong solver,
   marginal skills give diminishing benefit AND raise adherence load (more to follow = more
   to drift from — see `adherence.md`). Prune toward fewer, higher-signal artifacts.
6. **Calibrate (Loop E)** — `gbrain takes scorecard` on resolved takes (accuracy + Brier);
   write the profile back. Honest "not enough resolved takes yet" when the source is young.
7. **Report** — what was deduped/pruned/graduated, the calibration read, slugs touched.

### Evidence (Rule 1)
Show the before/after (dup pages collapsed, slugs fixed), the proposed skill's source
slugs (≥3), and the real `takes scorecard` output (or the honest empty result).

## Curation pass in STANDALONE mode (`backend=file`)

The curation pass above is written for gbrain. In standalone mode it runs entirely on files
(same shape, no gbrain calls):
1. **Recall the corpus** — read `process/context/` packs + `process/agent-memory/<agent>/*.md`.
2. **Dedup** — find packs/notes saying the same thing; merge into the clearest, delete the
   rest (propose, you approve). It's a normal file edit + `git commit`.
3. **Slug/path hygiene** — keep the `process/context/<domain>/` + `process/agent-memory/<agent>/`
   layout predictable.
4. **Prune stale** — delete notes contradicted by newer reality (git history is the audit trail).
5. **Graduate (evolve-memory)** — cluster by file-signal recurrence (mentions across
   `process/agent-memory/`) + recency (file mtime); 3+ recurrences → propose a skill.
6. **Calibrate (Loop E)** — score the file takes-ledger (`process/takes/`) — see `calibration.md`.
7. **Report** — what was merged/pruned/graduated + the calibration read.

> The verb names never change across modes — only this contract's backend mapping does
> (see the two mode sections at the top). `process/` is the durable source of truth in
> standalone mode, and the fast tier (mirrored to gbrain) in gbrain mode.

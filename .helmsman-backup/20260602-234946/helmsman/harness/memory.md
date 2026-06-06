# Memory Contract

Agents call **memory verbs**, not a specific backend. This doc maps each verb to the
active backend. Today the backend is **gbrain**; a future file/markdown backend slots
in here without touching any agent definition.

## The verbs (what agents reference)

| Verb | Meaning |
|------|---------|
| `recall(query)` | retrieve prior knowledge before acting |
| `remember(slug, md)` | store durable knowledge (then verify it landed) |
| `recall_agent_memory(agent, topic)` | retrieve an agent's own learned landmines |
| `remember_agent_memory(agent, topic, md)` | store an agent's landmine (per-project) |
| `write_back(numbered_list)` | Loop A — propose + (on approval) commit memory writes |

## Backend mapping — gbrain (active)

| Verb | gbrain command / MCP |
|------|----------------------|
| `recall` | `gbrain query "..."` · MCP `gbrain_query_ide` |
| `remember` | `gbrain put <slug>` · MCP `gbrain_put_page_ide` → **verify with `gbrain get <slug>`** |
| `recall_agent_memory` | `gbrain query "agent-memory/<agent>/<topic>" --source <project>` |
| `remember_agent_memory` | `gbrain put "agent-memory/<agent>/<topic>" --source <project>` |
| `write_back` | numbered `gbrain put`/facts/takes, user-approved, each verified by read-back |

## Per-project rule (the boundary is the SOURCE)

- Each installed project is its own **isolated gbrain source** (`gbrain sources add
  <project> --path <repo>`). Agent memory written there is **per-project** — a lesson
  learned on one project's source does NOT surface on another's.
- Slug convention: `agent-memory/<agent>/<topic>` (the project is the *source*, never
  encoded in the slug).
- **Cross-cutting escape hatch:** genuinely project-agnostic lessons go to the shared
  `default` source as `agent-memory/_shared/<agent>/<topic>`.
- Default every agent-memory write to the **active project source**. Promote to
  `_shared` only when the lesson is explicitly judged project-agnostic.

## Footgun guard (sources)

- **Never** run bare `gbrain sync --repo <path>` — it repoints the *default* source.
  Always `gbrain sync --source <project-id>`.
- Before any sync, assert the default source still points at the shared brain home.

## Future backend slot (not built yet)

A file/markdown backend (zero-dep, for clone-and-go without gbrain) would map:
`recall` = ripgrep over `process/context/*.md`; `remember` = write
`process/context/<slug>.md`; agent memory = `process/agent-memory/<agent>/<topic>.md`
(inherently per-project — it lives in the repo). When built, only this file changes;
agents keep calling the same verbs.

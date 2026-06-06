# Context Routing — Tier 1 local memory (token discipline)

The local memory tier (`process/context/`) is **domain-routed**, not one giant file. The
agent loads only the packs relevant to the task — so context stays lean and the agent
stays sharp. (Borrowed from the vibecode model; paired with gbrain as the durable tier.)

## The shape

```
process/context/
├── all-context.md              # ROUTER — read this first, always
├── backend/all-backend.md      # API, DB, auth, schema, RLS
├── uxui/all-uxui.md            # components, design tokens, layout patterns
├── tests/all-tests.md          # test runners, commands, fixtures, flaky notes
├── deploy/all-deploy.md        # CI/CD, hosting, env, rollbacks
└── <domain>/all-<domain>.md    # any domain with 3+ durable docs gets its own pack
```

## How routing works

1. The agent reads **`all-context.md`** (the router) at the start of a task. It's short:
   a map of which domain packs exist and one line on what each covers.
2. The agent matches the task to the relevant domain(s) and opens **only those packs**.
   ("Add a webhook" → `backend/` pack. "Restyle the nav" → `uxui/` pack.)
3. It does NOT slurp every pack — that wastes context. The router exists precisely so the
   agent loads the minimum useful set.

## When to create a new domain pack

Promote a domain to its own pack once it has **3+ durable docs/notes**. Until then, keep
it inline in `all-context.md`. Don't over-split — a pack per micro-topic is noise.

## What goes in a pack (durable, not transient)

- Architecture + conventions for that domain (import aliases, patterns, gotchas).
- Decisions and their rationale (so they're not re-litigated).
- Landmines (what broke before, how it was fixed).

NOT in packs: secrets (blocked by the privacy hook), one-off task chatter, raw logs.

## Sync with gbrain (Tier 2)

- A durable lesson is written to BOTH the right pack AND gbrain (see `writeback.md`).
- `all-context.md` packs are the **fast local read**; gbrain is the **deep/cross-project
  read**. When local is thin (fresh clone), `@helm` (curation) hydrates packs from gbrain.

## Keep the router honest

When a pack is added/removed, update `all-context.md` so the map matches reality. A stale
router sends the agent to the wrong pack — worse than no router.

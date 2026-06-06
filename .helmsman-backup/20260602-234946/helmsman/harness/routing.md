# Routing

Two routing mechanisms, both pointing to the same specialists:

1. **Native auto-routing (the resolver).** OpenCode auto-dispatches to a subagent by its
   `description` field — each Helmsman agent's description is written as a routing trigger
   ("Use for X / NOT for Y"). The primary (Build/Plan) agent selects the best-matching
   specialist automatically. This is memory-agnostic: routing is by description only; the
   selected agent then uses whatever memory backend exists (gbrain or fallback).
2. **Direct `@mention` (you, sovereign).** `@backend add an RLS policy` goes straight to
   @backend and **overrides auto-routing** — your explicit call always wins. If you point
   the wrong agent, its **misroute-guard** (Rule 6) flags it and names the right one
   rather than doing the work blind.

The table below is the human/LLM-readable SPEC of the intent→agent map. Actual dispatch
is the host's native description-matching; this doc keeps the mapping legible + the
precedence rules.

## Step 0 — skill discovery

Scan `skills/` names and match keywords from the request. Attach candidate skills to
the routed specialist's prompt. Never silently skip a relevant skill.

## Step 0 — skill discovery

Scan `skills/` names and match keywords from the request. Attach candidate skills to
the routed specialist's prompt. Never silently skip a relevant skill.

## Intent → agent

| Intent (keywords) | Phase | Route to |
|-------------------|-------|----------|
| idea, "what if", "should we", brainstorm, worth building | IDEATE | `@product` |
| understand, how does X work, where is, explain, what changed | EXPLORE | `@scout` (this repo) / `@brain` (cross-repo, code graph) |
| build/add/implement a UI, page, component, design, layout | PLAN+BUILD | `@design` |
| build/add/implement logic, function, refactor, test, fix bug | PLAN+BUILD | `@eng` |
| DB, schema, migration, API, endpoint, RLS, auth, **Supabase**, edge function, storage | PLAN+BUILD | `@backend` |
| mobile, React Native, Expo, iOS, screen, device, app build | PLAN+BUILD | `@mobile` |
| ship, deploy, PR, merge, release | SHIP | `@ship` |
| QA, test the site, broken, error, 500, investigate, canary, benchmark, health | VERIFY/MONITOR | `@ship` |
| remember, save this, what do we know about, recall | MEMORY | `@brain` |
| harness setup, add/edit an agent or skill, register a gbrain source, install Helmsman, gbrain doctor/health, fleet/daemon ops, "how is Helmsman set up" (management) | HARNESS | `@helm` |
| general knowledge / opinion / "what is X" (not about this repo) | — | orchestrator answers directly (no specialist) |

## Precedence (when multiple intents match)

1. **Active plan** in `process/active/` → resume it first.
2. **Explicit agent call** (`@backend …`) → obey immediately.
3. **General / conceptual / opinion** (not about code/plan/memory/harness) → orchestrator
   answers directly; do not force-route.
4. **Bug/debug** → `@ship` investigate before feature routing.
5. **Harness / fleet management** (add agent, register source, gbrain health) → `@helm`.
6. **Backend/data surface** (DB/RLS/Supabase) → `@backend` (highest-risk domain wins
   over generic eng).
7. **Feature request** → domain builder by surface (UI→design, logic→eng, data→backend,
   mobile→mobile).
8. When still ambiguous → ask ONE clarifying question (see `intent-clarification.md`).

## Cross-domain work

If a feature spans domains (e.g. a Supabase-backed mobile screen), the orchestrator:
1. Scores parallel fan-out (`parallel-fan-out.md`).
2. Routes EXPLORE/PLAN to each affected domain owner.
3. Names a lead builder for the integration seam.

## Old-name aliases (transition)

`@matt`→`@eng`, `@ive`→`@design`, `@gstack`→`@product`+`@ship` (route by sub-intent:
ideation→product, ship/QA→ship), `@evera`→`@scout`, `@tan`→`@brain`, `@andy`→retired
(memory now `@brain`).

# Routing

The orchestrator's job: read your goal → pick the ONE specialist who owns that kind of
work → hand it off. This doc is the human/LLM-readable SPEC of that decision. Actual
dispatch on opencode/Claude is the host's native description-matching; this keeps the map
legible and the precedence explicit.

## Two routing mechanisms

1. **Native auto-routing (the resolver).** The host auto-dispatches to a subagent by its
   `description` field — each agent's description is written as a routing trigger
   ("Use for X / NOT for Y"). Memory-agnostic: routing is by description; the selected
   agent then uses whatever memory backend exists (gbrain or local fallback).
2. **Direct `@mention` (you, sovereign).** `@backend add an RLS policy` goes straight to
   @backend and **overrides** auto-routing. If you point the wrong agent, its
   **misroute-guard** (Rule 6) flags it and names the right one rather than acting blind.

## Step 0 — skill discovery

Before routing, scan available skills and match keywords from the request. Attach the
candidate skills to the routed specialist's prompt. Never silently skip a relevant skill.

## Intent → agent (the 13-agent map)

| Intent (keywords) | Phase | Route to |
|-------------------|-------|----------|
| idea, "what if", "should we", brainstorm, worth building, PRD | IDEATE | `@product` |
| understand, how does X work, where is, explain, what changed | EXPLORE | `@scout` (this repo) / `@brain` (cross-repo, code graph) |
| build/add a UI, page, component, design, layout, visual polish | PLAN+BUILD | `@design` |
| build/add logic, function, refactor, test, fix a (non-data) bug | PLAN+BUILD | `@eng` |
| DB, schema, migration, API, endpoint, RLS, auth, **Supabase**, edge function, storage, billing-data | PLAN+BUILD | `@backend` |
| mobile, React Native, Expo, iOS, screen, device, app build | PLAN+BUILD | `@mobile` |
| ship, deploy, PR, merge, release | SHIP | `@ship` |
| QA, test the site, broken, error, 500, investigate, canary, benchmark, health | VERIFY/MONITOR | `@ship` |
| remember, save this, what do we know about, recall | MEMORY | `@brain` |
| marketing, SEO, content, launch post, blog, outreach copy, brand voice, "tell the story" | GROWTH | `@growth` |
| billing, subscriptions, customers, refunds, admin, workspace ops, vendor/tool ops | OPS | `@ops` |
| triage my asks, draft this email/message, summarize, what should I focus on, keep me on-plan | CHIEF | `@chief` |
| metrics, analytics, numbers, dashboard read, market/competitor research, "what does the data say" | DATA | `@data` |
| harness setup, add/edit an agent or skill, register a gbrain source, install Helmsman, gbrain doctor/health, fleet/daemon ops | HARNESS | `@helm` |
| general knowledge / opinion / "what is X" (not about this repo/company) | — | orchestrator answers directly (no specialist) |

## Precedence (when multiple intents match — top wins)

1. **Active plan** in `process/active/` → resume it first.
2. **Explicit agent call** (`@backend …`) → obey immediately.
3. **General / conceptual / opinion** (not about code/plan/memory/company/harness) →
   orchestrator answers directly; do not force-route.
4. **Bug / "it's broken" / error** → `@ship` investigate (root cause) before feature routing.
5. **Harness / fleet management** → `@helm`.
6. **Money/data surface** (DB/RLS/Supabase/billing data) → `@backend` (highest-risk wins
   over generic @eng).
7. **Feature request** → domain builder by surface (UI→@design, logic→@eng, data→@backend,
   mobile→@mobile). **Business request** → @growth (story/users), @ops (running it),
   @data (numbers), @chief (your time/comms).
8. Still ambiguous → ask ONE plain-language question (see `intent-clarification.md`).

## Disambiguation (the tricky pairs)

- **@product vs @growth** — @product decides *what to build / is it worth it*; @growth
  *gets users + tells the story* of what exists. "Should we build a referral feature?" →
  @product. "Write the launch post for the referral feature" → @growth.
- **@eng vs @backend** — anything touching DB/auth/RLS/Supabase/billing-data → @backend
  (highest-risk wins). Pure client/logic → @eng.
- **@ops vs @backend** — @ops runs the *business* of billing (refunds, customer admin,
  vendor tools); @backend builds the *billing code/schema*. "Refund this customer" →
  @ops. "Add a subscriptions table with RLS" → @backend.
- **@data vs @scout** — @data analyzes *numbers/market*; @scout explores *the codebase*.
- **@chief vs everyone** — @chief never builds; it triages your asks, drafts your comms,
  summarizes, and routes the real work to the right specialist.

## Cross-domain work

If a feature spans domains (e.g. a Supabase-backed mobile screen), the orchestrator:
1. Scores parallel fan-out (`parallel-fan-out.md`).
2. Routes EXPLORE/PLAN to each affected domain owner.
3. Names a lead builder for the integration seam.

## Old-name aliases (transition)

`@matt`→`@eng`, `@ive`→`@design`, `@gstack`→`@product`+`@ship` (route by sub-intent:
ideation→product, ship/QA→ship), `@evera`→`@scout`, `@tan`→`@brain`.

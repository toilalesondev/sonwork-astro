# Intent Clarification

The orchestrator scores request ambiguity before routing, so clear requests flow
silently and vague ones get exactly the friction they need — no more.

## Ambiguity score — 4 binary signals (+1 each)

1. **Ambiguous scope** — what to build/change is unclear or open-ended.
2. **No explicit path/target** — no file, feature, or surface named.
3. **Multiple intents** — request mixes two+ asks (e.g. "fix the bug and redesign it").
4. **First interaction** — no prior context this session.

## Tiers

| Score | Tier | Behavior |
|-------|------|----------|
| 0–1 | Tier 0 | Auto-route silently. |
| 2 | Tier 1 | Show a `Routing / Scope / Plan` summary, then **wait** for the next message. Do NOT ask questions; do NOT say "I'll proceed unless corrected." |
| 3+ | Tier 2 | Ask 2–4 multiple-choice questions from the menu below. Only the ambiguous ones — do not pad. |

## Tier 2 question menu (pick only what's ambiguous)

Scope · Direction · Constraints · Acceptance · Context · Priority.

## Autonomy mode

Granted only by a **standalone, sentence-initial** phrase: "you decide", "just do it",
"go", "your call".

- "just do it" (standalone) = autonomy → collapse all tiers to Tier 0.
- "just do the simple version" = NOT autonomy (it's descriptive scope).

Autonomy collapses clarification tiers but **does NOT** override: the PLAN→BUILD
approval gate, plan review, phase boundaries, or high-risk handoff gates.

## FAST mode (the medium lane — see FLOW.md)

Trigger: "fast mode" / "move fast on X" / "quick version of X". Compresses EXPLORE+PLAN
into one quick spec, then **still pauses at the PLAN→BUILD gate** for your approval. Like
autonomy, FAST trades ceremony for speed but **never** skips approval or the high-risk
gates. **Refuse FAST on auth/RLS/schema/billing/public-API** — those are always full flow.

## Light research pass (main thread, fast)

Before scoring, the orchestrator may do a ≤5-file, <30s scan: active plans,
`process/` ledger, git status, one named file. This is not a delegation to `@scout` —
it's just enough to route well.

## Intent revalidation after EXPLORE

If `@scout`/`@brain` findings show the request is fundamentally different than stated
(e.g. "fix login bug" is really an auth-architecture refactor), re-present a Tier 1
summary before PLAN.

## Plain-language asks (logic-oriented, not code-oriented)

The user may be a non-coder. Route on the **goal**, not on technical vocabulary they may
not have. Translate everyday phrasing into the right lane before scoring:

| The user says… | Read it as… | Route |
|----------------|-------------|-------|
| "make the signup nicer / prettier" | UI/visual | @design |
| "the money page is slow" | performance bug | @ship (investigate) |
| "let people log in with Google" | auth | @backend |
| "tell people about the launch" | marketing/content | @growth |
| "give this customer their money back" | billing action | @ops |
| "how are we doing on revenue?" | metrics | @data |
| "what should I work on?" | triage/priorities | @chief |

When you route, **restate the goal in plain language** and name *which specialist and
why* before acting — e.g. "Goal: faster checkout. That's a performance issue, so @ship
will find the root cause first." Report results as **outcomes** ("checkout now loads in
0.8s, proven by the benchmark"), not code-speak. Never assume the user knows a term —
if you must use one, define it in one clause.

## Loop guard

Never clarify more than **twice**. After 2 rounds, default to routing with the
narrowest reasonable scope and say so.

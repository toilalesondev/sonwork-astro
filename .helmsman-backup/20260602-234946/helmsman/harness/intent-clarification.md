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

## Light research pass (main thread, fast)

Before scoring, the orchestrator may do a ≤5-file, <30s scan: active plans,
`process/` ledger, git status, one named file. This is not a delegation to `@scout` —
it's just enough to route well.

## Intent revalidation after EXPLORE

If `@scout`/`@brain` findings show the request is fundamentally different than stated
(e.g. "fix login bug" is really an auth-architecture refactor), re-present a Tier 1
summary before PLAN.

## Loop guard

Never clarify more than **twice**. After 2 rounds, default to routing with the
narrowest reasonable scope and say so.

---
name: challenge
description: Pre-flight adversarial review before a high-risk build. Combines a 5-persona debate (predict) with 12-dimension edge-case generation (scenario). Any builder (@eng, @design, @backend, @mobile) invokes it during PLAN on auth/RLS/schema/billing/public-API work. Produces a GO / CAUTION / STOP verdict and an edge-case table.
---

# challenge — pre-flight adversarial review

Run before building anything high-risk. Two parts: **predict** (personas debate) and
**scenario** (edge cases). Output feeds the plan's risk section and the risk-evidence
chain.

## When to run

High-risk surfaces: auth, RLS, schema/data migration, billing, public API, destructive
writes. Optional on lower-risk work. Skip for trivial changes.

## Part 1 — Predict (5-persona debate)

Five personas analyze the proposed change independently, then debate conflicts:

1. **Architect** — coupling, scale, blast radius, does it fit existing patterns?
2. **Security** — attack surface, auth bypass, RLS holes, secret exposure.
3. **Performance** — N+1, latency, unbounded queries, missing indexes.
4. **UX** — accessibility, error states, edge inputs, confusing flows.
5. **Devil's Advocate** — hidden assumptions, a simpler alternative, "why build this?".

After independent analysis, surface conflicts and produce:

```
Verdict: GO | CAUTION | STOP
Risk table: [risk | severity | persona | mitigation]
```

**STOP triggers:** auth/RLS bypass with no mitigation, fundamental design
incompatibility, N+1 explosion, or a false assumption that invalidates the approach.

## Part 2 — Scenario (12-dimension edge cases)

Decompose the feature across 12 dimensions; output a severity-classified table:

User Types · Input Extremes · Timing · Scale · State Transitions · Environment ·
Error Cascades · Authorization · Data Integrity · Integration · Compliance ·
Business Logic.

Each row: `[scenario | dimension | severity Critical/High/Med/Low | handling]`.

## Integration

- CAUTION/STOP items become constraints in `generate-plan`.
- Critical/High scenarios become test specs for `verify`.
- On STOP, do not proceed to BUILD — return to PLAN or escalate to the user.
- Feeds `risk-gate.json` for the risk-evidence chain.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- Write the GO/CAUTION/STOP verdict + risk table to `risk-gate.json` on high-risk work (Rule 1 evidence).

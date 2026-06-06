# Risk Evidence — Loop D (high-risk change chain)

Owner: the `@ship` gates (verify + review), with `@backend` for data/auth paths. For
high-risk changes, a structured evidence chain must be completed before the work is
called "done."

## High-risk triggers

A change is high-risk if it touches any of:
- **auth / RLS** (Supabase row-level security, permission checks)
- **schema / data migration** (destructive or shape-changing)
- **billing / payments**
- **public API contracts**
- **deploy / runtime config**
- **secrets / permissions**

## The chain

Each stage produces a JSON artifact under the plan's `reports/harness/` folder. Later
stages read earlier ones.

```
risk-gate.json
   → context-snippets.json
      → verification.json
         → review-decision.json
            → adversarial-validation.json   (when required)
```

| Artifact | Written by | Contents |
|----------|-----------|----------|
| `risk-gate.json` | PLAN / @backend | risk class, why, `mustStopBeforeFinalize: bool` |
| `context-snippets.json` | EXPLORE / @backend | the log/query/diff evidence proving the situation |
| `verification.json` | VERIFY (@ship) | exact commands run, manual checks, negative-path checks |
| `review-decision.json` | REVIEW-CODE (@ship) | GO / CAUTION / STOP + reasons |
| `adversarial-validation.json` | REVIEW-CODE | abuse cases, rollback test, trust-boundary probe |

## Stop state

If `risk-gate.json` sets `mustStopBeforeFinalize: true`, the work stays in a **stop
state** — SHIP is blocked — until the required downstream artifacts exist and
`review-decision.json` is GO.

## Supabase RLS — the canonical case

Adding/altering an RLS policy is high-risk by default:
1. `risk-gate` = auth, mustStop = true
2. `context-snippets` = the policy SQL + the tables/roles it governs
3. `verification` = tested as the intended role AND as a role that should be DENIED
   (the negative path is mandatory)
4. `review-decision` = GO only if both identity AND permission are enforced
5. `adversarial-validation` = attempt the access that should fail; confirm it fails

This is exactly where `@backend` owning Supabase pays off.

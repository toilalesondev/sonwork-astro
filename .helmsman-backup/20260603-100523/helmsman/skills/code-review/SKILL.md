---
name: code-review
version: 1.0.0
description: Production-readiness code review. Scouts edge cases FIRST, then reviews the diff against a backend-aware checklist (N+1, schema back-compat, RLS/auth identity AND permission, races, data leaks). Owned by @ship. Reports findings; never patches. Emits review-decision.json on high-risk paths.
---

# code-review — production-readiness code review

Hunt bugs that pass CI but break in production. **Reporter, not patcher** — you
recommend, the builder fixes.

## Step 1 — scout edge cases FIRST (before reading the diff)

```
git diff --name-only HEAD~1
```
For the changed files, ask: affected dependents, data-flow risks, boundary conditions,
async races, state mutations. This primes the review.

## Step 2 — two-pass review

**Critical (blocking):**
- **N+1 / query efficiency** — no unbounded loops over DB calls; indexes on filter cols
- **Backwards compatibility** — no silent breaking changes to exported interfaces or DB
  schema
- **API contracts** — caller assumptions vs callee guarantees (nullability, shape,
  timing)
- **Auth / RLS** — every sensitive op checks **identity AND permission**; RLS negative
  path holds
- **Concurrency** — races, shared mutable state, async ordering
- **Data leaks** — no PII / secrets / stack traces in responses or logs
- **Input validation** at every system boundary

**Informational (non-blocking):** maintainability, code smells, naming. No AI
attribution in code/commits.

## Step 3 — verdict

```
Decision: GO | CAUTION | STOP
Blocking findings: [...]
Metrics: files reviewed, test coverage %, missing-error-handling count
```

## High-risk output

For auth/RLS/schema/billing/public-API/deploy paths, read `risk-gate.json`,
`context-snippets.json`, `verification.json`, then **emit `review-decision.json`**. Add
`adversarial-validation.json` when abuse-case / rollback / trust-boundary probing is
needed. If the proof pack is incomplete, keep the STOP recommendation. See
`harness/risk-evidence.md`.

## Boundary

Report findings. Do not patch plan files, pick a different plan, or self-transition
phases. Hand fixes back to the builder.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- Findings carry `file:line`; high-risk emits `review-decision.json`. Scout only the changed files' blast radius.

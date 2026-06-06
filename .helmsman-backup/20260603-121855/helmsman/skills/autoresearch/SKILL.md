---
name: autoresearch
version: 1.0.0
description: Autonomous iterative optimization loop for maintenance metrics (test coverage up, bundle size down, lint errors to zero). Set a goal, a mechanical single-number verify command, and a guard; the agent iterates unattended — one atomic change per iteration, commit before verify, keep or revert. Git is the cross-iteration memory; stuck-detection shifts strategy.
---

# autoresearch — autonomous metric optimization

Formula: **Constraint + mechanical metric + fast verification = autonomous
improvement.** For maintenance debt with an objective number.

## Config

| Field | Required | Meaning |
|-------|----------|---------|
| Goal | yes | what to improve |
| Scope | yes | editable glob (files the loop may touch) |
| Verify | yes | command printing a **single number** to stdout, finishes <30s |
| Guard | no | regression check, exit 0 = pass (e.g. `tsc --noEmit && jest`) |
| Iterations | no | default 10 |
| Direction | no | higher / lower (default: improve) |

## Loop rules

- **ONE atomic change per iteration** — describable in one sentence without "and".
- **Commit BEFORE verify** — git is memory, not a safety net.
- **Guard files are read-only** — never modify files in the guard's scope.
- Prefer `git revert` over `git reset`.
- Log each iteration to `loop-results.tsv`: iteration, commit, metric, delta, status
  (baseline/keep/discard), description.

## Stuck detection

- 5 consecutive discards → shift strategy (different files/approach).
- 10 consecutive discards → STOP and report.

## When NOT to use

Subjective goals · known-root-cause bugs (→ `@ship` investigate) · one-shot tasks ·
no mechanical metric · files outside Scope. Requires a git repo with a clean tree and a
`Verify` that finishes <30s. **Sequential by design** — each iteration learns from the
last; do not parallelize.

## Typical maintenance uses

- raise test coverage to a target (`Verify` = coverage %)
- reduce bundle size (`Verify` = bytes)
- drive lint errors to zero (`Verify` = error count)
- pairs with `security --fix` for vuln remediation

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- `loop-results.tsv` is the evidence trail; final metric must be re-derivable via `Verify`. Guard files are read-only.

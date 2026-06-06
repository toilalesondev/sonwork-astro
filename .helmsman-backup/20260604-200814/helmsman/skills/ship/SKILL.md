---
name: ship
version: 1.0.0
description: >-
  Ship workflow — detect base branch, run the affected tests, review the diff, bump VERSION,
  update CHANGELOG, commit, push, open the PR. Owned by @ship. Use when code is ready: "ship
  it", "deploy", "push to main", "create a PR", "merge and push". Then hand to land-and-deploy.
---

# ship — from "ready" to an open PR

Take verified work to a pushed PR. Owned by `@ship`. (Land/merge/deploy is `land-and-deploy`.)

## Trigger
- "Ship it / deploy / push to main / create a PR / merge and push" — code is ready.

## Procedure
1. **Detect** platform + base branch (main/master/trunk) and the project's task runner.
2. **Pre-flight** — clean tree (only intended files staged), no secrets in the diff, review the
   diff yourself (or via `code-review` on risky paths).
3. **Merge base branch first** (before tests) so you test the merged code, not a stale branch.
4. **Run the affected tests** (`verify` — diff-aware; escalate to full suite on config / high
   fan-out). **Honesty rule:** never imply broad/E2E gates ran if they didn't.
5. **Test-failure triage** — own failures you caused; pre-existing failures get flagged, not
   silently inherited.
6. **Version + changelog** — bump VERSION per the project's scheme; add a CHANGELOG entry in the
   repo's voice (sell-test: would a user understand what changed?).
7. **Commit + push + open PR** — concise message matching repo style; PR body summarizes what +
   why + the verification that ran + risk notes. Return the PR URL.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Honesty (Rule 3):** state exactly which gates ran;
never claim "tests pass" without the output. Never commit secrets. Only commit/push/PR when the
user asked — don't force-push, skip hooks, or amend a failed commit (make a new one). A high-risk
`risk-gate.json mustStop` blocks SHIP until the chain is GO.

## Evidence (what "done" must show)
The base detected, the actual test output (which suite ran), the VERSION bump + CHANGELOG entry,
and the **PR URL** + CI status. Never "shipped" without the URL (Rule 1).

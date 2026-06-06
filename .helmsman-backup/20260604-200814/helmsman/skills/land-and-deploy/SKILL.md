---
name: land-and-deploy
version: 1.0.0
description: >-
  Land it — merge the PR, wait for CI and deploy, verify production health. Owned by @ship.
  Use after ship opens the PR: "merge", "land it", "deploy", "ship to production", "merge and
  verify". Tool-aware: uses the project's deploy config (CLAUDE.md/AGENTS.md) + a browser check.
---

# land-and-deploy — merge → deploy → verify live

Take an approved PR to verified production. Owned by `@ship`. Takes over after `ship`.

## Trigger
- "Merge / land it / deploy / ship to production / merge and verify."

## Procedure
1. **Pre-merge gate** — CI green on the PR; required reviews satisfied; `risk-gate.json` (if any)
   is GO. Don't merge a red or unreviewed PR.
2. **Merge** the PR to the base branch (the repo's merge style — squash/merge/rebase per convention).
3. **Wait for deploy** — read the project's deploy config (platform, command, status check from
   CLAUDE.md/AGENTS.md — see `setup-deploy`). Watch the deploy to completion; on failure, surface
   logs and stop.
4. **Verify production health** — hit the live URL + health endpoint; expect HTTP 200 + the
   expected content (use the browser tool / curl when present). Compare against a pre-deploy
   baseline if one exists.
5. **Hand to monitor** — kick off post-deploy watching (`monitor`) for the canary window.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Never merge a red/unreviewed PR or one a risk-gate
blocks. **Verify live before declaring deployed** — a green deploy job is not proof the site
works; read back the URL. Tool-aware: if no deploy config exists, stop and ask (`setup-deploy`).

## Evidence (what "done" must show)
The merge (commit/PR), the deploy status (completed), and the **live URL returning HTTP 200** with
expected content read back. Never "deployed" on a green job alone (Rule 1).

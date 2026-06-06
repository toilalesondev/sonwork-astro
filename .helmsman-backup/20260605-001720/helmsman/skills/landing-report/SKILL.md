---
name: landing-report
version: 1.0.0
description: >-
  Read-only ship-queue dashboard — which VERSION slots are claimed by open PRs, which sibling
  workspaces have WIP likely to ship soon, and what slot ship would pick next. Owned by @ship.
  Use for "landing report / what's in the queue / show open PRs / which version do I claim next".
---

# landing-report — what's in the ship queue (read-only)

A snapshot so parallel work doesn't collide on VERSION slots. Owned by `@ship`. **Never mutates.**

## Trigger
- "Landing report / what's in the queue / show me open PRs / which version do I claim next".

## Procedure
1. **Open PRs** — list them with their claimed VERSION slot (from PR body/branch) + CI status.
2. **Sibling workspaces** — detect WIP in sibling worktrees/branches likely to ship soon.
3. **Next slot** — compute what VERSION `ship` would pick next given the claims.
4. **Report** — a plain table: claimed slots, in-flight work, the free next slot. Read-only.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Read-only — never mutate** (no version bumps, no
branch edits). Report exactly what's claimed; flag collisions.

## Evidence (what "done" must show)
The table of claimed VERSION slots + open PRs + the computed next free slot. No mutations made.

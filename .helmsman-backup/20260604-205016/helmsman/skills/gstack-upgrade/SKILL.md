---
name: gstack-upgrade
version: 1.0.0
description: >-
  Upgrade the external gstack tool when it's installed and the project uses it — detect install,
  run its upgrade, surface what changed. Owned by @helm. Use for "upgrade gstack / update gstack".
  Tool-aware: a no-op (with a clear note) when gstack isn't installed — Helmsman doesn't require it.
---

# gstack-upgrade — keep the external gstack tool current (when present)

Manage the optional external gstack dependency. Owned by `@helm`. Helmsman is independent of
gstack (separate namespace); this only matters if a project actively uses gstack tooling.

## Trigger
- "Upgrade gstack / update gstack / get latest gstack".

## Procedure
1. **Detect** the gstack install (global vs vendored; its repo/binary location). If absent, say so
   and stop — nothing to upgrade; Helmsman doesn't depend on it.
2. **Upgrade** — run gstack's own upgrade/`setup` (or `git pull` + its install) per its install type.
   Back up first so a failed upgrade can roll back.
3. **Surface what changed** — show the version delta + notable changes.
4. **Don't touch Helmsman skills** — gstack writes its own `gstack-*` namespace; our privatized
   skills are separate and unaffected.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Tool-aware:** clear no-op when gstack isn't
installed (never pretend to upgrade something absent). Back up before upgrading. Never let a gstack
upgrade overwrite Helmsman's own skills (different namespace — verify).

## Evidence (what "done" must show)
The detected gstack install (or the "not installed" note), the version before→after, and
confirmation Helmsman's own skills are untouched.

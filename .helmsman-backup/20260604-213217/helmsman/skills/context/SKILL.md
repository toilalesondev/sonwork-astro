---
name: context
version: 1.0.0
description: >-
  Save or restore working context across sessions/handoffs — capture git state, decisions, and
  remaining work (save), or load the most recent saved state to resume (restore). Owned by @helm.
  Use for "save progress / save state / context save", or "resume / restore context / where was I".
---

# context — save & restore working state

One skill, two modes, so work survives a session boundary or a workspace switch. Owned by `@helm`.
(For a full inter-agent package, see `handoff`; for durable memory, see `capture`.)

## Trigger
- **save** — "save progress / save state / context save / save my work".
- **restore** — "resume / restore context / where was I / pick up where I left off".

## Procedure

### save
Capture: current git state (branch, staged/unstaged, last commits), the decisions made this
session, and the remaining work (next steps + any blockers). Write to a known location (a
`process/context/` state file, and the gbrain page when that backend is active) so any future
session can find it. Keep it concise + actionable.

### restore
Load the most recent saved state (across branches by default), summarize where things stood, and
state the next action — so the user resumes without re-deriving context. Reconcile with current
git state (note anything that changed since the save).

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Mode-aware (`.helmsman/backend`): standalone writes
`process/context/`, gbrain also writes a recallable page. Redact secrets. Restore reconciles with
real git state — don't assume the saved state is still current.

## Evidence (what "done" must show)
For save: the state file/page written (path/slug) with git-state + decisions + next steps. For
restore: the loaded state summarized + the concrete next action + any drift vs current git.

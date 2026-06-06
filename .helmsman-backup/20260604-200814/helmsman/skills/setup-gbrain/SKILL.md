---
name: setup-gbrain
version: 1.0.0
description: >-
  Set up gbrain for this machine/agent — install the CLI, init a local (PGLite) or Supabase
  brain, register MCP, capture per-remote trust policy. Owned by @helm. Use for "setup gbrain /
  connect gbrain / install gbrain / configure gbrain". gbrain is OPTIONAL — Helmsman runs
  standalone without it.
---

# setup-gbrain — from zero to a running brain this agent can call

Stand up the durable memory tier. Owned by `@helm`. gbrain is the optional Tier-2 memory; if the
user wants portable/zero-dep, `--mode standalone` (no gbrain) is fully supported.

## Trigger
- "Setup gbrain / connect gbrain / start gbrain / install gbrain / configure gbrain for this machine".

## Procedure
1. **Install the CLI** — get the `gbrain` binary on PATH (independent of any other tool).
2. **Init a brain** — choose backend: **PGLite** (local, zero-infra) or **Supabase** (shared,
   cross-machine). Provision + verify connectivity (`gbrain doctor`).
3. **Register MCP** — wire gbrain as an MCP server so this agent can call it; verify the tools resolve.
4. **Source + trust policy** — register the project as a gbrain source; capture per-remote trust
   (what a remote caller may read/write). Confirm the default source isn't silently repointed.
5. **Record the mode** — set `.helmsman/backend = gbrain` so hooks inject it (install.sh --mode gbrain).

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Never repoint the default gbrain source silently
(footgun). Secrets (Supabase keys) go in the gbrain env/config, never committed. Verify each step
with `gbrain doctor` / a read-back — don't claim "connected" unproven (Rule 1).

## Evidence (what "done" must show)
`gbrain doctor` healthy output, the MCP registration verified (a tool call succeeds), the source
registered, and `.helmsman/backend` set to gbrain.

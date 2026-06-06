---
name: setup-deploy
version: 1.0.0
description: >-
  Configure deployment settings so land-and-deploy works automatically — detect platform,
  production URL, health-check endpoints, deploy + status commands; write them to the project's
  config. Owned by @backend. Use for "setup deploy / configure deployment / how do I deploy".
---

# setup-deploy — make deploys turnkey for land-and-deploy

Capture the deploy config once so `land-and-deploy` runs without asking. Owned by `@backend`.

## Trigger
- "Setup deploy / configure deployment / set up land-and-deploy / add deploy config".

## Procedure
1. **Detect the platform** — Fly / Render / Vercel / Netlify / Heroku / GitHub Actions / custom
   (look for config files, CI workflows, existing scripts).
2. **Gather** — production URL, health-check endpoint(s), the deploy command, the deploy-status
   command, and any required env/secrets (names only, never values).
3. **Write** the config to the project's agent config (AGENTS.md / CLAUDE.md) in the section
   `land-and-deploy` reads, so future deploys are automatic.
4. **Verify** — confirm the status command works and the health endpoint responds.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Never write secret VALUES into config (names/refs
only). Confirm the detected platform with the user before committing the config.

## Evidence (what "done" must show)
The deploy config written (path + fields: platform, URL, health endpoint, deploy/status commands)
and a successful status-command / health-endpoint check.

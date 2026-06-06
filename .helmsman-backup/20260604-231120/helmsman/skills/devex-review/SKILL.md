---
name: devex-review
version: 1.0.0
description: >-
  Live developer-experience audit — actually TEST the DX: walk the docs, try getting-started,
  time TTHW, screenshot error messages, evaluate CLI help. Owned by @backend. Use to "test the
  DX / DX audit / try the onboarding" for a developer-facing product. (Plan-stage DX → plan-devex-review.)
---

# devex-review — test the developer experience for real

Don't review the DX on paper — exercise it. Owned by `@backend`. Tool-aware (browser/CLI when
present). The plan-stage version is `plan-devex-review`; this audits the shipped experience.

## Trigger
- "Test the DX / DX audit / developer experience test / try the onboarding" for an API/SDK/CLI/docs/platform.

## Procedure
1. **Pick a developer persona** + the entry point (docs home / README / install page).
2. **Walk getting-started for real** — follow the docs literally; **time TTHW** (time to hello
   world). Note every friction point (a missing step, a wrong command, an unclear prereq).
3. **Exercise the surface** — run the CLI/API calls a newcomer would; read the actual error
   messages (are they actionable?); evaluate `--help` output.
4. **Capture evidence** — screenshots / transcripts of the friction, with the exact step it occurred.
5. **Scorecard** — rate the DX dimensions with evidence; compare against `plan-devex-review`
   scores if they exist (the boomerang: plan said 3 min, reality says 8).

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Actually run it** — a DX claim needs the real
transcript/timing, not a guess (Rule 1). Tool-aware: say so if you can't exercise it here. Time
TTHW honestly.

## Evidence (what "done" must show)
The measured TTHW, the friction points with the exact step + evidence (screenshots/transcripts),
the error-message + help-text assessment, and the scorecard (vs the plan-stage scores if present).

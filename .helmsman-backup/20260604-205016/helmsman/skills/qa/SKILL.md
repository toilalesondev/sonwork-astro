---
name: qa
version: 1.0.0
description: >-
  Systematically QA a web app — two modes: report (find + document bugs, never fix) or fix
  (find, fix in source, re-verify each atomically). Owned by @ship. Use for "qa this / test the
  site / find bugs / test and fix" (fix mode) or "just report bugs / qa report only" (report mode).
---

# qa — find bugs systematically, optionally fix them

One skill, two modes. Owned by `@ship`. Uses the browser tool when present.

## Trigger
- **fix mode** (default) — "qa this", "test the site", "find bugs", "test and fix", "is this ready".
- **report mode** — "just report bugs", "qa report only", "test but don't fix".

## Procedure
1. **Scope + tier** — Quick (critical/high only) · Standard (+medium) · Exhaustive (+cosmetic).
   Establish a baseline health read.
2. **Test systematically** — drive the app (browser tool when present): core flows, forms,
   inputs, edge/empty/error states, responsive breakpoints, console/network errors. Capture
   evidence (screenshots, repro steps) per finding.
3. **Classify** each finding: severity (critical/high/medium/cosmetic) + file:line/area + a
   concrete repro (input → bad outcome).
4. **Mode split:**
   - **report mode** — produce a structured report (health score, findings, repros, screenshots).
     **Never edit code.**
   - **fix mode** — fix each bug in source, **commit atomically per fix**, re-verify the specific
     case before moving on. Produce before/after health + a ship-readiness summary.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Report mode NEVER edits. A finding needs a concrete
repro (input → bad outcome), not "looks off". Fix mode: one atomic commit per fix, re-verify each
— never batch-fix-and-hope. Tool-aware: say so plainly if no browser tool is available.

## Evidence (what "done" must show)
The findings with severities + repros + screenshots; for fix mode, the per-fix commits + before/
after health + re-verification of each. Never "QA passed" without the evidence (Rule 1).

---
name: qa
version: 1.0.0
description: >-
  Systematically QA a web app — two modes: report (find + document bugs, never fix) or fix
  (find, fix in source, re-verify each atomically). Owned by @ship. Use for "qa this / test the
  site / find bugs / test and fix" (fix mode) or "just report bugs / qa report only" (report mode).
---

# qa — find bugs systematically, optionally fix them

One skill, two modes. Owned by `@ship`. Drives the app via **`hbrowse`** (Helmsman's Playwright browser).

> **Tool:** `hbrowse <verb>` (see `browse`). If it returns `{ok:false}` (Playwright unavailable),
> say so — don't claim the app was tested without actually driving it (Rule 1/3).

## Trigger
- **fix mode** (default) — "qa this", "test the site", "find bugs", "test and fix", "is this ready".
- **report mode** — "just report bugs", "qa report only", "test but don't fix".

## Procedure
1. **Scope + tier** — Quick (critical/high only) · Standard (+medium) · Exhaustive (+cosmetic).
   Establish a baseline health read.
2. **Test systematically** — drive the app with `hbrowse`: `goto` each route; `snapshot` →
   `click`/`fill` core flows + forms; check `console` (JS errors) + `network` (failed/4xx+
   requests) after each; `is-visible` for expected elements; edge/empty/error states; `responsive`
   for breakpoints. Capture `screenshot` + repro steps per finding.
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
— never batch-fix-and-hope. Say so plainly if hbrowse/Playwright is unavailable — never fake a tested result.

## Evidence (what "done" must show)
The findings with severities + repros + screenshots; for fix mode, the per-fix commits + before/
after health + re-verification of each. Never "QA passed" without the evidence (Rule 1).

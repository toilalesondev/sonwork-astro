---
name: browse
version: 1.0.0
description: >-
  Drive a headless/real browser to verify a deploy, dogfood a user flow, take annotated
  screenshots, check responsive layouts, test forms/uploads/dialogs, and assert page state.
  Owned by @ship. Use to "open in browser / test the site / take a screenshot / dogfood this /
  verify the deployment". Uses hbrowse (Helmsman's Playwright browser); honest when unavailable.
---

# browse — drive a browser to verify & capture evidence

Navigate, interact, assert, screenshot — via **`hbrowse`**, Helmsman's owned Playwright browser.
Owned by `@ship`.

> **Tool:** `hbrowse` (`.helmsman/bin/hbrowse` or repo `bin/hbrowse`). Each command is
> `hbrowse <verb> [args]` → JSON. The daemon auto-starts and holds the page across commands.
> If it returns `{ok:false, error:...}` (Playwright not installed), **say so honestly and stop**
> — never fake a browser result (Rule 1/3). Setup: `npm install` + `npx playwright install chromium`.

## Trigger
- "Open in browser", "test the site", "take a screenshot", "dogfood this flow", "verify the deploy".

## Procedure
1. **Navigate** — `hbrowse goto <url>` (returns status + title).
2. **Interact** — `hbrowse snapshot` lists interactive elements as `@e0/@e1/…`; then
   `hbrowse click @e3` / `hbrowse fill @e3 "<value>"` / `hbrowse hover @e3` / `hbrowse upload @e3 <file>`.
   For a dialog: `hbrowse dialog` (accept) or `hbrowse dialog --dismiss` BEFORE the action that triggers it.
3. **Assert state** — `hbrowse is-visible "<sel>"`, `hbrowse text`, `hbrowse console` (JS errors),
   `hbrowse network` (failed/4xx+ requests), `hbrowse js "<expr>"`. The `goto` status gives HTTP code.
4. **Capture evidence** — `hbrowse screenshot [path] [--full]`; `hbrowse responsive` (mobile/tablet/
   desktop PNGs); `hbrowse diff <beforePath>` to compare before/after an action.
5. **Report** — what you verified, with the screenshot paths + the concrete passed/failed assertions.
   `hbrowse cleanup` when done.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Tool-aware:** if no browser automation is
installed, state that and stop — never claim a page was verified without actually loading it
(Rule 1/3). Capture evidence for every claim.

## Evidence (what "done" must show)
The URL(s) driven, the assertions checked, screenshots captured, and any console/network errors —
the concrete proof of what was verified.

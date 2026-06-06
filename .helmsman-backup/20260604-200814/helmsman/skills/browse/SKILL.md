---
name: browse
version: 1.0.0
description: >-
  Drive a headless/real browser to verify a deploy, dogfood a user flow, take annotated
  screenshots, check responsive layouts, test forms/uploads/dialogs, and assert page state.
  Owned by @ship. Use to "open in browser / test the site / take a screenshot / dogfood this /
  verify the deployment". Tool-aware: uses the browser automation tool when present.
---

# browse — drive a browser to verify & capture evidence

Navigate, interact, assert, screenshot. Owned by `@ship`. **Tool-aware:** uses the project's
browser automation when present (Playwright is the Helmsman-owned default; the gstack browse
daemon if that's what's installed). If no browser tool is available, say so — don't fake results.

## Trigger
- "Open in browser", "test the site", "take a screenshot", "dogfood this flow", "verify the deploy".

## Procedure
1. **Connect** to the browser tool (launch headless/real Chrome via the available driver).
2. **Navigate + interact** — go to the URL; click, type, submit, handle dialogs/uploads as the
   flow needs.
3. **Assert state** — check elements present/visible/text, console errors, network responses,
   HTTP status. Diff before/after an action when verifying a change.
4. **Capture evidence** — annotated screenshots; responsive checks at mobile/tablet/desktop.
5. **Report** — what you verified, with screenshots + the concrete assertions that passed/failed.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Tool-aware:** if no browser automation is
installed, state that and stop — never claim a page was verified without actually loading it
(Rule 1/3). Capture evidence for every claim.

## Evidence (what "done" must show)
The URL(s) driven, the assertions checked, screenshots captured, and any console/network errors —
the concrete proof of what was verified.

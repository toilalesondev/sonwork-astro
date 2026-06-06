---
name: ios-qa
version: 1.0.0
description: >-
  Live-device iOS QA for SwiftUI apps — vision-driven loop (screenshot → analyze → act → verify)
  over an in-app StateServer, with fix and design-review modes. Owned by @mobile. Use for "ios qa
  / test my iPhone app / find bugs on device / qa the iOS app". DORMANT until a real iPhone +
  Swift app with the bridge exist (see ios-bridge); tool-aware, never claims tested without a device.
---

# ios-qa — vision-driven QA on a real iPhone

Drive a real iOS app through a screenshot→analyze→act→verify loop. Owned by `@mobile`. Modes:
**qa** (find bugs), **fix** (find → patch source → rebuild → re-verify on device), **design**
(visual audit vs Apple HIG + DESIGN.md).

> **DORMANT capability.** This requires a real iPhone + a SwiftUI app with the in-app StateServer
> compiled in (see `ios-bridge`) + a USB CoreDevice tunnel. With no device/app in the project it
> CANNOT be exercised — say so plainly; never report iOS QA as "passed" without a real device run
> (Rule 1/3).

## Trigger
- "iOS QA / test my iPhone app / find bugs on the device / qa the iOS app" (+ fix / design variants).

## Procedure
0. **Warm-start** — confirm the device is connected + the app's StateServer is reachable (via
   `ios-bridge`'s daemon). If not, STOP: report the bridge/device is unavailable.
1. **Read the source** — understand every screen (SwiftUI views, ViewModels) so the loop knows what
   to expect; plan any accessor codegen.
2. **Bootstrap the bridge** — connect to the StateServer over the loopback/tailnet daemon.
3. **Vision-driven loop** — for each screen: **screenshot → analyze** (against expectation / HIG /
   DESIGN.md) **→ decide → act** (tap/type/scroll via the StateServer) **→ verify → repeat**.
   Capture evidence per finding (screenshot + the state + repro).
4. **Mode split** — **qa**: report findings. **fix**: read Swift source, patch, rebuild, redeploy,
   re-verify the specific case on device; capture the pre-bug state as a regression fixture.
   **design**: score each screen vs HIG + DESIGN.md ("what would make it a 10").

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Dormant honesty:** with no device/app, state it and
stop — never fabricate an iOS QA result (Rule 1/3). fix mode: one change, rebuild, re-verify on the
real device — don't claim a device fix you didn't run.

## Evidence (what "done" must show)
The device connection confirmed, per-screen screenshots + findings + repros, and (fix mode) the
on-device re-verification. OR the explicit "no device/app available — iOS QA not exercisable here".

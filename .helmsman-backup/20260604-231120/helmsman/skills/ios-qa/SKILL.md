---
name: ios-qa
version: 1.0.0
description: >-
  Live-device iOS QA for SwiftUI apps — vision-driven loop (screenshot → analyze → act → verify)
  over an in-app StateServer, finding bugs. Owned by @mobile. Use for "ios qa / test my iPhone
  app / find bugs on device". DORMANT until a real iPhone + Swift app with the bridge exist (see
  ios-bridge); tool-aware, never claims tested without a device. (On-device fixing = ios-fix.)
---

# ios-qa — vision-driven bug-finding on a real iPhone

Drive a real iOS app through a screenshot→analyze→act→verify loop to FIND bugs. Owned by
`@mobile`. (Fixing on device = `ios-fix`; HIG visual audit = `ios-design-review`.)

> **DORMANT capability.** Requires a real iPhone + a SwiftUI app with the in-app StateServer
> compiled in (see `ios-bridge`) + a USB CoreDevice tunnel. With no device/app it CANNOT be
> exercised — say so plainly; never report iOS QA "passed" without a real device run (Rule 1/3).

## Trigger
- "iOS QA / test my iPhone app / find bugs on the device / qa the iOS app".

## Procedure
0. **Warm-start** — confirm the device is connected + the app's StateServer is reachable (via
   `ios-bridge`). If not, STOP: report the bridge/device is unavailable.
1. **Read the source** — understand every screen (SwiftUI views, ViewModels) so the loop knows
   what to expect; plan any accessor codegen.
2. **Bootstrap the bridge** — connect to the StateServer over the loopback/tailnet daemon.
3. **Vision-driven loop** — per screen: **screenshot → analyze** (against expectation) **→ decide
   → act** (tap/type/scroll via the StateServer) **→ verify → repeat**. Capture evidence per
   finding (screenshot + state + repro).
4. **Report findings** — bugs with severity + screenshot + repro. (To fix them on device, hand to `ios-fix`.)

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Dormant honesty:** with no device/app, state it and
stop — never fabricate an iOS QA result (Rule 1/3). Find + report; fixing is `ios-fix`.

## Evidence (what "done" must show)
The device connection confirmed, per-screen screenshots + findings + repros. OR the explicit
"no device/app available — iOS QA not exercisable here".

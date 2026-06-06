---
name: ios-fix
version: 1.0.0
description: >-
  Autonomous on-device iOS bug fix — take a bug (e.g. from ios-qa), read the Swift source, patch,
  rebuild, redeploy, and re-verify on the real device, capturing a regression fixture. Owned by
  @mobile. Use to "fix this iOS bug / patch the iPhone app / auto-fix the iOS issue". DORMANT
  without a device + Swift app; never claims a device fix it didn't run.
---

# ios-fix — fix a bug on the real device, then prove it

Close the loop after `ios-qa` finds a bug: patch → rebuild → redeploy → re-verify on device.
Owned by `@mobile`.

> **DORMANT capability.** Requires a real iPhone + the Swift app + the `ios-bridge` StateServer.
> With no device/app it CANNOT run — say so; never claim an on-device fix you didn't execute (Rule 1/3).

## Trigger
- "Fix this iOS bug / patch the iPhone app / auto-fix the iOS issue" (typically after `ios-qa`).

## Procedure
0. **Warm-start** — device connected + StateServer reachable (`ios-bridge`); else STOP and report.
1. **Capture the pre-fix state** — snapshot the bug's reproducing state as a regression fixture.
2. **Read the Swift source** — root-cause the bug in the relevant view/ViewModel.
3. **Patch → rebuild → redeploy** to the device.
4. **Re-verify on device** — drive the exact repro via the StateServer; confirm the bug is gone
   and nothing nearby broke.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Dormant honesty:** no device/app → state it and
stop. One change → rebuild → re-verify on the REAL device — never claim fixed without the
on-device re-run (Rule 1/3). Root-cause, don't shotgun.

## Evidence (what "done" must show)
The captured regression fixture, the patch, the rebuild/redeploy, and the on-device re-verification
showing the bug gone. OR "no device/app available — not exercisable here".

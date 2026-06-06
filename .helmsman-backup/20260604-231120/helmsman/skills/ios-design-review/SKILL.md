---
name: ios-design-review
version: 1.0.0
description: >-
  Visual design audit for an iOS app on real hardware — screenshot every screen, score against
  Apple HIG + DESIGN.md, with "what would make it a 10" framing. Owned by @mobile. Use to "review
  the iOS design / audit the iPhone app's visuals / design QA the iOS app". DORMANT without a
  device + Swift app; never claims a visual audit it didn't run on hardware.
---

# ios-design-review — HIG visual audit on a real iPhone

Audit the app's visuals on real hardware against Apple's Human Interface Guidelines + the
project's DESIGN.md. Owned by `@mobile`. (Plan-stage design → `plan-design-review`; web visual
audit → `impeccable`.)

> **DORMANT capability.** Requires a real iPhone + the Swift app + `ios-bridge`. With no
> device/app it CANNOT run — say so; never report a visual audit not run on hardware (Rule 1/3).

## Trigger
- "Review the iOS design / audit the iPhone app's visuals / design QA the iOS app".

## Procedure
0. **Warm-start** — device connected + StateServer reachable (`ios-bridge`); else STOP and report.
1. **Screenshot every screen** — navigate the app via the StateServer, capturing each screen.
2. **Score against HIG + DESIGN.md** — per screen, rate the design dimensions (hierarchy,
   spacing, type, color, touch targets, motion, platform conventions) with **"what would make it
   a 10"** framing.
3. **Report** — per-screen findings + scores + the concrete change to reach a 10, with screenshots.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Dormant honesty:** no device/app → state it and
stop. Score against HIG + DESIGN.md with evidence (screenshots) — never a visual verdict without
the actual hardware screenshots (Rule 1/3).

## Evidence (what "done" must show)
Per-screen screenshots + HIG/DESIGN.md scores + the "to make it a 10" change each. OR "no
device/app available — not exercisable here".

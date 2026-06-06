---
name: ios-bridge
version: 1.0.0
description: >-
  Manage the iOS debug bridge that ios-qa drives — install/regenerate the in-app StateServer +
  DebugBridge + typed accessors (sync), or remove it cleanly (clean). Owned by @mobile. Use for
  "set up / regenerate / remove the iOS debug bridge". DORMANT until a SwiftUI app exists;
  Release-build safety guard is the safety-critical invariant.
---

# ios-bridge — the iOS debug bridge `ios-qa` drives

Install, regenerate, or remove the in-app instrumentation that exposes app state to `ios-qa`.
Owned by `@mobile`. Modes: **sync** (install/regenerate), **clean** (remove).

> **DORMANT capability.** Operates on a real SwiftUI app's source (Package.swift, StateServer.swift,
> DebugOverlay.swift, generated @Observable accessors). With no iOS app in the project it CANNOT run
> — say so; never claim the bridge installed without the Swift target (Rule 1/3).

## Trigger
- "Set up / regenerate / sync the iOS debug bridge", "remove / clean the iOS instrumentation".

## Procedure

### sync (install / regenerate)
Add/refresh the DebugBridge SPM package + StateServer (HTTP state server compiled into the app
under `#if DEBUG`) + DebugOverlay + typed accessors generated from the app's @Observable
ViewModels. Wire the app-side hooks. Regenerate after upgrading or after adding ViewModels/props
needing accessor coverage.

### clean (remove)
Strip the DebugBridge package + all `#if DEBUG` wiring + StateServer/DebugOverlay/generated
accessors + app-side hooks. Leave the app exactly as before instrumentation.

### Safety-critical invariant (both modes)
The StateServer must be **Release-build-guarded** — a `Package.swift` conditional + a CI
`swift build -c release` check ensure the debug bridge can NEVER ship in a Release build. This
guard is the safety-critical path; verify it holds after any sync.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **The Release-build guard is non-negotiable** — never
leave the StateServer compilable into Release. **Dormant honesty:** no Swift app → state it and
stop. Verify the guard (the `swift build -c release` check) after sync.

## Evidence (what "done" must show)
sync: the bridge files written/updated + the Release-guard verified (the release-build check
passing). clean: confirmation all bridge code is gone. OR the explicit "no iOS app present —
bridge not applicable here".

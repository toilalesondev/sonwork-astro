---
name: improve-codebase-architecture
version: 1.0.0
description: >-
  Find deepening opportunities — refactors that turn shallow modules into deep ones, for
  testability and AI-navigability. Informed by CONTEXT.md domain language + docs/adr/. Owned
  by @eng. Use when the user wants to improve architecture, find refactoring opportunities,
  consolidate tightly-coupled modules, or make a codebase easier to test and navigate.
---

# improve-codebase-architecture — deepen modules, concentrate complexity

Surface architectural friction and propose **deepening opportunities**: a lot of behaviour
behind a small interface. Aim = testability + locality. Informed by the project's domain model
(CONTEXT.md) and decisions (docs/adr/) — name good seams in the domain's language; don't
re-litigate ADRs.

## Vocabulary (use exactly — consistent language is the point)
- **Module** — anything with an interface + implementation (function, class, package, slice).
- **Interface** — everything a caller must know: types, invariants, error modes, ordering, config (not just the signature).
- **Depth** — leverage at the interface. **Deep** = lots of behaviour behind a small interface; **Shallow** = interface nearly as complex as the implementation.
- **Seam** — where an interface lives; a place behaviour can be altered without editing in place (use this, not "boundary").
- **Locality** — change/bugs/knowledge concentrated in one place (what maintainers gain from depth).
- **Deletion test** — imagine deleting the module: if complexity vanishes it was a pass-through; if it reappears across N callers it earned its keep.
- **One adapter = hypothetical seam. Two adapters = a real seam.**

## Trigger
- "Improve the architecture", "find refactoring opportunities", "this is hard to test/follow",
  "consolidate these tangled modules".

## Procedure

### 1. Explore for friction
Read CONTEXT.md + relevant ADRs first. Then walk the codebase (use a read-only explore subagent
when available) and note where you feel friction: understanding one concept requires bouncing
between many small modules · **shallow** modules (interface ≈ implementation complexity) · pure
functions extracted only for testability while the real bugs hide in how they're called (no
locality) · tightly-coupled modules leaking across seams · code untested or hard to test through
its current interface. Apply the **deletion test** to each suspect.

### 2. Present candidates (report)
For each candidate: **Files** involved · **Problem** (the friction) · **Solution** (plain
English) · **Benefits** (in terms of locality + leverage + how tests improve) · **Before/After**
(the shallowness → the deepening) · **Strength** (`Strong` / `Worth exploring` / `Speculative`).
End with a **Top recommendation**. Use CONTEXT.md vocabulary for the domain ("the Order intake
module", not "FooBarHandler"). If a candidate contradicts an ADR, only surface it when the
friction genuinely warrants reopening — mark it clearly. (A rich HTML report with diagrams is
optional polish; the substance is the candidate analysis.) Don't propose interfaces yet — ask
the user which candidate to explore.

### 3. Grilling loop
Once a candidate is picked, drop into `grill` on the design tree: constraints, dependencies, the
shape of the deepened module, what sits behind the seam, what tests survive. Side effects inline:
naming a module after a new concept → add the term to CONTEXT.md; a load-bearing rejection →
offer an ADR.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Propose deepenings, don't mass-refactor on sight.
Respect ADRs (flag, don't silently override). The interface is the test surface — judge depth by
the deletion test, not by line count.

## Evidence (what "done" must show)
The candidate list with the deletion-test reasoning per item, the top recommendation, and (if
acted on) the before/after module shape. Any CONTEXT.md/ADR updates made inline.

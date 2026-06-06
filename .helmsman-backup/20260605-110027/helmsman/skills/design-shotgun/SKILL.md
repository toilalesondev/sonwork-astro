---
name: design-shotgun
version: 1.0.0
description: >-
  Explore UI directions fast — generate several radically different design variants, compare
  them, collect structured feedback, iterate. Owned by @product (with @design). Use when the
  user wants options ("show me directions", "design variants", "I don't like how this looks",
  "visual brainstorm") before committing to one design.
---

# design-shotgun — many directions, then converge

Generate breadth before depth. Several genuinely different takes beat polishing the first idea.

## Trigger
- "Explore designs / show me options / design variants / visual brainstorm / I don't like this look".

## Procedure

### 1. Context + taste memory
Understand what's being designed and the constraints. **Recall** prior taste signals from the one
memory (gbrain / `process/context/` per `.helmsman/backend`) — what the user liked/rejected before
— so variants don't repeat rejected directions.

### 2. Generate variants
Produce **several radically different** directions — not minor tweaks. Vary the actual design
levers (layout, type, color, density, mood), each a coherent take. Render them so they're
comparable (a comparison board when the design tooling is present; otherwise described mockups /
toggleable variants on one route).

### 3. Compare + collect structured feedback
Put them side by side. Collect specific reactions per variant (what works, what doesn't) — not
just "I like #2". Capture the taste signal for next time.

### 4. Iterate or converge
Narrow toward a direction; refine it, or feed the winner into `design-consultation` (system) or
`impeccable` (build/polish).

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Variants must be genuinely different (real
exploration, not 3 shades of the same). Record the taste signal so the next round is smarter.

## Evidence (what "done" must show)
The set of distinct variants, the structured per-variant feedback, and the chosen direction (or
the captured taste signal feeding the next round).

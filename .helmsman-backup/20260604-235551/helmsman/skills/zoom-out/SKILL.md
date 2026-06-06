---
name: zoom-out
version: 1.0.0
description: >-
  Step up a layer of abstraction and give a map of the relevant modules + callers in the
  project's domain vocabulary. Owned by @scout. Use when unfamiliar with an area of code, or
  when you need the higher-level picture of how something fits into the whole.
---

# zoom-out — go up a layer, map the territory

When you're in the weeds of an unfamiliar area, stop and map it before acting.

## Trigger
- "Zoom out", "give me the bigger picture", "I don't know this area", "how does this fit in".

## Procedure
Go up a layer of abstraction. Produce a **map** of the relevant modules and their callers —
what calls into this area, what it calls out to, which architectural layer it sits in — using
the project's **domain glossary** (CONTEXT.md) vocabulary, not invented names. If an `understand`
graph exists, read its layers/edges for the map; otherwise trace imports/callers directly.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Read-only — map, don't change. Use the project's
domain language, not generic "component/service/handler".

## Evidence (what "done" must show)
The module map (this area's callers + callees + layer), grounded in real file references.

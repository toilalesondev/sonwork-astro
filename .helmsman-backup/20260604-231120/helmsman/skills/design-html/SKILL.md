---
name: design-html
version: 1.0.0
description: >-
  Turn an approved design/mockup/plan into production-quality HTML/CSS where text reflows,
  heights are computed, and layouts are dynamic — not a static screenshot. Owned by @design.
  Use to "finalize this design / turn this into HTML / build me this page / implement this
  mockup", typically after design-shotgun, design-consultation, or a plan-design-review.
---

# design-html — finalize a design into real, reflowing HTML/CSS

Produce production HTML/CSS from an approved design: real text that reflows, computed heights,
dynamic layouts — built to the craft rules in `impeccable` and the project's DESIGN.md.

## Trigger
- "Finalize this design", "turn this into HTML", "build me this page", "implement this mockup".
- Usually follows `design-shotgun` (chosen variant), `design-consultation` (system), or a `plan-design-review`.

## Procedure
1. **Inputs** — the approved mockup/plan + DESIGN.md (tokens, type, color, spacing, motion). If a
   design-system generator/lib is present (Pretext or the project's own), use it; otherwise emit
   plain semantic HTML + CSS to the project's stack. Tool-aware: don't hard-require a specific lib.
2. **Build for reflow, not a screenshot** — real content, fluid type (`clamp()`), computed/auto
   heights, responsive grids (`repeat(auto-fit, minmax(...))`). Test the actual copy at every
   breakpoint — the viewport is part of the design (no overflow).
3. **Apply the craft rules + bans** from `impeccable` (contrast, type ceilings, motion with
   reduced-motion fallback, no slop patterns). Conform to DESIGN.md tokens.
4. **Verify** — render it (browser tool when present): screenshot at mobile/tablet/desktop,
   confirm reflow + contrast + no overflow.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Output reflowing production HTML/CSS, never a
pixel-fixed mock. Conform to DESIGN.md + the impeccable bans. Tool-aware — degrade to plain
semantic HTML/CSS when no design lib is present; state which path you took.

## Evidence (what "done" must show)
The HTML/CSS produced + responsive screenshots (when the browser tool is available) proving
reflow at multiple breakpoints, contrast checks, and DESIGN.md conformance.

---
name: design-consultation
version: 1.0.0
description: >-
  Propose a complete design system and write DESIGN.md as the project's design source of truth —
  aesthetic, typography, color, layout, spacing, motion. Owned by @design (with @product at
  ideation). Use when starting a project's UI with no design system, or asked to "create a
  design system / brand guidelines / DESIGN.md".
---

# design-consultation — establish the design system (DESIGN.md)

Produce the shared design source of truth every builder reads. For NEW UI with no system yet
(for an existing site, infer the system via `plan-review --lens design` instead).

## Trigger
- "Create a design system / brand guidelines / DESIGN.md", new project UI with nothing defined.

## Procedure

### 1. Product context
Understand the product, audience, tone, and any existing brand cues. What feeling should it evoke;
who uses it; what's the competitive/category aesthetic.

### 2. Research the landscape (if the user wants it)
Look at comparable products + category conventions; identify what to echo and where to differentiate.

### 3. Propose the complete system
A coherent proposal across: **aesthetic direction** · **typography** (families, scale, weights) ·
**color** (palette + semantic roles) · **layout & spacing** (grid, rhythm, density) · **motion**
(when/how things animate). Make it opinionated and internally consistent — a system, not options.

### 4. Preview + drill-down
Generate a font + color preview (when the design tooling is present) so choices are concrete;
adjust on request.

### 5. Write DESIGN.md
Commit the agreed system to `DESIGN.md` at the path the project's AGENTS.md specifies. This is
what @eng/@design implement to and what `plan-review --lens design` / `impeccable` audit against.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Deliver ONE coherent system, not a menu. DESIGN.md is
the source of truth — keep it the canonical reference, not a scratchpad.

## Evidence (what "done" must show)
The DESIGN.md written (path), covering aesthetic/type/color/layout/motion, plus the preview if
the tooling was available.

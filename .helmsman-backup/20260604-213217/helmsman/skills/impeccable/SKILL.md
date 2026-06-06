---
name: impeccable
version: 1.0.0
description: >-
  Design and iterate production-grade frontend interfaces — craft, shape, audit, polish,
  animate, colorize, typeset, clarify, and live-review UI. Owned by @design. Use to build/
  improve any frontend (sites, dashboards, components, forms, empty states), critique a live
  UI against DESIGN.md, or fix visual hierarchy/spacing/color/motion/copy. Not for backend.
---

# impeccable — production-grade UI craft

Real working code, committed design choices, exceptional craft. Not prototypes — ready-to-ship,
responsive, fast, on-brand. Owned by `@design`.

## Trigger
- Build/redesign/polish a frontend; "make this look better"; "audit the design"; "fix the
  spacing/colors/typography/motion/copy"; "the design feels generic / too loud / bland".

## Setup (before designing)
1. Read the project's **DESIGN.md** (and PRODUCT.md if present) at the path AGENTS.md specifies —
   it's the source of truth. If none exists for a new project, run `design-consultation` first.
2. **Read the existing system** — at least one real file (CSS/tokens/theme/a representative
   component). Use what's there when it works; don't reinvent. Identity-preservation wins when
   committed brand colors already exist.
3. Pick the **register**: design IS the product (marketing/landing/portfolio) → brand register;
   design SERVES the product (app/admin/dashboard/tool) → product register.

## Modes (the work)
- **craft** — shape then build a feature end-to-end. **shape** — plan UX/UI before code.
- **audit** — technical quality (a11y, perf, responsive). **critique** — UX heuristic review.
- **polish / bolder / quieter / distill / harden** — refine. **animate / colorize / typeset /
  layout / delight** — enhance. **clarify / adapt / optimize** — fix. **live** — pick elements in
  the browser (when the browser tool is present) and generate alternatives.
Match the user's intent to a mode ("fix the spacing" → layout; "colors feel flat" → colorize).

## Craft rules (the standard — apply always)

**Color** — verify contrast (body ≥4.5:1; large text ≥3:1; placeholders 4.5:1 too). The most
common failure is muted gray body text on a tinted near-white — bump toward ink. Gray on a
colored bg looks washed out; use a darker shade of the bg's hue. Use **OKLCH**. Pick a color
*strategy* first: Restrained (neutrals + 1 accent ≤10%) · Committed (one color 30–60%) · Full
palette (3–4 roles) · Drenched (the surface IS the color).

**Typography** — body line length 65–75ch · hierarchy via scale+weight (≥1.25 step ratio) ·
≤3 font families · pair on a contrast axis (serif+sans), never two similar sans · no all-caps
body · hero clamp() max ≤6rem · display letter-spacing ≥ -0.04em (tighter = letters touch) ·
`text-wrap: balance` on h1–h3, `pretty` on prose.

**Layout** — vary spacing for rhythm · cards are the lazy answer (never nested) · flex for 1D,
grid for 2D · responsive grids `repeat(auto-fit, minmax(280px,1fr))` · a semantic z-index scale,
never 9999.

**Motion** — intentional, part of the build · ease-out exponential (quart/quint/expo), no
bounce/elastic · `prefers-reduced-motion` alternative is NOT optional · reveals must enhance an
already-visible default (never gate content on a class-triggered transition — it ships blank on
headless renderers) · blur/backdrop-filter/clip-path/mask/glow are legitimate materials.

**Copy** — every word earns its place · **no em dashes** (use commas/colons/periods) · no
aphoristic "serious statement, punchy negation" cadence · no buzzwords (streamline/empower/
supercharge/leverage/seamless/world-class/next-gen…) · buttons = verb+object ("Save changes") ·
links have standalone meaning ("View pricing", not "Click here").

## Absolute bans (match-and-refuse — rewrite the element)
Side-stripe borders (colored `border-left`>1px) · gradient text (`background-clip:text`) ·
glassmorphism-as-default · the hero-metric template · identical card grids · tiny uppercase
tracked eyebrow above every section · numbered section markers (01/02/03) as default scaffolding ·
text that overflows its container · `1px border` + `box-shadow ≥16px` ghost-card · `border-radius
≥32px` on cards (cap 12–16px) · hand-drawn/sketchy SVG · `repeating-linear-gradient` stripes ·
"X theater" / "not just X, it's Y" copy.

## The AI-slop test
If someone could say "AI made that" without doubt, it failed. **First-order:** if the theme/
palette is guessable from the category alone, it's the training-data reflex — rework. **Second-
order:** if the aesthetic is guessable from category-plus-anti-reference ("fintech that's not
navy-and-gold → terminal dark"), the trap one tier deeper wasn't avoided — rework until neither
is obvious.

## Audit mode (absorbed from design-review — auditing a LIVE/shipped UI)
When auditing what's shipped (use the browser tool when present): (1) **First impression** ·
(2) **Design-system extraction** (what tokens/patterns are actually in use) · (3) **Page-by-page
visual audit** against the craft rules + bans · (4) **Interaction-flow review** · (5) **Cross-page
consistency** · (6) **Compile report** with file:line + the specific fix. Audit against DESIGN.md —
both the pages AND app-rendered user-facing UI (copy, errors, empty/default states) so the app
doesn't drift off the system.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Ship production-grade code, not prototypes. Follow
DESIGN.md (identity-preservation wins over reinvention). Verify against the craft rules + bans
before declaring done — screenshot/test in a browser when the tool is available.

## Evidence (what "done" must show)
The implemented UI (or audit report with file:line + fixes), contrast/responsive checks actually
run (browser screenshots when available), and conformance to DESIGN.md + the bans list — never
"looks good" without verification.

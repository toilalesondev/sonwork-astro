---
version: alpha
name: Sonwork Command Center
description: Dark personal operating-system aesthetic for sonwork.org public pages and published artifacts.
colors:
  primary: "#0A0A0A"
  secondary: "#E8E8E8"
  tertiary: "#63B1F9"
  neutral: "#A0A0A0"
  bg: "#0A0A0A"
  bg-2: "#0F0F0F"
  bg-3: "#141414"
  bg-4: "#1A1A1A"
  bg-5: "#222222"
  border: "#1A1A1A"
  border-2: "#242424"
  text: "#E8E8E8"
  text-2: "#A0A0A0"
  text-3: "#666666"
  accent: "#63B1F9"
  accent-dim: "#4284C5"
  black: "#000000"
  white: "#FFFFFF"
typography:
  h1:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "-0.04em"
  h2:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  body:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0em"
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.03em"
  mono-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  xs: 3px
  sm: 4px
  md: 6px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  page-x: 32px
components:
  nav:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-2}"
    typography: "{typography.mono-label}"
    height: 52px
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.sm}"
    padding: 8px
  button-ghost:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-2}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.sm}"
    padding: 8px
  stats-card:
    backgroundColor: "{colors.bg-3}"
    textColor: "{colors.text}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.md}"
    padding: 20px
  tag-chip:
    backgroundColor: "{colors.bg-4}"
    textColor: "{colors.text-2}"
    typography: "{typography.mono-caps}"
    rounded: "{rounded.xs}"
    padding: 4px
---

## Overview

Sonwork Command Center is the visual identity for `sonwork.org` and all public HTML artifacts published under it. It should feel like a private founder operating system made public: dark, compact, honest, technical, and personal. The mood is builder/operator dashboard, field log, and command center - not glossy SaaS, not a generic AI landing page, and not an editorial magazine.

Use this design whenever publishing pages, plans, reports, dashboards, OS docs, or product artifacts to `sonwork.org`. The page should look like it belongs beside the live homepage: minimal black surface, muted text, a single blue accent, monospaced metadata, thin dividers, compact rows, and restrained interaction.

## Colors

- **bg (#0A0A0A):** The default page background. Use near-black instead of pure design black to keep the page readable and quiet.
- **bg-2 through bg-5:** Step-up surfaces for panels, row hovers, stats cards, chips, and nested UI. Keep contrast subtle.
- **border / border-2:** Thin low-contrast dividers. Borders should be felt more than seen.
- **text (#E8E8E8):** Primary copy. Avoid pure white except for rare hover emphasis.
- **text-2 (#A0A0A0):** Body support text, secondary descriptions, quiet labels.
- **text-3 (#666666):** Metadata, timestamps, inactive nav, helper text.
- **accent (#63B1F9):** The only strong accent. A refined blue (OKLCH `0.74 0.13 248`, 8.66:1 on the #0A0A0A bg). Use for active states, key metrics, markers, links, cursor details, and important numbers.
- **accent-dim (#4284C5):** Hover borders and lower-emphasis accent states (OKLCH `0.60 0.12 250`, 5.03:1).

The accent was amber (#E8A045) through 2026-05; Son asked for blue, so the canonical accent is now the refined blue above. "Blue SaaS accent" is no longer a ban — the brand IS blue now — but keep it the specific #63B1F9 (not a generic bright SaaS blue) and keep it the *only* strong accent. Do not introduce purple AI gradients, pastel cards, beige editorial backgrounds, or multi-accent rainbow systems unless Son explicitly asks.

## Typography

Use **Inter** for prose, headings, and readable content. Use **JetBrains Mono** for system UI: navigation, labels, prompts, stats, tags, dates, file paths, metadata, and small controls.

Typography should stay compact. Normal body copy is around 15px. Feed rows and secondary descriptions often sit around 14px. Mono labels are usually 10-12px with mild tracking. Headings can be strong but should stay tight and direct; avoid giant marketing hero typography unless the page is intentionally a landing page.

Navigation labels should be lowercase. Tags should be bracketed (`[founder]`, `[life]`, `[2026]`). Prompts can use terminal forms like `./introduction`, `./os-v1`, or `workspace.sonwork.org / brain`.

## Layout

Use a maximum content width of about `1100px` with `32px` desktop side padding. The default page architecture is:

```text
sticky nav
hero or page header
main content grid
optional right sidebar
quiet footer or ending note
```

Prefer dashboard structure over brochure sections. On desktop, a common layout is `1fr 260px` with a `40px` gap. Use rows, logs, stats, sidebars, tabs, and lists more often than large floating cards. If cards are needed, keep them dark, compact, lightly bordered, and small-radius.

Mobile should collapse to one column below roughly `800px`. Preserve readable spacing, but keep the dense command-center feeling.

### Density (minimal pass, 2026-05)

The command-center soul is *compact and quiet*, not *packed*. Dense ≠ cluttered. When a surface starts to feel busy, the fix is to **remove duplicated information**, not to shrink type.

- **The homepage is a single centered column (~760px), not a dashboard + sidebar.** The old right sidebar duplicated what the page already showed (series → tabs, projects → featured cards, topics → per-post tags, bio → hero). Duplication is the primary noise source; cut it before anything else.
- **One filter axis per feed.** The post feed filters by **series tabs** only. The parallel tag-filter system (per-row tag chips + a topic tag cloud + an active-tag bar) was a second competing filter that added chrome to every row; it was removed. Tags still live on the post page and the writing page.
- **Three clear things on the home surface:** who (hero), what I'm building (featured projects), what I'm writing (feed). Each section gets real vertical air (`margin-top: 64px`, hero padding `56px` top). Generous whitespace is on-brand here; minimal is intentional, not empty.
- **Two CTAs max** in the hero, not three. One primary (blue), one ghost.
- Stats are a single quiet mono line under the hero (`{n} posts · 3 series · {n} min`), not a competing bordered card in a right rail.
- Section headers use a quiet uppercase mono label (`.section-title`) + a muted "all →" link (`.section-all`), replacing the heavier per-section header treatments.

## Elevation & Depth

Depth is mostly created with contrast, borders, and spacing - not shadows. The current site uses flat near-black surfaces and subtle borders. Avoid heavy drop shadows, glassmorphism, blurred pastel cards, or big layered panels.

A subtle CSS-only noise texture or grid is acceptable when it is almost invisible and does not compete with text. The homepage uses this sparingly as atmosphere, not decoration.

## Shapes

Use small radii. Default radius is `4px`; panels may use `6px`; chips can use `3px`; fully rounded pills are rare and only for small tags/counts.

Avoid the rounded 20-30px card style from generic AI dashboards. The shape language should feel precise and utilitarian.

## Components

- **Sticky nav:** Near-black blurred bar, 52px tall, thin bottom border, brand left, lowercase mono links right. Active nav is the accent (blue); inactive nav is muted gray.
- **Hero header:** Small mono prompt, compact avatar or marker, clear title, one sharp hook sentence, optional blinking accent cursor, role/progression line, and one or two CTAs.
- **Stats card:** Dark `bg-3` panel with `border-2`, mono uppercase label, muted metric names, accent (blue) values.
- **Feed rows:** Prefer row-based lists. Left marker, middle title/content, right metadata/date. Hover background should be a small step lighter (`#111111` or `bg-2`).
- **Tabs:** Mono labels, muted by default, accent active state, thin bottom border.
- **Tags/chips:** Tiny mono bracketed labels, muted default, accent border/background on hover or active.
- **Buttons:** Primary is accent (blue) fill with black text. Ghost is transparent with subtle border and muted text. Hover can translate up by `-1px`, but keep motion minimal.
- **Code/diagram blocks:** Dark panel, mono text, subtle border, compact padding. Make them look like system output, not decorative cards.

## Do's and Don'ts

Do:

- Make every published artifact look native to `sonwork.org`.
- Use the dark palette, Inter, JetBrains Mono, the blue accent, thin borders, and compact dashboard spacing.
- Use file paths, prompts, tags, stats, and logs as visual language.
- Keep copy direct, personal, and low-bullshit.
- Adapt gbrain-generated HTML to this system before pushing live.
- Validate accessibility for text on dark surfaces when adding new component colors.

Don't:

- Ship beige editorial pages, pastel plans, purple AI startup gradients, or glossy SaaS hero sections.
- Use random fonts outside Inter and JetBrains Mono.
- Use large 24px+ rounded cards or blob backgrounds.
- Use more than one strong accent color (the single accent is blue `#63B1F9`).
- Over-animate; motion should be quick and functional.
- Publish one-off visual systems that make `sonwork.org` feel inconsistent.

## Implementation (where the tokens live)

The frontmatter above is the **canonical token spec**. In the Astro site those tokens
are implemented as CSS custom properties in **`src/styles/global.css`** under `:root`,
imported once by **`src/layouts/Base.astro`** (`import '../styles/global.css'`). Every page
that renders through `Base.astro` (all of them) inherits the `:root` vars globally — including
inside a page's scoped `<style>` block. So `var(--accent)` etc. resolve in any `.astro` page
that uses the shared layout. A page that does NOT use `Base.astro` must import `global.css`
itself (or define its own `:root`) or the vars will not resolve.

### Color tokens → CSS vars

| Token (frontmatter) | CSS var | Notes |
|---|---|---|
| bg, bg-2 … bg-5 | `--bg`, `--bg-2` … `--bg-5` | step-up surfaces |
| border, border-2 | `--border`, `--border-2` | thin dividers |
| text, text-2, text-3 | `--text`, `--text-2`, `--text-3` | copy → metadata |
| accent, accent-dim | `--accent`, `--accent-dim` | blue accent + hover border |
| black, white | `--black`, `--white` | black = text on the accent fill; white = rare hover emphasis only |

`primary` / `secondary` / `tertiary` / `neutral` in the frontmatter are **semantic aliases**
for `bg` / `text` / `accent` / `text-2` (kept for tooling); they are not separate CSS vars.

> **Naming note (2026-05 amber→blue switch):** the CSS vars were renamed `--amber*` → `--accent*`
> across `src/styles/global.css` and the `.astro` pages, and the `.amber` / `.amber-link` utility
> classes were renamed `.accent` / `.accent-link`. The two standalone static artifacts in `public/`
> (`aie.html`, `os-v1.html`) keep their inline `--amber*` var **names** but now hold **blue values**
> (#63B1F9 / #4284C5) — they are self-contained and not part of the component system. No orange hex
> (#E8A045 / #C4872E / #D4913E) remains anywhere in `src/`, `public/`, or `dist/`.

### Implementation-only tokens (in CSS, not in the frontmatter palette)

These exist in `global.css` because they're derived from the palette, not new colors:

- `--accent-hover: #75beff` — the accent **fill** hover for `.btn-primary` / `.form-submit`
  (distinct from `--accent-dim`, which is the accent **border** hover).
- `--accent-bg: rgba(99,177,249,0.08)` and `--accent-bg2: rgba(99,177,249,0.14)` — accent tints
  for chip/pill backgrounds and active-state backgrounds.
- `--container: 760px` / `--gutter: 32px` (`--gutter-sm: 20px` ≤640px) — the shared page-container
  width + gutter. Nav inner, home, listing pages (series/about/os-v1) and post chrome all use
  these so every left/right edge lines up on one vertical axis.
- `--mono` / `--sans` — the JetBrains Mono / Inter font stacks.
- `--radius: 4px` — equals `rounded.sm`; the default radius var used across components.
- `--nav-h: 52px` — equals `components.nav.height`.

The `typography`, `spacing`, and `rounded` scales in the frontmatter are the **spec**; in CSS
they are currently applied as literal values per component (only `--radius` and `--nav-h` are
vars today). When adding new components, follow the frontmatter scale.

### Non-palette accent colors (intentional one-offs)

A few surfaces use small fixed accent colors that are **deliberately outside** the Command
Center palette and must not be "corrected" to the primary accent. None of them is orange:

- **Series identity** (`badge-life`, `badge-exp`, `badge-human`) — three distinct muted hues:
  blue `#63B1F9` / teal `#5ED3C4` / violet `#C87FFF`. (The `exp` marker was orange before the
  blue switch; it is now teal so no orange remains.)
- **Project status** (`status-active`, `fp-badge-active`, status dots) — **active = the blue
  accent** (primary/positive state wears the accent), **building = teal `#5FCF9E`** (in-progress,
  clearly distinct from the blue accent), **parked = gray**. Building was amber before the switch;
  it is teal now.
- **Per-project featured-card accents** (`.fp-<slug>`) — optional bespoke gradient per project.
  A project without an `.fp-<slug>` rule falls back to the default **blue** accent on
  `.fp-card-accent` — this is intended, so generic/new projects still show an accent. Perfeat
  (`.fp-perfeat`) is the primary build and wears the primary blue accent directly.
- **gbrain agent colors** (`/gbrain` page) — a 7-color per-agent palette. The primary **shared**
  hub now wears the site **blue accent** (`var(--accent)`, read via `getComputedStyle`); the rest
  stay a varied multi-hue set (robin=cyan `#22D3EE`, karpathy=green, augustus=pink, aurelius=violet,
  lando=orange-dot, saman=slate), retuned so none collides with the blue accent. Shared across that
  page's diagram, source list, graph legend, link matrix, and the knowledge-graph `<canvas>`.

When introducing any new non-palette accent, validate text contrast on the dark surface
(body ≥ 4.5:1) before shipping.

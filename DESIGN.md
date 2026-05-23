---
version: alpha
name: Sonwork Command Center
description: Dark personal operating-system aesthetic for sonwork.org public pages and published artifacts.
colors:
  primary: "#0A0A0A"
  secondary: "#E8E8E8"
  tertiary: "#E8A045"
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
  amber: "#E8A045"
  amber-dim: "#C4872E"
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
    backgroundColor: "{colors.amber}"
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

Use this design whenever publishing pages, plans, reports, dashboards, OS docs, or product artifacts to `sonwork.org`. The page should look like it belongs beside the live homepage: minimal black surface, muted text, amber accent, monospaced metadata, thin dividers, compact rows, and restrained interaction.

## Colors

- **bg (#0A0A0A):** The default page background. Use near-black instead of pure design black to keep the page readable and quiet.
- **bg-2 through bg-5:** Step-up surfaces for panels, row hovers, stats cards, chips, and nested UI. Keep contrast subtle.
- **border / border-2:** Thin low-contrast dividers. Borders should be felt more than seen.
- **text (#E8E8E8):** Primary copy. Avoid pure white except for rare hover emphasis.
- **text-2 (#A0A0A0):** Body support text, secondary descriptions, quiet labels.
- **text-3 (#666666):** Metadata, timestamps, inactive nav, helper text.
- **amber (#E8A045):** The only strong accent. Use for active states, key metrics, markers, links, cursor details, and important numbers.
- **amber-dim (#C4872E):** Hover borders and lower-emphasis amber states.

Do not introduce purple AI gradients, bright blue SaaS accents, pastel cards, beige editorial backgrounds, or multi-accent rainbow systems unless Son explicitly asks.

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

## Elevation & Depth

Depth is mostly created with contrast, borders, and spacing - not shadows. The current site uses flat near-black surfaces and subtle borders. Avoid heavy drop shadows, glassmorphism, blurred pastel cards, or big layered panels.

A subtle CSS-only noise texture or grid is acceptable when it is almost invisible and does not compete with text. The homepage uses this sparingly as atmosphere, not decoration.

## Shapes

Use small radii. Default radius is `4px`; panels may use `6px`; chips can use `3px`; fully rounded pills are rare and only for small tags/counts.

Avoid the rounded 20-30px card style from generic AI dashboards. The shape language should feel precise and utilitarian.

## Components

- **Sticky nav:** Near-black blurred bar, 52px tall, thin bottom border, brand left, lowercase mono links right. Active nav is amber; inactive nav is muted gray.
- **Hero header:** Small mono prompt, compact avatar or marker, clear title, one sharp hook sentence, optional blinking amber cursor, role/progression line, and one or two CTAs.
- **Stats card:** Dark `bg-3` panel with `border-2`, mono uppercase label, muted metric names, amber values.
- **Feed rows:** Prefer row-based lists. Left marker, middle title/content, right metadata/date. Hover background should be a small step lighter (`#111111` or `bg-2`).
- **Tabs:** Mono labels, muted by default, amber active state, thin bottom border.
- **Tags/chips:** Tiny mono bracketed labels, muted default, amber border/background on hover or active.
- **Buttons:** Primary is amber fill with black text. Ghost is transparent with subtle border and muted text. Hover can translate up by `-1px`, but keep motion minimal.
- **Code/diagram blocks:** Dark panel, mono text, subtle border, compact padding. Make them look like system output, not decorative cards.

## Do's and Don'ts

Do:

- Make every published artifact look native to `sonwork.org`.
- Use the dark palette, Inter, JetBrains Mono, amber accent, thin borders, and compact dashboard spacing.
- Use file paths, prompts, tags, stats, and logs as visual language.
- Keep copy direct, personal, and low-bullshit.
- Adapt gbrain-generated HTML to this system before pushing live.
- Validate accessibility for text on dark surfaces when adding new component colors.

Don't:

- Ship beige editorial pages, pastel plans, purple AI startup gradients, or glossy SaaS hero sections.
- Use random fonts outside Inter and JetBrains Mono.
- Use large 24px+ rounded cards or blob backgrounds.
- Use more than one strong accent color.
- Over-animate; motion should be quick and functional.
- Publish one-off visual systems that make `sonwork.org` feel inconsistent.

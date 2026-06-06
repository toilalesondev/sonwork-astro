---
version: "1.2"
name: Sonwork — Ink on Paper
description: >
  Warm serif reading surface for sonwork.org. A personal journal that happens to be public.
  The mood is quiet, unhurried, literate — a founder's field log. Light mode is the canonical
  paper surface; dark mode is the same journal read by lamplight. One identity, two conditions.
colors:
  # Light mode — the canonical paper surface
  primary:    "#FAF6EF"
  secondary:  "#1B1A17"
  tertiary:   "#9E3A16"
  neutral:    "#4A4742"
  bg:         "#FAF6EF"
  bg-2:       "#F3EDE2"
  bg-3:       "#EDE5D7"
  bg-4:       "#E7DDCC"
  bg-5:       "#DED2BD"
  border:     "#E6DDCD"
  border-2:   "#D8CCB8"
  text:       "#1B1A17"
  text-2:     "#4A4742"
  text-3:     "#74706A"
  accent:     "#9E3A16"
  accent-dim: "#8A2E0E"
  black:      "#1B1A17"
  white:      "#FAF6EF"

  # Dark mode — warm coal (same identity, lamplight condition)
  dark:
    bg:         "#1A1714"
    bg-2:       "#221F1B"
    bg-3:       "#2C2924"
    bg-4:       "#343028"
    bg-5:       "#3D382F"
    border:     "#3A342A"
    border-2:   "#4A4238"
    text:       "#F0EBE1"
    text-2:     "#BDB5A8"
    text-3:     "#907E72"
    accent:     "#C8683E"
    accent-dim: "#A84D26"
    black:      "#F0EBE1"
    white:      "#1A1714"

typography:
  h1:
    fontFamily: Spectral
    fontSize: "clamp(2.75rem,6vw,4.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Spectral
    fontSize: "clamp(2rem,4.5vw,2.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: Spectral
    fontSize: 1.1875rem
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0em"
  body-sm:
    fontFamily: Spectral
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: Spectral
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.1em"
    textTransform: uppercase
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
    textColor: "{colors.text}"
    typography: "{typography.label}"
    height: 48px
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px 18px
  button-ghost:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-2}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 7px 18px
  tag-chip:
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 6px
---

## Design Principles

Sonwork is not a portfolio. Not a SaaS landing page. Not a terminal. It is a founder's field
log — the kind of notebook you'd find in a jacket pocket, written in ink, slightly warped from
humidity. The design decisions follow from this single constraint: **every element should feel
like it belongs in a bound journal.**

Three principles govern everything:

**1. Restraint as voice.** Sơn is not trying to perform competence. He is writing. The page
should give him room to do that — wide margins, generous line height, no chrome competing with
words. Design that calls attention to itself has failed.

**2. Warmth, not nostalgia.** The paper palette is not vintage cosplay. It is how reading feels
when it's comfortable — warm light, no glare, the eye relaxed. Every color decision runs through
this filter: does this make reading feel like rest, or like work?

**3. One voice across conditions.** Light and dark are not different designs. They are the same
journal in daylight and lamplight. A reader switching modes should feel continuity, not a theme
switch. The hue character, type choices, and layout are identical — only the luminance inverts.

---

## Overview

The identity is **Ink on Paper**: warm cream paper, ink-dark text, a single burnt sienna accent,
and Spectral serif throughout. No decorative complexity. The complexity is in the writing.

This is a deliberate departure from the prior **Command Center** dark-terminal aesthetic (2026-05):
blue accents, JetBrains Mono, `./introduction` path syntax. That design performed a role the
founder is no longer playing. The current design reflects who he actually is: a reader, a builder,
someone thinking in public.

**Dark mode is part of this identity**, not an afterthought. The canonical reading surface is
warm paper; the dark mode is the same surface under a different light source — deep warm coal,
off-white ink, sienna still present. The "same book read by lamplight" principle holds across
every token decision.

---

## Colors

### Why this palette

The light palette starts from a single decision: warm off-white rag paper, not pure white.
`#FAF6EF` sits at OKLCH L 0.965 C 0.012 H 78 — enough chroma to feel like paper (not
a screen), low enough not to distract. The ink (`#1B1A17`) is warm near-black, not `#000`.
Pure black vibrates on warm paper and reads digital. Warm near-black reads like ink on a page.

The sienna accent (`#9E3A16`) is the only non-neutral color in the system. Burnt sienna —
the color of a fountain-pen correction, a letterpress second run, a wax seal. One accent means
the eye has nowhere else to go. Used sparingly, it signals attention without performing it.

### Light mode (canonical paper surface)

All ratios measured on `#FAF6EF`:

| Token | Hex | Ratio | Role |
|-------|-----|-------|------|
| `--bg` | `#FAF6EF` | — | Page paper. Warm rag, never pure white. |
| `--bg-2` | `#F3EDE2` | — | Cards, row hovers. Paper deepens slightly. |
| `--bg-3` | `#EDE5D7` | — | Nav bg, selected states, nested panels. |
| `--bg-4` | `#E7DDCC` | — | Hover states, slightly elevated surfaces. |
| `--bg-5` | `#DED2BD` | — | Pressed states, deepest tint. |
| `--border` | `#E6DDCD` | ~1.3:1 | Hairline dividers. Felt, not seen. |
| `--border-2` | `#D8CCB8` | ~1.7:1 | Card edges, stronger hairlines. |
| `--text` | `#1B1A17` | **16.15:1** | Primary ink. Warm near-black. |
| `--text-2` | `#4A4742` | **8.58:1** | Body support, descriptions. Passes AAA. |
| `--text-3` | `#74706A` | **4.57:1** | Dates, metadata, inactive nav. Passes AA. |
| `--accent` | `#9E3A16` | **6.35:1** | Burnt sienna. The one warm accent. |
| `--accent-dim` | `#8A2E0E` | **7.87:1** | Hover state: darker sienna for borders, fills. |

**Borders are intentionally below the 3:1 UI-component threshold.** They are non-text
decorative dividers whose structure is conveyed by layout alone — WCAG 1.4.11 exempts
decorative borders from the contrast requirement.

The accent was `#63B1F9` through the Command Center era. There is no blue in this system.
Grep `63b1f9`, `99,177,249`, `4284c5`, `75beff` must return zero in `src/`.

### Dark mode (warm coal surface)

Dark mode tokens live under `[data-theme="dark"]` in `global.css`. Every `:root` token
is overridden; no component-level changes are needed or permitted.

**The palette logic:** The dark background is deep warm coal, not pure black. `#1A1714` has
HSL hue H=30° — orange-brown warmth. As the background steps lighten toward hover and raised
states, the hue warms slightly (H 30°→34°→38°→40°→39°), mimicking the way lamplight warms
surfaces as they come closer to the light source. This is the mechanical detail that makes it
feel like lamplight rather than a generic dark theme.

All ratios measured on `#1A1714`:

| Token | Hex | Ratio | Role |
|-------|-----|-------|------|
| `--bg` | `#1A1714` | — | Deep warm coal. H=30° — not void, warmth is there. |
| `--bg-2` | `#221F1B` | — | First raised surface. H=34°, warming. |
| `--bg-3` | `#2C2924` | — | Cards, nav glass base. H=38°. |
| `--bg-4` | `#343028` | — | Hover states. H=40°, warmest step. |
| `--bg-5` | `#3D382F` | — | Pressed/deepest raised. H=39°. |
| `--border` | `#3A342A` | — | Warm grey-brown hairline. |
| `--border-2` | `#4A4238` | — | Stronger hairline for card edges. |
| `--text` | `#F0EBE1` | **15.02:1** | Warm off-white. Not pure white — keeps thermal warmth. |
| `--text-2` | `#BDB5A8` | **8.79:1** | Secondary text. Passes AAA. |
| `--text-3` | `#907E72` | **4.60:1** | Metadata, dates, helper text. Passes AA. |
| `--accent` | `#C8683E` | **4.68:1** | Sienna lightened for dark-bg legibility. Passes AA. |
| `--accent-dim` | `#A84D26` | **3.19:1** | Hover fills only. Passes UI-component threshold (3:1). |

> **Contrast discipline for dark mode `--accent-dim`:** `#A84D26` at 3.19:1 passes WCAG 1.4.11
> (UI components and graphics) but does not reach 4.5:1. **Never use it for text labels.**
> For any accent text on dark backgrounds, use `--accent` (`#C8683E`, 4.68:1).

> **Typography rendering note:** Spectral's thin strokes exhibit mild optical halation on dark
> backgrounds — text reads ~5% visually lighter than its contrast ratio suggests. This is a
> perceptual effect, not a contrast failure. At body size (19px, weight 400), no compensation
> is needed. At small sizes (≤13px, labels, tags), consider bumping weight from 500 to 600 in
> dark mode for equal perceived weight. Document any such override in `global.css`.

#### Why these specific dark-mode corrections from v1.1

Two values in the v1.1 spec were measured incorrectly and have been corrected:

- `--text-3` was `#857C72` (4.35:1 actual, claimed 4.1:1). **Fails AA at 4.5:1** for normal-size
  text (metadata and dates are rendered at 0.75rem/12px — small text requires 4.5:1, not 3:1).
  Corrected to `#907E72` (4.60:1 actual).

- `--accent` was `#C4643A` (4.45:1 actual, claimed 4.8:1). **Fails AA at 4.5:1.**
  Corrected to `#C8683E` (4.68:1 actual). Hue is unchanged at H=18° (within the sienna
  family H=15–25°). The correction is two steps brighter, not a character change.

### Non-palette one-off colors

These require explicit dark-mode CSS overrides because they cannot be derived from token
arithmetic:

- **Status: building** — deep green `#2F7D4F` (4.68:1 on paper); `#3D9A62` in dark mode
  (5.10:1 on coal). Never use the old teal `#5FCF9E` (1.7:1 on paper — fails badly).
- **Status: active** — `--accent` in both modes (token handles it automatically).
- **Status: parked** — `--text-3` in both modes (token handles it automatically).

---

## Typography

**One family. Spectral. Everything.**

This is not a technical constraint — it is a design decision. A single serif family on a reading
surface creates an uninterrupted typographic voice. Introducing a second typeface (even a
complementary one) introduces a conversation between fonts that competes with the conversation
in the writing. For a personal journal, that is wrong.

Spectral is the right call for this specific use case: it is a screen-first serif commissioned
by Production Type for on-screen reading, not adapted from a print original. Its weights perform
well at reading sizes on both light and dark backgrounds. Critically, it ships the full Vietnamese
Extended block (U+1EA0–1EF9, U+01A0–01A1) — `Sơn Lê` and all Vietnamese diacritics render
correctly without fallback.

JetBrains Mono was retired in 2026-05. Monospace on a book surface reads as costume.

### The scale

| Role | Size | Weight | Leading | Tracking | Notes |
|------|------|--------|---------|----------|-------|
| Hero name | `clamp(2.75rem,6vw,4.25rem)` | 700 | 1.05 | −0.02em | Never 800 — gets inky on light, muddy on dark |
| Page titles | `clamp(2rem,4.5vw,2.5rem)` | 700 | 1.08 | −0.02em | |
| Article title | `clamp(2.25rem,5vw,3rem)` | 700 | 1.12 | −0.02em | |
| Body | 1.1875rem (19px) | 400 | 1.62 | 0 | Max-width 65–68ch |
| Body small | 1.0625rem (17px) | 400 | 1.7–1.8 | 0.005em | Mobile body, descriptions |
| Hero hook | 1.375rem | 400 italic | 1.55 | 0 | The italic inscription |
| Nav / labels | 0.75–0.8125rem | 500–600 | 1.3 | 0.08–0.1em | Uppercase only |
| Metadata / dates | 0.75rem | 400 | — | 0 | Old-style numerals required |
| Drop cap | 3.4em float | 700 | 0.78 | 0 | Sinks 3 lines, sienna (`--accent`) |

**On weight 800:** Spectral 800 in light mode becomes excessively inky — the letterforms fill
in and lose clarity. In dark mode at 800 weight, the thin strokes bleed into the background
and the contrast between thick and thin (what makes a serif elegant) collapses. Stay at 700 for
display.

**Old-style numerals:** Use `font-variant-numeric: oldstyle-nums` on all dates and counts.
The 3, 4, 7 with descenders are the single most book-like numeral detail. One CSS property,
significant character effect. Already implemented in `.post-date`, `.writing-row-date`,
`.post-article-meta`, `.hero-meta`.

**The hero hook in italic:** The voice statement. Setting it in italic at 1.375rem reads like
an inscription on a frontispiece — the author addressing the reader before the book begins.
Do not make it bold. Do not make it larger. The understatement is the point.

**Drop cap:** `.post-content p:first-child::first-letter` — Spectral 700, 3.4em, floated left,
sienna accent. Progressive enhancement via `initial-letter: 3` where supported. This is the
unmistakable "you have opened a book" signal. Both modes inherit it correctly via `--accent` token.

**Fallback stack:** `'Spectral', 'Be Vietnam Pro', Georgia, 'Times New Roman', serif`
Be Vietnam Pro is a Vietnamese-designed typeface; it handles the diacritics if Spectral
fails to load.

---

## Layout

### The set page

The governing metaphor is a **set book page**: a reading column, centered in generous margins,
framed by quiet hairline rules. No decorative chrome. No sidebar. No widget columns.

- **Container:** 760px max-width. `32px` gutter on desktop, `20px` on mobile (≤640px).
- **Reading column:** Body prose capped at 65–68ch. Lines outside 65–75ch require justification
  or readers scan rather than read.
- **Vertical rhythm:** `72px` between sections on home, `44px` between sections on inner pages.
  Derived from the type scale, not arbitrary.
- **Folio rules:** The nav bottom border and hero top border share `--border`. This creates a
  consistent horizontal rule system — like the headline/footline rules in a printed book.
  Do not add intermediate rules without a clear structural reason.

### The wordmark

**Sơn.** — the name as the mark, set in Spectral at 21px weight 700. The geometric S-tile app
icon was retired with the Command Center identity. The name wordmark is quieter and more honest:
the founder is not a brand, he is a person. The sienna dot is a printed full stop, not punctuation
performing personality. On hover, the wordmark (`Sơn`) warms toward `--accent`; the dot stays
sienna throughout.

---

## The Dark Mode Rationale

### Why dark mode belongs here

Approximately half of users in 2026 have system dark mode enabled. `Base.astro` already reads
`prefers-color-scheme: dark` in its anti-FOUC script. Refusing to spec dark mode does not
remove it from the user experience — it just means those users receive either a white flash or
an unspecced override. Both are actively worse than an intentional palette.

The original Ink on Paper DESIGN.md (2026-05-31, v1.0) said "Don't: Reintroduce dark surfaces."
That rule was aimed at the **Command Center aesthetic**, not at dark mode as a reading preference.
The Command Center dark theme was bad because of its aesthetic choices — blue accents, mono
typefaces, terminal syntax — not because it was dark. This system supports dark mode with the
same design philosophy: warm paper tones (inverted), warm ink tones (inverted), sienna still
present. The aesthetic is preserved.

### What makes it "lamplight" not "generic warm dark"

The difference between a lamplight dark palette and a generic dark theme with warm tints:

1. **The base hue is brown-black, not grey-black.** `#1A1714` has H=30°. A generic dark theme
   uses H=0° (grey) or H=240° (cool blue-grey). This one degree of warmth in the base changes
   everything.

2. **The step hue warms as it lightens.** `bg` H=30° → `bg-2` H=34° → `bg-3` H=38° → `bg-4`
   H=40°. This mimics the physics of lamplight: surfaces closer to the light source pick up
   more amber warmth. It is a tiny detail. It is the detail.

3. **The text is warm off-white, not pure white.** `#F0EBE1` has H=32°. Pure white (`#FFFFFF`)
   on dark coal creates harsh glare — the eye tenses. Warm off-white reads like ink on a page
   photographed by candlelight.

4. **The accent is still sienna.** It lightens from `#9E3A16` to `#C8683E` for dark-bg
   legibility, but the hue (H=16→18°) is unchanged. In both modes, the one accent color
   reads as "warm rust ink." The character is preserved.

5. **No new colors in dark mode.** The dark palette is not a retheme — it is a token inversion.
   Every component that uses `--accent` still uses `--accent`. Every component that uses
   `--text-3` still uses `--text-3`. The tokens do the work.

---

## Elevation and Depth

Depth is created with paper/coal tints and hairline borders — not shadows. The hierarchy:

- **Flat surface:** `--bg` background, no border.
- **Raised surface (cards, panels):** `--bg-2` background + `--border-2` hairline.
- **Hovered surface:** `--bg-3` or `--bg-4` background.
- **Pressed/active:** `--bg-4` or `--bg-5`.

**Box shadows are avoided.** The one exception: the featured-project card hover uses
`0 2px 12px rgba(27,26,23,0.06)` on light, `0 2px 12px rgba(0,0,0,0.18)` on dark.
This is barely perceptible — a suggestion of lift, not a declaration of it.

---

## Shapes

Small radii: `4px` default, `6px` cards, `3px` chips. No `20–30px` rounded cards.
The shape language is quiet. Large radii belong to UI that wants to be friendly;
this design wants to be unobtrusive.

---

## Components

### Sticky nav

48px tall. `--nav-bg` (warm translucent glass) with `backdrop-filter: blur(12px)`.
Thin `--border` bottom hairline. **Sơn.** wordmark left. Uppercase Spectral 500 links center.
Theme toggle far right.

- Active link: `--text` color + `--bg-3` background tint.
- Inactive link: `--text-3`, warms to `--text` on hover with `--bg-4` tint.
- The nav adapts to dark mode automatically via token vars — no component-level dark overrides.

**Nav height note:** The CSS custom property `--nav-h` is set to `52px` in `:root` but the
`.nav` class hardcodes `height: 48px`. The canonical height is `48px`; `--nav-h` should be
corrected to `48px` to match. @eng: fix the `--nav-h` discrepancy.

### Theme toggle

A `32×32px` button at the right end of the nav. Styled with `--border-2` hairline (1px),
`--text-3` color, `--bg-3` hover background, `--text` hover color.

**Iconography:** ☽ (U+263D, crescent moon) in light mode; ☀︎ (U+2600 + U+FE0E text-selector)
in dark mode. The icon shows the mode you would switch **to**, not the current mode.

**U+FE0E text selector is critical.** Without `&#x2600;&#xFE0E;` (or the equivalent Unicode
escape), the sun character renders as the emoji ☀️ (colorful, system-rendered) rather than
the text-mode ☀︎ (plain, font-rendered). The HTML must use the text presentation selector.
Keep `font-family: var(--serif)` on the button to prevent fallback to an emoji font.

The toggle transitions: `background 0.15s, color 0.15s, border-color 0.15s`. No spin.
No pop. A quiet toggle for a quiet interface.

### Hero header

No prompt prefix. No blinking cursor. No file-path labels. Name in Spectral 700 at
`clamp(2.75rem,6vw,4.25rem)`. Hero hook in Spectral 400 italic at 1.375rem. Role line
in `--text-3` at small size. Bio in `--text-2` at `1.0625rem`, line-height `1.8`.
Two CTAs below.

### Buttons

- **Primary:** `--text` fill + `--bg` text (a bookplate stamp). Hovers to `--accent-dim` fill.
  The inversion — ink-colored button, paper-colored text — reads as a stamp, not a digital button.
- **Ghost:** `--bg` background + `--border-2` hairline + `--text-2` color. Border warms to
  `--accent` on hover. Ghost buttons recede until needed.

Both buttons use only token vars. Dark mode is automatic.

### Feed rows and writing list

Row-based lists, `--bg-2` hover tint, title warms to `--accent` on hover. Date in `--text-3`
with `font-variant-numeric: oldstyle-nums`. The row hover is the interaction — no click
animation needed.

### Tags / chips

Spectral 600 uppercase, `--text-3` color. No brackets. Brackets were terminal syntax.
At 11px, the font-weight should be 600 (not 500) to maintain perceived weight on dark
backgrounds where antialiasing thins small text.

### Featured-project cards

`--bg-2` panel + `--border-2` hairline + 2px `--accent` solid top rule. Card name in
Spectral 700. Status badge in Spectral uppercase at tiny size (0.5–0.5625rem). Cards use
only token vars; dark mode is automatic except the building-status green (see below).

### Empty state (journal page)

Italic opening line in Spectral 500 at 1.5rem. A 2px sienna ink-tick (`--accent`)
before the lead. CSS-drawn ruled lines that fade via a mask gradient using `--border`.
The ruled lines adapt automatically (the border token shifts). The empty state should
feel like a blank page in a journal — not a sad UI void.

---

## Do's and Don'ts

### Do

- Make every page feel like it belongs in the same bound journal.
- Use only the token vars — `var(--bg)`, `var(--text)`, `var(--accent)` — for all colors.
  Never hardcode a hex value that is not a defined CSS var.
- Use old-style numerals (`font-variant-numeric: oldstyle-nums`) for all dates and counts.
- Validate contrast on **both** light and dark surfaces before shipping any color decision.
  Body text ≥4.5:1, large text ≥3:1, UI components ≥3:1.
- Keep all dark-mode overrides in the `[data-theme="dark"]` block in `global.css`.
  Components are theme-unaware. The cascade does the work.
- Use `--accent` for any accent text in dark mode. `--accent-dim` is fill-only.
- Let Spectral's letterforms do the work. The type is the design.
- Keep copy direct, personal, and unperformed. No em-dashes.

### Don't

- Reintroduce the Command Center aesthetic: blue accents (any hex in the `#63B1F9` family),
  JetBrains Mono or any monospace, terminal prompt syntax (`./introduction`, `> `), blinking
  cursors, file-path navigation. That design is retired.
- Use `font-weight: 800` for Spectral at any display size. At 800, the ink fills in on light
  and bleeds on dark. Weight 700 is the maximum for this system.
- Add gradients, glow effects, noise textures, or heavy box shadows. Depth comes from
  tint steps and hairlines.
- Add dark-mode logic in component CSS files. All mode switching lives in `global.css`.
- Introduce a second typeface without the founder's explicit decision. The one-family system
  is not a limitation — it is the voice.
- Ship more than one strong accent color. The hierarchy depends on sienna being alone.
- Write contrast ratios without verifying them. `#C4643A` (the v1.1 spec) actually fails AA
  at 4.45:1. Always compute; never claim.
- Forget the `U+FE0E` text selector on ☀︎. Without it, the sun renders as emoji on most systems.

---

## Implementation

The frontmatter above is the canonical token spec. In the Astro site, tokens live as CSS
custom properties in **`src/styles/global.css`** under `:root`, imported once by
**`src/layouts/Base.astro`**. Dark mode overrides live under `[data-theme="dark"]` in the
same file.

### Color tokens → CSS vars

| Token | CSS var | Notes |
|-------|---------|-------|
| bg, bg-2 … bg-5 | `--bg`, `--bg-2` … `--bg-5` | paper/coal tints |
| border, border-2 | `--border`, `--border-2` | hairline dividers |
| text, text-2, text-3 | `--text`, `--text-2`, `--text-3` | ink → metadata |
| accent, accent-dim | `--accent`, `--accent-dim` | sienna accent |
| black, white | `--black`, `--white` | semantic role aliases |

### Implementation-only tokens (CSS, not frontmatter)

These are computed from the palette but not in the frontmatter spec:

- `--accent-hover` — lighter sienna for fill hovers. Light: `#B0451E` (5.25:1); Dark: `#D4754A` (5.48:1).
- `--accent-bg` — tint for chip/badge backgrounds. Light: `rgba(158,58,22,0.07)`; Dark: `rgba(196,100,58,0.10)`.
- `--accent-bg2` — stronger tint for selection/highlight. Light: `rgba(158,58,22,0.12)`; Dark: `rgba(196,100,58,0.18)`.
- `--nav-bg` — nav glass. Light: `rgba(250,246,239,0.88)`; Dark: `rgba(26,23,20,0.88)`.
- `--serif: 'Spectral', 'Be Vietnam Pro', Georgia, 'Times New Roman', serif`
- `--sans` / `--mono` — aliased to `--serif` (legacy classes still resolve).
- `--container: 760px` / `--gutter: 32px` / `--gutter-sm: 20px`.
- `--radius: 4px` / `--nav-h: 48px` (must match `.nav { height: 48px }` — see nav note above).

### The dark mode pattern

```css
:root {
  color-scheme: light;
  --bg: #FAF6EF;
  --text-3: #74706A;
  --accent: #9E3A16;
  /* ... all light tokens ... */
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg: #1A1714;
  --text-3: #907E72;   /* corrected from v1.1 — was #857C72 (fails AA) */
  --accent: #C8683E;   /* corrected from v1.1 — was #C4643A (fails AA) */
  /* ... all other dark overrides ... */
}
```

`Base.astro` sets `data-theme="light"` as the HTML attribute default. The anti-FOUC inline
blocking script overrides it from localStorage or `prefers-color-scheme` before first paint
(`is:inline` — keep it blocking). The Nav toggle flips at runtime and persists to localStorage.

**Every component must be theme-unaware.** Use `var(--bg)`, `var(--text)`, etc. Never reference
`[data-theme="dark"]` inside a component file. The cascade handles it.

### Green badge overrides (both modes)

Building-status green requires explicit dark-mode overrides because it is a hardcoded hex
value outside the token system:

```css
[data-theme="dark"] .fp-badge-building,
[data-theme="dark"] .status-building {
  color: #3D9A62;            /* 5.10:1 on #1A1714 */
  border-color: rgba(61,154,98,.30);
  background: rgba(61,154,98,.09);
}
[data-theme="dark"] .building-dot { background: #3D9A62; }
```

---

## Open Questions for the Founder

These are design decisions that need the founder's voice, not a designer's default:

1. **The hero hook copy.** The italic inscription sets the emotional register of the whole
   page. What is the one sentence that captures why Sơn writes in public?

2. **Vietnamese in the wordmark.** `Sơn.` renders correctly in Spectral. Is the full
   diacritical form the preferred mark, or does Sơn use `Son.` in some contexts?

3. **Post content line length.** Body prose is capped at 68ch. For Vietnamese-language posts
   (if any), character width differs — do Vietnamese posts warrant a different column width?

4. **The sienna dot semantics.** The `.` after `Sơn` in the nav is a full stop, not decoration.
   Does it feel right in English-language contexts, or does it read as stylistic affectation?

5. **Dark mode as opt-in vs system-default.** The current implementation follows the system
   preference (`prefers-color-scheme`) by default. Would Sơn prefer light mode as the
   explicit default regardless of system setting (i.e., dark only when explicitly toggled)?

---

## Version History

- **2026-05-30:** amber → blue (accent switch, dark theme).
- **2026-05-30:** Inter → Hanken Grotesk (type reset).
- **2026-05-30:** Hanken Grotesk → Spectral (serif, type scale 18px base).
- **2026-05-31 v1.0:** Dark Command Center → Ink on Paper (full principle redesign). Blue
  accent → sienna. JetBrains Mono retired. One-family Spectral system. Favicon regenerated.
  Wordmark → Sơn. in Spectral.
- **2026-06-06 v1.1:** Dark mode properly specced and owned by @general. Warm coal palette
  (`#1A1714`–`#3D382F`) added. Sienna lightened to `#C4643A` for dark-bg legibility.
  Theme toggle (Nav.astro) part of canon. Anti-FOUC script confirmed correct.
- **2026-06-06 v1.2:** Design pass by @design. Full color theory audit. Corrected two
  failing contrast values: `--text-3` dark `#857C72`→`#907E72` (was 4.35:1, now 4.60:1);
  `--accent` dark `#C4643A`→`#C8683E` (was 4.45:1, now 4.68:1). Documented the `--nav-h`
  discrepancy (52px var vs 48px class). Added typography rendering notes for dark backgrounds.
  Documented U+FE0E text-selector requirement for ☀︎ toggle icon. Replaced token-spec-as-principles
  with actual design principles. Added "Why lamplight not generic dark" rationale. Added open
  questions for the founder.

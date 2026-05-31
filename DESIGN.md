---
version: beta
name: Sonwork — Ink on Paper
description: Warm light book-reading surface for sonwork.org. A personal journal that happens to be public.
colors:
  primary: "#FAF6EF"
  secondary: "#1B1A17"
  tertiary: "#9E3A16"
  neutral: "#4A4742"
  bg: "#FAF6EF"
  bg-2: "#F3EDE2"
  bg-3: "#EDE5D7"
  bg-4: "#E7DDCC"
  bg-5: "#DED2BD"
  border: "#E6DDCD"
  border-2: "#D8CCB8"
  text: "#1B1A17"
  text-2: "#4A4742"
  text-3: "#74706A"
  accent: "#9E3A16"
  accent-dim: "#8A2E0E"
  black: "#1B1A17"
  white: "#FAF6EF"
typography:
  h1:
    fontFamily: Spectral
    fontSize: clamp(2.75rem,6vw,4.25rem)
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Spectral
    fontSize: clamp(2rem,4.5vw,2.5rem)
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

## Overview

Sonwork — Ink on Paper is the visual identity for `sonwork.org`. It should feel like a well-set personal journal made public: warm paper, ink-dark text, a single sienna accent, and a Spectral serif that reads like a book. The mood is quiet, unhurried, and literate — a founder's field log, not a dashboard, not a SaaS landing page, not a terminal cosplay.

This is a deliberate departure from the original Command Center dark-theme identity (2026-05). The switch was made because a humble, learning-in-public writer whose product is a private food-memory diary should not have a trading-terminal website. The book surface fits the person.

## Colors

- **bg (#FAF6EF):** The page paper. Warm off-white rag paper, never pure white. OKLCH L 0.965 C 0.012 H 78.
- **bg-2 through bg-5:** Step-up raised surfaces for cards, row hovers, nested panels. Paper tint deepens very slightly — keep steps subtle.
- **border / border-2:** Hairline dividers. Borders should be felt more than seen. `--border` is ≈1.3:1 on paper (decorative only); `--border-2` is ≈1.7:1. These are intentionally below the 3:1 UI-component threshold — they are non-text dividers whose structure is conveyed by layout, not by the line alone.
- **text (#1B1A17):** Primary ink. Warm near-black (not pure #000, which vibrates and reads cold/digital). 16.2:1 on paper.
- **text-2 (#4A4742):** Body support text, secondary descriptions. 8.6:1 on paper.
- **text-3 (#74706A):** Metadata, dates, inactive nav, helper text. 4.6:1 on paper (passes AA for normal text).
- **accent (#9E3A16):** The one warm-ink accent — burnt sienna / oxblood. The color of a fountain-pen correction or a letterpress second-run. 6.4:1 on paper.
- **accent-dim (#8A2E0E):** Stronger accent for hover borders, hover fills. 7.9:1 on paper.

The accent was blue (#63B1F9) through the Command Center era (2026-05). Sơn asked for a full principle redesign; the canonical accent is now sienna. No blue remains in the token set. Grep `63b1f9`, `99,177,249`, `4284c5`, `75beff` must return zero in `src/`.

## Typography

Use **Spectral** for everything — prose, display, labels, dates, meta. This is a deliberate one-family system: Spectral is a screen-first serif by Production Type, commissioned for on-screen reading, and it holds up at text sizes on light backgrounds. It ships the full Vietnamese Extended block (U+1EA0–1EF9, U+01A0–01A1) — `Sơn Lê` and all Vietnamese diacritics render correctly.

JetBrains Mono was retired in 2026-05 (paper pass). Monospace on a book surface reads as costume.

- **Prose / body:** Spectral 400 at 1.1875rem (19px) / line-height 1.62. Letter-spacing 0. On paper, ink reads at full weight — no dark-mode compensation needed.
- **Display (hero name, page titles, post titles):** Spectral 700 (not 800 — 800 Spectral on light paper gets inky/heavy). Fluid clamp() for the three true display sizes.
- **Labels / nav / meta:** Spectral 500–600 at small sizes (0.6875–0.8125rem), small-caps or uppercase with 0.08–0.12em tracking. No mono.
- **Dates / post meta:** Spectral 400, normal case, old-style figures (`font-variant-numeric: oldstyle-nums`). The 3,4,7 with descenders are the single most book-like numeral detail.
- **Hero hook:** Spectral italic 400 at 1.375rem. The voice statement — set in italic, it reads like an inscription.
- **Drop cap:** Spectral 700 at 3.4em, sienna, sunk 3 lines. The unmistakable "opened a book" signal.
- **Tags:** Spectral 500 uppercase, no brackets. Brackets were terminal syntax; they're retired with the dark theme.

**Vietnamese safety:** Spectral ships the precomposed tone+vowel block and horn forms. Fallback stack: `'Spectral', 'Be Vietnam Pro', Georgia, 'Times New Roman', serif`. Be Vietnam Pro is a Vietnamese-designed typeface for when Spectral fails to load; Georgia handles the rare case where neither loads.

## Layout

Keep the existing container (`760px` max-width, `32px` gutter, `20px` mobile gutter) and the four-page IA (home, /writing, /projects, /about). No structural IA change.

The page should read as a **set book page** — a quiet hairline folio frame, generous margins, the reading column centered. The nav hairline + hero top hairline + section dividers + footer rule all share `--border` to create a consistent horizontal rhythm — like the headline/footline rules on a printed page.

### Signature: the set page

Three coordinated details create the "printed page within a margin":
1. **Folio rule:** A hairline under the nav and a matching hairline above section endings, full-bleed to the content column.
2. **Old-style figures everywhere:** Dates, counts, post meta — all in Spectral old-style numerals. One CSS line per context.
3. **Sienna drop cap:** 3.4em Spectral 700 on post first-letter, sunk 3 lines, sienna accent. Progressive enhancement via `initial-letter: 3`.

No glow, no gradients, no noise texture, no box shadows on dark (at most a very soft warm shadow `0 2px 12px rgba(27,26,23,0.06)` on cards).

### The wordmark

**Sơn.** in Spectral — the name as the mark. The geometric "S" app-tile logo was retired with the dark theme. The name wordmark inhales slightly toward the accent on hover. The dot is a sienna period (a printed full stop, not an LED).

## Elevation & Depth

Depth is created with paper tints and hairline borders — not shadows. Cards and raised surfaces use `--bg-2` (a step warmer) with a `--border-2` hairline. Hover states use a slightly deeper warmth (`--bg-2` becomes the row; `--bg-4` becomes the hover) or a gentle border-color accent shift. Avoid box shadows on dark that look muddy on paper (exception: a barely-perceptible warm shadow for the featured-project card hover).

## Shapes

Small radii as before: `4px` default, `6px` cards, `3px` chips. No rounded 20–30px card style. The shape language is quiet and literate.

## Components

- **Sticky nav:** Warm paper bg with blur, 48px tall, thin bottom hairline, **Sơn.** wordmark left, uppercase Spectral labels right. Active nav = ink-dark text + paper-tint bg. Inactive = muted `--text-3`. Hover warms to ink.
- **Hero header:** No prompt prefix, no blinking cursor. Just the name (700 Spectral), an italic hook (400), a quiet role line, bio, and two buttons.
- **Buttons:** Primary = ink fill + paper text (a bookplate stamp) → sienna-dim on hover. Ghost = paper + hairline border, ink-warm color, sienna border on hover.
- **Feed rows:** Row-based lists, paper-tint hover, one accent (sienna) for hovered title color.
- **Tags/chips:** Spectral uppercase, muted ink, no brackets. The bracket was terminal syntax; it retires.
- **Featured-project cards:** Warm paper-tinted panel (`--bg-2`), hairline border (`--border-2`), a 2px sienna solid rule at top (not a gradient), serif project name.
- **Empty state (journal page):** The "no posts yet" state is a blank-journal motif: an italic opening line, a sienna ink-tick (2px vertical bar), and CSS-drawn ruled lines that fade out toward the bottom — the book is waiting.

## Do's and Don'ts

Do:
- Make every page feel like it belongs in the same bound journal.
- Use the paper palette, Spectral only, sienna accent, hairline dividers, and warm paper tints.
- Keep copy direct, personal, and low-bullshit. No em-dashes.
- Let the empty state be honest and designed, not a sad void.
- Use old-style figures for dates and counts.
- Validate ink-on-paper contrast (body ≥ 4.5:1, all values above verified).

Don't:
- Reintroduce dark surfaces (near-black, #0A0A0A, dark panels, dark nav) anywhere. The dark theme is retired.
- Use JetBrains Mono or any monospace. Mono on a book surface reads as costume.
- Use the blue accent (#63B1F9, or any blue) — the accent is sienna.
- Add gradients, glow effects, noise textures, or box-shadow-heavy cards.
- Add bracketed tag syntax, terminal prompts (`./introduction`, `> `), blinking cursors, or file-path navigation labels.
- Introduce a second typeface without Sơn's approval — the one-family Spectral system is the canon.
- Ship more than one strong accent color.

## Implementation (where the tokens live)

The frontmatter above is the canonical token spec. In the Astro site, those tokens are CSS custom properties in **`src/styles/global.css`** under `:root`, imported once by **`src/layouts/Base.astro`** (`import '../styles/global.css'`). Every page that renders through `Base.astro` inherits the `:root` vars globally.

### Color tokens → CSS vars

| Token (frontmatter) | CSS var | Notes |
|---|---|---|
| bg, bg-2 … bg-5 | `--bg`, `--bg-2` … `--bg-5` | paper tints |
| border, border-2 | `--border`, `--border-2` | hairline dividers |
| text, text-2, text-3 | `--text`, `--text-2`, `--text-3` | ink → metadata |
| accent, accent-dim | `--accent`, `--accent-dim` | sienna accent + stronger |
| black, white | `--black`, `--white` | black = ink; white = paper |

### Implementation-only tokens (CSS, not frontmatter)

- `--accent-hover: #B0451E` — lighter sienna for fill hovers.
- `--accent-bg: rgba(158,58,22,0.07)` and `--accent-bg2: rgba(158,58,22,0.12)` — accent tints.
- `--serif: 'Spectral', 'Be Vietnam Pro', Georgia, 'Times New Roman', serif` — font stack.
- `--sans` / `--mono` — aliased to `--serif` for safe fallback (residual `.mono` classes still resolve).
- `--container: 760px` / `--gutter: 32px` (`--gutter-sm: 20px` ≤640px) — shared page container.
- `--radius: 4px` / `--nav-h: 48px`.

### Non-palette accent colors (one-offs, re-tuned for paper)

These surfaces use small fixed accent colors deliberately outside the core palette. All have been contrast-verified on the paper bg:

- **Project status:** active = sienna accent (`--accent`), building = deep green `#2F7D4F` (4.6:1 on paper), parked = `--text-3`. Teal (`#5FCF9E`) was the dark-theme building color (1.7:1 on paper — failed) and was replaced.
- **Per-project featured-card accents:** Perfeat wears the primary sienna accent. Other projects may use a bespoke `.fp-<slug>` rule — must stay contrast-safe on paper.
- **Series identity (badge-life, badge-exp, badge-human):** removed with the series taxonomy in 2026-05. Rules are dead — do not reintroduce.

### Version history

- **2026-05-30:** amber → blue (accent switch, dark theme).
- **2026-05-30:** Inter → Hanken Grotesk (type reset).
- **2026-05-30:** Hanken Grotesk → Spectral (serif, type scale 18px base).
- **2026-05-31:** Dark Command Center → Ink on Paper (full principle redesign). Blue accent → sienna. JetBrains Mono retired. One-family Spectral system. Favicon regenerated (sienna serif S on paper, circular plate). Wordmark → Sơn. in Spectral.

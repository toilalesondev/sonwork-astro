# CONTEXT.md — Sonwork (sonwork.org)

> The single source of truth for **what this project is** and **the language we use to talk about it**.
> Read this before any task. Pair with `DESIGN.md` (visual canon) and `AGENTS.md` (workflow).
> Verified audit lives in `UNDERSTANDING.md`; the foundation plan in `RESTRUCTURE_PLAN.md`.

## One-liner

Sơn Lê's personal blog at **sonwork.org** — a static Astro site with a dark, personal
"operating-system" aesthetic. It is structured as a **reusable personal-site skeleton**:
blog (essays, organized into series) + projects + personal pages. Design *is* the product;
this is a brand surface, not a generic CMS.

## Project intent

Maintained as a clean **skeleton/template**: one sample post, one sample project, minimal
about/contact — kept fully working and styled, ready to refill with real content. Sơn's
identity (name, socials, bio) stays; only the article/project *content* is kept minimal.

## Vocabulary

| Term | Meaning |
|------|---------|
| **Series** | Top-level taxonomy for writing. Closed set of **three**: `life-book`, `experiences`, `human`. A post MUST belong to one. |
| **life-book** (`§`) | Year-by-year entries written as they happen, compiled into a physical book at 50. "Not memoir — evidence." |
| **experiences** (`↳`) | Accounts of specific real situations. "Not advice. Not lessons." |
| **human** (`◎`) | How people think, decide, break. "More useful than most frameworks." |
| **Post** | A markdown file in `src/content/posts/`. Slug = filename. Validated by the `posts` collection schema. |
| **Project** | An entry in `src/data/projects.ts` (plain TS array, NOT a content collection). Has a `status`. |
| **status** (project) | `active` \| `building` \| `parked` \| `exploring`. Drives card styling + the featured filter. |
| **marker** | The mono glyph identifying a series (`§ ↳ ◎`). Used in feeds, post headers, sidebar. |
| **Command Center** | The name of the design system (see `DESIGN.md`). Dark personal operating-system look. |
| **Brand register** | Personal/brand surface — design constraints are strict. See `.claude/skills/impeccable/reference/brand.md`. |

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Astro 6.3.3** | Static output. No SSR; only two vanilla `<script>` blocks (index filters, gbrain canvas). |
| Language | TypeScript (`astro/tsconfigs/strict`) | |
| Content | Astro **content collections** (`glob` loader + Zod) | Posts only. Projects are a plain TS array (ADR-0001). |
| Styling | **One** global stylesheet, imported by the layout | Tokens derive from `DESIGN.md`. See ADR-0002. |
| Fonts | Inter (prose/headings) + JetBrains Mono (system UI) | Loaded in `Base.astro`. Inter flagged as "reflex-reject" for a future redesign. |
| Integrations | `@astrojs/sitemap` | |
| Node | **>=22.12 (hard requirement)** | Astro build fails on Node 20. CI/deploy must use Node ≥22. |
| Deploy | sonwork.org (static host — confirm Cloudflare Pages / Vercel) | |

## Repository Map

```
src/
  layouts/Base.astro       ← the ONLY layout (html shell, fonts, imports global.css)
  components/Nav.astro     ← the ONLY component (sticky nav, 5 hardcoded links)
  content.config.ts        ← posts collection schema (series enum lives here)
  content/posts/*.md       ← the writing. slug = filename.
  data/projects.ts         ← projects array + Project interface + statusLabels
  data/series.ts           ← series metadata (single source — ADR-0003)
  pages/                   ← file-based routes (9)
    index.astro            ← dashboard hub: post feed + featured projects + sidebar + JS filters
    series.astro           ← writing grouped by series
    projects.astro         ← full project list
    posts/[slug].astro     ← individual post renderer
    about / contact / os-v1 / gbrain
  styles/global.css        ← THE canonical stylesheet, imported by Base.astro (ADR-0002)
public/
  os-v1.html, aie.html     ← standalone artifacts, NOT routes (see ADR-0002 / below)
  son.jpg, favicon.*       ← static assets
DESIGN.md                  ← visual canon. Never overwrite without approval.
CONTEXT.md                 ← this file (domain + vocab).
AGENTS.md / CLAUDE.md      ← agent workflow + ownership.
UNDERSTANDING.md           ← verified audit record.
RESTRUCTURE_PLAN.md        ← the foundation plan.
docs/adr/                  ← architectural decisions.
process/                   ← plans, status, feature work folders.
```

## Standalone artifacts (not routes)

- `public/os-v1.html` — a standalone HTML export. The **canonical** `/os-v1` is `src/pages/os-v1.astro`. Do not edit both; the `.astro` route wins.
- `public/aie.html` — a routeless standalone artifact (AI Engineer World's Fair synthesis), reachable only by direct URL.

## Routing note

`/gbrain` and `/os-v1` routes exist but are **intentionally not in the main nav** (`Nav.astro` links only Dashboard/Writing/Projects/About/Contact). They're direct-link / sidebar only.

## Known Decisions (see `docs/adr/`)

- **ADR-0001** — Projects live in a TS array, not a content collection.
- **ADR-0002** — One canonical `global.css`, imported by the layout; no second hand-served copy.
- **ADR-0003** — `seriesMap` consolidated into `src/data/series.ts` (was triplicated).

## Current Status

See `process/status.md`.

## Red Lines

- **Never push directly to `main`.** Branch → `npm run build` (Node ≥22) → PR → merge → deploy.
- **Never overwrite `DESIGN.md`** without explicit approval. It is canonical. Design changes are `@ive`'s call.
- **Build before every push** (needs Node ≥22). Never break sonwork.org.
- **Body text contrast ≥4.5:1** on `#0A0A0A` → use `#E8E8E8` or `#A0A0A0`, never `#666666` for body.
- **One strong accent only** — amber `#E8A045`. No purple AI gradients, no SaaS blue, no pastel cards.
- **Only two fonts** — Inter + JetBrains Mono. New colors in OKLCH, derived from the palette.
- **Edit `src/styles/global.css` only.** There is no `public/styles/global.css` anymore (ADR-0002).

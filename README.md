# sonwork.org

Sơn Lê's personal blog — a static **Astro** site with a dark, personal "operating-system" aesthetic. Maintained as a clean, reusable skeleton: **blog** (essays organized into series) + **projects** + **personal** pages. Design *is* the product.

> **Agents & contributors:** start with `CONTEXT.md` (what this is + vocabulary), then `AGENTS.md` (workflow + ownership), then `DESIGN.md` (visual canon). Decisions are in `docs/adr/`; the verified audit in `UNDERSTANDING.md`.

## Stack

Astro 6 (static) · TypeScript (strict) · content collections for posts · `@astrojs/sitemap` · Inter + JetBrains Mono · **Node ≥22.12 (required)**.

## Commands

```bash
npm install
npm run dev       # local dev server with HMR
npm run build     # production build to ./dist/  (Node ≥22; run before every push)
npm run preview   # preview the production build locally
```

## Structure

```
src/
  layouts/Base.astro       the only layout (imports global.css)
  components/Nav.astro     the only component
  content.config.ts        posts collection schema (series enum)
  content/posts/*.md       the writing (slug = filename)
  data/projects.ts         projects (TS array — ADR-0001)
  data/series.ts           series metadata (single source — ADR-0003)
  pages/                   file-based routes
  styles/global.css        the canonical stylesheet (imported — ADR-0002)
public/                    static assets + standalone HTML artifacts (not routes)
```

See `CONTEXT.md` for the full map and `process/status.md` for what's next.

## Writing a post

Add a markdown file to `src/content/posts/`. Frontmatter:

```yaml
---
title: "Title"
description: "Optional one-liner"
pubDate: 2026-05-30
series: "life-book"        # life-book | experiences | human
tags: ["life", "2026"]
readTime: "4 min"
emoji: "📖"
draft: false
---
```

## Adding a project

Append to the array in `src/data/projects.ts` (typed by the `Project` interface).

## Contributing

Never push to `main`. Branch → `npm run build` (Node ≥22) → PR → merge → deploy. See `AGENTS.md`.

# Status — Sonwork (sonwork.org)

_Last updated: 2026-05-30_

## Goal of current pass

Turn the repo into a clean, agent-friendly **skeleton**: blog + projects + personal pages,
one sample per type, fully styled and working — with the foundation documented and the
production CSS bug fixed. Keep Sơn's identity; keep the Command Center design system.

## Done

- Live Astro static site at sonwork.org with the Command Center design system (`DESIGN.md`).
- Core routes: dashboard, writing, projects, posts/[slug], about, contact, os-v1, gbrain.
- Posts content collection; projects TS data model.
- Client-side tab + tag filtering on the dashboard.
- **Verified audit** (`UNDERSTANDING.md`) + **foundation plan** (`RESTRUCTURE_PLAN.md`).
- **Phase 0–1:** foundation docs (CONTEXT, ADR 0001–0003, docs/agents, process scaffold, README).

## Shipped ✅ (2026-05-30)

- PR #1 **MERGED** to `main` (merge commit `f944e80`). Branch deleted.
- Cloudflare Pages auto-deployed. **Live verified:** sonwork.org/projects serves the bundled `/_astro/Nav.*.css` containing `.fp-card` + `.project-card` — the previously-unstyled pages are now styled in production. CSS bug fixed end-to-end.
- All phases done: CSS fix, skeleton, series.ts, shadows, DX (`astro check` 0 errors), @ive design pass, memory seeded, build green on Node 22.
- Minor leftover (harmless): old `/styles/global.css` URL still 200s from a prior Cloudflare deploy cache; nothing references it.

## Environment (resolved)

- **Node 22 installed** (v22.22.3 via `n`, 2026-05-30). `npm run check` passes clean (0 errors) and `npm run build` is green (10 pages, global CSS bundled with the restored selectors). The CSS production-bug fix is verified end-to-end.
- CI/deploy should pin Node ≥22 (`package.json` engines already enforce it).

## Next actions (backlog after skeleton)

- Per-project accent via data-driven CSS custom property (remove slug-coupled CSS).
- Decide on Inter font replacement for distinctiveness (future redesign, `@ive` + Sơn).
- Add CI workflow running `astro check` + build on Node 22.

## Out of scope (this pass)

- Palette/typography/layout redesign (separate `@ive` taste work).
- projects→content-collection migration (ADR-0001 stands).
- New features/pages.

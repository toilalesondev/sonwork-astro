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

## In progress (this pass — phase-by-phase)

- Phase 2: fix CSS bug (import `src/styles/global.css`, delete `public/` copy).
- Phase 2.5: strip content to skeleton (1 sample post, 1 sample project).
- Phase 3: extract `seriesMap` → `src/data/series.ts`.
- Phase 4: resolve page/asset shadows.
- Phase 5: consistency + DX (tokens, nav doc, `astro check`, dead indirection).
- Phase 5.5: `@ive` design pass + DESIGN.md documentation verification.
- Phase 6: seed memory (brv + gbrain).
- Phase 7: build on Node ≥22, design-review, PR, ship (deferred to Node-22 env).

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

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

**Restructure — PR #1 MERGED** (`f944e80`):
- CSS production bug fixed end-to-end (live `/projects` styled), skeleton, series.ts, shadows, DX (`astro check` 0 errors), @ive design pass, memory seeded, build green on Node 22.

**Minimal design pass — PR #2 MERGED** (`663544f`, @ive):
- Contact email → `tuanson.le03@gmail.com` (live, Cloudflare email-obfuscated).
- Nav → three items: Writing · Projects · About (brand logo = home).
- Contact folded into About; standalone `/contact` page deleted from source.
- Homepage minimalized: single calm column, sidebar + duplicate filters/stats removed (−329 lines). **Live verified:** no sidebar, new nav, new email.

## Known harmless leftovers (Cloudflare edge)

- Old `/styles/global.css` and `/contact` URLs still return 200 from prior Cloudflare Pages deployments. Neither is referenced or linked anywhere (nav no longer has Contact; site uses the hashed bundled CSS). They're orphan assets, not functional issues. Clear via a Cloudflare cache purge / full redeploy if desired.

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

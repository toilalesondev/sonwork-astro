# ADR-0003: Series metadata lives in one place (`src/data/series.ts`)

- **Status:** Accepted
- **Date:** 2026-05-30

## Context

The `seriesMap` object — name, marker (`§ ↳ ◎`), badge class, colors, descriptions, taglines for the three series — was **redefined inline in three files** with drifting shapes:

- `index.astro` — `name, marker, color, badgeClass, desc`
- `series.astro` — `name, marker, badgeClass, tagline, desc`
- `posts/[slug].astro` — `name, marker, badgeClass`

Editing series copy meant finding and syncing three copies, and they had already diverged.

## Decision

Consolidate series metadata into a single **`src/data/series.ts`** module (mirroring `src/data/projects.ts`), exporting a typed `seriesMeta` map with the union of all fields used. All pages import from it. The canonical series **enum stays in `src/content.config.ts`**; `series.ts` provides the presentation metadata keyed by that enum.

## Rationale

- One source removes the drift bug class and matches the existing `projects.ts` pattern.
- Series is core domain vocabulary (see `CONTEXT.md`) — it deserves a named home, not three inline literals.

## Consequences

- Pages import `seriesMeta` instead of redefining it; each picks the fields it needs.
- Adding/changing a series = edit `series.ts` (+ the enum in `content.config.ts`). One mental model.
- The `Series` type is derived from / kept in sync with the content-collection enum.

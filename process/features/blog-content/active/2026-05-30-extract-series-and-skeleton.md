# Plan: Extract seriesMap + strip to skeleton content

_Status: active · Priority: 🟠 · Owner: @matt · ADR-0003_

## Part A — Extract seriesMap (ADR-0003)
seriesMap is triplicated in index/series/[slug] with drifting shapes.
1. Create `src/data/series.ts` → typed `seriesMeta: Record<Series, SeriesMeta>` (union: name, marker, badgeClass, color, desc, tagline).
2. `Series` type derived from the content.config.ts enum.
3. Replace inline maps in index.astro, series.astro, posts/[slug].astro with imports.
4. Parity: pages render identically.

## Part B — Skeleton content
Keep structure working with minimal samples.
1. Posts: keep ONE clean sample post per pattern (or one total) — remove the rest; keep a clear template.
2. Projects: reduce `projects.ts` to ONE sample project (keep the interface + a building/active example).
3. Keep Sơn's identity in about/contact (name, socials, bio) — minimal but real.
4. Ensure empty/near-empty states render (series with 0 posts already handled in series.astro).

## Done when
Series metadata in one file; one sample post + one sample project; pages render clean.

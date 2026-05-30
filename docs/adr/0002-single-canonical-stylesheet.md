# ADR-0002: One canonical stylesheet, imported by the layout

- **Status:** Accepted
- **Date:** 2026-05-30

## Context

The repo shipped with **two `global.css` files** that drifted out of sync:

- `src/styles/global.css` (1081 lines) — the conventional Astro location, but **imported by nothing** (dead).
- `public/styles/global.css` (1007 lines) — served verbatim and the one actually linked in `Base.astro` (live).

The first 990 lines were identical; the **live file was missing the final 85 lines** (47 selectors): all featured-project, projects-page, about-page, sidebar-status, and the `@media(max-width:1100px)` responsive rules. Result: `/projects`, the homepage featured cards, the `/about` sections, and part of the mobile layout **shipped unstyled in production**.

The trap: the conventional location (`src/`) was the *dead* one. An agent edits it, builds, sees no change, because the *live* file is in `public/`.

## Decision

There is **one canonical stylesheet**: `src/styles/global.css`. It is **`import`ed by `src/layouts/Base.astro`** so Astro bundles + hashes it. The hand-served `public/styles/global.css` is **deleted**; the manual `<link>` is removed.

## Rationale

- A single imported source eliminates the desync bug class entirely.
- The conventional location (`src/`) is where agents look first; making it the only one matches expectation.
- Astro's bundling gives content-hashing + dead-code-free output for free.

## Consequences

- **Edit `src/styles/global.css` only.** There is no `public/styles/global.css`.
- The 47 previously-missing selectors are restored in production (parity recorded in `.restructure-refs/will-be-restored.txt`).
- Same shadow-duplicate risk exists at the page level: `/os-v1` is both `src/pages/os-v1.astro` (canonical) and `public/os-v1.html` (standalone artifact). Don't edit both. `public/aie.html` is a routeless artifact.

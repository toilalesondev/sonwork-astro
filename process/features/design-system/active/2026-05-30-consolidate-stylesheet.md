# Plan: Consolidate to one imported stylesheet (fix unstyled prod)

_Status: active · Priority: 🔴 · Owner: @ive / @matt · ADR-0002_

## Problem
Two `global.css` files desynced. Live `public/styles/global.css` (linked in Base.astro) is missing 47 selectors (featured projects, /projects, /about, sidebar status, 1100px responsive) that exist only in the dead `src/styles/global.css`. → those areas ship unstyled.

## Steps
1. `import '../styles/global.css'` in `src/layouts/Base.astro`; remove the `<link rel="stylesheet" href="/styles/global.css">`.
2. Delete `public/styles/global.css`.
3. Parity check vs `.restructure-refs/will-be-restored.txt` (47 selectors restored).
4. Build verify in Node-22 env + `@gstack design-review`.

## Done when
One imported stylesheet; /projects + featured cards + /about + mobile styled.

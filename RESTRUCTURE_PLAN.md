# RESTRUCTURE PLAN — sonwork-astro

> ONE combined plan to put the foundation right, derived from the verified `UNDERSTANDING.md`.
> Ordered so each phase is independently shippable and reviewable. Nothing here is executed yet —
> this is the agreed blueprint. Date: 2026-05-30 · Branch: `chore/agent-onboarding`.

---

## Guiding principles

1. **Correctness before cosmetics.** The live site has broken styling; fix that first.
2. **One source of truth for everything** — one stylesheet, one series definition, one canonical page per route.
3. **No behavior/visual change except the bug fixes.** Dedupe and restructure must render byte-identically to intended design.
4. **Leave guardrails** so the bug class can't recur silently (type-check + a check that the live CSS matches source).
5. **Respect the brand register.** `DESIGN.md` is canonical; no palette/type/layout taste changes in this pass (those are `@ive` calls, separate work).

## ✅ CONFIRMED by Sơn (2026-05-30) — supersedes defaults where they conflict

- **Goal = clean reusable skeleton**, not a content-filled site. Strip to **ONE sample per type**: 1 sample post, 1 sample project, minimal about/contact. Structure must stay fully working.
- **Keep Sơn's identity** — name (Sơn Lê), socials (`toilaleson`, `son@perfeat.org`), bio prose stay. It remains his personal site, just emptied of articles.
- **Keep the design system** — and additionally **@ive runs a design pass + verifies `DESIGN.md` is properly documented** (tokens ↔ CSS parity, gaps filled).
- Execution mode: **phase-by-phase with review pauses**. Build/ship deferred to a Node ≥22 env.
- New phase added: **Phase 2.5 — Content strip to skeleton**. **Phase 5.5 — @ive design pass + DESIGN.md documentation.**

## Defaults chosen for the 5 open questions (override any of these)

| # | Question | Default taken |
|---|----------|---------------|
| 1 | CSS consolidation approach | **Astro `import`** — bundle + hash via the layout; delete the hand-served `public/` copy. Modern, eliminates desync permanently. |
| 2 | `public/os-v1.html`, `public/aie.html` | **Keep, but document** as intentional standalone artifacts in CONTEXT.md. Do not delete (they may be linked externally). Reconcile `/os-v1` shadow by marking the `.astro` route canonical. |
| 3 | `/gbrain` + `/os-v1` in nav | **Leave out of main nav** (current behavior); document that they're direct-link/sidebar only. No change. |
| 4 | Restructure scope | **Correctness + dedupe + DX + docs.** No deep re-architecture (projects stay a TS array; no component-extraction spree). Keep the diff reviewable. |
| 5 | Node 22 | **Flag as a hard CI/deploy requirement.** Add `engines` enforcement note + document. Can't build locally here (Node 20). |

---

## Phase 0 — Branch & safety net

- Confirm working branch `chore/agent-onboarding` (or cut a fresh `chore/restructure-foundation` if you prefer a clean name).
- Capture a "before" reference of the live CSS selectors so we can prove parity after consolidation.
- **No build possible locally** (Node 20). Each code phase ends with a parity check that does NOT need a build; final verification happens in CI / a Node-22 environment.

**Done when:** branch is set, before-state recorded.

---

## Phase 1 — Foundation documentation (knowledge first)

Create the agent-friendly scaffolding, written from the *verified* understanding (not auto-generated).

- `CONTEXT.md` — domain + vocabulary (series, post, project, status, marker), stack, repo map, red lines. Document the standalone `public/*.html` artifacts and the nav-omission decision.
- `docs/adr/0001-projects-as-ts-array.md` — why projects aren't a collection.
- `docs/adr/0002-single-canonical-stylesheet.md` — the import decision + "never hand-edit generated CSS."
- `docs/adr/0003-series-metadata-single-source.md` — the `src/data/series.ts` consolidation.
- `docs/agents/{issue-tracker,triage-labels,domain}.md` — Matt-Pocock standard trio.
- `process/` — `context/all-context.md` (routing table), `status.md`, feature folders `design-system/` + `blog-content/`.
- Replace the default Astro `README.md` with a real project README.
- Keep `UNDERSTANDING.md` (or move to `docs/`) as the audit record.

**Done when:** docs exist, all claims match Phase 2–4 reality. No code touched yet.

---

## Phase 2 — 🔴 Fix the CSS production bug (ISSUE-1)

Restore styling to `/projects`, homepage featured cards, `/about` sections, sidebar status, and mobile layout.

Steps:
1. Confirm `src/styles/global.css` (1081 lines) is the **superset** — it already contains everything the live file has plus the missing 996–1081 tail. (Verified: first 990 lines identical.)
2. Make `src/styles/global.css` the **single source**: add `import '../styles/global.css'` in `src/layouts/Base.astro`; remove the manual `<link rel="stylesheet" href="/styles/global.css">`.
3. Delete the now-redundant `public/styles/global.css` (Astro will bundle + hash the imported one).
4. **Parity check (no build needed):** verify the imported file contains all selectors the old live file had, plus the project/about/responsive rules that were missing. List the newly-restored selectors as the diff's "what this fixes."
5. Visual confirmation deferred to CI/Node-22 preview + `@gstack design-review` on the deployed branch.

**Done when:** exactly one stylesheet exists, it's imported (not hand-linked), and it contains the full rule set. `/projects`, featured cards, `/about`, and mobile are styled.

**Risk/rollback:** single-commit, easily reverted. If the import path causes issues, fall back to copying the `src/` tail into `public/` as an interim and document it.

---

## Phase 3 — 🟠 De-duplicate series metadata (ISSUE-2)

1. Create `src/data/series.ts` exporting a typed `seriesMeta: Record<Series, SeriesMeta>` with the **union** of all fields currently used: `name, marker, badgeClass, color, desc, tagline`.
2. Derive/define the `Series` type from the `content.config.ts` enum (single source for the keys).
3. Replace inline `seriesMap` in `index.astro`, `series.astro`, `posts/[slug].astro` with `import { seriesMeta }` (each page reads the fields it needs).
4. Parity check: rendered markers/badges/descriptions must be unchanged.

**Done when:** series metadata lives in one file; no inline `seriesMap` remains; pages render identically.

---

## Phase 4 — 🟠 Resolve page/asset shadows (ISSUE-3)

1. Declare `src/pages/os-v1.astro` the **canonical** `/os-v1`. Keep `public/os-v1.html` only if it's an intentionally separate artifact — document it in CONTEXT.md with a header comment noting it's NOT the route.
2. Document `public/aie.html` as a routeless standalone artifact (or queue removal if confirmed dead — needs your call).
3. No deletions without your confirmation (could be externally linked).

**Done when:** canonical source per route is documented; no ambiguity about which file to edit.

---

## Phase 5 — 🟡 Consistency & DX guardrails (ISSUE-4, 5, 7, 8)

- **ISSUE-4:** Refactor `gbrain.astro`'s 64 hardcoded hex values to `var(--*)` tokens where they map to the palette (skip genuinely one-off graph colors, but document those). Brand-surface work — coordinate with `@ive` if any color is ambiguous.
- **ISSUE-5:** Document the nav omission of `/gbrain` + `/os-v1` (decision: intentional, direct-link only). No code change unless you want them linked.
- **ISSUE-7:** Add scripts to `package.json`: `"check": "astro check"`, and a tiny `"verify:css"` guard (or a note) ensuring no stray second stylesheet reappears. Document Node ≥22 requirement prominently.
- **ISSUE-8:** Remove the `statusLabels` identity-map indirection (use `p.status` directly) OR give it real labels; remove/keep unused `exploring` status with a comment. Low priority.

**Done when:** tokens consistent, decisions documented, quality scripts present.

---

## Phase 6 — Seed memory (brv + gbrain)

- `brv curate` the verified findings (especially the CSS-trap gotcha) so the next agent inherits it.
- `gbrain put_page projects/sonwork-astro/architecture` with the verified map + decisions.
- Confirm curates landed.

**Done when:** memory layer reflects the true state; the CSS trap is recorded.

---

## Phase 7 — Ship

- `npm run check` + `npm run build` in a **Node ≥22** environment (CI or upgraded local).
- Preview, then `@gstack design-review` on the branch deploy to visually confirm the restored styling.
- PR per `AGENTS.md` (never push `main`): branch → build green → PR → review → merge → deploy.
- `@gstack canary` post-deploy.

**Done when:** PR merged, sonwork.org renders correctly, canary clean.

---

## Execution order summary

```
0 Branch/safety  →  1 Docs  →  2 CSS fix (🔴)  →  3 Series dedupe  →
4 Shadows  →  5 Consistency/DX  →  6 Memory  →  7 Ship
```

Each phase = one focused commit (or a couple), independently reviewable. Phases 2–5 are the actual
code changes; 1 and 6 are knowledge; 0 and 7 are process.

---

## What this plan deliberately does NOT do (out of scope this pass)

- No palette / typography / layout redesign (brand taste = separate `@ive` work).
- No projects→content-collection migration (ADR-0001 keeps the TS array).
- No font replacement (Inter "reflex-reject" flagged for a future redesign, not now).
- No new features or pages.
- No mass component extraction.

---

## Your decisions needed before execution

1. Accept the 5 defaults above, or override any?
2. Branch name: keep `chore/agent-onboarding` or start `chore/restructure-foundation`?
3. `public/aie.html` + `public/os-v1.html`: keep & document (default), or remove?
4. Do you have / can you get a **Node ≥22** environment for the final build, or should I prepare everything and leave the build+ship to run there?
5. Should I execute phase-by-phase (pause for your review after each), or run Phases 1–6 straight through and stop before Ship (Phase 7)?

# UNDERSTANDING — sonwork-astro

> Verified audit of the repo as it exists today. Every claim below was checked firsthand
> against source files + grep evidence (not inferred). This is the foundation document we
> review **before** any restructuring. Once approved, it informs ONE combined restructure plan.
>
> Status: DRAFT for review · Date: 2026-05-30 · Branch: `chore/agent-onboarding`

---

## 1. What this is

Sơn Lê's personal blog at **sonwork.org**. Static **Astro 6.3.3** site. Dark "Command Center"
operating-system aesthetic (amber `#E8A045` on near-black `#0A0A0A`). Publishes essays, project
logs, and life-book entries. Design is a deliberate brand surface, governed by `DESIGN.md` (canonical).

**Author identity (from source):** VC → Operator → Builder. Co-founder of Perfeat.org. Based in Saigon.
- X: `x.com/toilaleson` · Email: `son@perfeat.org` · GitHub: `github.com/toilaleson`
- (Note: gbrain has stored X posts under `@sonldv` — that's external data, NOT used in the site. The site is consistently `toilaleson`.)

---

## 2. Stack (verified from package.json / config)

| Layer | Choice | Evidence |
|-------|--------|----------|
| Framework | Astro 6.3.3, static | `package.json`, `astro.config.mjs` |
| Language | TypeScript, `astro/tsconfigs/strict` | `tsconfig.json` |
| Content | Astro content collections (glob loader + Zod) — **posts only** | `src/content.config.ts` |
| Projects data | Plain TS array (NOT a collection) | `src/data/projects.ts` |
| Integrations | `@astrojs/sitemap` only | `astro.config.mjs` |
| Fonts | Inter + JetBrains Mono (Google Fonts) | `Base.astro:17` |
| Node | **>=22.12** required | `package.json` engines |

⚠️ **Build environment blocker (verified):** this machine runs **Node v20.20.2**. `npm run build`
fails with *"Node.js v20.20.2 is not supported by Astro"*. We cannot build/verify here until Node ≥22.

---

## 3. Repository map (verified by directory walk)

```
src/
  layouts/Base.astro        # the ONLY layout — html shell, fonts, <link> to /styles/global.css, <slot/>
  components/Nav.astro      # the ONLY component — sticky nav, 5 hardcoded links
  content.config.ts         # posts collection schema; series enum lives here
  content/posts/            # 3 markdown posts (the writing); slug = filename
  data/projects.ts          # 4 projects + Project interface + statusLabels map
  pages/                    # file-based routes (9 routes)
    index.astro             # dashboard hub (hero + featured projects + post feed + sidebar + JS filters)
    series.astro            # writing grouped by series
    projects.astro          # full project list
    posts/[slug].astro      # individual post renderer
    about.astro             # static prose + socials
    contact.astro           # static links
    os-v1.astro             # hardcoded markup + scoped <style>
    gbrain.astro            # hardcoded markup + 1 large scoped <style> (64 hardcoded hex)
  styles/global.css         # 1081 lines — DEAD (imported by nothing)
public/
  styles/global.css         # 1007 lines — LIVE (linked in Base.astro)
  os-v1.html                # 217 lines — shadow of /os-v1 route
  aie.html                  # 99 KB — routeless standalone artifact
  son.jpg, favicon.svg, favicon.ico
DESIGN.md                   # visual canon (tracked in git)
AGENTS.md, CLAUDE.md        # agent workflow + ownership (untracked, created 2026-05-29)
README.md                   # default Astro "Minimal" boilerplate (tracked)
```

---

## 4. Data model (verified)

### Posts — `src/content.config.ts`
```
title: string          description?: string
pubDate: date          series: enum['life-book','experiences','human']   ← REQUIRED, closed set of 3
tags: string[] = []    readTime: string = '3 min'
draft: bool = false    emoji: string = '📝'
```
- Loader: `glob('**/*.md', base:'./src/content/posts')`. Slug = filename.
- Render: `[slug].astro` → `getStaticPaths()` filters drafts → `render(post)` → `<Content/>`.
- **3 posts exist:** `2026-year-one.md` (life-book), `on-building-things.md`, `why-people-do-things.md`.

### The three series (core taxonomy)
| key | marker | one-liner |
|-----|--------|-----------|
| `life-book` | `§` | Annual entries → physical book at 50. "Not memoir — evidence." |
| `experiences` | `↳` | Real situations. "Not advice. Not lessons." |
| `human` | `◎` | How people think/decide/break. "More useful than most frameworks." |

### Projects — `src/data/projects.ts`
- `interface Project { slug, name, tagline, description, status, url?, emoji, highlights[] }`
- `status: 'active' | 'building' | 'parked' | 'exploring'`
- 4 projects: **Perfeat** (active), **WeCare** (active), **OS V1** (building), **F1** (parked). `exploring` is defined but unused.
- `statusLabels` is an identity map (`active→'active'`) — currently pointless indirection.

---

## 5. CONFIRMED ISSUES (each verified firsthand)

### 🔴 ISSUE-1 — Two `global.css` files, desynced. Live one is missing 85 lines. **Production bug.**
**Evidence:**
- `src/styles/global.css` = **1081 lines**, **23** project-card rules.
- `public/styles/global.css` = **1007 lines** (the LIVE one — `Base.astro:18` links `/styles/global.css`), **0** project-card rules.
- First **990 lines identical**; they diverge only after.
- `grep` confirms **nothing imports** `src/styles/global.css` → it is dead.
- The missing tail (`src/` lines 996–1081) contains, and the LIVE file LACKS:
  - `.fp-section` / `.fp-card` / `.fp-cards` / per-project accents → **homepage featured cards unstyled**
  - `.projects-list` / `.project-card` / `.project-status` / `.projects-legend` → **`/projects` page unstyled**
  - `.about-section` / `.about-h2` / `.about-cta` / `.about-socials` → **`/about` sections unstyled**
  - `.sidebar-status-active|building` → sidebar status colors missing
  - the `@media(max-width:900px/1100px)` blocks with `.fp-cards`, `.dashboard-wrap`, `.hero` collapse → **mobile layout partially broken** (live file keeps only the 600px block)

**Why it's a trap for agents:** the conventional location (`src/styles/global.css`) is the *dead* one; an agent edits it, builds, sees no change, because the *live* file is in `public/`.

### 🟠 ISSUE-2 — `seriesMap` triplicated with drifting shapes.
**Evidence — same object redefined inline in 3 files:**
- `index.astro:12` → fields: `name, marker, color, badgeClass, desc`
- `series.astro:9` → fields: `name, marker, badgeClass, tagline, desc` (adds `tagline`, drops `color`)
- `posts/[slug].astro:14` → fields: `name, marker, badgeClass` (minimal)

Editing series copy = find + sync 3 places. They have already drifted.

### 🟠 ISSUE-3 — Page/asset shadows (route vs static HTML).
- `/os-v1` exists as **both** `src/pages/os-v1.astro` (210 lines, token-based) **and** `public/os-v1.html` (217 lines, standalone). Unclear which is canonical; risk of editing the wrong one.
- `public/aie.html` (99 KB) is a routeless artifact — reachable only by direct URL.

### 🟡 ISSUE-4 — `gbrain.astro` hardcodes 64 hex values instead of DESIGN.md tokens.
DESIGN.md mandates token use; `os-v1.astro`'s scoped style uses `var(--*)` correctly, but `gbrain.astro` does not. Inconsistent.

### 🟡 ISSUE-5 — Nav vs routes mismatch.
`Nav.astro` types `active` includes `'gbrain'`, and `/gbrain` + `/os-v1` routes exist, but **neither is in the visible `links[]` array** (only Dashboard, Writing, Projects, About, Contact). Reachable only by direct URL / sidebar. Intentional? Undocumented.

### 🟡 ISSUE-6 — No project docs / dead boilerplate.
- `README.md` is the verbatim Astro "Minimal" starter — zero project guidance.
- No `CONTEXT.md`, no `docs/`, no recorded decisions. (AGENTS.md references `docs/adr/` that doesn't exist.)
- brv + gbrain returned nothing on this repo's architecture (memory layer empty for it).

### 🟡 ISSUE-7 — No quality gates.
`package.json` scripts = `dev/build/preview/astro` only. No `astro check`, no lint, no CI. The CSS bug shipped silently precisely because nothing catches it.

### ⚪ ISSUE-8 — Minor dead indirection.
`statusLabels` identity map + unused `exploring` status. Low priority.

---

## 6. What's GOOD (keep / build on)
- `DESIGN.md` is excellent and canonical; tokens in the CSS `:root` map 1:1 to it.
- File-based routing is conventional and clean.
- Posts schema is well-typed.
- AGENTS.md / CLAUDE.md ownership tables are clear.
- Only 2 pages ship JS (index filters, gbrain canvas) — site is lean.

---

## 7. Open questions for Sơn (need answers before the restructure plan)

1. **CSS consolidation approach** — do you want the canonical stylesheet to be an Astro `import` (bundled + hashed, the modern way) or keep a hand-served `public/` file? (Import is cleaner; changes the `<link>`.)
2. **os-v1 / aie HTML** — are `public/os-v1.html` and `public/aie.html` intentional standalone artifacts to keep, or leftovers to remove in favor of the `.astro` route?
3. **gbrain / os-v1 in nav** — should these be linked in the main nav, or stay hidden/direct-link-only?
4. **Scope of "restructure"** — fix correctness + dedupe + DX guards only, or also re-architect (e.g. projects→collection, theme tokens to a shared TS module, component extraction)?
5. **Node 22** — can the deploy/CI environment use Node ≥22? (Required to build at all.)

---

## 8. Proposed phases (preview — full plan comes after you approve this doc)

1. **Foundation docs** — CONTEXT.md, docs/adr/, real README, process/ scaffold (knowledge first).
2. **Correctness** — fix ISSUE-1 (CSS), restoring `/projects`, featured cards, about, mobile.
3. **De-duplication** — ISSUE-2 (series → `src/data/series.ts`), ISSUE-3 (resolve shadows).
4. **Consistency & DX** — ISSUE-4 (tokens), ISSUE-5 (nav), ISSUE-7 (add `astro check` + guard), ISSUE-8.
5. **Seed memory** — curate verified findings to brv + gbrain so the next agent inherits this.

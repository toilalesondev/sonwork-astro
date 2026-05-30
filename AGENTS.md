# AGENTS.md — Sonwork (sonwork.org)

Personal blog at **sonwork.org**. Astro static site. Dark personal operating-system aesthetic. Published artifacts: essays, project logs, technical writing, photography, design exploration.

## Subagents

Six subagents available. Invoke by name when you need specialized behavior.

### Memory protocol — Andy and Tan are always involved

Andy (brv) and Tan (gbrain) are the memory layer. Every other agent runs under this protocol:

1. **At the start of any code task** → `brv query` + `gbrain query` in parallel
2. **At the end of meaningful work** → `brv curate` (mandatory) + `gbrain put_page` (conditional, cross-machine)
3. **Skip both for** chat-only turns, typo fixes, content writing in `src/content/` (those are knowledge artifacts already)
4. **Verify curates** with `brv curate view <logId> --format json` — check `operations[]`
5. **Reject bad curates** with `brv review reject <taskId>`

### Agent lineup

| Agent | Invoke | Purpose for this repo |
|-------|--------|------------------------|
| **Andy** | `@andy` | brv memory — `.brv/context-tree/` |
| **Tan** | `@tan` | gbrain — search content, code graph, multi-hop synthesis |
| **Matt** | `@matt` | Engineering — TDD, architecture (rare here — minimal logic) |
| **Gstack** | `@gstack` | Ship PRs, browser QA, **live design review on sonwork.org**, plan reviews |
| **Evera** | `@evera` | Codebase understanding |
| **Ive** | `@ive` | **PRIMARY** — full Impeccable: craft/shape/audit/polish/animate/live HMR (Astro dev server supports HMR perfectly) |

### Ownership for the blog repo

This is a **brand surface** (design IS the product) — Ive owns most work.

| Layer | Owner |
|-------|-------|
| Design system, palette, typography (canonical: `DESIGN.md`) | `@ive` — read `DESIGN.md` first, never overwrite without approval |
| New layouts, sections, pages | `@ive craft` (Astro HMR live mode supported) |
| Visual direction for new posts/series | `@ive shape` |
| Audit a11y/perf/responsive | `@ive audit` |
| Polish + animate + colorize | `@ive polish`, `@ive animate`, `@ive colorize` |
| Plan-stage design review | `@gstack plan-design-review` |
| Live site visual QA on sonwork.org | `@gstack design-review` |
| Astro component refactors | `@matt improve-codebase-architecture` |
| Ship + deploy | `@gstack ship` → `@gstack land-and-deploy` |
| Performance benchmark | `@gstack benchmark` |
| Post-deploy canary | `@gstack canary` |
| Content writing (essays, posts) | Default Build agent — content is content, not code |

### Hard rules

- **Brand register** — read `.claude/skills/impeccable/reference/brand.md` before any design work. This is NOT a product UI.
- **`DESIGN.md` is canonical.** Never overwrite. Aesthetic: dark personal operating-system, amber accent (#E8A045) on near-black (#0A0A0A).
- **No reflex-reject fonts** (Fraunces, Newsreader, Cormorant, DM Sans, Plus Jakarta Sans, Instrument Sans, etc.). Current font: **Inter** — already a reflex-reject. Consider replacing for distinctiveness if doing a redesign.
- **Body text contrast ≥4.5:1.** Text on `#0A0A0A` bg → use `#E8E8E8` (text) or `#A0A0A0` (text-2). Don't drop to `#666666` (text-3) for body.
- **OKLCH for new colors**, derived from the existing palette.
- **Never break sonwork.org** — preview build before push.

## Before Any Task

1. `git pull --rebase origin main` — always sync first
2. Read `DESIGN.md` if doing design work
3. Read `src/content/` config + recent posts if doing content work
4. `brv query` for any prior decisions on this codebase

## Git Workflow

**Never push directly to `main`.** Branch → PR → merge → auto-deploy.

```bash
git checkout -b feature/<short-name>
# work
npm run build   # verify before push
git push -u origin feature/<short-name>
gh pr create
```

## Commands

```bash
npm install
npm run dev          # local dev server with HMR (Ive live mode works here)
npm run build        # production build
npm run preview      # preview production build locally
```

## Deploy

Production: sonwork.org (likely Cloudflare Pages or Vercel — check `astro.config.mjs`).

## Linked Projects

| Repo | Role |
|------|------|
| `~/workspace/perfeat-mobile/` | Perfeat React Native app |
| `~/workspace/perfeat-landing/` | perfeat.org marketing |
| `~/workspace/sonwork-astro/` | THIS repo — personal blog |

Cross-search all three brains with `brv swarm query`.

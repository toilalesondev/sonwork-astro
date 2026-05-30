# All Context — Routing Table

> Where to look, and where to put work. Read this when you start a task in this repo.

## Read-first routing (by task type)

| Task type | Read these, in order |
|-----------|----------------------|
| **Any task** | `CONTEXT.md` → `AGENTS.md` → this file |
| **Design / visual / layout** | `DESIGN.md` (canon) → `.claude/skills/impeccable/reference/brand.md` → `src/styles/global.css`. Owner: `@ive`. |
| **New post / essay** | `CONTEXT.md` (series vocab) → `src/content.config.ts` (schema) → the sample post for frontmatter shape |
| **New / changed project** | `src/data/projects.ts` → ADR-0001 |
| **Series metadata** | `src/data/series.ts` → ADR-0003 → `src/content.config.ts` (enum) |
| **Styling change** | ADR-0002 (edit `src/styles/global.css`; it's imported, no `public/` copy) |
| **New page / route** | `src/pages/` → `src/layouts/Base.astro` → `src/components/Nav.astro` |
| **Architecture / refactor** | `docs/adr/` → `CONTEXT.md` repo map. Owner: `@matt`. |
| **Ship / deploy** | `AGENTS.md` git workflow (Node ≥22). Owner: `@gstack`. |

## Current active features

| Feature folder | What | Status |
|----------------|------|--------|
| `process/features/design-system/` | CSS consolidation (ADR-0002), token discipline, @ive design pass, DESIGN.md docs | active this pass |
| `process/features/blog-content/` | Series extraction (ADR-0003), skeleton content, content model | active this pass |

## Feature folder vs general-plans

- **Feature folder** (`process/features/<name>/`) — coherent ongoing area (design-system, blog-content).
- **`process/general-plans/`** — one-off cross-cutting work (deploy migration, dependency bump, SEO pass).

## Plan folder layout (inside each feature + general-plans)

```
active/   backlog/   completed/   reports/   references/
```

## Plan naming

`YYYY-MM-DD-short-kebab-title.md`

## After finishing a feature/plan

1. Move plan `active/` → `completed/`.
2. Update `process/status.md`.
3. `brv curate` (mandatory) + `gbrain put_page` if cross-machine knowledge.
4. If a decision was made, write an ADR in `docs/adr/`.

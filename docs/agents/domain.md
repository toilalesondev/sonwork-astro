# Domain

Before any task, read in this order:

1. **`CONTEXT.md`** — what the project is + vocabulary (series, post, project, status, marker).
2. **`DESIGN.md`** — the visual canon. Canonical; not to be overwritten. Design = `@ive`.
3. **`docs/adr/`** — recorded decisions. Don't re-litigate; supersede with a new ADR if needed.
4. **`AGENTS.md`** — workflow, ownership, memory protocol, git rules.

## Core domain rules

- **Series is a closed set of three**: `life-book`, `experiences`, `human`. Adding a fourth means updating the Zod enum in `src/content.config.ts` AND `src/data/series.ts` AND any series-aware CSS — an editorial decision, not routine.
- **Posts** = content-collection markdown; **projects** = a TS array (ADR-0001).
- **Styling**: edit `src/styles/global.css` only — it's imported by the layout; there is no `public/` copy (ADR-0002).
- This is a **brand surface** — design changes are taste calls owned by `@ive`.
- The repo is maintained as a **skeleton**: keep one sample post + one sample project working; refill with real content as needed.

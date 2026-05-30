# CLAUDE.md — Sonwork (sonwork.org)

Personal blog. Astro static site. Dark personal operating-system aesthetic.

See AGENTS.md for full project context.

## Subagents

Six subagents. Invoke with `@name` or describe what you need.

**Memory protocol:** Andy + Tan are always involved. Every other agent (@matt, @gstack, @evera, @ive) runs `brv query` + `gbrain query` at start of code tasks, `brv curate` at end of meaningful work. Skip for chat-only turns, typo fixes, and content writing.

## Ownership

| Layer | Owner |
|---|---|
| Design system (canonical: `DESIGN.md`) | `@ive` — read first, never overwrite |
| New layouts, sections, pages (full HMR live mode) | `@ive craft` |
| Visual direction for new posts/series | `@ive shape` |
| Audit a11y/perf/responsive | `@ive audit` |
| Polish/animate/colorize | `@ive polish`, `@ive animate`, `@ive colorize` |
| Astro component refactors | `@matt improve-codebase-architecture` |
| Plan-stage design review | `@gstack plan-design-review` |
| Live site visual QA on sonwork.org | `@gstack design-review` |
| Shipping (Cloudflare/Vercel) | `@gstack ship` → `@gstack land-and-deploy` |
| Performance | `@gstack benchmark` |
| Post-deploy monitoring | `@gstack canary` |
| Content writing (essays, posts) | Default Build agent |
| Brain/memory | `@andy` (project) + `@tan` (cross-repo) |

**Hard rules**:
- Brand register applies — read `.claude/skills/impeccable/reference/brand.md` first
- DESIGN.md is canonical, never overwrite without approval
- Current Inter font is a reflex-reject — consider distinctive replacement if redesigning
- Body text contrast ≥4.5:1 on `#0A0A0A` bg → use `#E8E8E8` or `#A0A0A0`, never `#666666` for body
- OKLCH for new colors

## MCP Servers

gbrain + byterover MCP configured globally in `~/.claude/settings.json`. Available in any session.

## Linked Projects

- `~/workspace/perfeat-mobile/` — Perfeat RN app
- `~/workspace/perfeat-landing/` — perfeat.org marketing
- `~/workspace/sonwork-astro/` — THIS repo

Cross-search all three brains with `brv swarm query`.

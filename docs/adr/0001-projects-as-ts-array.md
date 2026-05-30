# ADR-0001: Projects live in a TypeScript array, not a content collection

- **Status:** Accepted
- **Date:** 2026-05-30

## Context

The site has two kinds of structured data: **posts** (writing) and **projects** (e.g. Perfeat, OS V1). Posts use Astro content collections (markdown + Zod). Projects could have followed the same pattern.

## Decision

Keep **projects in a plain TypeScript array** (`src/data/projects.ts`) with a `Project` interface, not as a content collection.

## Rationale

- Projects are a small, fixed set that change rarely and have no long-form markdown body — a collection adds ceremony with no payoff.
- They need typed fields (`status` union, `highlights[]`) consumed directly in `.astro` frontmatter; a TS interface gives compile-time safety without a loader round-trip.

## Consequences

- Two data mechanisms coexist. Agents must know: **posts = collection, projects = TS array.** (Documented in `CONTEXT.md`.)
- Adding a project = edit one TS file.
- Per-project accent styling is keyed by slug class (`.fp-perfeat`, etc.), so a new project may also need a CSS rule. A future improvement could drive the accent from data via a CSS custom property to remove this coupling.

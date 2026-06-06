---
name: verify
version: 1.0.0
description: Diff-aware test verification. Maps changed files to their test files and runs only the affected tests, escalating to the full suite on config/high-fan-out changes. Owned by @ship; any builder may self-gate with it. Writes verification.json on high-risk paths. Enforces an honesty rule about which gates actually ran.
---

# verify — diff-aware test verification

Default to running only the tests affected by the diff. Escalate when the change is
broad. Never claim a gate is green unless it actually ran.

## Diff-to-test mapping (priority order, first match wins)

| # | Strategy | Pattern |
|---|----------|---------|
| A | Co-located | `foo.ts` → `foo.test.ts` (same dir) |
| A2 | `__tests__` | `src/foo.ts` → `src/__tests__/foo.test.ts` |
| C | Import graph | `grep -r "from.*<module>" --include="*.test.*" -l` |
| D | Config change | tsconfig / jest.config / package.json → **full suite** |
| E | High fan-out | module with >5 importers → **full suite** |

## Auto-escalate to full suite when

- config / infra / test-helper changed
- >70% of tests are mapped
- explicit `--full`

Pitfalls: barrel `index.ts` = high fan-out; `fixtures/`/`mocks/` = treat as config;
renamed files = check `git diff --name-status` for `R` entries.

## Honesty rule (non-negotiable)

Do **not** imply that broad lint, full-product E2E, live-provider checks, or
container/manual gates are green unless they were actually run. State explicitly when
verification depends on a manual-first or live gate that was not executed.

## Multi-stack commands

`pnpm test` / `jest` · `pytest` · `go test` · `cargo test` · `flutter test`.
Backend integration: ensure migrations/seeds applied, env vars set, test DB is
isolated (PGlite/temp — never the shared instance).

## High-risk output

For auth/RLS/schema changes, write `verification.json` to the plan's `reports/harness/`:
exact commands run, manual checks, **negative-path checks** (the access that should be
DENIED was tested and denied). See `harness/risk-evidence.md`.

## Never

Ignore a failing test to make a build pass. Report flaky/slow tests to
`agent-memory/ship/flaky-tests`.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- Paste actual test output; on high-risk write `verification.json` (commands + negative-path checks). Map only diff-touched tests.

## Validate (final step)

On high-risk paths, after writing `verification.json`, prove it's honest + complete:
```
node .helmsman/skills/verify/scripts/validate-verification.mjs <path/to/verification.json>
```
It checks the honesty fields (commands actually run, all_passed boolean, gates_skipped
declared). Fix and re-run until green before reporting VERIFY done.

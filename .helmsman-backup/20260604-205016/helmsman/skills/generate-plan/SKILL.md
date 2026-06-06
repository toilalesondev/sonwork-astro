---
name: generate-plan
version: 1.0.0
description: Write a blast-radius implementation spec to process/active/. Shared by all builders (@eng, @design, @backend, @mobile). Computes blast radius with ripgrep + gbrain semantic code search (query --lang) on code-ingested repos. Output is the artifact the PLAN→BUILD approval gate reviews.
---

# generate-plan — blast-radius spec

Produce a written plan a human can review before any code is written. The plan is the
contract the builder implements against.

## Output location

`process/active/<feature>_PLAN_<dd-mm-yy>.md`

## Required sections

1. **Goal** — one paragraph: what and why.
2. **Touchpoints** — every file that will be created or modified, listed upfront.
3. **Public contracts** — what API surfaces, interfaces, schemas, or RLS policies
   change.
4. **Blast radius** — what could break; adjacent code/tests/deploy to watch.
5. **Verification evidence** — how to prove it works (the exact checks `verify` will
   run, including negative paths for auth/RLS).
6. **Resume handoff** — enough context for any agent to pick up mid-plan.
7. **Risk** — challenge-skill verdict (GO/CAUTION/STOP) + Critical/High scenarios, if
   high-risk.

## Blast-radius computation

**On code-ingested repos (patched gbrain), the call graph is PRIMARY:**
- **`gbrain code-callers <symbol> --source <project>`** — who calls this (the blast
  radius). Returns resolved callers with `from_symbol_qualified`.
- **`gbrain code-callees <symbol> --source <project>`** — what this calls (downward reach).
- **`gbrain code-def <symbol>`** — jump to definition; **`code-refs`** — all references.

**Complement with** ripgrep (`rg "<symbol>"` — catches comments/strings/dynamic refs the
graph misses) and semantic code search (`gbrain query "<behavior>" --lang <ext>`).

> **Code-index sequence** (patched gbrain — fix/ts-const-arrow-symbols):
> 1. `gbrain sync --source <id> --strategy code --full`  (chunks + symbols + edges)
> 2. `gbrain edges-backfill --source <id>`                (resolves call edges)
>
> Requires the patched binary: two bugs are fixed — const/arrow symbol naming, and
> edges being written with `source_id` (so source-scoped reads match). Verified:
> `code-callers useTheme` → 64 resolved callers on a real RN/TSX repo.
>
> **CAVEAT:** code symbols/edges are written at sync time. A general `embed`/`reindex`
> that re-chunks can disturb them — re-run the code-sync + edges-backfill if a
> `code-callers` query unexpectedly returns 0. Code must be ingested on the patched
> binary (older pages → re-ingest via remove + re-add the isolated source).

## High-risk integration

If the change is high-risk (auth/RLS/schema/billing/public-API), run `challenge` first
and open `risk-gate.json` (`harness/risk-evidence.md`). Pull CAUTION/STOP items into
the Risk section as hard constraints.

## Naming & lifecycle

- Date-stamped: `<feature>_PLAN_<dd-mm-yy>.md` to avoid collisions.
- Lives in `process/active/` while in progress.
- On completion, the owning agent archives it to `process/completed/` during WRITE-BACK.
- Large multi-phase efforts → use `harness/phase-programs.md` instead of one plan.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- Report the plan path + blast-radius evidence (rg / semantic-search hits). List only real touchpoints.

## Validate (final step — prove the artifact, don't claim it)

After writing the plan, run the validator and show its green output before handing off:
```
node .helmsman/skills/generate-plan/scripts/validate-plan.mjs <plan-path>
```
If it reports MISSING sections, add them and re-run. A plan isn't ready for the
PLAN→BUILD gate until the validator passes.

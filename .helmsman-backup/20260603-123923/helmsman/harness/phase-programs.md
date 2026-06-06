# Phase Programs — large migrations & refactors

For efforts too big for one PLAN→BUILD pass (test-infra overhauls, large migrations,
repo-wide hardening, Supabase schema migrations), use a **phase program**: one umbrella
plan + many phase plans, advanced one phase at a time.

## Structure

- **Program layer** — a single umbrella plan in `process/active/` stating the overall
  goal and the phase sequence.
- **Phase layer** — one plan per phase, each with its own read→execute→validate→report
  loop.

The orchestrator advances **one phase at a time** — never one giant EXECUTE.

## The per-phase loop (10 steps)

1. **Re-research** — re-read plan + prior reports; inspect drift (code changed since
   the plan was written). Mandatory: stale plans cause silent breakage.
2. **Execution approval** — human gate.
3. **Execute** — only the selected phase's scope.
4. **Validate** — run the phase's exact gates; inspect artifacts/logs/DB/traces.
5. **Regression checkpoint** — re-check previously-verified overlapping surfaces. Pick
   the **narrowest representative check** per surface — do NOT re-run every earlier
   phase's full suite. If the phase touches shared infra (DB, container, auth, RLS),
   include at least one check from each earlier phase depending on it.
6. **Regression-found workflow** — classify: product breakage / test breakage / harness
   drift / stale-command drift. Fix in place if small & no scope-widening; route as
   BLOCKED if fixing widens scope. Never paper over a regression.
7. **Durable capture** — execution facts → `reports/`, future-phase research →
   `references/`, stable knowledge → gbrain (via WRITE-BACK).
8. **Commit checkpoint** — scoped conventional commit of the phase's files.
9. **Inter-phase write-back** (mandatory) — so phase outputs survive context loss.
10. **Move-on recommendation** — name the next phase + its plan path.

## Phase status

`⏳ PLANNED` · `🔨 CODE DONE` · `🧪 TESTING` · `✅ VERIFIED` · `🚧 BLOCKED`

A phase is `✅ VERIFIED` **only when** its own gates pass **AND** regression checks pass.

## Backend safety defaults

- Prefer disposable runtime targets (fresh container, temp DB, isolated port) over
  shared state.
- Isolate destructive ops (DB reset, migration rollback, config wipe) so they can't
  regress earlier work.
- For Supabase migrations: test up AND down migrations; verify RLS still holds after
  the schema change (see `risk-evidence.md`).

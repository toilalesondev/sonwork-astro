---
name: phase-programs
description: Run a large multi-phase effort (migration, refactor, repo-wide hardening, Supabase schema migration) as an umbrella plan plus per-phase plans, advanced one phase at a time with re-research and regression gates. Use when a task is too big for a single PLAN→BUILD pass. Implements the protocol in harness/phase-programs.md.
---

# phase-programs — large migrations & refactors

The invocable wrapper around `harness/phase-programs.md`. Use for efforts spanning 3+
phases.

## When to use

- Database / Supabase schema migrations with multiple steps
- Test-infra overhauls, large refactors, repo-wide hardening
- Anything where one giant EXECUTE would lose state or break earlier work

## Kickoff

1. Recommend the plan shape, phase sequencing, and next actions first.
2. After approval, create an **umbrella plan** in `process/active/` + one **phase plan**
   per phase.

## Per-phase loop (advance ONE phase at a time)

1. **Re-research** — re-read plan + prior reports; inspect code drift (mandatory).
2. **Execution approval** (human gate).
3. **Execute** — only this phase's scope.
4. **Validate** — the phase's exact gates; inspect artifacts/logs/DB/traces.
5. **Regression checkpoint** — narrowest representative check per previously-verified
   surface. If the phase touches shared infra (DB, auth, RLS), include one check from
   each earlier dependent phase.
6. **Regression-found** — classify (product / test / harness / stale-command); fix in
   place if small, route BLOCKED if it widens scope. Never paper over.
7. **Durable capture** — facts → `reports/`, research → `references/`, stable knowledge
   → gbrain via WRITE-BACK.
8. **Commit checkpoint** — scoped conventional commit.
9. **Inter-phase write-back** (mandatory).
10. **Move-on** — name the next phase + plan path.

## Phase status

`⏳ PLANNED · 🔨 CODE DONE · 🧪 TESTING · ✅ VERIFIED · 🚧 BLOCKED`
`✅ VERIFIED` requires own gates AND regression checks both passing.

## Backend safety

Disposable runtime targets over shared state; isolate destructive ops. For Supabase:
test up AND down migrations; re-verify RLS holds after schema changes.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- A phase is `✅ VERIFIED` only with pasted gate output + regression-check result.

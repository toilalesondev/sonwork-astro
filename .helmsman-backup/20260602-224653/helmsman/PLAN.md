# Helmsman — Build Plan (spec of record)

> gbrain-native, self-improving, 8-specialist agent harness.
> Orchestrator steers; specialists row. Idea → ship → maintain.
> Repo: `github.com/toilalesondev/helmsman` (private).

## Iron Law

The orchestrator ROUTES, never executes. Every task → a specialist.
Only exception: trivial conceptual Q&A.

## The 9 agents

| Agent | Was | Domain |
|-------|-----|--------|
| `@product` | gstack (front) | ideate, frame, product/scope review |
| `@scout`   | evera | explore THIS repo |
| `@brain`   | tan | memory, cross-repo, write-back |
| `@eng`     | matt | frontend/logic engineering |
| `@design`  | ive | design / UI |
| `@backend` | NEW | DB · API · services · auth · Supabase (schema, migrations, RLS, edge fns, storage) |
| `@mobile`  | NEW | RN · Expo · iOS · device |
| `@ship`    | gstack (back) | verify · code-review · ship · monitor |
| `@helm`    | NEW | the harness itself — manage agents/skills, install, gbrain fleet/health |

Old names (matt/ive/gstack/evera/tan) are kept as aliases during transition.

## Flow

```
IDEATE → ROUTE → EXPLORE → PLAN → REVIEW-PLAN → BUILD → VERIFY → REVIEW-CODE → SHIP → MONITOR → WRITE-BACK → SELF-REFINE
```

Approval gates: PLAN→BUILD, BUILD→WRITE-BACK.

## Four learning loops

- A — central memory (`@brain` → gbrain), user-approved
- B — prompt refine (each agent edits own definition on failure)
- C — agent memory (gbrain pages `agent-memory/<name>/`)
- D — risk-evidence chain (`@ship` gates: risk-gate → context-snippets → verification → review-decision → adversarial-validation)

## Memory

gbrain = source of truth. `process/{active,completed,backlog}/` = generated ledger.
brv dropped after Phase 0 migration. Code-indexing ON for mobile, OFF for landing.

## Build sequence — 11 phases, each with a verification gate

| Phase | Work | Gate |
|-------|------|------|
| 0 | brv→gbrain migration (`gbrain import .brv/context-tree`) | design-tokens page retrievable in gbrain |
| 1 | scaffold repo, git init, `gh repo create --private`, write PLAN.md | repo on GitHub, structure matches, clean commit |
| 2 | harness docs | every phase has owner; every intent maps to an agent |
| 3 | 8 agent definitions + skill lists; @backend Supabase/RLS section | every skill assigned once; no catch-all |
| 4 | core skills (challenge, verify, review, refine, generate-plan, capture) | each valid; capture gbrain-native; review has backend/RLS checklist |
| 5 | maintenance + xia skills (phase-programs, autoresearch, xia) | guard-file rule, stuck-detection, xia challenge-gate documented |
| 6 | gbrain plugin integration + agent-memory convention | `gbrain doctor` passes; agent-memory page round-trips |
| 7 | install.sh + EVALUATION.md scorecard | `install.sh --dry-run` lists correct plan |
| 8 | wire perfeat-landing (indexing OFF) | aliases resolve; @design loads impeccable; process/ exists |
| 9 | wire perfeat-mobile (indexing ON) | @backend resolves; Supabase recognized; `gbrain code-blast` works |
| 10 | FINAL E2E (idea→plan dry-run; Supabase→@backend route) | every phase routed correctly; orchestrator never executed |

## v2.3 — current state (coherence pass)

- **Global agents replaced** — `~/.claude/agents/` now holds the Helmsman 8 (old 6
  backed up + removed). Old names resolve via aliases (matt→eng, ive→design,
  gstack→product+ship, evera→scout, tan→brain, andy retired).
- **All 8 agents** carry the 6 Harness Operating Rules + per-project memory + learning
  loops + skill-enforcement.
- **Memory contract** in `harness/memory.md` (verbs recall/remember → gbrain mapping,
  future-backend slot). Per-project boundary = the project's isolated gbrain source.
- **Skill bugs fixed:** Helmsman `review` → `code-review` (was colliding); `@backend`
  uses `cso` (not a phantom `security`); `@ship` dropped non-existent `automate`.
- **Clone-and-go:** 46 skills vendored in `skills-vendor/`; `install.sh` copies 55
  skills to both host dirs, auto-detects backend, guards the default-source footgun,
  and clears pre-existing symlink skills before copy.
- **@scout** reframed as code-exploration / learn-the-repo owner (local-first:
  ripgrep/ctags/glob).

## Known limitations (honest)

- **gbrain code-graph** (`code-blast`) — NOT active in this gbrain build; `gbrain
  upgrade` reports binary self-update unimplemented. Scout/generate-plan use local
  tools for blast radius.
- **understand-* skills** — external `understand-anything` plugin (not vendorable;
  dangling symlinks here). Scout's local tools are primary.
- **File/markdown memory backend** — seam exists in memory.md; backend not yet built
  (gbrain-first).

## Parallelism

`parallel-fan-out` (via the Task tool) provides parallel read-only exploration and
parallel review. That is the harness's parallelism model.

## Decisions (locked)

8 specialists · gstack split into @product+@ship · @backend owns Supabase ·
@mobile built · mobile wired this build · xia included ·
gbrain truth, brv dropped · helmsman private, vibecode install model ·
gbrain plugin · 4 learning loops · 11-phase build with per-phase gates +
EVALUATION.md · old-name aliases during transition.

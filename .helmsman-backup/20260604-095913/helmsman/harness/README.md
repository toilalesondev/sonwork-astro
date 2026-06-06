# harness/ — the flow, the rules, the protocols

This directory IS the harness: how the orchestrator routes, the rules every agent obeys,
the flow work moves through, and how memory works. Agents read these at runtime (installed
as `.helmsman/harness/`).

## The core (read in this order)

| File | What it governs |
|------|-----------------|
| `iron-law.md` | **The one rule:** the orchestrator ROUTES, never executes (+ the relay rule). |
| `handoff.md` | How work passes between agents: relay (via orchestrator) · packet (durable artifact) · status. The fix loop. |
| `operating-rules.md` | The 6 HARD rules (prove-don't-claim, gates, never fake, load landmines, log failures, stay in lane) + the **Voice** (direct, no BS). |
| `routing.md` | The full intent→agent decision tree (11 specialists) + precedence + disambiguation. |
| `FLOW.md` | The phase-by-phase flow + "how to talk to Helmsman" (logic, not code) + the three speeds. For UI/brand projects, `@design` establishes `DESIGN.md` at PLAN (before BUILD) as the shared design source every builder reads. |
| `build-protocol.md` | BUILD discipline: 50% check-in, deviation + abandonment protocols, self-review. |
| `intent-clarification.md` | When to auto-route vs ask one question; plain-language ask handling. |
| `model-routing.md` | Cost discipline: abstract tiers (light/standard/deep) per agent + the **solver/evolver role axis** (evolver deltas run `light` — updating is flat across tiers), provider-agnostic. |
| `skill-trim.md` | Per-turn token discipline: hide unused skill families from the catalog via `permission.skill: deny` (config-hide, never delete). Turnkey recipe. |

## Memory (two tiers)

| File | What it governs |
|------|-----------------|
| `memory.md` | The memory contract: Tier 1 local (`process/context/`) + Tier 2 gbrain, complementary. |
| `context-routing.md` | How the local tier loads only relevant domain packs (token discipline). |
| `writeback.md` | Loop A — write learnings to BOTH tiers, user-approved, each verified. |
| `agent-memory.md` | Loop C — per-agent landmines + the graduation pipeline (landmine→skill). |

## Learning + safety

| File | What it governs |
|------|-----------------|
| `refine.md` | Loop B — an agent that fails the flow edits its own definition. |
| `adherence.md` | **Execution discipline** — the mid-trajectory re-anchor that fights >4× following-decay over long runs (reuses the 50% check-in + phase boundaries). Feeds Loop B via `adherence-check`. |
| `risk-evidence.md` | Loop D — auth/RLS/schema/billing changes complete an evidence chain before ship. |
| `calibration.md` | Loop E — score resolved predictions (takes) so the harness gets measurably smarter. |
| `phase-programs.md` | Large multi-phase efforts: umbrella plan + per-phase plans with gates. |
| `parallel-fan-out.md` | When/how to run specialists in parallel on cross-domain work. |

## The five learning loops (how the harness gets smarter)

- **A — Central memory** (`writeback.md`): post-build, learnings → both memory tiers.
- **B — Self-refine** (`refine.md`): a failing agent fixes its own instructions.
- **C — Agent memory** (`agent-memory.md`): per-agent landmines; recurring ones graduate to skills.
- **D — Risk evidence** (`risk-evidence.md`): high-risk changes prove safety before ship.
- **E — Calibration** (`calibration.md`): resolved predictions scored (accuracy + Brier);
  confidence tracks reality over time.

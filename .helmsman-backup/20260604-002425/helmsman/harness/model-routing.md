# Model Routing — cost discipline (provider-agnostic)

The right model for the work. Cheap models for reading; the top tier only for hard
reasoning. This is the single biggest cost lever — especially for long, autonomous runs.

**Provider-agnostic by design.** We use abstract **tiers**, never provider/model names.
The host maps each tier to whatever model is configured (`models.tier.*` in gbrain, or the
host's own routing). Any provider must work — Helmsman never hardcodes one.

## The tiers

| Tier | For | Why |
|------|-----|-----|
| **light** | reading, exploring, recall, summarizing, status snapshots | high volume, low reasoning — cheapest model handles it |
| **standard** | building, reviewing, drafting, planning | the everyday work tier — balanced cost/quality |
| **deep** | hard architecture, root-cause debugging, adversarial review, high-risk design | rare, high-stakes — pay for the best reasoning only here |

## Tier by agent (the default hint)

| Agent | Default tier | Escalate to deep when… |
|-------|--------------|------------------------|
| `@scout` | light | (read-only — rarely needs more) |
| `@chief` | light | synthesizing a complex cross-project decision / analysis |
| `@growth` `@ops` | standard | — |
| `@product` `@design` `@eng` `@backend` `@mobile` | standard | gnarly architecture / a bug that resists the standard tier → deep |
| `@ship` | standard | adversarial security review / a hard regression → deep |
| `@helm` | standard | — |

Each agent carries a `tier:` hint in its definition as the **default**. It's advisory —
the orchestrator/host may escalate a specific task to `deep` when the reasoning demands it
(a hard bug, an auth/RLS design, a `challenge` run). Escalate deliberately, not by default.

## The role axis — solver vs evolver (cross-cuts the tiers)

Grounded in *"Harness Updating Is Not Harness Benefit"* (Lin et al. 2026, arXiv 2605.30621):
**producing a harness delta is FLAT across model tiers** (evolver gap ≤3.1pp — a cheap model
writes near-identical-quality updates), while **benefiting from the harness while solving is
NOT** flat. So spend where benefit lives (the solver), save on the evolver.

Every task is either **solving** or **evolving**:

| Role | What it is | Tier |
|------|-----------|------|
| **solver** | doing the actual work — building, designing, debugging, reviewing, the user's task | the agent's normal `tier:` (escalate to `deep` per the rules below) |
| **evolver** | *producing harness deltas* — write-back (Loop A), agent-memory landmines (Loop C), calibration scoring (Loop E), `evolve-memory` clustering, the adherence re-anchor | **`light`** — updating is tier-insensitive |

Each agent declares an **`evolver_tier:`** hint in its frontmatter (default `light`). When an
agent switches from doing its work to writing harness deltas, it drops to its `evolver_tier`.
**Never burn `standard`/`deep` on write-back, clustering, or calibration** — it's the
highest-frequency operation (runs after every non-trivial build) and the spend buys nothing.

**Carve-out (safety):** Loop B (refine — edits an agent's *durable* instructions) and Loop D
(risk-evidence — *gates* auth/RLS/billing safety) stay at the agent's normal tier. The
flatness finding covers routine delta-production, NOT durable self-modification or safety
gating. (Revisit later: B/D could draft at `light` behind the existing human approval gate.)

## The rule

- **Default low.** Start at the agent's tier; only escalate when the task genuinely needs it.
- **Read ≠ reason.** Exploring/recall/status is `light` — never burn `deep` on a file read.
- **High-risk reasoning earns `deep`.** auth/RLS/schema/billing design, root-cause
  debugging, adversarial review — these are where the top tier pays for itself.
- **Name the escalation.** If you move a task to `deep`, say why (so cost is intentional).

## How it maps (host's job, not ours)

The host resolves `light`/`standard`/`deep` to actual models. Example mappings (illustrative,
NOT prescribed): light→a fast cheap model, standard→a mid model, deep→a top reasoning model.
Helmsman states the tier; the deployment picks the model. See the project's `AGENTS.md`
brain-config block for this deployment's chat-provider.

## Deployment action (evolver-tier is a HINT — the deployment must honor it)

`evolver_tier: light` (in every agent) and the evolver-tier notes in the loop docs are
**hints, not enforcement** — Helmsman is provider-agnostic and never picks a model. To get
the actual cost win, the deployment must map the evolver/light tier to a cheap model where
the harness work runs:

- **opencode (this box):** the host reads each agent's tier hints; ensure `light` maps to a
  cheap model in the host's model config.
- **gbrain dream-cycle / autopilot** (if used for automated write-back): pin
  `models.tier.subagent` → a cheap model in `~/.config/gbrain/config.json` (or `~/.gbrain/`).
- This is a **one-time per-deployment config edit**, deliberately NOT in the template (that
  would hardcode a provider and break agnosticism).

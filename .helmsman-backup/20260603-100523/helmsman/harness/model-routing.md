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
| `@scout` `@data` | light | (read-only — rarely needs more) |
| `@brain` `@chief` | light | synthesizing a complex cross-project decision |
| `@growth` `@ops` | standard | — |
| `@product` `@design` `@eng` `@backend` `@mobile` | standard | gnarly architecture / a bug that resists the standard tier → deep |
| `@ship` | standard | adversarial security review / a hard regression → deep |
| `@helm` | standard | — |

Each agent carries a `tier:` hint in its definition as the **default**. It's advisory —
the orchestrator/host may escalate a specific task to `deep` when the reasoning demands it
(a hard bug, an auth/RLS design, a `challenge` run). Escalate deliberately, not by default.

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

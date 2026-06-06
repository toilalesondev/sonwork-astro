---
name: adherence-check
version: 1.0.0
description: Native HFR (Harness Following Rate) measure — scores how faithfully an agent followed its loaded skills/plan/rules over a long trajectory, to catch adherence decay (Lin et al. 2026: faithful-following decays >4× across a long run). Owned by @helm. Reads a trajectory (session transcript / plan + outcome), scores per-obligation following, emits an HFR number + the specific obligations that drifted. Feeds Loop B: low HFR on the SAME instruction across runs = the instruction is at fault, not the agent → propose a refine. Use when "are agents following the harness", "measure drift", "check adherence", or on a periodic harvest.
---

# adherence-check — measure how faithfully the harness was followed (native HFR)

Owned by `@helm`. Loading an artifact (activation) is necessary but not sufficient —
*following* it decays over a long trajectory (Lin et al. 2026, arXiv 2605.30621: >4×
adherence decay across a long run). This skill measures it. See `harness/adherence.md` for
the concept.

**Native, provider-agnostic.** The algorithm is credited to the paper's
`hfr_analysis/pipeline.py` but re-implemented here with no external Python dependency — it
runs on the trajectory data the harness already produces (the plan's Verification items, the
loaded-skill obligations, and the session's actual actions/outcome).

**Runs at the `evolver` tier (`light`)** — it's scoring/measuring, not solving (see
`harness/model-routing.md`).

## What HFR is

**Harness Following Rate** = of the obligations that were active during a trajectory, what
fraction did the agent actually follow?

```
HFR = followed_obligations / total_active_obligations    (0..1)
```

An obligation is any concrete must-do that was in force: a plan Verification Evidence item,
a loaded-skill hard requirement, an operating-rule that applied (e.g. "prove with evidence",
"RLS denied-path test"), a risk-gate requirement.

## Inputs

- The active **plan** (`process/active/<plan>.md`) — its Verification Evidence list.
- The **loaded skills** for the run + their hard requirements.
- The **trajectory**: what the agent actually did (session transcript, the diff, the
  evidence it produced, `verification.json` / `review-decision.json` if present).

## Procedure

1. **Enumerate active obligations** — list every concrete must-do that was in force during
   the run (plan Verification items + loaded-skill requirements + applicable operating rules
   + risk-gate items). Each becomes a checklist row.
2. **Score each** — for each obligation, mark `followed` / `drifted` / `n-a` with the
   file:line or evidence that shows it (followed = there's proof; drifted = the obligation
   applied but no evidence it was honored). Prove-don't-claim: a row is `followed` only with
   re-checkable evidence.
3. **Compute HFR** = followed / (followed + drifted). Report it plainly. Honest when there's
   too little to score ("trajectory too short to measure adherence").
4. **Position in the trajectory** — note WHERE drift happened (early/mid/late). Late-run
   drift is the paper's signature failure mode; flag it.
5. **Feed Loop B** — if the SAME obligation drifts across multiple runs, the *instruction*
   is likely at fault, not the agent. Emit a refine candidate (see `harness/refine.md`):
   the obligation's source doc/agent-line + "drifted N/M runs → consider strengthening".

## Output

```
HFR: 0.NN  (followed X / Y active obligations)
Drifted obligations:
  - <obligation>  [source: file:line]  [drift position: late]
Refine candidates (Loop B):
  - <obligation> drifted in N/M recent runs → <doc/agent-line> wording may be at fault
```

## Cadence

Periodic (e.g. weekly, or after a long multi-phase program) or on demand. Read-only — it
scores + reports + emits refine candidates; it does NOT edit instructions itself (that's
Loop B, behind the human gate).

## Honest caveat (Rule 1)

HFR needs enough trajectory + enough resolved obligations to mean something. On a short run
or a fresh brain, the correct output is "not enough trajectory to measure adherence," not a
fabricated rate. The signal sharpens as long builds accrue.

## Script

`scripts/hfr.mjs` — given an obligations list + a trajectory marker file, computes the HFR
number and the drift breakdown deterministically (the math; the *judgment* of which
obligations were followed is the agent's, with evidence). Provider-agnostic, zero deps.

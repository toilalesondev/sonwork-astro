# Adherence — following the harness over a long trajectory

Loading an artifact (skill, plan, rule) is necessary but **not sufficient**. Empirically,
faithful-following **decays over a long run** — the agent loads a skill at step 1 and drifts
by step 40 (Lin et al. 2026, arXiv 2605.30621: adherence decays >4× across a long
trajectory; the dominant failure mode after *activation*). The 5 loops all assume the agent
keeps following the harness once it's loaded. The **re-anchor** closes that gap.

Adherence is **execution discipline** — the complement to the **iron-law** (routing
discipline) and the **6 operating rules** (behavioral invariants). It is NOT a new gate and
NOT a new approval. It's a cheap, periodic re-statement of the *currently-active
obligations*, fired at checkpoints the flow **already** has.

## The re-anchor (what gets re-stated — ≤5 lines, landmines only, Rule 4)

At a re-anchor point, the working agent re-states ONLY what's load-bearing right now:

1. **Remaining Verification Evidence** items from the active plan (what still must be proven).
2. **Loaded-skill hard requirements** (the must-dos of whatever skill is in play).
3. **Risk-gate status** — if this is high-risk work (auth/RLS/schema/billing), the
   `risk-gate.json` state and what's still un-cleared.

NOT the whole plan. NOT the iron-law. NOT documentation. Landmines only — re-anchoring with
a wall of context would be the very ceremony that *causes* drift.

## When it fires (reuse existing checkpoints — add NO new gates)

- **The 50% check-in** (`build-protocol.md` §2) — the build already pauses mid-trajectory to
  report done/remaining. Append the re-anchor to that existing pause.
- **Each phase boundary** in a phase program (`phase-programs.md` step 1, Re-research) —
  already re-reads the plan + prior reports. Re-state the rule/skill obligations there too,
  not just the plan.

That's it. Two points the flow already hits — no every-N-steps timer, no new approval.

## Cost

Runs at the **`evolver` tier (`light`)** — it's re-reading + re-stating, not reasoning (see
`model-routing.md` role axis).

## Measuring adherence (HFR → Loop B)

Drift is measurable. The `adherence-check` skill (`skills/adherence-check/`) runs a native
HFR-style measure (Harness Following Rate): sample a long trajectory, score how faithfully
the agent followed the loaded skills/plan over the run, emit a number. Algorithm credited to
the paper's `hfr_analysis/pipeline.py`; re-implemented Helmsman-native (no external Python).

The signal feeds **Loop B (refine, `refine.md`)**: if the agent keeps drifting from the
**same** instruction, the *instruction* is probably at fault, not the agent — flag that
instruction's wording for refinement. (Low adherence on one rule across many runs = a
harness bug, not an agent bug.)

## Why this is separate from iron-law.md

The iron-law is the orchestrator's **routing** rule (front-loaded by design — it decides who
does the work). Adherence is the **executing agent's** discipline (it decays *during* the
work). What actually decays on a 40-step build isn't routing — it's the loaded skill's
obligations, the plan's verification items, and the risk-gate. Re-anchor *those*, keep the
two concepts distinct.

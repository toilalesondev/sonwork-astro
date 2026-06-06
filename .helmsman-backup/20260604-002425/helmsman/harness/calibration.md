# Calibration — Loop E (was the bet right?)

The harness records decisions and predictions as gbrain **takes** (weighted, attributed,
often with a resolution date). Loop E closes the loop: when a take **resolves**, score it,
then measure how well-calibrated the agents/harness are over time — so confidence numbers
mean something and the harness gets *measurably* smarter, not just more notes.

> This is the loop ECC only gestures at (confidence "adjusts"). gbrain makes it real: it
> has typed weighted takes + `takes_scorecard` / `takes_calibration`. We use them.

## What a "take" is (the input)

A take = a typed, weighted claim an agent made: a decision, an estimate, a prediction.
- `kind`: fact | take | bet | hunch
- `weight`: 0–1 confidence the agent stated
- optional `resolves_on` / resolution: did it come true?

Agents already write takes during write-back (Loop A). Loop E **reads the resolved ones**.

## The loop

```
agent makes a weighted call  →  recorded as a gbrain take  →  reality resolves it
   →  Loop E scores it (right? wrong? partial?)  →  calibration profile updated
   →  agents see their calibration  →  they adjust stated confidence next time
```

## Calibration metrics (gbrain-native)

- **Accuracy** — of resolved bets, what fraction were right.
- **Brier score** — mean squared error between stated weight and outcome (0 = perfect,
  lower is better). Rewards honest confidence, punishes over/under-confidence.
- **Per-domain** — calibration can differ by surface (e.g. backend estimates vs timeline
  estimates). Scope with `domain_prefix`.

## Cadence

Periodic (e.g. weekly/monthly) or on demand ("how calibrated are we?"). Owned by `@helm`
(cross-cutting memory/fleet), with `@chief` available for the analysis read. It's
**read-mostly**: it scores + reports + writes a calibration *profile* back to gbrain; it
does not rewrite the original takes.

Runs at the **`evolver` tier (`light`)** — scoring resolved takes is delta-production, flat
across model tiers (see `model-routing.md` role axis). Don't burn the solve tier on it.

## Honest caveat (Rule 1)

Calibration needs **resolved** takes to exist. On a fresh brain there's little to score —
the correct output is "not enough resolved takes yet to calibrate," not a fabricated number.
The signal grows as the harness is used and bets resolve. Loop E ships the *mechanism*;
the *data* accrues with time.

## Feedback (why this matters)

A calibrated agent states confidence that tracks reality. Over time:
- An over-confident agent (high weights, low accuracy) learns to hedge.
- An under-confident one learns to commit.
- `evolve-memory`'s 0.3–0.9 confidence scale is *informed* by calibration — graduation
  trusts the weights more when the source agent is well-calibrated.

See `skills/calibrate/SKILL.md`.

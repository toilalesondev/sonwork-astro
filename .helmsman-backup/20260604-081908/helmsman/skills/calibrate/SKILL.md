---
name: calibrate
version: 1.0.0
description: Score resolved gbrain takes to measure how well-calibrated the agents/harness are (Loop E). Owned by @helm (with @chief for the analysis read). Pulls resolved weighted takes, computes accuracy + Brier score (overall + per-domain) via gbrain takes_scorecard/takes_calibration, reports it plainly, and writes a calibration profile back. Read-mostly. Use when the user asks "how calibrated are we / were our bets right / are our estimates trustworthy", or on a periodic harvest. Honest when there's not enough resolved data yet.
---

# calibrate — Loop E: score resolved predictions

Owned by `@helm` (cross-cutting memory/fleet) + `@chief` (analysis read). Closes the prediction loop: were the
weighted calls right? See `.helmsman/harness/calibration.md`.

> **Run at the `evolver` tier (`light`).** Scoring resolved takes is delta-production — flat
> across model tiers (see `harness/model-routing.md` role axis).

## When to run
- "How calibrated are we?" / "were our bets right?" / "can we trust our estimates?"
- Periodic harvest (weekly/monthly) alongside `evolve-memory`.

## Procedure

### 1. Pull resolved takes (mode-aware — read `.helmsman/backend`)

**gbrain mode:**
```
gbrain takes_scorecard            # overall: count, accuracy, Brier, partial_rate
gbrain takes_calibration          # observed-vs-predicted per confidence bucket
gbrain takes_list --resolved true # the resolved rows themselves
```
Scope per surface with `domain_prefix` and per agent with `holder`.

**standalone mode:** score the file takes-ledger (`process/takes/*.jsonl`) — same metrics,
no gbrain:
```
node .helmsman/skills/calibrate/scripts/score-takes.mjs process/takes [--holder <h>]
```
Ledger lines are append-only JSON: `{"id","holder","kind":"bet","claim","weight":0..1,
"since","resolved":true,"outcome":true|false}`. Bets are recorded during write-back (Loop A)
and resolved (set `resolved:true` + `outcome`) when reality decides them.

### 2. Check there's enough signal (honesty gate)
If too few resolved takes exist, STOP and say so plainly: **"Not enough resolved takes yet
to calibrate (<N>). The loop is live; the signal grows as bets resolve."** Do NOT
fabricate an accuracy/Brier number from thin data.

### 3. Read the calibration
- **Accuracy** — fraction of resolved bets that were right.
- **Brier** — stated-weight vs outcome (lower = better; rewards honest confidence).
- **Per-bucket** — are 0.9-confidence calls actually right ~90% of the time? (over/under-confidence)
- **Per-domain** — where is the harness well-calibrated vs not (e.g. backend solid,
  timelines optimistic)?

### 4. Report — plain language
```
## Calibration

OVERALL: <N> resolved bets · accuracy <x>% · Brier <y>
READS AS: <well-calibrated | over-confident | under-confident>, because <bucket evidence>

BY DOMAIN
- <domain>: <accuracy/Brier + one-line read>

TAKEAWAY: <e.g. "timeline estimates run ~20% optimistic — pad them.">
```

### 5. Write the profile back
Store the calibration summary as a gbrain page (e.g. `calibration/<holder-or-domain>/<date>`)
so it persists and `evolve-memory` can weight by it. Verify with `gbrain get` (Rule 1).

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Never invent a calibration number** — every
metric traces to `takes_scorecard`/`takes_calibration` output. "Not enough data yet" is the
honest, valid answer on a young brain. Read-mostly: score + report + write a profile;
do not rewrite the original takes.

## Evidence (what "done" must show)
The actual `takes_scorecard` output (counts + accuracy + Brier), the profile slug written,
and its `gbrain get` read-back. Or the honest "insufficient resolved takes" with the count.

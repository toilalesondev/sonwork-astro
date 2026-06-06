---
name: investigate
version: 1.0.0
description: >-
  Root-cause investigation for failing/flaky runs and production incidents — investigate →
  analyze → hypothesize → fix, with the iron law: no fix without a root cause. Owned by @ship.
  Use for a failing CI run, a flaky test, a 500/stack trace, "it was working yesterday", or a
  prod incident. (For builder-side bug diagnosis with a repro loop, @eng's diagnose overlaps.)
---

# investigate — find the root cause before any fix

The iron law: **no fix without a root cause.** Four phases. Owned by `@ship` (the back-half /
incident lens; @eng's `diagnose` is the builder-side feedback-loop version — they share DNA).

## Trigger
- Failing/flaky CI run, a 500 / stack trace, "it was working yesterday", unexpected behavior,
  a production incident.

## Procedure
1. **Investigate** — gather facts: the exact error/stack, when it started, what changed (recent
   deploys/commits), scope (one user/route or all), logs/metrics. Reproduce if you can.
2. **Analyze** — narrow to the subsystem. Read the relevant code + recent diffs. Separate symptom
   from cause.
3. **Hypothesize** — 3–5 ranked, falsifiable hypotheses (each states a prediction). Test the
   cheapest discriminating one first; change one variable at a time.
4. **Confirm the root cause, then fix** — prove the cause (a probe/test that pins it), then apply
   the fix and verify the original symptom is gone. If it's a code bug, hand the fix boundary to
   the owning builder (@ship reports/investigates; builders patch). Write a regression test.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **No fix without a confirmed root cause** — never
shotgun. Confirm you're chasing the reported symptom, not a nearby one. @ship investigates +
reports the fix boundary; the owning builder implements (stay in lane).

## Evidence (what "done" must show)
The confirmed root cause (with the probe/test that pins it), the change that resolves it, and the
original symptom verified gone — plus a regression test. Never "fixed" on a guess (Rule 1).

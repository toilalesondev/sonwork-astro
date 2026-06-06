---
name: diagnose
version: 1.0.0
description: >-
  Disciplined diagnosis loop for hard bugs and performance regressions — build a feedback
  loop → reproduce → hypothesise → instrument → fix → regression-test. Owned by @eng. Use
  when the user says "diagnose/debug this", reports something broken/throwing/failing, or
  describes a performance regression.
---

# diagnose — find the root cause, don't guess

A discipline for hard bugs. The whole skill is **building a fast deterministic feedback loop**;
everything else mechanically consumes that signal. Skip a phase only with explicit justification.
Use the project's domain glossary (CONTEXT.md) + ADRs to get a clear mental model first.

## Trigger
- "Diagnose / debug this", a reported bug (broken / throwing / failing / "was working yesterday"),
  or a performance regression.

## Procedure

### Phase 1 — Build a feedback loop (THIS is the skill)
A fast, deterministic, agent-runnable pass/fail signal for the bug. With one, you WILL find the
cause; without one, staring at code won't save you. Be aggressive, creative, refuse to give up.
Construct one, roughly in this order:
1. **Failing test** at whatever seam reaches the bug (unit/integration/e2e).
2. **curl/HTTP script** against a running dev server.
3. **CLI invocation** with a fixture, diffing stdout vs a known-good snapshot.
4. **Headless browser script** (use the browser tool when present) asserting DOM/console/network.
5. **Replay a captured trace** (saved request/payload/event log) through the path in isolation.
6. **Throwaway harness** — minimal subset (one service, mocked deps) hitting the bug in one call.
7. **Property/fuzz loop** for "sometimes wrong output".
8. **Bisection harness** if it appeared between two known states (`git bisect run`).
9. **Differential loop** — same input through old vs new (or two configs), diff outputs.
10. **HITL script** — last resort; structure the human-in-the-loop so output still feeds back.

**Iterate on the loop as a product:** faster (cache setup, narrow scope), sharper (assert the
specific symptom, not "didn't crash"), more deterministic (pin time, seed RNG, isolate FS/network).
A 2-second deterministic loop is a superpower; a 30-second flaky one is barely better than none.
**Non-deterministic bugs:** raise the reproduction RATE (loop 100×, parallelise, stress, inject
sleeps) until debuggable. **Can't build a loop?** Stop, say so, list what you tried, ask for env
access / a captured artifact (HAR, log dump, core dump) / permission to instrument. Don't
hypothesise without a loop. Don't proceed to Phase 2 until you have a loop you believe in.

### Phase 2 — Reproduce
Run the loop; watch the bug appear. Confirm: it's the failure the **user** described (not a
nearby one — wrong bug = wrong fix), reproducible (or high-enough rate), and you've captured the
exact symptom for later verification. Don't proceed until reproduced.

### Phase 3 — Hypothesise
Generate **3–5 ranked, falsifiable hypotheses** before testing any (single-hypothesis anchors).
Each states a prediction: "If X is the cause, then changing Y makes it disappear / Z makes it
worse." No prediction = a vibe; sharpen or discard. Show the ranked list to the user (they often
re-rank instantly — "we just deployed #3"); proceed on your ranking if they're AFK.

### Phase 4 — Instrument
Each probe maps to a Phase-3 prediction. **Change one variable at a time.** Prefer debugger/REPL
(one breakpoint beats ten logs) → targeted boundary logs → never "log everything and grep". **Tag
every debug log** with a unique prefix (`[DEBUG-a4f2]`) so cleanup is one grep. **Perf branch:**
logs are usually wrong — establish a baseline measurement (timing harness, profiler, query plan),
then bisect. Measure first, fix second.

### Phase 5 — Fix + regression test
Write the regression test **before the fix** — but only if a **correct seam** exists (one that
exercises the real bug pattern at the call site). A too-shallow seam gives false confidence; **if
no correct seam exists, that IS the finding** — note it (the architecture is preventing lockdown).
With a seam: minimised repro → failing test → watch fail → apply fix → watch pass → re-run the
Phase-1 loop against the original (un-minimised) scenario.

### Phase 6 — Cleanup + post-mortem
- [ ] Original repro no longer reproduces (re-run the loop)
- [ ] Regression test passes (or absence of seam documented)
- [ ] All `[DEBUG-...]` instrumentation removed (grep the prefix)
- [ ] Throwaway prototypes deleted
- [ ] The correct hypothesis stated in the commit/PR (so the next debugger learns)
Then ask **"what would have prevented this?"** — if it's architectural (no seam, tangled callers,
hidden coupling), hand off to `improve-codebase-architecture` with specifics, AFTER the fix is in.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **No fix without a root cause** — never shotgun-edit
hoping one change works. No hypothesising without a feedback loop. Confirm you reproduced the
USER's bug, not a nearby one.

## Evidence (what "done" must show)
The feedback loop (command + its pass/fail output), the reproduced symptom, the ranked
hypotheses, the fix, and the regression test failing-then-passing — plus the original loop no
longer reproducing. Never "fixed it" without the loop output (Rule 1).

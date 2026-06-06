# Build Protocol — discipline during BUILD

Rules every builder (`@eng` `@design` `@backend` `@mobile`) follows while implementing an
approved plan. The point: **build exactly what was approved, and never silently change
course.** (Referenced from `FLOW.md` BUILD phase.)

## 1. Build to the plan, with fidelity

- Implement EXACTLY the approved plan. No bonus features, no unplanned refactors, no
  "while I'm here" changes.
- Check off the plan's items as you complete them.
- Production-grade, not prototype: handle failures, validate at boundaries, leave no
  correctness-blocking TODOs.

## 2. The 50% check-in

At roughly halfway through a non-trivial build, **pause and report**:

- what's done (checklist items complete),
- what remains,
- then ask: **"Continue with this approach, or pause and return to PLAN?"**

If the user hesitates, pause and reassess. This catches a wrong direction at half-cost
instead of full-cost.

## 3. Deviation protocol — never improvise silently

If reality differs from the plan (a contract is wrong, an approach won't work, a
dependency is missing):

1. **STOP immediately.** Do not quietly change course.
2. Explain the issue plainly and why a deviation is needed.
3. Say: **"This requires updating the plan. Returning to PLAN."**
4. Wait for approval of the revised plan, then resume.

A silent deviation is a flow failure (feeds Loop B / `refine`).

## 4. Abandonment protocol — when an approach fails

If an approach is abandoned:

1. Note which components are reusable.
2. **Document the lessons before deleting** → write to `agent-memory/<agent>/<topic>`
   (so the next attempt inherits them).
3. Write a short "why abandoned" summary.
4. Clean up the dead artifacts.
5. **Return to PLAN** to revise — do not thrash on a new approach in-place.

## 5. Self-review before hand-off

Before handing to `@ship`:

- **Run the plan's own Verification Evidence as a checklist** — the plan named what "done"
  must prove (e.g. "reject cost > balance", "RLS denied-path tested"). For EACH item, confirm
  the code does it AND a test/check covers it. A plan requirement with no matching code/test
  is a self-review FAIL — fix it before handing off. (This is the #1 way a builder ships a
  gap @ship then has to catch: don't make @ship find what your own plan already specified.)
- Re-read the rest of the approved plan; verify each item was implemented as specified.
- Flag ANY deviation (path · what differs · why), however minor.
- Summarize: ✅ matches plan (incl. every Verification item), or ❌ gaps/deviations (list them).
- If material deviations exist → return to PLAN/write-back to reconcile, don't ship.

## 6. Honesty at completion (ties to Operating Rules 1 & 3)

- Don't declare done without fresh verification evidence.
- "Done with concerns" or "blocked" is a valid, honest result — say it plainly.
- Never manufacture progress to look productive.

> High-risk work (auth / RLS / schema / billing / public API) additionally completes the
> risk-evidence chain (`risk-evidence.md`) before it can be called done.

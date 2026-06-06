# Handoff Protocol — how work passes between agents

Specialists run in **isolated context windows** (see `iron-law.md`). They cannot see each
other's context and cannot call each other directly. So every handoff is built on three
primitives — and the whole protocol falls out of them.

## The three primitives

1. **Relay — the orchestrator is the hub.** Agents never hand to each other directly; they
   return to the orchestrator with a **status**, and the orchestrator dispatches the next
   agent. "Hand back to the builder" = "return to orchestrator → orchestrator re-dispatches
   the builder." The orchestrator holds the thread; the specialists go deep in isolation.

2. **Packet — the durable artifact, not the chat, is the source of truth.** Because windows
   are isolated, anything that must survive a handoff is **written to disk**, not left in an
   agent's context. The packet for each seam:
   - plan → `process/active/<plan>.md`
   - verification → `verification.json`
   - review findings → `review-decision.json` (high-risk) OR a **findings file** (any
     STOP/CAUTION, even normal paths) so `file:line` precision never degrades on the relay
   - facts from EXPLORE → written into the plan (not left in scout's window)

3. **Status — the trigger.** Every subagent ends with the status block
   (`DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT`, see `operating-rules.md`). The
   orchestrator reads it to decide the next seam:
   - `DONE` → advance to the next phase
   - `DONE_WITH_CONCERNS` → advance, but surface the concern
   - `STOP` (review verdict) / `BLOCKED` → loop back (below)
   - `NEEDS_CONTEXT` → return to the user

## The seams (trigger → packet → receiver → return trip)

### EXPLORE → PLAN
@scout finishes with `DONE` and **write their facts into the plan stub** (file:line,
what exists, what's at risk) — not left in their window. The owning builder reads the plan
stub and writes the full blast-radius plan.

### PLAN → BUILD
`DONE` + **✋ human gate** ("build it"). Packet = `process/active/<plan>.md`. The builder
implements exactly that plan.

### BUILD → VERIFY → REVIEW-CODE
Builder returns `DONE`; packet = the diff (git) + (high-risk) `verification.json`. @ship
verifies, then reviews.

### REVIEW-CODE → BUILD  (the fix loop — @ship finds a problem)
This is the seam your case asks about. @ship **reports, never patches**:

1. @ship returns a verdict: `GO | CAUTION | STOP`.
2. On **STOP or CAUTION**, @ship **writes a findings artifact** — each finding with
   `file:line` + the concrete failure mode (input → bad outcome) — to the plan's folder
   (`review-decision.json` on high-risk, else `process/active/<plan>.findings.md`).
3. The orchestrator (relay) reads the `STOP` status and **re-dispatches the builder that
   owned the original BUILD** (tracked via the plan), handing it the findings artifact.
4. That builder **re-enters BUILD** per `build-protocol.md`: fixes **exactly** the findings
   (no scope-widening), self-reviews, returns `DONE`.
5. The orchestrator re-dispatches @ship to **re-verify ONLY the flagged findings** — not a
   full re-review — then `GO` → SHIP.

   **CAUTION** = non-blocking: the builder either fixes now or logs a tracked follow-up to
   `process/backlog/` and ships. STOP = blocking; SHIP is gated until `GO`.

### "Stuck" → @ship → BUILD  (builder blocked mid-build)
Builder returns `BLOCKED` (names what's blocking). Orchestrator dispatches @ship
(investigate/diagnose) to find root cause. @ship returns the root cause + a **bounded fix
scope** as the packet — it diagnoses, it does NOT take over the build. Orchestrator hands
the bounded scope back to the owning builder.

### Cross-domain seam (e.g. a Supabase-backed mobile screen)
The orchestrator names a **lead builder** who owns the integration seam; each domain owner
(@mobile for the screen, @backend for the policy) does its slice; they coordinate through
the **shared plan** (the durable packet), not by talking directly.

### WRITE-BACK → memory
the agent that did the work returns a numbered proposal (the packet); **✋ human gate**; on approval it
writes both memory tiers and verifies by read-back.

## Universal handoff rules

- **Evidence travels, claims don't** (Rule 1). A handoff packet shows proof, never "looks done."
- **The receiver owns its scope.** A builder receiving findings fixes exactly those; it does
  not widen scope or re-architect (that's a return to PLAN, per `build-protocol.md`).
- **No silent re-routing.** If an agent is handed work outside its lane, it STOPs and names
  the right agent (Rule 6) — the orchestrator re-dispatches.
- **The owning builder is tracked by the plan**, so a fix loop always returns to whoever
  built it — never a random builder.

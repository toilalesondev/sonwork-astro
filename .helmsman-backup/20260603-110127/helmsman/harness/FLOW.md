# The Helmsman Flow

## How to talk to Helmsman (you don't need to know code)

You say what you **want** — the outcome, in plain words. Helmsman figures out what kind of
work that is and hands it to the right specialist. You never have to know which file,
which function, or which agent.

- *"Let people log in with Google."* → it's auth → @backend plans it, you approve, it's built + proven.
- *"The checkout page feels slow."* → it's a performance issue → @ship finds the real cause first.
- *"Write the launch announcement."* → it's content → @growth drafts it in your voice.
- *"Give this customer a refund."* → it's an operation → @ops does it and shows the confirmation.

Two moments need a "yes" from you: **before building** (you approve the plan) and **before
remembering** (you approve what gets saved). Everything in between just flows. Helmsman
reports back in **outcomes** ("login works, here's the proof"), not jargon.

---

```
IDEATE → ROUTE → EXPLORE → PLAN → REVIEW-PLAN → BUILD → VERIFY → REVIEW-CODE → SHIP → MONITOR → WRITE-BACK → SELF-REFINE
                                                  ▲                  │
                                                  └──── STOP ────────┘   (fix loop: findings → owning builder → re-verify)
```

Every arrow is a routing decision made by the orchestrator. Two arrows are **human
approval gates**: PLAN→BUILD and BUILD→WRITE-BACK. One arrow loops **back**: a REVIEW-CODE
`STOP` returns to the owning builder to fix, then re-verifies. All handoffs go through the
orchestrator via durable artifacts — see `handoff.md`.

---

## Phase by phase

### IDEATE — `@product`
You arrive with an idea ("what if…", "should we build…", "I want…"). `@product` frames
it: is it worth building? narrowest wedge? the 10-star version? Output: a framed
concept. Skills: office-hours, design-shotgun, design-consultation, to-prd.

**Skip when:** the request is already a concrete, well-scoped task.

### ROUTE — Orchestrator
Score ambiguity (`intent-clarification.md`), match autonomy phrases, score parallel
fan-out (`parallel-fan-out.md`), load gbrain context, then route. **Never executes.**

### EXPLORE — `@scout` / `@brain`
Read-only fact gathering. `@scout` for this repo's architecture; `@brain` for
cross-repo knowledge and the gbrain code graph. Output: what exists, what's affected,
what's at risk. No file writes.

### PLAN — `@eng` / `@design` / `@backend` / `@mobile`
The right domain builder writes a blast-radius spec to `process/active/`:
touchpoints · public contracts · blast radius · verification evidence · resume handoff.
On high-risk work, runs the `challenge` skill first (predict + scenario).

**Design system FIRST (any UI/brand surface).** If the project has any user-facing or
brand surface, `@design` **establishes the design system before BUILD** — `DESIGN.md` (at
repo root, path per `AGENTS.md`) via `design-consultation`: aesthetic, OKLCH palette, ≤3
font families (no reflex-reject fonts), spacing, motion. `DESIGN.md` is a **shared input
every builder reads**, not a late deliverable — so the app and the pages follow one design
principle by construction. It is stored to gbrain (`projects/<p>/design/system`) so it's
durable + shared. (Without this, code gets written before the principle exists and the app
drifts off-brand.)

### REVIEW-PLAN — domain expert
The plan is reviewed by the matching expert: eng plans → `@eng` plan-eng-review,
design → `@design` plan-design-review, product/scope → `@product` plan-ceo-review,
backend/devex → `@backend`.

**▶ HUMAN GATE:** you say "build it" to proceed.

### BUILD — domain builder
The same builder implements exactly the approved plan, following `build-protocol.md`:
build to the plan with fidelity, a **50% check-in** on large work, the **deviation
protocol** (stop + return to PLAN, never improvise silently), the **abandonment protocol**
(document lessons → return to PLAN), and **self-review** before hand-off. If stuck, `@ship`
(investigate/diagnose) finds root cause and hands the fix boundary back.

### VERIFY — `@ship`
`verify` skill: diff-aware — maps changed files to tests, runs only affected tests,
escalates to full suite on config/high-fan-out changes. Writes `verification.json` on
high-risk paths.

### REVIEW-CODE — `@ship`
`code-review` skill: scouts edge cases FIRST, then reviews the diff — N+1 queries, schema
back-compat, RLS/auth (identity AND permission), races, data leaks. Reports; never patches.
Verdict `GO | CAUTION | STOP`. On STOP/CAUTION, **writes a findings artifact** (file:line +
failure mode) → the orchestrator hands it to the **owning builder** to fix → @ship
**re-verifies only those findings** → GO. (The fix loop — see `handoff.md`.)

### SHIP — `@ship`
ship → land-and-deploy. Branch → PR → merge → deploy.

### MONITOR — `@ship`
canary, benchmark, health. Watches the live deploy against baselines.

### WRITE-BACK — `@brain` (Loop A)
Proposes a numbered list of gbrain writes (pages / facts / takes) + `process/`
archival + backlog capture.

**▶ HUMAN GATE:** you approve the numbered list. Then `@brain` writes gbrain and
regenerates the `process/` projections.

### SELF-REFINE — every agent (Loops B, C, D, E)
- **B:** if an agent hit a flow failure, it proposes an edit to its own definition.
- **C:** each agent updates its agent-memory pages in gbrain; recurring landmines graduate
  into skills (`evolve-memory`, confidence ≥0.7).
- **D:** for high-risk changes, the risk-evidence chain is completed.
- **E:** resolved predictions (gbrain takes) are scored for calibration (`calibrate` —
  accuracy + Brier), periodically, so stated confidence tracks reality. See
  `calibration.md`.

---

## Three speeds (pick by task size)

Helmsman isn't one-speed. Match the ceremony to the work:

| Speed | When | What happens |
|-------|------|--------------|
| **Full flow** | normal features, anything non-trivial | EXPLORE → PLAN → review → **you approve** → BUILD → … |
| **FAST mode** | medium tasks you're confident about | compress EXPLORE+PLAN into ONE quick spec → **you still approve** → BUILD |
| **Trivial** | <15 lines, no schema/API/auth/RLS | straight to BUILD, no plan |

### FAST mode — the medium lane

Trigger: "fast mode" / "move fast on X" / "quick version of X" (a deliberate ask).

- The builder does a single compressed pass: a few minutes of exploration + a short
  blast-radius spec, in one step instead of separate EXPLORE and PLAN phases.
- **The PLAN→BUILD approval gate is NOT skipped.** You still see the short spec and say
  "build it" before any code is written. FAST trades *phase ceremony* for speed, never
  *your approval*.
- **Never use FAST on high-risk work.** auth / RLS / schema / billing / public API →
  **always full flow** (these need the full plan + review + risk-evidence chain).

## Trivial / question shortcuts

- **Trivial fix** (<15 lines, no schema/API/auth/RLS): orchestrator routes straight to
  the domain builder for BUILD — no full plan.
- **Question / understanding:** routes to `@scout` / `@brain`, or answered directly if
  trivial conceptual.
- **General knowledge / opinion** (not about this repo): orchestrator answers directly —
  no specialist needed (see `iron-law.md`).

## Meta-lane — the harness itself (`@helm`)

Off the main product flow: managing Helmsman + the fleet is its own lane, owned by
`@helm`. "How is Helmsman set up?", "add an agent", "register a gbrain source", "gbrain
doctor", "install into this repo", "restart the daemons" → `@helm`. It edits the SOURCE
repo (`~/workspace/helmsman`), then re-installs to propagate — never hand-edits installed
copies. The orchestrator routes harness *management* to @helm but answers trivial
harness *questions* ("what is the flow?") directly.

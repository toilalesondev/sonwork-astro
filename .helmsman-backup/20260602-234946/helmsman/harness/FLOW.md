# The Helmsman Flow

```
IDEATE → ROUTE → EXPLORE → PLAN → REVIEW-PLAN → BUILD → VERIFY → REVIEW-CODE → SHIP → MONITOR → WRITE-BACK → SELF-REFINE
```

Every arrow is a routing decision made by the orchestrator. Two arrows are **human
approval gates**: PLAN→BUILD and BUILD→WRITE-BACK.

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

### REVIEW-PLAN — domain expert
The plan is reviewed by the matching expert: eng plans → `@eng` plan-eng-review,
design → `@design` plan-design-review, product/scope → `@product` plan-ceo-review,
backend/devex → `@backend`.

**▶ HUMAN GATE:** you say "build it" to proceed.

### BUILD — domain builder
The same builder implements exactly the approved plan. A 50% mid-build check-in on
large work. If stuck, `@ship` (investigate/diagnose) is called to find root cause —
the diagnoser hands the fix boundary back, it does not silently improvise.

### VERIFY — `@ship`
`verify` skill: diff-aware — maps changed files to tests, runs only affected tests,
escalates to full suite on config/high-fan-out changes. Writes `verification.json` on
high-risk paths.

### REVIEW-CODE — `@ship`
`code-review` skill: scouts edge cases FIRST, then reviews the diff — N+1 queries, schema
back-compat, RLS/auth (identity AND permission), races, data leaks. Emits
`review-decision.json` on high-risk paths. Reports; never patches.

### SHIP — `@ship`
ship → land-and-deploy. Branch → PR → merge → deploy.

### MONITOR — `@ship`
canary, benchmark, health. Watches the live deploy against baselines.

### WRITE-BACK — `@brain` (Loop A)
Proposes a numbered list of gbrain writes (pages / facts / takes) + `process/`
archival + backlog capture.

**▶ HUMAN GATE:** you approve the numbered list. Then `@brain` writes gbrain and
regenerates the `process/` projections.

### SELF-REFINE — every agent (Loops B, C, D)
- **B:** if an agent hit a flow failure, it proposes an edit to its own definition.
- **C:** each agent updates its agent-memory pages in gbrain.
- **D:** for high-risk changes, the risk-evidence chain is completed.

---

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

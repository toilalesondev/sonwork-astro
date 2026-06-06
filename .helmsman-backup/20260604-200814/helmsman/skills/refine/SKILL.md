---
name: refine
version: 1.0.0
description: Self-refine (Loop B). When an agent fails in its own domain because its definition lacked something, it proposes a user-approved edit to its own agents/<name>.md. Use after a flow/domain failure to make the agent permanently better at its job.
---

# refine — agent self-refinement (Loop B)

When a specialist fails because its own instructions were missing or wrong, it patches
its own definition. This is how the harness gets better over time, per agent.

## Trigger

A failure attributable to the agent's own definition:
- used the wrong convention because the definition didn't state it
- skipped a required check because the checklist omitted it
- researched/built when it should have routed/handed back

## Procedure

1. **Name the failure** — what went wrong, concretely, and the user-visible impact.
2. **Locate the cause** — which section of `agents/<name>.md` is missing/wrong.
3. **Propose the patch** — a specific diff to the canonical file in the helmsman repo
   (the source of truth, not the installed copy).
4. **User approves** — present the diff; write nothing without approval.
5. **Apply + propagate** — edit the canonical `agents/<name>.md`, commit, then re-run
   `install.sh` in affected projects (or note it propagates on next install).

## B vs C

- **refine (B):** changes the agent's *instructions* — durable, version-controlled
  behavior change.
- **agent-memory (C):** stores *learned facts* in gbrain — recalled at runtime, no
  prompt change.

Use B when the agent should *always* behave differently; C when it should *remember* a
specific fact.

## Mirror discipline

If the patch changes a flow rule (not just a domain detail), check whether `harness/`
docs or the `templates/AGENTS.md.tmpl` need the mirrored edit.

## Operating Rules

Obey `harness/operating-rules.md` (the 6 invariants). Skill-specific output:
- The proposed diff to `agents/<name>.md` + user approval is the artifact; nothing written before approval.

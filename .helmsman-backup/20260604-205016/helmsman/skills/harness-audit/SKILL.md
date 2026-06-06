---
name: harness-audit
version: 1.0.0
description: Mechanical coherence check for the Helmsman harness itself. Owned by @helm. Verifies routing.md <-> agent files <-> AGENTS.md agree, every agent's skills resolve, required sections present (tool grants, tier, domain card, example), roster counts match, and no dangling harness/ references. Catches harness drift before it bites. Use when the user says "audit the harness", "check the harness is coherent", after adding/editing an agent or skill, or before shipping a harness change.
---

# harness-audit — is the harness coherent?

Owned by `@helm`. The harness is `@helm`'s codebase; this is its test suite. Run it after
any harness change (add/edit an agent or skill, edit routing) and before declaring a
harness change done — drift in the harness is silent until something misroutes or a skill
fails to resolve.

## When to run
"audit the harness" / "is the harness coherent" / after adding-or-editing an agent or skill
/ before shipping a harness change / as part of `@helm`'s prove-don't-claim evidence.

## Procedure

Run the audit from the helmsman SOURCE repo root and show the output:
```
node .helmsman/skills/harness-audit/scripts/audit.mjs <repo-root>
```
(In the source repo itself: `node skills/harness-audit/scripts/audit.mjs`.)

It checks:
1. **Routing ↔ agents ↔ AGENTS.md agree** — every agent file is in routing.md AND root
   AGENTS.md; nothing references a `@agent` with no file (old-name aliases excluded).
2. **Skills resolve** — every `skills:` entry in every agent maps to a real `skills/` or
   `skills-vendor/` dir.
3. **Required sections present** — each agent has tool grants (`tools:`), a model-routing
   `tier:`, a "What good looks like" domain card, and a few-shot `## Example`.
4. **Roster count matches** — README's "N specialists" equals the actual agent-file count.
5. **No dangling references** — `harness/*.md` referenced in AGENTS/FLOW/README all exist.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. This is read-only analysis — it reports drift,
it does not fix it (fixing is a separate `@helm` change: edit the SOURCE, re-install,
re-audit). Never claim "harness coherent" without showing the green audit output (Rule 1).

## Evidence (what "done" must show)
The audit's output — green (`OK — N agents coherent…`) or the specific findings list. A
harness change isn't done until the audit is green.

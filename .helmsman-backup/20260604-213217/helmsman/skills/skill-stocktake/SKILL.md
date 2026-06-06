---
name: skill-stocktake
version: 1.0.0
description: >-
  Audit the whole skill set for quality, scope-fit, and overlap — inventory every skill, judge
  each on Scope-fit / Uniqueness / Actionability / Currency, assign a verdict (Keep / Improve /
  Update / Retire / Merge-into-X), and propose splits for over-broad skills. Owned by @helm.
  Use to "stocktake the skills / audit skills / find overlap / are skills too broad", or
  periodically. Retire/Merge/Split require user confirmation — never auto-destructive.
---

# skill-stocktake — the skill quality & separation auditor

The governance that keeps the skill set scope-fit: one skill = one narrow concern the agent can
reach for precisely (the Separation Law, `harness/skill-standard.md`). Owned by `@helm`.
Evaluation is **blind** — the same bar applies to every skill regardless of origin.

## Trigger
- "Stocktake the skills / audit the skills / are any skills too broad / find skill overlap".
- After a `privatize` run (re-audit the whole set), or on a periodic harvest.

## Procedure

### 1. Inventory (scan)
```
node .helmsman/skills/skill-stocktake/scripts/scan.mjs --root <helmsman-root>
```
Reports per skill: lines, declared modes, owning agents, and scope-fit flags (LARGE / MULTIMODE
/ THIN / ORPHAN / MANY-OWNERS / NO-USE-WHEN). Start judgment from the flagged ones.

### 2. Judge each skill on the four dimensions
- **Scope-fit** — name + trigger + content aligned; not too broad/narrow. *Can an agent fully
  utilize it when it needs it, without loading concerns it doesn't?* 3+ distinct jobs (esp. with
  different owners) → too broad. A thin stub duplicating another skill's step → too narrow.
- **Uniqueness** — value not replaceable by another skill / operating-rules / memory.
- **Actionability** — a followable procedure to a proven result, not an essay.
- **Currency** — referenced tools/flags/APIs are current (verify when in doubt).

### 3. Assign one verdict per skill (with a written justification)
- **Keep** — useful, current, scope-fit.
- **Improve** — keep, but specific fixes (name a section to tighten/cut).
- **Update** — referenced tech is stale; refresh it.
- **Retire** — low value / superseded / no unique content (name what covers it now).
- **Merge-into-[X]** — trivially overlaps X (same procedure + a flag); name X.
- **Split-into-[A,B,…]** — fails scope-fit (multiple distinct concerns/perspectives); name the
  single-concern skills it should become + their owning agents.

### 4. Summary table + consolidation
Present: Skill · owners · flags · verdict · one-line reason. **Retire / Merge / Split require
explicit user confirmation** before any file changes (state: what defect, what covers it
instead, the blast radius). Then execute confirmed verdicts (splits per `skill-standard`,
rewire agents, regen catalog, `harness-audit` GREEN).

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Blind evaluation** — same bar for ECC-derived,
privatized, or hand-authored skills; no verdict branching by origin. **Never auto-destroy** —
Retire/Merge/Split need user confirmation. Default toward SEPARATE (Separation Law); a merge
verdict requires *trivial* overlap, not just "related".

## Evidence (what "done" must show)
The scan inventory, the per-skill verdict table with justifications, the confirmed
consolidation actions, and `harness-audit` GREEN after any executed change.

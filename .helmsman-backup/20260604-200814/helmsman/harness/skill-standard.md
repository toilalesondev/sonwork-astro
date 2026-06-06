# Skill Standard — what "a Helmsman skill" is

> Every skill in `skills/` is **first-party**: deep-learned, re-authored in our voice, owned
> by us — never a frozen vendor copy. This file is the canonical shape. The privatization
> program (`process/active/privatize-skills.md`) and the `ingest-skill` capability both
> conform new skills to it. `harness-audit` enforces the mechanical parts.

## Principles

1. **Owned, not borrowed.** A Helmsman skill encodes *our* logic and decision-making for a
   task. We privatize by **understanding** the source, then re-writing — not copying. The
   test: could you defend every step as "why WE do it this way," not "what the upstream said"?
2. **Landmines, not docs (Rule 4).** A skill is the specific gotchas + procedure for one
   task, not a textbook. Shorter and sharper beats comprehensive. If a section isn't earning
   its place, cut it.
3. **One task, one skill.** No overlapping skills that do almost-the-same thing. Aggressive
   curation merges near-duplicates (the keep-set decides this).
4. **Loadable + selectable by a subagent.** Subagents have NO skill tool — a skill is plain
   markdown you `read`. So it must be self-contained and its `description:` must carry a clear
   "Use when…" trigger (that's how an agent PICKS it). See `operating-rules.md` Rule 4.
5. **Mode-aware where it touches memory.** If a skill reads/writes memory, it reads
   `.helmsman/backend` first and works in BOTH standalone (`process/`) and gbrain modes.

## Frontmatter contract (required)

```yaml
---
name: <kebab-case>            # MUST equal the directory name (audit-enforced)
version: <semver>            # e.g. 1.0.0
description: >-              # one paragraph; MUST contain a "Use when …" trigger sentence.
  <what it does>. Owned by @<agent>. Use when <triggers the agent matches on>.
---
```
- `name` == dir name (HARD audit check).
- `description` is the **selection signal** — it feeds `skills/SKILLS.md` and the agent's
  cue. Lead with what it does; end with "Use when …".
- Note the owning `@agent` in the description (informational; the real wiring is the agent's
  `skills:` list).

## Required sections (body)

| Section | Purpose |
|---------|---------|
| `# <name> — <one-line essence>` | Title + a sentence on what it closes/produces. |
| `## Trigger` (or `## When to run`) | The concrete situations to reach for this — the human-readable form of the "Use when". |
| `## Procedure` | The actual steps. Numbered. Mode-aware (`.helmsman/backend`) if it touches memory. This is the value. |
| `## Operating Rules — MANDATORY` | One line binding it to `.helmsman/harness/operating-rules.md` + any skill-specific hard rule (e.g. "never invent a number", "report, never patch"). |
| `## Evidence (what "done" must show)` | The proof obligation — actual output / file:line / read-back, never "it worked". Ties to Rule 1 (prove-don't-claim). |

**Optional (use when they earn their place):** `## Mode` note · `## Example` (one good / one
bad few-shot) · `## Learning loops` (which loop the skill participates in) · a `> Run at the
<tier>` note for evolver-tier skills.

## Structure on disk

```
skills/<name>/
  SKILL.md                 # this standard
  scripts/*.mjs            # optional: deterministic helpers (e.g. a scorer/validator)
  scripts/validate-*.mjs   # optional: a self-test the audit or CI can run
```
- Prefer a **deterministic script** for anything mechanical (scoring, diffing, generation) so
  the skill is reproducible, not vibes. See `calibrate` (`score-takes.mjs`) and `harness-audit`.

## Exemplars (read these before authoring)

- `skills/calibrate/SKILL.md` — clean Trigger → Procedure (mode-aware) → Operating Rules →
  Evidence, with a deterministic script and an honesty gate.
- `skills/harness-audit/SKILL.md` — When-to-run → Procedure → Evidence, script-backed.
- `skills/generate-plan/SKILL.md` — output-location + required-sections discipline.

## What the audit enforces (mechanical floor)

- `name:` == dir name (HARD).
- Every agent that lists the skill carries a when-to-use cue for it (WARN).
- The skill appears in the generated catalog `skills/SKILLS.md` (sync WARN).
- (For our skills) repo copy == machine-global mirrors (drift WARN).

The audit is the floor; this standard is the bar. Pass the audit AND read like an exemplar.

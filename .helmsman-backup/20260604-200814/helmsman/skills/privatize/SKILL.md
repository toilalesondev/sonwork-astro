---
name: privatize
version: 1.0.0
description: >-
  Turn ANY external skill repo into great, native Helmsman skills. Studies each incoming
  skill, extracts its real logic (sheds framework scaffolding), merges near-duplicates,
  re-authors lean to harness/skill-standard.md, and wires it to the right agent. Owned by
  @helm. Use when the user drops in a new skill repo/folder ("privatize this repo",
  "ingest these skills", "make these ours", "learn this skill pack"), or to re-privatize an
  updated upstream. Autonomous by default: privatize the whole repo, then report.
---

# privatize — make any skill repo natively Helmsman's

The standing pipeline. You point it at a repo of skills; it produces **privatized,
de-bloated, agent-wired, audited** Helmsman skills. Repeatable for every new repo. Owned by
`@helm`. Absorbs the old `write-a-skill` / `skillify` / `find-skills` primitives.

> **Why privatize, not vendor:** external skills are mostly *their framework's* scaffolding
> (preamble, telemetry, voice, plan-mode, config reads) wrapped around a small logic core.
> Helmsman already supplies all that centrally (operating-rules, hooks, load-path, selection).
> So we keep the **logic**, drop the scaffolding, and re-author lean in our voice. Proven on
> gstack: `ship` was 3082 lines, ~70% framework boilerplate; the real procedure was ~150.

## Trigger
- "Privatize / ingest / learn this skill repo: `<url-or-folder>`."
- "Make these skills ours." / "Adopt this skill pack."
- An upstream we already privatized shipped updates → re-run to re-privatize the deltas.

## Inputs
- A **git URL** (clone to a temp dir first) OR a **folder** of `<name>/SKILL.md`.
- Examples on this machine: `skills-vendor/`, `~/gstack/.opencode/skills/`.

## Procedure (the 5-step loop)

### 1. INTAKE — inventory from data, not eyeballing
```
node .helmsman/skills/privatize/scripts/intake.mjs <source-dir> --root <helmsman-root>
```
Reports per incoming skill: lines, framework-ref count, tool-coupling (browser/ios/etc.),
collision with skills we already own, and description. Read it before triaging.

### 2. TRIAGE — one verdict per incoming skill
Judge each by the prime filter: **"does owning this make a Helmsman agent more efficient?"**
- **KEEP** — real, distinct logic an agent needs → privatize as its own skill.
- **MERGE → X** — near-duplicate / a mode of an existing skill → fold into X (e.g. 8
  `understand-*` → one `understand`; `qa`+`qa-only` → `qa` with a report|fix mode).
- **OURS-BETTER** — we already own a stronger equivalent → drop the incoming, maybe steal one idea.
- **DROP** — pure framework plumbing, telemetry, or capability we don't need.
Record the verdict table — it's the report-after artifact.

### 3. PRIVATIZE — deep-learn, then re-author lean (per KEEP/MERGE)
For each kept skill:
1. **Read it fully** + understand the *actual procedure* (ignore the scaffolding).
2. **Extract the logic core** — the steps that ARE the skill. Discard: preamble, telemetry,
   voice, plan-mode, config reads, skill-routing, writing-style, question-tuning, footers.
3. **Re-author** to `harness/skill-standard.md` in our voice: frontmatter (`name`==dir,
   `description` with a "Use when…" trigger) + `## Trigger` · `## Procedure` · `## Operating
   Rules — MANDATORY` · `## Evidence`.
4. **Tool-coupled skills → tool-aware:** keep the logic; call the external tool **when
   present**, degrade gracefully when not (state the dependency honestly). Owning the tool
   itself (e.g. a browser driver) is a SEPARATE decision — privatize the logic now regardless.
   If the capability can't be exercised in this environment (e.g. iOS needs a device), mark it
   **dormant** in the skill — never claim it tested (Rule 1).

### 4. INTEGRATE — wire it to the agent
- Add the skill to the owning agent's `skills:` list + a one-line **when-to-use cue**.
- Regenerate the catalog: `node .helmsman/skills/harness-audit/scripts/gen-catalog.mjs <root>`.
- Run `node .helmsman/skills/harness-audit/scripts/audit.mjs <root>` → must be **GREEN**.

### 5. PROVE & REPORT (report-after, since runs are autonomous)
- Per privatized skill: it `read`s cleanly, an owning agent lists+cues it, audit GREEN.
- Emit a summary: the TRIAGE table (KEEP/MERGE/OURS-BETTER/DROP + line-before→after) so the
  user reviews the finished batch. Everything is in git → reversible if the user dislikes a call.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Privatize = re-author from understanding, never
copy.** Keep ALL capability (tool skills become tool-aware, not dropped). Never claim a
dormant/untestable capability is tested. Edit SOURCE, never installed copies; propagate via
`install.sh`. Autonomous runs still leave a reversible git trail + a report.

## Evidence (what "done" must show)
The INTAKE report, the TRIAGE verdict table, the new/merged skill files (`wc -l` before→after
showing the de-bloat), the owning-agent wiring (`skills:` + cue), catalog regen, and
`harness-audit` GREEN. For dormant capabilities, the explicit "not exercisable here" note.

## Example
**Good:** `privatize ~/gstack/.opencode/skills` → INTAKE (52 skills, 30 large) → TRIAGE (keep
tdd/cso/understand-merge, drop telemetry/plan-tune) → privatize `ship` 3082→~160 lines (logic
only, deploy-tool-aware) → wire to @ship + cue → catalog + audit GREEN → report the table.

**Bad:** copy `ship`'s 3082 lines into `skills/ship/` unchanged. ❌ That's vendoring, not
privatizing — keeps the framework tax, isn't ours, drifts.

## Learning loops
Feeds Loop C (recurring privatization patterns graduate into this skill's heuristics) and is
the mechanism behind the "owns its skills" identity. Re-run on any upstream update.

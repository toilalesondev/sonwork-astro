---
name: to-issues
version: 1.0.0
description: >-
  Break a plan / spec / PRD into independently-grabbable issues using tracer-bullet vertical
  slices, published to the project issue tracker. Owned by @eng (shared with @product). Use to
  convert a plan into implementation tickets / break work into issues.
---

# to-issues — vertical slices, not horizontal layers

Turn a plan into **tracer-bullet** issues: each a thin slice cutting end-to-end through ALL
layers (schema→API→UI→tests), independently demoable. (Tracker + label vocab live in the
project's AGENTS.md, set up by `onboard-project` — our one memory.)

## Trigger
- "Break this into issues", "convert the plan to tickets", "make implementation issues".

## Procedure
1. **Gather context** — from the conversation; if given an issue ref, fetch its full body + comments.
2. **Explore** (if needed) — issue titles/descriptions use the domain glossary; respect ADRs.
3. **Draft vertical slices** — each delivers a narrow but COMPLETE path through every layer;
   demoable/verifiable on its own; prefer many thin slices over few thick ones. Mark each
   **HITL** (needs human: architecture/design decision) or **AFK** (implementable + mergeable
   unattended) — prefer AFK.
4. **Quiz the user** — present a numbered list (Title · Type HITL/AFK · Blocked-by · user stories
   covered). Ask: granularity right? dependencies correct? merge/split any? HITL/AFK correct?
   Iterate to approval.
5. **Publish** in dependency order (blockers first, so "Blocked by" references real ids), with the
   ready-for-agent label. Issue body: **Parent** (if any) · **What to build** (end-to-end
   behaviour, no file paths/snippets except decision-encoding ones) · **Acceptance criteria**
   (checklist) · **Blocked by**. Don't close/modify the parent.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Vertical slices only (a slice spans all layers, never
one layer). Prefer AFK over HITL. Get user approval on the breakdown before publishing.

## Evidence (what "done" must show)
The approved slice list + the published issues (urls/ids) in dependency order with correct
HITL/AFK + labels.

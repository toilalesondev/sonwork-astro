---
name: document-release
version: 1.0.0
description: >-
  Post-ship documentation sync — cross-reference the diff against all project docs, update
  README/ARCHITECTURE/CONTRIBUTING/AGENTS.md to match what shipped, polish the CHANGELOG, surface
  doc debt. Owned by @ship. Use to "update the docs / sync documentation / post-ship docs" after a merge.
---

# document-release — make the docs match what shipped

Keep docs honest after code lands. Owned by `@ship`. (To author docs from scratch, see
`document-generate`.)

## Trigger
- "Update the docs / sync documentation / post-ship docs", after a PR merges or code ships.

## Procedure
1. **Read the diff + the docs** — what changed in code vs what the docs claim.
2. **Coverage map (Diataxis)** — reference / how-to / tutorial / explanation: where does the
   change need doc updates? Flag gaps.
3. **Update** README / ARCHITECTURE / CONTRIBUTING / AGENTS.md / CLAUDE.md to match reality.
   Detect architecture-diagram drift.
4. **CHANGELOG** — polish the entry in the repo's voice (sell-test: would a user get what changed?).
5. **Surface doc debt** — list what's still stale/missing in the PR body or an issue; clean up
   stray TODOs; optionally bump VERSION.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Docs must match what actually shipped — never document
intent as if done. Surface remaining doc debt honestly rather than papering over it.

## Evidence (what "done" must show)
The docs updated (files + what changed), the Diataxis coverage map, the polished CHANGELOG entry,
and the listed remaining doc debt.

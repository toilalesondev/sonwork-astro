---
name: handoff
version: 1.0.0
description: >-
  Compact the current conversation into a handoff document so a fresh agent/session can continue
  the work. Owned by @chief. Use to "hand off / write a handoff / pass this to another session",
  or before a context reset. Aligns with harness/handoff.md (relay/packet/status).
---

# handoff — package the work for the next session

Write a durable handoff so a fresh agent picks up with zero loss. Owned by `@chief`. See
`.helmsman/harness/handoff.md` for the relay/packet/status model.

## Trigger
- "Hand off / write a handoff / pass this to another session", or before a context reset.

## Procedure
1. **Summarize the state** — goal, what's done, what's in progress, what's blocked, key decisions,
   next steps, critical context.
2. **Reference, don't duplicate** — point to existing artifacts (PRDs, plans in `process/active/`,
   ADRs, issues, commits, diffs) by path/URL rather than re-pasting them.
3. **Suggested skills** — list the skills the next agent should load for the continuation.
4. **Redact** — strip API keys, passwords, PII.
5. **Save** to the OS temp dir (not the workspace), and — when gbrain is the backend — also store
   it as a recallable page so a fresh session can find it without the file.
6. **Tailor** to the next session's focus if the user described it.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Redact secrets/PII.** Reference artifacts by
path/URL — don't duplicate content already captured elsewhere. Save outside the workspace.

## Evidence (what "done" must show)
The handoff doc (path, + gbrain page slug in gbrain mode) with goal/progress/decisions/next-steps/
suggested-skills, secrets redacted, artifacts referenced not duplicated.

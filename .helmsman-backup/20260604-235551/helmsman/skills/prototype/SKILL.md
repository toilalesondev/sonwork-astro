---
name: prototype
version: 1.0.0
description: >-
  Build a throwaway prototype to answer ONE design question before committing. Two branches —
  a runnable terminal app for state/logic questions, or several toggleable UI variations for
  look-and-feel. Owned by @eng. Use when the user wants to prototype, sanity-check a data
  model / state machine, mock up a UI, explore options, or says "let me play with it".
---

# prototype — throwaway code that answers a question

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Trigger
- "Prototype this", "sanity-check this state model", "let me play with it", "try a few designs",
  "what should this look like".

## Procedure

### 1. Pick the branch (the question decides)
- **"Does this logic / state model feel right?"** → a tiny interactive **terminal app** that
  pushes the state machine through cases hard to reason about on paper.
- **"What should this look like?"** → several **radically different UI variations** on a single
  route, switchable via a URL search param + a floating switcher bar.

Getting the branch wrong wastes the whole prototype. If genuinely ambiguous and the user's away,
default by surrounding code (backend module → logic; page/component → UI) and state the assumption
at the top of the prototype.

### 2. Build it — rules for both branches
1. **Throwaway from day one, clearly marked.** Locate it next to the module/page it prototypes
   (context is obvious) but name it so a casual reader sees it's a prototype, not production.
   Follow the project's existing routing/task conventions; don't invent new top-level structure.
2. **One command to run** (whatever the project's task runner uses) — startable without thinking.
3. **No persistence by default** — state in memory (persistence is what you're *checking*). If the
   question needs a DB, use a scratch one named "PROTOTYPE — wipe me".
4. **Skip the polish** — no tests, no abstractions, only enough error handling to make it runnable.
5. **Surface the state** — after every action (logic) or variant switch (UI), render the full
   relevant state so the user sees what changed.
6. **Delete or absorb when done** — don't leave it rotting in the repo.

### 3. Capture the answer
The *answer* is the only thing worth keeping. Record it durably (commit message, ADR, issue, or a
`NOTES.md` next to the prototype) with the question it answered — then delete or fold the
validated decision into real code.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. A prototype is throwaway by definition — never let it
harden into production. Capture the answer before deleting.

## Evidence (what "done" must show)
The one-command run, the surfaced state (logic) or the switchable variants (UI), and the captured
answer (where it was recorded). Confirmation the throwaway was deleted or explicitly absorbed.

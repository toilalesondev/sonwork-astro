---
name: onboard-project
description: Conversational, logic-oriented project setup for Helmsman. Owned by @helm. Asks about the project in plain language, deep-scans the codebase, fills process/context/ local memory with REAL content, registers the gbrain source, and writes the per-project AGENTS.md. Use when setting up Helmsman in a new project, "onboard this project", "set up the harness here", or after install.sh on a fresh repo.
---

# onboard-project — set up Helmsman in a project (non-coder friendly)

Owned by `@helm`. One guided flow takes a repo from "harness files installed" to "harness
actually knows this project." Logic-oriented: ask in plain language, report in outcomes.

## When to run
After `install.sh` lands the harness in a repo, or when the user says "onboard this
project" / "set up the harness here." Safe to re-run (never clobbers good content).

## Procedure (each step shows the user what you found, waits for confirmation)

### 1. DETECT (read-only)
Scan the repo: language(s), framework, package manager, monorepo layout, test framework,
database/auth, existing `process/`, existing `AGENTS.md`/`CONTEXT.md`. Use read/grep/glob
only. **Do not write yet.**

### 2. SHOW WHAT YOU FOUND
Summarize detection in plain language. If there's existing context or a good AGENTS.md,
say what's there and what could improve. **Wait for the user to confirm** before continuing.

### 3. ASK ABOUT THE PROJECT (a real conversation, not a checklist)
In plain words: what is this? who uses it? what matters? what's the stack you care about?
Ask follow-ups on anything vague. Summarize your understanding back and confirm it.
(Translate any code-jargon into plain terms — the user may not be technical.)

### 4. SCAFFOLD (with approval)
Create `process/{active,completed,backlog}/` and `process/context/all-context.md` from the
template. If `process/` already exists, show planned changes and wait — never silently
move or delete the user's files.

### 5. FILL LOCAL MEMORY (Tier 1)
Populate `process/context/all-context.md` with REAL content from the scan + what the user
told you: project one-liner, stack + versions, key patterns/conventions, import aliases,
env var names (NOT values), routes, schema shape, test setup. Promote a domain to its own
pack (`process/context/<domain>/all-<domain>.md`) when it has 3+ durable docs. **No
placeholder text** — only real content. (See `.helmsman/harness/context-routing.md`.)

### 6. REGISTER gbrain SOURCE (Tier 2, if gbrain present)
`gbrain sources add <id> --path <repo>` (isolated by default), then
`gbrain sync --source <id>`. **Never** bare `gbrain sync --repo` (it repoints default).
If gbrain isn't installed, say so — Tier 1 local memory works without it (clone-and-go).

### 7. WRITE per-project AGENTS.md (only if absent — never clobber)
From `templates/AGENTS.md.tmpl`, fill the placeholders with what you learned:
PRIMARY_BUILDER, CODE_INDEXING (+reason), PROJECT_TYPE, and the Brain config block
(GBRAIN_SOURCE, BRAIN_REPO, EMBEDDING_PROVIDER, CHAT_PROVIDER). If AGENTS.md exists, leave
it and tell the user what to merge.

### 8. VALIDATE + REPORT
Confirm: process/ scaffolded, all-context.md has real content, source registered (or
"no gbrain — local-only"), AGENTS.md written/left. Report as outcomes:
"This project is now onboarded — Helmsman knows it's a <X> app, memory is wired
(<local-only | local + gbrain>), and you can start by saying what you want."

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Prove each step (show the file written, the
`gbrain sources list` line). Never claim onboarded without the evidence. Ask, don't
assume — especially with a non-coder; one plain-language question beats a wrong guess.

## Evidence (what "done" must show)
- `process/context/all-context.md` with real (non-placeholder) content — paste the head.
- `gbrain sources list` showing the new source (or an explicit "gbrain not installed").
- The per-project AGENTS.md path (written or intentionally left).

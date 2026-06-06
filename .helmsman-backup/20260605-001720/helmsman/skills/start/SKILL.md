---
name: start
version: 1.1.0
description: Begin-of-session ritual, mode-aware. Gets you current before you work — in gbrain mode it pulls+reconciles the shared brain; in standalone mode it just reads process/. Then restores your last working context so you pick up where you left off. Use when the user says "start", "/start", "begin", "what was I doing", or sits down to work. Pair with /done.
---

# start — begin-session ritual (mode-aware)

One command to get current before you work. Read `.helmsman/backend` to pick the sync step.

## Procedure

### 1. Get current (mode-aware)

**standalone mode** — no external brain; just read the local truth:
```bash
git pull --rebase 2>/dev/null || true   # if this repo has a remote
# then read process/context/all-context.md + process/active/ (recall = read files)
```

**gbrain mode** — pull + reconcile the shared brain so the file-plane git copy + DB are current:
```bash
bash brain-sync.sh start
# fallback: cd "$BRAIN_REPO" && git pull --ff-only && gbrain sync --source default
```
Idempotent. NEVER run bare `gbrain sync --repo` (the script scopes `--source default`).

### 2. Restore working context (both modes)
Invoke the **context-restore** skill (or read the most recent context-save state) to
reload git state, decisions, and remaining work from your last session. Across machines,
restore the most recent state across all branches.

### 3. Orient (1-line summary)
Tell the user, briefly:
- what changed (gbrain: commits behind → now current; standalone: latest process/ state), and
- where they left off (restored context: branch, last task, next step).

## Rules

- NEVER run bare `gbrain sync --repo` (gbrain mode) — the script scopes `--source default`.
- Reading knowledge needs no sync; this ritual keeps things current + resumes context.
  Standalone mode never touches gbrain.
- This is the mirror of **/done** (the end-of-session ritual). Suggest /done when wrapping up.

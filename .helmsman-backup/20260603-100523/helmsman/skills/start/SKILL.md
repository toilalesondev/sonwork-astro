---
name: start
version: 1.0.0
description: Begin-of-session ritual for a shared cross-machine brain. Pulls the brain repo, reconciles it into the DB, then restores your last working context so you pick up exactly where you left off. Use when the user says "start", "/start", "start my session", "begin", "sync the brain first", "what was I doing", or sits down to work on a machine that shares the brain DB. Pair with /done at the end.
---

# start — begin-session ritual

One command to get current before you work. The brain knowledge lives in a shared
Supabase DB (always live), but the file-plane git copy can drift between machines and
your last session's working state needs restoring. This does both.

## Procedure

### 1. Pull + reconcile the brain
Run the bundled script from the helmsman repo root:
```bash
bash brain-sync.sh start
```
This does `git pull --ff-only` on the brain repo (resolved from `$BRAIN_REPO`, else the
default-source path on this machine) then `gbrain sync --source default` to reconcile
files → DB. Idempotent.

If `brain-sync.sh` isn't on this machine, fall back to:
```bash
cd "$BRAIN_REPO" && git pull --ff-only && gbrain sync --source default
```

### 2. Restore working context
Invoke the **context-restore** skill (or read the most recent context-save state) to
reload git state, decisions made, and remaining work from your last session. If the user
works across machines, restore the most recent state across all branches.

### 3. Orient (1-line summary)
Tell the user, briefly:
- what the brain pull changed (commits behind → now current), and
- where they left off (restored context: branch, last task, next step).

## Rules

- NEVER run bare `gbrain sync --repo` — the script scopes `--source default`.
- Reading knowledge needs no sync; this ritual is for keeping the git copy current +
  resuming context. Don't block the user if `gbrain` is absent — git pull still runs.
- This is the mirror of **/done** (the end-of-session ritual). Suggest /done when wrapping up.

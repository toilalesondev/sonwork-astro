---
name: done
version: 1.1.0
description: End-of-session ritual, mode-aware. Chains write-back (capture) then publishes — in gbrain mode it syncs the shared brain repo so other machines see it; in standalone mode it just commits process/. The agent that did the work proposes knowledge to remember (you approve), then it's persisted. Use when the user says "done", "/done", "I'm finished", "wrap up", "save my work", "sync what I did", or finishes a work session. Pair with /start.
---

# done — end-session ritual (mode-aware)

One command to wrap up: remember what you did, then persist it. Read `.helmsman/backend`
to pick the persist step.

## Procedure

### Phase 1 — Capture knowledge (write-back, Loop A) — BOTH modes
Run the **capture** skill (the agent that did the work; @helm in curation):
- Analyze the session: decisions, non-obvious behavior, bugs fixed, patterns, plan status.
- Propose a NUMBERED list of writes — nothing written yet.
- User approves; the agent writes each + verifies by read-back (gbrain `get` OR file
  re-read, per mode), regenerates the `process/` ledger. (capture is itself mode-aware.)

Skip Phase 1 only for trivial work (typos, copy, config bumps).

### Phase 2 — Persist (mode-aware)

**standalone mode** — `process/` IS the durable memory; just version it:
```bash
git add -A && git commit -m "process: <one-line summary of the session>"
# (push to your own repo's remote if you have one — there is NO separate brain repo)
```

**gbrain mode** — after the writes land in the DB, publish the file-plane git copy so other
machines get it:
```bash
bash brain-sync.sh end "brain: <one-line summary of the session>"
# fallback: cd ~/gbrain-shared && git add -A && git commit -m "brain: ..." && git pull --ff-only && git push
```
NEVER run bare `gbrain sync --repo` (the script scopes `--source default`).

### Phase 3 — Confirm
Tell the user what was captured (Phase 1) and where it persisted (Phase 2): "committed to
process/" (standalone) or "pushed to the shared brain — other machines see it on /start" (gbrain).

## Conflict handling (gbrain mode — same brain page edited on both machines)

If Phase 2's pull hits a merge conflict on a page file:
1. Resolve the conflict in the markdown file.
2. `git -C <brain-repo> commit` then `gbrain sync --source default` (reconcile DB).
3. `git push`.

gbrain writes are slug-addressed + idempotent — re-syncing after a merge is safe.

## Rules

- Phase 1 before Phase 2: write knowledge to the DB FIRST, then push the git copy that
  contains it. Pushing before capturing publishes a stale repo.
- NEVER run bare `gbrain sync --repo` — the script scopes `--source default`.
- This is the mirror of **/start** (begin-session). Suggest /start next time they sit down.

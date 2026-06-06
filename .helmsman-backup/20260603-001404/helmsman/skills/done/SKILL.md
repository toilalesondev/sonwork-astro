---
name: done
description: End-of-session ritual for a shared cross-machine brain. Chains write-back (capture) and brain-repo sync — @brain proposes knowledge to remember (you approve, it writes to gbrain), then commits + pulls + pushes the gbrain-shared repo so the other machine sees it. Use when the user says "done", "/done", "I'm finished", "wrap up", "save my work", "sync what I did", "push the brain", or finishes a work session. Pair with /start at the beginning.
---

# done — end-session ritual

One command to wrap up: remember what you did, then publish it. Two phases — knowledge
first (the content), then the git push (the plumbing).

## Procedure

### Phase 1 — Capture knowledge (write-back, Loop A)
Run the **capture** skill (owned by `@brain`):
- Analyze the session: decisions, non-obvious behavior, bugs fixed, patterns, plan status.
- Propose a NUMBERED list of gbrain writes (pages/facts/takes) — nothing written yet.
- User approves; `@brain` writes each and verifies with `gbrain get`, regenerates the
  `process/` ledger.

Skip Phase 1 only for trivial work (typos, copy, config bumps) — then it's just Phase 2.

### Phase 2 — Sync the brain repo
After the writes land in the DB, publish the file-plane git copy so other machines get it:
```bash
bash brain-sync.sh end "brain: <one-line summary of the session>"
```
This commits the brain repo, pulls (to catch the other machine), then pushes. If
`brain-sync.sh` isn't present:
```bash
cd ~/gbrain-shared && git add -A && git commit -m "brain: ..." && git pull --ff-only && git push
```

### Phase 3 — Confirm
Tell the user: how many pages/facts were written (Phase 1) and that the brain repo is
pushed (Phase 2) so their other machine will see it on `/start`.

## Conflict handling (same brain page edited on both machines)

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

---
name: brain-sync
version: 1.0.0
description: Keep the shared gbrain brain in step across machines (VPS ⇄ Mac). Run at the START of a session to pull the brain repo + reconcile the DB, and at the END to commit + push. Use when the user says "sync the brain", "pull the brain", "start my session", "push the brain", "save the brain", or works across two machines on the same Supabase brain. Knowledge in the DB is already live/shared — this keeps the file-plane git copy from drifting.
---

# brain-sync — cross-machine brain ritual

The agent knowledge lives in a **shared Supabase DB** (live on every machine — no sync
needed to READ it). The brain ALSO has a file-plane git copy (`gbrain-shared`). That git
copy is the only thing that can drift between machines. This skill keeps it in step.

## Mental model (state this if the user is confused)

| Layer | Synced how |
|-------|-----------|
| Knowledge in the DB (what `gbrain query` returns) | Automatic — same Supabase DB, always live |
| The brain repo files (`gbrain-shared`) | git pull/push — this skill |
| Project code repos | normal git |

## The ritual

Run the bundled script from the helmsman repo root.

**Start of session** (pull other machine's pages + reconcile into DB):
```bash
bash brain-sync.sh start
```

**End of session** (commit + pull-before-push + push):
```bash
bash brain-sync.sh end "brain: <what changed>"
```

**Check drift without changing anything:**
```bash
bash brain-sync.sh status
```

Config via env: `BRAIN_REPO` (default `~/gbrain-shared` or `/srv/gbrain-shared`),
`BRAIN_SOURCE` (default `default`).

## Conflict handling

Pages are separate markdown files keyed by slug, so two machines editing *different*
pages never conflict. If both edited the **same** page:
1. `brain-sync.sh end` will stop on the failed pull (merge conflict on that file).
2. Resolve the conflict in the file normally.
3. `git -C <brain-repo> commit` then `gbrain sync --source default` to reconcile the DB.
4. `git push`.

gbrain writes are slug-addressed and idempotent — re-syncing after a merge is always safe.

## Rules

- NEVER run bare `gbrain sync --repo <path>` — it repoints the `default` source. The
  script always scopes with `--source`.
- Reading knowledge needs NO sync — don't run this just to query; only to keep the git
  copy current or to publish new pages.
- One sync-owner per CODE source (see MACBOOK-SETUP.md hygiene); this skill is for the
  brain repo (`gbrain-shared`), which both machines push/pull.

---
name: gbrain-upgrade
description: >-
  Owned by @helm. Adapt the fleet to a new gbrain release WITHOUT a patch
  treadmill. Helmsman runs STOCK gbrain; our fixes live as upstream PRs. This
  skill checks which PRs merged, upgrades to official, verifies the brain, and
  reports the remaining delta. Use when asked to "upgrade gbrain", "adapt to new
  gbrain", "check gbrain version", or after an upstream release. NOT for product
  code — this is fleet/engine maintenance.
---

# gbrain-upgrade — keep gbrain current, stay un-forked

## The model (read first)

Helmsman depends on **stock official gbrain + DB-resident config** — NOT a patched
binary. Any fix we need is an **upstream PR**. When a PR merges, the next official
upgrade carries it and we drop our local copy. The harness never long-term-forks the
binary.

The single source of truth for our current delta from official is the gbrain page
**`fleet/gbrain-local-patches`** (default source). Read it first — it lists every
fix, its PR number, and "drop when merged."

## What lives where (so an upgrade never destroys our setup)

| Concern | Home | Survives `gbrain upgrade`? |
|---------|------|----------------------------|
| Sources + `local_path` | `sources` table (DB) | ✅ yes |
| `federated_read` (Robin = all sources) | `oauth_clients` table | ✅ yes |
| `schema_pack`, `sync.repo_path`, `models.tier.subagent` | `config` table | ✅ yes |
| Crons (`*/15` sync --all, autopilot, weekly doctor) | crontab + `~/.gbrain/*.sh` | ✅ yes (PATH-resolved) |
| Bug fixes (call-graph, write-through, doctor checks) | **upstream PRs** | ✅ once merged |
| 9router gateway | host config (NOT a gbrain patch) | ✅ yes |

A binary upgrade only swaps the binary. None of the above is in the binary, so the
fleet's structure is upgrade-proof by construction.

## The runbook

### 1. Check the delta — which of our PRs merged?
For each PR in `fleet/gbrain-local-patches`:
```
gh pr view <N> --repo garrytan/gbrain --json state,title
```
A PR now `MERGED`/`CLOSED-merged` → that fix is in official → it becomes **drop-able**.

### 2. Decide whether to cut to official
- If **all load-bearing PRs merged** (especially #1723 call-graph) → safe to cut to official, no capability loss. Proceed.
- If some are still OPEN and you NEED them live → stay on the current fork-build for now (re-run this skill after they merge). We accept waiting (no bridge-build).

### 3. Upgrade official + make it the active binary
```
gbrain upgrade                 # self-updates ~/.bun/bin (detects bun/binary install)
# or: bun install -g github:garrytan/gbrain@latest
```
Make official win PATH (it's first in PATH for crons already via ~/.bun/bin).
Retire the fork-build but KEEP a backup:
```
mv ~/.local/bin/gbrain ~/.local/bin/gbrain.bak-$(date +%Y%m%d)   # only when cutting to official
```
(Root `/usr/local/bin/gbrain` needs `sudo`; PATH prefers `~/.bun/bin` so usually skip.)

### 4. Restart the MCP serve so tools use the new binary
```
kill <pid on :3131>; nohup gbrain serve --http --port 3131 --bind 0.0.0.0 --enable-dcr &
```
(Hermes reconnects automatically — same endpoint/port/auth.)

### 5. VERIFY (prove-don't-claim — never report success without these)
```
gbrain doctor                                   # expect 0 FAIL
gbrain sources status                           # all sources healthy, recent sync
gbrain query "<cross-project term>" --source __all__   # cross-source linking works
gbrain dream --source <one source>              # cycle completes (exit 0, 0 ✗)
gbrain code-callers <symbol> --source <code-repo>   # call-graph (if #1723 merged)
```
If any check regresses, roll back: `cp ~/.local/bin/gbrain.bak-* ~/.local/bin/gbrain` + restart serve.

### 6. Update the tracker
Edit `fleet/gbrain-local-patches`: mark merged PRs as dropped; update "Running" binary line.

## Landmines (learned the hard way — do NOT repeat)
- **Never hardcode a gbrain binary path in crons.** `autopilot-run.sh` once pinned `~/.local/bin/gbrain` and would break on the official switch. Use PATH-resolved `gbrain`.
- **`sync --all` is incompatible with `--skip-failed`.** The `*/15` cron must be `sync --all --parallel 4 --workers 4` (no `--skip-failed`).
- **`sync.repo_path` is one global, last-writer-wins.** A bare `gbrain sync <dir>` flips it. Keep it at `/srv/gbrain-shared`. (PR #1771 makes write-through ignore it per-source — once merged, this matters less.)
- **`schema_pack` must be set in the DB config table**, not just the file, or doctor reads the stale bundled pack.
- **Per-source `config` JSONB can corrupt to an array** on older binaries (`updateSourceConfig` double-encode) → `last_full_cycle_at` unreadable → `cycle_freshness` false-FAIL. Fixed in official; repair with a `jsonb_object_agg` collapse if seen.

## Evidence / Landmine / On-failure
- **Evidence:** paste the §5 verify output (doctor score, sources status, cross-source query hit) — never claim "upgraded" without it.
- **Landmine:** the cron-path + flag landmines above; the deferred-cut decision (don't cut to official before load-bearing PRs merge).
- **On failure:** roll back to the `.bak` binary, restart serve, re-run doctor; record what regressed in `fleet/gbrain-local-patches`.

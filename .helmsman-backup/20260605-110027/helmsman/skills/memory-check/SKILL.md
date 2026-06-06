---
name: memory-check
version: 1.0.0
description: >-
  360° health test for the memory + learning layer — recording integrity, gbrain query
  efficiency, effectiveness (recall-precision / coverage / loop-yield), skill↔agent↔memory
  linkage, the 5 loops, and the cross-session flywheel, in both backends. Owned by @helm. Use
  to "test the memory / check the brain health / are the loops working / is recall good", or as
  a standing dev test after any memory/skill/loop change.
---

# memory-check — does the memory + learning layer actually work?

The standing test for the intelligence layer (beyond the structural `harness-audit`). Owned by
`@helm`. Re-run after any change to skills, loops, or memory — it tracks memory health over time
the way `calibrate` tracks bet accuracy.

## Trigger
- "Test the memory / check brain health / are the loops working / is recall good/fast / 360 memory test".
- After any memory/skill/loop change; on a periodic harvest.

## Procedure
1. **Run it** (defaults to the active backend from `.helmsman/backend`):
   ```
   node .helmsman/skills/memory-check/scripts/memory-360.mjs --root <root> --source <id> [--flywheel]
   ```
   Add `--flywheel` for the learn→recall cross-session demo; `--backend file|gbrain` to force a mode;
   `--json` for machine output.
2. **Read the 6 dimensions** — recording integrity (stale-page detection, freshness), query
   efficiency (latency p50), effectiveness (recall-precision, loop-yield), linkage (skills/agents →
   memory), loops (A/B/C/E + adherence run), flywheel (learn→recall).
3. **Act on FAILs/WARNs** — most common: **stale gbrain index** (semantic queries return deleted
   paths) → fix with `gbrain reindex-code --source <id> --yes` (NEVER bare `gbrain sync --repo` —
   footgun that repoints default). Re-run to confirm before→after.
4. **Run both backends** when proving dual-mode: `--backend file` and `--backend gbrain`.
5. **Record** the report to the brain (`<source>/memory-360-report`) so trends are trackable.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. Read-only EXCEPT the optional `--flywheel` scratch
page (created + deleted) — it never touches the gbrain index (reindex is an explicit operator
step). Report real numbers (latency, recall %), never claim "memory healthy" without the run.
gbrain ops stay `--source <id>` scoped; never bare `--repo`.

## Evidence (what "done" must show)
The 6-dimension report with real metrics (latency p50, recall-precision N/total, loop-yield
counts), the FAIL/WARN list, and — when a fix is applied — the before→after comparison proving it.

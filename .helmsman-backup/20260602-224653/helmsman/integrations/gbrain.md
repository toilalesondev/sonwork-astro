# gbrain integration

## Version policy (read first)

Helmsman runs **stock / official gbrain** and stays version-agnostic. Any fix we need
goes **upstream as a PR**; the binary is **never long-term-forked**. When a PR merges,
the next `gbrain upgrade` carries it and we drop our local copy.

- Adapt to any gbrain release with the **`@helm` skill `gbrain-upgrade`** — it checks
  which of our PRs merged, upgrades official, verifies the brain, and reports the
  remaining delta.
- The living delta (our fixes vs official, with PR numbers) lives in the gbrain page
  **`fleet/gbrain-local-patches`**.
- Helmsman's per-project structure (sources, `federated_read`, `schema_pack`,
  `sync.repo_path`, crons) is **DB/config-resident** — a binary upgrade never disturbs
  it. The harness depends on stock gbrain + that config, not a patched binary, so it
  stays portable across any agent host.
- Host gateways (e.g. a local LLM router) are **host config, not gbrain patches** —
  unrelated to Helmsman.

Helmsman uses gbrain as its single memory layer. Agents reach gbrain two ways:

- **MCP tools** (preferred in-agent): `gbrain_query_ide`, `gbrain_get_page_ide`,
  `gbrain_put_page_ide`, `gbrain_code_blast_ide`, `gbrain_extract_facts_ide`, etc.
- **CLI** (`gbrain ...`): for batch ops, sync, import, doctor.

Both are configured globally (MCP server in the agent host's settings). No per-project
plugin install is required — gbrain is ambient.

## Memory contract

| Phase | gbrain action |
|-------|---------------|
| EXPLORE / start of work | `gbrain query` / `gbrain code-refs` to load context |
| WRITE-BACK (Loop A) | `gbrain put` / facts / takes (user-approved), verified with `gbrain get` |
| Agent memory (Loop C) | read/write `agent-memory/<name>/...` pages |

## Page slug conventions

```
projects/<project>/<area>/<topic>     durable project knowledge
agent-memory/<agent>/<topic>          per-agent learned facts (Loop C)
```

Examples:
- `projects/perfeat/landing/share-modal`
- `agent-memory/ship/flaky-tests`
- `agent-memory/backend/rls-gotchas`

## Code indexing (per-repo)

| Repo | Indexed? | What you get |
|------|----------|--------------|
| perfeat-landing | **OFF** | static HTML/CSS, no code graph worth having |
| perfeat-mobile | **ON** | `code-refs` + semantic code search (`query --lang`) for blast radius |

Enable on a **registered source** (never bare `sync --repo` — it repoints `default`):
```
gbrain sync --source <id> --strategy code --full   # ingest code + extract symbols (v0.42+)
gbrain edges-backfill --source <id>                 # attempt call-edge resolution
```

**gbrain 0.42.1.0 status:**
- `code-def` (jump to definition) + `code-refs` (references) **work** for top-level
  exports/declarations on code-ingested repos.
- **CAVEAT:** do NOT run a general `embed`/`reindex-code` after `sync --strategy code`
  — it re-chunks and **wipes `symbol_name`**, breaking `code-def`.
- The call-EDGE layer (`code-callers`/`code-callees`/`code-blast`) does NOT resolve for
  TS/TSX here (`edges-backfill` walks chunks, resolves 0 edges). Blast radius =
  ripgrep + `code-def` + `code-refs` + semantic search.
- **Note:** code pages must be ingested ON v0.42+; pages from older versions carry no
  symbols and need a fresh re-ingest (remove + re-add the isolated source).

## Embedding & rerank — ZeroEntropy (locked)

Helmsman uses **ZeroEntropy** for both embedding and reranking:

```
embedding_model:     zeroentropyai:zembed-1   (1280d)
reranker_model:      zeroentropyai:zerank-2
```

**Decision: stay on ZeroEntropy.** `reindex-code` emits a nudge suggesting Voyage's
`voyage-code-3` for pure code retrieval — we intentionally **decline** it (single
provider, reranker pairing, already 100% embedded). To silence the nudge:

```
GBRAIN_NO_CODE_MODEL_NUDGE=1   # env var; there is no config key for it
```

Do NOT run `gbrain config set embedding_model voyage:...` — that would force a full
re-embed and split us off ZeroEntropy.

## Health

```
gbrain doctor          # resolver, skills, pgvector, RLS, embeddings
gbrain stats           # page / chunk / embed counts
```

## Why gbrain over brv

gbrain is semantic + graph + cross-machine. brv was project-local and duplicated the
memory layer at extra token cost. Helmsman retires brv from the flow; its prior
knowledge was migrated into gbrain (see PLAN.md Phase 0).

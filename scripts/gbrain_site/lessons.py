"""gbrain study site — lesson content data.
Each lesson body is the exact source-grounded HTML from the original
single-page build (~/gbrain/src @ v0.42.26.0). One dict, the builder wraps it.
"""

LESSONS = [
    {
        "n": "00", "kicker": "Capstone", "nav": "The Machine",
        "title": 'The whole <span class="ac">machine</span>',
        "model": "gbrain turns a git-tracked folder of markdown into a Postgres-backed, vector-searchable, self-maintaining knowledge graph — write a page and a background loop chunks it, embeds it, links it, and eventually grades the beliefs inside it.",
        "body": r"""
    <p>Everything downstream is detail under one of six moving parts. Hold this map and the seven lessons slot in.</p>

    <table>
      <tr><th>Part</th><th>What it is</th><th>Lesson</th></tr>
      <tr><td><b>Storage</b></td><td>Pages + chunks in Postgres (or PGLite). A generation clock stamps every content change.</td><td>01</td></tr>
      <tr><td><b>Retrieval</b></td><td>Keyword + vector search, fused by RRF, boosted, reranked, autocut.</td><td>02</td></tr>
      <tr><td><b>Write path</b></td><td>parse → sanity-gate → hash → chunk → embed → one transaction.</td><td>03</td></tr>
      <tr><td><b>Embeddings</b></td><td>Recursive 300-word chunks → OpenAI/Voyage vectors; stale-walk re-embeds.</td><td>04</td></tr>
      <tr><td><b>Dream cycle</b></td><td>24 ordered phases that lint, sync, synthesize, extract, grade, GC.</td><td>05</td></tr>
      <tr><td><b>Tenancy + belief</b></td><td>source_id isolation; facts → takes → calibration.</td><td>06 · 07</td></tr>
    </table>

    <h3>The data flow, end to end</h3>
    <pre><code><span class="cmt"># you write a page</span>
gbrain put son/notes/idea &lt; idea.md
        │
        ▼
  <span class="kw">importFromContent()</span>   <span class="cmt"># parse → sanity gate → SHA-256 hash</span>
        │                   <span class="cmt"># hash matches? → skip (idempotent)</span>
        ▼
  chunk (300w, 50 overlap) → embed (OUTSIDE the txn)
        │
        ▼
  <span class="ok">TRANSACTION</span>: version snapshot + putPage + tags + chunks + links
        │
        ▼  <span class="cmt"># later, while you sleep…</span>
  <span class="kw">dream cycle</span>: lint → sync → synthesize → extract → embed → grade → purge
        │
        ▼
  brain is smarter: backlinked, embedded, beliefs graded</code></pre>

    <div class="card key">
      <div class="label">The thing that ties it together</div>
      <p>A single monotonic counter — the <b>generation clock</b> — is the brain's heartbeat. A real content change bumps it; the query cache reads it to know whether it's stale. Storage, retrieval, and the dream cycle all coordinate through this one number.</p>
    </div>
""",
        "recap": [
            "The brain is <b>six moving parts</b>: storage, retrieval, write path, embeddings, dream cycle, tenancy + belief.",
            "<b>One folder of markdown</b> → Postgres-backed, vector-searchable, self-grading graph.",
            "The <b>generation clock</b> is the heartbeat every subsystem coordinates through.",
        ],
    },
    {
        "n": "01", "kicker": "Storage", "nav": "Schema",
        "title": 'The <span class="ac">schema</span>',
        "model": 'Two tables carry the brain: <code>pages</code> (one row per markdown file) and <code>content_chunks</code> (the embeddable slices). Identity is <code>(source_id, slug)</code> — never slug alone. A generation counter on every page is the truth signal for the cache.',
        "body": r"""
    <p>A <b>page</b> is a markdown file projected into a row: <code>slug</code>, <code>title</code>, <code>type</code>, <code>compiled_truth</code> (the canonical body), a <code>timeline</code> section, frontmatter JSONB, and a <code>content_hash</code>. A <b>chunk</b> is a ~300-word slice of that body with its own embedding vector — the unit retrieval actually searches over.</p>

    <h3>Identity is a pair, not a slug</h3>
    <p>Before v0.17 a slug was globally unique. That broke multi-tenancy. Now the UNIQUE key is <code>(source_id, slug)</code> — two sources can both hold <code>wiki/people/alice</code> as distinct rows. <code>putPage</code> conflicts on the pair, not the slug:</p>
    <pre><code><span class="cmt"># the upsert that defines page identity</span>
INSERT ... ON CONFLICT <span class="kw">(source_id, slug)</span> DO UPDATE
  SET ... = <span class="kw">COALESCE</span>(EXCLUDED.x, pages.x)  <span class="cmt"># partial writes don't blank columns</span></code></pre>

    <h3>The generation clock</h3>
    <p>Every page carries a <code>generation</code> integer. A <code>BEFORE INSERT/UPDATE</code> trigger bumps it — but <b>only when content actually changes</b> (<code>IS DISTINCT FROM</code> on compiled_truth, title, content_hash, +7 columns). A read-time mutation like setting <code>deleted_at</code> doesn't bump it, so the query cache isn't needlessly invalidated. There's also a global <code>page_generation_clock</code> — "did <em>any</em> write happen?" — the cache's coarse gate.</p>

    <div class="card warn">
      <div class="label">Why this matters</div>
      <p>The generation clock is the single coordination primitive between storage, the query cache, and the dream cycle. Master this and the cache-invalidation logic in every other lesson is obvious: <b>content changed → clock bumped → cache stale → re-run.</b> No change → instant cache hit.</p>
    </div>
""",
        "recap": [
            "<b>Two tables:</b> <code>pages</code> (files) + <code>content_chunks</code> (embeddable slices).",
            "<b>Identity = <code>(source_id, slug)</code></b>, not slug alone — the multi-tenant key.",
            "<b>The generation trigger bumps only on real content change</b> → drives cache invalidation.",
            "<b>COALESCE on upsert</b> means a partial <code>putPage</code> never blanks existing columns.",
        ],
    },
    {
        "n": "02", "kicker": "Retrieval", "nav": "Query",
        "title": 'The query <span class="ac">pipeline</span>',
        "model": '<code>query</code> runs <b>two searches in parallel</b> — keyword (Postgres FTS) and vector (HNSW cosine) — merges them with <b>Reciprocal Rank Fusion</b>, re-scores, dedups, applies a boost stack, optionally reranks, cuts the tail, and returns. <code>query</code> then feeds the chunks to an LLM for a cited answer; <code>search</code> returns them raw.',
        "body": r"""
    <h3>Two channels</h3>
    <ul>
      <li><b>Keyword</b> — Postgres full-text over weighted tsvectors (title='A' outranks body='B'). Always available, no API key.</li>
      <li><b>Vector</b> — the query is embedded with the same model as the chunks, then HNSW does approximate-nearest-neighbour cosine. Semantic: finds meaning, not words.</li>
    </ul>

    <h3>RRF — the actual fusion math</h3>
    <p>This is the heart. RRF merges ranked lists by <b>rank position, not raw score</b> — robust, because keyword scores and cosine scores aren't comparable units.</p>
    <pre><code>For each list (keyword, vector, expansion variants):
  For each result at rank r (0-indexed):
    rrfScore = <span class="kw">1 / (K + r)</span>        <span class="cmt">// K = 60 (Cormack et al.)</span>
    accumulate into scores[slug:chunk_id]</code></pre>
    <p>A chunk that's #1 in keyword (1/60) <em>and</em> #1 in vector (another 1/60) sums to 0.033 — it beats anything that's #1 in only one list. <b>Agreement across channels wins.</b> That's the whole point.</p>

    <h3>The boost stack — orthogonal dials</h3>
    <p>After fusion, optional multipliers reshape ranking. Each is a deliberate signal the agent picks per query:</p>
    <table>
      <tr><th>Boost</th><th>Signal</th></tr>
      <tr><td><b>compiled-truth</b></td><td>Canonical body beats sidecar/raw text. (On by default; off at <code>detail=high</code>.)</td></tr>
      <tr><td><b>backlinks</b></td><td>Pages others link to are more authoritative.</td></tr>
      <tr><td><b>salience</b></td><td><code>emotional_weight</code> + take density — surfaces what <em>matters</em>.</td></tr>
      <tr><td><b>recency</b></td><td>Per-prefix age decay. <code>daily/</code> fades fast; <code>concepts/</code> stays evergreen.</td></tr>
      <tr><td><b>title</b></td><td>Query terms in the page title.</td></tr>
    </table>
    <p class="small"><b>match</b> (RRF) is one axis; <b>mattering</b> (salience) and <b>freshness</b> (recency) are separate dials. Entity lookup → boosts off. "What's been going on lately" → salience + recency on.</p>

    <div class="card warn">
      <div class="label">autocut vs adaptive_return</div>
      <p><b>autocut</b> cuts where the relevance score drops off a cliff — an obvious single answer comes back as 1 result. <b>adaptive_return</b> caps by question <em>intent</em> — a lookup returns a tight set, a breadth query takes the full top-K. Both are safe-by-construction: never empty, first-page only.</p>
    </div>
""",
        "recap": [
            "<b>Two channels, one fusion.</b> Keyword finds words, vector finds meaning, RRF rewards agreement.",
            "<b>RRF ranks by position</b> (1/(K+r), K=60), not raw score — that's why incomparable units merge cleanly.",
            "<b>Boosts are orthogonal dials:</b> match (always), mattering, freshness, authority, title.",
            "<b>autocut cuts the cliff; adaptive_return caps by intent.</b>",
            "<b><code>search</code></b> = raw chunks · <b><code>query</code></b> = LLM answer · <b><code>think</code></b> = multi-hop synthesis.",
        ],
    },
    {
        "n": "03", "kicker": "The Engine", "nav": "Write Path",
        "title": 'The write <span class="ac">path</span>',
        "model": '<code>BrainEngine</code> is a Postgres-dialect storage contract — two implementations (Postgres, PGLite), one schema, one write pipeline (<code>importFromContent</code>) that orchestrates parse → hash → embed → a single transaction.',
        "body": r"""
    <h3>Two engines, one contract</h3>
    <p><code>BrainEngine</code> is a TypeScript interface with a <code>kind: 'postgres' | 'pglite'</code> discriminator. A factory picks at runtime via dynamic <code>import()</code>, so PGLite's WASM never loads for Postgres users:</p>
    <ul>
      <li><b>PostgresEngine</b> — wraps a connection pool, PgBouncer-aware, multi-worker.</li>
      <li><b>PGLiteEngine</b> — in-process WASM, acquires a <b>file lock</b> on connect (single-process; crashes on concurrent access).</li>
    </ul>

    <h3>The pipeline, step by step</h3>
    <p>Every write — <code>sync</code>, <code>import</code>, MCP <code>put_page</code> — flows through <code>importFromContent()</code>:</p>
    <pre><code><span class="ok">1</span> parse         <span class="cmt"># frontmatter, compiled_truth, timeline, tags</span>
<span class="ok">2</span> sanity gate   <span class="cmt"># quarantine junk / flag markup / pass — BEFORE hashing</span>
<span class="ok">3</span> hash          <span class="cmt"># SHA-256 of canonical fields = idempotency key</span>
<span class="ok">4</span> short-circuit <span class="cmt"># hash unchanged? → skip, 0 chunks</span>
<span class="ok">5</span> dedup         <span class="cmt"># catch same content under another slug</span>
<span class="ok">6</span> chunk         <span class="cmt"># recursive 300-word, 50 overlap, 6000-char cap</span>
<span class="ok">7</span> embed         <span class="kw"># OUTSIDE the transaction (don't hold a DB lock on an API call)</span>
<span class="ok">8</span> <span class="kw">TRANSACTION</span>   <span class="cmt"># version + putPage + tags + chunks + links — atomic</span></code></pre>

    <div class="card warn">
      <div class="label">Two design choices worth internalising</div>
      <p><b>Embedding runs outside the transaction</b> — an external API call shouldn't hold a DB lock. <b>Tags are add-only on import</b> — the tags table has no provenance column, so a frontmatter tag can't be told apart from a dream-cycle auto-tag; deleting would wipe enrichment.</p>
    </div>

    <p>The chunk upsert uses a <code>CASE</code> expression to resolve the concurrent-embed race: text changed → new embedding; existing NULL → new; fresher <code>embedded_at</code> → new; else keep. The generation trigger then bumps only on real content change, driving cache invalidation.</p>
""",
        "recap": [
            "<b><code>BrainEngine</code> is an interface</b> — two implementations, one contract, runtime-chosen.",
            "<b>PGLite = file lock (single-process); Postgres = pool (multi-worker).</b>",
            "<b>The pipeline lives in <code>importFromContent()</code></b>, not the engine — engine = primitives, pipeline = orchestration.",
            "<b>Embedding is outside the txn; tags are add-only; <code>(source_id, slug)</code> is identity.</b>",
        ],
    },
    {
        "n": "04", "kicker": "Vectors", "nav": "Embeddings",
        "title": 'Embeddings &amp; <span class="ac">chunking</span>',
        "model": "A page's body is cut into overlapping 300-word pieces by a recursive delimiter hierarchy, each wrapped with page-title context, then sent to OpenAI for a 1536-dim vector. A partial index on <code>embedding IS NULL</code> makes finding unembedded chunks a microsecond scan, not a table walk.",
        "body": r"""
    <h3>The recursive chunker</h3>
    <p>The universal workhorse. Five delimiter levels, walked top-down:</p>
    <pre><code>L0: paragraphs  (\n\n)
L1: lines       (\n)
L2: sentences   (. ! ?  +  CJK 。！？)
L3: clauses     (; : ,  +  CJK ；：，、)
L4: words       (whitespace + CJK char-slice fallback)</code></pre>
    <p>Split at the coarsest delimiter that produces multiple pieces, recurse on oversized ones, greedy-merge toward 300 words, add 50-word sentence-aware overlap, hard-cap at 6000 chars (CJK safety against OpenAI's 8192-token limit). Code files use a separate <b>tree-sitter</b> chunker — 30 languages, AST nodes as chunks, class methods split individually.</p>

    <h3>Three embedding columns</h3>
    <table>
      <tr><th>Column</th><th>Model</th><th>Use</th></tr>
      <tr><td><code>embedding</code></td><td>OpenAI text-embedding-3-large (1536d)</td><td>Primary text. Full HNSW index.</td></tr>
      <tr><td><code>embedding_image</code></td><td>Voyage multimodal-3 (1024d)</td><td>Images. Partial HNSW (only where NOT NULL).</td></tr>
      <tr><td><code>embedding_multimodal</code></td><td>Voyage multimodal-3 (1024d)</td><td>Unified Phase-3 routing.</td></tr>
    </table>

    <h3>Contextual retrieval wrapping</h3>
    <p>Per Anthropic's method, chunks are wrapped with page context <em>at embed time only</em> — the stored <code>chunk_text</code> stays canonical:</p>
    <pre><code>&lt;context&gt;Page Title
First two sentences of compiled_truth
&lt;/context&gt;
{chunk text}</code></pre>

    <div class="card warn">
      <div class="label">The stale walk</div>
      <p>A chunk is stale when <code>embedding IS NULL</code> — the partial index <code>content_chunks_stale_idx</code> covers exactly these rows. <code>gbrain embed --stale</code> cursor-paginates (2000 rows/batch), embeds with 20 parallel workers, runs a 30-min budget, and is crash-resumable. Re-chunking a page NULLs its embeddings, so it automatically flows back through the same cursor.</p>
    </div>
""",
        "recap": [
            "<b>Recursive chunker</b> = 5-level hierarchy → 300-word chunks, 50 overlap, 6000-char cap.",
            "<b>Code chunker</b> = tree-sitter AST (30 langs); methods split individually.",
            "<b>Three columns:</b> <code>embedding</code> (OpenAI primary), two Voyage multimodal.",
            "<b>Contextual wrapping</b> prepends title context to the embed input only — stored text stays canonical.",
            "<b>Stale = <code>embedding IS NULL</code></b>, found via partial index — instant, resumable re-embed.",
        ],
    },
    {
        "n": "05", "kicker": "Autopilot", "nav": "Dream Cycle",
        "title": 'The dream <span class="ac">cycle</span>',
        "model": "The dream cycle is gbrain's overnight maintenance loop — 24 fixed-order phases that lint, sync, synthesize, extract, analyze, calibrate, embed, and garbage-collect — coordinated by a row-based Postgres lock so no two cycles ever collide.",
        "body": r"""
    <p>The README's framing: <em>"the agent runs while I sleep… I wake up and the brain is smarter."</em> Like biological sleep consolidating memory, the cycle promotes raw material (file changes, transcripts, facts) into structure (links, takes, patterns, embeddings, calibration).</p>

    <h3>The phases, in order</h3>
    <p>The order is semantic: fix files first, import, synthesize raw material, extract structure, analyze, calibrate, embed, GC last.</p>
    <pre><code><span class="ok">lint</span> → <span class="ok">backlinks</span> → <span class="ok">sync</span> → synthesize → extract → extract_facts
  → extract_atoms* → resolve_symbol_edges → patterns → synthesize_concepts*
  → recompute_emotional_weight → <span class="ok">consolidate</span> → propose_takes → grade_takes
  → calibration_profile → conversation_facts_backfill° → enrich_thin° → skillopt°
  → <span class="ok">embed</span> → orphans → schema-suggest → <span class="ok">purge</span>

<span class="cmt">* pack-gated (only if active lens pack declares it)</span>
<span class="cmt">° opt-in, default OFF</span></code></pre>

    <p>Highlights worth knowing: <b>sync</b> diffs git against the DB and returns the changed slugs that <b>extract</b> processes incrementally. <b>synthesize</b> runs a cheap Haiku "worth processing?" verdict, then fans out one Sonnet subagent per worthy transcript. <b>consolidate</b> promotes clusters of facts into takes. <b>purge</b> runs <em>last</em> so the rest of the cycle still sees the recoverable set.</p>

    <div class="card warn">
      <div class="label">The cycle lock — why not pg_advisory_lock</div>
      <p>PgBouncer transaction pooling drops session state, making session-scoped advisory locks unreliable. So gbrain uses a <b>row</b> in <code>gbrain_cycle_locks</code> with a TTL (5 min). Acquire is an atomic <code>INSERT ON CONFLICT DO UPDATE WHERE ttl_expires_at &lt; NOW()</code> — an expired holder is auto-superseded; an empty RETURNING means another cycle is live → skip. Long phases refresh the TTL every ~30s.</p>
    </div>

    <p><b>Autopilot is adaptive:</b> it scores brain health each tick (default 300s). Score ≥ 95 with an empty plan → sleep; small problems → targeted jobs; large problems or score &lt; 70 → a full cycle. Healthy brains double the interval; degraded ones halve it. Five consecutive failures trips the circuit breaker.</p>
""",
        "recap": [
            "<b>24 phases, fixed order</b> — the semantic spine of \"overnight maintenance.\"",
            "<b>Three callers, one <code>runCycle()</code></b> — CLI <code>dream</code>, daemon <code>autopilot</code>, Minions worker.",
            "<b>Row-based lock with TTL</b>, not advisory locks — survives PgBouncer pooling.",
            "<b>Pack-gated + opt-in phases</b> stay off unless declared/enabled.",
            "<b>Autopilot is adaptive</b> — health-scored, not blind full-cycles every tick.",
        ],
    },
    {
        "n": "06", "kicker": "Tenancy", "nav": "Sources",
        "title": 'Sources &amp; <span class="ac">isolation</span>',
        "model": "A source is a logical brain-within-the-DB — one Postgres database holds many tenants, each scoped by a <code>source_id</code> foreign key on every page and chunk, with a <code>federated</code> flag controlling whether it joins default cross-source search.",
        "body": r"""
    <p>Every <code>pages</code> row carries <code>source_id TEXT NOT NULL DEFAULT 'default' REFERENCES sources(id)</code>. The <code>id</code> is an immutable citation key (<code>[a-z0-9-]{1,32}</code>); slugs are unique <em>per source</em>, not globally. The seeded <code>default</code> source starts <code>federated=true</code> for backward compat; new sources default to <b>not federated</b> — isolated until explicitly named.</p>

    <h3>The 6-tier resolution chain</h3>
    <p>How gbrain decides which source a command hits, priority high → low:</p>
    <pre><code><span class="ok">1</span> --source flag          <span class="cmt"># explicit, rejects invalid loudly</span>
<span class="ok">2</span> GBRAIN_SOURCE env       <span class="cmt"># pins a shell / MCP session</span>
<span class="ok">3</span> .gbrain-source dotfile  <span class="cmt"># walks CWD → root</span>
<span class="ok">4</span> CWD path match          <span class="cmt"># longest-prefix vs sources' local_path</span>
<span class="ok">5</span> brain-level default     <span class="cmt"># sources.default config key</span>
<span class="ok">6</span> fallback 'default'

<span class="cmt"># __all__ escape hatch → empty scope → no WHERE filter → search everything</span></code></pre>

    <div class="card warn">
      <div class="label">Model B vs isolated sources</div>
      <p><b>Model B</b> — one <code>default</code> source, namespaced by folder (<code>son/</code>, <code>robin/</code>, <code>projects/</code>). Everyone reads everything. That's exactly Robin + Karpathy's setup. <b>Isolated sources</b> — walled-off tenants: a coding-agent source literally <em>cannot</em> see <code>default</code> pages, enforced at SQL via <code>WHERE source_id=$X</code> on every query. That's how perfeat-mobile / sonwork-astro stay walled off.</p>
    </div>

    <p>The single read-side bottleneck is <code>sourceScopeOpts(ctx)</code>. Critical safety: an empty <code>allowedSources: []</code> means <b>"no federated read,"</b> NOT "all sources." An attacker-controlled empty array can't widen scope — fail-closed. The v0.34.1 OAuth leak seal threaded <code>source_id</code> through every read path (including the image-search path that bypasses hybrid search), closing cross-source page leaks.</p>
""",
        "recap": [
            "<b>A source is a logical tenant</b> inside one Postgres DB; slugs unique per-source.",
            "<b><code>federated=true</code> → cross-source search;</b> new sources isolated by default.",
            "<b>6-tier resolution:</b> flag → env → dotfile → path → brain-default → <code>'default'</code>.",
            "<b>Separate write (<code>source_id</code>) and read (<code>federated_read</code>) scopes;</b> the v0.34.1 seal closed every leak surface.",
            "<b><code>sourceScopeOpts</code> is fail-closed</b> — empty array is never \"all.\"",
        ],
    },
    {
        "n": "07", "kicker": "The Belief Layer", "nav": "Facts & Takes",
        "title": 'Facts, takes &amp; <span class="ac">calibration</span>',
        "model": "Facts are ephemeral claims extracted from conversations (hot memory); takes are promoted, typed, weighted beliefs that live on pages (warm memory); calibration grades resolved bets into a per-holder accuracy profile — turning a knowledge base into a system that knows how much to trust itself.",
        "body": r"""
    <h3>Three memory temperatures</h3>
    <table>
      <tr><th>Layer</th><th>Table</th><th>Lifecycle</th></tr>
      <tr><td><b>Hot</b></td><td><code>facts</code></td><td>Extracted per-turn → deduped → consolidated or forgotten.</td></tr>
      <tr><td><b>Warm</b></td><td><code>takes</code></td><td>Promoted from facts by the consolidate phase; live on pages.</td></tr>
      <tr><td><b>Calibration</b></td><td><code>calibration_profiles</code></td><td>Rebuilt per cycle from resolved-take scorecards.</td></tr>
    </table>

    <h3>Facts → dedup → takes</h3>
    <p>A turn is sanitized, Haiku extracts structured claims (five kinds: <code>event · preference · commitment · belief · fact</code>), each is embedded, then run through the classifier before insert:</p>
    <pre><code>cosine ≥ 0.95            → <span class="kw">DUPLICATE</span>  <span class="cmt"># cheap fast-path, skip the LLM</span>
LLM: duplicate|supersede|independent
on error, cosine ≥ 0.92 → <span class="kw">DUPLICATE</span>  <span class="cmt"># fallback</span></code></pre>
    <p>The dream-cycle <b>consolidate</b> phase then promotes them: bucket facts by entity, require ≥3 facts aged ≥24h, cluster by cosine ≥ 0.85, pick the highest-confidence claim as a take, and mark contributing facts <code>consolidated_into</code> — <b>never deleted</b>, kept as an audit trail.</p>

    <h3>The calibration loop</h3>
    <p>Takes of <code>kind='bet'</code> carry a <code>weight</code> (the holder's stated probability). When resolved (correct / incorrect / partial / unresolvable), the scorecard computes a <b>Brier score</b>:</p>
    <pre><code>brier = mean( (weight − outcome)² )   <span class="cmt"># 0 = perfect, 0.25 = coin-flip baseline</span></code></pre>
    <p>The Hindsight wave aggregates this into <code>calibration_profiles</code> — narrative pattern statements (<em>"Geography is your blind spot — high-conviction calls missed 4 of 6"</em>) and kebab-case bias tags that feed back into contradiction detection and real-time nudges. <b>The brain learns its own biases.</b></p>

    <div class="card key">
      <div class="label">The closed loop</div>
      <p>Conversation → <code>extract_facts</code> → classify/dedup → <code>facts</code> → <code>consolidate</code> → <code>takes</code> → resolve → scorecard (Brier) → <code>calibration_profile</code> → fed back into <code>think</code> and nudges. Hot memory never touches pages directly; it earns its way to warm, then gets graded.</p>
    </div>
""",
        "recap": [
            "<b>Facts are hot, ephemeral, per-source;</b> deduped by cosine fast-path before any LLM fires.",
            "<b>Takes are warm, page-anchored, typed</b> (<code>fact · take · bet · hunch</code>), conviction-weighted.",
            "<b>Consolidation is the bridge</b> — cluster ≥3 facts aged ≥24h; facts marked, never deleted.",
            "<b>Brier is the calibration signal</b> — <code>mean((weight−outcome)²)</code>, lower is better.",
            "<b>The Hindsight wave</b> turns scorecards into narrative bias tags — the brain calibrates itself.",
        ],
    },
]

# Helmsman Hooks — structural enforcement

These hooks turn Helmsman's prose rules into **structural guarantees**. One logic source,
two host adapters (opencode + Claude Code), so a repo built on one host works when cloned
to the other.

## What's enforced

| Guard | What it does | opencode | Claude Code |
|-------|--------------|----------|-------------|
| **privacy-block** | refuse to read/edit secret files (`.env`, keys, `.pem`, `credentials`, `.ssh/`) — `.env.example` allowed | `tool.execute.before` throws | `PreToolUse` exits 2 |
| **session-hydrate** | re-inject the Helmsman contract + in-flight `process/active/` plans so the agent doesn't forget the rules after compaction / on session start. **Capped at `CONTEXT_MAX_CHARS` (6000)** so it never bloats the window — overflow is truncated with a marker | `experimental.session.compacting` pushes context | `SessionStart` prints context |

## Files

```
hooks/
├── lib/privacy.js              # shared secret-file patterns (source of truth)
├── opencode/helmsman.js        # opencode plugin (privacy + session-hydrate)
└── claude/
    ├── privacy-block.js        # Claude PreToolUse hook
    ├── session-hydrate.js      # Claude SessionStart hook
    └── settings.hooks.json     # the `hooks` block merged into target .claude/settings.json
```

## How they install (`install.sh` wires both)

- **opencode:** `hooks/opencode/helmsman.js` → `<project>/.opencode/plugins/helmsman.js`
  (opencode auto-loads `.opencode/plugins/*.js` at startup).
- **Claude Code:** `hooks/claude/*.js` → `<project>/.helmsman/hooks/claude/`, and the
  `settings.hooks.json` `hooks` block is **merged** (not clobbered) into the target's
  `.claude/settings.json`.

## Verifying they fire (needs a host restart — the one human step)

Both hosts load hooks at startup, so after install you must **restart the host once**, then:

1. **privacy-block:** ask the agent to read a `.env` file → it must refuse with the
   `[Helmsman privacy-block]` message. (A `.env.example` read must still succeed.)
2. **session-hydrate:** start a fresh session (or trigger compaction) → the Helmsman
   contract + any `process/active/` plan should appear in context.

> Per Operating Rule 1 (prove-don't-claim): a hook is not "enforced" until you've seen it
> fire on the host. The headless logic test (`node hooks/lib/privacy.test.js`) proves the
> patterns; the host restart proves the wiring.

## Design notes

- **Allowlist beats blocklist for examples:** `.env.example/.sample/.template` are
  explicitly safe so onboarding/templates aren't blocked.
- **Mirror, don't share at runtime:** the opencode plugin inlines the patterns (it's
  copied standalone into `.opencode/plugins/`); `hooks/lib/privacy.js` is the canonical
  source the adapters are kept in sync with.
- **Scope/no-fabricate guards:** enforced primarily at the agent layer (tool grants in
  each agent's frontmatter — read-only agents structurally cannot write) plus the
  prove-don't-claim Operating Rules. The hooks here cover the cross-cutting, host-level
  guarantees (secrets + memory hydration).

# Skill-catalog trim (per-turn token discipline)

**Problem:** every turn, the host injects the full `<available_skills>` catalog (name +
description) into context. With ~200+ skills installed across `~/.config/opencode/skills`,
`~/.claude/skills`, `~/.agents/skills`, that catalog is a large *fixed* per-turn cost that
compaction can't shrink (it's not conversation). The benefit-ceiling caution
(`adherence.md` / `evolve-memory`) applies: fewer, higher-signal skills beat a big library.

**Decision (recorded):** trim by **config-hide, never delete** — Option A. Deleting from
`~/.claude/skills` would also remove skills from Claude Code (the dirs are shared), so we
NEVER delete; we hide from opencode's catalog via the native `permission.skill` knob. Fully
reversible.

## The mechanism (opencode-native, verified)

opencode's `permission.skill` with `"deny"` **hides a skill from the catalog entirely** (per
`opencode.ai/docs/skills`). Add to the GLOBAL config `~/.config/opencode/opencode.json`
(additive — does not touch `provider`/`mcp`):

```jsonc
{
  "permission": {
    "skill": {
      "*": "allow",
      // hide whole families this machine isn't using (reversible — flip to "allow"):
      "ios-*": "deny",
      "understand-*": "deny",
      "gstack-*": "ask"        // surface on demand instead of always-listed
    }
  }
}
```

## Turnkey procedure (when you want the token win)

1. **Pick the deny-list with the user** — families NOT used on this machine. Candidates
   (confirm each): `ios-*` (no iOS work), `understand-*` (knowledge-graph suite), unused
   `gstack-*` variants, `benchmark-models`, `make-pdf`, `obsidian-vault`.
2. **Add the `permission.skill` block** to `~/.config/opencode/opencode.json` (additive;
   keep `"*": "allow"` first, specific denies after — last match wins).
3. **Never delete** `~/.claude/skills/*` (shared with Claude Code) — only `deny` in config.
4. **Restart opencode** so the catalog re-renders; confirm the denied families no longer
   appear in `<available_skills>`.
5. Reversible anytime: flip `deny`→`allow` or remove the block.

## Why this is config-only, not a harness file

The deny-list is **per-machine** (depends what that box uses) — it lives in the deployment's
`opencode.json`, NOT the Helmsman template (provider/host-agnostic). This doc is the recipe;
the user applies it to their config when the per-turn floor matters.

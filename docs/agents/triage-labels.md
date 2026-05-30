# Triage Labels

| Label | Meaning |
|-------|---------|
| `needs-triage` | New, unreviewed. Default for incoming issues. |
| `needs-info` | Blocked on a question or missing detail. |
| `ready-for-agent` | Scoped clearly enough that an AI agent can pick it up and ship. |
| `ready-for-human` | Needs a human decision (taste, brand, strategy) before work starts. |
| `wontfix` | Acknowledged, intentionally not doing. |

## Flow

```
needs-triage → (needs-info ⇄) → ready-for-agent | ready-for-human → in progress → closed
                                                                   → wontfix
```

## Repo-specific notes

- Anything touching **DESIGN.md, palette, typography, or visual layout** → `ready-for-human`, hand to `@ive` (brand surface, taste call).
- Pure content (new post, typo in an essay) → usually no issue needed.
- Build/config/refactor with no visual impact → `ready-for-agent`.

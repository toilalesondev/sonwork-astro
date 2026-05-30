# Issue Tracker

This project uses **GitHub Issues** via the `gh` CLI.

## Common commands

```bash
gh issue list --state open
gh issue list --label ready-for-agent
gh issue view <number>
gh issue create --title "..." --body "..."
gh issue comment <number> --body "..."
gh issue close <number>
```

## Conventions

- One issue = one independently-shippable slice of work.
- Reference the originating plan in `process/` from the issue body.
- Label every new issue (see `triage-labels.md`).
- Content work (new posts) is a knowledge artifact in `src/content/posts/` — an issue is optional.

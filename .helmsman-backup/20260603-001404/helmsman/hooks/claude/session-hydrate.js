#!/usr/bin/env node
// hooks/claude/session-hydrate.js — Claude Code SessionStart hook.
// Re-injects the Helmsman contract + a pointer to in-flight work so the agent does not
// "forget" the harness rules at session start / after compaction. Prints to stdout;
// Claude includes SessionStart stdout as additional context.

const fs = require("fs");
const path = require("path");

const lines = [
  "## Helmsman contract (session start)",
  "- The orchestrator ROUTES, never executes (see AGENTS.md / .helmsman/harness/iron-law.md).",
  "- Operating Rules hold: prove-don't-claim, follow the gates, never fake, stay in lane.",
  "- Memory is two-tier: read process/context/ first (local), then gbrain (durable).",
];

// Surface any in-flight plan so work resumes instead of restarting.
try {
  const activeDir = path.join(process.cwd(), "process", "active");
  const plans = fs.readdirSync(activeDir).filter((f) => f.endsWith(".md"));
  if (plans.length) {
    lines.push(`- In-flight plans in process/active/: ${plans.join(", ")} — resume before new work.`);
  }
} catch { /* no process/active yet — fine */ }

process.stdout.write(lines.join("\n") + "\n");
process.exit(0);

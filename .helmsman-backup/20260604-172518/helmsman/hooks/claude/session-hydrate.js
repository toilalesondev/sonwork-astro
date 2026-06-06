#!/usr/bin/env node
// hooks/claude/session-hydrate.js — Claude Code SessionStart hook.
// Re-injects the Helmsman contract + a pointer to in-flight work so the agent does not
// "forget" the harness rules at session start / after compaction. Prints to stdout;
// Claude includes SessionStart stdout as additional context.
// Capped (CONTEXT_MAX_CHARS) so injection never bloats the context window.

const fs = require("fs");
const path = require("path");

const CONTEXT_MAX_CHARS = 6000;

// Read the install-chosen memory mode so the agent KNOWS its backend, never guesses.
// "gbrain" → two-tier (process/context/ + gbrain). "file" → standalone (process/ is truth).
let backend = "file";
try { backend = fs.readFileSync(path.join(process.cwd(), ".helmsman", "backend"), "utf8").trim() || "file"; } catch { /* default file */ }

const memoryLine = backend === "gbrain"
  ? "- Memory mode: GBRAIN (two-tier). Read process/context/ first (fast/local), then gbrain (durable, cross-project). Write-back lands in BOTH."
  : "- Memory mode: STANDALONE (file). process/ IS the source of truth — recall = read process/context/; write-back = write process/context/ + process/agent-memory/. No gbrain calls.";

const lines = [
  "## Helmsman contract (session start)",
  "- The orchestrator ROUTES, never executes (see AGENTS.md / .helmsman/harness/iron-law.md).",
  "- Operating Rules hold: prove-don't-claim, follow the gates, never fake, stay in lane.",
  memoryLine,
];

// Surface any in-flight plan so work resumes instead of restarting.
try {
  const activeDir = path.join(process.cwd(), "process", "active");
  const plans = fs.readdirSync(activeDir).filter((f) => f.endsWith(".md"));
  if (plans.length) {
    lines.push(`- In-flight plans in process/active/: ${plans.join(", ")} — resume before new work.`);
  }
} catch { /* no process/active yet — fine */ }

let out = lines.join("\n") + "\n";
if (out.length > CONTEXT_MAX_CHARS) {
  out = out.slice(0, CONTEXT_MAX_CHARS) + "\n…(truncated to keep context lean)\n";
}
process.stdout.write(out);
process.exit(0);

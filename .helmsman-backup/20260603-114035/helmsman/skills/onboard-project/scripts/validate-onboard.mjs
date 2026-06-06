#!/usr/bin/env node
// validate-onboard.mjs — assert onboard-project actually filled local memory (no placeholders).
// Usage: node validate-onboard.mjs <project-root>   (0=onboarded, 1=incomplete)
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] || process.cwd();
const ctx = join(root, "process", "context", "all-context.md");

if (!existsSync(ctx)) {
  console.error(`[onboard-validate] missing ${ctx} — run onboard-project's scaffold step.`);
  process.exit(1);
}
const body = readFileSync(ctx, "utf8");

const problems = [];
// Placeholder markers that mean onboarding did NOT fill real content.
if (/not yet filled|run `@helm onboard-project`|_\(none yet\)_/.test(body))
  problems.push("all-context.md still has placeholder text — fill it with REAL project content");
if (body.replace(/<!--[\s\S]*?-->/g, "").trim().length < 200)
  problems.push("all-context.md has almost no real content (<200 chars after comments)");

if (problems.length) {
  console.error(`[onboard-validate] ${ctx} INCOMPLETE:`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log(`[onboard-validate] OK — ${ctx} has real content (${body.length} chars).`);
process.exit(0);

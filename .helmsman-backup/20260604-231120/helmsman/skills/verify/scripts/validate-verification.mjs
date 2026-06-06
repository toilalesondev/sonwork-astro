#!/usr/bin/env node
// validate-verification.mjs — assert a verification.json is honest + complete.
// Usage: node validate-verification.mjs <verification.json>  (0=valid, 1=invalid)
import { readFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: node validate-verification.mjs <verification.json>"); process.exit(2); }

let data;
try { data = JSON.parse(readFileSync(path, "utf8")); }
catch (e) { console.error(`[verify-validate] cannot read/parse ${path}: ${e.message}`); process.exit(2); }

const problems = [];
// Honesty fields: which gates ACTUALLY ran (not just claimed).
if (!Array.isArray(data.commands_run) || data.commands_run.length === 0)
  problems.push("commands_run[] missing/empty — must list the exact commands executed");
if (typeof data.all_passed !== "boolean")
  problems.push("all_passed must be a boolean (honest pass/fail)");
if (data.gates_skipped === undefined)
  problems.push("gates_skipped missing — declare what was NOT run (honesty rule)");

if (problems.length) {
  console.error(`[verify-validate] ${path} INVALID:`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log(`[verify-validate] OK — ${path}: ${data.commands_run.length} command(s) run, all_passed=${data.all_passed}.`);
process.exit(0);

#!/usr/bin/env node
// validate-capture.mjs — assert a capture report is a numbered proposal with read-back proof.
// Usage: node validate-capture.mjs <capture-report.md>   (0=valid, 1=invalid)
// The report is the markdown @brain produces: a numbered list of proposed writes, then
// (post-write) each slug marked confirmed via gbrain get.
import { readFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: node validate-capture.mjs <capture-report.md>"); process.exit(2); }

let body = "";
try { body = readFileSync(path, "utf8"); }
catch { console.error(`[capture-validate] cannot read ${path}`); process.exit(2); }

const problems = [];
// Must be a NUMBERED proposal (so the user can approve item-by-item).
if (!/^\s*1\.\s+/m.test(body))
  problems.push("no numbered list — write-back must propose writes as a numbered list for approval");
// Post-write: each written item should show read-back confirmation (slug + confirmed/get).
const written = (body.match(/\bgbrain put\b/gi) || []).length;
const confirmed = (body.match(/\b(gbrain get|read.?back|confirmed|verified)\b/gi) || []).length;
if (written > 0 && confirmed === 0)
  problems.push("writes present but no read-back confirmation — verify each with `gbrain get` (Rule 1)");

if (problems.length) {
  console.error(`[capture-validate] ${path} INVALID:`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log(`[capture-validate] OK — numbered proposal${written ? `, ${written} write(s) with read-back` : ""}.`);
process.exit(0);

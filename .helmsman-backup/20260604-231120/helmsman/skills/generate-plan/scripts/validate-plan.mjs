#!/usr/bin/env node
// validate-plan.mjs — assert a generate-plan artifact has all required sections.
// Usage: node validate-plan.mjs <plan-path>   (exit 0 = valid, 1 = missing sections)
import { readFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: node validate-plan.mjs <plan-path>"); process.exit(2); }

let body = "";
try { body = readFileSync(path, "utf8"); }
catch { console.error(`[plan-validate] cannot read ${path}`); process.exit(2); }

// Required blast-radius sections (case-insensitive, heading or bold).
const REQUIRED = ["Touchpoints", "Public Contracts", "Blast Radius", "Verification", "Resume"];
const missing = REQUIRED.filter((s) => !new RegExp(s.replace(/ /g, "\\s+"), "i").test(body));

if (missing.length) {
  console.error(`[plan-validate] ${path} MISSING: ${missing.join(", ")}`);
  console.error("  A plan must spell out blast radius before BUILD. Add the sections, re-validate.");
  process.exit(1);
}
console.log(`[plan-validate] OK — ${path} has all ${REQUIRED.length} required sections.`);
process.exit(0);

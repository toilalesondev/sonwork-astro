#!/usr/bin/env node
// validate-watzup.mjs — read-only self-check for the watzup skill.
// watzup must NOT mutate anything. This asserts the working tree is unchanged since a
// baseline captured before the snapshot ran, proving the read-only contract.
// Usage:
//   node validate-watzup.mjs --baseline   → prints the current git status hash (capture BEFORE watzup)
//   node validate-watzup.mjs --check <baseline-hash>  → 0 if unchanged, 1 if watzup wrote something
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

function statusHash() {
  let s = "";
  try { s = execSync("git status --porcelain", { encoding: "utf8" }); } catch { s = "NO_GIT"; }
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

const mode = process.argv[2];
if (mode === "--baseline") { console.log(statusHash()); process.exit(0); }
if (mode === "--check") {
  const baseline = process.argv[3];
  const now = statusHash();
  if (baseline !== now) {
    console.error(`[watzup-validate] CONTRACT VIOLATION — working tree changed during watzup ` +
      `(baseline ${baseline} → now ${now}). watzup is read-only; it must never write.`);
    process.exit(1);
  }
  console.log("[watzup-validate] OK — read-only contract held (working tree unchanged).");
  process.exit(0);
}
console.error("usage: node validate-watzup.mjs --baseline | --check <hash>");
process.exit(2);

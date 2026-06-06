#!/usr/bin/env node
// compat-test.mjs — runtime compatibility test for the Helmsman skill set.
// Beyond the structural audit: actually RUNS every script-backed skill (safe/dry), smoke-tests
// the hbrowse tool, checks the one-memory surfaces resolve, and prints a per-skill report.
// Read-mostly (runs scripts in their own safe modes; writes nothing to the repo).
//
// Usage: node skills/harness-audit/scripts/compat-test.mjs [--root <helmsman-root>]
import { readdirSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const args = process.argv.slice(2);
const ROOT = (() => { const i = args.indexOf("--root"); return i >= 0 ? args[i + 1] : process.cwd(); })();
const skillsDir = join(ROOT, "skills");
const dirsIn = (p) => { try { return readdirSync(p).filter((d) => { try { return statSync(join(p, d)).isDirectory(); } catch { return false; } }); } catch { return []; } };
const node = process.execPath;
const results = [];
const run = (label, fn) => { try { const note = fn() || "ok"; results.push({ label, status: "PASS", note }); } catch (e) { results.push({ label, status: "FAIL", note: String(e.message || e).split("\n")[0].slice(0, 120) }); } };
const sh = (cmd, a, opts = {}) => execFileSync(cmd, a, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000, ...opts });

console.log(`# Helmsman compatibility test\n`);

// --- 1. script-backed skills: each script at least parses + runs its safe path ---
console.log("## Runnable skills (script-backed)");
const scriptChecks = [
  ["harness-audit", () => sh(node, ["skills/harness-audit/scripts/audit.mjs", ROOT]).match(/OK —/) ? "GREEN" : "ran"],
  ["gen-catalog", () => { sh(node, ["skills/harness-audit/scripts/gen-catalog.mjs", "--check", ROOT]); return "in-sync"; }],
  ["skill-stocktake", () => { sh(node, ["skills/skill-stocktake/scripts/scan.mjs", "--root", ROOT]); return "scanned"; }],
  ["privatize", () => { sh(node, ["skills/privatize/scripts/intake.mjs", "skills", "--root", ROOT]); return "intake ran"; }],
  ["calibrate", () => { try { sh(node, ["skills/calibrate/scripts/score-takes.mjs", "process/takes"]); return "scored"; } catch (e) { if (/not enough|no .*takes|ENOENT/i.test(String(e))) return "ran (no takes yet)"; throw e; } }],
];
for (const [name, fn] of scriptChecks) if (existsSync(join(skillsDir, name))) run(`script:${name}`, fn);
// generic: every other skill with scripts/*.mjs — syntax-check (node --check)
for (const s of dirsIn(skillsDir)) {
  const sdir = join(skillsDir, s, "scripts");
  if (!existsSync(sdir)) continue;
  for (const f of readdirSync(sdir).filter((f) => f.endsWith(".mjs"))) {
    run(`syntax:${s}/${f}`, () => { sh(node, ["--check", join(sdir, f)]); return "parses"; });
  }
}

// --- 2. tool: hbrowse live smoke (goto + cleanup) ---
console.log("## Browser tool (hbrowse)");
run("tool:hbrowse", () => {
  if (!existsSync(join(ROOT, "bin", "hbrowse.mjs"))) return "absent (skip)";
  const out = sh(node, ["bin/hbrowse.mjs", "goto", "https://example.com"], { timeout: 90000 });
  const ok = /"ok":true/.test(out) && /"status":200/.test(out);
  try { sh(node, ["bin/hbrowse.mjs", "cleanup"], { timeout: 20000 }); } catch {}
  if (!ok) throw new Error("hbrowse goto did not return ok:true status:200 — " + out.slice(0, 100));
  return "goto 200 + cleanup";
});

// --- 3. memory surfaces resolve (the one memory) ---
console.log("## Memory (one-memory surfaces)");
run("memory:process/", () => existsSync(join(ROOT, "process")) ? "present" : (() => { throw new Error("process/ missing"); })());
run("memory:backend-flag", () => { const p = join(ROOT, ".helmsman", "backend"); return existsSync(p) ? "set" : "not set (standalone default)"; });
run("memory:gbrain", () => { try { sh("gbrain", ["--version"], { timeout: 8000 }); return "gbrain CLI present"; } catch { return "gbrain absent (folder-mode ok)"; } });

// --- report ---
console.log("\n## Result");
const pass = results.filter((r) => r.status === "PASS").length;
const fail = results.filter((r) => r.status === "FAIL");
for (const r of results) console.log(`  ${r.status === "PASS" ? "✓" : "✗"} ${r.label} — ${r.note}`);
console.log(`\n${pass}/${results.length} checks passed.${fail.length ? ` ${fail.length} FAILED.` : " All green."}`);
process.exit(fail.length ? 1 : 0);

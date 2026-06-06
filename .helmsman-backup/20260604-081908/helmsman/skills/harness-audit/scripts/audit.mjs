#!/usr/bin/env node
// audit.mjs — Helmsman harness coherence check (Loop-adjacent self-audit).
// Run from the helmsman SOURCE repo root: node skills/harness-audit/scripts/audit.mjs
// Exit 0 = coherent, 1 = drift found (lists every finding).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.argv[2] || process.cwd();
const findings = [];
const fail = (m) => findings.push(m);

const read = (p) => { try { return readFileSync(join(ROOT, p), "utf8"); } catch { return ""; } };
const agentsDir = join(ROOT, "agents");
const skillsDir = join(ROOT, "skills");
const vendorDir = join(ROOT, "skills-vendor");

// --- gather agents ---
let agentFiles = [];
try { agentFiles = readdirSync(agentsDir).filter((f) => f.endsWith(".md")); } catch { fail("no agents/ dir"); }
const agentNames = agentFiles.map((f) => f.replace(/\.md$/, ""));

// --- 1. routing.md <-> agent files <-> AGENTS.md all agree ---
const routing = read("harness/routing.md");
const agentsMd = read("AGENTS.md");
for (const a of agentNames) {
  if (routing && !new RegExp(`@${a}\\b`).test(routing)) fail(`@${a} has an agent file but is NOT in harness/routing.md`);
  if (agentsMd && !new RegExp(`@${a}\\b`).test(agentsMd)) fail(`@${a} has an agent file but is NOT in root AGENTS.md`);
}
// routing/AGENTS reference an agent with no file?
// Exclude the "Old-name aliases" section (intentional renames, not agents) + generic words.
const stripAliases = (s) => s.replace(/##\s*Old-name aliases[\s\S]*/i, "");
const referenced = new Set([...stripAliases(routing + "\n" + agentsMd).matchAll(/@([a-z]+)\b/g)].map((m) => m[1]));
const NON_AGENTS = new Set(["mention", "agent", "matt", "ive", "gstack", "evera", "tan"]);
for (const r of referenced) {
  if (NON_AGENTS.has(r)) continue;
  if (!agentNames.includes(r)) fail(`@${r} is referenced (routing/AGENTS) but has NO agents/${r}.md file`);
}

// --- 2. every agent's skills: entries resolve to a real skill dir ---
const skillDirs = new Set([
  ...(existsSync(skillsDir) ? readdirSync(skillsDir) : []),
  ...(existsSync(vendorDir) ? readdirSync(vendorDir) : []),
]);
for (const f of agentFiles) {
  const body = read(`agents/${f}`);
  const m = body.match(/^skills:\s*\[([^\]]*)\]/m);
  if (!m) { fail(`agents/${f}: no skills: line`); continue; }
  const skills = m[1].split(",").map((s) => s.trim()).filter(Boolean);
  for (const s of skills) if (!skillDirs.has(s)) fail(`agents/${f}: skill "${s}" does not resolve to skills/ or skills-vendor/`);
}

// --- 3. required sections per agent (the v3/v3.1/v3.2 invariants) ---
for (const f of agentFiles) {
  const body = read(`agents/${f}`);
  if (!/^tools:/m.test(body)) fail(`agents/${f}: missing tool grants (tools:)`);
  if (!/^tier:/m.test(body)) fail(`agents/${f}: missing model-routing tier:`);
  if (!/What good looks like/.test(body)) fail(`agents/${f}: missing domain card (What good looks like)`);
  if (!/^## Example/m.test(body)) fail(`agents/${f}: missing few-shot Example`);
}

// --- 4. roster counts in README/AGENTS match actual agent count ---
const n = agentNames.length;
const readme = read("README.md");
const rosterClaim = (readme.match(/(\d+)\s+(?:domain\s+)?specialists/i) || [])[1];
if (rosterClaim && Number(rosterClaim) !== n)
  fail(`README claims ${rosterClaim} specialists but there are ${n} agent files`);

// --- 5. no dangling harness/*.md references in AGENTS/routing/FLOW ---
const harnessFiles = new Set(existsSync(join(ROOT, "harness")) ? readdirSync(join(ROOT, "harness")) : []);
for (const src of ["AGENTS.md", "harness/FLOW.md", "harness/README.md"]) {
  const body = read(src);
  for (const ref of [...body.matchAll(/harness\/([a-z-]+\.md)/g)].map((m) => m[1])) {
    if (!harnessFiles.has(ref)) fail(`${src}: references harness/${ref} which does not exist`);
  }
}

// --- report ---
if (findings.length) {
  console.error(`[harness-audit] ${findings.length} finding(s):`);
  for (const f of findings) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`[harness-audit] OK — ${n} agents coherent: routing/AGENTS agree, skills resolve, required sections present, roster count matches, no dangling refs.`);
process.exit(0);

#!/usr/bin/env node
// audit.mjs — Helmsman harness coherence check (Loop-adjacent self-audit).
// Run from the helmsman SOURCE repo root: node skills/harness-audit/scripts/audit.mjs
// Exit 0 = coherent, 1 = drift found (lists every finding).
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";

// list subdirectories only (skips files like skills/SKILLS.md, README.md, .DS_Store)
const dirsIn = (p) => { try { return readdirSync(p).filter((d) => { try { return statSync(join(p, d)).isDirectory(); } catch { return false; } }); } catch { return []; } };

const ROOT = process.argv[2] || process.cwd();
const findings = [];
const warnings = [];
const fail = (m) => findings.push(m);
const warn = (m) => warnings.push(m);
const sha = (p) => { try { return createHash("sha256").update(readFileSync(p)).digest("hex"); } catch { return null; } };

// Skills that legitimately have no agent owner (lifecycle hooks, learning loops,
// curation programs). Orphans NOT on this list are WARNED (per decision: warn, not fail).
const ORPHAN_ALLOWLIST = new Set([
  // Orchestrator-invoked rituals + shared protocols + curation programs with no
  // single specialist owner (intentionally not on any agent's skills: list).
  "start", "done", "refine", "phase-programs", "xia",
  "evolve-memory", "onboard-project", "adherence-check", "calibrate", "harness-audit",
]);
// Where the machine-global host skill mirrors live (for divergence checks).
const GLOBAL_MIRRORS = [
  join(homedir(), ".claude", "skills"),
  join(homedir(), ".config", "opencode", "skills"),
];

const read = (p) => { try { return readFileSync(join(ROOT, p), "utf8"); } catch { return ""; } };
const agentsDir = join(ROOT, "agents");
const skillsDir = join(ROOT, "skills");
// All skills are first-party now (skills-vendor retired). Kept defensively so a future
// re-vendor (or the privatize pipeline staging) still resolves; dirsIn() returns [] if absent.
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
  ...dirsIn(skillsDir),
  ...dirsIn(vendorDir),
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

// --- 6. SKILL.md frontmatter name: must equal its dir name (HARD fail) ---
const ourSkills = dirsIn(skillsDir);
const vendorSkills = dirsIn(vendorDir);
const allSkillEntries = [
  ...ourSkills.map((s) => ({ name: s, base: skillsDir, kind: "ours" })),
  ...vendorSkills.map((s) => ({ name: s, base: vendorDir, kind: "vendor" })),
];
for (const { name, base } of allSkillEntries) {
  const p = join(base, name, "SKILL.md");
  if (!existsSync(p)) { fail(`skill "${name}" has a dir but no SKILL.md`); continue; }
  const fm = readFileSync(p, "utf8").match(/^name:\s*(.+?)\s*$/m);
  if (!fm) { fail(`skill "${name}": SKILL.md has no name: field`); continue; }
  if (fm[1] !== name) fail(`skill "${name}": SKILL.md name: "${fm[1]}" != dir name "${name}"`);
}

// --- 7. orphan skills: every skill is referenced by >=1 agent OR allowlisted (WARN) ---
const declared = new Set();
for (const f of agentFiles) {
  const m = read(`agents/${f}`).match(/^skills:\s*\[([^\]]*)\]/m);
  if (m) for (const s of m[1].split(",").map((x) => x.trim()).filter(Boolean)) declared.add(s);
}
for (const { name } of allSkillEntries) {
  if (!declared.has(name) && !ORPHAN_ALLOWLIST.has(name))
    warn(`orphan skill "${name}": exists but is wired to no agent and not on the allowlist`);
}

// --- 8. OUR skills: repo SKILL.md vs machine-global mirrors must match (WARN) ---
// Repo is the source of truth; a diff means the global mirror is stale → run install.sh --global.
for (const s of ourSkills) {
  const repoHash = sha(join(skillsDir, s, "SKILL.md"));
  if (!repoHash) continue;
  for (const mirror of GLOBAL_MIRRORS) {
    const mp = join(mirror, s, "SKILL.md");
    if (!existsSync(mp)) continue; // mirror may not carry every skill; absence is not drift
    if (sha(mp) !== repoHash) warn(`our skill "${s}" DIVERGED: ${mp} != repo (repo is truth — run install.sh --global)`);
  }
}

// (Former check 9 — vendored-vs-upstream-gstack drift — retired: all skills are now
//  first-party. skills-vendor/ is gone; the privatize pipeline owns external ingestion.)

// --- 9. load-path: every agent documents HOW to load a skill (HARD fail) ---
// Subagents have no skill tool (verified) — the read-path must be stated so skills are reachable.
for (const f of agentFiles) {
  const body = read(`agents/${f}`);
  if (!/To load one:.*SKILL\.md/s.test(body) && !/read .*\.helmsman\/skills/.test(body))
    fail(`agents/${f}: missing the skill load-path instruction (how to load a skill — read .helmsman/skills/<name>/SKILL.md)`);
}

// --- 11. SELECTION cues: every skill an agent lists has a when-to-use cue (WARN) ---
// So an agent can pick WHICH skill, not just how to load it. Cue = the skill name appears on
// a line carrying an em/en-dash gloss within the agent's Skills section.
for (const f of agentFiles) {
  const body = read(`agents/${f}`);
  const m = body.match(/^skills:\s*\[([^\]]*)\]/m);
  if (!m) continue;
  const sec = (body.match(/^##\s+(?:My\s+)?[Ss]kills[\s\S]*?(?=^##\s)/m) || [""])[0];
  for (const s of m[1].split(",").map((x) => x.trim()).filter(Boolean)) {
    const cued = sec.split("\n").some((ln) => ln.includes("`" + s + "`") && /[—–]/.test(ln));
    if (!cued) warn(`agents/${f}: skill "${s}" has no when-to-use cue in its Skills section (add "\`${s}\` — <trigger>")`);
  }
}

// --- 12. SCOPE-FIT tripwire: flag likely over-merged skills (WARN; Separation Law) ---
// A skill declaring 3+ distinct modes AND owned by 2+ agents is probably multiple expertises
// forced together (the over-merge pattern). Full judgment lives in skill-stocktake; this is the
// cheap always-on guard. Allowlist skills that are genuinely one expertise with many facets.
// Genuinely one expertise that happens to reference N facets/types (not N separate skills):
// understand (one graph, many views) · impeccable (one design craft, many modes) ·
// document-generate (one doc-writing skill; the "four modes" are Diataxis output types).
const SCOPE_FIT_ALLOWLIST = new Set(["understand", "impeccable", "document-generate"]);
{
  const owners = {};
  for (const f of agentFiles) {
    const mm = read(`agents/${f}`).match(/^skills:\s*\[([^\]]*)\]/m);
    if (mm) for (const s of mm[1].split(",").map((x) => x.trim()).filter(Boolean)) (owners[s] ||= []).push(f.replace(/\.md$/, ""));
  }
  for (const s of dirsIn(skillsDir)) {
    if (SCOPE_FIT_ALLOWLIST.has(s)) continue;
    const body = readFileSync(join(skillsDir, s, "SKILL.md"), "utf8");
    // Only the explicit over-merge signature: the description/body literally announces N modes
    // or lenses (e.g. "three modes:", "four lenses"). Prose bold phrases don't count.
    const declaresModes = /\b(three|four|five|six|\d)\s+(modes?|lenses)\b/i.test(body);
    if (!declaresModes) continue;
    const nOwners = (owners[s] || []).length;
    if (nOwners >= 2)
      warn(`skill "${s}": declares multiple modes/lenses across ${nOwners} owners — possible over-merge (Separation Law). Run skill-stocktake; split or allowlist if genuinely one expertise.`);
  }
}

// --- 13. hbrowse capability: tool present but Playwright unresolved (WARN; optional capability) ---
// The browser skills call bin/hbrowse (Playwright). If the tool ships but Playwright isn't
// installed, the browser skills will honestly no-op — flag so the operator can enable it.
if (existsSync(join(ROOT, "bin", "hbrowse.mjs"))) {
  let pw = false;
  try { execFileSync(process.execPath, ["-e", "require.resolve('playwright')"], { cwd: ROOT, stdio: "ignore" }); pw = true; } catch {}
  if (!pw) warn(`hbrowse tool present but Playwright not resolvable — browser skills will no-op. Enable: npm install && npx playwright install chromium (in the repo or .helmsman/).`);
}

// --- 12. catalog sync: skills/SKILLS.md matches a fresh regen (WARN) ---
// The generated catalog is the discoverable skill->trigger index; stale = run gen-catalog.
{
  const catalogPath = join(ROOT, "skills", "SKILLS.md");
  const gen = join(ROOT, "skills", "harness-audit", "scripts", "gen-catalog.mjs");
  if (!existsSync(catalogPath)) {
    warn(`skills/SKILLS.md is missing — run: node skills/harness-audit/scripts/gen-catalog.mjs`);
  } else if (existsSync(gen)) {
    try {
      const fresh = execFileSync(process.execPath, [gen, "--check", ROOT], { encoding: "utf8" });
      const onDisk = readFileSync(catalogPath, "utf8");
      if (fresh.trim() !== onDisk.trim())
        warn(`skills/SKILLS.md is STALE — run: node skills/harness-audit/scripts/gen-catalog.mjs`);
    } catch (e) {
      warn(`skills/SKILLS.md sync check could not run gen-catalog (${e.message})`);
    }
  }
}

// --- report ---
if (warnings.length) {
  console.error(`[harness-audit] ${warnings.length} warning(s) (non-blocking):`);
  for (const w of warnings) console.error("  ⚠ " + w);
}
if (findings.length) {
  console.error(`[harness-audit] ${findings.length} finding(s):`);
  for (const f of findings) console.error("  ✗ " + f);
  process.exit(1);
}
const warnTail = warnings.length ? ` (${warnings.length} warning(s) — see above)` : "";
console.log(`[harness-audit] OK — ${n} agents coherent: routing/AGENTS agree, skills resolve + name-matched, load-path documented, required sections present, roster count matches, no dangling refs.${warnTail}`);
process.exit(0);

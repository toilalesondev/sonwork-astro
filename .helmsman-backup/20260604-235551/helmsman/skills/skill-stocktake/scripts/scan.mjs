#!/usr/bin/env node
// scan.mjs — inventory + scope-fit pre-screen for skill-stocktake.
// Enumerates every skill, extracts frontmatter, and flags scope-fit risks (too broad / too
// thin / likely overlap) so the stocktake's judgment pass starts from data. Read-only.
//
// Usage: node skills/skill-stocktake/scripts/scan.mjs [--root <helmsman-root>] [--json]
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const ROOT = (() => { const i = args.indexOf("--root"); return i >= 0 ? args[i + 1] : process.cwd(); })();
const JSON_OUT = args.includes("--json");
const skillsDir = join(ROOT, "skills");

const dirsIn = (p) => { try { return readdirSync(p).filter((d) => { try { return statSync(join(p, d)).isDirectory(); } catch { return false; } }); } catch { return []; } };
const fm = (body, key) => { const m = body.match(new RegExp(`^${key}:\\s*([\\s\\S]*?)(?:\\n[a-z_]+:|\\n---)`, "m")); return m ? m[1].replace(/[>|-]/g, " ").replace(/\s+/g, " ").trim() : ""; };

// owners per skill from agents' skills: frontmatter
const owners = {};
const agentsDir = join(ROOT, "agents");
if (existsSync(agentsDir)) for (const f of readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
  const m = readFileSync(join(agentsDir, f), "utf8").match(/^skills:\s*\[([^\]]*)\]/m);
  if (m) for (const s of m[1].split(",").map((x) => x.trim()).filter(Boolean)) (owners[s] ||= []).push(f.replace(/\.md$/, ""));
}

const rows = [];
for (const name of dirsIn(skillsDir).sort()) {
  const p = join(skillsDir, name, "SKILL.md");
  if (!existsSync(p)) { rows.push({ name, flag: "NO_SKILL_MD" }); continue; }
  const body = readFileSync(p, "utf8");
  const lines = body.split("\n").length;
  const desc = fm(body, "description");
  // count distinct declared modes/lenses (scope-fit signal)
  const modeWords = (body.match(/\*\*(qa|fix|design|report|save|restore|build|ask|explain|diff|domain|onboard|dashboard|sync|clean|canary|perf|models|ceo|eng|devex|base|docs|craft|shape|audit|polish)\*\*/gi) || []);
  const distinctModes = new Set(modeWords.map((m) => m.toLowerCase())).size;
  const ownerList = owners[name] || [];
  const multiOwnerModes = distinctModes >= 3 && new Set(ownerList).size >= 1;
  // flags
  const flags = [];
  if (lines > 130) flags.push("LARGE(>130L)");
  if (lines < 22) flags.push("THIN(<22L)");
  if (distinctModes >= 3) flags.push(`MULTIMODE(${distinctModes})`);
  if (ownerList.length === 0) flags.push("ORPHAN");
  if (ownerList.length >= 4) flags.push(`MANY-OWNERS(${ownerList.length})`);
  if (!/Use when/i.test(desc)) flags.push("NO-USE-WHEN");
  rows.push({ name, lines, owners: ownerList.join(",") || "-", modes: distinctModes, flag: flags.join(" ") || "ok", desc: desc.slice(0, 64) });
}

if (JSON_OUT) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }

const risk = rows.filter((r) => /LARGE|MULTIMODE|THIN/.test(r.flag || ""));
console.log(`# skill-stocktake scan — ${rows.length} skills\n`);
console.log(`Scope-fit pre-screen: ${risk.length} flagged (LARGE / MULTIMODE / THIN) — candidates for split or merge.\n`);
console.log("SKILL".padEnd(28) + "LINES".padEnd(7) + "MODES".padEnd(7) + "OWNERS".padEnd(22) + "FLAGS");
console.log("-".repeat(100));
for (const r of rows) {
  console.log(r.name.padEnd(28) + String(r.lines ?? "-").padEnd(7) + String(r.modes ?? "-").padEnd(7) + (r.owners || "-").padEnd(22) + (r.flag || ""));
}
console.log(`\nNext: judge each flagged skill on Scope-fit / Uniqueness / Actionability / Currency`);
console.log(`→ verdict Keep | Improve | Update | Retire | Merge-into-X (Retire/Merge/Split need user confirm).`);

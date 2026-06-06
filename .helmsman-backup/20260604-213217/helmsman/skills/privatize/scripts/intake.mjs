#!/usr/bin/env node
// intake.mjs — INTAKE step of the privatize pipeline.
// Given a repo/folder of skills, emit a data-driven intake report so triage starts
// from facts, not eyeballing: per incoming skill — name, size, description, framework
// boilerplate %, tool-coupling, and whether it collides with a skill we already own.
//
// Usage:
//   node skills/privatize/scripts/intake.mjs <source-dir> [--root <helmsman-root>] [--json]
//   <source-dir> = a dir containing <name>/SKILL.md (e.g. skills-vendor, ~/gstack/.opencode/skills)
//
// Reads only. Prints a table (or --json). The pipeline skill (SKILL.md) drives this,
// then privatizes the KEEP/MERGE rows into skills/ per harness/skill-standard.md.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const args = process.argv.slice(2);
const SRC = args.find((a) => !a.startsWith("--"));
const ROOT = (() => { const i = args.indexOf("--root"); return i >= 0 ? args[i + 1] : process.cwd(); })();
const JSON_OUT = args.includes("--json");

if (!SRC || !existsSync(SRC)) {
  console.error("usage: intake.mjs <source-dir-with-<name>/SKILL.md> [--root <helmsman>] [--json]");
  process.exit(2);
}

const dirsIn = (p) => { try { return readdirSync(p).filter((d) => { try { return statSync(join(p, d)).isDirectory(); } catch { return false; } }); } catch { return []; } };
const fm = (body, key) => { const m = body.match(new RegExp(`^${key}:\\s*(.+)$`, "m")); return m ? m[1].trim() : ""; };

// what we already own (collision detection): bare names under skills/ + skills-vendor/
const owned = new Set([
  ...dirsIn(join(ROOT, "skills")),
  ...dirsIn(join(ROOT, "skills-vendor")),
]);
// agents' declared skills (so we can flag "already wired")
const declared = new Set();
const agentsDir = join(ROOT, "agents");
if (existsSync(agentsDir)) for (const f of readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
  const m = readFileSync(join(agentsDir, f), "utf8").match(/^skills:\s*\[([^\]]*)\]/m);
  if (m) for (const s of m[1].split(",").map((x) => x.trim()).filter(Boolean)) declared.add(s);
}

// framework-boilerplate markers (the scaffolding privatization sheds — generalized beyond gstack)
const BOILERPLATE = /preamble|telemetry|artifacts sync|plan mode safe|skill routing|askuserquestion format|voice|writing style|question tuning|model-specific behavioral|completion status protocol|operational self-improvement|plan status footer|context recovery|continuous checkpoint/i;
// tool-coupling markers
const TOOLS = [
  { re: /chrome-cdp|\bcdp\b|remote-debugging|puppeteer|playwright|\$B\b|browse daemon/i, tool: "browser" },
  { re: /stateserver|ios-qa|coredevice|debugbridge|swiftui|\.app\b/i, tool: "ios" },
  { re: /gstack-[a-z]/i, tool: "gstack-bin" },
  { re: /supabase/i, tool: "supabase" },
];

const rows = [];
for (const name of dirsIn(SRC).sort()) {
  const p = join(SRC, name, "SKILL.md");
  if (!existsSync(p)) continue;
  const body = readFileSync(p, "utf8");
  const lines = body.split("\n");
  const total = lines.length;
  const boiler = lines.filter((l) => /^#{1,3}\s/.test(l) && BOILERPLATE.test(l)).length;
  // crude logic-vs-boilerplate: count lines under boilerplate-ish headers is hard; use marker hits as a proxy
  const gstackHits = (body.match(/gstack-[a-z]/g) || []).length;
  const tools = TOOLS.filter((t) => t.re.test(body)).map((t) => t.tool);
  const desc = fm(body, "description") || (body.match(/^description:\s*[>|-]+\s*\n([\s\S]*?)(?:\n[a-z_]+:|\n---)/m)?.[1] || "").replace(/\s+/g, " ").trim();
  const collides = owned.has(name);
  rows.push({
    name, lines: total,
    boiler_headers: boiler,
    framework_refs: gstackHits,
    tools: tools.join("+") || "-",
    collision: collides ? (declared.has(name) ? "OWNED+WIRED" : "OWNED") : "new",
    desc: desc.slice(0, 70),
  });
}

if (JSON_OUT) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }

const big = rows.filter((r) => r.lines > 800).length;
const toolBound = rows.filter((r) => r.tools !== "-").length;
const collisions = rows.filter((r) => r.collision !== "new").length;

console.log(`# INTAKE — ${basename(SRC)}  (${rows.length} skills)\n`);
console.log(`Summary: ${big} large(>800 lines, heavy de-bloat candidates) · ${toolBound} tool-coupled · ${collisions} collide with skills we own\n`);
console.log("SKILL".padEnd(26) + "LINES".padEnd(7) + "FW-REFS".padEnd(8) + "TOOLS".padEnd(14) + "COLLISION".padEnd(12) + "DESC");
console.log("-".repeat(110));
for (const r of rows) {
  console.log(
    r.name.padEnd(26) +
    String(r.lines).padEnd(7) +
    String(r.framework_refs).padEnd(8) +
    r.tools.padEnd(14) +
    r.collision.padEnd(12) +
    r.desc
  );
}
console.log(`\nNext: TRIAGE each (KEEP / MERGE-into-X / OURS-better / DROP) by "does this make a Helmsman agent more efficient?",`);
console.log(`then PRIVATIZE keepers to harness/skill-standard.md (extract logic, shed the ${rows.reduce((a, r) => a + r.framework_refs, 0)} framework refs), INTEGRATE + audit.`);

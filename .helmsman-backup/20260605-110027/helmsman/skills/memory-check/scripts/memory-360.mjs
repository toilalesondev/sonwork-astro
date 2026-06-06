#!/usr/bin/env node
// memory-360.mjs — 360° health test for the Helmsman memory + learning layer.
// Standing dev test (re-run after any memory/skill/loop change). Read-only EXCEPT the optional
// --flywheel scratch page (created + deleted) and never touches the gbrain index (reindex is a
// separate, explicit operator step). Scores: recording integrity · query efficiency ·
// effectiveness (relevance/coverage/loop-yield) · linkage · loops · flywheel. Both backends.
//
// Usage:
//   node skills/memory-check/scripts/memory-360.mjs [--root R] [--source helmsman] [--backend gbrain|file] [--flywheel] [--json]
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const ROOT = opt("--root", process.cwd());
const SOURCE = opt("--source", "helmsman");
const BACKEND = opt("--backend", (() => { try { return readFileSync(join(ROOT, ".helmsman", "backend"), "utf8").trim(); } catch { return "gbrain"; } })());
const DO_FLYWHEEL = args.includes("--flywheel");
const JSON_OUT = args.includes("--json");
const skillsDir = join(ROOT, "skills");

const rows = [];
const add = (dim, name, status, note, metric) => rows.push({ dim, name, status, note, metric });
const dirsIn = (p) => { try { return readdirSync(p).filter((d) => { try { return statSync(join(p, d)).isDirectory(); } catch { return false; } }); } catch { return []; } };
const gbrain = (a, timeout = 60000) => execFileSync("gbrain", a, { encoding: "utf8", timeout, stdio: ["ignore", "pipe", "pipe"] });
const hasGbrain = () => { try { execFileSync("gbrain", ["--version"], { timeout: 8000, stdio: "ignore" }); return true; } catch { return false; } };

// ───────────────────────── 1. RECORDING INTEGRITY ─────────────────────────
function recording() {
  if (BACKEND === "gbrain" && hasGbrain()) {
    // stale-page detection: do any indexed pages reference deleted paths?
    let stale = 0, ghosts = [];
    try {
      const q = gbrain(["query", "skills-vendor", "--source", SOURCE, "--limit", "5"], 60000);
      ghosts = (q.match(/skills-vendor[-/][a-z0-9-]+/gi) || []);
      stale = ghosts.length;
    } catch {}
    add("recording", "stale-pages", stale === 0 ? "PASS" : "FAIL",
      stale === 0 ? "no deleted-path ghosts in index" : `index returns ${stale} deleted skills-vendor refs (STALE — reindex-code --source ${SOURCE})`, stale);
    // freshness: page count
    try { const s = gbrain(["sources", "list"], 20000); const m = s.match(new RegExp(`${SOURCE}\\s+\\w+\\s+(\\d+)\\s+pages`)); add("recording", "page-count", "INFO", `${m ? m[1] : "?"} pages indexed`, m ? +m[1] : null); } catch {}
  } else {
    // folder mode: process/context populated with real content?
    const ctx = join(ROOT, "process", "context", "all-context.md");
    let real = false; try { const t = readFileSync(ctx, "utf8"); real = t.length > 200 && !/placeholder|TODO: fill/i.test(t); } catch {}
    add("recording", "process/context", real ? "PASS" : "WARN", real ? "local memory has real content" : "process/context/all-context.md thin/placeholder/absent");
  }
  add("recording", "backend-flag", "INFO", `backend=${BACKEND}`);
}

// ───────────────────────── 2+3. QUERY EFFICIENCY + EFFECTIVENESS ─────────────────────────
// known topic -> a substring expected in the right page's slug/title (recall-precision probe)
const PROBES = [
  ["separation law one skill one concern", "skill-standard|skill-governance|governance"],
  ["hbrowse browser playwright tool", "browser-tool|hbrowse"],
  ["calibration loop E takes brier", "calibration|state|loop"],
  ["privatize skill pipeline", "privatize|skills-index|state"],
];
function queryEff() {
  if (!(BACKEND === "gbrain" && hasGbrain())) { add("query", "skipped", "INFO", "folder mode — no gbrain query layer"); return; }
  const lats = []; let hits = 0;
  for (const [q, expect] of PROBES) {
    const t0 = Date.now();
    let out = ""; try { out = gbrain(["query", q, "--source", SOURCE, "--limit", "3"], 60000); } catch (e) { out = ""; }
    const ms = Date.now() - t0; lats.push(ms);
    const re = new RegExp(expect, "i");
    const hit = re.test(out);
    if (hit) hits++;
    add("effectiveness", `recall:"${q.slice(0, 28)}"`, hit ? "PASS" : "WARN", hit ? `top-3 has ${expect.split("|")[0]} (${ms}ms)` : `right page NOT in top-3 (${ms}ms) — got: ${(out.match(/\] [a-z0-9-]+/i) || ["?"])[0]}`, ms);
  }
  const p50 = lats.sort((a, b) => a - b)[Math.floor(lats.length / 2)] || 0;
  add("query", "latency-p50", p50 <= 3000 ? "PASS" : "WARN", `${p50}ms p50 over ${lats.length} queries${p50 > 3000 ? " (slow; target ~3s)" : ""}`, p50);
  add("effectiveness", "recall-precision", hits === PROBES.length ? "PASS" : (hits >= PROBES.length / 2 ? "WARN" : "FAIL"), `${hits}/${PROBES.length} known topics returned the right page in top-3`, hits / PROBES.length);
}

// ───────────────────────── 3b. COVERAGE + LOOP-YIELD ─────────────────────────
function effectiveness() {
  // loop-yield: Loop E resolved takes accumulating?
  const takes = join(ROOT, "process", "takes");
  let resolved = 0; try { for (const f of readdirSync(takes).filter((f) => f.endsWith(".jsonl"))) resolved += readFileSync(join(takes, f), "utf8").split("\n").filter((l) => /"resolved":true/.test(l)).length; } catch {}
  add("effectiveness", "loop-yield:E-takes", resolved > 0 ? "PASS" : "WARN", `${resolved} resolved calibration takes (Loop E producing signal)`, resolved);
  // loop-yield: Loop C agent-memory accumulating?
  const am = join(ROOT, "process", "agent-memory");
  let amFiles = 0; try { amFiles = readdirSync(am, { recursive: true }).filter((f) => String(f).endsWith(".md")).length; } catch {}
  add("effectiveness", "loop-yield:C-agent-memory", amFiles > 0 ? "PASS" : "WARN", amFiles > 0 ? `${amFiles} agent-memory landmine files` : "no agent-memory accumulated yet (loop wired, not yet exercised in a real project)", amFiles);
}

// ───────────────────────── 4. LINKAGE ─────────────────────────
function linkage() {
  // every memory-touching skill references a tier; sample-check
  const memVerb = /\b(recall|write-back|writeback|remember|persist|agent-memory|gbrain (put|get|takes))\b/i;
  const anchor = /\.helmsman\/backend|process\/(context|takes|backlog)|agent-memory|gbrain|AGENTS\.md|one memory/i;
  let bad = 0; for (const s of dirsIn(skillsDir)) { const b = readFileSync(join(skillsDir, s, "SKILL.md"), "utf8"); if (memVerb.test(b) && !anchor.test(b)) bad++; }
  add("linkage", "skills→memory", bad === 0 ? "PASS" : "WARN", bad === 0 ? "all memory-touching skills link a tier" : `${bad} memory-touching skills missing a tier anchor`);
  // every agent recalls
  const adir = join(ROOT, "agents"); let noRecall = 0, n = 0;
  for (const f of readdirSync(adir).filter((f) => f.endsWith(".md"))) { n++; if (!/recall|memory|capture/i.test(readFileSync(join(adir, f), "utf8"))) noRecall++; }
  add("linkage", "agents→recall", noRecall === 0 ? "PASS" : "WARN", `${n - noRecall}/${n} agents reference recall/memory`);
}

// ───────────────────────── 5. LOOPS RUN ─────────────────────────
function loops() {
  const node = process.execPath;
  const tryrun = (label, a, ok) => { try { const o = execFileSync(node, a, { cwd: ROOT, encoding: "utf8", timeout: 60000, stdio: ["ignore", "pipe", "pipe"] }); add("loops", label, ok(o) ? "PASS" : "WARN", ok(o) ? "ran" : "ran (unexpected output)"); } catch (e) { add("loops", label, "FAIL", String(e.message).split("\n")[0].slice(0, 90)); } };
  if (existsSync(join(skillsDir, "calibrate/scripts/score-takes.mjs"))) tryrun("E:calibrate", ["skills/calibrate/scripts/score-takes.mjs", "process/takes"], (o) => /accuracy|not enough/i.test(o));
  if (existsSync(join(skillsDir, "adherence-check/scripts/hfr.mjs"))) tryrun("adherence:HFR", ["--check", "skills/adherence-check/scripts/hfr.mjs"], () => true); // syntax-level (hfr needs a trajectory arg)
  // capture/evolve/refine are prose+gbrain — presence + linkage already covered; mark wired
  for (const [lp, sk] of [["A:capture", "capture"], ["C:evolve-memory", "evolve-memory"], ["B:refine", "refine"]]) add("loops", lp, existsSync(join(skillsDir, sk)) ? "PASS" : "FAIL", existsSync(join(skillsDir, sk)) ? "skill present + wired" : "missing");
}

// ───────────────────────── 6. FLYWHEEL ─────────────────────────
function flywheel() {
  if (!DO_FLYWHEEL) { add("flywheel", "skipped", "INFO", "pass --flywheel to run the learn→recall cross-session demo"); return; }
  const token = `flywheel-probe-${Date.now()}`;
  if (BACKEND === "gbrain" && hasGbrain()) {
    let captured = "";
    try {
      const out = gbrain(["capture", `MEMORY-360 flywheel probe: ${token}. A learning stored in session 1.`, "--source", SOURCE], 60000);
      captured = (out.match(/[a-z0-9/_-]+\/\d{4}-\d{2}-\d{2}[a-z0-9-]*/i) || [])[0] || ""; // the created slug
      // "session 2": recall it
      const got = gbrain(["query", `flywheel probe ${token}`, "--source", SOURCE, "--limit", "3"], 60000);
      const recalled = got.includes(token);
      add("flywheel", "learn→recall(gbrain)", recalled ? "PASS" : "WARN", recalled ? "session-2 recalled session-1 learning" : "stored but not recalled (index lag? re-run after sync)");
    } catch (e) { add("flywheel", "learn→recall(gbrain)", "FAIL", String(e.message).slice(0, 80)); }
    // auto-cleanup the scratch page (don't leave probe noise in the brain)
    if (captured) { try { gbrain(["delete", captured, "--source", SOURCE], 30000); add("flywheel", "cleanup", "PASS", `removed scratch page ${captured}`); } catch { add("flywheel", "cleanup", "WARN", `could not auto-delete ${captured} — remove manually`); } }
  } else {
    // folder mode: write to process/context, read back (mkdir -p first — source repo may lack it)
    const dir = join(ROOT, "process", "context");
    const f = join(dir, "_flywheel-test.md");
    try { mkdirSync(dir, { recursive: true }); writeFileSync(f, `# flywheel\n${token}\n`); const back = readFileSync(f, "utf8").includes(token); add("flywheel", "learn→recall(file)", back ? "PASS" : "FAIL", back ? "wrote+recalled from process/context" : "readback failed"); rmSync(f, { force: true }); }
    catch (e) { add("flywheel", "learn→recall(file)", "FAIL", String(e.message).slice(0, 80)); }
  }
}

recording(); queryEff(); effectiveness(); linkage(); loops(); flywheel();

if (JSON_OUT) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }
console.log(`# memory-360 — ${SOURCE} (backend=${BACKEND})\n`);
let lastDim = "";
for (const r of rows) {
  if (r.dim !== lastDim) { console.log(`\n## ${r.dim}`); lastDim = r.dim; }
  const icon = r.status === "PASS" ? "✓" : r.status === "FAIL" ? "✗" : r.status === "WARN" ? "⚠" : "·";
  console.log(`  ${icon} ${r.name} — ${r.note}`);
}
const fails = rows.filter((r) => r.status === "FAIL").length;
const warns = rows.filter((r) => r.status === "WARN").length;
console.log(`\nResult: ${rows.filter((r) => r.status === "PASS").length} pass · ${warns} warn · ${fails} fail`);
process.exit(fails ? 1 : 0);

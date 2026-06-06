#!/usr/bin/env node
// validate-adherence-check.mjs — self-check for the adherence-check skill.
// Asserts hfr.mjs computes the rate correctly, honors the honesty guard, and
// emits Loop-B refine candidates on repeat-drift. Run from repo root:
//   node skills/adherence-check/scripts/validate-adherence-check.mjs
// Exit 0 = contract holds, 1 = a behavior broke.
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HFR = join(dirname(fileURLToPath(import.meta.url)), "hfr.mjs");
const tmp = mkdtempSync(join(tmpdir(), "hfr-validate-"));
const fails = [];
const run = (file, extra = []) => {
  try { return execFileSync("node", [HFR, file, ...extra], { encoding: "utf8" }); }
  catch (e) { return (e.stdout || "") + (e.stderr || ""); }
};
const write = (name, obj) => { const p = join(tmp, name); writeFileSync(p, JSON.stringify(obj)); return p; };

try {
  // 1. HFR math: 3 followed + 1 drifted → 0.75.
  const p1 = write("a.json", { run_id: "a", obligations: [
    { id: "o1", status: "followed" }, { id: "o2", status: "followed" },
    { id: "o3", status: "followed" }, { id: "o4", status: "drifted" },
  ]});
  const out1 = run(p1);
  if (!out1.includes("HFR: 0.75")) fails.push(`math: expected HFR 0.75, got:\n${out1}`);
  if (!/Drifted obligations/.test(out1)) fails.push("math: drifted obligation not listed");

  // 2. Honesty guard: <3 active obligations → refuse to score.
  const p2 = write("tiny.json", { run_id: "t", obligations: [
    { id: "o1", status: "followed" }, { id: "o2", status: "drifted" },
  ]});
  const out2 = run(p2);
  if (!/HFR:\s*n\/a/.test(out2)) fails.push(`honesty-guard: expected 'n/a' on <3, got:\n${out2}`);

  // 3. Loop-B trigger: same obligation drifts across history → refine candidate.
  const hist = mkdtempSync(join(tmpdir(), "hfr-hist-"));
  const drifter = { run_id: "h", obligations: [
    { id: "repeat", status: "drifted", source: "agents/x.md:1" },
    { id: "ok1", status: "followed" }, { id: "ok2", status: "followed" },
  ]};
  write("cur.json", drifter);
  writeFileSync(join(hist, "h1.json"), JSON.stringify(drifter));
  writeFileSync(join(hist, "h2.json"), JSON.stringify(drifter));
  const out3 = run(join(tmp, "cur.json"), ["--history", hist]);
  if (!/Refine candidates/.test(out3)) fails.push(`loop-B: expected refine candidate on repeat-drift, got:\n${out3}`);
  rmSync(hist, { recursive: true, force: true });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (fails.length) {
  console.error("[adherence-check-validate] FAIL:\n - " + fails.join("\n - "));
  process.exit(1);
}
console.log("[adherence-check-validate] OK — HFR math, honesty guard, and Loop-B trigger all hold.");
process.exit(0);

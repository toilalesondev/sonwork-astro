#!/usr/bin/env node
// score-takes.mjs — native calibration scorer for STANDALONE mode (Loop E).
// Reads the file takes-ledger (process/takes/*.jsonl) and computes accuracy + Brier
// score over RESOLVED bets — no gbrain required. In gbrain mode, `gbrain takes scorecard`
// is the source instead; this is the portable equivalent so calibration works standalone.
//
// Ledger line shape (one JSON object per line, append-only):
//   {"id":"t1","holder":"brain","kind":"bet","claim":"X will happen","weight":0.7,
//    "since":"2026-06-03","resolved":true,"outcome":true}
//   - kind:   fact | take | bet | hunch   (only bets/takes with weight+outcome score)
//   - weight: 0..1 stated confidence
//   - resolved: true once reality decided it; outcome: true=correct, false=incorrect
//   - omit "resolved" (or false) for open bets — they're counted but not scored.
//
// Usage:
//   node score-takes.mjs <takes-dir>            (default: process/takes)
//   node score-takes.mjs <takes-dir> --holder brain
// Exit 0 always (measurement, not a gate). Honest "not enough resolved" when thin.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--")) || "process/takes";
const hi = args.indexOf("--holder");
const holderFilter = hi >= 0 ? args[hi + 1] : null;

if (!existsSync(dir)) {
  console.log(`[calibrate] no takes ledger at ${dir} — nothing to score yet (create bets first).`);
  process.exit(0);
}

const rows = [];
for (const f of readdirSync(dir).filter((f) => f.endsWith(".jsonl"))) {
  const txt = readFileSync(join(dir, f), "utf8");
  for (const line of txt.split("\n")) {
    const s = line.trim();
    if (!s) continue;
    try { rows.push(JSON.parse(s)); } catch { /* skip malformed line */ }
  }
}

const bets = rows.filter((r) =>
  (r.kind === "bet" || r.kind === "take") &&
  typeof r.weight === "number" &&
  (!holderFilter || r.holder === holderFilter));
const resolved = bets.filter((r) => r.resolved === true && typeof r.outcome === "boolean");

if (resolved.length < 3) {
  console.log(`[calibrate] not enough resolved bets to calibrate yet ` +
    `(${resolved.length} resolved${holderFilter ? ` for holder=${holderFilter}` : ""}; need >=3). ` +
    `Honest result — the signal accrues as bets resolve.`);
  process.exit(0);
}

const correct = resolved.filter((r) => r.outcome === true).length;
const incorrect = resolved.length - correct;
const accuracy = correct / resolved.length;
// Brier: mean squared error between stated weight and outcome (1=true,0=false). Lower=better.
const brier = resolved.reduce((acc, r) => {
  const o = r.outcome ? 1 : 0;
  return acc + (r.weight - o) ** 2;
}, 0) / resolved.length;

console.log(`[calibrate] Loop E scorecard (standalone, ${dir})${holderFilter ? ` holder=${holderFilter}` : ""}:`);
console.log(`  resolved bets : ${resolved.length}  (correct ${correct} / incorrect ${incorrect})`);
console.log(`  accuracy      : ${(accuracy * 100).toFixed(0)}%`);
console.log(`  Brier score   : ${brier.toFixed(3)}  (0 = perfect; lower is better)`);
const openCount = bets.length - resolved.length;
if (openCount > 0) console.log(`  open bets     : ${openCount} (unresolved — not yet scored)`);
// Honest calibration read.
if (accuracy >= 0.95 && resolved.length < 10) {
  console.log(`  note: ${(accuracy*100).toFixed(0)}% on a small sample suggests well-calibrated OR underconfident — ` +
    `a brain that's only ever right is under-betting. More resolved bets (incl. wrong ones) sharpen this.`);
}
process.exit(0);

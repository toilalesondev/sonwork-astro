#!/usr/bin/env node
// hfr.mjs — native Harness Following Rate (adherence) computation.
// Helmsman-native re-implementation of the HFR diagnostic (algorithm credited to
// Lin et al. 2026 "Harness Updating Is Not Harness Benefit", hfr_analysis/pipeline.py).
// Zero dependencies, provider-agnostic. The MATH is here; the JUDGMENT of which
// obligations were followed (with evidence) is the agent's, captured in the input.
//
// Usage:
//   node skills/adherence-check/scripts/hfr.mjs <obligations.json>
//
// Input JSON shape:
//   {
//     "run_id": "build-2026-06-03-xyz",
//     "obligations": [
//       { "id": "verify:reject-cost-over-balance", "source": "process/active/loyalty.md:42",
//         "status": "followed",  "evidence": "test loyalty.test.ts:88 red->green", "position": "mid" },
//       { "id": "skill:rls-denied-path", "source": "agents/backend.md:99",
//         "status": "drifted",   "evidence": null, "position": "late" },
//       { "id": "rule:prove-dont-claim", "source": "operating-rules.md:13",
//         "status": "n-a" }
//     ]
//   }
//
// status ∈ followed | drifted | n-a   ·   position ∈ early | mid | late (optional)
// Exit 0 always (it's a measurement, not a gate). Prints HFR + drift breakdown + Loop-B
// refine candidates. With --history <dir> it folds prior runs to find repeat-drift.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const inputPath = args.find((a) => !a.startsWith("--"));
const histFlagIdx = args.indexOf("--history");
const histDir = histFlagIdx >= 0 ? args[histFlagIdx + 1] : null;

if (!inputPath) {
  console.error("usage: node hfr.mjs <obligations.json> [--history <dir>]");
  process.exit(2);
}

const load = (p) => JSON.parse(readFileSync(p, "utf8"));

let data;
try { data = load(inputPath); } catch (e) {
  console.error(`[hfr] cannot read ${inputPath}: ${e.message}`);
  process.exit(2);
}

const obligations = Array.isArray(data.obligations) ? data.obligations : [];
const active = obligations.filter((o) => o.status === "followed" || o.status === "drifted");
const followed = active.filter((o) => o.status === "followed");
const drifted = active.filter((o) => o.status === "drifted");

// Honesty guard (Rule 1): too little to measure.
if (active.length < 3) {
  console.log(`HFR: n/a — trajectory too short to measure adherence (${active.length} active obligation(s); need >=3).`);
  process.exit(0);
}

const hfr = followed.length / active.length;

// --- repeat-drift across history (feeds Loop B) ---
const driftCounts = new Map(); // obligation id -> {runs, total, source}
const noteDrift = (o, didDrift) => {
  const cur = driftCounts.get(o.id) ?? { runs: 0, total: 0, source: o.source ?? "?" };
  cur.total += 1;
  if (didDrift) cur.runs += 1;
  driftCounts.set(o.id, cur);
};
for (const o of active) noteDrift(o, o.status === "drifted");

if (histDir && existsSync(histDir)) {
  for (const f of readdirSync(histDir).filter((f) => f.endsWith(".json"))) {
    try {
      const h = load(join(histDir, f));
      for (const o of (h.obligations ?? [])) {
        if (o.status === "followed" || o.status === "drifted") noteDrift(o, o.status === "drifted");
      }
    } catch { /* skip unreadable history file */ }
  }
}

// --- report ---
console.log(`HFR: ${hfr.toFixed(2)}  (followed ${followed.length} / ${active.length} active obligations)`);

if (drifted.length > 0) {
  console.log(`\nDrifted obligations:`);
  for (const o of drifted) {
    const pos = o.position ? `  [drift position: ${o.position}]` : "";
    console.log(`  - ${o.id}  [source: ${o.source ?? "?"}]${pos}`);
  }
  const late = drifted.filter((o) => o.position === "late").length;
  if (late > 0) console.log(`  ⚠ ${late} late-run drift(s) — the paper's signature failure mode.`);
}

// Loop-B refine candidates: same obligation drifted in >=2 runs OR >=50% of its runs.
const refineCandidates = [];
for (const [id, c] of driftCounts) {
  if (c.runs >= 2 || (c.total >= 2 && c.runs / c.total >= 0.5)) {
    refineCandidates.push({ id, ...c });
  }
}
if (refineCandidates.length > 0) {
  console.log(`\nRefine candidates (Loop B — see harness/refine.md):`);
  for (const c of refineCandidates) {
    console.log(`  - ${c.id} drifted in ${c.runs}/${c.total} run(s) → ${c.source} wording may be at fault`);
  }
} else {
  console.log(`\nNo repeat-drift patterns — no Loop-B refine candidates.`);
}

process.exit(0);

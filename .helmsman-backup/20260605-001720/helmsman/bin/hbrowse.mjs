#!/usr/bin/env node
// hbrowse — Helmsman's owned browser CLI (client to hbrowse-daemon, Playwright).
// Skills call this: `hbrowse <verb> [args]`. Auto-starts the daemon, sends the verb, prints JSON.
//
// Verbs: goto <url> · text · html · console · network · screenshot [path] [--full] · css <sel> ·
//   attrs <sel> · is-visible <sel> · snapshot · click <sel> · fill <sel> <value> · hover <sel> ·
//   upload <sel> <file...> · dialog [--dismiss] · js <expr> · viewport <w> <h> · responsive ·
//   diff [beforePath] · vitals · cleanup · ping
//
// If Playwright/daemon is unavailable it prints {ok:false,error:...} and exits non-zero —
// skills MUST surface that honestly, never fake a browser result (operating-rules Rule 1/3).
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const PORT = Number(process.env.HBROWSE_PORT || 34599);
const HERE = dirname(fileURLToPath(import.meta.url));
const DAEMON = join(HERE, "hbrowse-daemon.mjs");

const [verb, ...rest] = process.argv.slice(2);
if (!verb || verb === "--help" || verb === "-h") {
  console.log("usage: hbrowse <verb> [args]   (verbs: goto text html console network screenshot css attrs is-visible snapshot click fill hover upload dialog js viewport responsive diff vitals cleanup ping)");
  process.exit(verb ? 0 : 2);
}

// map positional args → payload per verb
function payloadFor(v, a) {
  switch (v) {
    case "goto": return { url: a[0] };
    case "screenshot": return { path: a.find((x) => !x.startsWith("--")), fullPage: a.includes("--full") };
    case "css": case "attrs": case "is-visible": case "click": case "hover": return { selector: a[0] };
    case "fill": return { selector: a[0], value: a.slice(1).join(" ") };
    case "upload": return { selector: a[0], files: a.slice(1) };
    case "dialog": return { accept: !a.includes("--dismiss") };
    case "js": return { expr: a.join(" ") };
    case "viewport": return { width: Number(a[0]), height: Number(a[1]) };
    case "diff": return { before: a[0] || null };
    default: return {};
  }
}

async function send(v, payload, timeoutMs = 45000) {
  const res = await fetch(`http://127.0.0.1:${PORT}/${v}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(timeoutMs) });
  return res.json();
}

async function daemonUp() { try { const r = await send("ping", {}, 1500); return r?.ok; } catch { return false; } }

async function startDaemon() {
  if (!existsSync(DAEMON)) return false;
  // Fully detach: NO inherited pipes at all (stdio:'ignore'), new session (detached) so no fd
  // ever ties back to this client or its caller — the client exits clean; nothing hangs on the daemon.
  const child = spawn(process.execPath, [DAEMON], { detached: true, stdio: "ignore", env: process.env });
  child.unref();
  // Confirm readiness by polling the PORT (not a pipe).
  for (let i = 0; i < 60; i++) { if (await daemonUp()) return true; await new Promise((r) => setTimeout(r, 250)); }
  return false;
}

(async () => {
  if (!(await daemonUp())) {
    const ok = await startDaemon();
    // small grace for the listener
    if (ok) { for (let i = 0; i < 20 && !(await daemonUp()); i++) await new Promise((r) => setTimeout(r, 250)); }
    if (!(await daemonUp())) {
      console.log(JSON.stringify({ ok: false, error: "hbrowse daemon unavailable (Playwright not installed? run `npm install` in the helmsman repo, then `npx playwright install chromium`)." }));
      process.exit(3);
    }
  }
  try {
    const out = await send(verb, payloadFor(verb, rest));
    console.log(JSON.stringify(out));
    process.exit(out.ok === false ? 1 : 0);
  } catch (e) {
    console.log(JSON.stringify({ ok: false, error: String(e?.message || e) }));
    process.exit(3);
  }
})();

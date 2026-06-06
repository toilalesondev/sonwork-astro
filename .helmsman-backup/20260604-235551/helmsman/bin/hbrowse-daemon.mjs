#!/usr/bin/env node
// hbrowse-daemon — Helmsman's owned browser tool (Playwright). Holds ONE Chromium + context +
// page; exposes ~20 verbs over loopback HTTP. Single-instance (pidfile+port), idle-exits.
// Started automatically by `bin/hbrowse`; you rarely run this directly.
//
//   PORT: HBROWSE_PORT (default 34599, loopback only)
//   IDLE: HBROWSE_IDLE_MS (default 180000 — exit after 3min of no commands)
//   HEADED: HBROWSE_HEADED=1 to show the browser (default headless)
import http from "node:http";
import { writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PORT = Number(process.env.HBROWSE_PORT || 34599);
const IDLE_MS = Number(process.env.HBROWSE_IDLE_MS || 180000);
const HEADED = process.env.HBROWSE_HEADED === "1";
const STATE = join(tmpdir(), "hbrowse");
mkdirSync(STATE, { recursive: true });
const PIDFILE = join(STATE, "daemon.pid");
const SHOT_DIR = join(STATE, "shots");
mkdirSync(SHOT_DIR, { recursive: true });

let chromium;
try { ({ chromium } = await import("playwright")); }
catch { console.error("hbrowse-daemon: playwright not installed — run `npm install` in the helmsman repo (or `npx playwright install chromium`)."); process.exit(3); }

let browser, context, page;
let lastReq = Date.now();
const consoleBuf = [];
const networkBuf = [];

async function ensurePage() {
  if (!browser) {
    browser = await chromium.launch({ headless: !HEADED });
    context = await browser.newContext();
    page = await context.newPage();
    page.on("console", (m) => { consoleBuf.push({ type: m.type(), text: m.text() }); if (consoleBuf.length > 500) consoleBuf.shift(); });
    page.on("requestfailed", (r) => { networkBuf.push({ url: r.url(), failure: r.failure()?.errorText || "failed", method: r.method() }); if (networkBuf.length > 500) networkBuf.shift(); });
    page.on("response", (r) => { if (r.status() >= 400) networkBuf.push({ url: r.url(), status: r.status(), method: r.request().method() }); if (networkBuf.length > 500) networkBuf.shift(); });
  }
  return page;
}

// resolve a selector that may be a snapshot ref (@e3) or a CSS/text selector
const snapRefs = new Map();
function resolveSel(sel) {
  if (typeof sel === "string" && sel.startsWith("@")) {
    const r = snapRefs.get(sel);
    if (!r) throw new Error(`unknown snapshot ref ${sel} — run snapshot first`);
    return r;
  }
  return sel;
}

const verbs = {
  async goto({ url }) { const p = await ensurePage(); consoleBuf.length = 0; networkBuf.length = 0; const resp = await p.goto(url, { waitUntil: "load", timeout: 30000 }); return { url: p.url(), status: resp?.status() ?? null, title: await p.title() }; },
  async text() { const p = await ensurePage(); return { text: (await p.innerText("body")).slice(0, 20000) }; },
  async html() { const p = await ensurePage(); return { html: (await p.content()).slice(0, 60000) }; },
  async console() { return { console: consoleBuf.slice(-100), errors: consoleBuf.filter((c) => c.type === "error").length }; },
  async network() { return { network: networkBuf.slice(-100), failures: networkBuf.length }; },
  async screenshot({ path, fullPage }) { const p = await ensurePage(); const out = path || join(SHOT_DIR, `shot-${Date.now()}.png`); await p.screenshot({ path: out, fullPage: !!fullPage }); return { screenshot: out }; },
  async css({ selector }) { const p = await ensurePage(); const els = await p.$$eval(resolveSel(selector), (ns) => ns.slice(0, 50).map((n) => n.outerHTML.slice(0, 300))); return { count: els.length, matches: els }; },
  async attrs({ selector }) { const p = await ensurePage(); const a = await p.$eval(resolveSel(selector), (n) => Object.fromEntries([...n.attributes].map((x) => [x.name, x.value]))); return { attrs: a }; },
  async ["is-visible"]({ selector }) { const p = await ensurePage(); return { visible: await p.isVisible(resolveSel(selector)) }; },
  async snapshot() {
    const p = await ensurePage();
    const items = await p.$$eval("a,button,input,select,textarea,[role=button],[role=link]", (ns) =>
      ns.slice(0, 80).map((n, i) => ({ i, tag: n.tagName.toLowerCase(), type: n.getAttribute("type") || "", text: (n.innerText || n.value || n.getAttribute("aria-label") || n.getAttribute("placeholder") || "").trim().slice(0, 50) })));
    snapRefs.clear();
    const out = items.map((it) => { const ref = `@e${it.i}`; return { ref, ...it }; });
    // store selectors (nth-match by tag) — re-query at action time
    for (const it of items) snapRefs.set(`@e${it.i}`, `:is(a,button,input,select,textarea,[role=button],[role=link]) >> nth=${it.i}`);
    return { interactive: out };
  },
  async click({ selector }) { const p = await ensurePage(); await p.click(resolveSel(selector), { timeout: 10000 }); return { clicked: selector, url: p.url() }; },
  async fill({ selector, value }) { const p = await ensurePage(); await p.fill(resolveSel(selector), value ?? "", { timeout: 10000 }); return { filled: selector }; },
  async hover({ selector }) { const p = await ensurePage(); await p.hover(resolveSel(selector), { timeout: 10000 }); return { hovered: selector }; },
  async upload({ selector, files }) { const p = await ensurePage(); await p.setInputFiles(resolveSel(selector), files || []); return { uploaded: files }; },
  async dialog({ accept }) { const p = await ensurePage(); p.once("dialog", (d) => (accept === false ? d.dismiss() : d.accept())); return { dialog: accept === false ? "will-dismiss" : "will-accept" }; },
  async js({ expr }) { const p = await ensurePage(); const r = await p.evaluate((e) => { try { return JSON.parse(JSON.stringify(eval(e))); } catch (err) { return String(err); } }, expr); return { result: r }; },
  async viewport({ width, height }) { const p = await ensurePage(); await p.setViewportSize({ width: Number(width) || 1280, height: Number(height) || 800 }); return { viewport: { width, height } }; },
  async responsive() {
    const p = await ensurePage(); const out = {};
    for (const [name, w, h] of [["mobile", 390, 844], ["tablet", 820, 1180], ["desktop", 1440, 900]]) {
      await p.setViewportSize({ width: w, height: h }); const f = join(SHOT_DIR, `resp-${name}-${Date.now()}.png`); await p.screenshot({ path: f }); out[name] = f;
    }
    return { responsive: out };
  },
  async diff({ before }) { const p = await ensurePage(); const after = join(SHOT_DIR, `diff-after-${Date.now()}.png`); await p.screenshot({ path: after }); return { before: before || null, after, note: "compare the two PNGs (pixel diff is the caller's job)" }; },
  async vitals() {
    const p = await ensurePage();
    const nav = await p.evaluate(() => { const t = performance.getEntriesByType("navigation")[0]; return t ? { domContentLoaded: Math.round(t.domContentLoadedEventEnd), load: Math.round(t.loadEventEnd), ttfb: Math.round(t.responseStart) } : {}; });
    const paint = await p.evaluate(() => Object.fromEntries(performance.getEntriesByType("paint").map((e) => [e.name, Math.round(e.startTime)])));
    return { vitals: { ...nav, firstContentfulPaint: paint["first-contentful-paint"] ?? null }, note: "LCP/CLS/INP need the web-vitals lib injected for full accuracy; nav timings are exact." };
  },
  async cleanup() { if (browser) { await browser.close().catch(() => {}); browser = context = page = undefined; } return { cleaned: true }; },
  async ping() { return { ok: true, pid: process.pid, hasPage: !!page }; },
};

const server = http.createServer((req, res) => {
  lastReq = Date.now();
  if (req.method !== "POST") { res.writeHead(405); return res.end("POST only"); }
  let body = ""; req.on("data", (c) => (body += c)); req.on("end", async () => {
    let payload = {}; try { payload = body ? JSON.parse(body) : {}; } catch {}
    const verb = (req.url || "").replace(/^\//, "");
    const fn = verbs[verb];
    res.setHeader("content-type", "application/json");
    if (!fn) { res.writeHead(400); return res.end(JSON.stringify({ error: `unknown verb '${verb}'`, verbs: Object.keys(verbs) })); }
    try { const out = await fn(payload); res.writeHead(200); res.end(JSON.stringify({ ok: true, verb, ...out })); }
    catch (e) { res.writeHead(200); res.end(JSON.stringify({ ok: false, verb, error: String(e?.message || e) })); }
    if (verb === "cleanup") { setTimeout(() => shutdown(0), 100); }
  });
});

function shutdown(code) { try { rmSync(PIDFILE, { force: true }); } catch {} server.close(); if (browser) browser.close().catch(() => {}); process.exit(code); }
process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));
setInterval(() => { if (Date.now() - lastReq > IDLE_MS) shutdown(0); }, 15000).unref();

server.listen(PORT, "127.0.0.1", () => {
  writeFileSync(PIDFILE, String(process.pid));
  // Readiness is written to a file (not relied on via stdout) so callers poll the PORT/file,
  // never a pipe — nothing downstream blocks on this long-lived process.
  try { writeFileSync(join(STATE, "ready"), `${PORT} ${process.pid}\n`); } catch {}
});
server.on("error", (e) => { if (e.code === "EADDRINUSE") { process.stderr.write(`hbrowse-daemon: port ${PORT} in use (already running?)\n`); process.exit(4); } else throw e; });

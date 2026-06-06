#!/usr/bin/env node
// hooks/claude/privacy-block.js — Claude Code PreToolUse hook.
// Blocks Read/Edit/Write on secret files. Claude passes the tool input as JSON on stdin.
// Exit 2 = block the tool call (Claude convention); exit 0 = allow.

const SECRET_PATTERNS = [
  /(^|\/)\.env(\.|$)/i, /(^|\/)\.envrc$/i, /\.pem$/i, /\.key$/i,
  /(^|\/)id_rsa(\.|$)/i, /(^|\/)id_ed25519(\.|$)/i, /(^|\/)\.ssh\//i,
  /(^|\/)credentials(\.json|\.ya?ml)?$/i, /(^|\/)\.aws\//i,
  /(^|\/)\.gbrain\.env$/i, /secrets?\.(json|ya?ml|toml)$/i,
];
const SAFE = [/\.env\.example$/i, /\.env\.sample$/i, /\.env\.template$/i];
const isSecret = (p) => !!p && !SAFE.some((re) => re.test(p)) && SECRET_PATTERNS.some((re) => re.test(p));

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let payload = {};
  try { payload = JSON.parse(raw || "{}"); } catch { /* allow on parse fail */ }
  const inp = payload.tool_input || payload.input || {};
  const fp = inp.file_path || inp.filePath || inp.path || "";
  if (isSecret(fp)) {
    process.stderr.write(
      `[Helmsman privacy-block] Refusing to access secret file: ${fp}. ` +
      `Share the specific value over a secure channel instead.\n`
    );
    process.exit(2); // block
  }
  process.exit(0); // allow
});

#!/usr/bin/env node
// hooks/lib/privacy.test.js — headless proof the privacy patterns block the right paths.
// Run: node hooks/lib/privacy.test.js   (exit 0 = pass)
const { isSecret } = (() => {
  const m = require("./privacy.js");
  return { isSecret: m.isSecretPath };
})();

const BLOCK = [".env", ".env.local", "config/.env.production", "id_rsa", "deploy.pem",
  "secrets.json", ".aws/credentials", "app/.ssh/key", ".gbrain.env"];
const ALLOW = [".env.example", ".env.sample", "src/index.ts", "README.md",
  "config/settings.ts", "enveloper.js"];

let fail = 0;
for (const p of BLOCK) if (!isSecret(p)) { console.error(`FAIL: should block ${p}`); fail++; }
for (const p of ALLOW) if (isSecret(p)) { console.error(`FAIL: should allow ${p}`); fail++; }

if (fail) { console.error(`\n${fail} failure(s)`); process.exit(1); }
console.log(`PASS: ${BLOCK.length} blocked, ${ALLOW.length} allowed — privacy patterns correct.`);
process.exit(0);

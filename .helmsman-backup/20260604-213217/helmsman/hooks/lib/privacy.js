// hooks/lib/privacy.js — shared secret-file patterns (used by both opencode + Claude adapters)
// One logic source; the host adapters import/mirror these patterns.

const SECRET_PATH_PATTERNS = [
  /(^|\/)\.env(\.|$)/i,          // .env, .env.local, .env.production
  /(^|\/)\.envrc$/i,
  /\.pem$/i,
  /\.key$/i,
  /(^|\/)id_rsa(\.|$)/i,
  /(^|\/)id_ed25519(\.|$)/i,
  /(^|\/)\.ssh\//i,
  /(^|\/)credentials(\.json|\.yaml|\.yml)?$/i,
  /(^|\/)\.aws\//i,
  /(^|\/)\.gbrain\.env$/i,
  /secrets?\.(json|ya?ml|toml)$/i,
];

// Explicit allowlist — example/sample files are safe to read.
const SAFE_SUFFIXES = [/\.env\.example$/i, /\.env\.sample$/i, /\.env\.template$/i];

function isSecretPath(filePath) {
  if (!filePath) return false;
  const p = String(filePath);
  if (SAFE_SUFFIXES.some((re) => re.test(p))) return false;
  return SECRET_PATH_PATTERNS.some((re) => re.test(p));
}

module.exports = { isSecretPath, SECRET_PATH_PATTERNS, SAFE_SUFFIXES };

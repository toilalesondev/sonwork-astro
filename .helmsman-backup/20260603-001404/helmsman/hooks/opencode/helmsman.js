// hooks/opencode/helmsman.js — Helmsman enforcement plugin for opencode.
//
// Installed to: <project>/.opencode/plugins/helmsman.js (by install.sh).
// One plugin wires all Helmsman structural guards on the opencode side.
// Mirror logic lives in hooks/lib/privacy.js and the Claude adapter (hooks/claude/).
//
// Guards:
//   1. privacy-block   — block reading secret files (.env, keys, .pem)         [HARD throw]
//   2. session-hydrate — re-inject Helmsman rules + active plan on compaction  [context push]
//
// NOTE: opencode plugins run with the project as cwd. We resolve the shared
// privacy patterns inline (no require of repo-relative lib, since the plugin is
// copied into .opencode/plugins/ standalone).

const SECRET_PATTERNS = [
  /(^|\/)\.env(\.|$)/i, /(^|\/)\.envrc$/i, /\.pem$/i, /\.key$/i,
  /(^|\/)id_rsa(\.|$)/i, /(^|\/)id_ed25519(\.|$)/i, /(^|\/)\.ssh\//i,
  /(^|\/)credentials(\.json|\.ya?ml)?$/i, /(^|\/)\.aws\//i,
  /(^|\/)\.gbrain\.env$/i, /secrets?\.(json|ya?ml|toml)$/i,
];
const SAFE = [/\.env\.example$/i, /\.env\.sample$/i, /\.env\.template$/i];
const isSecret = (p) => !!p && !SAFE.some((re) => re.test(p)) && SECRET_PATTERNS.some((re) => re.test(p));

export const HelmsmanPlugin = async ({ directory }) => {
  return {
    // 1. Privacy-block: refuse to read secret files (Rule: never leak secrets).
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read") {
        const fp = output?.args?.filePath || output?.args?.path || "";
        if (isSecret(fp)) {
          throw new Error(
            `[Helmsman privacy-block] Refusing to read secret file: ${fp}. ` +
            `Ask the user to share the specific value over a secure channel instead.`
          );
        }
      }
    },

    // 2. Session-hydrate: when a session compacts, re-inject the Helmsman operating
    //    rules + a pointer to the active plan + local context so the agent does not
    //    "forget" the harness contract after compaction.
    "experimental.session.compacting": async (input, output) => {
      output.context = output.context || [];
      output.context.push(
        `## Helmsman contract (re-injected after compaction)
- The orchestrator ROUTES, never executes (see AGENTS.md / harness/iron-law.md).
- Operating Rules hold: prove-don't-claim, follow the gates, never fake, stay in lane.
- Memory is two-tier: read process/context/ first (local), then gbrain (durable).
- Resume any in-flight work from process/active/ before starting new work.`
      );
    },
  };
};

// hooks/opencode/helmsman.js — Helmsman enforcement plugin for opencode.
//
// Installed to: <project>/.opencode/plugins/helmsman.js (by install.sh).
// One plugin wires all Helmsman structural guards on the opencode side.
// Mirror logic lives in hooks/lib/privacy.js and the Claude adapter (hooks/claude/).
//
// Guards:
//   1. privacy-block   — block reading secret files (.env, keys, .pem)         [HARD throw]
//   2. session-hydrate — re-inject Helmsman rules + active plan on compaction  [context push]
//   3. adherence re-anchor — mid-trajectory reminder of active obligations     [toast + log]
//      every RE_ANCHOR_EVERY tool calls (fights >4x following-decay; see
//      harness/adherence.md). opencode can't push model context mid-run, so we
//      surface a toast + structured log; the compaction hook (#2) does the
//      deeper re-injection. Throttled so it never becomes the ceremony that
//      itself causes drift.
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

// Adherence re-anchor cadence: remind of active obligations every N tool calls.
// Tuned to be rare enough not to nag, frequent enough to catch late-run drift.
const RE_ANCHOR_EVERY = 25;

export const HelmsmanPlugin = async ({ directory, client }) => {
  let toolCallCount = 0;

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

    // 3. Adherence re-anchor (mid-trajectory). Every RE_ANCHOR_EVERY tool calls,
    //    surface a reminder to re-state the active obligations — fights the
    //    >4x following-decay over a long run (harness/adherence.md). opencode
    //    can't inject model context here, so we toast + log; the agent re-states
    //    from process/active/. Best-effort: never throws (must not break a build).
    "tool.execute.after": async () => {
      try {
        toolCallCount += 1;
        if (toolCallCount % RE_ANCHOR_EVERY !== 0) return;
        const msg =
          `[Helmsman re-anchor] ${toolCallCount} tool calls in. Re-state the active ` +
          `obligations (adherence.md): remaining Verification items + loaded-skill ` +
          `requirements + risk-gate status. Re-read process/active/ if drifting.`;
        if (client?.tui?.showToast) {
          await client.tui.showToast({ message: msg, variant: "info" }).catch(() => {});
        }
        if (client?.app?.log) {
          await client.app.log({
            body: { service: "helmsman", level: "info", message: "adherence-reanchor", extra: { toolCallCount } },
          }).catch(() => {});
        }
      } catch { /* re-anchor is best-effort; never break the run */ }
    },

    // 2. Session-hydrate: when a session compacts, re-inject the Helmsman operating
    //    rules + a pointer to the active plan + local context so the agent does not
    //    "forget" the harness contract after compaction.
    //    Capped (CONTEXT_MAX_CHARS) so re-injection never bloats the window.
    "experimental.session.compacting": async (input, output) => {
      const CONTEXT_MAX_CHARS = 6000;
      // Read the install-chosen memory mode so re-injection matches the backend.
      let backend = "file";
      try {
        const fs = await import("node:fs");
        backend = fs.readFileSync(`${directory}/.helmsman/backend`, "utf8").trim() || "file";
      } catch { /* default file */ }
      const memoryLine = backend === "gbrain"
        ? "- Memory mode: GBRAIN (two-tier). Read process/context/ first, then gbrain (durable). Write-back lands in BOTH."
        : "- Memory mode: STANDALONE (file). process/ IS the source of truth — recall/write-back use process/context/ + process/agent-memory/. No gbrain calls.";
      let ctx =
        `## Helmsman contract (re-injected after compaction)
- The orchestrator ROUTES, never executes (see AGENTS.md / harness/iron-law.md).
- Operating Rules hold: prove-don't-claim, follow the gates, never fake, stay in lane.
${memoryLine}
- Resume any in-flight work from process/active/ before starting new work.`;
      if (ctx.length > CONTEXT_MAX_CHARS) {
        ctx = ctx.slice(0, CONTEXT_MAX_CHARS) + "\n…(truncated to keep context lean)";
      }
      output.context = output.context || [];
      output.context.push(ctx);
    },
  };
};

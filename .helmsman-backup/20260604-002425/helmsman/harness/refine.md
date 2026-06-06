# Self-Refine — Loop B (prompt refinement)

Owner: every agent, for its own definition. When an agent fails in its own domain
because its definition lacked something, it proposes an edit to its own
`agents/<name>.md`.

## Trigger

A flow or domain failure attributable to the agent's own instructions, e.g.:
- "I used the wrong design token because my definition didn't list the canonical
  palette."
- "I skipped the RLS check because my checklist didn't mention it."
- "I researched when I should have routed."

**Adherence signal (from `adherence-check` / HFR):** if the SAME obligation drifts across
multiple trajectories (`skills/adherence-check` emits these as "refine candidates"), the
*instruction* is likely at fault, not the agent — that's a Loop-B trigger. Low Harness
Following Rate on one rule across many runs = a harness bug. See `harness/adherence.md`.

## Procedure

1. **Name the failure** — what went wrong and why, concretely.
2. **Locate the cause** — which line/section of the agent's own definition is missing
   or wrong.
3. **Propose the patch** — a specific diff to `agents/<name>.md` (in the helmsman repo,
   the source of truth — not the installed copy).
4. **User approves** — the patch is presented; nothing is written without approval.
5. **Apply + re-install** — edit the canonical file, then re-run `install.sh` (or note
   that it propagates on next install) so the fix reaches the project copies.

## Distinction from Loop C (agent memory)

- **Loop B (this)** changes the agent's *instructions* — durable behavior change,
  lives in the agent definition file, version-controlled.
- **Loop C** stores *learned facts* (flaky tests, failure patterns) as gbrain pages —
  recalled at runtime but doesn't change the prompt.

Use B when the agent should *always* behave differently. Use C when the agent should
*remember* something specific.

## Mirror discipline

If the patch changes a flow rule (not just a domain detail), check whether
`harness/` docs or the per-repo `AGENTS.md` template also need the mirrored edit.

---
name: watzup
description: Read-only founder status snapshot — "where am I / what's in flight / what to focus on next." Owned by @chief. Scans process/active (in-flight plans), process/completed (recently shipped), git status, and gbrain (recent decisions, if present), then reports a plain-language snapshot. NEVER mutates anything. Use when the user says "watzup", "where am I", "what's in flight", "status", "what should I do next", or sits down and wants the lay of the land.
---

# watzup — where am I, what's in flight, what's next

Owned by `@chief`. A non-coder founder's most-used view: one command, plain-language
answer. **Read-only — this skill never writes, moves, or deletes anything.**

## When to run
"watzup" / "where am I" / "what's in flight" / "status" / "what should I focus on" / when
the founder sits down and wants the lay of the land.

## Procedure (all read-only)

### 1. In-flight work
List `process/active/*.md` — the plans currently open. One line each: what it is + state.

### 2. Recently shipped
List the newest few `process/completed/*.md` — what got done lately.

### 3. Deferred / blocked
List `process/backlog/*.md` — what's parked, and anything flagged blocked in active plans.

### 4. Repo state
`git status --short` + current branch + last commit line. (Read-only — do NOT commit.)

### 5. Memory pulse (if gbrain present)
`recall("recent decisions priorities")` for cross-session context. Skip silently if no gbrain.

### 6. Report — plain language, founder-facing
Structure the answer so a non-coder gets it instantly:

```
## Where you are

IN FLIGHT
- <plan> — <one-line state>

SHIPPED RECENTLY
- <thing> (<when>)

PARKED / BLOCKED
- <item> — <why>

REPO
- <branch>, <clean | N uncommitted files>, last: "<commit>"

SUGGESTED NEXT
- <the single most sensible next step, in plain words>
```

Keep it short. Lead with what matters. No jargon — if a term is unavoidable, define it
in one clause.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. This skill is **strictly read-only** — if you
catch yourself about to write/commit/move anything, STOP: that's a different task (route
it). Don't fabricate state — if `process/` is empty, say "nothing in flight" plainly.

## Evidence (what "done" must show)
The snapshot reflects ACTUAL files/git — not invented. If you list an in-flight plan, it
exists in `process/active/`. "Nothing in flight, clean repo" is a valid, honest snapshot.

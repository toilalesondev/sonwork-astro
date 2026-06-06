---
name: cso
version: 1.0.0
description: >-
  Chief Security Officer audit — infrastructure-first + OWASP Top 10 + STRIDE, with secrets,
  dependency supply chain, CI/CD, and LLM/AI security. Owned by @backend. Use for "security
  audit / threat model / pentest review / OWASP / CSO review". Two modes: daily (8/10 confidence
  gate, zero-noise) and comprehensive (2/10, monthly deep scan).
---

# cso — security audit, infrastructure-first

The security-thinking skill (this IS the security skill — there's no separate `security`). Owned
by `@backend`. Grep for all code searches; scope by the detected stack.

## Trigger
- "Security audit / threat model / pentest review / OWASP / CSO review / vulnerability scan".

## Modes
- **daily** (default) — all phases, **8/10 confidence gate** (report only high-confidence findings; zero noise).
- **comprehensive** (`--comprehensive`) — all phases, **2/10 gate** (monthly deep scan; surface more).
- `--diff` — scope to changed files; combinable with any scope flag + comprehensive.

## Procedure — the phases
0. **Architecture model + stack detection** — map the attack surface mentally first.
1. **Attack-surface census** — entry points (routes, APIs, webhooks, jobs, file uploads).
2. **Secrets archaeology** — hardcoded keys/tokens, `.env` leaks, secrets in git history.
3. **Dependency supply chain** — vulnerable/outdated deps, typosquats, lockfile integrity.
4. **CI/CD pipeline security** — pipeline injection, token scope, artifact integrity.
5. **Infrastructure shadow surface** — exposed services, misconfig, default creds.
6. **Webhook & integration audit** — signature verification, replay, SSRF.
7. **LLM & AI security** — prompt injection, tool/agent abuse, data exfiltration via the model.
8. **Skill supply chain** — untrusted skills/plugins executing code.
9. **OWASP Top 10** — A01 broken access control · A02 crypto failures · A03 injection · A04
   insecure design · A05 misconfig · A06 vulnerable components (→Phase 3) · A07 auth failures ·
   A08 integrity · A09 logging/monitoring · A10 SSRF. Targeted grep per category, scoped to the stack.
10–14. **Threat-model (STRIDE), data-flow trust boundaries, active verification, report.**

For each finding: severity, location (file:line), the concrete exploit (input → impact), and the
fix. Apply prior learnings (note "prior learning applied: [key]"). Gate by the mode's confidence threshold.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Report findings with file:line + a concrete exploit
path** — never a vague "could be insecure". Respect the confidence gate (daily = high-confidence
only; no manufactured nits). Verify actively where possible; don't claim a vuln you can't show.

## Evidence (what "done" must show)
The findings with file:line + exploit path + severity + fix, the mode + confidence gate used, and
the phases covered. "No high-confidence findings" is a valid daily-mode result.

---
name: tdd
version: 1.0.0
description: >-
  Test-driven development the right way — vertical slices, red→green→refactor, behavior over
  implementation. Owned by @eng. Use when building a new feature/behavior, fixing a bug
  test-first, or the user mentions "red-green-refactor" / "test-first" / "TDD".
---

# tdd — red → green → refactor, in vertical slices

Build behavior one proven slice at a time. The output is code where every behavior has a test
that survives refactors because it tests **what** the system does, not **how**.

## Trigger
- New feature/behavior to build, or a bug to fix with a regression test first.
- "Do this test-first" / "red-green-refactor" / "I want real integration tests."

## Procedure

### 1. Plan the behaviors (not the implementation)
- Use the project's domain glossary (CONTEXT.md) so test names + interface vocabulary match the
  project's language; respect ADRs in the area you touch.
- List the **behaviors** to test, prioritized — you can't test everything; focus on critical
  paths + complex logic. Design the public interface for testability (deep module: small
  interface, deep implementation).
- Confirm the interface + the priority behaviors with the user before writing code.

### 2. Tracer bullet — ONE vertical slice
```
RED:   write ONE test for the first behavior → it fails
GREEN: write the minimal code to pass → it passes
```
This proves the path end-to-end. **Never write all tests first** (horizontal slicing) — bulk
tests verify *imagined* behavior and the shape of things, go insensitive to real breakage, and
commit you to structure before you understand it.

### 3. Incremental loop
For each remaining behavior: `RED (next test fails) → GREEN (minimal code passes)`. One test at
a time; only enough code to pass the current test; don't anticipate future tests; test
observable behavior through the **public interface** only.

### 4. Refactor (only while GREEN)
After tests pass: extract duplication, deepen modules (move complexity behind simple
interfaces), apply SOLID where natural, let new code reveal cleanups in old code. Run tests
after each refactor step. **Never refactor while RED — get to GREEN first.**

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **A good test verifies behavior through a public
interface and survives an internal refactor.** Warning sign of a bad test: it breaks when you
rename an internal function though behavior didn't change — that test was coupled to
implementation; fix it. Don't mock internal collaborators or test private methods.

## Evidence (what "done" must show)
The actual red-then-green test run output per slice (failing first, passing after) — never
"tests pass" without the output (Rule 1). For a bug fix: the failing test that reproduced it,
then the same test passing.

## Example
**Good:** "Add discount codes to checkout" → failing test for an invalid code → minimal
validator → passes → failing test for the valid-code path → implement → passes. Each slice proven.

**Bad:** write 5 tests for imagined cart behavior, then 200 lines of implementation, run once,
"looks right." ❌ Horizontal slicing — the tests test shape, not behavior.

---
name: understand
version: 1.0.0
description: >-
  Understand a codebase via a knowledge graph — build it, then query it (ask / explain / diff /
  domain / onboard / dashboard). Owned by @scout. Use when you need to learn a repo, ask "where
  is X / how does Y work / what depends on Z", explain a file, assess a diff's blast radius,
  extract domain flows, or onboard to a project. Tool-aware: uses the understand graph tool when
  present, else reads the graph / repo directly.
---

# understand — learn a codebase through its knowledge graph

One skill, several **modes**, all over a knowledge graph at
`.understand-anything/knowledge-graph.json` (nodes = files/functions/classes/concepts/domain;
edges = imports/calls/depends_on/contains/…). Owned by `@scout` (read-only).

> **Tool-aware:** if the understand graph tool is installed, use it to build/refresh the graph.
> If not, build a lightweight mental graph by reading the repo directly — the modes below still
> work, just without the persisted JSON. Never claim a graph exists if it doesn't.

## Trigger
- "Understand this repo", "map the codebase", "where is X / how does Y work / what depends on Z",
  "explain this file/function", "what does this diff affect", "extract the domain flows",
  "onboarding guide", "show the graph".

## Procedure — pick the mode

### build (default when no graph exists)
Produce/refresh the graph: pre-flight (detect languages/frameworks, honor ignore config) → scan →
analyze in batches → assemble architecture layers + a guided tour → save to
`.understand-anything/knowledge-graph.json`. Use the understand tool when present; otherwise
walk the repo and record the same structure (project meta, nodes, edges, layers). Incremental
update when a graph already exists and only some files changed.

### ask ("where is X / how does Y work / what depends on Z")
Don't dump the graph into context. Grep the graph JSON for the query keywords across `name` /
`summary` / `tags` → collect matching node `id`s → grep those ids in `edges` for the 1-hop
subgraph (upstream callers + downstream deps) → read the relevant `layers` → answer from that
subgraph with concrete file/function references. If no graph, grep the repo directly.

### explain (a specific file/function/module)
Deep-dive one node: its role, its interface, what it calls and what calls it (edges), the layer
it sits in, with file:line evidence.

### diff (analyze a PR / change)
Map changed files → graph nodes → follow edges to the affected blast radius (callers, deps);
report what changed, what's at risk, and which layers are touched.

### domain (business-flow view)
Extract domain flows (domain/flow/step/entity nodes) — the business logic, not the code
structure. Works standalone (lightweight scan) or derived from an existing graph.

### onboard (guide for a newcomer)
Generate an onboarding guide from the graph: the tour, the key layers, where to start, the
load-bearing modules.

### dashboard (visualize)
Launch the interactive graph dashboard when the tool is present; otherwise describe the layer/
tour structure in text.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **@scout is read-only — analyze, never edit.** Read
the graph efficiently (grep before reading; only the relevant subgraph, never the whole file).
Tool-aware: state plainly when the graph tool isn't installed and you're reading the repo directly.

## Evidence (what "done" must show)
For build: the graph file written (path + node/edge counts). For query modes: the concrete
node/edge references the answer rests on (file:line, the subgraph followed) — never a vague
summary without graph/code citations.

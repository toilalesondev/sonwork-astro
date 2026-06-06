---
name: scrape
version: 1.0.0
description: >-
  Pull structured data from a web page (read-only) — navigate, extract, return JSON. Owned by
  @ship (shared with @chief/@growth for research). Use to "scrape / get data from / pull / extract
  from / what's on" a page. Tool-aware: uses the browser tool when present; for mutating flows use browse.
---

# scrape — read structured data off a page

Read-only extraction. Owned by `@ship` (shared: @chief/@growth pull market/competitor data).
Tool-aware: uses the available browser automation; degrades to a plain fetch + parse for static pages.

## Trigger
- "Scrape / get data from / pull / extract from / what's on" a page.

## Procedure
1. **Fetch the page** — browser tool for JS-rendered pages; plain HTTP fetch for static HTML.
2. **Locate the data** — identify the elements/structure holding the target data.
3. **Extract → JSON** — pull the fields into a clean structured shape; note any pagination.
4. **Return** the structured result + the source URL + what was/wasn't found.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Read-only** — for form fills/clicks/submissions use
`browse`. Don't fabricate data the page didn't contain; report gaps honestly. Tool-aware: state
the path taken (rendered vs static fetch).

## Evidence (what "done" must show)
The extracted JSON + the source URL, and an honest note on anything that couldn't be extracted
(never invented values — Rule 1).

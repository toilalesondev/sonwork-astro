---
name: scrape
version: 1.0.0
description: >-
  Pull structured data from a web page (read-only) — navigate, extract, return JSON. Owned by
  @ship (shared with @chief/@growth for research). Use to "scrape / get data from / pull / extract
  from / what's on" a page. Uses hbrowse for JS pages; for mutating flows use browse.
---

# scrape — read structured data off a page

Read-only extraction. Owned by `@ship` (shared: @chief/@growth pull market/competitor data).
Uses **`hbrowse`** for JS-rendered pages; a plain HTTP fetch suffices for static HTML.

> **Tool:** `hbrowse <verb>` (see `browse`). If `hbrowse` is unavailable and the page needs JS,
> say so honestly — don't invent data (Rule 1).

## Trigger
- "Scrape / get data from / pull / extract from / what's on" a page.

## Procedure
1. **Fetch the page** — JS-rendered: `hbrowse goto <url>`. Static HTML: a plain `curl`/fetch is fine.
2. **Locate the data** — `hbrowse html` (full DOM) or `hbrowse css "<selector>"` (matching nodes),
   `hbrowse text` for visible text; `hbrowse attrs "<sel>"` for attributes.
3. **Extract → JSON** — pull the fields into a clean structured shape; note any pagination
   (re-`goto` next page or `hbrowse js` to paginate). For mutating flows (form fills/clicks) use `browse`.
4. **Return** the structured result + the source URL + an honest note on anything not found.

## Operating Rules — MANDATORY
Obey `.helmsman/harness/operating-rules.md`. **Read-only** — for form fills/clicks/submissions use
`browse`. Don't fabricate data the page didn't contain; report gaps honestly. Tool-aware: state
the path taken (rendered vs static fetch).

## Evidence (what "done" must show)
The extracted JSON + the source URL, and an honest note on anything that couldn't be extracted
(never invented values — Rule 1).

# Dark Mode Toggle — Implementation Plan

**Branch:** test/dark-mode  
**Date:** 2026-06-06  
**Status:** IN PROGRESS

## Goal
Add a warm-dark mode toggle to the "Ink on Paper" Astro site with zero FOUC, system-pref respect, and localStorage persistence.

## Dark Palette (warm dark, not cold gray)
| Token        | Light         | Dark          | Rationale                          |
|--------------|---------------|---------------|-------------------------------------|
| --bg         | #FAF6EF cream | #1A1714       | Warm near-black (not pure #000)    |
| --bg-2       | #F3EDE2       | #221F1B       | Slightly lifted surface             |
| --bg-3       | #EDE5D7       | #2C2924       | Card/hover backgrounds              |
| --bg-4       | #E7DDCC       | #343028       | Active nav                          |
| --bg-5       | #DED2BD       | #3D382F       | Deeper card tone                    |
| --border     | #E6DDCD       | #3A342A       | Subtle warm dividers                |
| --border-2   | #D8CCB8       | #4A4238       | Stronger dividers                   |
| --text       | #1B1A17       | #F0EBE1       | Warm off-white body text            |
| --text-2     | #4A4742       | #BDB5A8       | Secondary warm gray                 |
| --text-3     | #74706A       | #857C72       | Tertiary muted                      |
| --accent     | #9E3A16 sienna| #C4643A       | Lightened sienna readable on dark  |
| --accent-dim | #8A2E0E       | #A84D26       | Hover state                         |
| --accent-hover| #B0451E      | #D4754A       | Lighter hover                       |
| --nav-bg     | rgba(250,246,239,.88) | rgba(26,23,20,.88) | Nav glassmorphism dark |

## Blast Radius
1. `src/styles/global.css` — add [data-theme="dark"] block, fix line 63 nav hardcode, add --nav-bg var
2. `src/components/Nav.astro` — toggle button + client script
3. `src/layouts/Base.astro` — anti-FOUC blocking head script + dynamic theme-color meta

## Known Fixes
- Line 63: `rgba(250,246,239,.88)` → `var(--nav-bg)` (new CSS custom prop)
- Line 209: scrollbar hover `#C9BBA3` → `var(--border-2)` (already semantic enough)
- Green badges `#2F7D4F`: kept as-is for light; dark gets slightly lighter `#3D9A62` for contrast

## Verification
- `npm run build` exits 0
- No TypeScript/Astro errors
- Anti-FOUC script in <head> before any CSS/font loads
- Toggle button accessible (aria-label, keyboard operable)

## Resume point
If interrupted: all 3 files need to be written atomically before build test.

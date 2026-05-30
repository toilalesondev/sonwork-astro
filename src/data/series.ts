// Single source of truth for series presentation metadata (ADR-0003).
// The canonical series KEYS live in the Zod enum in src/content.config.ts.
// This module provides the display metadata keyed by those same keys.
// Adding/removing a series = update the enum there AND this map.

export type Series = 'life-book' | 'experiences' | 'human';

export interface SeriesMeta {
  name: string;        // display name
  marker: string;      // mono glyph (§ ↳ ◎)
  badgeClass: string;  // CSS class for the marker badge
  color: string;       // accent color (used by the dashboard)
  tagline: string;     // short one-liner (used on the writing page)
  desc: string;        // longer description
}

export const seriesMeta: Record<Series, SeriesMeta> = {
  'life-book': {
    name: 'Life Book',
    marker: '§',
    badgeClass: 'badge-life',
    color: '#1a3a6b',
    tagline: 'One year at a time, until there are fifty.',
    desc: 'Year-by-year entries written as they happen, compiled into a physical book at 50. Not memoir — evidence.',
  },
  'experiences': {
    name: 'Experiences',
    marker: '↳',
    badgeClass: 'badge-exp',
    color: '#7c3a00',
    tagline: 'Things I lived through, written before I rewrite them in my head.',
    desc: 'Not advice. Not lessons. Accounts of specific situations that were real enough to leave a mark.',
  },
  'human': {
    name: 'Human',
    marker: '◎',
    badgeClass: 'badge-human',
    color: '#4a1a3a',
    tagline: 'Psychology without the jargon. People without the flattery.',
    desc: 'How people think, decide, break, and convince themselves they didn\'t. More useful than most frameworks.',
  },
};

// Ordered keys for iteration (preserves display order).
export const seriesKeys = Object.keys(seriesMeta) as Series[];

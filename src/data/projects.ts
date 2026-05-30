// `exploring` is a valid status for early/idea-stage projects (no card styling yet —
// add `.status-exploring` / `.fp-badge-exploring` in global.css if you use it).
export type ProjectStatus = 'active' | 'building' | 'parked' | 'exploring';

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  url?: string;
  emoji: string;
  highlights: string[];
}

// SKELETON: one sample project. Duplicate this object, change the fields, and add
// real projects. For a custom accent color on the homepage featured card, add a
// `.fp-<slug>` rule in src/styles/global.css (see "Per-project accent colors").
// Without one, the card uses the default amber accent (`.fp-card-accent` base).
export const projects: Project[] = [
  {
    slug: 'sample-project',
    name: 'Sample Project',
    tagline: 'A placeholder project',
    description: 'This is a sample entry that demonstrates the project card structure. Replace it with a real project — set the slug, name, tagline, description, status, optional url, emoji, and highlights.',
    status: 'building',
    url: '/',
    emoji: '🧩',
    highlights: [
      'Highlight one — what this project does',
      'Highlight two — a key capability',
      'Highlight three — current focus',
    ],
  },
];


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

// Real projects. For a custom accent color on the homepage featured card, add a
// `.fp-<slug>` rule in src/styles/global.css (see "Per-project accent colors").
// Without one, the card uses the default blue accent (`.fp-card-accent` base).
export const projects: Project[] = [
  {
    slug: 'perfeat',
    name: 'Perfeat',
    tagline: 'AI evaluation infrastructure',
    description: 'Co-founder. Building the evaluation layer for the AI stack — where models get measured, compared, and certified before they touch production.',
    status: 'active',
    emoji: '📐',
    highlights: [
      'LLM eval harness for production-grade testing',
      'Fine-tuning and RLHF pipeline infrastructure',
      'Custom benchmarking suites for enterprise',
    ],
  },
];


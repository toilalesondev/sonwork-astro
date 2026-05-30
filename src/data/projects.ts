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
    tagline: 'Personal food diary',
    description: 'Founder. A private, editorial food diary — rate every meal 1–7, log dish, restaurant, companions, price, and a photo. Turns your eating history into a searchable personal taste library.',
    status: 'active',
    emoji: '🍜',
    highlights: [
      'Rate meals 1–7 and log dish, place, price, photo',
      'Top-moments montage — your best meals as shareable cards',
      'TestFlight v1.0 — in App Store review',
    ],
  },
];


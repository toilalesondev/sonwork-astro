export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: 'active' | 'building' | 'parked' | 'exploring';
  url?: string;
  emoji: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    slug: 'perfeat',
    name: 'Perfeat',
    tagline: 'AI evaluation infrastructure',
    description: 'Co-founder. Building the evaluation layer for the AI stack — where models get measured, compared, and certified before they touch production.',
    status: 'active',
    url: 'https://perfeat.org',
    emoji: '⚡',
    highlights: [
      'LLM eval harness for production-grade testing',
      'Fine-tuning and RLHF pipeline infrastructure',
      'Custom benchmarking suites for enterprise deployments',
    ],
  },
  {
    slug: 'wecare',
    name: 'WeCare',
    tagline: 'Employee experience platform',
    description: 'Employee experience and engagement platform. Full-time project under active development with a dedicated ops agent (Augustus).',
    status: 'active',
    emoji: '🧑‍💼',
    highlights: [
      'Multi-agent ops architecture for customer delivery',
      'SOP-driven operational playbooks',
      'Scale-ready deployment infrastructure',
    ],
  },
  {
    slug: 'os-v1',
    name: 'OS V1',
    tagline: 'AI-native holding company operating system',
    description: 'The operating system behind how I work. A federated multi-agent brain (gbrain), a fleet of specialized AI agents, and a portfolio management layer that turns knowledge into ventures.',
    status: 'building',
    emoji: '🏗️',
    highlights: [
      '6-agent fleet with shared memory substrate (gbrain)',
      'Company OS portfolio tracker with automated triage',
      'Federated knowledge graph across all ventures',
    ],
  },
  {
    slug: 'f1',
    name: 'F1 Data Project',
    tagline: 'Race data analytics',
    description: 'F1 telemetry and race data analysis. Data pipeline, visualization, and content around Formula 1. Parked at P2 — will revisit when bandwidth opens.',
    status: 'parked',
    emoji: '🏎️',
    highlights: [
      'Race data ingestion and normalization pipeline',
      'Historical telemetry analysis',
      'Driver and constructor performance modeling',
    ],
  },
];

export const statusLabels: Record<string, string> = {
  active: 'active',
  building: 'building',
  parked: 'parked',
  exploring: 'exploring',
};

export interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  link?: string;
  github?: string;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Bun Lab',
    description: 'A minimalist personal portfolio and writing space built with React, Framer Motion, and Bun. Features smooth scrolling, dark mode, and interactive metaballs.',
    year: '2026',
    link: 'https://example.com',
    github: 'https://github.com/ananyasahani/bun-lab',
    tags: ['React', 'Bun', 'Framer Motion']
  },
  {
    id: '2',
    title: 'Neural Notes',
    description: 'A cognitive note-taking application that uses local LLMs to automatically link related thoughts and generate knowledge graphs.',
    year: '2025',
    github: 'https://github.com/ananyasahani/neural-notes',
    tags: ['TypeScript', 'LLM', 'IndexedDB']
  },
  {
    id: '3',
    title: 'Slow Read',
    description: 'A browser extension that enforces slow reading by gradually revealing text on long-form articles, preventing skimming.',
    year: '2025',
    link: 'https://example.com/slowread',
    tags: ['Extension', 'JavaScript', 'CSS']
  }
];

export const ALL_PROJECT_TAGS = [...new Set(PROJECTS.flatMap(p => p.tags))].sort();

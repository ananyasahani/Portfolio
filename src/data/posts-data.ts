// posts-data.ts — Static blog post data
// In a real setup this would come from a CMS or markdown files parsed server-side.

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;         // ISO date string
  readingTime: string;  // e.g. "4 min read"
  tags: string[];
  excerpt: string;
  body: Section[];      // structured sections to avoid innerHTML
}

export interface Section {
  type: 'paragraph' | 'heading2' | 'heading3' | 'blockquote' | 'ul';
  content: string | string[];  // string for text, string[] for list items
}

export const POSTS: Post[] = [
  {
    id: '1',
    slug: 'intro-to-ricing',
    title: 'Intro to Ricing ',
    date: '2026-06-09',
    readingTime: '5 min read',
    tags: ['linux', 'Desktop Enviroment'],
    excerpt:
      'this is a comprehensive guide to how do design and cherry pick each component that you want in your Desktop enviroment',
    body: [
      {
        type: 'paragraph',
        content:
          'ricing it the process of highly customizing you desktop enviroment according to once preference. this tutorail is highly abased on the thing that i learned over the course of few weeks and videos made by Diinki (best youtuber btw-when it comes to linux ).',
      },
      {
        type: 'paragraph',
        content: 'there are different section neatly walking though process, from installation to writting dot files aka config files'
      },
      {
        type: 'heading2',
        content: 'The value of slowness',
      },
      {
        type: 'paragraph',
        content:
          'Speed is useful for executing known solutions. Slowness is useful for discovering whether you\'re solving the right problem. Most organizations conflate the two, rushing through the framing of a problem and slowing down only at implementation, which is precisely backwards.',
      },
      {
        type: 'paragraph',
        content:
          'What does it mean to think slowly? It means letting an idea sit. Returning to it in the morning with fresh eyes. Writing it down badly, then worse, then finally with some clarity. The discomfort of not-knowing is not a failure state — it is the working state of real thought.',
      },
      {
        type: 'blockquote',
        content:
          'Patience is not passive waiting. Patience is active acceptance of the process required to attain your goals and dreams.',
      },
      {
        type: 'heading2',
        content: 'Protecting unstructured time',
      },
      {
        type: 'paragraph',
        content:
          'The calendar is the enemy of slow thought. When every hour is claimed, thinking degrades into reacting. The antidote is not productivity hacks — it\'s ruthless protection of empty time. Empty time is not wasted time. It is where synthesis happens.',
      },
      {
        type: 'paragraph',
        content:
          'I have started blocking two hours each morning with no agenda. The first thirty minutes are usually worthless — residue of the previous day. But somewhere in the second hour, things connect. Problems that seemed unrelated reveal shared structure. Questions sharpen.',
      },
      {
        type: 'heading2',
        content: 'Writing as thinking',
      },
      {
        type: 'paragraph',
        content:
          'Writing forces slow thought. You cannot write faster than you can think (meaningfully), and the act of translating intuition into sentences reveals exactly where the intuition is fuzzy. This is uncomfortable. It is also the point.',
      },
    ],
  },
  {
    id: '2',
    slug: 'systems-over-goals',
    title: 'Systems Over Goals',
    date: '2026-05-10',
    readingTime: '3 min read',
    tags: ['productivity', 'thinking'],
    excerpt:
      'Goals tell you where you want to go. Systems determine whether you\'ll get there. The distinction matters more than it first appears — especially when the destination keeps moving.',
    body: [
      {
        type: 'paragraph',
        content:
          'Goals tell you where you want to go. Systems determine whether you\'ll get there. The distinction matters more than it first appears — especially when the destination keeps moving.',
      },
      {
        type: 'heading2',
        content: 'The problem with outcome goals',
      },
      {
        type: 'paragraph',
        content:
          'Outcome goals feel satisfying to write down. "Publish a book." "Run a marathon." But they are poor daily guides. You cannot run a marathon today. You can run two miles. Every day spent not achieving the goal is a day of implicit failure, which drains motivation in a way that\'s subtle but accumulating.',
      },
      {
        type: 'heading2',
        content: 'What systems look like',
      },
      {
        type: 'paragraph',
        content:
          'A system is a recurring practice that, if followed, makes the desired outcome more likely over time. Writing 300 words each morning is a system. Reading one academic paper per week is a system. The system is achievable today — which means you can succeed today, which means you want to continue tomorrow.',
      },
      {
        type: 'ul',
        content: [
          'Systems are process-focused, goals are outcome-focused',
          'Systems give daily feedback; goals give delayed feedback',
          'Systems survive when circumstances change; goals often do not',
          'Systems compound; goals are one-time events',
        ],
      },
      {
        type: 'paragraph',
        content:
          'The irony is that systems often produce better outcomes than direct goal pursuit. When you optimize for the practice rather than the prize, you build the kind of sustained effort that achievements actually require.',
      },
    ],
  },
  {
    id: '3',
    slug: 'the-attention-economy',
    title: 'The Attention Economy and the Cost of Distraction',
    date: '2026-04-18',
    readingTime: '6 min read',
    tags: ['technology', 'society'],
    excerpt:
      'Attention is the raw material of thought, and it is being strip-mined. The mechanisms are not accidental — they are engineered. Understanding them is the first step to resisting them.',
    body: [
      {
        type: 'paragraph',
        content:
          'Attention is the raw material of thought, and it is being strip-mined. The mechanisms are not accidental — they are engineered. Understanding them is the first step to resisting them.',
      },
      {
        type: 'heading2',
        content: 'Designed for capture',
      },
      {
        type: 'paragraph',
        content:
          'Every variable-reward loop, every infinite scroll, every notification is the product of thousands of A/B tests designed to maximize one metric: time on platform. These are not neutral design decisions. They are deliberate interventions in human psychology, and they are effective.',
      },
      {
        type: 'paragraph',
        content:
          'The downstream effects are measurable. Average attention spans are declining. The ability to read long-form text without checking a device is becoming less common. Deep work — the kind that produces anything worth producing — requires sustained, unbroken attention, which is becoming a scarce resource.',
      },
      {
        type: 'heading2',
        content: 'Reclaiming attention',
      },
      {
        type: 'paragraph',
        content:
          'The solution is not willpower. Willpower is finite and the systems designed to capture attention are effectively infinite in their sophistication. The solution is environmental design — removing the triggers before they fire.',
      },
      {
        type: 'blockquote',
        content:
          'You do not rise to the level of your goals. You fall to the level of your systems.',
      },
      {
        type: 'paragraph',
        content:
          'Practically: no phone in the bedroom. Browser extensions that block social platforms during working hours. Physical books instead of e-readers for reading that matters. The friction introduced by these choices is a feature, not a bug.',
      },
      {
        type: 'heading2',
        content: 'The deeper question',
      },
      {
        type: 'paragraph',
        content:
          'But there is a harder question beneath the productivity frame: what do we want to pay attention to? Attention is not just a resource to be optimized. It is constitutive of our experience. What we attend to is, in a meaningful sense, what we are. The attention economy does not just steal our time — it shapes who we become.',
      },
    ],
  },
  {
    id: '4',
    slug: 'on-reading',
    title: 'On Reading Widely and Thinking Deeply',
    date: '2026-03-05',
    readingTime: '4 min read',
    tags: ['reading', 'thinking'],
    excerpt:
      'There is a tension between reading broadly and reading carefully. Both matter. Neither is sufficient alone. The synthesis is harder than it sounds.',
    body: [
      {
        type: 'paragraph',
        content:
          'There is a tension between reading broadly and reading carefully. Both matter. Neither is sufficient alone. The synthesis is harder than it sounds.',
      },
      {
        type: 'heading2',
        content: 'The case for breadth',
      },
      {
        type: 'paragraph',
        content:
          'Reading across disciplines builds cross-domain intuition. The person who has read seriously in biology, history, economics, and literature has access to patterns that a specialist cannot see. Insight often comes from noticing that two problems, in different fields, have the same underlying structure.',
      },
      {
        type: 'heading2',
        content: 'The case for depth',
      },
      {
        type: 'paragraph',
        content:
          'But breadth without depth is trivia. Surface-level familiarity with many fields produces a confident incompetence — the sense of knowing more than you do. Depth in at least one area calibrates you. It teaches you what it actually feels like to understand something, which makes it harder to fool yourself about adjacent topics.',
      },
      {
        type: 'paragraph',
        content:
          'The goal is T-shaped reading: one or two areas of genuine depth, surrounded by genuine (if shallower) breadth. This is harder to achieve and maintain than either pure strategy, but it is more useful.',
      },
    ],
  },
];

export const ALL_TAGS = [...new Set(POSTS.flatMap(p => p.tags))].sort();

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

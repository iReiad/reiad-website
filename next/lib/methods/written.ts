/* ============================================================
   lib/methods/written.ts: which methods have a lesson, and how
   long each takes. Nothing else.

   THE ROOM IS A CLIENT COMPONENT. `methods.tsx` decides whether a
   card is a link, a lesson or a promise, and importing
   `./index.ts` to answer that put all twelve lesson bodies, 352
   KB of prose, into the browser's bundle: every reader of the
   methods room downloading every lesson to find out which cards
   were links. This list is what that decision actually needs.

   `check-research.ts` holds it to the files, both ways, because a
   list of what exists that is written down separately is the
   failure `CLAUDE.md` opens with.
   ============================================================ */

export interface WrittenLesson { slug: string; minutes: number }

export const WRITTEN: WrittenLesson[] = [
  { slug: "reading-a-paper-in-an-hour", minutes: 5 },
  { slug: "a-literature-note-worth-keeping", minutes: 4 },
  { slug: "search-string-for-a-systematic-review", minutes: 5 },
  { slug: "screening-without-losing-your-mind", minutes: 5 },
  { slug: "ols-and-robust-errors", minutes: 5 },
  { slug: "factor-regression-and-beta", minutes: 5 },
  { slug: "csad-herding-step-by-step", minutes: 5 },
  { slug: "event-study-by-hand", minutes: 5 },
  { slug: "thematic-analysis-in-six-steps", minutes: 5 },
  { slug: "a-codebook-another-person-could-apply", minutes: 5 },
  { slug: "a-citation-in-oscola", minutes: 5 },
  { slug: "chapter-outline-from-a-question-tree", minutes: 5 },
];

export const writtenLesson = (slug: string): WrittenLesson | undefined => WRITTEN.find((l) => l.slug === slug);

/* ============================================================
   lib/methods/index.ts: the lessons written here, one file each.

   A method is a piece with the tag `method` and a piece wins the
   moment it is live. Until then a lesson in this directory is
   what the card opens, so the room is never a row of promises.
   `check-research.ts` fails on a lesson whose slug the table does
   not plan and on a planned method with neither a lesson nor a
   piece, which is a card that goes nowhere.
   ============================================================ */

import type { MethodLesson } from "../research-methods";
import { LESSON as readingAPaper } from "./reading-a-paper-in-an-hour";
import { LESSON as literatureNote } from "./a-literature-note-worth-keeping";
import { LESSON as searchString } from "./search-string-for-a-systematic-review";
import { LESSON as screening } from "./screening-without-losing-your-mind";
import { LESSON as ols } from "./ols-and-robust-errors";
import { LESSON as factor } from "./factor-regression-and-beta";
import { LESSON as csad } from "./csad-herding-step-by-step";
import { LESSON as eventStudy } from "./event-study-by-hand";
import { LESSON as thematic } from "./thematic-analysis-in-six-steps";
import { LESSON as codebook } from "./a-codebook-another-person-could-apply";
import { LESSON as oscola } from "./a-citation-in-oscola";
import { LESSON as outline } from "./chapter-outline-from-a-question-tree";

export const METHOD_LESSONS: MethodLesson[] = [
  readingAPaper, literatureNote, searchString, screening, ols, factor, csad, eventStudy, thematic, codebook, oscola, outline,
];

export const methodLesson = (slug: string): MethodLesson | undefined => METHOD_LESSONS.find((l) => l.slug === slug);

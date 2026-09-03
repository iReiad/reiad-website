/* ============================================================
   lib/methods/index.ts: the lessons written here, one file each.

   A method is a piece with the tag `method` and a piece wins the
   moment it is live. Until then a lesson in this directory is
   what the card opens, so the room is never a row of promises.
   `check-research.ts` fails on a lesson whose slug the table does
   not plan and on a planned method with neither a lesson nor a
   piece, which is a card that goes nowhere.

   THE IMPORTS CARRY `.ts` because that check reads them under
   plain node, which resolves the real filename and has no
   bundler to guess for it. `allowImportingTsExtensions` in
   `next/tsconfig.json` is what lets the route import the same
   file. Same rule as `shared/`, one directory along.
   ============================================================ */

import type { MethodLesson } from "../research-methods.ts";
import { LESSON as readingAPaper } from "./reading-a-paper-in-an-hour.ts";
import { LESSON as literatureNote } from "./a-literature-note-worth-keeping.ts";
import { LESSON as searchString } from "./search-string-for-a-systematic-review.ts";
import { LESSON as screening } from "./screening-without-losing-your-mind.ts";
import { LESSON as ols } from "./ols-and-robust-errors.ts";
import { LESSON as factor } from "./factor-regression-and-beta.ts";
import { LESSON as csad } from "./csad-herding-step-by-step.ts";
import { LESSON as eventStudy } from "./event-study-by-hand.ts";
import { LESSON as thematic } from "./thematic-analysis-in-six-steps.ts";
import { LESSON as codebook } from "./a-codebook-another-person-could-apply.ts";
import { LESSON as oscola } from "./a-citation-in-oscola.ts";
import { LESSON as outline } from "./chapter-outline-from-a-question-tree.ts";

export const METHOD_LESSONS: MethodLesson[] = [
  readingAPaper, literatureNote, searchString, screening, ols, factor, csad, eventStudy, thematic, codebook, oscola, outline,
];

export const methodLesson = (slug: string): MethodLesson | undefined => METHOD_LESSONS.find((l) => l.slug === slug);

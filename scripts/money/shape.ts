/* ============================================================
   scripts/money/shape.ts: what one authored lesson looks like.

   The files beside this one hold the money school's prose. They
   are what SEEDED the rows and are not a second copy anything
   reads: nothing imports them at runtime, no builder reads them,
   and the route reads D1. A correction typed here changes
   nothing until `scripts/seed-money.ts` runs again.

   They are kept for the reason `archive/schools/` is kept:
   whoever has to check that the replacement does what the thing
   it replaced did needs to be able to read both. MONEY.md says
   the same thing where somebody editing a lesson will look.
   ============================================================ */

import type { Blocks } from "../../shared/lesson.ts";

export interface LessonContent {
  /** The Bangla body: the learning language, and what a reader
      with JavaScript off is given. */
  bn: string;
  /** The same lesson in English. Not a translation of the
      sentences: the same lesson, said the way somebody would say
      it in English. */
  en: string;
  /** The interactive and drawn parts, keyed by the mount id the
      two bodies carry. */
  blocks: Blocks;
}

export type Written = Record<string, LessonContent>;

/** A mount marker, written by the one function so eighty lessons
    cannot spell it eighty ways. `splitBody()` in
    `shared/lesson.ts` reads what this writes. */
export const mount = (id: string): string =>
  `<div class="mount" data-mount="${id}"></div>`;

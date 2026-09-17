/* ============================================================
   scripts/english/shape.ts: what one authored part looks like.

   The files under `term-3/` hold the grammar term's prose and
   blocks. They are what SEEDS the rows, through
   `scripts/seed-english.ts`, and nothing reads them at runtime:
   the route reads D1, and `content/schools.backup.json` is the
   committed copy of what D1 holds. A correction typed here
   changes nothing until the seeder runs again. `scripts/money/`
   is the same arrangement one school over, and `shape.ts` there
   says why the files are kept.

   ---- one body, not two ----

   A money lesson is two bodies, Bangla and English. An English
   part is ONE, in Bangla, because Bangla is the language it
   explains in and English is the thing being explained: the
   first two terms are Bangla-only for the same reason, and a
   switch offering "the same lesson in English" would offer a
   reader the answer key. The blocks still say themselves in both,
   because a `Say` is `{ bn, en }` by construction.

   ---- and it is seeded, not typed into the Studio ----

   The prose carries `<span lang="en">` on every English word, as
   every part of the first two terms does: it is what gives the
   English its own face and what the touch-to-hear control finds.
   The server's sanitiser keeps no `lang` attribute, so a part
   saved from the Studio would lose them. Seed from here.
   ============================================================ */

import type { Blocks } from "../../shared/lesson.ts";

export { mount } from "../money/shape.ts";

export interface PartContent {
  /** The Bangla body, carrying the mount markers. */
  bn: string;
  /** The interactive parts, keyed by the mount id the body
      carries. */
  blocks: Blocks;
}

export type Written = Record<string, PartContent>;

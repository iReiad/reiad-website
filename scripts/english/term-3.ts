/* ============================================================
   টার্ম ৩: ইংরেজি ব্যাকরণ. The twenty-five parts, in three
   files under `term-3/`, one per rung of the ladder.

   `scripts/seed-english.ts` reads every `scripts/english/<term>.ts`
   for a `LESSONS` export keyed by part slug, so this file is the
   term and the three beside it are its rungs. Split because a
   correction to part 4 should not sit in the same diff as part
   24, and because one file would be four hundred kilobytes.
   ============================================================ */

import type { Written } from "./shape.ts";
import { LESSONS as BASIC } from "./term-3/basic.ts";
import { LESSONS as MIDDLE } from "./term-3/middle.ts";
import { LESSONS as ADVANCED } from "./term-3/advanced.ts";

export const LESSONS: Written = { ...BASIC, ...MIDDLE, ...ADVANCED };

/* ============================================================
   টার্ম ৩: ইংরেজি ব্যাকরণ. The twenty-five parts, one file each
   under `term-3/`, gathered by three rung files.

   `scripts/seed-english.ts` reads every `scripts/english/<term>.ts`
   for a `LESSONS` export keyed by part slug, so this file is the
   term, `basic.ts`, `middle.ts` and `advanced.ts` are its rungs,
   and `NN-slug.ts` beside them is one part. Split that far
   because a correction to part 4 should not sit in the same diff
   as part 24, and because one file would be a megabyte.
   ============================================================ */

import type { Written } from "./shape.ts";
import { LESSONS as BASIC } from "./term-3/basic.ts";
import { LESSONS as MIDDLE } from "./term-3/middle.ts";
import { LESSONS as ADVANCED } from "./term-3/advanced.ts";

export const LESSONS: Written = { ...BASIC, ...MIDDLE, ...ADVANCED };

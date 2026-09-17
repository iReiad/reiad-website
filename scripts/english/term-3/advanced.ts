/* ============================================================
   টার্ম ৩, উচ্চতর: ম্যাচ জেতা. Parts 19 to 25, one file each,
   gathered here into the rung.

   The third rung. Same people, same house rules as `basic.ts`,
   and the same reason for one file per part. The two closing
   parts are the exam room and the map: every grammar question
   SSC and HSC papers ask, and how the thirty days of the
   practice book line up against these parts. Part 25 carries
   the day-map table `scripts/check-english.ts` reads, so it is
   the one part whose prose a check depends on.
   ============================================================ */

import type { Written } from "../shape.ts";
import { PART as relatives } from "./19-relatives.ts";
import { PART as determiners } from "./20-determiners.ts";
import { PART as causatives } from "./21-causatives.ts";
import { PART as emphasis } from "./22-emphasis.ts";
import { PART as punctuation } from "./23-punctuation.ts";
import { PART as transformation } from "./24-transformation.ts";
import { PART as mistakes } from "./25-mistakes.ts";

export const LESSONS: Written = {
  relatives, determiners, causatives, emphasis, punctuation, transformation, mistakes,
};

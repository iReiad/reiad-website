/* ============================================================
   টার্ম ৩, মাঝারি: খেলা গড়া. Parts 11 to 18, one file each,
   gathered here into the rung.

   The second rung EXPANDS the first: every part here names the
   basic part it stands on, so a reader who is lost knows where
   to go back to. Same people, same house rules as `basic.ts`,
   and the same reason for one file per part.
   ============================================================ */

import type { Written } from "../shape.ts";
import { PART as perfect } from "./11-perfect.ts";
import { PART as modals } from "./12-modals.ts";
import { PART as questions } from "./13-questions.ts";
import { PART as joining } from "./14-joining.ts";
import { PART as passive } from "./15-passive.ts";
import { PART as reported } from "./16-reported.ts";
import { PART as conditionals } from "./17-conditionals.ts";
import { PART as ingTo } from "./18-ing-to.ts";

export const LESSONS: Written = {
  perfect, modals, questions, joining, passive, reported, conditionals,
  "ing-to": ingTo,
};

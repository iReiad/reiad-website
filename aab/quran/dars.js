/* ============================================================
   dars.js: the one line of behaviour a day's page needs.

   "দরস" is what a lesson is called in this tradition, which is
   why the file is not called lesson.js: the German school's
   equivalent is teil.js for the same reason.

   Opening a day marks it done and records it as the place to
   resume from. Everything else on the page is static HTML and
   stays static: the tables, the Arabic, the word-by-word
   breakdowns are all there before this file loads, and are all
   still there if it never does.

   The work happens in progress.js, which waits for the page to
   actually be activated rather than merely prerendered, see the
   note there, and /activation.js for the full story.
   ============================================================ */

import { recordVisit } from "/quran/progress.js";

recordVisit();

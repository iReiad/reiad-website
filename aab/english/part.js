/* ============================================================
   part.js: the one line of behaviour a part's page needs.

   "Part" is what the course calls a lesson, so that is what this
   file is called: the German school's equivalent is teil.js and
   the Quranic Arabic school's is dars.js, for the same reason.

   Opening a part marks it read and records it as the place to
   resume from. Everything else on the page is static HTML and
   stays static: the tables, the pattern boxes, the sentence
   banks are all there before this file loads, and are all still
   there if it never does.

   The work happens in progress.js, which waits for the page to
   actually be activated rather than merely prerendered, see the
   note there, and /activation.js for the full story.
   ============================================================ */

import { recordVisit } from "/english/progress.js";

recordVisit();

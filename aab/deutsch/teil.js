/* ============================================================
   teil.js — the one line of behaviour a Teil page needs.

   Opening a Teil marks it read and records it as the place to
   resume from. Everything else on the page is static HTML and
   stays static: the tables, the examples, the pattern boxes are
   all there before this file loads, and are all still there if
   it never does.

   The work happens in progress.js, which waits for the page to
   actually be activated rather than merely prerendered — see the
   note there, and /activation.js for the full story.
   ============================================================ */

import { recordVisit } from "/deutsch/progress.js";

recordVisit();

/* ============================================================
   arbeitsbuch.data.js: the practice books, one per Stufe.

   This file is the index. The days themselves live one per
   Stufe in ./arbeitsbuch/, the same way Teil text lives one per
   Stufe in ./content/, because three books in one file would be
   five thousand lines and a correction to day 4 of Stufe 1 would
   sit in the same diff as day 88 of Stufe 3.

     stufe-1   30 days   sounds, sein and haben, hats, the bracket
     stufe-2   60 days   cases, the spoken past, weil
     stufe-3   90 days   the written past, adjectives, Konjunktiv

   Stufe 4 has no book. It is not missing: at B2 the exercise
   stops being a page you fill in and becomes the news you read
   and the argument you have, which is what its Teile ask for.

   A day has five parts, and they are always the same five, which
   is the whole point of the book: the shape of the page never
   changes, only what is poured into it.

     muster      the pattern of the day: the shape itself, why it
                 works that way, worked examples, and the one line
                 worth remembering
     schau       five model lines to read aloud. de is what you
                 say, bn is what it means
     sagEs       six prompts to translate. Speak first, write
                 second: the learner types into the page and it
                 is kept in their own browser
     a           the answer key for those six, revealed only when
                 they ask for it
     vonHerzen   the free-writing task, English then Bangla

   Plus one thing that belongs to the book rather than the day:

     fuss        the second line of the footer tick. Stufe 1 asks
                 whether yesterday's page was read first; Stufe 2
                 asks whether the six lines of "Mein Gestern"
                 were spoken; Stufe 3 asks for a whole story. The
                 daily promise grows with the level.

   Nothing here is imported by the browser. The workbook page
   ships every day as static HTML and reads what it needs off the
   DOM, so this is build-time data only. See arbeitsbuch.js.
   ============================================================ */

import stufe1 from "./arbeitsbuch/stufe-1.js";
import stufe2 from "./arbeitsbuch/stufe-2.js";
import stufe3 from "./arbeitsbuch/stufe-3.js";

/** Every practice book, by the slug of the Stufe it belongs to. */
export const BOOKS = {
  "stufe-1": stufe1,
  "stufe-2": stufe2,
  "stufe-3": stufe3,
};

/** The book for a Stufe, or null when it has none. */
export const bookFor = (stufe) => BOOKS[stufe?.slug] ?? null;

/** How many days a Stufe's book actually holds.

    curriculum.js declares the same number in `workbook.days`,
    because the browser needs it to draw a progress bar and must
    not pull five thousand lines of days down to count them.
    Nothing asserts the two against each other now: build-deutsch.mjs
    did, and went with the generated books (#129). So a
    declaration that drifts from the data fails a build rather
    than a reader. */
export const dayCount = (stufe) => bookFor(stufe)?.days.length ?? 0;

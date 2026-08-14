/* ============================================================
   workbook.data.js: the practice books, one per term.

   This file is the index. The days themselves live one per term
   in ./workbook/, the same way part text lives one per term in
   ./content/, because a correction to day 4 should not sit in
   the same diff as day 28.

     term-1   30 days   word order, be, have, the three tenses,
                        helpers, questions, free speaking

   Term Two has no book, and that is not an omission: at that
   level the daily exercise stops being a page you fill in and
   becomes the two minutes you record and the article you read
   out loud, which is what its own parts ask for. curriculum.js
   says so in `chorcha`, and the term page prints it where the
   book would have been.

   A day has five parts, and they are always the same five, which
   is the whole point of the book: the shape of the page never
   changes, only what is poured into it.

     pattern   the shape of the day: the shape itself, why it
               works that way, worked examples, and the one line
               worth remembering
     watch     five model lines to read aloud. en is what you
               say, bn is what it means
     say       six prompts to translate. Speak first, write
               second: the learner types into the page and it is
               kept in their own browser
     a         the answer key for those six, revealed only when
               they ask for it
     heart     the free-writing task, English then Bangla

   Plus three things that belong to the book rather than the day:

     sounds    the four English sounds Bangla does not have. Only
               this book has them, and they are on the page the
               learner practises from rather than only in the
               lessons, because that is where they get stuck
     collect   what the book asks you to gather as you go
     foot      the second line of the footer tick

   Nothing here is imported by the browser. The workbook page
   ships every day as static HTML and reads what it needs off the
   DOM, so this is build-time data only. See workbook.js.
   ============================================================ */

import term1 from "./workbook/term-1.js";

/** Every practice book, by the slug of the term it belongs to. */
export const BOOKS = {
  "term-1": term1,
};

/** The book for a term, or null when it has none. */
export const bookFor = (term) => BOOKS[term?.slug] ?? null;

/** How many days a term's book actually holds.

    curriculum.js declares the same number in `workbook.days`,
    because the browser needs it to draw a progress bar and must
    not pull a thousand lines of days down to count them.
    build-english.mjs asserts the two against each other, so a
    declaration that drifts from the data fails a build rather
    than a reader. */
export const dayCount = (term) => bookFor(term)?.days.length ?? 0;

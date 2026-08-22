/* ============================================================
   /api/book/<stage>: a practice book, without its answer key.

   ---- why this route exists at all ----

   The books are read on the server and deliberately never sent
   to a browser as data. `lib/workbook.ts` says why at the top: a
   book is a large object and every prompt in it has its answer
   beside it, so shipping one as a prop would hand a reader the
   whole key whether or not they pressed the button.

   That rule is about the KEY, not about the book, and the Android
   app needs the book. So this sends the days with every `a`
   removed, and `key/<day>` beside it sends one day's answers when
   the reader asks for them. Same guarantee the page has: nothing
   arrives until the button is pressed, and now it is one day's
   worth rather than a whole book's.

   ---- and why it is served by NEXT and not by functions/ ----

   Every other `/api/` path belongs to the other Worker. This one
   does not, and the reason is that the alternative is a second
   copy of the data.

   The books are 450KB of TypeScript in `lib/workbooks/`. Moving
   them into `shared/` so `functions/` could read them would bundle
   all of it into the main Worker, which is then parsed on every
   request to every endpoint on the site. Putting them in D1 would
   mean a migration, an import script, and a file-and-database
   pair to keep in step, which is the failure `CLAUDE.md` opens
   with.

   They already live in this Worker, which already renders them.
   One route over the data that is already here costs nothing and
   copies nothing.

   `worker.js` forwards it: `/api/book/` is in `NEXT_ROUTES` with
   the same reason written beside it, because the API table there
   is consulted first and a path that matches no handler falls
   through to here.
   ============================================================ */

import { bookFor, type WorkbookBook } from "../../../../lib/workbook.ts";

/** The book a reader may hold: everything, minus every answer.

    Built by REMOVING rather than by listing what to keep, which
    is the rule `functions/api/site.ts` follows for the opposite
    reason. Here the risk runs the other way: a book that gains a
    field next year should arrive in the app on its own, and a
    field that holds an answer has to be taken out ON PURPOSE.
    There is exactly one, and it is `say[].a`. */
function withoutTheKey(book: WorkbookBook) {
  return {
    ...book,
    days: book.days.map((day) => ({
      ...day,
      say: day.say.map(({ q }) => ({ q })),
    })),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ stage: string }> },
) {
  const { stage } = await params;
  const book = bookFor(stage);

  /* A stage with no book is not an error. Stufe 4 has none and it
     is not missing: at B2 the exercise stops being a page you
     fill in and becomes the news you read. */
  if (!book) {
    return Response.json(
      { ok: false, reason: "no-book" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { ok: true, stage, book: withoutTheKey(book) },
    {
      /* The security headers are `middleware.ts`'s, on every
         response this Worker sends. Setting them here as well
         would be a second copy of a list that has to agree with
         `aab/_headers`, which is the drift `check-headers.ts`
         exists to catch.

         The CACHING is this route's own, and the middleware
         leaves `/api/` alone so that it can be: a book changes
         when somebody edits it, which is rarely, and the app
         keeps its own copy anyway. Half an hour is long enough
         to matter and short enough that a fix is not a day
         away. */
      headers: { "Cache-Control": "public, max-age=1800" },
    },
  );
}

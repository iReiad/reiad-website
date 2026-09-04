/* /api/book/<stage>: a practice book, without its answer key.

   The books are read on the server and never sent to a browser as data,
   because every prompt has its answer beside it. That rule is about the
   KEY rather than the book, and the Android app needs the book: this
   sends the days with every `a` removed, and `key/<day>` beside it sends
   one day's answers when the reader asks. Same guarantee the page has,
   one day at a time.

   SERVED BY NEXT AND NOT BY `functions/`, because the alternative is a
   second copy of the data. The books are 450KB of TypeScript in
   `lib/workbooks/`: moving them into `shared/` would bundle all of it
   into the main Worker, parsed on every request to every endpoint, and
   putting them in D1 would mean a migration, an import script and a
   file-and-database pair to keep in step. They already live in this
   Worker, which already renders them.

   `worker.js` forwards it: `/api/book/` is in `NEXT_ROUTES`, because the
   API table there is consulted first and a path matching no handler falls
   through to here. */

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
          /* The security headers are `middleware.ts`'s, on every response
             this Worker sends. Setting them here as well is a second copy
             of a list that has to agree with `aab/_headers`, which is the
             drift `check-headers.ts` exists to catch.

             The CACHING is this route's own, and the middleware leaves
             `/api/` alone so it can be: a book changes rarely and the app
             keeps its own copy anyway. */
      headers: { "Cache-Control": "public, max-age=1800" },
    },
  );
}

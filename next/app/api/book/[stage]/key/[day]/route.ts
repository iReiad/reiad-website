/* ============================================================
   /api/book/<stage>/key/<day>: one day's answers.

   The other half of the arrangement in `../../route.ts`. The book
   arrives with every answer stripped; this returns the answers
   for ONE day, when the reader presses the button on that day.

   One day rather than the book, deliberately. A reader who wants
   to cheat can press the button, which is true on the web too and
   is not what this guards against. What it guards against is the
   key arriving without being asked for, which is what a whole
   book in one response would be.
   ============================================================ */

import { bookFor } from "../../../../../../lib/workbook.ts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ stage: string; day: string }> },
) {
  const { stage, day } = await params;
  const book = bookFor(stage);

  /* Plain digits, and nothing else.

     `Number()` is far too generous for a path segment and the
     test found it: `Number("1e1")` is 10 and `Number.isInteger`
     agrees, so `/key/1e1` returned day ten. `0x2`, `+3`, ` 4 `
     and `Infinity` all get through the same door. A day number
     is one to ninety, so the check is on the STRING before
     anything is parsed. */
  const n = /^[0-9]{1,3}$/.test(day) ? Number(day) : NaN;
  const wanted = n > 0 ? book?.days.find((d) => d.n === n) : undefined;

  if (!book || !wanted) {
    return Response.json(
      { ok: false, reason: "no-day" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { ok: true, stage, day: n, answers: wanted.say.map((prompt) => prompt.a) },
    {
      /* Cached like the book, and deliberately.

         An earlier draft said `no-store` here on the grounds
         that an answer key should not sit in a shared cache,
         and that reasoning does not survive contact with what
         this is: the key is available to anybody who presses
         the button, on the web and here. The guarantee is that
         it does not arrive UNASKED, and caching the answer to
         an explicit ask does not weaken it. */
      headers: { "Cache-Control": "public, max-age=1800" },
    },
  );
}

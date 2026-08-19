/* ============================================================
   workbook-page.tsx: a whole practice book, as a route's body.

   Two routes render this and the only difference between them is
   the folder they sit in: the German school calls its book
   `arbeitsbuch` and the English one `workbook`, and both words
   were published before either school had a route. A URL a
   learner has bookmarked is not a thing to tidy, so `_redirects`
   still answers for the `.html` spelling of each.

   Everything below is school-agnostic. Which book this is comes
   from the slug, and the words on the furniture come from the
   book: see the note at the top of `lib/workbook.ts`.
   ============================================================ */

import { notFound } from "next/navigation";
import { SCRIPT, WorkbookBody } from "./workbook-body";
import { bn, bnWord, bookFor } from "../lib/workbook";


/** The route: the guards, and then the body.

    Split in two so the body can be rendered by a test without a
    Next request behind it. `workbook.test.ts` drives both books
    against exactly this markup, and it exists because both of
    them rendered and did nothing for a while: a port is finished
    when it does what the thing it replaced did, and those two
    look identical from the outside. */
export async function WorkbookPage(
  { section, slug }: { section: string; slug: string },
) {
  const book = bookFor(slug);

  /* A rung with no book, or a slug from another school entirely.
     Stufe 4 has no book and is not missing one: at B2 the
     exercise stops being a page you fill in. */
  if (!book || SCRIPT[book.school] === undefined) notFound();
  if (section !== book.school) notFound();

  return <WorkbookBody section={section} slug={slug} />;
}

/** The head of a book page. */
export function workbookMeta(slug: string, canonical: string) {
  const book = bookFor(slug);
  if (!book) return {};

  const total = book.days.length;
  const school = book.school === "deutsch" ? "জার্মান" : "ইংরেজি";

  return {
    title: `${bn(total)} দিনের অনুশীলন খাতা: ${school}, বাংলায় · Reiad's Library`,
    description:
      `দিনে একটা পাতা, একটা ছাঁচ, নিজের জীবনের একটা সত্যি অনুচ্ছেদ। `
      + `${school} ${bnWord(total)} দিনের অনুশীলন খাতা, বাংলায়, উত্তরমালাসহ।`,
    alternates: { canonical },
  };
}

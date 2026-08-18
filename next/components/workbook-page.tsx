/* ============================================================
   workbook-page.tsx: a whole practice book, as a route's body.

   Two routes render this and the only difference between them is
   the folder they sit in: the German school calls its book
   `arbeitsbuch.html` and the English one `workbook.html`, and
   those addresses were published before either school had a
   route. A URL a learner has bookmarked is not a thing to tidy.

   Everything below is school-agnostic. Which book this is comes
   from the slug, and the words on the furniture come from the
   book: see the note at the top of `lib/workbook.ts`.
   ============================================================ */

import { notFound } from "next/navigation";
import { SiteScripts } from "./scripts";
import { WorkbookCollection, WorkbookDayCard, WorkbookTracker } from "./workbook";
import { bn, bnWord, bookFor, targetLang } from "../lib/workbook";
import { Eyebrow, SectionLabel } from "./ui/label";

/** The module that makes the page work: it restores what was
    written, grows the textareas, reveals an answer when asked,
    ticks a day off and draws the progress bar.

    Unchanged by this port, and that is the point. It queries
    `textarea[data-schrift]`, `.buch-tag` and `.antwort-schalter`,
    and does not care whether a builder or a route put them there.
    Loaded through `SiteScripts` like every other module on this
    site, so it runs AFTER hydration: a module that runs before it
    has its work undone. `components/scripts.tsx` is the whole
    story. */
const SCRIPT = {
  deutsch: "/deutsch/arbeitsbuch.js",
  english: "/english/workbook.js",
} as const;

export async function WorkbookPage(
  { section, slug }: { section: string; slug: string },
) {
  const book = bookFor(slug);

  /* A rung with no book, or a slug from another school entirely.
     Stufe 4 has no book and is not missing one: at B2 the
     exercise stops being a page you fill in. */
  if (!book || SCRIPT[book.school] === undefined) notFound();
  if (section !== book.school) notFound();

  const total = book.days.length;
  const lang = targetLang(book);

  /* The rail, the top bar, the footer and the school's accent all
     come from `[section]/[slug]/layout.tsx`, which already wraps
     everything under these two segments in `SchoolShell`. This
     page renders its own body and its own script, which is the
     arrangement every school page here uses: a layout two
     segments up cannot tell a book from a lesson. */
  return (
    <>
      <main id="main">
        <div className="wrap">
          <div className="hero buch-hero" data-buch={slug}>
            <Eyebrow>
              <span lang={lang}>{bn(total)}</span> · {bnWord(total)} দিন
            </Eyebrow>
            <h1 className="bn-h">{bn(total)} দিনের অনুশীলন খাতা</h1>
            <p className="lede">
              <span lang={lang}>{book.lede.target}</span><br />
              {book.lede.bn}
            </p>
            <p className="buch-warnung">
              এই খাতা পড়ার জন্য নয়, লেখার জন্য, আর জোরে বলার জন্য। খালি ঘরগুলো আপনার।
              ভরান। যা লেখেন সেটা শুধু আপনার এই ব্রাউজারেই জমা থাকে, কোথাও পাঠানো হয় না।
            </p>

            <div className="buch-fortschritt" data-buch-fortschritt>
              <span className="track"><i /></span>
              <span className="count mono" />
            </div>

            <div className="hero-actions">
              <a className="btn btn-solid" href="#tag-1" data-buch-heute>
                আজকের পাতা খুলুন →
              </a>
            </div>
          </div>

          <nav className="tracker" aria-label="দিনের তালিকা">
            <WorkbookTracker days={book.days} />
          </nav>

          {/* The sound key, and only the first book of a school
              carries one. After that the sounds are behind you and
              a section repeating them would be the book treating a
              reader as if they had not moved. */}
          {book.sounds?.length ? (
            <section id="schluessel" className="no-filter">
              <SectionLabel>ধ্বনির চাবি</SectionLabel>
              <p className="measure">
                আটকে গেলে এখানে ফিরে আসুন। এই এক তালিকা মুখস্থ হলে যেকোনো শব্দ পড়তে পারবেন।
              </p>
              <details className="faq laut-details">
                <summary>ধ্বনির চাবি খুলুন</summary>
                <div className="laut-gitter">
                  {book.sounds.map((s) => (
                    <div className="laut-paar" key={s.pair}>
                      <b>{s.pair}</b>
                      <span lang={lang}>{s.words}</span>
                      {s.how ? <span className="laut-wie">{s.how}</span> : null}
                    </div>
                  ))}
                </div>
              </details>
            </section>
          ) : null}

          <div className="buch-tage">
            {book.days.map((day) => (
              <WorkbookDayCard day={day} slug={slug} book={book} key={day.n} />
            ))}
          </div>

          <WorkbookCollection book={book} slug={slug} />

          <section className="buch-schluss no-filter">
            <p className="measure" lang={lang}>{book.end.target}</p>
            <p className="measure">{book.end.bn}</p>
            <p className="buch-motto" lang={lang}>{book.motto.target}</p>
            <p className="buch-motto-bn">{book.motto.bn}</p>
          </section>
        </div>
      </main>

      <SiteScripts srcs={[SCRIPT[book.school]]} />
    </>
  );
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

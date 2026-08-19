/* ============================================================
   workbook-body.tsx: a whole practice book, as markup.

   Split out of `workbook-page.tsx` so it can be rendered without
   a Next request behind it. That is what `aab/schools/workbook.test.ts`
   does, and the split is load-bearing rather than tidy: the page
   imports `notFound` from `next/navigation`, the test bundles
   what it renders with esbuild, and CI runs `npm ci` at the root
   and nowhere else, so `next/node_modules` is not there and that
   specifier cannot resolve. It resolved on a laptop and failed on
   the runner, which is the shape of mistake the root
   package.json was created to stop.

   A body that cannot 404 is also the better division: the route
   decides whether there is a book, this draws one.

   Everything here is school-agnostic. Which book this is comes
   from the slug, and the words on the furniture come from the
   book: see the note at the top of `lib/workbook.ts`.
   ============================================================ */

import { SiteScripts } from "./scripts";
import { WorkbookCollection, WorkbookDayCard, WorkbookTracker } from "./workbook";
import { bn, bnWord, bookFor, targetLang } from "../lib/workbook";
import { Eyebrow, SectionLabel } from "./ui/label";
import { Button, ButtonLink } from "./ui/button";

/** The module that makes the page work: it restores what was
    written, grows the textareas, reveals an answer when asked,
    ticks a day off and draws the progress bar.

    `schools/workbook.js` is the program and both of these are
    four lines over it. Loaded through `SiteScripts` like every
    other module on this site, so it runs AFTER hydration: a
    module that runs before it has its work undone.
    `components/scripts.tsx` is the whole story. */
export const SCRIPT = {
  deutsch: "/deutsch/arbeitsbuch.js",
  english: "/english/workbook.js",
} as const;

export function WorkbookBody(
  { section, slug }: { section: string; slug: string },
) {
  const book = bookFor(slug);
  if (!book || SCRIPT[book.school] === undefined || section !== book.school) return null;

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
              <ButtonLink kind="solid" href="#tag-1" data-buch-heute>
                আজকের পাতা খুলুন →
              </ButtonLink>
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

          {/* The day walker, filled in by the module: prev, a
              day picker, next, and "all days at once". It ships
              hidden and empty so that with scripts off the book
              is simply every day, printed, which is what a
              practice book on paper is.

              `data-tag-nav` and the `id` on the days below are
              not decoration. `schools/workbook.js` opens with
              `document.getElementById("tage")` and dereferences
              it on the next line; the generated page it replaced
              had that id and this route did not, so the module
              threw before its first function ran and BOTH books
              rendered perfectly and did nothing. */}
          <nav className="tag-nav" data-tag-nav hidden aria-label="দিন বদলান" />

          <div className="buch-tage" id="tage">
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

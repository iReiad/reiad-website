/* ============================================================
   workbook.tsx: a day of a practice book, as a component.

   The four books were the last pages on this site built as
   template literals in a `build-*.mjs`. This is the markup they
   emitted, rendered by a route instead, which is what gives them
   the rail, the drawer, the audience switch and their school's
   accent: all four were missing, and the reason was only ever
   that a generated file has no React in it.

   ---- the class names are the old ones, deliberately ----

   A port must not also be a redesign, which is the rule that made
   every earlier port judgeable. Keeping `buch-tag`, `tag-teil` and
   the rest means `@layer deutsch` styles this exactly as before,
   so anything that looks different afterwards is a bug in the
   port rather than a decision somebody made halfway through.
   Converting that layer to Tailwind is its own step and
   `MIGRATION.md` says so.

   ---- and the storage keys are the old ones, load-bearingly ----

   `data-schrift` is what `/deutsch/arbeitsbuch.js` reads, and its
   value is a key into `deutsch-schrift` in a real learner's
   browser holding real writing. `schriftKey()` below produces the
   same string the builder did, character for character. Renaming
   one does not move somebody's paragraph, it loses it.

   That module keeps running, unchanged: it queries
   `textarea[data-schrift]`, `.buch-tag` and `.antwort-schalter`,
   and it does not care whether a route or a builder put them
   there. There is no "use client" here and there does not need to
   be one, which is the arrangement every interactive page on this
   site already uses.
   ============================================================ */

import type { WorkbookBook, WorkbookDay } from "../lib/workbook";
import { bn, targetLang } from "../lib/workbook";
import { SectionLabel } from "./ui/label";
import { Button } from "./ui/button";

/** The key a textarea saves under.

    `<stufe slug>/<name>`, and the name carries the day number, so
    "tag-1-tausche-1" is a name and not a description. The builder
    made this string and so does this: `check-workbook.mjs` holds
    the two to being identical while both exist. */
export const schriftKey = (slug: string, name: string): string => `${slug}/${name}`;

/** How many of their own sentences a learner writes per day. Eight
    since the book was written, and the number is here rather than
    in the data because it is the shape of the page rather than
    the content of a day. */
const OWN_SENTENCES = 8;

/* The words a school puts on its own furniture. The rest of this
   file knows nothing about German or English, which is why there
   is one set of components rather than two: see the note at the
   top of `lib/workbook.ts`. */
const WORDS = {
  deutsch: {
    day: "Tag", pattern: "Das Muster · ছাঁচ",
    watch: "Schau", swap: "Tausche", say: "Sag es", heart: "Von Herzen",
  },
  english: {
    day: "Day", pattern: "The pattern · ছাঁচ",
    watch: "Watch", swap: "Swap", say: "Say it", heart: "From the heart",
  },
} as const;

export function WorkbookDayCard(
  { day, slug, book }: { day: WorkbookDay; slug: string; book: WorkbookBook },
) {
  const w = WORDS[book.school];
  const lang = targetLang(book);
  return (
    <article
      className="buch-tag"
      id={`tag-${day.n}`}
      data-tag={day.n}
      data-day-id={`${slug}/tag-${day.n}`}
    >
      <header className="tag-kopf">
        <span className="tag-num mono"><span lang={lang}>{w.day}</span> {bn(day.n)}</span>
        <h2 lang={lang}>{day.target}</h2>
        <p className="tag-bn">{day.bn}</p>
      </header>

      <div className="muster">
        <span className="muster-label mono">{w.pattern}</span>
        <p className="muster-shape" lang={lang}>{day.pattern.shape}</p>
        <p className="muster-why">{day.pattern.why}</p>
        <p className="muster-beispiel" lang={lang}>{day.pattern.examples}</p>
        <p className="muster-tipp">{day.pattern.tip}</p>
      </div>

      <section className="tag-teil schau">
        <h3 className="mono"><span lang={lang}>{w.watch}</span> · দেখো ও তিনবার জোরে বলো</h3>
        <div className="satz-list">
          {day.watch.map((s, i) => (
            <p className="satz" key={i}>
              <b lang={lang}>{s.target}</b><span>{s.bn}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="tag-teil tausche">
        <h3 className="mono"><span lang={lang}>{w.swap}</span> · একই ছাঁচে নিজের আটটা বাক্য</h3>
        <p className="tag-hinweis">
          লেখার সময় প্রতিটা জোরে বলো। যা লেখো সেটা এই ব্রাউজারেই জমা থাকে।
        </p>
        <div className="felder">
          {Array.from({ length: OWN_SENTENCES }, (_, i) => (
            <label className="feld" key={i}>
              <span className="feld-num mono">{bn(i + 1)}</span>
              <textarea
                rows={2}
                data-schrift={schriftKey(slug, `tag-${day.n}-tausche-${i + 1}`)}
                aria-label={`দিন ${bn(day.n)}, নিজের বাক্য ${bn(i + 1)}`}
                placeholder="নিজের বাক্য…"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="tag-teil sagen">
        <h3 className="mono"><span lang={lang}>{w.say}</span> · আগে বলো, তারপর লেখো</h3>
        <div className="sag-liste">
          {day.say.map((s, i) => (
            <div className="sag-zeile" key={i}>
              <span className="feld-num mono">{bn(i + 1)}</span>
              <span className="sag-frage">{s.q}</span>
              <textarea
                rows={2}
                data-schrift={schriftKey(slug, `tag-${day.n}-sag-${i + 1}`)}
                aria-label={`দিন ${bn(day.n)}, অনুবাদ ${bn(i + 1)}`}
                placeholder="আগে বলো, তারপর লেখো…"
              />
              {/* Rendered, and hidden by the stylesheet until the
                  button below is pressed. The answer being in the
                  page is the point: this book works with no
                  network, so it cannot fetch a key. */}
              <span className="sag-antwort" lang={lang}>{s.a}</span>
            </div>
          ))}
        </div>
        <Button kind="ghost" className="antwort-schalter"
                data-antwort={day.n} aria-expanded="false">
          উত্তর দেখুন
        </Button>
        <p className="tag-hinweis">
          আগে নিজে চেষ্টা, তারপর মিলাও। ছাঁচ ঠিক থাকলে আলাদা বাক্যও সঠিক, ছাঁচটাই আসল।
        </p>
      </section>

      <section className="tag-teil herzen">
        <h3 className="mono"><span lang={lang}>{w.heart}</span> · নিজের মন থেকে</h3>
        <p className="herz-aufgabe">{day.heart.bn}</p>
        <p className="herz-en mono">{day.heart.target}</p>
        <textarea
          rows={4}
          data-schrift={schriftKey(slug, `tag-${day.n}-herzen`)}
          aria-label={`দিন ${bn(day.n)}, নিজের কথা`}
          placeholder="নিজের সত্যি জীবন নিয়ে লেখো…"
        />
      </section>

      <footer className="tag-fuss">
        <Button kind="solid" className="tag-fertig" data-fertig={day.n}>
          আজকের পাতা শেষ ✓
        </Button>
        <span className="tag-fuss-note mono">সব জোরে বলেছি · {book.foot}</span>
      </footer>
    </article>
  );
}

/** The strip of day numbers under the hero. */
export function WorkbookTracker({ days }: { days: WorkbookDay[] }) {
  return (
    <>
      {days.map((d) => (
        <a className="tracker-tag" href={`#tag-${d.n}`} data-tracker={d.n} key={d.n}>
          {bn(d.n)}
        </a>
      ))}
    </>
  );
}

/** The collection page: hats in Stufe 1, Partizip pairs in Stufe
    2, three verb forms in Stufe 3. The grid is auto-fit, so two
    columns and three both lay out without being told how many. */
export function WorkbookCollection(
  { book, slug }: { book: WorkbookBook; slug: string },
) {
  const c = book.collect;
  const lang = targetLang(book);
  return (
    <section id="sammlung" className="no-filter">
      <SectionLabel>
        <span lang={lang}>{c.target}</span> · {c.bn}
      </SectionLabel>
      <p className="measure">{c.blurb}</p>
      <div className="hut-sammlung">
        {c.columns.map((col) => (
          <label className="hut-spalte" data-hut={col.key} key={col.key}>
            <span className="hut-kopf" lang={lang}>{col.head}</span>
            <textarea
              rows={8}
              data-schrift={schriftKey(slug, `${c.key}-${col.key}`)}
              aria-label={`${col.head} তালিকা`}
              placeholder={col.placeholder}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

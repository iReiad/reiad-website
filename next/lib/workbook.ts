/* ============================================================
   workbook.ts: the practice books, read on the server.

   ---- one shape, two vocabularies ----

   The German book and the English book are the same page. A day
   has a pattern, lines to read aloud, prompts to translate with
   an answer key, and one piece of free writing, in both, and the
   furniture around them is the same furniture.

   What differs is the nouns. German says `fuss`, `schluessel`,
   `sammlung`, `schau`, `sagEs`, `vonHerzen`; English says `foot`,
   `sounds`, `collect`, `watch`, `say`, `heart`. That is the same
   thing `aab/schools/progress.js` found when three schools turned
   out to be one program written three times with the words
   changed, and the answer here is the answer there: ONE shape,
   and each school hands its own words in.

   So the components below know nothing about German or English.
   The two adapters at the bottom of this file are the only place
   either vocabulary appears, and a third book would be a third
   adapter rather than a third set of components.

   The books are read on the server and never sent to a browser as
   data. A book is a large object and every prompt in it has its
   answer beside it: shipping it as a prop would hand a reader the
   whole key whether or not they pressed the button.
   ============================================================ */

/** A pair of lines to read aloud: what you say, what it means.

    `target` is the language being learnt, whichever that is. The
    books call it `de` and `en`; nothing downstream needs to know
    which. */
export interface WorkbookLine {
  target: string;
  bn: string;
}

/** A prompt to translate, and its answer. */
export interface WorkbookPrompt {
  q: string;
  a: string;
}

/** One day. Always the same four parts, which is the whole point
    of the book: the shape of the page never changes, only what is
    poured into it. */
export interface WorkbookDay {
  n: number;
  /** The day's title, in the language being learnt. */
  target: string;
  bn: string;
  pattern: { shape: string; why: string; examples: string; tip: string };
  /** Model lines to read aloud. */
  watch: WorkbookLine[];
  /** Prompts to translate. Speak first, write second. */
  say: WorkbookPrompt[];
  /** The free-writing task. */
  heart: { target: string; bn: string };
}

/** A column of the collection page: hats in Stufe 1, Partizip
    pairs in Stufe 2, irregular verbs in term 1. */
export interface WorkbookColumn {
  key: string;
  head: string;
  placeholder: string;
}

export interface WorkbookBook {
  /** Which school's words this book is in, for the two places the
      page has to say one: the `lang` on a target-language line,
      and the storage key. */
  school: "deutsch" | "english";
  /** The second line of every day's footer tick, which grows with
      the level: Stufe 1 asks whether yesterday's page was read
      first, Stufe 3 asks for a whole story. */
  foot: string;
  lede: WorkbookLine;
  /** The sound key, and only the first book of each school has
      one. After that the sounds are behind you, and a section
      repeating them would be the book treating a reader as if they
      had not moved. */
  sounds?: { pair: string; words: string; how: string }[];
  collect: {
    key: string;
    target: string;
    bn: string;
    blurb: string;
    columns: WorkbookColumn[];
  };
  end: WorkbookLine;
  motto: WorkbookLine;
  days: WorkbookDay[];
}

/** Bangla digits. The books are `lang="bn"` throughout, so a day
    number in Western digits beside Bangla prose reads as a
    glitch. */
export const bn = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** The number in Bangla words, for the places a sentence needs one
    rather than a numeral. */
export const bnWord = (n: number): string =>
  ({ 30: "ত্রিশ", 60: "ষাট", 90: "নব্বই" } as Record<number, string>)[n] ?? bn(n);

/* ============================================================
   The books, and the two adapters

   Imported rather than read from a path, because they live inside
   this package now. They were under `aab/` while a `.mjs` builder
   was the only thing that read them, and Turbopack will not
   resolve above its own root: the same constraint that made
   `shared/` an npm package. Moving them was cheaper than a second
   package for one consumer.

   The book files themselves are UNTOUCHED apart from the move.
   Six thousand lines of German and English prose is not something
   to rewrite in order to rename four fields, and the adapters do
   that in twenty.
   ============================================================ */

import deutschStufe1 from "./workbooks/deutsch-stufe-1";
import deutschStufe2 from "./workbooks/deutsch-stufe-2";
import deutschStufe3 from "./workbooks/deutsch-stufe-3";
import englishTerm1 from "./workbooks/english-term-1";

/* The two source shapes, described exactly as the files write
   them, so the adapters below are checked rather than trusted. */

interface GermanBook {
  fuss: string;
  lede: { de: string; bn: string };
  schluessel?: [string, string][];
  sammlung: { key: string; de: string; bn: string; blurb: string; columns: WorkbookColumn[] };
  schluss: { de: string; bn: string };
  motto: { de: string; bn: string };
  days: {
    n: number; de: string; bn: string;
    muster: { pattern: string; why: string; examples: string; tip: string };
    schau: { de: string; bn: string }[];
    sagEs: WorkbookPrompt[];
    vonHerzen: { en: string; bn: string };
  }[];
}

interface EnglishBook {
  foot: string;
  lede: { en: string; bn: string };
  sounds?: { pair: string; words: string; how: string }[];
  collect: { key: string; en: string; bn: string; blurb: string; columns: WorkbookColumn[] };
  end: { en: string; bn: string };
  motto: { en: string; bn: string };
  days: {
    n: number; en: string; bn: string;
    pattern: { shape: string; why: string; examples: string; tip: string };
    watch: { en: string; bn: string }[];
    say: WorkbookPrompt[];
    heart: { en: string; bn: string };
  }[];
}

/** German's words onto the shared shape.

    `schluessel` is a pair of strings where English's `sounds` is
    three fields, so it widens rather than the other way round: a
    rule and an example, with nothing to say about how to make the
    sound, which is what the German book actually holds. */
const fromGerman = (b: GermanBook): WorkbookBook => ({
  school: "deutsch",
  foot: b.fuss,
  lede: { target: b.lede.de, bn: b.lede.bn },
  sounds: b.schluessel?.map(([pair, words]) => ({ pair, words, how: "" })),
  collect: {
    key: b.sammlung.key,
    target: b.sammlung.de,
    bn: b.sammlung.bn,
    blurb: b.sammlung.blurb,
    columns: b.sammlung.columns,
  },
  end: { target: b.schluss.de, bn: b.schluss.bn },
  motto: { target: b.motto.de, bn: b.motto.bn },
  days: b.days.map((d) => ({
    n: d.n,
    target: d.de,
    bn: d.bn,
    pattern: { shape: d.muster.pattern, why: d.muster.why,
      examples: d.muster.examples, tip: d.muster.tip },
    watch: d.schau.map((s) => ({ target: s.de, bn: s.bn })),
    say: d.sagEs,
    heart: { target: d.vonHerzen.en, bn: d.vonHerzen.bn },
  })),
});

/** English's words onto the shared shape. Nearer already, because
    the English book was written second and borrowed the German
    one's structure. */
const fromEnglish = (b: EnglishBook): WorkbookBook => ({
  school: "english",
  foot: b.foot,
  lede: { target: b.lede.en, bn: b.lede.bn },
  sounds: b.sounds,
  collect: {
    key: b.collect.key,
    target: b.collect.en,
    bn: b.collect.bn,
    blurb: b.collect.blurb,
    columns: b.collect.columns,
  },
  end: { target: b.end.en, bn: b.end.bn },
  motto: { target: b.motto.en, bn: b.motto.bn },
  days: b.days.map((d) => ({
    n: d.n,
    target: d.en,
    bn: d.bn,
    pattern: d.pattern,
    watch: d.watch.map((s) => ({ target: s.en, bn: s.bn })),
    say: d.say,
    heart: { target: d.heart.en, bn: d.heart.bn },
  })),
});

/** Every practice book, by the slug of the rung it belongs to.

    The slugs do not collide: German counts in Stufen and English
    in terms. */
export const BOOKS: Record<string, WorkbookBook> = {
  "stufe-1": fromGerman(deutschStufe1 as GermanBook),
  "stufe-2": fromGerman(deutschStufe2 as GermanBook),
  "stufe-3": fromGerman(deutschStufe3 as GermanBook),
  "term-1": fromEnglish(englishTerm1 as EnglishBook),
};

/**
 * One rung's book, or null when it has none.
 *
 * Stufe 4 has none and it is not missing: at B2 the exercise stops
 * being a page you fill in and becomes the news you read and the
 * argument you have, which is what its Teile ask for.
 */
export const bookFor = (slug: string): WorkbookBook | null => BOOKS[slug] ?? null;

/** How many days a book holds.

    `curriculum.js` declares the same number in `workbook.days`
    because the browser draws a progress bar from it and must not
    pull five thousand lines of days down to count them.
    NOTHING asserts the two against each other. `check-workbook.mjs`
    was named here and has never existed under any extension, so
    what this comment promised was a check nobody wrote. Said out
    loud rather than quietly deleted: a declaration that drifts
    from its days still reaches a reader as a wrong progress bar. */
export const dayCount = (slug: string): number => bookFor(slug)?.days.length ?? 0;

/** Which language tag a target-language line carries. */
export const targetLang = (book: WorkbookBook): string =>
  (book.school === "deutsch" ? "de" : "en");

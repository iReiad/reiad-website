/* ============================================================
   icons.js: the little drawings for the Quranic Arabic school.

   Same family as /deutsch/icons.js and /learn/icons.js, and the
   same reason for existing: a shape survives a week away from
   the site in a way that "দিন ১৪" does not. Every ধাপ and every
   day has one mark, always drawn the same way, and it appears
   everywhere that thing appears: the ladder, the day card, the
   page head.

   A separate file rather than an import of the German set,
   because most of these are specific to this course (a root, a
   mould, an open book, a pair for masculine and feminine) and
   the other schools should not grow shapes only this one uses.

   Rules that keep them looking like one family:
     · 24×24 box, stroke only, never filled
     · stroke-width 1.6, round caps and joins
     · currentColor, so they take the theme and the state colour
     · NO LETTERS INSIDE A DRAWING. This matters more here than
       next door: an Arabic letter at 24px would collapse into a
       smudge, and a drawing of a letter would also be a drawing
       of a word, which is not what a lesson mark is for
     · aria-hidden; the Bangla name next to it is the label
   ============================================================ */

const P = (d) => `<path d="${d}"/>`;

const PATHS = {
  /* ---------- the three ধাপ ---------- */

  // seed, ধাপ 1: the foundation, the same mark the other schools
  // use for a beginning
  seed: P("M12 21v-7") + P("M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z") +
    P("M12 14c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z"),

  // bridge, ধাপ 2: from a word to a sentence, which is a crossing
  bridge: P("M2.5 15c4.5 0 7-3.5 9.5-3.5S17 15 21.5 15") +
    P("M2.5 15v4") + P("M21.5 15v4") + P("M8 13.2V19") + P("M16 13.2V19"),

  // open book, ধাপ 3: a whole surah, open in front of you
  "open-book": P("M12 6.5v13") +
    P("M12 6.5C10 4.8 7 4.3 3.5 4.8v13C7 17.3 10 17.8 12 19.5") +
    P("M12 6.5c2-1.7 5-2.2 8.5-1.7v13c-3.5-.5-6.5 0-8.5 1.7"),

  /* ---------- the days ---------- */

  // three: the three kinds of word
  three: P("M4 7h16") + P("M4 12h16") + P("M4 17h16") +
    `<circle cx="4" cy="7" r="1.2"/><circle cx="4" cy="12" r="1.2"/>` +
    `<circle cx="4" cy="17" r="1.2"/>`,

  // person: the pronouns, who is speaking
  person: `<circle cx="12" cy="7.5" r="3.5"/>` + P("M5 21a7 7 0 0 1 14 0"),

  // pair: masculine and feminine, and agreement
  pair: `<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/>` +
    P("M3 20a5 5 0 0 1 10 0") + P("M13 20a5 5 0 0 1 8-4"),

  // link: something joined to something else
  link: P("M10 14a4 4 0 0 1 0-5.6l2-2a4 4 0 0 1 5.7 5.7l-1 1") +
    P("M14 10a4 4 0 0 1 0 5.6l-2 2a4 4 0 0 1-5.7-5.7l1-1"),

  // hand: pointing at a thing, this and that
  hand: P("M9 11V5.5a1.5 1.5 0 0 1 3 0V11") +
    P("M12 11V4.5a1.5 1.5 0 0 1 3 0V11") +
    P("M15 11V6.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-3.5a1.5 1.5 0 0 1 3 0V14"),

  // merge: two things becoming one word
  merge: P("M4 5c5 0 4 7 8 7s3-7 8-7") + P("M20 19c-5 0-4-7-8-7") +
    P("M17.5 16.5 20 19l-2.5 2.5"),

  // star: the words that come back again and again
  star: P("M12 3.5l2.4 5.3 5.6.7-4.1 3.9 1.1 5.6L12 16.3l-5 2.7 1.1-5.6L4 9.5l5.6-.7L12 3.5Z"),

  // ring: definiteness, a word made particular
  ring: `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/>`,

  // root: three letters underground, everything grows from them
  root: P("M12 3v9") + P("M12 12c-3 0-5 2-5.5 6") + P("M12 12c3 0 5 2 5.5 6") +
    P("M12 12v9") + P("M9 6h6"),

  // mould: the shape a root is poured into
  mould: P("M4.5 4.5h15v15h-15z") + P("M8.5 8.5h7v7h-7z"),

  // clock: tense, and when a thing happened
  clock: `<circle cx="12" cy="12" r="8.5"/>` + P("M12 7.5V12l3 2"),

  // back: the past tense
  back: P("M20 12H5") + P("M10.5 6.5 5 12l5.5 5.5") + P("M20 6.5v11"),

  // forward: the present, running on
  forward: P("M4 12h15") + P("M13.5 6.5 19 12l-5.5 5.5") + P("M4 6.5v11"),

  // call: the imperative, and the vocative
  call: P("M4 10v4h3l6 4V6l-6 4H4Z") + P("M17 9.5a4 4 0 0 1 0 5") +
    P("M19.5 7a7.5 7.5 0 0 1 0 10"),

  // no: negation
  no: `<circle cx="12" cy="12" r="8.5"/>` + P("M6.5 17.5 17.5 6.5"),

  // two: two of a kind, two sentence types
  two: P("M4.5 5.5h6v13h-6z") + P("M13.5 5.5h6v13h-6z"),

  // equals: the nominal sentence, which needs no verb
  equals: P("M5 9.5h14") + P("M5 14.5h14"),

  // engine: the verbal sentence, the verb driving it
  engine: P("M3 15V9h5l3-3h5v9H3Z") + P("M16 12h4.5v3H16") +
    P("M6 15v3") + P("M13 15v3"),

  // cap: the three case endings, the hats a word wears
  cap: P("M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z") +
    P("M6.5 11.5V16c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.5"),

  // key: what unlocks a meaning
  key: `<circle cx="8" cy="12" r="4"/>` + P("M12 12h9") + P("M17.5 12v3.5") +
    P("M20.5 12v2.5"),

  // eye: reading, and reading without the marks
  eye: P("M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z") +
    `<circle cx="12" cy="12" r="2.8"/>`,

  // strong: a doubled letter, and emphasis
  strong: P("M7 12h10") + P("M9 7.5 6 12l3 4.5") + P("M15 7.5l3 4.5-3 4.5"),

  // check: the small self-test at the end of a segment
  check: `<circle cx="12" cy="12" r="8.5"/>` + P("M8 12.2l2.8 2.8L16 9.5"),
};

export function icon(name, cls = "art") {
  const inner = PATHS[name];
  if (!inner) return "";
  return (
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    inner +
    `</svg>`
  );
}

/** The same thing as a node, for the JS-built parts of the hub. */
export function iconEl(name, cls = "art") {
  const markup = icon(name, cls);
  if (!markup) return null;
  const t = document.createElement("template");
  t.innerHTML = markup;
  return t.content.firstElementChild;
}

export const hasIcon = (name) => Boolean(PATHS[name]);

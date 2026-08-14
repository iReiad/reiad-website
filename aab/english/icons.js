/* ============================================================
   icons.js: the little drawings for the English school.

   Same family as /deutsch/icons.js, /quran/icons.js and
   /learn/icons.js, and the same reason for existing: a shape
   survives a week away from the site in a way that "পর্ব ১৪"
   does not. Every term and every part has one mark, always drawn
   the same way, and it appears everywhere that thing appears:
   the ladder, the part card, the page head.

   A separate file rather than an import of the German set,
   because most of these are specific to this course (an engine,
   a pair of scales for register, a wave for stress) and the
   other schools should not grow shapes only this one uses.

   Rules that keep them looking like one family:
     · 24×24 box, stroke only, never filled
     · stroke-width 1.6, round caps and joins
     · currentColor, so they take the theme and the state colour
     · no letters inside a drawing. A drawing of a letter at 24px
       is a smudge, and this is an English course: the letters
       are the one thing the learner can already read
     · aria-hidden; the Bangla name next to it is the label
   ============================================================ */

const P = (d) => `<path d="${d}"/>`;

const PATHS = {
  /* ---------- the two terms ---------- */

  // seed, টার্ম ১: a beginning, the same mark the other schools use
  seed: P("M12 21v-7") + P("M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z") +
    P("M12 14c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z"),

  // ladder, টার্ম ২: the same words, carried higher
  ladder: P("M7.5 3v18") + P("M16.5 3v18") +
    P("M7.5 8h9") + P("M7.5 12.5h9") + P("M7.5 17h9"),

  /* ---------- টার্ম ১ ---------- */

  // engine, part 1: word order, the thing that drives a sentence
  engine: P("M3 15V9h5l3-3h5v9H3Z") + P("M16 12h4.5v3H16") +
    `<circle cx="7" cy="17.5" r="1.6"/><circle cx="15" cy="17.5" r="1.6"/>`,

  // equals, part 2: am/is/are, the word that sits between two things
  equals: P("M5 9.5h14") + P("M5 14.5h14"),

  // hand, part 3: have, holding something
  hand: P("M9 11V5.5a1.5 1.5 0 0 1 3 0V11") +
    P("M12 11V7a1.5 1.5 0 0 1 3 0v4") +
    P("M15 11V8.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a5 5 0 0 1-5-5v-4.5a1.5 1.5 0 0 1 3 0"),

  // gears, part 4: the verbs that run the day
  gears: `<circle cx="10" cy="10" r="3"/>` +
    P("M10 4.5v1.6M10 13.9v1.6M15.5 10h-1.6M6.1 10H4.5M13.9 6.1l-1.1 1.1M7.2 12.8l-1.1 1.1M13.9 13.9l-1.1-1.1M7.2 7.2 6.1 6.1") +
    `<circle cx="17.5" cy="17.5" r="2.2"/>`,

  // clock, part 5: right now
  clock: `<circle cx="12" cy="12" r="8.5"/>` + P("M12 7.5V12l3 2"),

  // back, part 6: yesterday
  back: P("M20 12H5") + P("M10.5 6.5 5 12l5.5 5.5") + P("M20 6.5v11"),

  // forward, part 7: tomorrow
  forward: P("M4 12h15") + P("M13.5 6.5 19 12l-5.5 5.5") + P("M4 6.5v11"),

  // key, part 8: the helpers that open a sentence
  key: `<circle cx="8" cy="12" r="4"/>` + P("M12 12h9") + P("M17.5 12v3.5") +
    P("M20.5 12v2.5"),

  // question, part 9: the six question words
  question: `<circle cx="12" cy="12" r="8.5"/>` +
    P("M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.7-.8 1.3v.6") +
    `<circle cx="12" cy="16.5" r="0.9"/>`,

  // glue, part 10: the small words that hold two things together
  glue: P("M4 8.5h7a3.5 3.5 0 0 1 0 7H4") + P("M20 8.5h-4") +
    P("M20 15.5h-4") + P("M18 5.5v13"),

  // basket, part 11: the sentence bank, things gathered for use
  basket: P("M3 9.5h18l-1.8 9a2 2 0 0 1-2 1.5H6.8a2 2 0 0 1-2-1.5L3 9.5Z") +
    P("M8.5 9.5 11 3.5") + P("M15.5 9.5 13 3.5"),

  // heart, part 12: speaking from it
  heart: P("M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z"),

  // map, part 13 and Term Two's part 17: the plan
  map: P("M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20Z") + P("M9 4v13.5") +
    P("M15 6.5V20"),

  /* ---------- টার্ম ২ ---------- */

  // link, part 1: joining two ideas
  link: P("M10 14a4 4 0 0 1 0-5.6l2-2a4 4 0 0 1 5.7 5.7l-1 1") +
    P("M14 10a4 4 0 0 1 0 5.6l-2 2a4 4 0 0 1-5.7-5.7l1-1"),

  // bridge, part 2: the present perfect, a crossing between two times
  bridge: P("M2.5 15c4.5 0 7-3.5 9.5-3.5S17 15 21.5 15") +
    P("M2.5 15v4") + P("M21.5 15v4") + P("M8 13.2V19") + P("M16 13.2V19"),

  // layers, part 3: time inside time
  layers: P("M12 3.5 21 8l-9 4.5L3 8l9-4.5Z") + P("M3 12.5 12 17l9-4.5") +
    P("M3 17 12 21.5 21 17"),

  // grid, part 4: the twelve boxes
  grid: P("M3.5 3.5h17v17h-17z") + P("M3.5 9.2h17") + P("M3.5 14.8h17") +
    P("M9.2 3.5v17") + P("M14.8 3.5v17"),

  // fork, part 5: if, the road that splits
  fork: P("M12 21V13") + P("M12 13 6 7") + P("M12 13l6-6") +
    P("M6 3.5v3.5h3.5") + P("M18 3.5V7h-3.5"),

  // gauge, part 6: how certain you are
  gauge: P("M3.5 17a8.5 8.5 0 0 1 17 0") + P("M12 17l4-5") +
    `<circle cx="12" cy="17" r="1.3"/>` + P("M3.5 17h2M18.5 17h2M12 8.5v-2"),

  // flip, part 7: the passive, the sentence turned around
  flip: P("M4 8.5h13l-3-3") + P("M20 15.5H7l3 3"),

  // quote, part 8: carrying someone else's words
  quote: P("M9 6.5c-2.5 1-4 3.2-4 6 0 1.9 1.2 3 2.7 3 1.4 0 2.5-1 2.5-2.5S9.1 10.5 7.7 10.5c-.4 0-.8.1-1.1.2") +
    P("M19 6.5c-2.5 1-4 3.2-4 6 0 1.9 1.2 3 2.7 3 1.4 0 2.5-1 2.5-2.5s-1.1-2.5-2.5-2.5c-.4 0-.8.1-1.1.2"),

  // nest, part 9: a sentence inside a sentence
  nest: P("M3 4.5h18v15H3z") + P("M7 8.5h10v7H7z"),

  // branch, part 10: -ing or to
  branch: P("M6 21V9a3 3 0 0 1 3-3h9") + P("M15 3l3 3-3 3") +
    P("M6 15h4a3 3 0 0 0 3-3v-1"),

  // puzzle, part 11: phrasal verbs, two pieces that only mean
  // something when they are pushed together
  puzzle: P("M4 4.5h6v2a1.8 1.8 0 1 0 3.6 0v-2H20v6h-2a1.8 1.8 0 1 0 0 3.6h2v6h-6v-2a1.8 1.8 0 1 0-3.6 0v2H4V4.5Z"),

  // pair, part 12: words that live together
  pair: `<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/>` +
    P("M3 20a5 5 0 0 1 10 0") + P("M13 20a5 5 0 0 1 8-4"),

  // tone, part 13: the same weight, held at three distances
  tone: P("M12 4v16") + P("M5 8h14") + P("M5 8 2.5 14h5L5 8Z") +
    P("M19 8l-2.5 6h5L19 8Z"),

  // mouth, part 14: holding the floor
  mouth: P("M3.5 12c3-4.5 14-4.5 17 0-3 4.5-14 4.5-17 0Z") +
    P("M3.5 12h17"),

  // star, part 15: the answer worth listening to
  star: P("M12 3.5l2.4 5.3 5.6.7-4.1 3.9 1.1 5.6L12 16.3l-5 2.7 1.1-5.6L4 9.5l5.6-.7L12 3.5Z"),

  // wave, part 16: stress and flow
  wave: P("M2.5 12c2 0 2-5 4-5s2 10 4 10 2-10 4-10 2 5 4 5h3"),

  /* ---------- the practice book ---------- */

  pen: P("M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z") + P("M14.5 6.5 17.5 9.5"),

  // check, for anything that has been finished
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

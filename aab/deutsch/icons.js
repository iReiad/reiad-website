/* ============================================================
   icons.js: the little drawings for the German school.

   Same family as /learn/icons.js and the same reason for
   existing: a shape survives a week away from the site in a way
   that "Teil 6" does not. Every Stufe and every Teil has one
   mark, always drawn the same way, and it appears everywhere
   that thing appears: the ladder, the Teil card, the page head.

   A separate file rather than an import of the Learn set,
   because half of these are German-specific (a mouth for the
   sounds, a hat for der/die/das, a bracket for the sentence
   bracket) and the Learn set should not grow shapes only this
   school uses.

   Rules that keep them looking like one family:
     · 24×24 box, stroke only, never filled
     · stroke-width 1.6, round caps and joins
     · currentColor, so they take the theme and the state colour
     · no letters inside a drawing, an ö would not scale
     · aria-hidden; the Bangla name next to it is the label
   ============================================================ */

const P = (d) => `<path d="${d}"/>`;

const PATHS = {
  /* ---------- the Stufen ---------- */

  // seed, Stufe 1, the same mark the starter guide uses next door
  seed: P("M12 21v-7") + P("M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z") +
    P("M12 14c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z"),

  // compass, Stufe 2, finding your bearings inside the sentence
  compass: `<circle cx="12" cy="12" r="8.5"/>` +
    P("M14.8 9.2l-1.9 4.6-4.7 1.9 1.9-4.6 4.7-1.9Z"),

  // scroll, Stufe 3, longer sentences, a story
  scroll: P("M6 3h11a1.5 1.5 0 0 1 1.5 1.5V19a2 2 0 0 1-2 2H7") +
    P("M6 3a2 2 0 0 0-2 2v2h2.5") + P("M17 21a2 2 0 0 0 2-2v-1h-2.5") +
    P("M8.5 8h7") + P("M8.5 12h7") + P("M8.5 16h4"),

  /* ---------- the Teile ---------- */

  // gift: the four things German hands you before you start
  gift: P("M3.5 11h17v9.5h-17z") + P("M2.5 7.5h19V11h-19z") + P("M12 7.5V21") +
    P("M12 7.5C10.5 4.5 6 4 6 6.6 6 8 8 8 12 7.5Z") +
    P("M12 7.5c1.5-3 6-3.5 6-.9 0 1.4-2 1.4-6 .9Z"),

  // mouth: the sounds, and speaking at all
  mouth: P("M3.5 12c3-4.5 14-4.5 17 0-3 4.5-14 4.5-17 0Z") +
    P("M8 12c0-2 1.8-3.2 4-3.2s4 1.2 4 3.2"),

  // engine: the verb in seat two, driving the sentence
  engine: P("M3 15V9h5l3-3h5v9H3Z") + P("M16 12h4.5v3H16") +
    P("M6 15v3") + P("M13 15v3"),

  // person, sein, and who is speaking
  person: `<circle cx="12" cy="7.5" r="3.5"/>` +
    P("M5 21a7 7 0 0 1 14 0"),

  // hand, haben, what you hold
  hand: P("M9 11V5.5a1.5 1.5 0 0 1 3 0V11") +
    P("M12 10.5V4.8a1.5 1.5 0 0 1 3 0V11") +
    P("M15 11V7.3a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a5.5 5.5 0 0 1-5.5-5.5v-3a1.5 1.5 0 0 1 3 0"),

  // hat, der, die, das: the hat every noun wears
  hat: P("M6.5 12.5V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v6.5") +
    P("M3 12.5h18") + P("M4.5 12.5c0 3.5 3.4 5.5 7.5 5.5s7.5-2 7.5-5.5"),

  // gears: the endings machine
  gears: `<circle cx="10" cy="10" r="3"/>` +
    P("M10 4v2") + P("M10 14v2") + P("M4 10h2") + P("M14 10h2") +
    P("M5.8 5.8 7.2 7.2") + P("M12.8 12.8l1.4 1.4") +
    `<circle cx="17" cy="17" r="2.2"/>` + P("M17 13.5V15") + P("M17 19v1.5") + P("M13.5 17H15"),

  // no, nicht and kein
  no: `<circle cx="12" cy="12" r="8.5"/>` + P("M6 18 18 6"),

  // key: the seven question words
  key: `<circle cx="8" cy="12" r="4"/>` + P("M12 12h9") + P("M17.5 12v3.5") + P("M20.5 12v2.5"),

  // bracket: the sentence bracket, the most German shape there is
  bracket: P("M8 4H5.5v16H8") + P("M16 4h2.5v16H16") + P("M10.5 12h3"),

  // clock, numbers and time
  clock: `<circle cx="12" cy="12" r="8.5"/>` + P("M12 7.5V12l3 2"),

  // cup: the café, the market, the street
  cup: P("M4.5 7h12v7.5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z") +
    P("M16.5 9h2a2.5 2.5 0 0 1 0 5h-2") + P("M4.5 21h12"),

  // heart, von Herzen, your own words
  heart: P("M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z"),

  // map: the plan, the thirty days
  map: P("M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20Z") + P("M9 4v13.5") + P("M15 6.5V20"),

  // arrow, direction, the accusative, comparison
  arrow: P("M4 12h15") + P("M13.5 6.5 20 12l-6.5 5.5"),

  // cap: the exams at the end of the road
  cap: P("M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z") +
    P("M6.5 11v5c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-5") + P("M21.5 9v5"),

  /* ---------- states, used by the ladder and the tracker ---------- */
  check: P("M4.5 12.5 9.5 17.5 19.5 6.5"),
  play: P("M8 5.5 18.5 12 8 18.5Z"),
  book: P("M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5Z") +
    P("M4 19.5A1.5 1.5 0 0 1 5.5 18H19v3H5.5A1.5 1.5 0 0 1 4 19.5Z"),
  pen: P("M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z") + P("M14.5 6.5 17.5 9.5"),
};

/** The SVG for a name, as a string. Unknown names draw nothing
    rather than a broken box, a missing picture must never be
    louder than the words next to it. */
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

/* ============================================================
   icons.js: the little drawings.

   Why these exist: a reader who has never invested is being asked
   to hold eight steps and eight stages in their head at once. A
   shape is remembered where a number is not, "the shield one" and
   "the door one" survive a week away from the site in a way that
   "step 3" and "step 4" do not. So every step and every stage has
   one mark, always drawn the same way, and it appears everywhere
   that thing appears: the accordion, the ladder, the contents
   index, the resume card.

   Rules that keep them looking like one family:
     · 24×24 box, stroke only, never filled
     · stroke-width 1.6, round caps and joins
     · currentColor, so they take the theme and the state colour
     · no text inside a drawing, it would need translating
     · aria-hidden; the Bangla name next to it is the label

   icon(name) returns an SVG string. iconEl(name) returns a node.
   ============================================================ */

const P = (d) => `<path d="${d}"/>`;

/* Each entry is the inside of the <svg>. Keep them simple:
   these are read at 20px on a cheap phone. */
const PATHS = {
  /* ---------- the eight starter steps ---------- */

  // wallet, money you can actually spare
  wallet: P("M3 7.5A2.5 2.5 0 0 1 5.5 5H18a1 1 0 0 1 1 1v1.5") +
    P("M3 7.5v9A2.5 2.5 0 0 0 5.5 19H19a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5.5A2.5 2.5 0 0 1 3 7.5Z") +
    `<circle cx="16" cy="14" r="1.1"/>`,

  // id: the papers: a card with a face and two lines
  id: P("M3 6h18v12H3z") + `<circle cx="8.5" cy="11" r="2"/>` +
    P("M5.2 15.6a3.6 3.6 0 0 1 6.6 0") + P("M14.5 10h4") + P("M14.5 13.5h4"),

  // shield: the safe option
  shield: P("M12 3l7 2.6v5.2c0 4.2-2.9 8-7 9.2-4.1-1.2-7-5-7-9.2V5.6L12 3Z") +
    P("M9 12l2.2 2.2L15.4 10"),

  // door: the way in to the market
  door: P("M6 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17") + P("M4 21h16") +
    `<circle cx="14" cy="12.5" r="1"/>`,

  // cart: the first purchase
  cart: P("M3 4h2.2l2.3 10.4a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.5-1.2L20 7H6") +
    `<circle cx="10" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>`,

  // calendar: the same day, every month
  calendar: P("M4 6h16v14H4z") + P("M4 10h16") + P("M8.5 3.5v3") + P("M15.5 3.5v3") +
    `<circle cx="9" cy="14.5" r="1"/><circle cx="15" cy="14.5" r="1"/>`,

  // warning: the scams
  warning: P("M12 4.2 21 19.5H3L12 4.2Z") + P("M12 10v4.2") + `<circle cx="12" cy="16.9" r="0.9"/>`,

  // signpost, where to go next
  signpost: P("M12 3v18") + P("M12 6h7l2 2.5-2 2.5h-7") + P("M12 14H5l-2-2.5L5 9h7"),

  /* ---------- the eight stages ---------- */

  // seed, হাতেখড়ি, the very beginning
  seed: P("M12 21v-7") + P("M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z") +
    P("M12 16c0-2.5-2-4.5-4.5-4.5C7.5 14 9.5 16 12 16Z"),

  // book: the eighteen words
  book: P("M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5Z") +
    P("M4 19.5A1.5 1.5 0 0 1 5.5 21H19v-3") + P("M8 7.5h7") + P("M8 11h5"),

  // compass, reading the market
  compass: `<circle cx="12" cy="12" r="8.5"/>` + P("M14.8 9.2l-1.9 4.6-4.7 1.9 1.9-4.6 4.7-1.9Z"),

  // magnifier, checking it yourself
  magnifier: `<circle cx="10.5" cy="10.5" r="6.5"/>` + P("M15.3 15.3 21 21") + P("M8 10.5h5") + P("M10.5 8v5"),

  // cap, university
  cap: P("M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z") + P("M6.5 11v5c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-5") +
    P("M21.5 9v5"),

  // scroll: the dissertation
  scroll: P("M6 3h11a1.5 1.5 0 0 1 1.5 1.5V19a2 2 0 0 1-2 2H7") +
    P("M6 3a2 2 0 0 0-2 2v1.5h2.5") + P("M7 21a2 2 0 0 0 2-2V6.5H6.5") +
    P("M11 9.5h4.5") + P("M11 13h4.5"),

  // briefcase: the job
  briefcase: P("M3 8h18v11H3z") + P("M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2") +
    P("M3 13h18") + P("M11 13v2h2v-2"),

  // microscope, research level
  microscope: P("M6.5 20h12") + P("M9 20a5.5 5.5 0 0 0 5-5.5") +
    P("M11.5 4.5 8 7l3.5 5 3.5-2.5-3.5-5Z") + P("M8.8 10.7 7 12") + P("M4.5 17.5h5"),

  /* ---------- small utility marks ---------- */
  check: P("M4.5 12.5 9.5 17.5 19.5 6.5"),
  lock: P("M6 11h12v9H6z") + P("M8.5 11V8a3.5 3.5 0 0 1 7 0v3"),
  play: P("M8 5.5 18.5 12 8 18.5Z"),
  clock: `<circle cx="12" cy="12" r="8.5"/>` + P("M12 7.5V12l3 2"),
  arrow: P("M4 12h15") + P("M13.5 6.5 20 12l-6.5 5.5"),
  hand: P("M9 11V5.5a1.5 1.5 0 0 1 3 0V11") +
    P("M12 10.5V4.8a1.5 1.5 0 0 1 3 0V11") +
    P("M15 11V7.3a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a5.5 5.5 0 0 1-5.5-5.5v-3a1.5 1.5 0 0 1 3 0"),
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

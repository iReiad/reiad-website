/* ============================================================
   about.js: the one thing on the About page that must not be
   typed by hand.

   The page claims a number of lessons, stages, calculators and
   models. Written as literals, those go stale the first time a
   stage is added and nobody remembers the About page exists,
   and a page whose own arithmetic is out of date is a poor
   advertisement for someone who models for a living.

   So they are counted from the same modules the site itself
   renders from. If the count is wrong, the site is wrong.
   ============================================================ */

import { STAGES, allLessons, TOOLS, PAGES } from "/content.js";

const set = (key, value) => {
  const node = document.querySelector(`[data-tally="${key}"]`);
  if (node) node.textContent = value;
};

try {
  set("lessons", allLessons().length);
  set("stages", STAGES.length);
  set("tools", TOOLS.length);

  /* "Models" means the things you can open and drive: the three
     portfolio case studies plus the stock check. They are the
     pages tagged `case` or `tool` in the manifest, which is the
     same tagging the menu and the palette group by, so adding a
     fourth case study updates this line without anyone editing it. */
  set("models", PAGES.filter((p) => !p.private
    && (p.group === "case" || p.group === "tool")).length);
} catch {
  /* The em-dashes already in the markup are the fallback: a
     failed count leaves a tidy page, not a page full of NaN. */
}

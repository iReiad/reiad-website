/* ============================================================
   ui/label.tsx: the small line above a heading.

   Forty-four call sites write `className="section-label mono"`
   and twenty-one write `className="eyebrow mono"`.

   ---- they are not the same object ----

   An earlier note here said they were, and they are not. Both are
   a short line in the mono face, in the accent, above a heading,
   and the difference is what they divide:

     `.section-label` closes with a rule and 26px under it. It is
     the top of a SECTION, and the rule is what separates that
     section from the one before it.

     `.eyebrow` has no rule and 18px. It is the top of a hero,
     where there is nothing above it to be separated from.

   Swapping one for the other is not a rename, so there are two
   components, and this file is the only place either name is
   written.

   ---- it renders the class, not utilities ----

   The version before this styled itself with Tailwind, at
   `text-ink-soft`, with no rule and no margin, which is none of
   the three things `.section-label` does. So its one caller,
   `school-hub-page.tsx`, drew a quiet grey label with no
   separator while `school-hub.tsx` drew an accent one with a rule
   under it, on the same site, for the same thing, and the two
   are meant to be the same page rendered two ways.

   `aab/engage.js` also builds one, in the browser, under every
   piece on the site. Same argument as `ui/stat.tsx` at more
   length: the class is the interface while anything outside React
   still writes it.

   ---- it is not a heading ----

   A `<span>`, deliberately. It reads as one to a person and would
   be a second, wrong heading to a screen reader working down the
   outline: an eyebrow above an h2 is not an h1. The heading under
   it carries the level.
   ============================================================ */

import type { ReactNode } from "react";

/** The top of a section: accent, mono, and a rule under it. */
export function SectionLabel({
  children, className, lang, id,
}: { children: ReactNode; className?: string; lang?: string; id?: string }) {
  return (
    <span className={["section-label mono", className].filter(Boolean).join(" ")}
          lang={lang} id={id}>
      {children}
    </span>
  );
}

/** The top of a hero: the same line, with nothing above it to be
    separated from, so no rule. */
export function Eyebrow({
  children, className, lang, id,
}: { children: ReactNode; className?: string; lang?: string; id?: string }) {
  return (
    <span className={["eyebrow mono", className].filter(Boolean).join(" ")}
          lang={lang} id={id}>
      {children}
    </span>
  );
}

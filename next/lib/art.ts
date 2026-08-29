/* ============================================================
   art.ts: the site's half of the drawing resolver.

   `shared/art.ts` is the decision and this is the two tables it
   has to be told about: which subject the rail names for a
   section, and what colour that section is. Both live in
   `shared/nav.ts`, and the shared file deliberately does not
   import it, because `nav.ts` imports the subject vocabulary FROM
   there and a cycle between the two would be a real one.

   Everything on this site that draws a card for a ROW goes
   through `artOf`: a piece on a hub, a lesson in a ladder, a
   headline off the market feed. Everything that draws a card for
   a thing the rail lists reads `item.art` instead, because that
   one was chosen rather than derived.
   ============================================================ */

import { NAV, accentFor } from "@reiad/shared/nav";
import { artFor, type ArtSource, type ArtSubject } from "@reiad/shared/art";

/** The rail's own subject for a section, by key. Built once: it
    is twenty entries and it is asked once per card. */
const SUBJECT_OF: Map<string, ArtSubject> = new Map(
  NAV.flatMap((group) => group.items)
    .filter((item) => item.art)
    .map((item) => [item.key ?? item.href, item.art as ArtSubject]),
);

/** Which drawing and which colour, for anything that is a row.

    `in-skills` is the one alias, exactly as `accentStyle()` has
    it: four routes pass it for a piece that lives inside the
    skills half. */
export function artOf(src: ArtSource): { subject: ArtSubject; accent: string } {
  const key = src.section === "in-skills" ? "skills" : src.section;
  return artFor({ ...src, section: key }, accentFor(key), (k) => SUBJECT_OF.get(k));
}

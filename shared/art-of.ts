/* ============================================================
   art-of.ts: the drawing resolver, with the rail's two tables
   already handed to it.

   `art.ts` is the DECISION and deliberately imports nothing:
   `nav.ts` takes the subject vocabulary from it, and a value
   import back the other way would be a cycle. So the two tables
   the decision needs, which subject the rail names for a section
   and what colour that section is, are passed in.

   This file is the passing in, once, for everybody who needs it.
   It was `next/lib/art.ts` and reachable only by the Next Worker,
   which was fine until the share card needed the same answer: a
   card is drawn in a browser, from a Vite bundle that cannot
   import `shared/` at all, so the answer is worked out by
   `functions/api/admin/[[route]].ts` and sent. Three runtimes,
   one rule.
   ============================================================ */

import { NAV, accentFor } from "./nav.ts";
import { artFor, subjectFor, type ArtSource, type ArtSubject } from "./art.ts";

/** The rail's own subject for a section, by key. Built once: it
    is twenty entries and it is asked once per card. */
const SUBJECT_OF: Map<string, ArtSubject> = new Map(
  NAV.flatMap((group) => group.items)
    .filter((item) => item.art)
    .map((item) => [item.key ?? item.href, item.art as ArtSubject]),
);

/** `in-skills` is the one alias, exactly as `accentStyle()` has
    it: four routes pass it for a piece that lives inside the
    skills half. */
const keyOf = (section: string | null | undefined): string | null | undefined =>
  section === "in-skills" ? "skills" : section;

/** Which drawing and which colour, for anything that is a row. */
export function artOf(src: ArtSource): { subject: ArtSubject; accent: string } {
  const key = keyOf(src.section);
  return artFor({ ...src, section: key }, accentFor(key), (k) => SUBJECT_OF.get(k));
}

/** Which drawing alone, for a caller that already knows the
    colour or does not draw one. */
export function subjectOf(src: ArtSource): ArtSubject {
  return subjectFor({ ...src, section: keyOf(src.section) }, (k) => SUBJECT_OF.get(k));
}

/* ============================================================
   art-of.ts: the drawing resolver, with the rail's two tables
   already handed to it.

   `art.ts` is the DECISION and deliberately imports nothing,
   because `nav.ts` takes the subject vocabulary from it and a
   value import back would be a cycle. This file is the passing
   in, once, for the three runtimes that need the same answer.
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

/* ============================================================
   What an account says about its reader, and the two
   vocabularies that describes. Both are a CHECK constraint in
   Postgres, and a component keeping its own copy agrees with the
   database on the day it is typed and not after.
   `functions/api/site.ts` serves them, so the Android app needs
   no third spelling.

   THE IDS ARE THE CONSTRAINT'S VALUES AND MUST NOT BE RENAMED:
   they are in real rows. The words beside them are the page's.
   ============================================================ */

export interface Choice {
  /** The value stored. In a CHECK constraint and in real rows. */
  id: string;
  label: string;
  /** One line under the label. Not decoration: a list of three
      bare words is three guesses about what they mean. */
  note: string;
}

/** How often somebody means to practise. `''` is a fourth value
    the constraint allows and this list deliberately omits: it
    means "not answered", and a radio group with an unanswered
    option cannot be unanswered. */
export const PACES: Choice[] = [
  { id: "daily", label: "Every day", note: "or as near as life allows" },
  { id: "often", label: "Most days", note: "four or five a week" },
  { id: "sometimes", label: "When I can", note: "no particular rhythm" },
];

/** The three kinds of target, and the test a fourth has to pass.
    Each is a source of progress the site ALREADY HOLDS: a
    `course` reads the reader's ticks, a `habit` reads
    `days-active`, and a `metric` is a number this site cannot
    see, so the reader types it in. If the site cannot measure it
    out of what it already has, the bar is a decoration. */
export const TARGET_KINDS: Choice[] = [
  { id: "course", label: "Finish a course", note: "measured by your own ticks" },
  {
    id: "habit",
    label: "Turn up n days a week",
    note: "measured by the days you were here",
  },
  {
    id: "metric",
    label: "Reach a number",
    note: "a figure you keep and update yourself",
  },
];

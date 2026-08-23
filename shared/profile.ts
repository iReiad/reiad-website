/* ============================================================
   What an account says about its reader, and the two
   vocabularies that describes.

   Both are answers to a question on `/account`, both are a
   CHECK constraint in Postgres, and both were written out a
   second time in a React component. That is the failure
   `check-rows.ts` section 2 already exists for one table along:
   a handler keeping its own copy of a vocabulary agrees with the
   database on the day it is typed and not after.

   ---- and there is a third reader now ----

   The Android app. A pace or a kind added here has to reach a
   phone, and the rule in `CLAUDE.md` is that anything which is
   DATA reaches it with no release. So these are served by
   `functions/api/site.ts` like every other table, rather than
   being spelled a third time in Kotlin.

   The ids are the constraint's values and MUST NOT be renamed:
   they are in real rows. The words beside them are the page's,
   and changing one of those is free.
   ============================================================ */

export interface Choice {
  /** The value stored. In a CHECK constraint and in real rows. */
  id: string;
  label: string;
  /** One line under the label. Not decoration: a list of three
      bare words is three guesses about what they mean. */
  note: string;
}

/** How often somebody means to practise.

    `''` is a fourth value the constraint allows and this list
    deliberately does not carry: it means "not answered", which is
    the absence of a choice rather than one of them. A radio group
    with an "unanswered" option in it is a group that cannot be
    unanswered. */
export const PACES: Choice[] = [
  { id: "daily", label: "Every day", note: "or as near as life allows" },
  { id: "often", label: "Most days", note: "four or five a week" },
  { id: "sometimes", label: "When I can", note: "no particular rhythm" },
];

/** The three kinds of target, and the test a fourth has to pass.

    Each is a source of progress the site ALREADY HOLDS: a
    `course` reads the reader's ticks, a `habit` reads
    `days-active`, and a `metric` is a number this site cannot
    see, so the reader types it in.

    A fourth kind has to pass that test. If the site cannot
    measure it out of something it already has, the bar would be
    a decoration. */
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

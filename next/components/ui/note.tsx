/* ============================================================
   ui/note.tsx: the boxes a page puts an aside in.

   Not the article's. An article's body is HTML in a database and
   the classes it may carry are policed in three places, which is
   why `@layer article` sits above the utilities permanently. This
   is for the boxes a ROUTE writes: the warning on the workbook,
   the "this section is private" on the course shell, the
   not-connected message, the empty state on a hub.

   Each of those was a `<p>` with a hand-picked border colour, and
   there are enough of them now that they disagree.

   ---- an empty state is a kind of note ----

   `<Empty>` below, and it takes an action rather than leaving the
   reader at a dead end. A page that says "nothing here" and stops
   is a page that has told somebody they are lost without saying
   where to go.
   ============================================================ */

import type { ReactNode } from "react";
import { Surface } from "./surface";

export type NoteTone = "accent" | "warn" | "danger" | "quiet";

/* The left rail is what makes a note read as an aside rather than
   as a paragraph in a box. Its colour is the tone's; the ground
   stays the panel, so a page of notes does not become a page of
   coloured blocks. */
const TONES: Record<NoteTone, string> = {
  accent: "border-l-accent",
  warn: "border-l-gold",
  danger: "border-l-danger",
  quiet: "border-l-hairline",
};

export function Note({
  tone = "accent", title, children,
}: { tone?: NoteTone; title?: ReactNode; children: ReactNode }) {
  return (
    <Surface
      material="pane"
      className={`border-l-[3px] ${TONES[tone]} px-4 py-3.5 flex flex-col gap-1.5`}
    >
      {title ? (
        <p className="text-t1 font-medium tracking-wide uppercase text-ink-soft">
          {title}
        </p>
      ) : null}
      <div className="text-t2 leading-relaxed text-ink [&>p+p]:mt-2">{children}</div>
    </Surface>
  );
}

/**
 * Nothing here yet, and where to go instead.
 *
 * `action` is not optional by accident: every empty state on this
 * site is a place a reader arrived expecting something, and the
 * useful half of the message is the way out.
 */
export function Empty({
  title, children, action,
}: { title: ReactNode; children?: ReactNode; action: ReactNode }) {
  return (
    <Surface
      material="sunk"
      className="flex flex-col items-start gap-3 px-5 py-8 text-left"
    >
      <p className="text-t4 font-medium text-ink">{title}</p>
      {children ? (
        <div className="text-t2 max-w-[52ch] leading-relaxed text-ink-soft">{children}</div>
      ) : null}
      <div className="mt-1">{action}</div>
    </Surface>
  );
}

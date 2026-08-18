/* ============================================================
   ui/stat.tsx: a figure, and what it is a figure of.

   Fifty of these across the seven case studies, every one the
   same four lines written out: a label, a placeholder, a note,
   and a `data-tile` key. Fifty copies is fifty chances for one of
   them to set its own font size, and several had.

   ---- it renders the classes, and that is deliberate ----

   This does NOT style itself with utilities, which is what the
   first version of it did, and the reason is a contract rather
   than a preference.

   Seven modules under `aab/portfolio/` and the stock check fill
   these in, and they find them by `[data-tile="x"] .tile-value`.
   Two other things follow from that:

     · `dissertation.js` BUILDS one, in the browser, out of the
       same `.tile` / `.mono` / `.tile-value` markup. A tile whose
       look lived in utilities would leave that one unstyled,
       because Tailwind's compiler cannot see a string inside a
       module any more than it can see an article body.

     · The tone colours are `.tile[data-tone="warn"] .tile-value`
       in `@layer components`, and `tw` is a LATER layer than
       `components`. So a utility on the value silently wins over
       every tone a module sets, and the page still renders: the
       number is simply never red. That is the exact shape of
       failure this repository keeps returning to.

   So the class is the interface, `@layer components` owns the
   look, and one rule there restyles all fifty. When the seven
   modules become components (ARCHITECTURE.md, Stage B) this can
   become utilities and not before.

   ---- the number is not the label ----

   Taken as three props rather than as children, because a figure,
   its caption and its footnote are three kinds of text and a
   component that took one blob would leave that to the call site,
   which is where the fifty copies came from.
   ============================================================ */

import type { ReactNode } from "react";

export function StatTile({
  label, value = "–", note, fills, tone, children,
}: {
  /** What the figure is of. Set in the mono face, in the accent. */
  label: ReactNode;
  /** The figure. An en dash by default, because on every tile on
      this site the server renders a placeholder and a module in
      the browser puts the number in. */
  value?: ReactNode;
  /** One line under it: what it is measured over, what it
      excludes, why it is not the number somebody expected.

      An EMPTY string is not the same as no note, which is why
      this is tested against null rather than for truthiness. Two
      tiles on the index page carry `<small></small>` with nothing
      in it, and dropping the element changes the tile's height by
      a line. */
  note?: ReactNode;
  /** The `data-tile` key its module writes into. Without one the
      tile is static, which is a real case: several state a figure
      that never changes. */
  fills?: string;
  /** `good`, `warn` or `bad`, when the SERVER knows. A module
      that decides at runtime sets `data-tone` itself. */
  tone?: "good" | "warn" | "bad";
  /** Anything after the note. Three tiles carry a second line. */
  children?: ReactNode;
}) {
  return (
    <div className="tile" data-tile={fills} data-tone={tone}>
      <span className="mono">{label}</span>
      <strong className="tile-value">{value}</strong>
      {note == null ? null : <small>{note}</small>}
      {children}
    </div>
  );
}

/** A row of tiles that wraps rather than scrolls.

    `.tiles` is the stylesheet's, for the same reason the tile's
    own look is: a module builds a row of these. */
export function StatRow({ children }: { children: ReactNode }) {
  return <div className="tiles">{children}</div>;
}

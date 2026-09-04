/* ============================================================
   work-card.tsx: one case study, as a card.

   ONE CARD, TWO DENSITIES, and never two cards. `/portfolio` has
   a page's worth of room and prints the paragraph and the three
   checkable facts; the front page has a band and prints one line.
   Both are this component, for the reason `deck.tsx` gives about
   `<GoCard>`: the same thing drawn two ways on two pages is two
   sets of rules to keep in step, and they stop being in step.

   The chart is `dangerouslySetInnerHTML`, which for markup that
   is not React's is the ordinary way here: `icons.tsx` and
   `card-art.tsx` both do it, and the drawings live in
   `next/lib/work.ts` as strings so nothing has to hold a second
   copy of a chart.

   `aria-hidden` on the SVG is load-bearing rather than lazy: every
   fact the drawing carries is written under it, so a reader who
   never sees it loses nothing.
   ============================================================ */

import { Chip } from "./ui/chip";
import type { Study } from "../lib/work";

export function WorkCard({ study, lead, compact }: {
  study: Study;
  /** The wide one at the top of `/portfolio`: art beside the copy
      rather than above it. */
  lead?: boolean;
  /** The front page's density: one line, no facts list. The card
      is the same card, and what changes is how much of the study
      it has room to say. */
  compact?: boolean;
}) {
  return (
    <a className={["cell work-card", lead ? "work-lead" : null,
      compact ? "work-compact" : null].filter(Boolean).join(" ")}
       href={study.url}>
      {study.spark ? (
        <svg className="work-art" viewBox="0 0 240 72" aria-hidden="true"
             dangerouslySetInnerHTML={{ __html: study.spark }} />
      ) : null}
      <div className="work-copy">
        <Chip>{lead ? `Featured · ${study.chip}` : `${study.chip} · Interactive`}</Chip>
        <h3>{study.title}</h3>
        <p>{compact ? study.line : study.paragraph}</p>
        {compact || !study.facts.length ? null : (
          <ul className="work-facts">
            {study.facts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        )}
        <span className="more">{study.go} →</span>
      </div>
    </a>
  );
}

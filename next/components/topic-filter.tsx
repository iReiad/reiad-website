"use client";

/* ============================================================
   topic-filter.tsx: the chips above the Insights cards, and the
   cards they hide.

   The chips and the cards are ONE component because filtering is
   one fact: which topic is chosen. `archive/modules/hub.js` kept
   that fact in two places, `aria-pressed` on a chip and `hidden`
   on a card, and wrote both by hand on every click. Here it is a piece of
   state and both are read off it, so the two cannot disagree.

   ---- what it does not do ----

   It does not filter on the server, and that is deliberate:
   looking at one topic is a way of looking at a page you already
   have, not a different page, so a round trip for it would be
   slower than the reader's own eyes.

   Every chip and every card is in the HTML the server sends, so
   a reader with no JavaScript gets the whole list rather than an
   empty row where the filter should be. Nothing is hidden until
   this has run, which is the same rule `ui/tab-panels.tsx`
   follows.

   `children` is whatever else belongs in the grid, which today is
   the teasers for pieces nobody has written. They are built on
   the server and handed over, so making the row interactive does
   not make them the browser's work, and they carry no topic so
   the filter never hides one.
   ============================================================ */

import { useState, type ReactNode } from "react";
import { ChipButton } from "./ui/chip";
import { SampleCard } from "./cards";
import type { Piece } from "../lib/pieces";

/** Every topic on the page, commonest first and alphabetical
    inside a tie, with how many pieces carry it. Counted from the
    cards underneath rather than from a list somebody keeps: a
    chip saying "Equities · 4" over three cards is the failure
    `CLAUDE.md` opens with. */
function tally(pieces: Piece[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const piece of pieces) {
    for (const topic of piece.topics) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function TopicFilter(
  { pieces, children }: { pieces: Piece[]; children?: ReactNode },
) {
  /* "" is Everything, which is what the page opens on and what
     the server renders. A topic nobody can choose cannot end up
     here, so there is no state in which the grid is empty. */
  const [chosen, setChosen] = useState("");

  return (
    <>
      <div className="filter-row" id="topic-filter" role="group"
           aria-label="Filter by topic">
        {/* One string rather than two expressions, so that React
            writes one text node. Two come out as
            `Everything · <!-- -->5`, which reads the same and is a
            label with a comment in the middle of it. */}
        <ChipButton pressed={chosen === ""} onClick={() => setChosen("")}>
          {`Everything · ${pieces.length}`}
        </ChipButton>
        {tally(pieces).map(([topic, count]) => (
          <ChipButton key={topic} pressed={chosen === topic}
                      onClick={() => setChosen(topic)}>
            {`${topic} · ${count}`}
          </ChipButton>
        ))}
      </div>

      <div className="cards grid-2">
        {pieces.map((piece) => (
          <SampleCard key={piece.slug} piece={piece}
                      hidden={chosen !== "" && !piece.topics.includes(chosen)} />
        ))}
        {children}
      </div>
    </>
  );
}

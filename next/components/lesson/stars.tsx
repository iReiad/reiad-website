/* ============================================================
   lesson/stars.tsx: how much a lesson matters.

   One to five, in `meta.stars`, so it is data: it reaches the
   ladder card, the lesson page and the Android app's next fetch
   without anything being released.

   ---- why a lesson needs this at all ----

   A ladder of eighty rungs read straight through is eighty
   equally important things, which is false and is also
   discouraging: a reader who has three evenings needs to know
   which four lessons those evenings should go on. Five stars is
   not a grade, it is a route through.

   The scale is written down so it stays one scale:

     5  you cannot invest without this
     4  you will make an expensive mistake without it
     3  it makes the difference between following and deciding
     2  useful, and skippable on a first pass
     1  worth knowing, not worth waiting for

   ---- and it is not a decoration ----

   `aria-label` carries the same sentence, because five glyphs
   with no text is a lesson a screen reader is told nothing
   about. The glyphs themselves are `aria-hidden`.
   ============================================================ */

import type { Say } from "@reiad/shared/lesson";
import { bnNum } from "@reiad/shared/lesson";
import { T } from "./lang";

export const STAR_WORDS: Record<number, Say> = {
  5: { bn: "এটা ছাড়া শুরুই করা যায় না", en: "You cannot start without this" },
  4: { bn: "না জানলে দামি ভুল হবে", en: "Skipping it costs money" },
  3: { bn: "অন্যের কথায় চলা আর নিজে বোঝার পার্থক্য", en: "The difference between following and deciding" },
  2: { bn: "কাজে লাগে, প্রথম বারে বাদ দেওয়া যায়", en: "Useful, skippable on a first pass" },
  1: { bn: "জানা ভালো, অপেক্ষা করার মতো না", en: "Worth knowing, not worth waiting for" },
};

const clamp = (n: unknown): number => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.min(5, Math.max(1, v)) : 3;
};

/** The row, for a lesson page: five marks and the sentence.

    `compact` is the ladder card's version, which is the marks
    alone, because a card already carries a blurb and a second
    sentence under it would push the title off the top. */
export function Stars({ n, compact }: { n: unknown; compact?: boolean }) {
  const stars = clamp(n);
  const label = STAR_WORDS[stars];

  return (
    <span className={`ls-stars${compact ? " is-compact" : ""}`}
          aria-label={`${label.bn} (${stars}/5)`}>
      <span className="ls-star-marks" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`ls-star${i <= stars ? " is-on" : ""}`} />
        ))}
      </span>
      {compact ? null : (
        <span className="ls-star-word">
          <T s={label} />
        </span>
      )}
      <span className="ls-star-count mono" aria-hidden="true">
        <span className="ls-bn" lang="bn">{bnNum(stars)}</span>
        <span className="ls-en" lang="en">{stars}</span>
      </span>
    </span>
  );
}

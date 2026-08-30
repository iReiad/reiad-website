/* ============================================================
   lesson/block.tsx: one block, whichever kind it is.

   The registry, and the frame every block sits in: a kind label,
   a title, a line saying what to do, and then the thing itself.
   The frame is here rather than in each of the eleven so that a
   reader learns one shape and then recognises it everywhere.

   ---- an unknown kind renders nothing, and that is deliberate ----

   A row can name a kind this release does not have: the Android
   app and the site fetch the same rows and are not deployed
   together, so the row is always the newer of the two. The prose
   is the lesson. A block that threw would take a whole page down
   to say that one drawing is from next week.
   ============================================================ */

import type { Block } from "@reiad/shared/lesson";
import { T } from "./lang";
import { Figure } from "./figure";
import { Chart, Lab } from "./lab";
import { Bins, Compare, Drill, Match, Order, Quiz, Reveal, Spot } from "./interactive";
import { Grid } from "./grid";

/** What each kind is called, above the block. Not decoration: a
    reader who sees "হাতে কলমে" knows before reading a word that
    this one is theirs to do rather than to read, and a reader
    scanning back through a lesson finds the quiz by its label. */
const KIND_WORDS: Record<Block["kind"], { bn: string; en: string }> = {
  quiz: { bn: "যাচাই", en: "Check yourself" },
  order: { bn: "ক্রম সাজান", en: "Put it in order" },
  match: { bn: "মিলান", en: "Match them up" },
  bins: { bn: "ভাগ করুন", en: "Sort them" },
  lab: { bn: "হাতে কলমে", en: "Try it" },
  chart: { bn: "চিত্র", en: "Figure" },
  figure: { bn: "চিত্র", en: "Figure" },
  reveal: { bn: "আগে ভাবুন", en: "Guess first" },
  compare: { bn: "পাশাপাশি", en: "Side by side" },
  spot: { bn: "খুঁজে বের করুন", en: "Find the problem" },
  drill: { bn: "করে ফেলুন", en: "Go and do it" },
  grid: { bn: "ছকে বসান", en: "Fill in the sheet" },
};

export function LessonBlock(
  { id, block, lesson, school }:
  { id: string; block: Block; lesson: string; school: string }
) {
  const word = KIND_WORDS[block.kind];
  if (!word) return null;

  const inner = (() => {
    switch (block.kind) {
      case "quiz": return <Quiz block={block} id={id} />;
      case "order": return <Order block={block} id={id} />;
      case "match": return <Match block={block} id={id} />;
      case "bins": return <Bins block={block} id={id} />;
      case "lab": return <Lab block={block} />;
      case "chart": return <Chart block={block} />;
      case "figure": return <Figure block={block} />;
      case "reveal": return <Reveal block={block} />;
      case "compare": return <Compare block={block} />;
      case "spot": return <Spot block={block} />;
      case "drill": return <Drill block={block} id={id} lesson={lesson} school={school} />;
      case "grid": return <Grid block={block} />;
      default: return null;
    }
  })();

  if (!inner) return null;

  return (
    <section className="ls-block" data-kind={block.kind} id={`b-${id}`}
             aria-labelledby={block.title ? `b-${id}-h` : undefined}>
      <p className="ls-kind mono">
        <span className="ls-bn" lang="bn">{word.bn}</span>
        <span className="ls-en" lang="en">{word.en}</span>
      </p>
      {block.title ? (
        <h3 className="ls-title bn-h" id={`b-${id}-h`}><T s={block.title} /></h3>
      ) : null}
      {block.note ? (
        <p className="ls-block-note"><T s={block.note} /></p>
      ) : null}
      {inner}
    </section>
  );
}

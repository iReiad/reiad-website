/* /tools/research: the board, and the front door of the studio.
   RESEARCH.md section 7 is the reasoning; `components/research/board.tsx`
   is all of it. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../components/research/frame";
import { Board } from "../../../../components/research/board";
import { word } from "@reiad/shared/research-words";

const lede = word("rs.lede");

export const metadata: Metadata = pageMeta({
  path: "/tools/research",
  title: "Research Studio · Reiad's Library",
  description: "One place to do a piece of academic research from the first question "
    + "to the last footnote: the library, the notebook, the questions, the plan, "
    + "and everything a year of work would ask for, in Bangla and in English.",
  ogTitle: "Research Studio",
  ogDescription: "Sources, notes, questions, tasks and the plan, on your own account, "
    + "on every device.",
  card: "tools",
});

export default function ResearchPage() {
  return (
    <ResearchFrame lede={{ en: lede.en, bn: lede.bn }} wide>
      <Board />
    </ResearchFrame>
  );
}

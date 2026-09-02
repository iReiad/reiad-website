/* /tools/research/questions. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Questions } from "../../../../../components/research/questions";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/questions",
  title: "The questions · Research Studio · Reiad's Library",
  description: "The research question at the top, hypotheses under it, claims under those, and what in the library speaks to each.",
  ogTitle: "The questions · Research Studio",
  ogDescription: "The research question at the top, hypotheses under it, claims under those, and what in the library speaks to each.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/questions" wide>
      <Questions />
    </ResearchFrame>
  );
}

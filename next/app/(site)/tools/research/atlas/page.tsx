/* /tools/research/atlas. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Soon } from "../../../../../components/research/soon";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/atlas",
  title: "The atlas · Research Studio · Reiad's Library",
  description: "The graph of everything, the citation network, the literature on a year axis, and the people.",
  ogTitle: "The atlas · Research Studio",
  ogDescription: "The graph of everything, the citation network, the literature on a year axis, and the people.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/atlas" wide>
      <Soon href="/tools/research/atlas" />
    </ResearchFrame>
  );
}

/* /tools/research/find. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Soon } from "../../../../../components/research/soon";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/find",
  title: "Find · Research Studio · Reiad's Library",
  description: "One search over the world's indexes, saved searches, and a weekly alert for what is new.",
  ogTitle: "Find · Research Studio",
  ogDescription: "One search over the world's indexes, saved searches, and a weekly alert for what is new.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/find" wide>
      <Soon href="/tools/research/find" />
    </ResearchFrame>
  );
}

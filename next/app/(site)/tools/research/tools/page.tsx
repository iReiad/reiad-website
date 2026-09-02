/* /tools/research/tools. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Soon } from "../../../../../components/research/soon";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/tools",
  title: "The workshop · Research Studio · Reiad's Library",
  description: "Thirty small tools for the small jobs of research, one card each.",
  ogTitle: "The workshop · Research Studio",
  ogDescription: "Thirty small tools for the small jobs of research, one card each.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/tools" wide>
      <Soon href="/tools/research/tools" />
    </ResearchFrame>
  );
}

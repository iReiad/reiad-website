/* /tools/research/read. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Soon } from "../../../../../components/research/soon";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/read",
  title: "The reading room · Research Studio · Reiad's Library",
  description: "The queue, and a PDF reader with five kinds of highlight and notes anchored to the text.",
  ogTitle: "The reading room · Research Studio",
  ogDescription: "The queue, and a PDF reader with five kinds of highlight and notes anchored to the text.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/read" wide>
      <Soon href="/tools/research/read" />
    </ResearchFrame>
  );
}

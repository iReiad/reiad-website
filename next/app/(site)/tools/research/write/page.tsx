/* /tools/research/write. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Desk } from "../../../../../components/research/rooms-client";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/write",
  title: "The writing desk · Research Studio · Reiad's Library",
  description: "Chapters and papers with citations in any style, footnotes, figures that point at runs, and exports to Word.",
  ogTitle: "The writing desk · Research Studio",
  ogDescription: "Chapters and papers with citations in any style, footnotes, figures that point at runs, and exports to Word.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/write" wide>
      <Desk />
    </ResearchFrame>
  );
}

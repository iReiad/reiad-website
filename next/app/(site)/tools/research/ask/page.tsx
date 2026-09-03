/* /tools/research/ask. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Ask } from "../../../../../components/research/ask";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/ask",
  title: "The assistant · Research Studio · Reiad's Library",
  description: "Reads only what the studio holds, cites only what is there, and never writes without a press.",
  ogTitle: "The assistant · Research Studio",
  ogDescription: "Reads only what the studio holds, cites only what is there, and never writes without a press.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/ask" wide>
      <Ask />
    </ResearchFrame>
  );
}

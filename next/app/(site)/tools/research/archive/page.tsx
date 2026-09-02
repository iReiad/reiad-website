/* /tools/research/archive. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Archive } from "../../../../../components/research/archive";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/archive",
  title: "The archive · Research Studio · Reiad's Library",
  description: "Everything that happened, every version, the bin, and a copy of all of it in open formats.",
  ogTitle: "The archive · Research Studio",
  ogDescription: "Everything that happened, every version, the bin, and a copy of all of it in open formats.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/archive" wide>
      <Archive />
    </ResearchFrame>
  );
}

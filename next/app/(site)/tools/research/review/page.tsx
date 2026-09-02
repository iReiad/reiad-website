/* /tools/research/review. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Soon } from "../../../../../components/research/soon";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/review",
  title: "The review room · Research Studio · Reiad's Library",
  description: "A systematic or scoping review from protocol to PRISMA.",
  ogTitle: "The review room · Research Studio",
  ogDescription: "A systematic or scoping review from protocol to PRISMA.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/review" wide>
      <Soon href="/tools/research/review" />
    </ResearchFrame>
  );
}

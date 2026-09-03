/* /tools/research/methods. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Methods } from "../../../../../components/research/methods";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/methods",
  title: "The methods room · Research Studio · Reiad's Library",
  description: "How to do a thing, as a lesson with a worked example.",
  ogTitle: "The methods room · Research Studio",
  ogDescription: "How to do a thing, as a lesson with a worked example.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/methods" wide>
      <Methods />
    </ResearchFrame>
  );
}

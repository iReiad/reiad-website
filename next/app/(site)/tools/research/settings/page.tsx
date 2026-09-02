/* /tools/research/settings. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Settings } from "../../../../../components/research/settings";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/settings",
  title: "Settings · Research Studio · Reiad's Library",
  description: "Your projects, your name on exports, the citation style, the connections, and the bookmarklet.",
  ogTitle: "Settings · Research Studio",
  ogDescription: "Your projects, your name on exports, the citation style, the connections, and the bookmarklet.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/settings" wide>
      <Settings />
    </ResearchFrame>
  );
}

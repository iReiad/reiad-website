/* /tools/research/library. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Library } from "../../../../../components/research/library";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/library",
  title: "The library · Research Studio · Reiad's Library",
  description: "Every source, by DOI, ISBN, link, file or Zotero, as one record each.",
  ogTitle: "The library · Research Studio",
  ogDescription: "Every source, by DOI, ISBN, link, file or Zotero, as one record each.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/library" wide>
      <Library />
    </ResearchFrame>
  );
}

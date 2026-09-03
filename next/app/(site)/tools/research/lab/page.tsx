/* /tools/research/lab. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Lab } from "../../../../../components/research/lab";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/lab",
  title: "The lab · Research Studio · Reiad's Library",
  description: "Datasets, a spreadsheet, SQL, regressions, Python in the browser, and every result as a run.",
  ogTitle: "The lab · Research Studio",
  ogDescription: "Datasets, a spreadsheet, SQL, regressions, Python in the browser, and every result as a run.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/lab" wide>
      <Lab />
    </ResearchFrame>
  );
}

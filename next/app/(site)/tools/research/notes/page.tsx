/* /tools/research/notes. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Notebook } from "../../../../../components/research/notes";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/notes",
  title: "The notebook · Research Studio · Reiad's Library",
  description: "Six kinds of note, the daily log, and the links between them.",
  ogTitle: "The notebook · Research Studio",
  ogDescription: "Six kinds of note, the daily log, and the links between them.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/notes" wide>
      <Suspense fallback={null}><Notebook /></Suspense>
    </ResearchFrame>
  );
}

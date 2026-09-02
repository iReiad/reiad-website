/* /tools/research/clip?u=: the bookmarklet's landing. Not a room
   and not in the pages table: a press on a paper's page arrives
   here and leaves for the source it filed. */

import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Clip } from "../../../../../components/research/clip";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/tools/research/clip",
    title: "Save to the studio · Research Studio · Reiad's Library",
    description: "Files the page the bookmarklet was pressed on as a source.",
    ogTitle: "Save to the studio",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default function ClipPage() {
  return (
    <ResearchFrame title={{ en: "Save to the studio", bn: "স্টুডিওতে রাখুন" }}>
      <Suspense fallback={null}><Clip /></Suspense>
    </ResearchFrame>
  );
}

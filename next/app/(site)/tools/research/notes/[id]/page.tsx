/* /tools/research/notes/<id>: one note, by id. The same
   room with the row already open, so a link from the board or a
   search lands on the thing rather than on the list. */

import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "../../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../../components/research/frame";
import { Notebook } from "../../../../../../components/research/notes";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/tools/research/notes",
    title: "The notebook · Research Studio · Reiad's Library",
    description: "Six kinds of note, the daily log, and the links between them.",
    ogTitle: "The notebook · Research Studio",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ResearchFrame href="/tools/research/notes" wide>
      <Suspense fallback={null}><Notebook openId={id} /></Suspense>
    </ResearchFrame>
  );
}

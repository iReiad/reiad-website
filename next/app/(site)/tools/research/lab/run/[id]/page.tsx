/* /tools/research/lab/run/<id>: one run, whole, so a draft's figure
   or table can point at it. The same frame as the lab. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../../../components/research/frame";
import { RunPage } from "../../../../../../../components/research/run";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/tools/research/lab",
    title: "A run · The lab · Research Studio · Reiad's Library",
    description: "One result of the lab, whole: what was asked, the code, the answer and the figure.",
    ogTitle: "A run · Research Studio",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ResearchFrame href="/tools/research/lab" wide>
      <RunPage id={id} />
    </ResearchFrame>
  );
}

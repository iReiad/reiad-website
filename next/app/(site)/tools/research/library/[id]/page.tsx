/* /tools/research/library/<id>: one source, by id. The same
   room with the row already open, so a link from the board or a
   search lands on the thing rather than on the list. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../../components/research/frame";
import { Library } from "../../../../../../components/research/library";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/tools/research/library",
    title: "The library · Research Studio · Reiad's Library",
    description: "Every source, by DOI, ISBN, link, file or Zotero, as one record each.",
    ogTitle: "The library · Research Studio",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ResearchFrame href="/tools/research/library" wide>
      <Library openId={id} />
    </ResearchFrame>
  );
}

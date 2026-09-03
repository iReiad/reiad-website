/* /tools/research/read: the queue, or the reader when
   `?source=<id>&file=<key>` names a source. One static route on
   purpose: the reader has nothing to render on the server (every
   row is the reader's own and arrives after the page does), so a
   dynamic segment would cost a server render to draw a shell, and
   the browser test can serve a prerendered page and not a
   dynamic one. RESEARCH.md section 11. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { ReadingRoom } from "../../../../../components/research/rooms-client";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/read",
  title: "The reading room · Research Studio · Reiad's Library",
  description: "The queue, and a PDF reader with five kinds of highlight and notes anchored to the text.",
  ogTitle: "The reading room · Research Studio",
  ogDescription: "The queue, and a PDF reader with five kinds of highlight and notes anchored to the text.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/read" wide>
      <ReadingRoom />
    </ResearchFrame>
  );
}

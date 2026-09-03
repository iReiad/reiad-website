/* /tools/research/field. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { FieldRoom } from "../../../../../components/research/field";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/field",
  title: "The field room · Research Studio · Reiad's Library",
  description: "Participants by pseudonym, interviews, transcription, a codebook, coding and surveys.",
  ogTitle: "The field room · Research Studio",
  ogDescription: "Participants by pseudonym, interviews, transcription, a codebook, coding and surveys.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/field" wide>
      <FieldRoom />
    </ResearchFrame>
  );
}

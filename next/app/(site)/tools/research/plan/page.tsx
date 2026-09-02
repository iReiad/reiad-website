/* /tools/research/plan. RESEARCH.md is the plan; the room's own file is the
   reasoning. The frame takes the title, the colour and the lede out
   of the one table in `lib/research-pages.ts`. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../components/research/frame";
import { Tasks } from "../../../../../components/research/tasks";

export const metadata: Metadata = pageMeta({
  path: "/tools/research/plan",
  title: "The planner · Research Studio · Reiad's Library",
  description: "Projects, milestones, the task board, meetings and deadlines as facts.",
  ogTitle: "The planner · Research Studio",
  ogDescription: "Projects, milestones, the task board, meetings and deadlines as facts.",
  card: "tools",
});

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/plan" wide>
      <Tasks />
    </ResearchFrame>
  );
}

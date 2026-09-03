/* /tools/research/plan/week: the weekly review. RESEARCH.md
   section 17: what was done, what is next, what is waiting and for
   how long, the time in sessions, and one box for the week's note.
   Sunday morning is a suggestion in Settings and never a
   notification. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../../components/research/frame";
import { WeekReview } from "../../../../../../components/research/plan";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/tools/research/plan",
    title: "The weekly review · Research Studio · Reiad's Library",
    description: "What was done, what is next, what is waiting, and one box for the week's note.",
    ogTitle: "The weekly review · Research Studio",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ResearchFrame href="/tools/research/plan" title={{ en: "The weekly review", bn: "সাপ্তাহিক পর্যালোচনা" }} wide>
      <WeekReview />
    </ResearchFrame>
  );
}

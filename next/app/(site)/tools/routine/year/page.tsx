/* ============================================================
   /tools/routine/year

   Its own address rather than a tab, because a tab is not a
   place: it cannot be linked, bookmarked, or opened from the
   dashboard's own header. `/tools/routine` is the dashboard and
   this is one of the two things it links to.

   Client-filled for the reason the dashboard is: what this shows
   is one person's own private rows, read with their own token.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { RoutineYear } from "../../../../../components/routine/year";

export const metadata: Metadata = pageMeta({
  path: "/tools/routine/year",
  title: "The year · Routine · Reiad's Library",
  description: "A year of your routine: twelve weeks of days, what has stuck, and the two things that only grow.",
  ogTitle: "A year of your routine",
  card: "tools",
});

export default function Page() {
  return (
    <main id="main" className="wrap rt-page">
      <h1 className="rt-title">বছর</h1>
      <RoutineYear />
    </main>
  );
}

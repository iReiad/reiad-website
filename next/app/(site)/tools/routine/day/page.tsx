/* ============================================================
   /tools/routine/day

   Its own address rather than a tab, because a tab is not a
   place: it cannot be linked, bookmarked, or opened from the
   dashboard's own header. `/tools/routine` is the dashboard and
   this is one of the two things it links to.

   Client-filled for the reason the dashboard is: what this shows
   is one person's own private rows, read with their own token.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { RoutineDay } from "../../../../../components/routine/day";

export const metadata: Metadata = pageMeta({
  path: "/tools/routine/day",
  title: "Today · Routine · Reiad's Library",
  description: "One day of your routine: mark what you did, how it felt, and one good thing about it.",
  ogTitle: "Today \u00b7 your routine",
  card: "tools",
});

export default function Page() {
  return (
    <main id="main" className="wrap rt-page">
      <h1 className="rt-title">আজকের দিন</h1>
      <RoutineDay />
    </main>
  );
}

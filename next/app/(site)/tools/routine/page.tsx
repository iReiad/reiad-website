/* ============================================================
   /tools/routine

   A day of somebody's own: mark what you did, write one good
   thing, and keep it. `ROUTINE.md` is the plan and the reasoning.

   ---- everything a reader sees here is client-filled ----

   The same arrangement as `/account` and `/tools/live`, and for
   the same reason: what this page shows is one person's own
   private rows, read with their own token out of their own
   localStorage. The server has neither, and HTML it rendered
   would be one reader's day cached at an address every reader
   shares.

   So the server renders the frame and the heading, and
   `<RoutineDashboard>` fills it. Signed out, that component
   draws a short invitation rather than an empty shell: a
   redirect would lose the address somebody was sent, and a
   blank page looks broken.

   The day and the year have their own addresses under this one.
   They were two tabs here, which made the landing page a
   checklist; the dashboard is the landing page now and both are
   still one press away.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { RoutineDashboard } from "../../../../components/routine/dashboard";

export const metadata: Metadata = pageMeta({
  path: "/tools/routine",
  title: "Routine · a day of your own · Reiad's Library",
  description: "A daily routine that is yours and private: mark what you did, "
    + "write one good thing, and keep a year of them. Nothing counts days in "
    + "a row, nothing turns red, and nothing here can be failed.",
  ogTitle: "Routine · a day of your own",
  /* "No streaks" was here and the test caught it, which is the
     test doing its job on a line a reader sees. It is also
     jargon: "nothing counts the days in a row" says the same
     thing to a fourteen-year-old, which is §9's copy rule. */
  ogDescription: "Mark what you did, write one good thing, keep the year. "
    + "Nothing counts the days in a row and nothing turns red.",
  card: "tools",
});

export default function RoutinePage() {
  return (
    <main id="main" className="wrap rt-page">
      <h1 className="rt-title">রুটিন</h1>
      <RoutineDashboard />
    </main>
  );
}

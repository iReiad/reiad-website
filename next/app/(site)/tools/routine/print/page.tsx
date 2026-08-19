/* ============================================================
   /tools/routine/print

   The week on paper, and the reason it exists is the last
   sentence of the build spec's section 8: "this is the paper
   fallback and it matters."

   A routine that only works on a screen is a routine that stops
   on the day the screen is flat, and a fourteen-year-old's
   phone is flat more often than anybody's. So the blank sheet
   is the point of the page and the filled one is the bonus.

   No app chrome: `@media print` in the stylesheet already takes
   the rail, the bar and the footer away, so this renders a page
   rather than a page minus a site.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { RoutinePrint } from "../../../../../components/routine/print";
import { ButtonLink } from "../../../../../components/ui/button";

export const metadata: Metadata = pageMeta({
  path: "/tools/routine/print",
  title: "Routine on paper · Reiad's Library",
  description: "Your week as one sheet of A4: blank to fill in with a pen, "
    + "or filled in with the week you have just had.",
  ogTitle: "Routine on paper",
  ogDescription: "Your week as one sheet: blank for a pen, or filled in.",
  card: "tools",
});

export default function RoutinePrintPage() {
  return (
    <main id="main" className="wrap rt-page rt-print">
      <p className="rt-back rt-print-controls">
        <ButtonLink kind="quiet" size="sm" href="/tools/routine">
          ‹ back to today
        </ButtonLink>
      </p>
      <RoutinePrint />
    </main>
  );
}

"use client";

/* ============================================================
   /admin's error boundary.

   ---- why this route has one and most do not ----

   A reading page that throws is a reading page nobody can read,
   and the reader goes somewhere else. This page is the one
   somebody opens BECAUSE something is broken, so it failing
   quietly is the worst of the two.

   THE EVENING THIS EXISTS FOR. /admin drew its heading and its
   two credential cards and none of the fourteen panels above and
   below them, in one browser and not another, for a day. The
   HTML was right, the chunks were right, the stylesheet was
   right, every endpoint answered, the build the page named
   matched production, and the same page in the same account
   rendered all nineteen headings in a private window. Nothing on
   the page said anything was wrong, so every screenshot of it
   looked like a page that had simply been built that way, and
   four separate causes were investigated and ruled out before
   the difference between the two windows was taken seriously.

   A boundary would not have found the cause. It would have said
   "this page did not finish", which is the sentence that turns a
   design question into a bug report.

   ---- what it cannot catch, said plainly ----

   Only a throw during render or in an effect, in this segment. A
   component that renders nothing because its module never
   arrived, or that is removed from the document afterwards by
   something outside the page, throws nothing and reaches nothing
   here. That was this evening's failure and this would not have
   caught it either. It is worth having anyway for the failures
   it does catch, and worth saying so rather than leaving the
   next person to assume they are covered.
   ============================================================ */

import { useEffect } from "react";
import { Surface } from "../../../components/ui/surface";
import { Button } from "../../../components/ui/button";

export default function AdminError(
  { error, reset }: { error: Error & { digest?: string }; reset: () => void },
) {
  useEffect(() => {
    /* The console is where somebody looking at a broken admin
       page will already be, and a digest is what a production
       build gives instead of a message. */
    console.error("[/admin] the panel tree threw:", error);
  }, [error]);

  return (
    <div className="ad-page">
      <Surface material="pane" className="ad-panel">
        <h3>This page did not finish</h3>
        <p className="ad-quiet">
          Something threw while the panels were being drawn, so what you can see
          is part of a page rather than all of it. That is worth knowing: a page
          that stops halfway and a page that was built this way look the same.
        </p>
        {error.digest ? (
          <p className="ad-quiet mono">digest {error.digest}</p>
        ) : (
          <p className="ad-quiet mono">{error.message.slice(0, 200)}</p>
        )}
        <Button kind="ghost" size="sm" onClick={reset}>Try drawing it again</Button>
        <p className="ad-quiet">
          If it fails the same way twice, the console has the whole of it. A
          request that failed with <code>ERR_BLOCKED_BY_CLIENT</code> is an
          extension in this browser rather than anything on the site: an
          InPrivate window has extensions off by default, so if the page is
          whole there and not here, that is the difference.
        </p>
      </Surface>
    </div>
  );
}

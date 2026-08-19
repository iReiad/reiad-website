/* ============================================================
   /desk

   The desk's shell, ported out of the hand-written page Vite
   used to build it from, with archive/TRANSITION.md Stage 11.6.

   ---- what moved, and what did not ----

   The shell. What is inside `#desk-root` is still the Vite
   bundle at `/desk/app.js`, built from `app/src/**` and
   committed, exactly as it was.

   11.6 also asks for one build instead of three, with both apps
   as routes in this app. That half is not here, and the reason is
   the one under Stage 11: both bundles import `/content.js`,
   `/api.js`, `/auth.js`, `/editor.js`, `/share-card.js` and
   `/photo.js` out of `aab/` as runtime externals, deliberately,
   so that there is one copy of each. A route in `next/` cannot
   import any of them until they move, and `editor.js` is the one
   where a second copy costs the most: two sanitisers that
   disagree is the bug the three-place rule in CLAUDE.md exists
   for.

   What this half does buy is that the shell is no longer written
   twice, and that Vite has stopped emitting a page at an address
   a route now answers.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../lib/pageMeta";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/desk",
    title: "The desk · Reiad's Library",
    description: "Reader questions, comments, enquiries, subscribers and what the site is being read for.",
    ogTitle: "The desk",
    card: "default",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main">
      {/* Hidden until `requireOwner()` in /auth.js says who is
          asking, which is the gate itself and is not ported. */}
      <div className="wrap" id="desk-root" hidden />
    </main>
  );
}

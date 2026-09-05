/* /work-alpha: the owner's research control room. WORK-ALPHA.md in
   `components/work-alpha/` is the brief.

   Client-filled, and it has to be: who is asking is a bearer in their
   own localStorage, which the server never sees, so the gate is asked in
   the browser (`components/work-alpha/owner.ts`) and a stranger is shown
   `not-found.tsx` beside this file. Not in the sitemap and not indexed,
   for the reason /admin is not. */

import type { Metadata } from "next";
import { pageMeta } from "../../../lib/pageMeta";
import { WorkAlphaMount } from "../../../components/work-alpha/mount";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/work-alpha",
    title: "Work-Alpha · Reiad's Library",
    description: "One person's month plan. Not published.",
    ogTitle: "Work-Alpha",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default function WorkAlphaPage() {
  return (
    <main id="main" className="wa-page">
      <WorkAlphaMount />
    </main>
  );
}

/* ============================================================
   /admin/research

   The desk. `next/components/admin/threads.tsx` is all of it and
   the reasoning is there.

   ---- a route of its own rather than a panel on /admin ----

   Everything on /admin is a panel: a list, a queue, a count,
   something to press. This is a place somebody sits for an hour,
   and a working surface inside a column of nineteen panels is a
   working surface you scroll to. It gets the width and the
   keyboard to itself.

   ---- and it is client-filled, for /admin's reason ----

   A thread is a row under row-level security, read with the
   reader's own bearer out of their own browser. The server has
   no such token, so HTML it rendered would be one person's
   research cached at an address.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { ResearchDesk } from "../../../../components/admin/threads";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/admin/research",
    title: "Research · Reiad's Library",
    description: "The site's own research desk. Not published.",
    ogTitle: "Research",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default function ResearchPage() {
  return (
    <main id="main" className="wrap ad-page-wrap rd-wrap">
      <h1>Research</h1>
      <ResearchDesk />
    </main>
  );
}

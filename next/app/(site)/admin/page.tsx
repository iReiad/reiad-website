/* ============================================================
   /admin

   ADMIN.md is the plan and this is stage 1 of it: the route, the
   shell, the two sign-ins and Health.

   ---- everything here is client-filled, and has to be ----

   Which credentials somebody holds is a question about a cookie
   this page cannot read and a bearer token in their own
   localStorage. The server has neither, and HTML it rendered
   would be one person's answer cached at an address.

   ---- and it is not in the sitemap ----

   `unlisted: true` in `lib/nav.ts`, the same flag the course
   section carries, plus a robots line: a page in the chrome that
   answers 403 is a promise the site cannot keep, and a page in
   the sitemap that answers 403 is the same promise made to a
   crawler.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../lib/pageMeta";
import { AdminPanel } from "../../../components/admin/panel";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/admin",
    title: "Admin · Reiad's Library",
    description: "The site's own panel. Not published.",
    ogTitle: "Admin",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main id="main" className="wrap ad-page-wrap">
      <h1>Admin</h1>
      <AdminPanel />
    </main>
  );
}

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

/* Frozen when this module is first evaluated, which for a
   prerendered route is build time. */
const BUILT = new Date().toISOString().replace("T", " ").slice(0, 19);

export default function AdminPage() {
  /* SERVER-rendered, and that is the whole point of it. Every
     other thing that could report which build is answering is
     client code, so a browser running an older bundle reports the
     older bundle's answer, or nothing at all. This line is in the
     HTML: whatever the client does afterwards, it cannot change
     what was sent.

     BUILD TIME rather than request time, because this page is
     prerendered and that is fine now: `middleware.ts` sends
     `private, no-store` for this path, so nothing between here
     and the reader may keep a copy. What was wrong was the
     `public, max-age=60, stale-while-revalidate=600` it used to
     send, which invited exactly that. A build time also names the
     ARTIFACT, which is the thing that goes stale, where a request
     time would only ever say "just now". */
  const build = process.env.SITE_BUILD || "";
  return (
    <main id="main" className="wrap ad-page-wrap">
      <h1>Admin</h1>
      <p className="ad-quiet mono">
        {build ? `build ${build.slice(0, 8)}` : "build not named by this deploy"}
        {" · built "}{BUILT} UTC
      </p>
      <AdminPanel />
    </main>
  );
}

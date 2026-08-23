/* The shell for all five course routes, once. They differ only in
   which address they answer at, and `/courses.js` reads that from
   `location.pathname`, so there is nothing per-route to pass and
   nothing per-route to keep in step.

   `current: "skills"` marks the Skills entry in the rail: this
   section lives inside Skills and has no rail entry of its own,
   deliberately, because a link every reader can see to a page
   only one reader can open is a promise the site cannot keep. */
import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";
import { trailFor, PENDING } from "../../../../lib/crumbs";
import { CourseTrail } from "../../../../components/courses/trail";

/* The trail past the section, and this is the one section that
   draws its own.

   `current: "skills"` gets Home and দক্ষতা out of the table. What
   is below cannot come from there, because the catalogue is
   admin-only: a route here knows the shape of the path and none
   of the names. `CourseTrail` is that trail, a client component
   that reads programme, course, module and lesson out of the
   address and their titles out of a fetch.

   `crumbs` is still given, and it is what the JSON-LD is built
   from. It stops at `PENDING` on purpose: a machine-readable
   trail cannot say a name the server does not have, and
   `trailJsonLd` drops the placeholder rather than publishing it. */
export default siteLayout({
  current: "skills",
  crumbs: trailFor("skills", [
    { href: "/skills/courses", label: "কোর্স" },
    { label: PENDING },
  ]),
  liveTrail: <CourseTrail />,
  scripts: <SiteScripts srcs={["/courses.js"]} />,
});

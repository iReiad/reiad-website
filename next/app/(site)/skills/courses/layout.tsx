/* The shell for all four course routes, once. They differ only in
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

/* The trail past the section. `current: "skills"` gets Home and
   দক্ষতা out of the table; the two below it cannot come from
   there, because the catalogue is admin-only and the page's own
   name arrives with the fetch. The last crumb is a placeholder
   that `name()` in `aab/src/courses.ts` rewrites, which is why
   this section is the one place a crumb is written twice. */
export default siteLayout({
  current: "skills",
  crumbs: trailFor("skills", [
    { href: "/skills/courses", label: "কোর্স" },
    { label: PENDING },
  ]),
  scripts: <SiteScripts srcs={["/courses.js"]} />,
});

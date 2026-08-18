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

export default siteLayout({
  current: "skills",
  scripts: <SiteScripts srcs={["/courses.js"]} />,
});

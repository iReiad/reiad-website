/* The home page's own root layout. A route group can carry one,
   which is what lets `/` have a shell of its own beside the one
   every other page in `(site)` builds for itself. */

import { siteLayout } from "../../components/page";

export default siteLayout({
  scripts: <script type="module" src="/home.js" />,
});

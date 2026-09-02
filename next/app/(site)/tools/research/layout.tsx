import { siteLayout } from "../../../../components/page";

/* The shell for every room of the Research Studio, and the ONLY
   layout under this directory: a second one below it would draw
   the rail, the bar, the footer and the boot script twice and take
   `--rail-w` off the width twice, which is what happened to the
   desk under /admin. `check-routes.ts` counts. */
export default siteLayout({
  current: "research",
  skip: "Skip to the studio",
});

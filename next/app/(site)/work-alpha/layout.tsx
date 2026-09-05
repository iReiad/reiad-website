import { siteLayout } from "../../../components/page";

/* `ownerOnly` and `unlisted` in shared/nav.ts: the rail draws the entry
   for the owner alone, and the footer and /skills skip it. */
export default siteLayout({
  current: "work-alpha",
  skip: "Skip to the plan",
});

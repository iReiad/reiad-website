import { siteLayout } from "../../../components/page";

/* `unlisted` in lib/nav.ts, so the rail and the footer skip it and
   `current` still marks it if somebody arrives. ADMIN.md is the
   plan for what goes inside. */
export default siteLayout({
  current: "admin",
  skip: "Skip to the panel",
});

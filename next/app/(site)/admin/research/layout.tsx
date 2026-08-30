import { siteLayout } from "../../../../components/page";

/* `unlisted` in shared/nav.ts, like the panel above it, so the
   rail and the footer skip both and `current` still marks them. */
export default siteLayout({
  current: "admin",
  skip: "Skip to the desk",
});

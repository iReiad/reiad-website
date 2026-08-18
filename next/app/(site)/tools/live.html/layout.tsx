import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "live",
  skip: "Skip to the numbers",
  scripts: <SiteScripts srcs={["/tools/live.js"]} />,
});

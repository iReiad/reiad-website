import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the stress test",
  skipTo: "#stress",
  scripts: <SiteScripts srcs={["/portfolio/stress.js"]} />,
});

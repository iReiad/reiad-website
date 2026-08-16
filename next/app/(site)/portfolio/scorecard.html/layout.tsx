import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the models",
  skipTo: "#pd",
  scripts: <SiteScripts srcs={["/portfolio/scorecard.js"]} />,
});

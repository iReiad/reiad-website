import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the analysis",
  skipTo: "#dsex",
  scripts: <SiteScripts srcs={["/portfolio/dsex.js"]} />,
});

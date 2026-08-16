import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the valuation",
  skipTo: "#dcf",
  scripts: <SiteScripts srcs={["/portfolio/dcf.js"]} />,
});

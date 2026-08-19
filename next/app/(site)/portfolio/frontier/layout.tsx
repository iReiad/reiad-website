import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the portfolio",
  skipTo: "#fund",
  scripts: <SiteScripts srcs={["/portfolio/frontier.js"]} />,
});

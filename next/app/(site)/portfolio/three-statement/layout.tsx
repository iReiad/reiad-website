import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the model",
  skipTo: "#model",
  scripts: <SiteScripts srcs={["/portfolio/three-statement.js"]} />,
});

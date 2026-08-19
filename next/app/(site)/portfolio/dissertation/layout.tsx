import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the research",
  skipTo: "#dissertation",
  scripts: <SiteScripts srcs={["/portfolio/dissertation.js"]} />,
});

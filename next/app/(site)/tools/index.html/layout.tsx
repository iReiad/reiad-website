import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "tools",
  scripts: <SiteScripts srcs={["/learn/learn.js", "/tools/tools.js"]} />,
});

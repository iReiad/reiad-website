import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  current: "tools",
  skip: "Skip to the verdict",
  scripts: <SiteScripts srcs={["/tools/stock.js"]} />,
});

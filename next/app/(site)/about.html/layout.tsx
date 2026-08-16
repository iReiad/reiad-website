import { siteLayout } from "../../../components/page";
import { SiteScripts } from "../../../components/scripts";

export default siteLayout({
  current: "about",
  scripts: <SiteScripts srcs={["/about.js"]} />,
});

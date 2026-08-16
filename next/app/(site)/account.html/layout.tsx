import { siteLayout } from "../../../components/page";
import { SiteScripts } from "../../../components/scripts";

export default siteLayout({
  scripts: <SiteScripts srcs={["/account-page.js"]} />,
});

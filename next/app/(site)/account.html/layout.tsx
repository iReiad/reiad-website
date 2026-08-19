import { siteLayout } from "../../../components/page";
import { SiteScripts } from "../../../components/scripts";

export default siteLayout({
  current: "account",
  scripts: <SiteScripts srcs={["/account-page.js"]} />,
});

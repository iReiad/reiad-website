import { siteLayout } from "../../../components/page";
import { SiteScripts } from "../../../components/scripts";

export default siteLayout({
  current: "contact",
  scripts: <SiteScripts srcs={["/contact-form.js"]} />,
});

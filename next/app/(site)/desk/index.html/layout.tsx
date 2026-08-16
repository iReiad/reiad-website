import { siteLayout } from "../../../../components/page";
import { SiteScripts } from "../../../../components/scripts";

export default siteLayout({
  skip: "Skip to the desk",
  skipTo: "#desk-root",
  footer: "The desk is private and excluded from search engines.",
  footerName: "Rony Reiad",
  scripts: <SiteScripts srcs={[{ src: "/desk/app.js", crossOrigin: true }]} />,
});

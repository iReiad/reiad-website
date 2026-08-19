import { siteLayout } from "../../../components/page";
import { SiteScripts } from "../../../components/scripts";

export default siteLayout({
  skip: "Skip to the Studio",
  skipTo: "#studio-root",
  footer: "Studio is a private authoring tool: it runs entirely in your browser and is excluded from search engines.",
  scripts: <SiteScripts srcs={[{ src: "/studio/app.js", crossOrigin: true }]} />,
});

import { siteLayout } from "../../../../components/page";

export default siteLayout({
  skip: "Skip to the Studio",
  skipTo: "#studio-root",
  footer: "Studio is a private authoring tool: it runs entirely in your browser and is excluded from search engines.",
  scripts: <script type="module" crossOrigin="" src="/studio/app.js" />,
});

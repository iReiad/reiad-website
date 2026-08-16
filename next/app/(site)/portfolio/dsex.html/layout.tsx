import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the analysis",
  skipTo: "#dsex",
  scripts: <script type="module" src="/portfolio/dsex.js" />,
});

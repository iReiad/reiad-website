import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the valuation",
  skipTo: "#dcf",
  scripts: <script type="module" src="/portfolio/dcf.js" />,
});

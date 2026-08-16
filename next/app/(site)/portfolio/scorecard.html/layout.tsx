import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the models",
  skipTo: "#pd",
  scripts: <script type="module" src="/portfolio/scorecard.js" />,
});

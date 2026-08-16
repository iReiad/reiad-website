import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the model",
  skipTo: "#model",
  scripts: <script type="module" src="/portfolio/three-statement.js" />,
});

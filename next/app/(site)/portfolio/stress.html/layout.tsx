import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the stress test",
  skipTo: "#stress",
  scripts: <script type="module" src="/portfolio/stress.js" />,
});

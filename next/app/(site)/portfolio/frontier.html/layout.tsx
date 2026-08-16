import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the portfolio",
  skipTo: "#fund",
  scripts: <script type="module" src="/portfolio/frontier.js" />,
});

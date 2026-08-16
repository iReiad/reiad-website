import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "portfolio",
  skip: "Skip to the research",
  skipTo: "#dissertation",
  scripts: <script type="module" src="/portfolio/dissertation.js" />,
});

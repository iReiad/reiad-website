import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "tools",
  scripts: (
    <>
      <script type="module" src="/learn/learn.js" />
      <script type="module" src="/tools/tools.js" />
    </>
  ),
});

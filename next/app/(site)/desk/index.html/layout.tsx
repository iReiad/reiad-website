import { siteLayout } from "../../../../components/page";

export default siteLayout({
  skip: "Skip to the desk",
  skipTo: "#desk-root",
  footer: "The desk is private and excluded from search engines.",
  footerName: "Rony Reiad",
  scripts: <script type="module" crossOrigin="" src="/desk/app.js" />,
});

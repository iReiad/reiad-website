import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "skills",
  lang: "bn",
  skip: "মূল লেখায় যান",
  footer: "এখানকার সব লেখা সাধারণ শিক্ষার জন্য। আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে, "
    + "কোথাও পাঠানো হয় না।",
  scripts: <script type="module" src="/skills/skills.js" />,
});

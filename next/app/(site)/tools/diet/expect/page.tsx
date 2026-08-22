import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { ExpectPanel } from "../../../../../components/diet/expect-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/expect",
  title: "What to expect · Diet · Reiad's Library",
  description: "The arc of a deficit week by week, said before the week, and what a change of protocol will really do to the scale.",
  ogTitle: "What to expect",
  ogDescription: "The arc of a deficit week by week, said before the week, and what a change of protocol will really do to the scale.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/expect"
      lede={{ en: "Almost everybody who quits does so at a point that was predictable a fortnight earlier.", bn: "যাঁরা ছেড়ে দেন তাঁদের প্রায় সবাই এমন এক জায়গায় ছাড়েন, যেটা দুই সপ্তাহ আগেই বলে দেওয়া যেত।" }}
    >
      <ExpectPanel />
    </DietPage>
  );
}

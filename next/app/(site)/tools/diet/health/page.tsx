import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { HealthPanel } from "../../../../../components/diet/health-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/health",
  title: "The clinic's numbers · Diet · Reiad's Library",
  description: "Blood pressure, HbA1c, the lipid panel and the rest, plus the "
    + "ordinary medicines that change what these charts mean.",
  ogTitle: "The clinic's numbers",
  ogDescription: "The only objective measurements in the whole tool, and the "
    + "medicines that change what a reading means.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      title={<T en="The clinic's numbers" bn="ক্লিনিকের সংখ্যা" />}
      lede={{
        en: "Blood tests are the only objective measurements here. Everything else is you, a tape and a scale.",
        bn: "রক্ত পরীক্ষাই এখানকার একমাত্র বস্তুনিষ্ঠ মাপ। বাকি সব আপনি, একটা ফিতা আর একটা দাঁড়িপাল্লা।",
      }}
    >
      <HealthPanel />
    </DietPage>
  );
}

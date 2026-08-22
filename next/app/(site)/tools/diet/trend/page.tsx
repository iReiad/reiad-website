import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { TrendPanel } from "../../../../../components/diet/trend-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/trend",
  title: "The long view · Diet · Reiad's Library",
  description: "The trend against the scale, the rate with its error bar, and what your own log says you burn.",
  ogTitle: "The long view",
  ogDescription: "The trend against the scale, the rate with its error bar, and what your own log says you burn.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      title={<T en="The long view" bn="লম্বা হিসাব" />}
      lede={{ en: "Nothing here reacts to one reading. The heavy line is the trend, the thin one behind it is what the scale said.", bn: "এখানে কিছুই একটামাত্র মাপে সাড়া দেয় না। মোটা রেখাটি ধারা, পেছনের সরু রেখাটি দাঁড়িপাল্লা যা বলেছে।" }}
    >
      <TrendPanel />
    </DietPage>
  );
}

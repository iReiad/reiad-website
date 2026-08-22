import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { FoodsPanel } from "../../../../../components/diet/foods-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/foods",
  title: "What it costs to eat · Diet · Reiad's Library",
  description: "The portion library for Bangladesh and the UK, in both "
    + "languages, and the cheapest protein per hundred grams in each.",
  ogTitle: "What it costs to eat",
  ogDescription: "Cost per gram of protein, in taka and in pounds. Reference "
    + "figures for arithmetic, naming no shop.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      title={<T en="What it costs to eat" bn="খেতে কত খরচ" />}
      lede={{
        en: "This is a personal finance site, and protein is the expensive macronutrient with a floor under it. So the obvious question gets asked.",
        bn: "এটা টাকার সাইট, আর প্রোটিনই দামি অংশ যার একটা সর্বনিম্ন আছে। তাই স্পষ্ট প্রশ্নটা করাই হয়।",
      }}
    >
      <FoodsPanel />
    </DietPage>
  );
}

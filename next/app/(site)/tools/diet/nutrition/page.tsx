import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { NutritionPanel } from "../../../../../components/diet/nutrition-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/nutrition",
  title: "Beyond calories · Diet · Reiad's Library",
  description: "Fibre, sodium, iron and the rest, each shown with how much of the day it was computed from.",
  ogTitle: "Beyond calories",
  ogDescription: "Fibre, sodium, iron and the rest, each shown with how much of the day it was computed from.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/nutrition"
      lede={{ en: "Every figure carries its coverage. A confident number missing a third of the day is more dangerous than no number.", bn: "প্রতিটি সংখ্যার সঙ্গে থাকে সেটা দিনের কতটুকু থেকে এসেছে। দিনের এক তৃতীয়াংশ বাদ দেওয়া আত্মবিশ্বাসী সংখ্যা কোনো সংখ্যা না থাকার চেয়ে বিপজ্জনক।" }}
    >
      <NutritionPanel />
    </DietPage>
  );
}

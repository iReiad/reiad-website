import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { YearPanel } from "../../../../../components/diet/year-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/year",
  title: "A year in one page · Diet · Reiad's Library",
  description: "One long trend with everything that happened to it drawn on it: the protocols you ran, the seasons you crossed, and the days you marked.",
  ogTitle: "A year in one page",
  ogDescription: "One long trend with everything that happened to it drawn on it: the protocols you ran, the seasons you crossed, and the days you marked.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/year"
      lede={{
        en: "One long trend with everything that happened to it drawn on it. The chart is a year wide whatever your log holds, so the part you have not lived yet is shaded rather than missing.",
        bn: "একটা লম্বা ধারা, আর তার উপরেই সব কিছু আঁকা। খাতায় যতটুকুই থাকুক ছকটা এক বছর চওড়া, তাই যে সময়টা এখনো আসেনি সেটা ফাঁকা নয়, ছায়া দেওয়া।",
      }}
    >
      <YearPanel />
    </DietPage>
  );
}

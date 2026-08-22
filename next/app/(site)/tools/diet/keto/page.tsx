import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { KetoPanel } from "../../../../../components/diet/keto-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/keto",
  title: "Keto · Diet · Reiad's Library",
  description: "A live clock on a keto phase: which hour you are at, what the body is doing at that hour, what the scale is doing and why, and the three salts that leave with the water.",
  ogTitle: "Keto, hour by hour",
  ogDescription: "Which hour you are at, what the body is doing at that hour, what the scale is doing and why almost none of the first week is fat.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/keto"
      lede={{
        en: "Keto's first three weeks lie to you. This is a clock on the one you are in: what is happening right now, what the scale is doing because of it, and how much of that is real.",
        bn: "কিটোর প্রথম তিন সপ্তাহ আপনাকে ভুল বোঝায়। এটা আপনি যে সপ্তাহে আছেন তার ঘড়ি: এখন কী ঘটছে, তার জন্য দাঁড়িপাল্লা কী করছে, আর তার কতটা আসল।",
      }}
    >
      <KetoPanel />
    </DietPage>
  );
}

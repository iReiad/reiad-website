import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { HabitsPanel } from "../../../../../components/diet/habits-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/habits",
  title: "What you kept up · Diet · Reiad's Library",
  description:
    "Seven daily things read off the log you already keep, each as a run of days with your best beside it, and a weight forecast built from your own steps.",
  ogTitle: "What you kept up",
  ogDescription:
    "Seven daily things read off the log you already keep, and a forecast built from your own steps rather than an activity guess.",
  card: "tools",
});

export default function Page() {
  /* `title` as well as `href`, which is what page-frame.tsx asks
     of a route the table does not list yet: the heading comes
     from `DIET_PAGES` the moment the entry lands, and until then
     this is it. */
  return (
    <DietPage
      href="/tools/diet/habits"
      lede={{
        en: "Nothing here is a new thing to do. It is the log you already keep, read back as a run of days, with a forecast built out of your own walking rather than an activity guess.",
        bn: "এখানে নতুন করে কিছু করতে হবে না। আপনি যে খাতাটা এমনিতেই রাখেন, সেটাই কয়েক দিনের ধারা হিসেবে পড়ে শোনানো, আর সঙ্গে সামনের হিসাব, যেটা আন্দাজ নয়, আপনার নিজের হাঁটা থেকে করা।",
      }}
    >
      <HabitsPanel />
    </DietPage>
  );
}

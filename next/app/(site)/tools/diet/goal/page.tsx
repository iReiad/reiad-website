import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { GoalPanel } from "../../../../../components/diet/goal-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/goal",
  title: "Your goal · Diet · Reiad's Library",
  description: "A rate as a percentage of bodyweight, the floors the tool will not cross, and how long it will take as a band rather than a date.",
  ogTitle: "Your goal",
  ogDescription: "A rate as a percentage of bodyweight, the floors the tool will not cross, and how long it will take as a band rather than a date.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/goal"
      lede={{
        en: "A rate, the floors, and an honest range for how long. Not a date: a date would be a lie with a number on it.",
        bn: "একটা হার, যে সীমাগুলো পেরোনো হবে না, আর কত দিন লাগবে তার সৎ একটা সীমা। তারিখ নয়: তারিখ মানে সংখ্যা বসানো মিথ্যে।",
      }}
    >
      <GoalPanel />
    </DietPage>
  );
}

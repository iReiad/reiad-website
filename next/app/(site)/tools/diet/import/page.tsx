import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { ImportPanel } from "../../../../../components/diet/import-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/import",
  title: "Bring your history · Diet · Reiad's Library",
  description:
    "A CSV from MyFitnessPal, Cronometer, LoseIt or a scale, with a preview of "
    + "exactly what would be written before anything is. Read in your browser, "
    + "and undone in one press.",
  ogTitle: "Bring your history",
  ogDescription:
    "An importer that guesses silently fills a year with the wrong column. This "
    + "one shows every guess, how sure it is, and every row it would drop.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/import"
      lede={{
        en: "Three years of data somewhere else is the reason people do not move, so this reads a file from almost anything and shows you what it would write before it writes it.",
        bn: "অন্য কোথাও তিন বছরের হিসাব জমে থাকাটাই মানুষের না সরার কারণ, তাই এটা প্রায় যেকোনো জায়গার ফাইল পড়ে, আর লেখার আগে দেখিয়ে দেয় কী লেখা হবে।",
      }}
    >
      <ImportPanel />
    </DietPage>
  );
}

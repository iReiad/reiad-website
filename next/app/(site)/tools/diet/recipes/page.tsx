import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { RecipePanel } from "../../../../../components/diet/recipe-panel";
import { Usuals } from "../../../../../components/diet/usuals";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/recipes",
  title: "Three taps · Diet · Reiad's Library",
  description:
    "Build a dish once, say how many it serves, and a portion is one tap for ever after. Your usuals, counted out of your own log, and yesterday again.",
  ogTitle: "Three taps, or it does not get logged",
  ogDescription:
    "Recipes, your usuals and copy yesterday. Food diaries are abandoned because of friction, not motivation.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/recipes"
      lede={{
        en: "Food diaries are abandoned because of friction, not motivation, and most people eat the same forty things. Build a dish once and a portion of it is one tap; log something three times and it offers itself.",
        bn: "খাবারের খাতা লেখা বন্ধ হয় ঝামেলার কারণে, ইচ্ছার অভাবে নয়, আর বেশিরভাগ মানুষ ঘুরেফিরে সেই চল্লিশটা জিনিসই খান। একবার একটা রান্না বানিয়ে রাখলে তার এক ভাগ এক চাপ; কিছু তিনবার লিখলে সেটা নিজেই সামনে চলে আসে।",
      }}
    >
      <Usuals />
      <RecipePanel />
    </DietPage>
  );
}

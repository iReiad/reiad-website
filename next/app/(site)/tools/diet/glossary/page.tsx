/* ============================================================
   /tools/diet/glossary

   The words, in both languages. `DIET.md` section 22.

   A page rather than a panel on the tool, so a first use of a
   term anywhere in the section can link to `#tdee` and land on
   the definition. The list itself is `components/diet/glossary`,
   so it is said once and the check can read it.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { Glossary } from "../../../../../components/diet/glossary";
import { T } from "../../../../../components/diet/lang";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/glossary",
  title: "What the words mean · Diet · Reiad's Library",
  description: "BMI, waist to height, BMR, TDEE, NEAT, glycogen, ketosis and "
    + "adaptive thermogenesis, explained plainly in Bangla and English.",
  ogTitle: "What the words mean",
  ogDescription: "A tool that uses these words without defining them is "
    + "written for people who already know.",
  card: "tools",
});

export default function DietGlossaryPage() {
  return (
    <DietPage
      title={<T en="What the words mean" bn="শব্দগুলোর মানে" />}
      lede={{
        en: "Everything this tool says about your body uses one of these. None of them is complicated once somebody writes it out.",
        bn: "আপনার শরীর নিয়ে এই যন্ত্র যা কিছু বলে, তার সবই এগুলোর কোনো একটা ব্যবহার করে। কেউ একবার লিখে দিলে কোনোটাই কঠিন নয়।",
      }}
    >
      <Glossary />
    </DietPage>
  );
}

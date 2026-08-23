import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { JournalPanel } from "../../../../../components/diet/journal-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/journal",
  title: "How it is going · Diet · Reiad's Library",
  description: "Hunger, the tags, and what people report on a deficit, described and never diagnosed.",
  ogTitle: "How it is going",
  ogDescription: "Hunger, the tags, and what people report on a deficit, described and never diagnosed.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/journal"
      lede={{ en: "Hunger is the earliest signal there is. Everything else here is a lagging measure.", bn: "ক্ষুধাই সবচেয়ে আগের ইঙ্গিত। এখানকার বাকি সব পিছিয়ে আসা মাপ।" }}
    >
      <JournalPanel />
    </DietPage>
  );
}

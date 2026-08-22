import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { DietPage } from "../../../../../components/diet/page-frame";
import { T } from "../../../../../components/diet/lang";
import { SummaryPanel } from "../../../../../components/diet/summary-panel";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/summary",
  title: "One page for a doctor · Diet · Reiad's Library",
  description: "Your weight, your measurements, what you eat and what you burn, "
    + "on one printable page with the width of every estimate beside it.",
  ogTitle: "One page for a doctor",
  ogDescription: "A ten minute appointment, and the patient arrives with a "
    + "memory. This is the same thing with dates on it.",
  card: "tools",
});

export default function Page() {
  return (
    <DietPage
      href="/tools/diet/summary"
      lede={{
        en: "A ten minute appointment, and most people arrive with a memory. This is the same thing with dates on it, and it never leaves your control: a print dialogue and a page.",
        bn: "দশ মিনিটের সাক্ষাৎ, আর বেশিরভাগ মানুষ যান শুধু স্মৃতি নিয়ে। এটা সেই একই জিনিস, তারিখসহ, আর এটা আপনার হাতছাড়া হয় না: একটা প্রিন্ট আর একটা পাতা।",
      }}
    >
      <SummaryPanel />
    </DietPage>
  );
}

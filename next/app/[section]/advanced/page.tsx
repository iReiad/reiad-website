/* ============================================================
   /deutsch/advanced: the Netzwerk neu study planner.

   For a learner on the Klett books rather than on this site's own
   German course: a 52-week or 40-week plan that recalculates from
   their start date, the chapter map with spaced reviews, a daily
   log and a weekly score. `shared/netzwerk.ts` is the book and the
   arithmetic and `components/netzwerk/` draws it.

   Everything a learner types stays in their browser under
   `netzwerk-plan`, which `aab/sync.js` carries to their account.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CHAPTERS, GRAMMAR, ROUTES_TABLE } from "@reiad/shared/netzwerk";
import { Planner } from "../../../components/netzwerk/planner";
import { Eyebrow } from "../../../components/ui/label";
import { pageMeta } from "../../../lib/pageMeta";

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  if (section !== "deutsch") return {};
  return pageMeta({
    path: "/deutsch/advanced",
    title: "Netzwerk neu study planner, A1 to B2 · German · Reiad's Library",
    description: "For learners on the Netzwerk neu and Kontext books: a week-by-week plan from "
      + "your own start date, all 48 chapters with what to skip, spaced reviews, a daily log "
      + "and a weekly score. Route A takes every chapter in 52 weeks; Route B bridges A1 and "
      + "A2 in eight and reaches B2 in 40.",
    ogTitle: "Netzwerk neu study planner",
    card: "deutsch",
  });
}

export default async function AdvancedPage({ params }: Params) {
  const { section } = await params;
  if (section !== "deutsch") notFound();
  const a = ROUTES_TABLE.find((r) => r.route === "A");
  const b = ROUTES_TABLE.find((r) => r.route === "B");

  return (
    <main id="main">
      <div className="wrap">
        <div className="hero">
          <Eyebrow>
            জার্মান · <span lang="en">Advanced learners</span>
          </Eyebrow>
          <h1 lang="en">Netzwerk neu, A1 to B2. One plan, every week written out.</h1>
          <p className="lede" lang="en">
            For the Klett books. {CHAPTERS.length} chapters, {GRAMMAR.length} grammar points ranked by
            payoff, a plan that follows your start date, a chapter tracker with reviews at two, seven
            and thirty days, and a log that scores your week.
            Route A takes every chapter in {a?.weeks} weeks. Route B bridges A1 and A2 in eight weeks
            and reaches B2 in {b?.weeks}.
          </p>
          <p className="text-t4 text-ink-soft" lang="bn">
            Netzwerk neu বই ধরে যারা পড়ছেন, তাদের জন্য: নিজের শুরুর তারিখ দিন, পুরো পরিকল্পনা সপ্তাহ ধরে
            ধরে তৈরি হয়ে যাবে। যা টিক দেবেন সেটা এই ব্রাউজারে থাকে, আর সাইন ইন করা থাকলে অ্যাকাউন্টে।
          </p>
        </div>
        <Planner />
      </div>
    </main>
  );
}

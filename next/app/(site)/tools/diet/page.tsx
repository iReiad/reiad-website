/* ============================================================
   /tools/diet

   The diet tool's front door. `DIET.md` is the plan and the
   reasoning. The board is what a signed-in reader came to do;
   the deck under it is every other page of the tool, built from
   `lib/diet-pages.ts` rather than written out, so the strip at
   the top and the cards below it cannot come to name different
   sets of pages.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { GoCard, InfoCard } from "../../../../components/deck";
import { LangSwitch, T, TBlock } from "../../../../components/diet/lang";
import { DietBoard } from "../../../../components/diet/board";
import { DietStrip } from "../../../../components/diet/strip";
import { DIET_PAGES } from "../../../../lib/diet-pages";
import { dietIcon } from "../../../../components/diet/icons";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet",
  title: "Diet · what your body is, and what it costs · Reiad's Library",
  description: "A calculator and a log for eating in Bangladesh or the UK: "
    + "waist to height, BMI on the cut-offs that apply to you, body fat with "
    + "its error bars, and what your body actually costs to run.",
  ogTitle: "Diet · what your body is, and what it costs",
  ogDescription: "Waist to height first, BMI beside it, and every estimate "
    + "shown with the width of its own error.",
  card: "tools",
});

export default function DietPage() {
  return (
    <main id="main" className="wrap dt-page">
      <header className="dt-head">
        <div className="dt-head-row">
          <h1 lang="bn">খাদ্য ও ওজন</h1>
          <LangSwitch />
        </div>
        <TBlock
          en={(
            <p className="dt-lede">
              A calculator and a log, for one person eating in Bangladesh or in
              the UK. What your body probably is, what it probably costs to run,
              and whether the last three weeks meant anything.
            </p>
          )}
          bn={(
            <p className="dt-lede">
              একজন মানুষের জন্য একটা হিসাব আর একটা খাতা, বাংলাদেশ বা যুক্তরাজ্যে
              যিনি খান তাঁর জন্য। আপনার শরীর সম্ভবত কী দিয়ে গড়া, চালাতে কত খরচ,
              আর গত তিন সপ্তাহে আদৌ কিছু হয়েছে কি না।
            </p>
          )}
        />
      </header>

      <DietStrip />

      <DietBoard />

      {/* THE DECK IS THE TABLE. Ten cards were written out here
          by hand while the strip across every page said none of
          them, which is two lists of the same ten things. This
          site's rule for that is at the top of `CLAUDE.md`: a
          list of things that exist elsewhere is built from the
          data, and the markup is not the source. */}
      {/* A HEADING RATHER THAN AN `aria-label`. The label was
          English, on a page whose whole point is a switch that
          changes everything, and this page is rendered on the
          server so it cannot read the reader's choice. A
          bilingual heading renders both halves and the
          stylesheet chooses, which is the pattern the rest of
          this tool already uses, and
          it gives the ten cards the `h2` they were hanging
          under with nothing above them. */}
      <section className="dt-deck-wrap" aria-labelledby="dt-deck-h">
        <h2 className="dt-deck-h" id="dt-deck-h">
          <T en="What is here" bn="এখানে কী আছে" />
        </h2>
        <div className="dt-deck">
        {DIET_PAGES.map((p) => (
          <GoCard
            key={p.href}
            href={p.href}
            art={p.art}
            accent={p.tone}
            icon={dietIcon(p.href)}
            title={<T en={p.title.en} bn={p.title.bn} />}
            go={<T en={p.go.en} bn={p.go.bn} />}
            dek={<T en={p.dek.en} bn={p.dek.bn} />}
          />
        ))}
        </div>
      </section>

      <InfoCard title={<T en="What it refuses to do" bn="যা এটি করবে না" />}>
        <TBlock
          en={(
            <ul>
              <li>The streak counts days LOGGED, never days on target, and your
                best sits beside it. A number that can only fall is a number
                people stop looking at.</li>
              <li>Nothing counts down and nothing turns red. Over target is
                drawn in the same weight as under it.</li>
              <li>No target below your resting burn, and never below 1200 for
                women or 1500 for men. Not behind a warning: the number does not
                get calculated.</li>
              <li>No number it cannot know. Every estimate carries the width of
                its own error, and anything needing a scanner is simply absent.</li>
            </ul>
          )}
          bn={(
            <ul>
              <li>ধারাবাহিকতা গোনা হয় কত দিন লিখেছেন তা দিয়ে, লক্ষ্য পূরণ করেছেন
                কি না তা দিয়ে নয়, আর পাশেই থাকে আপনার সেরা রেকর্ড। যে সংখ্যা কেবল
                কমতে পারে, মানুষ সেটা দেখা ছেড়ে দেয়।</li>
              <li>উল্টো গোনা নেই, লাল হয়ে যাওয়াও নেই। লক্ষ্যের বেশি আর কম, দুটোই
                একই রকম করে দেখানো হয়।</li>
              <li>বিশ্রামের খরচের নিচে কোনো লক্ষ্য নয়, আর নারীদের ১২০০ বা পুরুষদের
                ১৫০০ এর নিচে কখনোই নয়। সতর্কবাণী দিয়ে নয়: সংখ্যাটা হিসাবই করা হয় না।</li>
              <li>যা জানা সম্ভব নয় তা বলা হয় না। প্রতিটি আন্দাজের সঙ্গে তার ভুলের
                সীমাও থাকে, আর যন্ত্র ছাড়া যা মাপা যায় না তা একেবারেই নেই।</li>
            </ul>
          )}
        />
      </InfoCard>
    </main>
  );
}

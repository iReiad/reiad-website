/* ============================================================
   /tools/diet

   The diet tool's front door. `DIET.md` is the plan and the
   reasoning, and this page is deliberately honest about which of
   it exists: the body page works completely and needs no
   account, and everything else is named as coming rather than
   drawn as an empty panel. A panel that will one day hold
   something reads exactly like a broken one.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { GoCard, InfoCard } from "../../../../components/deck";
import { LangSwitch, T, TBlock } from "../../../../components/diet/lang";
import { DietBoard } from "../../../../components/diet/board";

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

      <DietBoard />

      <section className="dt-deck" aria-label="What is here">
        <GoCard
          href="/tools/diet/you"
          title={<T en="Your body" bn="আপনার শরীর" />}
          go={<T en="Work it out" bn="হিসাব করুন" />}
          dek={(
            <T
              en="Waist to height first, BMI on the cut-offs that apply to you, body fat as a range, and what you burn at rest. Nothing is stored and no account is needed."
              bn="প্রথমে কোমর ও উচ্চতার অনুপাত, তারপর আপনার জন্য প্রযোজ্য সীমায় বিএমআই, একটা সীমার মধ্যে চর্বি, আর বিশ্রামে কত খরচ। কিছুই জমা থাকে না, অ্যাকাউন্টও লাগে না।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/goal"
          title={<T en="Your goal" bn="আপনার লক্ষ্য" />}
          go={<T en="Set it" bn="ঠিক করুন" />}
          dek={(
            <T
              en="A rate as a percentage of bodyweight, the floors the tool will not cross, and how long it will take as a band rather than a date."
              bn="শরীরের ওজনের শতাংশে একটা হার, যে সীমাগুলো পেরোনো হবে না, আর কত দিন লাগবে তা তারিখ নয়, একটা সীমা হিসেবে।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/trend"
          title={<T en="The long view" bn="লম্বা হিসাব" />}
          go={<T en="See it" bn="দেখুন" />}
          dek={(
            <T
              en="The trend against the scale, the rate with its error bar, and what your own log says you burn rather than what an equation guesses."
              bn="দাঁড়িপাল্লার বিপরীতে ধারা, ভুলের সীমাসহ হার, আর সূত্রের আন্দাজ নয়, আপনার নিজের খাতা যা বলে সেই খরচ।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/expect"
          title={<T en="What to expect, and when" bn="কখন কী হবে" />}
          go={<T en="Read it" bn="পড়ুন" />}
          dek={(
            <T
              en="The arc of a deficit week by week, said before the week. Almost everybody who quits does so at a point that was predictable a fortnight earlier."
              bn="ঘাটতির ধাপ সপ্তাহে সপ্তাহে, আগেই বলা। যাঁরা ছেড়ে দেন তাঁদের প্রায় সবাই এমন জায়গায় ছাড়েন যেটা দুই সপ্তাহ আগেই বলা যেত।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/nutrition"
          title={<T en="Beyond calories" bn="ক্যালোরির বাইরে" />}
          go={<T en="Look" bn="দেখুন" />}
          dek={(
            <T
              en="Fibre, sodium, iron and the rest, each shown with how much of the day it was computed from. Under half and nothing is drawn at all."
              bn="আঁশ, সোডিয়াম, আয়রন আর বাকিগুলো, প্রতিটির সঙ্গে সেটা দিনের কতটুকু থেকে এসেছে। অর্ধেকের কম হলে কিছুই আঁকা হয় না।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/journal"
          title={<T en="How it is going" bn="কেমন যাচ্ছে" />}
          go={<T en="Open it" bn="খুলুন" />}
          dek={(
            <T
              en="Hunger, which climbs before the trend moves and before adherence breaks, and what people report on a deficit, described and never diagnosed."
              bn="ক্ষুধা, যেটা ধারা নড়ার আগেই আর নিয়ম ভাঙার আগেই বাড়ে, আর ঘাটতিতে মানুষ যা বলে, বর্ণনা করা, রোগ নির্ণয় নয়।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/glossary"
          title={<T en="What the words mean" bn="শব্দগুলোর মানে" />}
          go={<T en="Read it" bn="পড়ুন" />}
          dek={(
            <T
              en="BMR, TDEE, glycogen, adaptive thermogenesis. A tool that uses these words without defining them is written for people who already know."
              bn="বিএমআর, মোট খরচ, গ্লাইকোজেন, খাপ খাওয়ানো বিপাক। যে যন্ত্র এই শব্দগুলো ব্যবহার করে অথচ মানে বলে না, সেটা যাঁরা আগে থেকেই জানেন তাঁদের জন্য লেখা।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/foods"
          title={<T en="What it costs to eat" bn="খেতে কত খরচ" />}
          go={<T en="Compare" bn="তুলনা করুন" />}
          dek={(
            <T
              en="Cost per gram of protein, in taka and in pounds. This is a personal finance site, and a diet tool here that never priced a meal would be the one place the obvious question goes unasked."
              bn="প্রতি গ্রাম প্রোটিনের দাম, টাকায় আর পাউন্ডে। এটা টাকার সাইট, আর এখানকার খাদ্য যন্ত্র যদি কখনো দামের কথা না বলে, তবে এটাই একমাত্র জায়গা যেখানে সবচেয়ে স্পষ্ট প্রশ্নটা করা হয় না।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/health"
          title={<T en="The clinic's numbers" bn="ক্লিনিকের সংখ্যা" />}
          go={<T en="Read it" bn="পড়ুন" />}
          dek={(
            <T
              en="Blood pressure, HbA1c, the lipid panel, and the ordinary medicines that change what these charts mean. The only objective measurements in the whole tool."
              bn="রক্তচাপ, এইচবিএ১সি, চর্বির পরীক্ষা, আর যে সাধারণ ওষুধগুলো এই চার্টের মানে বদলে দেয়। পুরো যন্ত্রের একমাত্র বস্তুনিষ্ঠ মাপ এগুলোই।"
            />
          )}
        />
        <GoCard
          href="/tools/diet/summary"
          title={<T en="One page for a doctor" bn="ডাক্তারের জন্য এক পাতা" />}
          go={<T en="Print it" bn="প্রিন্ট করুন" />}
          dek={(
            <T
              en="A ten minute appointment, and most people arrive with a memory. This is the same thing with dates on it, and the width of every estimate beside it."
              bn="দশ মিনিটের সাক্ষাৎ, আর বেশিরভাগ মানুষ যান শুধু স্মৃতি নিয়ে। এটা সেই একই জিনিস, তারিখসহ, আর প্রতিটি আন্দাজের পাশে তার সীমা।"
            />
          )}
        />
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

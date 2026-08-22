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
import { GoCard, InfoCard, SoonCard } from "../../../../components/deck";
import { LangSwitch, T, TBlock } from "../../../../components/diet/lang";

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

      <section className="dt-deck" aria-label="What is here">
        <GoCard
          href="/tools/diet/you"
          chip={<T en="Ready" bn="তৈরি" />}
          title={<T en="Your body" bn="আপনার শরীর" />}
          go={<T en="Work it out" bn="হিসাব করুন" />}
          dek={(
            <T
              en="Measurements in, composition out: waist to height first, BMI on the cut-offs that apply to you, body fat as a range, and what you burn at rest. Nothing is stored and no account is needed."
              bn="মাপ দিন, গঠন পান: প্রথমে কোমর ও উচ্চতার অনুপাত, তারপর আপনার জন্য প্রযোজ্য সীমায় বিএমআই, একটা সীমার মধ্যে চর্বি, আর বিশ্রামে কত খরচ। কিছুই জমা থাকে না, অ্যাকাউন্টও লাগে না।"
            />
          )}
        />

        <GoCard
          href="/tools/diet/glossary"
          chip={<T en="Ready" bn="তৈরি" />}
          title={<T en="What the words mean" bn="শব্দগুলোর মানে" />}
          go={<T en="Read it" bn="পড়ুন" />}
          dek={(
            <T
              en="BMR, TDEE, glycogen, adaptive thermogenesis. A tool that uses these words without defining them is written for people who already know."
              bn="বিএমআর, মোট খরচ, গ্লাইকোজেন, খাপ খাওয়ানো বিপাক। যে যন্ত্র এই শব্দগুলো ব্যবহার করে অথচ মানে বলে না, সেটা যাঁরা আগে থেকেই জানেন তাঁদের জন্য লেখা।"
            />
          )}
        />

        <SoonCard
          title={<T en="Today" bn="আজ" />}
          soon={<T en="Coming" bn="আসছে" />}
          dek={(
            <T
              en="Log a weight and what you ate, and watch the trend rather than the scale. A single reading is real weight plus one to two kilos of water, so nothing here will ever react to one."
              bn="ওজন আর যা খেয়েছেন লিখুন, আর দাঁড়িপাল্লার বদলে ধারা দেখুন। একদিনের মাপ মানে আসল ওজনের সঙ্গে এক থেকে দুই কেজি পানি, তাই এখানে কিছুই একটামাত্র মাপে সাড়া দেবে না।"
            />
          )}
        />

        <SoonCard
          title={<T en="What to expect, and when" bn="কখন কী হবে" />}
          soon={<T en="Coming" bn="আসছে" />}
          dek={(
            <T
              en="The arc of a deficit, week by week, said before the week rather than explained after it. Almost everybody who quits does so at a point that was predictable a fortnight earlier."
              bn="ঘাটতির পুরো ধাপ, সপ্তাহে সপ্তাহে, ঘটার পরে ব্যাখ্যা নয়, আগেই বলা। যাঁরা ছেড়ে দেন তাঁদের প্রায় সবাই এমন এক জায়গায় ছাড়েন যেটা দুই সপ্তাহ আগেই বলে দেওয়া যেত।"
            />
          )}
        />
      </section>

      <InfoCard title={<T en="What it refuses to do" bn="যা এটি করবে না" />}>
        <TBlock
          en={(
            <ul>
              <li>No streak, no flame, nothing counting down. A tracker that
                shames you is one you delete on the day you most need it.</li>
              <li>No target below your resting burn, and never below 1200 for
                women or 1500 for men. Not behind a warning: the number does not
                get calculated.</li>
              <li>No number it cannot know. Every estimate carries the width of
                its own error, and anything needing a scanner is simply absent.</li>
            </ul>
          )}
          bn={(
            <ul>
              <li>কোনো ধারাবাহিকতার হিসাব নেই, আগুনের চিহ্ন নেই, উল্টো গোনা নেই।
                যে খাতা আপনাকে লজ্জা দেয়, সেটা যেদিন সবচেয়ে বেশি দরকার সেদিনই মুছে
                ফেলা হয়।</li>
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

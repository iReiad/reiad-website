/* ============================================================
   /skills/index.html, the list of everything this site teaches.

   ---- what changed, and why it is the whole point of the page ----

   This page used to be "everything except money". Money had its
   own top-level link, its own front page and its own half of the
   home page's doorway, and the six other subjects were listed
   here under a heading that said, in as many words, "টাকা ছাড়া
   বাকি যা কিছু". That was true when there was one school and it
   was about money; it stopped being true somewhere around the
   fourth one, and what it produced was a reader who had found the
   German course with no reason to think a money course existed,
   and a reader who had found the money course being told the
   other five were the leftovers.

   So there is one list, and money is on it: টাকা ও শেয়ার, the
   largest entry, first. The rail on the left lists the same
   seven, out of the same table, and so does the footer.

   ---- and it is rendered from the table, not typed ----

   `lib/nav.ts` holds the seven. This page draws a card per entry
   and counts them; the sentence above the list says how many
   there are by counting the cards it is about to draw, which is
   the rule at the top of `CLAUDE.md`. The old page had a
   hand-written `<ul>` as a no-JavaScript fallback and a
   `data-count` slot that `app.js` filled, which is two lists and
   a number, all three maintained by memory.
   ============================================================ */

import type { Metadata } from "next";
import { GoCard, InfoCard, SoonCard } from "../../../../components/deck";
import { NAV } from "../../../../lib/nav";
import { pageMeta } from "../../../../lib/pageMeta";

export const metadata: Metadata = pageMeta({
  path: "/skills/index.html",
  title: "দক্ষতা · Skills · Reiad's Library",
  description: "এই সাইটে যা যা শেখানো হয়, এক পাতায়: টাকা ও শেয়ার, জার্মান, কুরআনের আরবি, "
    + "ইংরেজি, রান্না আর ভ্রমণ, সবটাই বাংলায় আর সবটাই ফ্রি।",
  ogTitle: "দক্ষতা · Skills",
  ogDescription: "টাকা ও শেয়ার, জার্মান, কুরআনের আরবি, ইংরেজি, রান্না আর ভ্রমণ, সবটাই বাংলায়।",
  card: "skills",
  locale: "bn_BD",
});

const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export default function SkillsPage() {
  /* Everything in the learning group except the link back to this
     page, which is where the reader already is. */
  const learn = (NAV.find((g) => g.id === "learn")?.items ?? [])
    .filter((item) => item.key !== "skills");

  /* The unlisted ones are not skills this site teaches, so they
     are out of the list AND out of the number above it. They get
     their own band at the foot, which is the whole reason the
     flag exists: see `lib/nav.ts`. */
  const skills = learn.filter((item) => !item.unlisted);
  const mine = learn.filter((item) => item.unlisted);

  const live = skills.filter((s) => !s.soon);

  return (
    <main id="main" className="hub">
      <div className="hub-wrap">

        <header className="hub-hero">
          <span className="hub-eyebrow mono">
            দক্ষতা · <span lang="en">Skills</span>
          </span>
          <h1 className="bn-h">এই সাইটে যা যা শেখানো হয়।</h1>
          <p className="hub-lede" lang="bn">
            {bn(live.length)}টা খোলা আছে, বাকিটা হচ্ছে। প্রতিটার নিয়ম একই: ব্যাখ্যা বাংলায়,
            কোনো লগইন নেই, কোনো দাম নেই, আর আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।
            যেটা এখনো আসেনি সেটাও নিচে আছে, কারণ কী আসছে জানা থাকলে অপেক্ষা করা যায়।
          </p>
        </header>

        <section className="hub-section" id="all">
          <div className="hub-section-head">
            <span className="section-label mono">
              যা যা আছে · <span lang="en">Everything here</span>
            </span>
          </div>

          <div className="deck deck-2">
            {skills.map((skill) => (
              skill.soon ? (
                <SoonCard
                  key={skill.href} accent="var(--ink-soft)" icon={skill.icon}
                  lang="bn" title={skill.sub ?? skill.label} dek={skill.blurb}
                >
                  <span className="card-meta">
                    <span lang="en">{skill.label}</span>
                  </span>
                </SoonCard>
              ) : (
                <GoCard
                  key={skill.href} href={skill.href}
                  accent={skill.key === "money" ? "var(--gold)" : "var(--green)"}
                  icon={skill.icon} chip={skill.kind} lang="bn"
                  title={skill.sub ?? skill.label} dek={skill.blurb}
                  go={skill.kind === "কোর্স" ? "কোর্সটা খুলুন" : "লেখাগুলো দেখুন"}
                >
                  <span className="card-meta">
                    <span lang="en">{skill.label}</span>
                  </span>
                </GoCard>
              )
            ))}
          </div>
        </section>

        <section className="hub-section" id="kilo">
          <div className="hub-section-head">
            <span className="section-label mono">
              কেন এভাবে · <span lang="en">How they are written</span>
            </span>
          </div>

          <div className="deck">
            <InfoCard
              icon="signpost" lang="bn"
              title="ব্যাখ্যা বাংলায়, অনুশীলন আসল জিনিসে"
              dek="বোঝার সময় শক্তি খরচ হওয়া উচিত বিষয়টা বুঝতে, ভাষা বুঝতে নয়। তাই ব্যাখ্যাটা
                   বাংলায়। কিন্তু যা মুখে তুলবেন বা হাতে করবেন, সেটা আসল জিনিসেই: জার্মান
                   বাক্য জার্মানে, রান্নার মাপ চামচে।"
            />
            <InfoCard
              icon="book" lang="bn"
              title="ছাঁচ, তালিকা নয়"
              dek="একশোটা শব্দ মুখস্থ করলে একশোটা শব্দই থাকে। একটা কাঠামো শিখলে তাতে নিজের
                   হাজারটা বাক্য ঢালা যায়। প্রতিটা অংশ সেভাবেই সাজানো: মুখস্থ করার মতো কম,
                   বানানোর মতো বেশি।"
            />
            <InfoCard
              icon="warning" accent="var(--gold)" lang="bn"
              title="যা লেখা হয়নি, সেটা বলা আছে"
              dek="উপরের তালিকায় যেগুলোতে আসছে লেখা, সেগুলো এখনো লেখা হয়নি, এবং সেটা লুকানো
                   হয়নি। খালি পাতায় ঢুকে সময় নষ্ট করার চেয়ে আগে থেকে জানা ভালো।"
            />
          </div>
        </section>

        {mine.length ? (
          <section className="hub-section" id="mine">
            <div className="hub-section-head">
              <span className="section-label mono">
                আমার নিজের · <span lang="en">Mine, and not published</span>
              </span>
            </div>

            <div className="deck deck-2">
              {mine.map((item) => (
                <GoCard
                  key={item.href} href={item.href} accent={item.accent ?? "var(--gold)"}
                  icon={item.icon} chip={item.kind} lang="bn"
                  title={item.sub ?? item.label} dek={item.blurb}
                  go="খুলুন"
                >
                  <span className="card-meta">
                    <span lang="en">{item.label} · admin only</span>
                  </span>
                </GoCard>
              ))}
            </div>
          </section>
        ) : null}

        <div className="hub-pledge" lang="bn">
          <b className="bn-h">শিক্ষা বিনামূল্যে হওয়া উচিত।</b>
          <span>
            এখানকার প্রতিটা স্কুল ফ্রি থাকবে, চিরকাল। যেগুলো এখনো লেখা হয়নি, সেগুলোও ফ্রিই আসবে।
          </span>
          <span className="pledge-en" lang="en">Education should be free</span>
        </div>

      </div>
    </main>
  );
}

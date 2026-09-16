/* ============================================================
   /skills, the list of everything this site teaches.

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

   `shared/nav.ts` holds the seven. This page draws a card per entry
   and counts them; the sentence above the list says how many
   there are by counting the cards it is about to draw, which is
   the rule at the top of `CLAUDE.md`. The old page had a
   hand-written `<ul>` as a no-JavaScript fallback and a
   `data-count` slot that `app.js` filled, which is two lists and
   a number, all three maintained by memory.
   ============================================================ */

import type { Metadata } from "next";
import { GoCard, SoonCard } from "../../../../components/deck";
import { NAV } from "@reiad/shared/nav";
import { pageMeta } from "../../../../lib/pageMeta";
import { SectionLabel } from "../../../../components/ui/label";
import { COUNTS } from "@reiad/shared/content";
import { HEADS } from "@reiad/shared/heads";

export const metadata: Metadata = pageMeta({
  path: "/skills",
  title: "দক্ষতা · Skills · Reiad's Library",
  description: "এই সাইটে যা যা শেখানো হয়, এক পাতায়: টাকা ও শেয়ার, জার্মান, কুরআনের আরবি, "
    + "ইংরেজি, রান্না আর ভ্রমণ, সবটাই বাংলায়, আর শেখার সবকিছু ফ্রি।",
  ogTitle: "দক্ষতা · Skills",
  ogDescription: "টাকা ও শেয়ার, জার্মান, কুরআনের আরবি, ইংরেজি, রান্না আর ভ্রমণ, সবটাই বাংলায়।",
  card: "skills",
  locale: "bn_BD",
});

const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export default function SkillsPage() {
  /* Everything in the learning group except the link back to this
     page, which is where the reader already is.

     Read off `hub` rather than off this page's own key, because
     the same sentence has to be true for a second reader of the
     same table: the Android app's Learning tab drew that card
     and it took you to a copy of the list you were looking at. */
  const learn = (NAV.find((g) => g.id === "learn")?.items ?? [])
    .filter((item) => !item.hub);

  /* The unlisted ones are not skills this site teaches, so they
     are out of the list AND out of the number above it. They get
     their own band at the foot, which is the whole reason the
     flag exists: see `shared/nav.ts`. */
  const skills = learn.filter((item) => !item.unlisted);
  const mine = learn.filter((item) => item.unlisted);

  const live = skills.filter((s) => !s.soon);

  return (
    <main id="main" className="hub">
      <div className="hub-wrap">

        <header className="hub-hero">
          {/* Out of `shared/heads.ts`, which is what the
              Android app draws this hub from too. The `{n}` is
              filled from `COUNTS` rather than from `live.length`
              for the reason the top of CLAUDE.md gives: a number
              on a page counts the data, and two places counting
              it is two chances to disagree. */}
          <span className="hub-eyebrow mono">{HEADS.skills.eyebrow}</span>
          <h1 className="bn-h">{HEADS.skills.title}</h1>
          <p className="hub-lede" lang="bn">
            {HEADS.skills.lede.replace("{n}", bn(COUNTS.courses))}
          </p>
        </header>

        <section className="hub-section" id="all">
          <div className="hub-section-head">
            <SectionLabel>
              যা যা আছে · <span lang="en">Everything here</span>
            </SectionLabel>
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
                  /* The school's own colour, out of `shared/nav.ts`,
                     which is where every other place on this site
                     reads it: the rail, the footer and the page a
                     card takes you to. This said gold for money and
                     green for everything else, so German, Qur'anic
                     Arabic, English, Cooking and Travel all lost
                     the blue, teal, violet, rose and plum the one
                     table gives them, on the page whose whole job
                     is to show the six side by side. */
                  accent={skill.accent}
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

        {mine.length ? (
          <section className="hub-section" id="mine">
            <div className="hub-section-head">
              <SectionLabel>
                আমার নিজের · <span lang="en">Mine, and not published</span>
              </SectionLabel>
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
            এখানকার স্কুলগুলোর পাঠ পড়তে কোনো টাকা লাগে না।
          </span>
          <span className="pledge-en" lang="en">Education should be free</span>
        </div>

      </div>
    </main>
  );
}

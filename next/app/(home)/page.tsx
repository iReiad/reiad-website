/* The learner entrance: discover a subject, follow a course, and return to progress.
   Keep this page prerendered: the browser tests read its generated HTML.
   Public subjects and lesson totals come from shared data; private courses stay gated. */

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CourseDiscovery } from "../../components/course-discovery";
import { Board } from "../../components/home/board";
import { LatestWriting } from "../../components/home/writing";
import { Reckoner } from "../../components/home/reckoner";
import { GoCard } from "../../components/deck";
import { WorkCard } from "../../components/work-card";
import { ButtonLink } from "../../components/ui/button";
import { SectionLabel } from "../../components/ui/label";
import { pageMeta } from "../../lib/pageMeta";
import { STUDIES } from "../../lib/work";
import {
  COUNTS, allDars, allLessons, allParts, allTeile,
} from "@reiad/shared/content";
import { NAV, accentFor } from "@reiad/shared/nav";

export const metadata: Metadata = pageMeta({
  path: "/",
  title: "Reiad's Library · বাংলায় টাকা, দক্ষতা আর কাজ",
      /* No counts in the description: number WORDS fill no slot and no
         check can see them, on the one sentence quoted into search
         results and into every pasted link. */
  description: "বাংলাদেশের বাজার আর টাকার কথা সহজ বাংলায়: ফ্রি কোর্স, "
    + "ক্যালকুলেটর, আর খুলে চালিয়ে দেখার মতো আর্থিক মডেল।",
  ogTitle: "Reiad's Library",
  ogDescription: "বাংলায় শেখা, আর যে কাজগুলো খুলে দেখা যায়।",
  card: "home",
  locale: "bn_BD",
});

    /** The learning group, minus the hub itself and minus anything not
        written yet or not published. Out of `shared/nav.ts`, so a school
        added there appears in the rail, the footer, `/skills` and here at
        once. `soon` and `unlisted` are skipped because a card to a page
        that answers 403 is a promise the site cannot keep. */
const SCHOOLS = NAV.find((g) => g.id === "learn")?.items
  .filter((i) => !i.hub && !i.unlisted && !i.soon) ?? [];

    /** The first lesson of the money ladder, for the invitation the board
        draws when a reader has no board yet. Computed here rather than in
        the board, which is a client component: `allLessons()` is the whole
        curriculum, and shipping it to read one URL would put a hundred
        kilobytes on the front page for a link. */
const FIRST_LESSON = allLessons().find((l) => l.status === "live")?.url;

    /** How many lessons each ladder has, so the board's meters can say
        "২০ / ৮১" rather than "২০". Counted from the four curricula at
        build time and handed down: the meters read no ladder in the
        browser and must not, on the one page whose job is to be instant.
        The money school's is `COUNTS.lessons` rather than a second filter
        over the same rows. */
const LADDER_TOTALS: Record<string, number> = {
  money: COUNTS.lessons,
  deutsch: allTeile().length,
  quran: allDars().length,
  english: allParts().length,
};

    /* The tools, and the calculators hub is one of them here. It carries
       `hub: true`, the flag the rail uses to draw the group's own head,
       and filtering on it took `/tools` off this band: five cards is two
       holes in a three column grid, six is two clean rows. */
const TOOLBOX = NAV.find((g) => g.id === "make")?.items
  .filter((i) => !i.unlisted && !i.soon) ?? [];

    /** A band wears its own section's colour, out of the one table that
        decides what colour anything is. Without this the page inherits
        `:root`'s green and a case study is green here and plum on
        `/portfolio`. `accentFor` answers null for a key the table does not
        hold, and an undefined style is the page's own accent. */
function bandAccent(key: string): CSSProperties | undefined {
  const accent = accentFor(key);
  return accent ? { "--accent": accent } as CSSProperties : undefined;
}

export default function HomePage() {
  return (
    <main id="main" className="learning-home">
      <div className="home-wrap mx-auto w-full max-w-[1240px]
        px-[clamp(16px,3vw,44px)] pt-[clamp(18px,3.4vw,44px)] pb-[clamp(28px,4vw,56px)]
        grid gap-[clamp(34px,4.4vw,64px)]">
        <header className="learner-hero">
          <div className="learner-intro">
            <span className="learner-kicker" lang="en">YOUR NEXT CHAPTER STARTS HERE</span>
            <h1 lang="bn">ছোট্ট শুরু।<br /><em>অনেক দূর।</em></h1>
            <p lang="bn">টাকা বুঝতে চান, নতুন ভাষা শিখতে চান, নাকি নিজের জন্য কিছু করতে চান? আপনার শুরুটা হোক এখানেই। সহজ বাংলায়, নিজের গতিতে।</p>
            <nav className="hero-actions" aria-label="শেখা শুরু করুন">
              <ButtonLink kind="solid" href="#learn-h" lang="bn">আমার কোর্স খুঁজি</ButtonLink>
              <ButtonLink kind="ghost" href="/account" lang="bn">আমার অগ্রগতি</ButtonLink>
            </nav>
            <div className="learner-promises" lang="bn"><span>পড়তে কোনো খরচ নেই</span><span>একদম শুরু থেকে</span><span>নিজের সময়ে</span></div>
          </div>
          <aside className="learner-start" aria-labelledby="start-heading">
            <span className="learner-kicker" lang="en">A LITTLE DIRECTION</span>
            <h2 id="start-heading" lang="bn">কোথা থেকে শুরু করব?</h2>
            <ol className="learner-steps" lang="bn">
              <li><b>আপনার বিষয় বেছে নিন</b><span>নিচে কোর্সগুলো দেখে যেটা ভালো লাগে, সেটাই খুলুন।</span></li>
              <li><b>প্রথম পাঠ দিয়ে শুরু করুন</b><span>আগে থেকে কিছু জানা লাগবে না। ধাপে ধাপে এগোন।</span></li>
              <li><b>পড়ুন, অনুশীলন করুন, ফিরে আসুন</b><span>পাঠ শেষে টিক দিন। পরের বার সেখান থেকেই এগোবেন।</span></li>
            </ol>
            <a href="/skills" className="learner-start-link" lang="bn">সব শেখার পথ দেখুন <span aria-hidden="true">↗</span></a>
          </aside>
        </header>

        <section aria-labelledby="learn-h">
          <div className="hub-section-head">
            <SectionLabel>
              শেখা · <span lang="en">The library</span>
            </SectionLabel>
            <h2 className="band-h" id="learn-h" lang="bn">আজ কী শিখতে চান?</h2>
            <p className="hub-section-note" lang="bn">
              বিষয় খুঁজুন, নিজের লক্ষ্য বেছে নিন, আর প্রথম পাঠে চলে যান।
            </p>
          </div>
          <CourseDiscovery items={SCHOOLS} totals={LADDER_TOTALS} />
        </section>
        <Board start={FIRST_LESSON} totals={LADDER_TOTALS} />
        <Reckoner />
        <section aria-labelledby="work-h" style={bandAccent("portfolio")}>
          <div className="hub-section-head">
            <SectionLabel>
              কাজ · <span lang="en">Selected work</span>
            </SectionLabel>
            <h2 className="band-h" id="work-h" lang="en">Models you can open and drive</h2>
            <p className="hub-section-note" lang="en">
              The arithmetic runs in your browser: nothing here is a picture
              of a spreadsheet.
            </p>
            <p className="hub-section-note" lang="bn">
              এই অংশটা ইংরেজিতে, কারণ কাজগুলো ইংরেজিতেই করা।
            </p>
          </div>
          <WorkCard study={STUDIES[0]} lead compact />
          <div className="deck work-deck">
            {STUDIES.slice(1).map((study) => (
              <WorkCard key={study.url} study={study} compact />
            ))}
          </div>
        </section>
        <section aria-labelledby="read-h">
          <div className="hub-section-head">
            <SectionLabel>
              নতুন লেখা · <span lang="en">Latest writing</span>
            </SectionLabel>
            <h2 className="band-h" id="read-h" lang="bn">সবচেয়ে নতুন যা লেখা হয়েছে</h2>
          </div>
          <LatestWriting limit={3} />
        </section>
        <section aria-labelledby="make-h" style={bandAccent("tools")}>
          <div className="hub-section-head">
            <SectionLabel>
              যন্ত্রপাতি · <span lang="en">The tools</span>
            </SectionLabel>
            <h2 className="band-h" id="make-h" lang="bn">যেগুলো দিয়ে হিসাবটা করা যায়</h2>
            <p className="hub-section-note" lang="bn">
              হিসাবটা আপনার ব্রাউজারেই চলে, আর বেশিরভাগই অ্যাকাউন্ট ছাড়াই খোলা যায়।
            </p>
          </div>
          <div className="deck make-deck">
            {TOOLBOX.map((item) => (
              <GoCard
                key={item.href}
                href={item.href}
                icon={item.icon}
                accent={item.accent ?? "var(--gold)"}
                chip={<span lang="bn">যন্ত্র</span>}
                title={item.sub ?? item.label}
                lang={item.sub ? "bn" : undefined}
                dek={item.blurb}
                go="খুলুন"
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

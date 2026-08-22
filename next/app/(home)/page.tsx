/* ============================================================
   The front door, and now also the hallway.

   ---- a deck that builds downwards ----

   The one-screen door lasted a day: a front page that cannot
   grow is a front page that has to turn things away, and this
   site keeps making things. So the top of the page is still the
   door (who are you, and the answer back), and under it is a
   deck of cards from every part of the site, built to take
   another row whenever something new is worth one. Adding a card
   here is one more <Tile> with a column span, and nothing else.

   ---- what is chosen for the reader ----

   Three cards on this page are not the same for everybody:

   - the headline and lede swap on `data-hl` (layout.tsx, before
     first paint);
   - the FEATURED card answers the audience switch
     (components/featured.tsx);
   - the CONTINUE strip appears for a reader mid-course
     (components/door.tsx), and the PULSE card cycles the latest
     pieces (components/pulse-card.tsx).

   Everything else is written here, server-rendered, and true
   with JavaScript off.

   ---- how this is styled, and where ----

   Layout is Tailwind utilities in this file, per the house rule
   that JSX gets utilities. What a tile IS (the accent rail, the
   wash, the chip and disc recipes, the lean from /tilt.js) stays
   `.gate-tile`/`.gt-*` in styles.css, because pseudo-elements,
   lang-driven type and a class /tilt.js selects on are exactly
   the three things the Tailwind table in CLAUDE.md keeps in the
   stylesheet.
   ============================================================ */

import type { Metadata } from "next";
import { ContinueCard } from "../../components/door";
import { FeaturedCard } from "../../components/featured";
import { PulseCard } from "../../components/pulse-card";
import { Icon } from "../../components/icons";
import { pageMeta } from "../../lib/pageMeta";
import { SCHOOL_ACCENTS } from "@reiad/shared/nav";

export const metadata: Metadata = pageMeta({
  path: "/",
  title: "Reiad's Library · বাংলায় টাকা, দক্ষতা আর কাজ",
  description: "বাংলাদেশের বাজার আর টাকার কথা সহজ বাংলায়, ছয়টা ফ্রি কোর্স, "
    + "পাঁচটা ক্যালকুলেটর, আর খুলে দেখার মতো আর্থিক মডেল।",
  ogTitle: "Reiad's Library",
  ogDescription: "বাংলায় শেখা, আর যে কাজগুলো খুলে দেখা যায়।",
  card: "home",
  locale: "bn_BD",
});

/** The three numbers the door states about itself, and every one
    of them is a fact about a list somewhere else on this site: six
    schools in `shared/nav.ts`, five calculators, seven case studies.
    They are small enough to be checked by `CLAIMS` in
    `check-content.ts`, which is where a sentence that cannot hold
    a counting slot goes. */
const FACTS = [
  { n: "৬", label: "ফ্রি কোর্স", en: "free courses" },
  { n: "৫", label: "ক্যালকুলেটর", en: "calculators" },
  { n: "৭", label: "কেস স্টাডি", en: "case studies" },
];


/** A plain destination tile. Everything the deck holds that is
    not personalised is one of these, so a new card is a data
    line, not new markup. */
function Tile({ href, accent, icon, chip, title, dek, go, lang, span, dots }: {
  href: string; accent: string; icon: string; chip: string;
  title: string; dek?: string; go: string; lang?: string;
  span: string; dots?: boolean;
}) {
  return (
    <a className={`gate-tile ${span}`} href={href} lang={lang}
      style={{ ["--accent" as string]: accent }}>
      <span className="flex items-center gap-2.5 min-w-0">
        <span className="gt-disc"><Icon name={icon} size={18} /></span>
        <span className="gt-chip mono">{chip}</span>
      </span>
      <span className="gt-title">{title}</span>
      {dots ? (
        <span className="flex gap-[5px] my-0.5" aria-hidden="true">
          {SCHOOL_ACCENTS.map((c) => (
            <i key={c} className="size-[9px] rounded-full" style={{ background: c }} />
          ))}
        </span>
      ) : null}
      {dek ? <span className="gt-dek max-sm:line-clamp-3">{dek}</span> : null}
      <span className="gt-go">{go}
        <span className="gt-arrow"><Icon name="arrow" size={14} /></span>
      </span>
    </a>
  );
}

/** One line in the side column: a handle, not a card. */
function SlimTile({ href, accent, icon, chip, title, live }: {
  href: string; accent: string; icon: string; chip: string;
  title: string; live?: boolean;
}) {
  return (
    <a className="gate-tile gate-slim" data-glow="card" href={href} lang="bn"
      style={{ ["--accent" as string]: accent }}>
      <span className="gt-disc"><Icon name={icon} size={16} /></span>
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
        <span className="gt-chip mono">{live ? <i className="gt-live" /> : null} {chip}</span>
        <span className="gt-title">{title}</span>
      </span>
      <span className="gt-go">
        <span className="gt-arrow"><Icon name="arrow" size={14} /></span>
      </span>
    </a>
  );
}

export default function HomePage() {
  return (
    <main id="main">
      <div className="mx-auto w-full max-w-[1240px]
        px-[clamp(16px,3vw,44px)] pt-[clamp(18px,3.4vw,44px)] pb-[clamp(28px,4vw,56px)]
        grid gap-[clamp(20px,3.2vw,40px)]">

        {/* ============ the door ============ */}
        <header className="grid gap-[clamp(10px,1.6vw,18px)]">
          <span className="gate-eyebrow mono">
            Rony Reiad · Dhaka / Brighton · CFA L1 candidate
          </span>

          <h1 className="gate-h1" data-when="open" lang="bn">
            টাকার ভাষা, <em className="gate-mark">আমাদের ভাষায়</em>।
          </h1>
          <h1 className="gate-h1" data-when="learn" lang="bn">
            যা শিখতে চান, <em className="gate-mark">নিজের ভাষায়</em>।
          </h1>
          <h1 className="gate-h1" data-when="work" lang="en">
            Financial models you can <em className="gate-mark">open, edit and trust</em>.
          </h1>

          <p className="gate-lede" data-when="open" lang="bn">
            বাংলাদেশের বাজার, টাকা, ভাষা আর রান্না: যেটা শিখতে চান সেটা বাংলায়,
            একদম শুরু থেকে। আর যদি কাজের খোঁজে এসে থাকেন, উপরের সুইচটা ঘুরিয়ে দিন।
          </p>
          <p className="gate-lede" data-when="learn" lang="bn">
            ছয়টা কোর্স, সবগুলো ফ্রি। বিও অ্যাকাউন্ট খোলা থেকে জার্মান বাক্য
            বানানো পর্যন্ত, আর আপনি কতদূর পড়েছেন সেটা জমা থাকে আপনার
            অ্যাকাউন্টে।
          </p>
          <p className="gate-lede" data-when="work" lang="en">
            Three-statement models, a DCF, a stress test and a frontier
            optimiser, each one a working spreadsheet you can open in the
            browser and pull apart. The numbers are pinned by tests.
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-[clamp(20px,3vw,40px)] mt-0.5">
            <ul className="gate-facts">
              {FACTS.map((f) => (
                <li key={f.en}>
                  <b lang="bn">{f.n}</b>
                  <span lang="bn">{f.label}</span>
                </li>
              ))}
            </ul>
            <p className="gate-hint mono max-sm:hidden">
              <Icon name="search" size={13} /> <kbd>Ctrl K</kbd>
              <span> anything on this site, by name</span>
            </p>
          </div>
        </header>

        {/* ============ the deck ============ */}
        <section aria-label="Where to go"
          className="gate-deck grid items-stretch gap-[clamp(10px,1.4vw,16px)]
            grid-cols-2 lg:grid-cols-12">

          <FeaturedCard />

          <aside aria-label="Yours, and the biggest school"
            className="col-span-2 lg:col-span-4 grid
              gap-[clamp(10px,1.4vw,16px)] sm:grid-cols-2 lg:grid-cols-1 lg:auto-rows-fr">
            <ContinueCard />
            <SlimTile href="/money" accent="var(--green)" icon="coins"
              chip="সবচেয়ে বড়টা" title="টাকা ও শেয়ার" />
            <SlimTile href="/account" accent="var(--green)" icon="user"
              chip="আপনার" title="অ্যাকাউন্ট, টিক আর লক্ষ্য" />
            <SlimTile href="/tools/live" accent="var(--gold)" icon="wallet"
              chip="Live" title="লাইভ পোর্টফোলিও" live />
          </aside>

          <Tile span="col-span-1 lg:col-span-3" href="/skills"
            accent="var(--green)" icon="skills" chip="শেখা" lang="bn" dots
            title="ছয়টা কোর্স, সবটাই বাংলায়"
            go="তালিকা দেখুন" />
          <Tile span="col-span-1 lg:col-span-3" href="/deutsch"
            accent="var(--blue)" icon="book" chip="কোর্স" lang="bn"
            title="জার্মান, বাংলা দিয়ে"
            dek="চারটা স্তর, রোজ এক পাতার অনুশীলন খাতা।"
            go="শুরু করুন" />
          <Tile span="col-span-1 lg:col-span-3" href="/tools/stock"
            accent="var(--gold)" icon="gauge" chip="Tool"
            title="Stock check: buy, hold or sell?"
            dek="Forty-odd ratios, a verdict that shows its arithmetic."
            go="Check a share" />
          <Tile span="col-span-1 lg:col-span-3" href="/portfolio"
            accent="var(--plum)" icon="briefcase" chip="Work"
            title="The case studies"
            dek="Valuation, stress testing, portfolio construction."
            go="See the work" />

          <PulseCard />

          <Tile span="col-span-1 lg:col-span-3" href="/tools"
            accent="var(--gold)" icon="calculator" chip="Tools" lang="bn"
            title="পাঁচটা ক্যালকুলেটর"
            dek="চক্রবৃদ্ধি, সঞ্চয়পত্র, মূল্যস্ফীতি, কিস্তি, পজিশন।"
            go="হিসাব করুন" />
          <Tile span="col-span-1 lg:col-span-3" href="/quran"
            accent="var(--teal)" icon="scroll" chip="কোর্স" lang="bn"
            title="কুরআনের আরবি"
            dek="তিন ধাপে ষাট দিন, শব্দ চেনা থেকে সূরা পড়া।"
            go="শুরু করুন" />

        </section>
      </div>
    </main>
  );
}

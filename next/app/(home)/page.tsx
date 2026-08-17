/* ============================================================
   The front door, and it is a door rather than a page.

   ---- one screen, and no scrollbar ----

   This page fills the viewport exactly and does not scroll. That
   is a decision, not a layout accident, and it is the answer to
   what the old front page had become: a hero, a doorway, a
   welcome-back panel, a nine-cell bento, a ticker, a feature
   card, a services list and a credentials box, roughly four
   screens of things each written for a different one of three
   readers. Two thirds of it was hidden by a stylesheet rule
   depending on who you were, which meant the page's real job,
   asking who you are, was the top eighth of it and everything
   else was the answer to a question you had not been asked yet.

   So: the question, three ways in, and nothing under the fold
   because there is no fold. `fixed` on the shell is what turns
   the scrolling column off, and the footer is left off with it,
   because a footer you cannot reach is furniture in a cupboard.
   Every link in it is in the rail on the left, on this page and
   every other.

   ---- and the two answers ----

   `data-hl` on the root, set before the first paint by the boot
   script in `layout.tsx`, says which of three introductions this
   reader gets: `open` for somebody who has just arrived, `learn`
   and `work` for the two answers. The rule lives in the document
   for the reason that file gives at length: `sw.js` serves HTML
   network-first and everything else cache-first, so the first
   load after a deploy pairs new markup with the old stylesheet.
   ============================================================ */

import type { Metadata } from "next";
import { GoCard } from "../../components/deck";
import { ContinueCard } from "../../components/door";
import { Icon } from "../../components/icons";
import { pageMeta } from "../../lib/pageMeta";

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
    schools in `lib/nav.ts`, five calculators, seven case studies.
    They are small enough to be checked by `CLAIMS` in
    `check-content.mjs`, which is where a sentence that cannot hold
    a counting slot goes. */
const FACTS = [
  { n: "৬", label: "ফ্রি কোর্স", en: "free courses" },
  { n: "৫", label: "ক্যালকুলেটর", en: "calculators" },
  { n: "৭", label: "কেস স্টাডি", en: "case studies" },
];

export default function HomePage() {
  return (
    <main id="main" className="gate">
      <div className="gate-grid">

        <section className="gate-say">
          <span className="gate-eyebrow mono">
            Rony Reiad · Dhaka / Brighton · CFA L1 candidate
          </span>

          {/* Three headlines, one shown. The attribute the rule
              keys off is on the root, so none of this is a
              measurement and none of it moves after load. */}
          <h1 className="gate-h1" data-when="open" lang="bn">
            টাকার ভাষা, আমাদের ভাষায়।
          </h1>
          <h1 className="gate-h1" data-when="learn" lang="bn">
            যা শিখতে চান, নিজের ভাষায়।
          </h1>
          <h1 className="gate-h1" data-when="work" lang="en">
            Financial models you can open, edit and trust.
          </h1>

          <p className="gate-lede" data-when="open" lang="bn">
            বাংলাদেশের বাজার, টাকা, ভাষা আর রান্না: যেটা শিখতে চান সেটা বাংলায়,
            একদম শুরু থেকে। আর যদি কাজের খোঁজে এসে থাকেন, উপরের সুইচটা ঘুরিয়ে দিন।
          </p>
          <p className="gate-lede" data-when="learn" lang="bn">
            ছয়টা কোর্স, সবগুলো ফ্রি, কোনো লগইন ছাড়া। বিও অ্যাকাউন্ট খোলা থেকে
            জার্মান বাক্য বানানো পর্যন্ত, আর আপনি কতদূর পড়েছেন সেটা আপনার
            নিজের ব্রাউজারেই থাকে।
          </p>
          <p className="gate-lede" data-when="work" lang="en">
            Three-statement models, a DCF, a stress test and a frontier
            optimiser, each one a working spreadsheet you can open in the
            browser and pull apart. The numbers are pinned by tests.
          </p>

          <ul className="gate-facts">
            {FACTS.map((f) => (
              <li key={f.en}>
                <b lang="bn">{f.n}</b>
                <span lang="bn">{f.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="gate-picks" aria-label="Where to go">
          <ContinueCard />

          <GoCard
            href="/skills/index.html" accent="var(--green)" icon="skills" lang="bn"
            chip="শেখা"
            title="ছয়টা কোর্স, সবটাই বাংলায়"
            dek="টাকা ও শেয়ার, জার্মান, কুরআনের আরবি, ইংরেজি, রান্না আর ভ্রমণ।"
            go="তালিকা দেখুন"
          />
          <GoCard
            href="/money/index.html" accent="var(--gold)" icon="coins" lang="bn"
            chip="সবচেয়ে বড়টা"
            title="টাকা ও শেয়ার"
            dek="হাতেখড়ি থেকে গবেষণা পর্যন্ত, ধাপে ধাপে।"
            go="শুরু করুন"
          />
          <GoCard
            href="/portfolio.html" accent="var(--green)" icon="briefcase"
            chip="Work"
            title="Seven case studies, all of them open"
            dek="Valuation, stress testing, portfolio construction, and a dissertation."
            go="See the work"
          />

          <p className="gate-hint mono">
            <Icon name="search" size={14} /> Ctrl K
            <span> anything on this site, by name</span>
          </p>
        </section>

      </div>
    </main>
  );
}

/* A school's front page, out of its rows, counting what it drew. A
   hand-written hub is three copies of the database kept in step by
   somebody remembering, and both the count and the per-stage card go
   wrong the way `CLAUDE.md` says counts go wrong. Adding a lesson in the
   Studio changes this page and nothing has to be rebuilt.

   Every step and every stage is a `GoCard`: they take you to a page, they
   carry an accent rail and an arrow, and they show a tick. Everything
   explaining how the school works is an `InfoCard`: no arrow, no lift, a
   dashed edge. */

import { bnNum, type SchoolStage } from "@reiad/shared/schools";
import { GoCard, InfoCard } from "./deck";
import { Icon } from "./icons";
import { LadderMeter, Resume, type LadderLesson } from "./progress";
import type { School } from "../lib/school";
import { SectionLabel } from "./ui/label";

    /* What a rung's card is coloured by, and the distinction is between
       STATE and section. `live` follows the page: a rung belongs to its
       school, so `var(--green)` draws a green card on the German hub while
       the rail, the meter and every other card are blue.

       FOLLOWING THE PAGE IS `undefined`, NOT `"var(--accent)"`. The card
       writes its accent into `--accent`, so that string makes the
       declaration `--accent: var(--accent)`: a cycle, thrown out, and
       `--accent` invalid on the card and everything inside it. Since
       `--panel` is mixed from the accent, fourteen cards then have no
       ground, no rail, no icon tile and no chip.
       `scripts/check-selfref.ts` fails on it.

       `soon` is a state and is deliberately not the accent: a rung that
       has been promised and not written should look the same in every
       school. */
const ACCENT = {
  start: undefined,
  live: undefined,
  soon: "var(--ink-soft)",
};

/** The ladder as the reader's progress module wants it: an id, a
    title, a URL and which stage it came from. Computed on the
    server so the browser never needs a curriculum to know what
    the ladder is. */
const flatten = (school: School): LadderLesson[] =>
  school.lessons
    .filter((l) => l.status === "live" && l.written === true)
    .map((l) => ({
      id: l.id, title: String(l.bn), url: l.url, stage: l.stage.slug,
    }));

const stageWord = (stage: SchoolStage) => String(stage.kicker ?? stage.bn);

export function MoneyHub({ school }: { school: School }) {
  const [first, ...ladder] = school.rungs;
  const lessons = flatten(school);
  const written = school.rungs.reduce((sum, r) => sum + r.written, 0);

  return (
    <main id="main" className="hub">
      <div className="hub-wrap">

        {/* ---------- the head ---------- */}
        <header className="hub-hero">
          <span className="hub-eyebrow mono">
            টাকা ও শেয়ার · <span lang="en">Money &amp; the market</span>
          </span>
          <h1 className="bn-h">টাকার কথা, বাংলায়, একদম শুরু থেকে।</h1>
          <p className="hub-lede" lang="bn">
            বিও অ্যাকাউন্ট কী সেটাও জানেন না, এমন জায়গা থেকে শুরু করে নিজে একটা কোম্পানি
            যাচাই করা পর্যন্ত। {bnNum(school.counts.stages)}টা ধাপ,
            লেখা হয়ে গেছে {bnNum(written)}টি, সবটাই ফ্রি। আপনি কতদূর পড়েছেন সেটা
            জমা থাকে আপনার অ্যাকাউন্টে।
          </p>

          <div className="hub-progress">
            <LadderMeter
              school={school.school}
              lessons={lessons}
              words={{ some: "{done} / {total}টি পড়া হয়েছে", none: "শুরু করুন" }}
            />
          </div>

          <Resume
            school={school.school}
            lessons={lessons}
            words={{
              label: "যেখানে ছিলেন",
              go: "পড়া শুরু করুন",
              fresh: "এই স্কুলের লেখা সবগুলো পড়া হয়ে গেছে। নতুন লেখা এলে এখানেই দেখবেন।",
            }}
          />
        </header>

        {/* ---------- stage zero, which is where everybody starts ---------- */}
        {first ? (
          <section className="hub-section" id="hatekhori">
            <div className="hub-section-head">
              <SectionLabel>
                {stageWord(first.stage)} · <span lang="en">Start here</span>
              </SectionLabel>
              <p className="hub-section-note" lang="bn">{String(first.stage.blurb ?? "")}</p>
            </div>

            <div className="deck deck-wide">
              {first.lessons.map((lesson, i) => (
                /* The id is what the old hub's accordions carried,
                   so a link somebody saved to
                   `/money#step-papers` still lands on
                   the thing it named. The page it points at is a
                   real page now; the anchor is the courtesy. */
                <div key={lesson.slug} id={`step-${lesson.slug}`} className="hub-step">
                  <GoCard
                    href={lesson.url}
                    accent={ACCENT.start}
                    icon={String(lesson.icon ?? "seed")}
                    chip={`ধাপ ${bnNum(i + 1)}`}
                    lang="bn"
                    title={String(lesson.bn)}
                    dek={String(lesson.blurb ?? "")}
                    go="পড়ুন"
                  >
                    <span className="card-meta">
                      <span>{bnNum(Number(lesson.minutes ?? 0))} মিনিট</span>
                      {lesson.risk ? (
                        <span className="risk-chip" data-risk={String(lesson.risk)}>
                          {lesson.risk === "high" ? "ঝুঁকি বেশি"
                            : lesson.risk === "mid" ? "ঝুঁকি মাঝারি" : "ঝুঁকি কম"}
                        </span>
                      ) : null}
                    </span>
                  </GoCard>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ---------- the ladder ---------- */}
        <section className="hub-section" id="dhap">
          <div className="hub-section-head">
            <SectionLabel>
              ধাপে ধাপে · <span lang="en">The ladder</span>
            </SectionLabel>
            <p className="hub-section-note" lang="bn">
              হাতেখড়ির পর ক্রম মেনে এগোনো সবচেয়ে কাজে দেয়, তবে যেকোনো ধাপ থেকে শুরু করা যায়।
              যেগুলো এখনো লেখা হয়নি সেগুলোও নিচে আছে, কারণ কী আসছে জানা থাকলে অপেক্ষা করা যায়।
            </p>
          </div>

          <div className="deck deck-2">
            {ladder.map((rung) => {
              const soon = rung.stage.status !== "live" || rung.written === 0;
              const accent = soon ? ACCENT.soon : ACCENT.live;

              return (
                <GoCard
                  key={rung.stage.slug}
                  href={rung.url}
                  accent={accent}
                  icon={String(rung.stage.icon ?? "book")}
                  chip={stageWord(rung.stage)}
                  lang="bn"
                  title={String(rung.stage.bn)}
                  dek={String(rung.stage.blurb ?? "")}
                  go={soon ? "কী আসছে দেখুন" : "এই ধাপটা খুলুন"}
                >
                  <span className="card-meta">
                    <span>{bnNum(rung.total)}টি লেখা</span>
                    <span>
                      {rung.written === rung.total
                        ? "সবগুলো তৈরি"
                        : `${bnNum(rung.written)}টি তৈরি`}
                    </span>
                    <span>{bnNum(rung.minutes)} মিনিট</span>
                  </span>
                  {rung.written ? (
                    <LadderMeter
                      school={school.school}
                      accent={accent}
                      lessons={rung.lessons
                        .filter((l) => l.status === "live" && l.written === true)
                        .map((l) => ({
                          id: l.id, title: String(l.bn), url: l.url, stage: rung.stage.slug,
                        }))}
                      words={{ some: "{done}/{total}" }}
                    />
                  ) : null}
                  {rung.stage.who ? (
                    <span className="card-who" lang="bn">
                      <Icon name="person" size={14} /> {String(rung.stage.who)}
                    </span>
                  ) : null}
                </GoCard>
              );
            })}
          </div>
        </section>

        {/* ---------- how it is put together ---------- */}
        <section className="hub-section" id="kivabe">
          <div className="hub-section-head">
            <SectionLabel>
              কীভাবে সাজানো · <span lang="en">How it works</span>
            </SectionLabel>
          </div>

          <div className="deck">
            <InfoCard
              icon="signpost" accent="var(--green)" lang="bn"
              title="ক্রম আছে, বাধ্যবাধকতা নেই"
              dek="প্রতিটা ধাপ ধরে নেয় আগেরটা পড়া আছে, কিন্তু কোথাও তালা নেই। যেটা দরকার সেটা
                   সরাসরি পড়তে পারেন, লিংক ধরে পিছিয়েও যেতে পারেন।"
            />
            <InfoCard
              icon="check" accent="var(--green)" lang="bn"
              title="টিক আপনার অ্যাকাউন্টে"
              dek="কোন লেখাটা পড়া হয়েছে সেটা জমা থাকে আপনার অ্যাকাউন্টে, তাই ফোনে
                   যেখানে থামবেন ল্যাপটপে সেখান থেকেই শুরু করতে পারবেন।"
            />
            <InfoCard
              icon="warning" accent="var(--gold)" lang="bn"
              title="এটা পরামর্শ না"
              dek="এখানকার সবকিছু সাধারণ শিক্ষামূলক তথ্য। কোন শেয়ার কিনবেন সেটা এখানে
                   কেউ বলবে না, আর যে সাইট বলে সেটা নিয়ে সন্দেহ করাই ভালো।"
            />
          </div>
        </section>

        {/* ---------- and the two doors out ---------- */}
        <section className="hub-section" id="ekhon">
          <div className="deck deck-2">
            <GoCard
              href="/money/contents" art="book" accent="var(--green)" icon="book" lang="bn"
              chip="পুরো তালিকা"
              title="সব লেখার তালিকা"
              dek="এক পাতায় প্রতিটা ধাপের প্রতিটা লেখা, নাম ধরে ধরে।"
              go="তালিকা দেখুন"
            />
            <GoCard
              href="/tools" art="sheets" accent="var(--gold)" icon="calculator" lang="bn"
              chip="ক্যালকুলেটর"
              title="নিজের সংখ্যা বসিয়ে দেখুন"
              dek="চক্রবৃদ্ধি, কিস্তি, মূল্যস্ফীতি আর সঞ্চয়পত্র: পড়া জিনিসটা নিজের টাকায় মিলিয়ে নেওয়া।"
              go="ক্যালকুলেটর খুলুন"
            />
          </div>
        </section>

      </div>
    </main>
  );
}

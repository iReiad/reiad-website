/* ============================================================
   school-contents.tsx: every lesson of a school, on one page.

   `/money/contents.html`. Not a hub and not a ladder: its entire
   job is being a complete list, so that a reader who knows what
   they are looking for does not have to open four stages to find
   it, and so that a search engine sees every title.

   It was a hand-written page and then a hand-written string
   copied into `lib/school-hubs.ts`, which meant the one page on
   the site whose whole value is completeness was the page most
   likely to be out of date. It is the rows now.

   ---- what a reader gets that the old one did not ----

   The ticks. A complete list of eighty-nine lessons is where
   knowing which ones you have read is worth the most, and the
   old page had no idea: progress lived in a module that page
   never loaded.
   ============================================================ */

import { bnNum } from "@reiad/shared/schools";
import { CardTick, LadderMeter, type LadderLesson } from "./progress";
import type { School } from "../lib/school";
import { SectionLabel } from "./ui/label";

export function SchoolContents({ school }: { school: School }) {
  const lessons: LadderLesson[] = school.lessons
    .filter((l) => l.status === "live" && l.written === true)
    .map((l) => ({ id: l.id, title: String(l.bn), url: l.url, stage: l.stage.slug }));

  return (
    <main id="main" className="hub">
      <div className="hub-wrap">

        <header className="hub-hero">
          <span className="hub-eyebrow mono">
            সব লেখা · <span lang="en">Everything, listed</span>
          </span>
          <h1 className="bn-h">টাকা ও শেয়ারের পুরো তালিকা</h1>
          <p className="hub-lede" lang="bn">
            {bnNum(school.counts.stages)}টা ধাপে মোট {bnNum(school.counts.lessons)}টি লেখা,
            পড়ার ক্রম অনুযায়ী সাজানো। যেগুলো এখনো লেখা হয়নি সেগুলো ধূসর, আর যেগুলো আপনি
            পড়ে ফেলেছেন সেগুলোতে টিক।
          </p>
          <div className="hub-progress">
            <LadderMeter
              school={school.school}
              lessons={lessons}
              words={{ some: "{done} / {total}টি পড়া হয়েছে" }}
            />
          </div>
        </header>

        {school.rungs.map((rung) => (
          <section className="hub-section" key={rung.stage.slug} id={rung.stage.slug}>
            <div className="hub-section-head">
              <SectionLabel>{String(rung.stage.kicker ?? "")}</SectionLabel>
              <h2 className="bn-h contents-h">
                <a href={rung.url}>{String(rung.stage.bn)}</a>
              </h2>
              <p className="hub-section-note" lang="bn">{String(rung.stage.blurb ?? "")}</p>
            </div>

            <ol className="contents-list">
              {rung.lessons.map((lesson) => {
                const ready = lesson.status === "live" && lesson.written === true;
                return (
                  <li key={lesson.id} data-ready={ready ? "" : undefined}>
                    {ready ? (
                      <a href={lesson.url}>
                        <span className="contents-name bn-h">{String(lesson.bn)}</span>
                        {lesson.en ? (
                          <span className="contents-en" lang="en">{String(lesson.en)}</span>
                        ) : null}
                        <span className="contents-min mono">
                          {bnNum(Number(lesson.minutes ?? 0))} মিনিট
                        </span>
                        <CardTick school={school.school} id={lesson.id} />
                      </a>
                    ) : (
                      <span>
                        <span className="contents-name bn-h">{String(lesson.bn)}</span>
                        <span className="contents-soon">আসছে</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}

      </div>
    </main>
  );
}

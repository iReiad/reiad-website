/* ============================================================
   A stage's contents page, rendered from its rows.

   TRANSITION.md Stage 11.7 step 2. Seventeen of the 251 files:
   `/learn/<stage>/index.html`, `/deutsch/<stufe>/index.html`,
   `/quran/<dhap>/index.html` and `/english/<term>/index.html`.
   It is the page a reader navigates the school by, and the one
   that says how much of it there is.

   ---- the numbers are counted, never declared ----

   How many lessons, how many are written, how many minutes and
   how many days all come from the lessons themselves, in
   `getStage()`. That is the rule at the top of `CLAUDE.md`, and
   the four builders already obey it: a stage that grows a lesson
   moves its own count. A route that read a number out of a
   stage's meta would be the same mistake in a newer file.

   ---- and the folder is called index.html ----

   Literally. It is a static segment sitting beside `[lesson]`,
   which is what makes `/quran/dhap-1/index.html` the ladder and
   `/quran/dhap-1/tin-prokar.html` a lesson: a static segment
   wins over a dynamic sibling. Every URL on this site ends in
   `.html` and a folder named for one is the least surprising way
   to say so.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stageUrl } from "@reiad/shared/schools";
import { getStage } from "../../../../lib/school";
import { siteOrigin } from "../../../../lib/article";
import { schoolIcon } from "../../../../lib/school-icons";
import { SiteScripts } from "../../../../components/scripts";

type Params = Promise<{ section: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section, slug } = await params;
  const found = await getStage(section, slug);
  if (!found) return {};

  const { look, stage } = found;
  const origin = siteOrigin();
  const url = `${origin}${stageUrl(section, stage)}`;
  const title = `${stage.kicker} · ${stage.bn}, ${look.title}, Reiad's Library`;
  const description = String(stage.blurb ?? "");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Reiad's Library",
      images: [{ url: `${origin}/og/${look.og}${stage.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
  };
}

export default async function StagePage({ params }: { params: Params }) {
  const { section, slug } = await params;
  const found = await getStage(section, slug);
  if (!found) notFound();

  const { school, look, stage, lessons, counted, prev, next, book } = found;
  const shape = look.stage;
  const sub = shape.sub(stage);
  const can = shape.can?.(stage) ?? null;
  const instead = book ? null : (shape.book?.instead?.(stage) ?? null);

  /* The ladder cell, in the school's own word for a stage. The
     money school's starter guide is the one rung with no page of
     its own: it is `inline`, its eight steps are sections of the
     hand-written hub, and the cell points at the anchor rather
     than at a folder nothing writes. */
  const rung = (to: typeof prev, label: string) => (to ? (
    <a href={to.inline ? `/${school}/index.html#starter` : stageUrl(school, to)}>
      <span className="mono">{label}</span>
      <strong className="bn-h">{`${to.kicker} · ${to.bn}`}</strong>
    </a>
  ) : null);

  return (
    <>
      <main id="main">
        <div className="wrap">

          <div className={`hero stage-hero${shape.hero ? ` ${shape.hero}` : ""}`}
               {...{ [look.attr.stage]: stage.slug }}>
            <span className="eyebrow mono">
              {stage.kicker}
              {sub ? <>{" · "}<span lang={sub.lang}>{sub.text}</span></> : null}
            </span>
            <h1 className="bn-h">
              <StageArt school={school} name={String(stage.icon ?? "")} />
              {stage.bn}
            </h1>
            <p className="lede">{String(stage.blurb ?? "")}</p>
            <dl className="stage-facts">
              {shape.facts(stage, counted).map((fact) => (
                <div key={fact.dt}><dt>{fact.dt}</dt><dd>{fact.dd}</dd></div>
              ))}
            </dl>
            {can ? <p className={can.cls}>{can.text}</p> : null}
            <div className="stage-progress" {...{ [shape.progressAttr]: stage.slug }}>
              <span className="track"><i /></span>
              <span className="count mono" />
            </div>
            <div className="hero-actions">
              {/* Where "continue" goes with no progress stored. The
                  school's own script moves it to wherever the
                  reader actually stopped. */}
              <a className="btn btn-solid" href={lessons[0].url}
                 {...{ [shape.continueAttr]: stage.slug }}>শুরু করুন →</a>
              <a className="btn btn-ghost" href={shape.back.url}>{shape.back.label}</a>
            </div>
          </div>

          {/* The practice book, above the cards rather than under
              them. It is what a returning learner came for, and
              burying it under fourteen cards would mean scrolling
              past the course to reach the homework every evening. */}
          {shape.book && (book || instead) ? (
            <section id={shape.book.id} className="no-filter">
              <span className="section-label mono">
                {shape.book.label}
                {" · "}
                <span lang={shape.book.lang}>
                  {shape.book.lang === "de" ? "Jeden Tag" : "Every day"}
                </span>
              </span>
              {book ? (
                <a className={`cell ${shape.book.cls}`} href={book}
                   data-workbook={stage.slug}>
                  <span className={shape.book.artCls} aria-hidden="true">
                    <StageArt school={school} name="pen" plain />
                  </span>
                  <span className={shape.book.textCls}>
                    <strong className="bn-h">
                      {`${bnDigits(Number(stage.workbook?.days))} দিনের অনুশীলন খাতা`}
                    </strong>
                    <span>{shape.book.blurb}</span>
                  </span>
                  <span className="more" data-workbook-cta>{shape.book.cta}</span>
                </a>
              ) : (
                /* A stage with no book says so where the book
                   would have been. Leaving the band out reads as
                   something missing, and at this level the absence
                   is the point: the practice has moved off the
                   page and into the week. */
                <div className="note">{instead}</div>
              )}
            </section>
          ) : null}

          {stage.sections.map((section) => {
            const inSection = lessons.filter((l) => l.section.id === section.id);
            return (
              <section key={String(section.id)} id={String(section.id)}>
                <span className="section-label mono">
                  {section.bn}
                  {" · "}
                  <SectionSub section={section} />
                </span>
                <div className="cards lesson-grid">
                  {inSection.map((lesson) => {
                    const soon = lesson.status !== "live";
                    const other = look.sub(lesson);
                    return (
                      <a key={lesson.slug}
                         className={`cell lesson-card${soon ? " is-soon" : ""}`}
                         href={lesson.url}
                         {...{ [look.attr.id]: lesson.id }}>
                        <span className="lesson-card-art" aria-hidden="true">
                          <StageArt school={school}
                                    name={String(lesson.icon ?? stage.icon ?? "")} plain />
                        </span>
                        {/* Two schools number their lessons on the
                            card, under two different class names,
                            and two do not number them at all. */}
                        {lesson.label && CARD_LABEL[school] ? (
                          <span className={`${CARD_LABEL[school]} mono`}>{lesson.label}</span>
                        ) : null}
                        <h3 className="bn-h">
                          {lesson.bn}
                          {other ? <>{" "}<span className={other.cls} lang={other.lang}>{other.text}</span></> : null}
                        </h3>
                        <p>{String(lesson.blurb ?? "")}</p>
                        <span className="lesson-card-foot mono">
                          {soon ? "আসছে" : `${bnDigits(Number(lesson.minutes ?? 0))} মিনিট`}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <nav className="prev-next" aria-label={shape.ladder.label}>
            {rung(prev, shape.ladder.prev)}
            {rung(next, shape.ladder.next)}
          </nav>

          {/* The money school's stages each point at the full
              index, because its six ladders are picked from rather
              than walked through in order. */}
          {school === "learn" ? (
            <p className="contents-footlink">
              <a href="/learn/contents.html">সব বিষয় এক নজরে, পুরো সূচিপত্র →</a>
            </p>
          ) : null}

          <div className="note">{shape.note}</div>

        </div>
      </main>
      <SiteScripts srcs={[shape.script]} />
    </>
  );
}

/* The card's number, under the class each school already uses.
   Two names for one idea, and both are in the stylesheet. */
const CARD_LABEL: Record<string, string> = {
  quran: "dars-day",
  english: "part-num",
};

/** Bangla numerals. `bnNum` in `shared/schools.js` under a name
    that reads right beside JSX. */
const bnDigits = (n: number) =>
  String(Number.isFinite(n) ? n : 0).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** A school's drawing, at the two sizes a ladder page uses it. */
function StageArt(
  { school, name, plain = false }: { school: string; name: string; plain?: boolean }
) {
  const inner = schoolIcon(school, name);
  if (!inner) return null;
  return (
    <svg className={plain ? "art" : "art stage-art"} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true"
         dangerouslySetInnerHTML={{ __html: inner }} />
  );
}

/** The section label's other half, in whichever language the
    school teaches. */
function SectionSub({ section }: { section: { en?: string; de?: string; ar?: string } }) {
  if (section.ar) return <span lang="ar">{section.ar}</span>;
  if (section.de) return <span lang="de">{section.de}</span>;
  return <>{section.en ?? ""}</>;
}

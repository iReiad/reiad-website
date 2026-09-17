/* A lesson of one of the four schools, rendered from its row.

   THE SEGMENTS ARE NAMED [section]/[slug]/[lesson] because App Router
   will not have two different dynamic names at one level of a tree, and
   `/insights/<slug>` already claims `[section]/[slug]`.
   `[school]/[stage]/[lesson]` beside it fails the whole app's build with
   "You cannot use different slug names for the same dynamic path". The
   awkwardness is in the folder names alone: nothing below calls a school
   a section. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bnNum, laddered, stageUrl } from "@reiad/shared/schools";
import { getLesson } from "../../../../lib/school";
import { siteOrigin } from "../../../../lib/article";
import { schoolIcon } from "../../../../lib/school-icons";
import { SiteScripts } from "../../../../components/scripts";
import { Keep } from "../../../../components/keep";
import { Where } from "../../../../components/where";
import { CardTick, LessonTick } from "../../../../components/progress";
import { Eyebrow } from "../../../../components/ui/label";
import { LessonBody } from "../../../../components/lesson/body";
import { ReadLangSwitch } from "../../../../components/lesson/lang-switch";
import { Stars } from "../../../../components/lesson/stars";
import { HearProse } from "../../../../components/lesson/hear-prose";

type Params = Promise<{ section: string; slug: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section, slug, lesson } = await params;
  const found = await getLesson(section, slug, lesson);
  if (!found) return {};

  const { look, stage, lesson: it } = found;
  const origin = siteOrigin();
  const url = `${origin}${it.url}`;
  /* The same sentence in three tags, which is what all four
     builders write. A description that differs from the og
     description is two answers to one question. */
  const title = `${it.bn}: ${look.stageName(stage)}, ${look.title}, Reiad's Library`;
  const description = String(it.blurb ?? "");

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
          /* THE LESSON'S OWN CARD, where one has been drawn. Sharing the
             stage's standing card means three lessons from one stage
             pasted into a chat are the same picture three times.
             `meta.card` is the drawn one, stored by
             `/api/schools/<school>/<stage>/<lesson>`; the stage's card is
             what a lesson nobody has drawn one for still gets. */
      images: [{
        url: typeof it.card === "string" && it.card
          ? (it.card.startsWith("http") ? it.card : `${origin}${it.card}`)
          : `${origin}/og/${look.og}${stage.slug}.png`,
        width: 1200, height: 630,
      }],
    },
    twitter: { card: "summary_large_image" },
    other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { section, slug, lesson } = await params;
  const found = await getLesson(section, slug, lesson);
  if (!found) notFound();

  const { school, look, stage, stages, lesson: it, body, bodyEn, blocks, prev, next } = found;

  /* "Written" is the body, not the status. A lesson marked live
     whose prose is empty is a real state and the builders draw
     the waiting page for it rather than an empty article; a route
     that trusted the status would render a heading over nothing. */
  const soon = it.status !== "live" || !body;
  const sub = look.sub(it);
  const alt = look.alt?.(stage) ?? null;
  const tail = next
    ? { url: next.url, kicker: look.words.next, label: String(next.bn) }
    : look.tail(stage, stages);

  const art = schoolIcon(school, String(it.icon ?? stage.icon ?? ""));
  const meta = [it.label, soon ? "আসছে" : look.words.minutes(Number(it.minutes ?? 0))]
    .filter(Boolean)
    .join(" · ");

  /* The whole stage, in order, so a reader always sees where this
     lesson sits and can reach any other without going back up.
     Every rung is listed, written or not: a rung that is coming is
     part of the shape of the stage, and hiding it makes "৩ / ১২"
     a lie. Only a live rung is a link. */
  const rungs = laddered(school, stage);
  const at = rungs.findIndex((l) => String(l.id) === String(it.id));

  return (
    <>
      <main id="main">
        <div className="wrap">

        <article
          className={`term-article lesson${LESSON_CLASS[school] ? ` ${LESSON_CLASS[school]}` : ""}`}
          {...{
            [look.attr.id]: it.id,
            [look.attr.stage]: stage.slug,
            [look.attr.title]: it.bn,
            /* One attribute naming the school, which the three
               school modules did not need because each one only
               ever ran on its own pages. `/checkpoints.js` is
               shared by all four, so it has to be told, and
               guessing from the URL would be a fifth place that
               knows what a school address looks like. */
            "data-school": school,
            ...(soon ? { "data-soon": "1" } : {}),
          }}
        >
          <Eyebrow>
            <a href={stageUrl(school, stage)}>{`${stage.kicker} · ${stage.bn}`}</a>
            {` · ${it.section?.bn ?? ""}`}
          </Eyebrow>

          <h1 className="bn-h">
            {art ? (
              <svg className="art lesson-art" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true"
                   dangerouslySetInnerHTML={{ __html: art }} />
            ) : null}
            {it.bn}
            {sub ? <>{" "}<span className={sub.cls} lang={sub.lang}>{sub.text}</span></> : null}
          </h1>

          <p className="one-liner">{String(it.blurb ?? "")}</p>
          <p className="lesson-meta mono">{meta}</p>

          {/* How much this one matters, out of `meta.stars`, so
              it is data and the ladder card, this page and the
              Android app all read one number. A ladder of eighty
              equally weighted rungs is a ladder nobody can budget
              three evenings against. */}
          {it.stars ? <p className="lesson-stars"><Stars n={it.stars} /></p> : null}

          {/* The language pair, and only where there is a second
              language to switch to. A switch that does nothing is
              worse than none: it says the English is missing
              rather than not written. */}
          {bodyEn.trim() ? <ReadLangSwitch /> : null}

              {/* The same row a piece carries under its byline, and the
                  same questions. `<Keep>` renders nothing signed out, and
                  nothing at all on a lesson that has not been written.
                  `<Where>` records either way, which is why it is not
                  inside that condition, and draws its one control only
                  when there is somewhere to go back to. */}
          {soon ? null : (
            <div className="piece-tools">
              <Keep url={it.url} title={String(it.bn)} kind="lesson" />
              <Where url={it.url} />
              {/* Touch any English line in the prose to hear it.
                  Only the school whose prose is full of them: a
                  German lesson's German is the same idea and is
                  not wired yet, and the money school's English
                  is not the thing being learnt. */}
              {school === "english" ? <HearProse lang="en" /> : null}
            </div>
          )}

          {soon ? (
            <>
              <p className="soon-note">{look.words.soon[0]}</p>
              <p>{look.words.soon[1]}</p>
            </>
          ) : (
                /* The lesson's own HTML, sanitised on the way into the row
                   by `functions/_lib/sanitise.ts`. Rendered rather than
                   escaped for the same reason an article's body is: it is
                   the writing.

                   Both bodies go in, and the blocks between them:
                   `components/lesson/body.tsx` cuts each body at its mount
                   markers and interleaves. The prose is rendered twice,
                   once per language, and each block once, because a block
                   holds state and two would be two quizzes. */
            <LessonBody bn={body} en={bodyEn} blocks={blocks}
                        lesson={String(it.id)} school={school} />
          )}

              {/* The tick, and only for the school whose progress is React.
                  The other three keep their own module, which reads the
                  data attributes on the <article> above.

                  It is a button and not an arrival: marking a lesson read
                  the moment the page opens counts every reader who
                  arrived, saw it was the wrong lesson and left. Opening
                  moves the bookmark; finishing is something you say. */}
          {school === "money" && !soon ? (
            <LessonTick
              school={school} id={it.id} title={String(it.bn)} stage={stage.slug}
              url={it.url}
              /* The whole ladder this lesson is a rung of, so the
                 tick that finishes a stage says so rather than
                 saying the same thing the eighty before it said. */
              of={laddered(school, stage)
                .filter((l) => (l.status ?? "live") === "live")
                .map((l) => String(l.id))}
              words={{ done: "পড়া হয়েছে", notDone: "পড়া হয়েছে চিহ্ন দিন" }}
            />
          ) : null}

          <p className="backlink">
            <a href={stageUrl(school, stage)}>{look.words.backlink(stage)}</a>
            {alt ? <a className="backlink-alt" href={alt.url}>{alt.label}</a> : null}
          </p>
        </article>

        {/* ---- this stage, as a list ----
            The navigation a course needs and this page did not have: the
            stage's lessons in order, the one you are on marked, and your
            place in it counted. Server-rendered, so it is there with no
            JavaScript and for a crawler. The money school's rungs carry a
            tick, read in the browser; the other three schools draw their
            ticks with their own module on the stage page. */}
        {rungs.length > 1 ? (
          <nav className="stage-nav" aria-label={`${stage.kicker} · ${stage.bn}`}>
            <p className="stage-nav-head">
              <a href={stageUrl(school, stage)}>{`${stage.kicker} · ${stage.bn}`}</a>
              {at >= 0 ? (
                <span className="mono">{`${bnNum(at + 1)} / ${bnNum(rungs.length)}`}</span>
              ) : null}
            </p>
            <ol>
              {rungs.map((rung, i) => {
                const here = i === at;
                const live = (rung.status ?? "live") === "live";
                const name = (
                  <>
                    {rung.label ? <span className="mono stage-nav-n">{rung.label}</span> : null}
                    <span className="stage-nav-title bn-h">{String(rung.bn)}</span>
                    <span className="mono stage-nav-min">
                      {live ? look.words.minutes(Number(rung.minutes ?? 0)) : "আসছে"}
                    </span>
                  </>
                );
                return (
                  <li key={rung.id} aria-current={here ? "page" : undefined}
                      data-soon={live ? undefined : ""}>
                    {live && !here ? <a href={rung.url}>{name}</a> : <span>{name}</span>}
                    {school === "money" && live
                      ? <CardTick school={school} id={String(rung.id)} /> : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        {(prev || tail) ? (
          <nav className="prev-next" aria-label={look.words.navLabel}>
            {prev ? (
              <a href={prev.url}>
                <span className="mono">{look.words.prev}</span>
                <strong className="bn-h">{prev.bn}</strong>
              </a>
            ) : null}
            {tail ? (
              <a href={tail.url}>
                <span className="mono">{tail.kicker}</span>
                <strong className="bn-h">{tail.label}</strong>
              </a>
            ) : null}
          </nav>
        ) : null}

        </div>
      </main>
          {/* The school's own script, and the one every school shares.
              Rendered by the page rather than by the shell, because the
              ladder page beside this one loads a different pair.

              `/checkpoints.js` goes on every lesson of every school,
              including the money school's, whose page-level tick is React
              and whose checkpoints are not: a checkpoint lives inside a
              body that arrived as HTML from the database, which React
              renders and does not own. */}
      <SiteScripts srcs={[
        ...(look.script ? [look.script] : []),
        ...(soon ? [] : ["/checkpoints.js"]),
      ]} />
    </>
  );
}

/* The extra class on the <article>, which each school's own
   stylesheet layer hangs its typography on. The money school has
   none: its lessons are the plain article. */
const LESSON_CLASS: Record<string, string> = {
  deutsch: "teil",
  quran: "dars",
  english: "part",
};

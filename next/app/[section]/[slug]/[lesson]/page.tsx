/* ============================================================
   A lesson of one of the four schools, rendered from its row.

   archive/TRANSITION.md Stage 11.7. 251 of the 253 HTML files left in
   `aab/` are school pages, generated on a laptop from a committed
   export of the database and committed themselves. A lesson's
   words therefore exist in three places at once: the row the
   Studio writes, the snapshot, and the built page. Editing a
   lesson changes the first and nothing a reader sees until
   somebody re-exports, re-runs four builders and commits 251
   files. This is the route that makes the row the page.

   ---- why the segments are named [section]/[slug]/[lesson] ----

   Because App Router will not have two different dynamic names at
   one level of a tree, and `/insights/<slug>` already claims
   `[section]/[slug]`. `[school]/[stage]/[lesson]` beside it is
   "You cannot use different slug names for the same dynamic
   path", at build time, for the whole app. So the two routes
   share the first two names and this one reads them as the school
   and the stage. The awkwardness is in the folder names alone:
   nothing below calls a school a section.

   ---- what answers here, and what does not ----

   Nothing, yet. `NEXT_ROUTES` in `worker.js` does not list any
   school address, so every one of the 251 files still answers and
   this route is reachable only on the branch preview Cloudflare
   builds for the pull request. That is the arrangement Stage 11
   has used since 11.1 and the reason `check-preview.ts` exists:
   a route can be written, deployed against the real database and
   asked real questions before anything forwards a reader to it.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stageUrl } from "@reiad/shared/schools";
import { getLesson } from "../../../../lib/school";
import { siteOrigin } from "../../../../lib/article";
import { schoolIcon } from "../../../../lib/school-icons";
import { SiteScripts } from "../../../../components/scripts";
import { Keep } from "../../../../components/keep";
import { LessonTick } from "../../../../components/progress";
import { Eyebrow } from "../../../../components/ui/label";

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
      images: [{ url: `${origin}/og/${look.og}${stage.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { section, slug, lesson } = await params;
  const found = await getLesson(section, slug, lesson);
  if (!found) notFound();

  const { school, look, stage, stages, lesson: it, body, prev, next } = found;

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

          {/* The same row a piece carries under its byline, and
              the same two questions, so a reader who learned them
              on an article does not have to find them again here.
              Nothing is rendered signed out, and nothing at all
              on a lesson that has not been written: there is
              nothing to keep. */}
          {soon ? null : (
            <Keep url={it.url} title={String(it.bn)} kind="lesson" />
          )}

          {soon ? (
            <>
              <p className="soon-note">{look.words.soon[0]}</p>
              <p>{look.words.soon[1]}</p>
            </>
          ) : (
            /* The lesson's own HTML, written in the Studio and
               sanitised on the way into the row by
               `functions/_lib/sanitise.ts`. Rendered rather than
               escaped for the same reason an article's body is:
               it is the writing. */
            <div dangerouslySetInnerHTML={{ __html: body }} />
          )}

          {/* The tick, and only for the school whose progress is
              React. The other three keep their own module, which
              reads the data attributes on the <article> above and
              has since these were files.

              It is a button and not an arrival. The money school
              used to mark a lesson read the moment the page
              opened, which counted every reader who arrived,
              saw it was the wrong lesson and left. Opening moves
              the bookmark; finishing is something you say. */}
          {school === "money" && !soon ? (
            <LessonTick
              school={school} id={it.id} title={String(it.bn)} stage={stage.slug}
              url={it.url}
              words={{ done: "পড়া হয়েছে", notDone: "পড়া হয়েছে চিহ্ন দিন" }}
            />
          ) : null}

          <p className="backlink">
            <a href={stageUrl(school, stage)}>{look.words.backlink(stage)}</a>
            {alt ? <a className="backlink-alt" href={alt.url}>{alt.label}</a> : null}
          </p>
        </article>

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
      {/* The school's own script, and the one every school
          shares. Rendered by the page rather than by the shell,
          because the ladder page beside this one loads a
          different pair and the shell cannot tell them apart.

          `/checkpoints.js` goes on every lesson of every school,
          including the money school's, whose page-level tick is
          React and whose checkpoints are not: a checkpoint lives
          inside a body that arrived as HTML from the database,
          which React renders and does not own. */}
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

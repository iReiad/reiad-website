/* Two pages answer at `/<first>/<second>`, and this file is the one route
   Next can be given for them. A section is insights, cooking or travel
   and the page is an article; a school is money, deutsch, quran or
   english and the page is a stage's ladder. `isSchool()` is the whole
   test and the two can never collide.

   A server component, and only a server component: there is no
   "use client" anywhere in this app and there should not be one on a
   reading page. That is not the same as shipping no JavaScript: the App
   Router sends its runtime and router to every page whatever the tree
   contains and there is no supported way to stop it. What being
   server-only buys is that none of that cost grows with this file.

   `article.body` has been through `sanitize()` twice before it reaches
   this line, in the editor and again on the server. It is stored as HTML
   and there is no version of it that is not: parsing it into React
   elements here would be a third implementation of the article's
   vocabulary, which the three-place rule in CLAUDE.md exists to
   prevent. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dateLabel, headFacts, lookFor } from "@reiad/shared/look";
import { isSchool } from "@reiad/shared/schools";
import { getArticle, siteOrigin } from "../../../lib/article";
import { Comments } from "@/components/comments";
import { Engage } from "@/components/engage";
import { Keep } from "@/components/keep";
import { ReadAloud } from "@/components/read-aloud";
import { Where } from "@/components/where";
import { StagePage, stageMeta } from "@/components/stage-page";
import { Eyebrow } from "../../../components/ui/label";

type Params = { params: Promise<{ section: string; slug: string }> };

/* Every tag in here is the same fact the Worker's own renderer
   states, out of the same function. What Next writes them as is
   Next's business; that they say the same thing is checked by
   next/parity.test.ts, tag by tag. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section, slug } = await params;
  if (isSchool(section)) return stageMeta(section, slug);

  const article = await getArticle(section, slug);
  if (!article) return {};

  const f = headFacts(article, siteOrigin());

  return {
    title: f.title,
    description: article.dek,
    alternates: { canonical: f.url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      url: f.url,
      siteName: "Reiad's Library",
      locale: f.locale,
      images: [{
        url: f.image,
        type: f.type,
        // Declared only for the two kinds of image known to be
        // 1200x630: a section's own card, and one the Studio drew.
        ...(f.sized ? { width: 1200, height: 630 } : {}),
      }],
    },
    twitter: { card: "summary_large_image", images: [f.image] },
    other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
  };
}

export default async function ReadingPage({ params }: Params) {
  const { section, slug } = await params;
  if (isSchool(section)) return <StagePage section={section} slug={slug} />;

  const article = await getArticle(section, slug);
  if (!article) notFound();

  const look = lookFor(article.section);
  const { jsonLd } = headFacts(article, siteOrigin());

  return (
    <main id="main">
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <article className="wrap article" data-slug={article.slug}>
        <Eyebrow>{article.tag}</Eyebrow>
        <h1>{article.title}</h1>
        {article.dek ? <p className="lede">{article.dek}</p> : null}
        {/* No separator elements: `@layer article` draws one as
            `::after` on every child but the last, so a byline
            that wraps cannot leave a dot dangling at the end of a
            line, which is what it did on a phone. */}
        <p className="byline mono">
          <span>Rony Reiad</span>
          <time dateTime={article.published_at}>{dateLabel(article)}</time>
          <span>{look.minutes(article.minutes)}</span>
        </p>

            {/* ONE ROW, WITH THE BYLINE, NOT TWO BANDS UNDER IT. Keeping a
                piece and hearing it are facts about the piece in the same
                way its length is, so they belong on the line that already
                states those.

                Each still renders nothing when it is not available:
                `<Keep>` needs an account and `<ReadAloud>` needs a browser
                that can speak, so an empty row costs a reader nothing.

                `<Keep>`'s address is the canonical one rather than the one
                the reader happens to be at: this route answers at both
                forms, and `public.library` is one row per person per
                PAGE. */}
        <div className="piece-tools">
          <Keep url={`${look.mount}${article.slug}.html`}
                title={article.title} kind="piece" />
          <ReadAloud />
              {/* How far down this piece the reader had got, and one
                  control back to it, which is there only when there is
                  somewhere to go. It records either way, so it is rendered
                  on every piece rather than conditionally.

                  The canonical address, like `<Keep>` above: a position
                  filed under two spellings is two positions. */}
          <Where url={`${look.mount}${article.slug}.html`} />
        </div>

        <div dangerouslySetInnerHTML={{ __html: article.body }} />

        <div className="note">{look.note}</div>

            {/* Reactions and the question box, before the prev/next pair.

                INSIGHTS ONLY, because that is what `app.js` did: it
                imported the module on `/insights/` and nowhere else, so a
                cooking or travel piece has never had either. Said here
                rather than inside the component, so turning it on for the
                other two is a line in a route. */}
        {article.section === "insights" ? <Engage slug={article.slug} /> : null}

        <div className="prev-next">
          <a data-cue="prev" href={look.back.url}>
            <span className="mono">{look.back.kicker}</span>
            <strong>{look.back.label}</strong>
          </a>
          <a data-cue="next" href={look.side.url}>
            <span className="mono">{look.side.kicker}</span>
            <strong>{look.side.label}</strong>
          </a>
        </div>
      </article>

          {/* The thread, a client component. Still allowed to fail and
              still allowed to be empty: a piece with a broken thread reads
              perfectly and has no thread. Approved comments are readable
              by anybody; signing in is only needed to add one. */}
      <section className="wrap wrap-narrow comments" id="comments">
        <Comments slug={article.slug} section={article.section} />
      </section>
    </main>
  );
}

/* ============================================================
   The article itself.

   A server component, and only a server component: there is no
   "use client" anywhere in this app and there should not be one on
   a reading page.

   That is not the same as shipping no JavaScript, and it is worth
   being exact about the difference because the plan originally
   asked for the second thing. The App Router sends its runtime and
   router to every page whatever the tree contains, about 170 KB
   gzipped, and there is no supported way to stop it. That cost was
   measured and accepted; see Stage 10 in archive/TRANSITION.md. What being
   server-only buys is that none of the cost grows with this file,
   and that the page is complete before any of it runs.

   ---- the body, and why it is set as HTML ----

   `article.body` has been through `sanitize()` twice before it
   reaches this line: once in the editor on the way in, and once
   by `functions/_lib/sanitise.ts` on the server before the row was
   written. It is stored as HTML and there is no version of it that
   is not. Parsing it into React elements here would be a third
   implementation of the article's vocabulary, which is the exact
   thing the three-place rule in CLAUDE.md exists to prevent.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dateLabel, headFacts, lookFor } from "@reiad/shared/look";
import { getArticle, siteOrigin } from "../../../lib/article";
import { SiteScripts } from "../../../components/scripts";
import { Eyebrow } from "../../../components/ui/label";

type Params = { params: Promise<{ section: string; slug: string }> };

/* Every tag in here is the same fact the Worker's own renderer
   states, out of the same function. What Next writes them as is
   Next's business; that they say the same thing is checked by
   next/parity.test.mjs, tag by tag. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section, slug } = await params;
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

export default async function ArticlePage({ params }: Params) {
  const { section, slug } = await params;
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
        <p className="byline mono">
          <span>Rony Reiad</span><span className="dot" />
          <time dateTime={article.published_at}>{dateLabel(article)}</time>
          <span className="dot" />
          <span>{look.minutes(article.minutes)}</span>
        </p>

        <div dangerouslySetInnerHTML={{ __html: article.body }} />

        <div className="note">{look.note}</div>

        <div className="prev-next">
          <a href={look.back.url}>
            <span className="mono">{look.back.kicker}</span>
            <strong>{look.back.label}</strong>
          </a>
          <a href={look.side.url}>
            <span className="mono">{look.side.kicker}</span>
            <strong>{look.side.label}</strong>
          </a>
        </div>
      </article>

      {/* The thread. Empty in the markup and filled by comments.js,
          which is loaded lazily and allowed to fail: a piece with a
          broken thread reads perfectly and has no thread, which is
          rule 8 in archive/TRANSITION.md. Approved comments are readable by
          anybody; signing in is only needed to add one. */}
      <section className="wrap wrap-narrow comments" id="comments"
               data-slug={article.slug} data-section={article.section} />

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html:
          `const host=document.getElementById("comments");`
          + `if(host){import("/comments.js")`
          + `.then((m)=>m.mountComments(host,{slug:host.dataset.slug,`
          + `section:host.dataset.section})).catch(()=>{})}` }}
      />

      {/* Keeping this piece, and writing a note on it. Loaded
          through SiteScripts rather than as a tag for the reason
          `components/scripts.tsx` is entirely about: it appends
          nodes to markup React has just adopted, and a module
          that runs before hydration has its work undone by it.

          It appends nothing at all when nobody is signed in,
          which is the whole of how this feature announces
          itself. */}
      <SiteScripts srcs={["/keep.js"]} />
    </main>
  );
}

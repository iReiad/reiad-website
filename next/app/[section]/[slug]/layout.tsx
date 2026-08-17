/* ============================================================
   The root layout for everything under two dynamic segments,
   which today is an article and a school lesson.

   It sits under both segments on purpose: `<html lang>` and the
   class on `<body>` are facts about the thing being read, and a
   layout only ever receives its own segment's params. A layout at
   `app/layout.tsx` would know neither.

   ---- why one file answers for both ----

   Because there can only be one. A layout in
   `[section]/[slug]/[lesson]/` is NESTED inside this one, so a
   lesson would get two `<html>` elements, one from each, and this
   one would 404 the request before the inner one drew anything:
   it read the row for `/quran/dhap-1`, found no article and
   called `notFound()`, so a lesson page that rendered perfectly
   was thrown away and this site's 404 was returned in its place.
   That is Stage 11.7's first bug and it was invisible from the
   outside: the route was right, the data was right, and the
   answer was 404.

   The two branches never overlap. A section is insights, cooking
   or travel; a school is learn, deutsch, quran or english. The
   first segment says which, and `isSchool()` is the whole test.

   Everything a page of this site carries whatever is written on
   it, the head, the header and the footer, is in
   `components/shell.tsx` and shared with the three reading hubs.
   This file says only what each kind of page adds.
   ============================================================ */

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { lookFor } from "@reiad/shared/look";
import { isSchool } from "@reiad/shared/schools";
import { SiteShell } from "../../../components/shell";
import { SiteScripts } from "../../../components/scripts";
import { getArticle } from "../../../lib/article";
import { LOOKS } from "../../../lib/school";

export default async function ReadingLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;

  if (isSchool(section)) return <SchoolShell school={section}>{children}</SchoolShell>;

  const article = await getArticle(section, slug);
  if (!article) notFound();

  const look = lookFor(article.section);

  return (
    <SiteShell
      lang={article.lang}
      bodyClass={look.bodyClass}
      skip={look.skip}
      footer={look.footer}
      current={article.section === "insights" ? "insights"
        : article.section === "cooking" ? "cooking" : "travel"}
      beforeMain={<div className="read-progress" aria-hidden="true" />}
      scripts={<SiteScripts srcs={[{ src: "/read-aloud.js", classic: true }]} />}
    >
      {children}
    </SiteShell>
  );
}

/** The shell a school's pages carry.

    Exported, because the school's front page answers one segment
    up at `[section]/index.html` and needs the same one. A second
    copy of it is how a school ends up with two footers that
    disagree.

    Everything here is a fact about the school rather than about
    the lesson, which is why it can be decided one segment above
    the lesson: the language, the stylesheet layer the body class
    turns on, which nav link is marked, the footer note and the
    school's own script. `LOOKS` in `lib/school.ts` holds all
    five, beside the wording the page itself uses. */
export function SchoolShell({ school, children }: { school: string; children: ReactNode }) {
  const look = LOOKS[school];

  return (
    <SiteShell
      lang="bn"
      bodyClass={look.bodyClass}
      current={look.current}
      footer={look.footer}
      skip="মূল লেখায় যান"
      /* Only the script every page of the school loads. The one
         a particular KIND of page loads is not here and cannot
         be: a lesson loads `/quran/dars.js` and its stage's
         ladder loads `/quran/dhap.js`, and a layout two segments
         up cannot tell which of the two it is wrapping. Each page
         renders its own, which puts it between the main content
         and the footer rather than after it: both are module
         scripts, so the position changes nothing and the
         alternative is a shell that guesses.

         The money school is the one with a shell script, and it
         is the modal term reader rather than anything to do with
         progress: `/learn/learn.js` is what makes a `.term` link
         open the glossary in a panel instead of navigating away.
         Its progress moved to `components/progress.tsx` with the
         hub. */
      scripts={
        <>
          {school === "learn" ? <ModalReader /> : null}
          {look.shellScript ? <SiteScripts srcs={[look.shellScript]} /> : null}
        </>
      }
    >
      {children}
    </SiteShell>
  );
}

/** The money school's reader, which `/learn/learn.js` fills.

    Its eighteen term pages open one another inside this panel
    rather than navigating away, which is most of why they read
    the way they do, and the script needs the markup to be in the
    page to find it. */
function ModalReader() {
  return (
    <div id="reader" hidden role="dialog" aria-modal="true" aria-label="Term reader">
      <div className="reader-panel">
        <div className="reader-bar">
          <button className="icon-btn" id="reader-back" hidden aria-label="আগের লেখায় ফিরুন">
            ← ফিরুন
          </button>
          <a id="reader-full" className="mono" href="#">পুরো পেজে পড়ুন ↗</a>
          <button className="icon-btn" id="reader-close" aria-label="বন্ধ করুন">✕</button>
        </div>
        <div className="reader-body" id="reader-body" />
      </div>
    </div>
  );
}

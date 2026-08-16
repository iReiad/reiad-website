/* ============================================================
   The root layout, which is also the article's layout.

   It sits under both dynamic segments on purpose: `<html lang>`
   and the class on `<body>` are facts about the piece, and a
   layout only ever receives its own segment's params. A layout at
   `app/layout.tsx` would know neither.

   Everything a page of this site carries whatever is written on
   it, the head, the header and the footer, is in
   `components/shell.tsx` and shared with the three reading hubs.
   This file says only what an article page adds: the reading
   progress bar and read-aloud, and which of the two the shell
   needs from the row.
   ============================================================ */

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { lookFor } from "@reiad/shared/look";
import { SiteShell } from "../../../components/shell";
import { getArticle } from "../../../lib/article";

export default async function ArticleLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const article = await getArticle(section, slug);
  if (!article) notFound();

  const look = lookFor(article.section);

  return (
    <SiteShell
      lang={article.lang}
      bodyClass={look.bodyClass}
      skip={look.skip}
      footer={look.footer}
      current={article.section === "insights" ? "insights" : "in-skills"}
      beforeMain={<div className="read-progress" aria-hidden="true" />}
      scripts={<script src="/read-aloud.js" defer />}
    >
      {children}
    </SiteShell>
  );
}

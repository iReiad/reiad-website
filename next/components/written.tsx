/* ============================================================
   written.tsx: a page whose body is writing rather than data.

   The four schools' hubs and the money school's full index are
   prose. They were written by hand, they say what a course asks
   of a learner every evening, and nothing about them comes out of
   a database. `lib/school-hubs.ts` holds each one's body exactly
   as the committed page has it, and `scripts/build-school-hubs.mjs`
   explains at length why it is copied rather than rewritten as
   JSX: eight hundred lines of hand-converted Bangla is eight
   hundred chances to change a word that nobody reviewing the diff
   would catch, and the reader who would is the one this site is
   written for.

   What React owns here is everything around the writing: the
   head, the header, the footer, the shell. That is the same
   division the article route already has, where the body is HTML
   out of a row and the page around it is components.
   ============================================================ */

import type { Metadata } from "next";
import type { SchoolHub } from "../lib/school-hubs";

/** The head, stated exactly as the committed page states it.

    Read out of that page rather than retyped, so a share card or
    a canonical link cannot quietly change in the move. */
export function writtenMetadata(page: SchoolHub | undefined): Metadata {
  if (!page) return {};
  const { head } = page;

  return {
    title: head.title,
    description: head.description,
    alternates: { canonical: head.canonical },
    openGraph: {
      /* The committed pages state either "website" or "article"
         and nothing else, so the narrowing is honest rather than
         a cast that hides a third value. */
      type: head.ogType === "article" ? "article" : "website",
      title: head.title,
      description: head.description,
      url: head.canonical,
      siteName: "Reiad's Library",
      images: [{ url: head.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
  };
}

/** The page itself: the writing, and the school's own scripts.

    The scripts are rendered by the page rather than by the shell
    for the same reason a lesson's are: the shell cannot tell a
    hub from a ladder from a lesson, and each of the three loads
    something different. */
export function writtenPage(page: SchoolHub | undefined) {
  if (!page) return null;

  return (
    <>
      <main id="main">
        <div className="wrap" dangerouslySetInnerHTML={{ __html: page.body }} />
      </main>
      {page.scripts.map((src) => (
        <script key={src} type="module" src={src} />
      ))}
    </>
  );
}

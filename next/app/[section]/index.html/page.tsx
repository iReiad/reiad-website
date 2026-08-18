/* ============================================================
   Three kinds of index page share this address.

   `/cooking/index.html` and `/travel/index.html` are the Bangla
   reading hubs, built from the database.

   `/money/index.html` is the money school's front page, built
   from its rows: the ladder, the starter guide and how much of
   each a reader has done. archive/TRANSITION.md Stage 11.8.

   `/deutsch/index.html`, `/quran/index.html` and
   `/english/index.html` are still the three hand-written pages
   copied verbatim into `lib/school-hubs.ts`. They follow the
   money school, one at a time, and until they do this route
   answers for both shapes.

   A section and a school never collide: a section is insights,
   cooking or travel, and a school is learn, deutsch, quran or
   english.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSchool } from "@reiad/shared/schools";
import { ReadHub } from "../../../components/hub";
import { MoneyHub } from "../../../components/school-hub";
import { READ_HUB } from "../../../lib/hub";
import { hubMetadata } from "../../../lib/metadata";
import { piecesIn } from "../../../lib/pieces";
import { SCHOOL_HUBS } from "../../../lib/school-hubs";
import { getSchool } from "../../../lib/school";
import { siteOrigin } from "../../../lib/article";
import { writtenPage, writtenMetadata } from "../../../components/written";

type Params = { params: Promise<{ section: string }> };

/** The one school rendered from its rows, today. */
const BUILT = new Set(["money"]);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;

  if (BUILT.has(section)) {
    const origin = siteOrigin();
    return {
      title: "টাকা ও শেয়ার · বাংলায় বিনিয়োগ শিক্ষা · Reiad's Library",
      description: "একদম শুরু থেকে: বাংলাদেশে বিনিয়োগ শুরু করার আট ধাপের হাতেখড়ি, তারপর ভিত্তি "
        + "থেকে গবেষণা পর্যন্ত সাজানো ধাপ, সবটাই সহজ বাংলায়।",
      alternates: { canonical: `${origin}/money/index.html` },
      openGraph: {
        type: "website",
        title: "টাকা ও শেয়ার · Money",
        description: "বাংলাদেশে বিনিয়োগ শেখার পুরো পথ, একদম শুরু থেকে, বাংলায়।",
        url: `${origin}/money/index.html`,
        siteName: "Reiad's Library",
        locale: "bn_BD",
        images: [{ url: `${origin}/og/learn.png`, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", images: [`${origin}/og/learn.png`] },
    };
  }

  if (isSchool(section)) return writtenMetadata(SCHOOL_HUBS[section]);
  return READ_HUB[section] ? hubMetadata(section) : {};
}

export default async function IndexPage({ params }: Params) {
  const { section } = await params;

  if (BUILT.has(section)) {
    const school = await getSchool(section);
    /* No database, no hub. The written copy is gone, so there is
       nothing to fall back to and a 404 is the honest answer; the
       Worker turns that into this site's own 404 page rather than
       a framework one. */
    if (!school) notFound();
    return <MoneyHub school={school} />;
  }

  if (isSchool(section)) return writtenPage(section, SCHOOL_HUBS[section]);

  const copy = READ_HUB[section];
  if (!copy) notFound();

  return <ReadHub copy={copy} pieces={await piecesIn(section)} />;
}

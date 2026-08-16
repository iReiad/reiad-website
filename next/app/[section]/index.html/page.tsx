/* ============================================================
   Two kinds of index page share this address.

   `/cooking/index.html` and `/travel/index.html` are the Bangla
   reading hubs, built from the database.

   `/learn/index.html`, `/deutsch/index.html`,
   `/quran/index.html` and `/english/index.html` are the four
   schools' front pages, and they are neither built nor
   generated: they are prose, written by hand, and the one live
   thing on them is the ladder, which `hub.js` draws in the
   browser from the reader's own progress. Their writing is
   copied verbatim into `lib/school-hubs.ts` by a generator, for
   the reason that file gives at length, and rendered here inside
   the same shell every other page of this site uses.

   A section and a school never collide: a section is insights,
   cooking or travel, and a school is learn, deutsch, quran or
   english.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSchool } from "@reiad/shared/schools";
import { ReadHub } from "../../../components/hub";
import { READ_HUB } from "../../../lib/hub";
import { hubMetadata } from "../../../lib/metadata";
import { piecesIn } from "../../../lib/pieces";
import { SCHOOL_HUBS } from "../../../lib/school-hubs";
import { writtenPage, writtenMetadata } from "../../../components/written";

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  if (isSchool(section)) return writtenMetadata(SCHOOL_HUBS[section]);
  return READ_HUB[section] ? hubMetadata(section) : {};
}

export default async function IndexPage({ params }: Params) {
  const { section } = await params;

  if (isSchool(section)) return writtenPage(SCHOOL_HUBS[section]);

  const copy = READ_HUB[section];
  if (!copy) notFound();

  return <ReadHub copy={copy} pieces={await piecesIn(section)} />;
}

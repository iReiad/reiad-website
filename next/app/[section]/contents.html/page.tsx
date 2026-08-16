/* ============================================================
   /learn/contents.html, the money school's full index.

   Not a hub and not a ladder: it is the one page whose entire job
   is being a complete list of every lesson in the school. The
   note in `build-lessons.mjs` says why it is written out in full
   rather than built by JavaScript, and that reasoning is why it
   is copied here verbatim rather than rebuilt from the rows: it
   should still be a complete list with scripts off, and a search
   engine should see every title.

   A static segment beside `index.html` under `[section]`, so it
   answers only where a school has one. Today that is the money
   school alone, which is why anything else here is a 404 and
   falls through to the asset router.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SCHOOL_HUBS } from "../../../lib/school-hubs";
import { writtenPage, writtenMetadata } from "../../../components/written";

type Params = { params: Promise<{ section: string }> };

const pageFor = (section: string) => SCHOOL_HUBS[`${section}/contents`];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  return writtenMetadata(pageFor(section));
}

export default async function ContentsPage({ params }: Params) {
  const { section } = await params;
  const page = pageFor(section);
  if (!page) notFound();
  return writtenPage(page);
}

/* ============================================================
   /learn/contents.html, the money school's full index.

   A static segment beside `index.html` under `[section]`, so it
   answers only where a school has one. Today that is the money
   school alone, which is why anything else here is a 404 and
   falls through to the asset router.

   Built from the rows since TRANSITION.md Stage 11.8. It was a
   hand-written page, then a hand-written string, and the whole
   value of a complete list is that it is complete: see the note
   at the top of `components/school-contents.tsx`.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolContents } from "../../../components/school-contents";
import { getSchool } from "../../../lib/school";
import { siteOrigin } from "../../../lib/article";

type Params = { params: Promise<{ section: string }> };

const HAS_CONTENTS = new Set(["learn"]);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  if (!HAS_CONTENTS.has(section)) return {};

  const origin = siteOrigin();
  const url = `${origin}/learn/contents.html`;

  return {
    title: "সব লেখা · টাকা ও শেয়ার · Reiad's Library",
    description: "টাকা ও শেয়ার স্কুলের প্রতিটা ধাপের প্রতিটা লেখা, এক পাতায়, পড়ার ক্রম অনুযায়ী।",
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: "সব লেখা · টাকা ও শেয়ার",
      description: "প্রতিটা ধাপের প্রতিটা লেখা, এক পাতায়।",
      url,
      siteName: "Reiad's Library",
      locale: "bn_BD",
      images: [{ url: `${origin}/og/learn.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function ContentsPage({ params }: Params) {
  const { section } = await params;
  if (!HAS_CONTENTS.has(section)) notFound();

  const school = await getSchool(section);
  if (!school) notFound();

  return <SchoolContents school={school} />;
}

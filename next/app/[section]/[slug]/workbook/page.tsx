/* ============================================================
   /english/<term>/workbook: the English practice book.

   A static segment beside `[lesson]`, which is what stops the
   book being read as a part called "workbook": a static segment
   wins over a dynamic sibling.

   The address is the one the generated file had, less the `.html`
   every route lost with task #28. A learner has this bookmarked
   and opens it every evening, so `aab/_redirects` holds a 301 for
   the old spelling.

   Everything else is in `components/workbook-page.tsx`, shared
   with the other school's book.
   ============================================================ */

import type { Metadata } from "next";
import { WorkbookPage, workbookMeta } from "../../../../components/workbook-page";

type Params = { params: Promise<{ section: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section, slug } = await params;
  return workbookMeta(slug, `/${section}/${slug}/workbook`);
}

export default async function Page({ params }: Params) {
  const { section, slug } = await params;
  return <WorkbookPage section={section} slug={slug} />;
}

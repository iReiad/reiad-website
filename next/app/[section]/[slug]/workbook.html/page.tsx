/* ============================================================
   /english/<term>/workbook.html: the English practice book.

   A static segment beside `[lesson]`, which is what stops the
   book being read as a part called "workbook": a static
   segment wins over a dynamic sibling. Same arrangement as
   `index.html` next door.

   The address is the one the generated file had. A learner has
   this bookmarked and opens it every evening; a URL is not a
   thing to tidy while porting the page behind it.

   Everything else is in `components/workbook-page.tsx`, shared
   with the English book, which is called `workbook.html` for the
   same reason: that is what its address has always been.
   ============================================================ */

import type { Metadata } from "next";
import { WorkbookPage, workbookMeta } from "../../../../components/workbook-page";

type Params = { params: Promise<{ section: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section, slug } = await params;
  return workbookMeta(slug, `/${section}/${slug}/workbook.html`);
}

export default async function Page({ params }: Params) {
  const { section, slug } = await params;
  return <WorkbookPage section={section} slug={slug} />;
}

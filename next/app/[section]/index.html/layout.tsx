/* ============================================================
   The two Bangla reading hubs: /cooking/index.html and
   /travel/index.html.

   A static segment under a dynamic one, which is how Next is told
   that `index.html` is a page and `onions.html` is an article: a
   literal segment beats `[slug]` at the same level, so the two
   never compete for a request. It also means this layout is
   handed `params.section`, which the alternative, a top-level
   `app/cooking/` directory, would have got by hard-coding.

   Insights is not one of these. Its index is at `/insights.html`,
   one segment up, and `/insights/index.html` is an address
   nothing on this site has ever produced, so it is a 404 here
   exactly as it is today.
   ============================================================ */

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { lookFor } from "@reiad/shared/look";
import { SiteShell } from "../../../components/shell";
import { HUB_META, READ_HUB } from "../../../lib/hub";

export default async function ReadHubLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!READ_HUB[section]) notFound();

  const look = lookFor(section);

  return (
    <SiteShell
      lang={HUB_META[section].lang}
      bodyClass={look.bodyClass}
      skip={look.skip}
      footer={look.footer}
      current="in-skills"
    >
      {children}
    </SiteShell>
  );
}

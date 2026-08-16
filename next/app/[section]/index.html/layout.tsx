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

   Since Stage 11.7 the four schools' front pages answer here too,
   and they need a different shell: their own language, their own
   stylesheet layer, the Skills link marked rather than their own,
   and their own footer. `SchoolShell` in the layout one segment
   down holds all of that, and this borrows it rather than keeping
   a second copy, because a school whose hub and whose lessons
   disagree about the footer is exactly the drift these ports keep
   producing.
   ============================================================ */

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { lookFor } from "@reiad/shared/look";
import { SiteShell } from "../../../components/shell";
import { isSchool } from "@reiad/shared/schools";
import { HUB_META, READ_HUB } from "../../../lib/hub";
import { SchoolShell } from "../[slug]/layout";

export default async function ReadHubLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (isSchool(section)) return <SchoolShell school={section}>{children}</SchoolShell>;
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

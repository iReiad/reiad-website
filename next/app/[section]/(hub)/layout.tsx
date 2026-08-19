/* ============================================================
   The two Bangla reading hubs: /cooking and
   /travel.

   `(hub)` is a route group, so this answers at `/<section>` and
   the parentheses are not in the address. It has to be a group
   rather than the `[section]` directory itself: a layout there
   would wrap `[slug]` and `contents` as well, and every one of
   those already renders an `<html>` of its own.

   It also means this layout is handed `params.section`, which the
   alternative, a top-level `app/cooking/` directory, would have
   got by hard-coding.

   Insights is not one of these. Its index is a route of its own
   at `/insights`, a static segment which beats `[section]`.

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
      current={section === "cooking" ? "cooking" : "travel"}
    >
      {children}
    </SiteShell>
  );
}

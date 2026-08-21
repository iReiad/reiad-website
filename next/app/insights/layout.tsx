/* ============================================================
   The Insights hub, at the address every link on this site uses.

   A directory called `insights.html` looks odd and is exactly
   right: every URL on this site ends in `.html`, the canonical
   link says so, and Stage 10 has already been bitten once by a
   route that answered the extensionless form and 404ed at the
   real one. The segment is the address, written out.

   This is the root layout for its own branch: the topmost layout
   above a page is that page's root, which is why `<html>` and
   `<body>` are in here rather than in one at the root of
   `next/app/`, which would have to be right for the articles too.
   ============================================================ */

import type { ReactNode } from "react";
import { lookFor } from "@reiad/shared/look";
import { SiteShell } from "../../components/shell";
import { HUB_META } from "../../lib/hub";

export default function InsightsHubLayout({ children }: { children: ReactNode }) {
  const look = lookFor("insights");

  return (
    <SiteShell
      lang={HUB_META.insights.lang}
      bodyClass={look.bodyClass}
      skip="Skip to the main content"
      footer={look.footer}
      current="insights"
    >
      {children}
    </SiteShell>
  );
}

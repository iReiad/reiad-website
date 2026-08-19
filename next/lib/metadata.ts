/* ============================================================
   metadata.ts: the head of a hub page.

   One function for all three, because the three pages it replaces
   stated the same tags in the same order with different words in
   them, and because `scripts/check-preview.ts` compares those
   tags against the live site one at a time. A tag that only two
   of the three carry is how a share card quietly stops having a
   size on one section.

   The article route builds its head from `headFacts()` in
   `shared/look.ts` instead: that one has to agree with the
   Worker's own renderer, tag for tag, and this one has nothing on
   the other side to agree with.
   ============================================================ */

import type { Metadata } from "next";
import { hubFacts } from "./hub";
import { siteOrigin } from "./article";

export function hubMetadata(section: string): Metadata {
  const { meta, url, image } = hubFacts(section, siteOrigin());

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: meta.ogTitle,
      description: meta.ogDescription,
      url,
      siteName: "Reiad's Library",
      /* Only Insights states one, which is what the page it
         replaces does. A tag added here is a difference from the
         live site, and check-preview.ts reports it as one. */
      ...(meta.locale ? { locale: meta.locale } : {}),
      // Both section cards are drawn at 1200x630 and committed.
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
  };
}

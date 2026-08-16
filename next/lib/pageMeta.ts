/* ============================================================
   pageMeta.ts: the head of a hand-written page.

   The hubs have `hubMetadata()`, which is one function over a
   table because the three of them state the same tags with
   different words. These pages are not a set: they each say one
   thing about themselves and there is no table to keep. What they
   do share is the shape, and writing that shape out sixteen times
   is how one page ends up without an `og:image:height`.

   So each page passes its own words and this puts them in the
   same order, with the same defaults, against the same origin.
   ============================================================ */

import type { Metadata } from "next";
import { siteOrigin } from "./article";

export function pageMeta({
  path, title, description, ogTitle, ogDescription, card, locale = "en_GB",
}: {
  /** The address, with its `.html`, as the canonical link says it. */
  path: string;
  title: string;
  description: string;
  /** Shorter than the <title> on every one of these pages. */
  ogTitle: string;
  ogDescription?: string;
  /** The 1200x630 card in `/og/`, by name. */
  card: string;
  /** Only the two Bangla pages say anything but en_GB. */
  locale?: string;
}): Metadata {
  const origin = siteOrigin();

  return {
    title,
    description,
    alternates: { canonical: `${origin}${path}` },
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription ?? description,
      url: `${origin}${path}`,
      siteName: "Reiad's Library",
      locale,
      images: [{ url: `${origin}/og/${card}.png`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
  };
}

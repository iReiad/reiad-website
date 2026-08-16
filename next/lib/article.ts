/* ============================================================
   article.ts: one article, out of D1.

   `getCloudflareContext()` is how a Next route reaches a Worker
   binding under @opennextjs/cloudflare. The binding is the same
   `DB` the rest of the site uses, pointed at the same database by
   `next/wrangler.jsonc`, so this route reads exactly what the
   Studio wrote and what the Worker's own renderer reads.

   `cache()` is React's per-request memo, and it is here for a
   specific reason: the layout and the page both need the article,
   and generateMetadata needs it a third time. Without it that is
   three identical queries per page view.
   ============================================================ */

import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isSection, type Article } from "@reiad/shared/look";

/** Anything that is not a plausible slug is not ours to answer. */
const PLAUSIBLE = /^[a-z0-9-]{1,80}$/i;

export const getArticle = cache(
  async (section: string, slug: string): Promise<Article | null> => {
    if (!isSection(section) || !PLAUSIBLE.test(slug)) return null;

    const { env } = getCloudflareContext();
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return null;

    const row = await db
      .prepare("SELECT * FROM articles WHERE slug = ? AND status = 'live'")
      .bind(slug.replace(/\.html$/, ""))
      .first<Article>();

    if (!row) return null;

    /* A piece answers at its own section's mount and nowhere else.
       Without this, moving a piece from Insights to the kitchen
       would leave it live at both URLs: two pages of identical text
       competing with each other in search results, and a link
       somebody already shared quietly becoming the wrong one. */
    if ((row.section || "insights") !== section) return null;

    return row;
  }
);

/** The origin to write into canonical links and card URLs. Taken
    from the same variable the Worker reads, so a preview
    deployment does not advertise itself as reiad.co.uk. */
export function siteOrigin(): string {
  const { env } = getCloudflareContext();
  return (env as { SITE_ORIGIN?: string }).SITE_ORIGIN || "https://reiad.co.uk";
}

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

/* Every URL on this site ends in `.html`: `pieceUrl()` in
   content.js builds `/insights/<slug>.html`, and that is what the
   canonical link says, what the sitemap lists, what every internal
   link points at and what anybody has ever shared.

   THE BUG THIS ORDER FIXES

   The suffix used to be stripped after the guard rather than
   before it, so `dse-basics.html` failed `PLAUSIBLE` on the dot,
   answered 404, and every article published through the Studio
   would have 404ed at its own address the moment the service
   binding was added. The extensionless form worked, which is why
   the first version of the parity test did not catch it: it asked
   for the one form nothing on this site uses. */
const bareSlug = (slug: string) => decodeURIComponent(slug).replace(/\.html$/i, "");

export const getArticle = cache(
  async (section: string, slug: string): Promise<Article | null> => {
    /* Lowercased, because the Worker's own route does
       (`article[1].toLowerCase()`) and a piece must not answer
       differently depending on how somebody typed the URL. */
    const mount = String(section).toLowerCase();
    const wanted = bareSlug(slug);
    if (!isSection(mount) || !PLAUSIBLE.test(wanted)) return null;

    const { env } = getCloudflareContext();
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return null;

    const row = await db
      .prepare("SELECT * FROM articles WHERE slug = ? AND status = 'live'")
      .bind(wanted)
      .first<Article>();

    if (!row) return null;

    /* A piece answers at its own section's mount and nowhere else.
       Without this, moving a piece from Insights to the kitchen
       would leave it live at both URLs: two pages of identical text
       competing with each other in search results, and a link
       somebody already shared quietly becoming the wrong one. */
    if ((row.section || "insights") !== mount) return null;

    return row;
  }
);

/** The origin to write into canonical links and card URLs. Taken
    from the same variable the Worker reads, so a preview
    deployment does not advertise itself as reiad.co.uk. */
export function siteOrigin(): string {
  try {
    const { env } = getCloudflareContext();
    return (env as { SITE_ORIGIN?: string }).SITE_ORIGIN || "https://reiad.co.uk";
  } catch {
    /* There is no Cloudflare context outside the Worker, and the
       one place that happens is a plain `next start`, which is how
       the routing itself gets checked without workerd. A head tag
       falling back to the site's own address is the right answer
       there and is what the variable says anyway; a throw would
       take the whole page down to save a string. */
    return "https://reiad.co.uk";
  }
}

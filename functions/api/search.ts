/* ============================================================
   /api/search?q=, search that reads the articles themselves.

   The Ctrl+K palette searches titles from content.js, which is
   fast and works offline but can only find a piece if you already
   know roughly what it's called. This searches the body text too,
   server-side, and returns the matching sentence so you can see
   why something matched.

   The palette falls back to its own title search if this isn't
   available, so nothing breaks without a database.
   ============================================================ */

import { all, db } from "../_lib/db.ts";
import type { DbEnv } from "../_lib/db.ts";
import { methods, notConfigured, ok, str } from "../_lib/http.ts";
import type { RouteContext } from "../_lib/http.ts";
import { textOf } from "../_lib/sanitise.ts";

/* Where each section is served, the same table feeds/[kind].ts
   keeps. A result has to point at the piece's own mount: this used
   to be a template literal with /insights/ in it, whatever the
   piece's section was. */
const MOUNTS: Record<string, string> =
  { insights: "/insights/", cooking: "/cooking/", travel: "/travel/" };

/** The columns the SELECT below names. `body` is the whole article
    and is read only to cut the matching sentence out of it. */
interface Hit {
  slug: string;
  title: string;
  dek: string;
  tag: string;
  section: string;
  body: string;
  published_at: string | null;
}

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function onRequest(context: RouteContext<DbEnv>): Promise<Response> {
  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  return methods(context.request, {
    GET: async () => {
      const q = str(new URL(context.request.url).searchParams.get("q"), 120);
      if (q.length < 2) return ok({ results: [], q });

      const like = `%${q.replace(/[%_]/g, "")}%`;
      const rows = await all<Hit>(d1,
        `SELECT slug, title, dek, tag, section, body, published_at
         FROM articles
         WHERE status = 'live' AND (title LIKE ? OR dek LIKE ? OR body LIKE ?)
         ORDER BY
           CASE WHEN title LIKE ? THEN 0 WHEN dek LIKE ? THEN 1 ELSE 2 END,
           published_at DESC
         LIMIT 20`,
        like, like, like, like, like);

      const re = new RegExp(escapeRe(q), "i");

      const results = rows.map((row) => {
        // Pull the sentence the match sits in, so the reader sees why.
        const text = textOf(row.body);
        const at = text.search(re);
        const snippet = at === -1
          ? row.dek
          : text.slice(Math.max(0, at - 70), at + 130).trim();
        return {
          slug: row.slug,
          title: row.title,
          dek: row.dek,
          tag: row.tag,
          // Its own mount. A kitchen piece answered here with an
          // /insights/ address, which is a search result that 404s.
          url: `${MOUNTS[row.section] ?? "/insights/"}${row.slug}.html`,
          snippet: (at > 70 ? "…" : "") + snippet + (snippet.length >= 195 ? "…" : ""),
        };
      });

      return ok({ q, results });
    },
  });
}

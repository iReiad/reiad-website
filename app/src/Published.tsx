/* ============================================================
   Published.tsx: what is live, and what is wrong with it.

   Read-only here, deliberately. The old desk's Published panel can
   also draw a share card, move a piece between sections and delete
   one, and those move to React with the Studio rather than ahead
   of it: they are the actions where a port going wrong costs
   something, and Stage 9's whole premise is starting where a
   mistake is free.

   What it does carry over is the one thing that flags a real
   problem: a piece whose photo never reached R2 has no share card
   at all, and every link to it shares as the site default.
   ============================================================ */

import type { Article } from "./api.ts";
import { listArticles } from "./api.ts";
import { useRows } from "./useRows.ts";
import { Broken, Count, Empty, Loading, when } from "./bits.tsx";

const isDrawnCard = (cover: string) => /\.jpe?g$/i.test(cover ?? "");

/** What a pasted link will show, when that is worth saying. */
function coverWarning(a: Article): string | null {
  if (a.embedded) return "photo not hosted";
  if (a.cover && !isDrawnCard(a.cover)) return "photo, not a card";
  return null;
}

export function Published({ onToast }: { onToast: (text: string) => void }) {
  void onToast;   // read-only for now: see the note at the top

  const { rows, loading, failed } = useRows<Article>(
    listArticles,
    (reply) => (reply.articles as Article[]) ?? [],
    []
  );

  if (loading) return <Loading />;
  if (failed) return <Broken what="the published list" />;
  if (!rows.length) return <Empty>Nothing published yet.</Empty>;

  const needsCard = rows.filter((a) => coverWarning(a)).length;

  return (
    <>
      <Count>
        {rows.length} piece{rows.length === 1 ? "" : "s"}
        {needsCard ? ` · ${needsCard} with a share card to fix` : " · every share card drawn"}
      </Count>

      <div className="admin-table">
        {rows.map((a) => {
          const warn = coverWarning(a);
          return (
            <div className={`admin-line article-line status-${a.status}`} key={a.slug}>
              <a className="article-title" href={`/${a.section}/${a.slug}.html`}>{a.title}</a>
              <span className="line-facts">
                <span className={`pill section-pill section-${a.section}`}>{a.section}</span>
                <span className="pill">{a.status}</span>
                {warn ? (
                  <span
                    className="pill pill-warn"
                    title={
                      warn === "photo not hosted"
                        ? "Its photo is still inside the article body rather than in R2, "
                          + "so it has no social card and shares as the site default. "
                          + "The old desk's Draw card fixes it."
                        : "Its social card is the photo itself, in a format WhatsApp, "
                          + "Facebook and LinkedIn will not read."
                    }
                  >
                    {warn}
                  </span>
                ) : null}
                <span className="mono muted">{when(a.updated_at)}</span>
              </span>
              <span className="line-actions">
                <a className="chip" href={`/studio.html?edit=${encodeURIComponent(a.slug)}`}>Edit</a>
                <a className="chip" href={`/${a.section}/${a.slug}.html`}
                   target="_blank" rel="noopener">View</a>
              </span>
            </div>
          );
        })}
      </div>

      {needsCard ? (
        <p className="muted" style={{ marginTop: "14px" }}>
          Fixing a share card is still on <a href="/desk.html">the old desk</a>, under
          More → Draw card. It moves here with the Studio.
        </p>
      ) : null}
    </>
  );
}

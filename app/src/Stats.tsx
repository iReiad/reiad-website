/* ============================================================
   Stats.tsx: what the site is being read for.

   A path, a day and a number. That is the whole record, there are
   no cookies behind it, and nothing here can be traced to a
   person. The note at the bottom of the panel says so on the page,
   because a page of figures about readers should have to state
   what it does not know.

   ---- the gap this version closes ----

   The old panel joined paths to titles using the articles table
   only, so anything not written in the Studio was listed as a raw
   path. The most-read page on this site is usually a tool, a
   lesson or a case study, none of which are rows: the top of the
   table read like a server log. `searchIndex()` from content.js
   knows the title of every page on this site, so it is asked
   first and the database second.
   ============================================================ */

import { useMemo, useState } from "react";
import type { Article, Stats as Figures } from "./api.ts";
import { readStats, listArticles } from "./api.ts";
import { useRows } from "./useRows.ts";
import { findSection, pieceUrl, searchIndex } from "./site.ts";
import {
  Broken, Count, Empty, Filters, Loading, SectionLabel, Sparkline, Stat, StatRow,
} from "./bits.tsx";

const RANGES = [
  ["7", "7 days"],
  ["30", "30 days"],
  ["90", "90 days"],
] as const;

export function Stats() {
  const [days, setDays] = useState<"7" | "30" | "90">("30");

  /* Two requests, one loading state. `useRows` is built around a
     list, and this panel is a figure and a list, so the figures
     ride along in `extra` rather than in a second hook with its
     own spinner. */
  const { rows, extra, loading, failed } = useRows<Figures["top"][number]>(
    () => readStats(Number(days)),
    (reply) => (reply.top as Figures["top"]) ?? [],
    [days]
  );

  const { rows: articles } = useRows<Article>(
    listArticles,
    (reply) => (reply.articles as Article[]) ?? [],
    []
  );

  /* Built once per change of either list, not once per row. The
     site's own index first, then the database on top of it, so a
     piece that has been retitled since the page was generated
     shows the title it has now. */
  const titles = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of searchIndex()) map.set(entry.url.split("#")[0], entry.title);
    for (const a of articles) map.set(pieceUrl(findSection(a.section), a.slug), a.title);
    return map;
  }, [articles]);

  const name = (path: string) =>
    titles.get(path) ?? titles.get(`${path}.html`) ?? titles.get(path.replace(/\.html$/, "")) ?? path;

  if (loading) return <Loading />;
  if (failed || !extra) return <Broken what="the figures" />;

  const figures = extra as unknown as Figures;
  const reactions = figures.reactions ?? [];

  return (
    <>
      <Filters options={RANGES} active={days} onPick={setDays} />
      {/* Directly under the range it belongs to, rather than at the
          bottom of the panel where it read as a footnote to the
          reactions table it happened to follow. */}
      <Count>{`Counted since ${figures.since}`}</Count>

      <StatRow>
        <Stat lead k={`Views, ${days} days`} v={figures.total ?? 0} />
        <Stat k="Pages seen" v={rows.length} />
        <Stat k="Busiest day" v={Math.max(0, ...(figures.daily ?? []).map((d) => d.views))} />
      </StatRow>

      <Sparkline daily={figures.daily ?? []} />

      <SectionLabel>Most read</SectionLabel>
      {rows.length ? (
        <div className="admin-table">
          {rows.map((row) => (
            <div className="admin-line" key={row.path}>
              <a href={row.path}>{name(row.path)}</a>
              <span className="mono muted">{row.path}</span>
              <span className="mono">{row.views}</span>
            </div>
          ))}
        </div>
      ) : (
        <Empty>Nothing recorded in this window yet.</Empty>
      )}

      {reactions.length ? (
        <>
          <SectionLabel>Reactions</SectionLabel>
          <div className="admin-table">
            {reactions.map((r) => (
              <div className="admin-line" key={`${r.slug}-${r.kind}`}>
                <span>{name(`/insights/${r.slug}.html`)}</span>
                <span className="mono">{r.kind}</span>
                <span className="mono">{r.count}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <p className="tool-note" style={{ marginTop: "20px" }}>
        A path, a date and a number, that is the entire record. No cookies, no
        visitor identity, nothing shared with anyone.
      </p>
    </>
  );
}

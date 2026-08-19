/* ============================================================
   Subscribers.tsx: the list.

   Three numbers, then the addresses. The three numbers are the
   ones that answer different questions: confirmed is who actually
   receives anything, awaiting confirmation is how many clicked the
   box and never the link, and all time is the two together plus
   everyone who has since gone.

   Nothing here can be edited. Removing somebody from a mailing
   list has to be their decision, taken through the unsubscribe
   link, or the list stops being a record of who asked.
   ============================================================ */

import { useMemo, useState } from "react";
import type { Subscriber } from "./api.ts";
import { listSubscribers } from "./api.ts";
import { useRows } from "./useRows.ts";
import { Button, ButtonLink } from "../../next/components/ui/button.tsx";
import {
  Broken, Count, Empty, Loading, SearchBox, Stat, StatRow, when,
} from "./bits.tsx";

/* The endpoint sends five hundred at most and the browser shows
   fifty at a time. The old desk stopped at a hundred with nothing
   on the page to say that it had, which is the kind of quiet lie
   that makes somebody trust a number they should not. */
const PAGE = 50;

export function Subscribers() {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);

  const { rows, extra, loading, failed } = useRows<Subscriber>(
    listSubscribers,
    (reply) => (reply.subscribers as Subscriber[]) ?? [],
    []
  );

  const counts = (extra?.counts ?? {}) as Record<string, number>;

  const matched = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return rows;
    return rows.filter((s) => s.email.toLowerCase().includes(needle));
  }, [rows, q]);

  const page = matched.slice(0, shown);
  const rest = matched.length - page.length;

  /* A new search starts at the top of its own results rather than
     fifty rows into them. */
  const search = (value: string) => { setQ(value); setShown(PAGE); };

  if (loading) return <Loading />;
  if (failed) return <Broken what="the subscriber list" />;

  return (
    <>
      <StatRow>
        <Stat lead k="Confirmed" v={counts.confirmed ?? 0} />
        <Stat k="Awaiting confirmation" v={counts.pending ?? 0} />
        <Stat k="All time" v={counts.total ?? 0} />
      </StatRow>

      <div style={{ marginTop: "18px" }}>
        <SearchBox id="search-subscribers"
                   placeholder="Search addresses" onSearch={search} />
      </div>

      <div className="row-flex" style={{ margin: "16px 0" }}>
        {/* A real link, not a fetch: the browser saves the file the
            Worker streams, and nothing has to hold five hundred
            addresses in memory to do it. */}
        <ButtonLink href="/api/subscribers/export">Download CSV</ButtonLink>
      </div>

      {matched.length ? (
        <>
          <Count>
            {matched.length === rows.length
              ? `${rows.length} address${rows.length === 1 ? "" : "es"}`
              : `${matched.length} of ${rows.length} match`}
          </Count>

          <div className="admin-table">
            {page.map((s) => (
              <div className="admin-line" key={s.email}>
                <span>{s.email}</span>
                <span className="mono">{s.status}</span>
                {s.source ? <span className="mono muted">via {s.source}</span> : null}
                <span className="mono muted">{when(s.created_at)}</span>
              </div>
            ))}
          </div>

          {rest > 0 ? (
            <div className="row-flex" style={{ marginTop: "16px" }}>
              <Button onClick={() => setShown((n) => n + PAGE)}>
                Show {Math.min(PAGE, rest)} more of {matched.length}
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <Empty>
          {q ? "No address matches that."
            : "Nobody yet. The sign-up box is on the Insights page."}
        </Empty>
      )}
    </>
  );
}

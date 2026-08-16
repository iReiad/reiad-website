/* ============================================================
   Enquiries.tsx: somebody asking to be worked with.

   The pipeline behind the contact form, and the only panel on this
   desk where the thing waiting is a person who expects a reply.
   That is why the first action is a mailto rather than a status
   change: marking something replied before replying to it is the
   one mistake this page can help you make.

   Filtered and searched in the browser. The endpoint sends every
   enquiry there is, because there will never be thousands and
   because the counts under the filters have to be counts of all of
   them, not of the slice currently on screen.
   ============================================================ */

import { useMemo, useState } from "react";
import type { Enquiry } from "./api.ts";
import { listEnquiries, saveEnquiry } from "./api.ts";
import { useRows } from "./useRows.ts";
import { isNew } from "./seen.ts";
import { toast } from "./site.ts";
import {
  Actions, Broken, Btn, Count, Empty, Filters, Loading, Pill, SearchBox, when,
} from "./bits.tsx";

const FILTERS = [
  ["new", "New"],
  ["replied", "Replied"],
  ["closed", "Closed"],
  ["all", "Everything"],
] as const;

type Filter = typeof FILTERS[number][0];

function Card({ item, onDone }: { item: Enquiry; onDone: () => void }) {
  const [notes, setNotes] = useState(item.notes ?? "");
  const [busy, setBusy] = useState(false);

  const save = async (next: string) => {
    setBusy(true);
    const res = await saveEnquiry(item.id, next, notes);
    setBusy(false);
    if (res?.ok) { toast(next === item.status ? "Notes saved" : `Marked ${next}`); onDone(); }
    else toast("That did not save");
  };

  const subject = encodeURIComponent("Re: your message via reiad.co.uk");

  return (
    <div className={`admin-row status-${item.status}`}>
      <div className="admin-meta mono">
        {isNew(item.created_at) ? <Pill tone="new">new</Pill> : null}
        <Pill>{item.kind}</Pill>
        <span>{item.name || "no name given"}</span>
        <a href={`mailto:${item.email}`}>{item.email}</a>
        <span>{when(item.created_at)}</span>
      </div>

      <p className="admin-q">{item.message}</p>

      <textarea
        className="admin-answer"
        rows={2}
        placeholder="Private notes. Nobody but you ever sees these."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Actions>
        <a className="btn btn-solid" href={`mailto:${item.email}?subject=${subject}`}>
          Reply by email
        </a>
        {item.status !== "replied"
          ? <Btn disabled={busy} onClick={() => save("replied")}>Mark replied</Btn> : null}
        {item.status !== "closed"
          ? <Btn disabled={busy} onClick={() => save("closed")}>Close</Btn> : null}
        {item.status !== "new"
          ? <Btn disabled={busy} onClick={() => save("new")}>Reopen</Btn> : null}
        <Btn disabled={busy} onClick={() => save(item.status)}>Save notes</Btn>
      </Actions>
    </div>
  );
}

export function Enquiries() {
  const [status, setStatus] = useState<Filter>("new");
  const [q, setQ] = useState("");

  const { rows, loading, failed, reload } = useRows<Enquiry>(
    listEnquiries,
    (reply) => (reply.enquiries as Enquiry[]) ?? [],
    []
  );

  const counts = useMemo(() => {
    const tally: Partial<Record<Filter, number>> = { all: rows.length };
    for (const e of rows) {
      const key = e.status as Filter;
      tally[key] = (tally[key] ?? 0) + 1;
    }
    return tally;
  }, [rows]);

  const shown = useMemo(() => {
    const needle = q.toLowerCase();
    return rows
      .filter((e) => status === "all" || e.status === status)
      .filter((e) => !needle
        || `${e.name} ${e.email} ${e.message} ${e.kind}`.toLowerCase().includes(needle));
  }, [rows, status, q]);

  return (
    <>
      <Filters options={FILTERS} active={status} counts={counts} onPick={setStatus} />
      <SearchBox placeholder="Search names, addresses, messages" onSearch={setQ} />

      {loading ? <Loading /> : failed ? <Broken what="enquiries" /> : (
        <>
          <Count>
            {shown.length
              ? `${shown.length} shown${status === "all" ? "" : `, of ${rows.length} in total`}`
              : "Nothing here."}
          </Count>

          {shown.length === 0 ? (
            <Empty>
              {q ? "Nothing matches that."
                : status === "new"
                  ? "Nobody is waiting on a reply."
                  : "Nothing with that status."}
            </Empty>
          ) : shown.map((item) => <Card key={item.id} item={item} onDone={reload} />)}
        </>
      )}
    </>
  );
}

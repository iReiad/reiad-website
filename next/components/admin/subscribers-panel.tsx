"use client";

/* ============================================================
   Subscribers: the list, the confirmed count, and an export.

   ADMIN.md §3 B 5, and the second half of that entry is the
   constraint: "Nothing else: there is no mailing tool on this site
   and this panel is not the place to grow one."

   So there is no compose box, no send, and no per-row action. What
   a `pending` row means is somebody who asked and has not clicked
   the link in their email, and nothing may ever send to that
   state: `SubscriberRow` in `shared/rows.ts` says so where the
   column is described.
   ============================================================ */

import { useEffect, useState } from "react";
import type { SubscriberRow } from "@reiad/shared/rows";
import { adminCall, isLocked } from "../../lib/admin-api";
import { Surface } from "../ui/surface";
import { Button } from "../ui/button";
import { Row } from "./row";

/** What the endpoint selects, which is a row without its token.
    Picked rather than used whole on purpose: the token is what
    makes confirm and unsubscribe work without a login, and a panel
    that had it could unsubscribe somebody by accident. */
type Listed = Omit<SubscriberRow, "token">;

interface Counts { total: number; confirmed: number; pending: number }

const day = (iso: string | null): string => (iso ?? "").slice(0, 10);

export function SubscribersPanel() {
  const [phase, setPhase] = useState<"loading" | "locked" | "error" | "ready">("loading");
  const [rows, setRows] = useState<Listed[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      const r = await adminCall<{ subscribers?: Listed[]; counts?: Counts }>("subscribers");
      if (!live) return;
      if (isLocked(r)) { setPhase("locked"); return; }
      if (!r.ok) { setPhase("error"); return; }
      setRows(r.data?.subscribers ?? []);
      setCounts(r.data?.counts ?? null);
      setPhase("ready");
    })();
    return () => { live = false; };
  }, []);

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Subscribers</h3>

      {phase === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held. Sign in at <a href="/studio">the Studio</a>.
        </p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">/api/subscribers did not answer.</p>
      ) : null}

      {phase === "ready" ? (
        <>
          {counts ? (
            <div className="ad-rows">
              <Row label="Confirmed" state="up" note={String(counts.confirmed ?? 0)} />
              <Row label="Waiting on their email" state="unset"
                   note={String(counts.pending ?? 0)} />
              <Row label="Ever signed up" state="unset" note={String(counts.total ?? 0)} />
            </div>
          ) : null}

          <p className="ad-quiet">
            Confirmed opt-in only. A waiting row is somebody who asked and has not
            clicked the link in their email, and nothing may send to that state.
            There is no mailing tool here and this panel is not the place to grow
            one: the export is what a mailing tool would read.
          </p>

          <div>
            <Button size="sm" kind="soft"
                    onClick={() => { location.href = "/api/subscribers/export"; }}>
              Export as CSV
            </Button>
          </div>

          {rows.length === 0 ? (
            <p className="ad-quiet">Nobody yet.</p>
          ) : (
            <ul className="m-0 grid max-h-96 list-none gap-1 overflow-y-auto p-0">
              {rows.map((s) => (
                <li key={s.email}
                    className="flex flex-wrap items-baseline justify-between gap-2
                               border-b border-hairline py-1">
                  <span className="mono min-w-0 break-all">{s.email}</span>
                  <span className="mono text-[var(--t-2)] text-ink-soft">
                    {s.status} · {s.lang} · {day(s.confirmed_at ?? s.created_at)}
                    {s.source ? ` · ${s.source}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </Surface>
  );
}

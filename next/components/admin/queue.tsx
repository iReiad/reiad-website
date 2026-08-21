"use client";

/* ============================================================
   admin/queue.tsx: the three moderation panels, once.

   Comments, Questions and Enquiries are the same panel with
   different nouns: a list of rows out of D1 behind the passphrase,
   a status filter over it, and two or three buttons per row that
   PATCH a status or DELETE the row. Written out three times they
   would be three files whose diff was the word "comment", which is
   the failure `aab/schools/progress.js` was written to end and the
   same argument applies one directory up.

   What a panel still owns is its spec: which endpoint, which
   filters, what the three lines of a row say, and which buttons
   make sense on which row. That is `queues.tsx`, and it is data.

   ---- the five states, and why "locked" is not "empty" ----

   `requireAdmin()` answers 401 to anybody without a passphrase
   session, so this asks the endpoint and reads the answer rather
   than keeping a second idea of whether somebody is signed in.
   ADMIN.md's second rule is that a panel missing its credential
   must never draw as an empty one: an empty list reads exactly
   like a working panel with nothing in it, and that is the bug
   `app/desk.test.ts` exists for. So there are five states here and
   not three, and every one of them says something.

   ---- why it refetches rather than patching in place ----

   An action changes a row's status, and a status is what the
   current filter is FILTERING ON: approving a pending comment
   takes it out of the list it was in. Editing the row in place
   would leave it sitting in a queue it is no longer in, which
   reads as a button that did nothing. One refetch is a few
   hundred bytes and it is always right.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Surface } from "../ui/surface";
import { Button } from "../ui/button";
import { TextArea } from "../ui/field";
import type { ButtonKind } from "../ui/button";

/** One button on one row. */
export interface QueueAction<T> {
  label: string;
  /** What to send. A body is a PATCH; `remove` is a DELETE. */
  patch?: Record<string, unknown>;
  remove?: true;
  kind?: ButtonKind;
  /** Shown only where it would change something. A button that
      does what has already been done reads as a broken one. */
  when?: (row: T) => boolean;
  /** Asked first. Only a delete asks. */
  confirm?: string;
}

/** A text box on one row, whose value is sent under `key`. An
    answer to a question, a note against an enquiry. */
export interface QueueCompose<T> {
  key: string;
  label: string;
  value: (row: T) => string;
  /** The button that sends it, and anything else that goes with
      it: publishing an answer sets a status in the same PATCH. */
  send: string;
  also?: Record<string, unknown>;
}

export interface QueueSpec<T> {
  title: string;
  /** The fragment the Waiting panel links to. Overview counts what
      is here and sends somebody straight at it. */
  anchor: string;
  /** One or two sentences under the heading. What this list IS,
      not how to use it. */
  blurb?: ReactNode;
  /** The endpoint, without a query. */
  endpoint: string;
  /** What the answer calls its list. */
  listKey: string;
  /** In order. The first is what opens. */
  filters: Array<{ id: string; label: string }>;
  /** The query for one filter, without the leading `?`. Empty
      where the endpoint has no filter of its own, in which case
      `local` is what narrows the list. */
  query: (filter: string) => string;
  /** Filtering in the browser, for an endpoint that answers the
      whole list. Enquiries is the one: it returns 300 rows sorted
      by status and takes no query, so asking it four times would
      be four copies of the same answer. */
  local?: (row: T, filter: string) => boolean;
  id: (row: T) => number;
  /** The three lines of a row: who and where, what they said, and
      when. All three are plain strings, because a row here is a
      record and not an article. */
  head: (row: T) => string;
  body: (row: T) => string;
  meta: (row: T) => string;
  actions: Array<QueueAction<T>>;
  compose?: QueueCompose<T>;
  /** Said when the list is empty and the passphrase IS held. */
  empty: string;
}

type Phase = "loading" | "locked" | "error" | "ready";

export function AdminQueue<T>({ spec }: { spec: QueueSpec<T> }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [filter, setFilter] = useState(spec.filters[0].id);
  const [rows, setRows] = useState<T[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<number, string>>({});

  const load = useCallback(async (): Promise<void> => {
    try {
      const query = spec.query(filter);
      const r = await fetch(`${spec.endpoint}${query ? `?${query}` : ""}`,
        { headers: { accept: "application/json" } });
      /* 401 is the passphrase, 403 is a session that is not an
         admin. Both mean the same thing to a reader here and
         neither is an error worth a red state. */
      if (r.status === 401 || r.status === 403) { setPhase("locked"); return; }
      if (!r.ok) { setPhase("error"); return; }
      const data = await r.json() as Record<string, unknown>;
      const list = data[spec.listKey];
      const all = Array.isArray(list) ? list as T[] : [];
      setRows(spec.local ? all.filter((row) => spec.local!(row, filter)) : all);
      setCounts(
        data.counts && typeof data.counts === "object"
          ? data.counts as Record<string, number>
          : {},
      );
      setPhase("ready");
    } catch { setPhase("error"); }
  }, [spec, filter]);

  useEffect(() => { void load(); }, [load]);

  const act = async (row: T, action: QueueAction<T>): Promise<void> => {
    if (action.confirm && !window.confirm(action.confirm)) return;
    const id = spec.id(row);
    setBusy(id);
    try {
      const r = await fetch(`${spec.endpoint}/${id}`, {
        method: action.remove ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: action.remove ? undefined : JSON.stringify(action.patch ?? {}),
      });
      if (r.status === 401 || r.status === 403) { setPhase("locked"); return; }
      await load();
    } catch { setPhase("error"); } finally { setBusy(null); }
  };

  const send = async (row: T): Promise<void> => {
    const c = spec.compose;
    if (!c) return;
    const id = spec.id(row);
    setBusy(id);
    try {
      const r = await fetch(`${spec.endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [c.key]: draft[id] ?? c.value(row), ...(c.also ?? {}) }),
      });
      if (r.status === 401 || r.status === 403) { setPhase("locked"); return; }
      await load();
    } catch { setPhase("error"); } finally { setBusy(null); }
  };

  return (
    <Surface material="pane" className="ad-panel" id={spec.anchor}>
      <h3>{spec.title}</h3>
      {spec.blurb ? <p className="ad-quiet">{spec.blurb}</p> : null}

      {phase === "loading" ? (
        <p className="ad-quiet" role="status">এক মুহূর্ত…</p>
      ) : null}

      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held, so this list is not readable from here.
          Sign in at <a href="/studio">the Studio</a> and come back: it is the
          same session, and nothing on this page can mint it.
        </p>
      ) : null}

      {phase === "error" ? (
        <p className="ad-quiet">
          {spec.endpoint} did not answer. That is the endpoint, not the
          credential: Health above says whether the database is reachable.
        </p>
      ) : null}

      {phase === "ready" ? (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter">
            {spec.filters.map((f) => (
              <Button key={f.id} size="sm" kind={f.id === filter ? "soft" : "quiet"}
                      pressed={f.id === filter} onClick={() => setFilter(f.id)}>
                {f.label}
                {counts[f.id] === undefined ? null : (
                  <span className="mono ml-2 text-ink-soft">{counts[f.id]}</span>
                )}
              </Button>
            ))}
          </div>

          {rows.length === 0 ? (
            <p className="ad-quiet">{spec.empty}</p>
          ) : (
            <ul className="m-0 grid list-none gap-3 p-0">
              {rows.map((row) => {
                const id = spec.id(row);
                const working = busy === id;
                return (
                  <li key={id}
                      className="grid gap-2 rounded-[var(--radius-sm)] border
                                 border-hairline p-3"
                      data-busy={working ? "" : undefined}>
                    <p className="m-0 flex flex-wrap items-baseline justify-between gap-2">
                      <strong className="min-w-0">{spec.head(row)}</strong>
                      <span className="mono text-[var(--t-2)] text-ink-soft">
                        {spec.meta(row)}
                      </span>
                    </p>
                    <p className="m-0 whitespace-pre-wrap text-ink-soft">
                      {spec.body(row)}
                    </p>

                    {spec.compose ? (
                      <TextArea
                        id={`${spec.anchor}-compose-${id}`}
                        label={spec.compose.label}
                        value={draft[id] ?? spec.compose.value(row)}
                        onChange={(e) => setDraft((d) => ({ ...d, [id]: e.target.value }))}
                      />
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {spec.compose ? (
                        <Button size="sm" kind="solid" disabled={working}
                                onClick={() => void send(row)}>
                          {spec.compose.send}
                        </Button>
                      ) : null}
                      {spec.actions
                        .filter((a) => !a.when || a.when(row))
                        .map((a) => (
                          <Button key={a.label} size="sm" kind={a.kind ?? "ghost"}
                                  disabled={working} onClick={() => void act(row, a)}>
                            {a.label}
                          </Button>
                        ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : null}
    </Surface>
  );
}

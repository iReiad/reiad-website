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

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Surface } from "../ui/surface";
import { Button, ButtonLink } from "../ui/button";
import { Field, TextArea } from "../ui/field";
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

/** A box over the list. Two kinds, and the difference is where
    the narrowing happens: the questions endpoint takes `?q=` and
    searches the BODY in SQL, which a browser filter over one page
    of rows cannot do, while comments and enquiries answer the
    whole list and are narrowed here. */
export interface QueueSearch<T> {
  placeholder: string;
  /** Sent as `q=` and debounced, so it does not ask once per
      keystroke. Without it the rows already in hand are filtered
      by `match`. */
  server?: boolean;
  match?: (row: T, needle: string) => boolean;
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
  /** Where the row IS, if it is anywhere. A comment is on a page
      and a moderator has to read the thread around it; a printed
      slug makes them assemble the URL themselves. */
  href?: (row: T) => string | null;
  body: (row: T) => string;
  meta: (row: T) => string;
  /** How to reach the person, where there is one to reach. A
      mailto rather than a printed address: the desk's whole answer
      to an enquiry was replying to it, and making somebody copy an
      address out of a page is the version of that which nobody
      uses. */
  contact?: (row: T) => { href: string; label: string } | null;
  /** A word on the row, for the state a status does not carry.
      "new" on something that arrived this week is the desk's, and
      it is the difference between a queue and a list. */
  flag?: (row: T) => string | null;
  search?: QueueSearch<T>;
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
  /* Two states, not one. `typed` is what is in the box and
     redraws on every keystroke; `asked` is what the endpoint has
     been told, and only catches up when the typing stops. A
     single state would send a request per character. */
  const [typed, setTyped] = useState("");
  const [asked, setAsked] = useState("");

  /* The box is debounced only where it reaches the endpoint. A
     browser filter has nothing to wait for. */
  useEffect(() => {
    /* A browser search never touches `asked`, and that is the
       point rather than an optimisation: `asked` is in `load`'s
       dependencies, so writing it here would refetch the same
       rows on every keystroke of a box that filters what is
       already in hand. */
    if (!spec.search?.server) return;
    const t = setTimeout(() => setAsked(typed), 300);
    return () => clearTimeout(t);
  }, [typed, spec.search?.server]);

  const load = useCallback(async (): Promise<void> => {
    try {
      const parts = [spec.query(filter)].filter(Boolean);
      if (spec.search?.server && asked.trim()) {
        parts.push(`q=${encodeURIComponent(asked.trim())}`);
      }
      const query = parts.join("&");
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
      /* The endpoint's own tally where it has one. Where it does
         not, and the whole list is in hand anyway, count it here:
         a filter that does not say what is behind it makes
         somebody press it to find out. */
      setCounts(
        data.counts && typeof data.counts === "object"
          ? data.counts as Record<string, number>
          : spec.local
            ? Object.fromEntries(spec.filters.map((f) =>
              [f.id, all.filter((row) => spec.local!(row, f.id)).length]))
            : {},
      );
      setPhase("ready");
    } catch { setPhase("error"); }
  }, [spec, filter, asked]);

  useEffect(() => { void load(); }, [load]);

  /* A server search has already narrowed what came back; a browser
     one narrows here, and `match` is what a spec means by "matches". */
  const shown = useMemo(() => {
    const needle = typed.trim().toLowerCase();
    const match = spec.search?.match;
    if (!needle || spec.search?.server || !match) return rows;
    return rows.filter((row) => match(row, needle));
  }, [rows, typed, spec.search]);

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
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter">
            {spec.filters.map((f) => (
              <Button key={f.id} size="sm" kind={f.id === filter ? "soft" : "quiet"}
                      pressed={f.id === filter} onClick={() => setFilter(f.id)}>
                {f.label}
                {counts[f.id] === undefined ? null : (
                  <span className="mono ml-2 text-ink-soft">{counts[f.id]}</span>
                )}
              </Button>
            ))}
            {spec.search ? (
              <div className="ml-auto min-w-48 flex-1">
                <Field id={`${spec.anchor}-search`} label={spec.search.placeholder}
                       hideLabel type="search" value={typed}
                       onChange={(e) => setTyped(e.target.value)}
                       placeholder={spec.search.placeholder} />
              </div>
            ) : null}
          </div>

          {shown.length === 0 ? (
            <p className="ad-quiet">
              {typed.trim() ? "Nothing matches that." : spec.empty}
            </p>
          ) : (
            <ul className="m-0 grid list-none gap-3 p-0">
              {shown.map((row) => {
                const id = spec.id(row);
                const working = busy === id;
                const flag = spec.flag?.(row) ?? null;
                const reach = spec.contact?.(row) ?? null;
                return (
                  <li key={id}
                      className="grid gap-2 rounded-[var(--radius-sm)] border
                                 border-hairline p-3"
                      data-busy={working ? "" : undefined}>
                    <p className="m-0 flex flex-wrap items-baseline gap-2">
                      {spec.href?.(row)
                        ? <a className="min-w-0 font-semibold" href={spec.href(row) ?? "#"}>
                            {spec.head(row)}
                          </a>
                        : <strong className="min-w-0">{spec.head(row)}</strong>}
                      {flag ? <span className="pill">{flag}</span> : null}
                      <span className="mono ml-auto text-[var(--t-2)] text-ink-soft">
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

                    <div className="flex flex-wrap items-center gap-2">
                      {reach ? (
                        <ButtonLink size="sm" href={reach.href}>{reach.label}</ButtonLink>
                      ) : null}
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

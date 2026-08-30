"use client";

/* ============================================================
   admin/threads.tsx: the research desk.

   A question, what has been read about it, what is left to do,
   and what on this site it touches. One thread at a time, a list
   down the side, and nothing on the page explaining itself: this
   is a working surface for somebody who knows what it is, and
   every sentence of guidance on it is a sentence they read past
   a thousand times.

   ---- everything saves, and nothing has a Save button ----

   A button you can forget is a button that loses work. Each
   field writes on a debounce and again on blur, and the only
   thing on screen about saving is one word that appears when a
   write lands. `saveThread` sends only the fields that changed,
   so two edits in flight cannot put each other back.

   ---- and a body is one write ----

   `body` is one jsonb column, so the note, a source and a step
   are one round trip between them. That is the whole reason the
   table is shaped this way: a desk that can half-save is a desk
   nobody trusts with a fortnight of reading. It also means a
   patch to the body must always be a WHOLE body, because
   PostgREST replaces a jsonb column rather than merging into it.

   ---- what "connected" means here, concretely ----

   Three lists, and not one of them is typed free-hand, because a
   reference somebody typed is a reference that can be wrong and
   a desk full of dead links is worse than a desk with none:

     a TICKER  is picked from the checks already saved, and links
               to `/tools/stock` with that check's own query in
               it, so the thread and `/tools/live` open the same
               analysis;
     a TOOL    is picked from `shared/nav.ts`, which is the one
               table every menu on this site comes from;
     a PAGE    is picked from the reader's own library, which is
               where a piece or a lesson goes when it is saved
               under a byline.

   ---- the keyboard is the point of it ----

   `f` find, `n` new, `j`/`k` down and up the list, `1`/`2`/`3`
   the three states, Escape back to the list. None of them fire
   while a field has the focus or while a dialog is open, which
   is what makes them safe to be single letters.

   `f` AND NOT `/`, WHICH IS THE OBVIOUS ONE AND IS TAKEN. The
   site has had a keyboard since long before this page: `/` and
   Ctrl+K open the command palette, `?` opens the shortcut list,
   `t` toggles the theme and `g` starts a go-to. Those are on
   `window` from `aab/src/app.ts` and they fire on every page.
   This took `/` for one build and what happened is that the
   palette opened over the desk, every time, because two
   listeners both ran and only one of them navigated: the desk's
   search box took the focus and then a modal took it away. A
   shortcut that collides does not fail, it does the other
   thing.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  LibraryRow, Scenario, Source, Step, Thread, ThreadBody, ThreadState,
} from "/saved.js";
import { NAV } from "@reiad/shared/nav";
import { Surface } from "../ui/surface";
import { Button, IconButton } from "../ui/button";
import { Field, TextArea } from "../ui/field";
import { Icon } from "../icons";
import { runtimeModule } from "../account/runtime";

interface SavedModule {
  listThreads: (state?: ThreadState) => Promise<Thread[]>;
  addThread: (question: string) => Promise<Thread | null>;
  saveThread: (
    id: string,
    patch: Partial<Pick<Thread, "question" | "state" | "tags" | "body">>,
  ) => Promise<Thread | null>;
  removeThread: (id: string) => Promise<boolean>;
  listScenarios: (tool?: string) => Promise<Scenario[]>;
  listLibrary: (only?: "saved" | "notes") => Promise<LibraryRow[]>;
}
const saved = () => runtimeModule<SavedModule>("/saved.js");

interface AccountModule { current: () => { id: string } | null }
const account = () => runtimeModule<AccountModule>("/account.js");

const STATES: ThreadState[] = ["open", "parked", "answered"];

/** The calculators, out of the one table the whole menu comes
    from. A second list of six addresses here would be right on
    the day it was typed, which is the failure at the top of
    CLAUDE.md. */
const TOOLS: { key: string; label: string; href: string }[] =
  (NAV.find((g) => g.id === "make")?.items ?? [])
    .filter((i) => !i.soon && i.key)
    .map((i) => ({ key: i.key as string, label: i.label, href: i.href }));

/** How long a burst of typing settles before it is written. Long
    enough that a sentence is one request, short enough that
    closing the tab a second after the last keystroke has already
    saved. `onBlur` covers the rest. */
const SETTLE = 700;

/** How long "saved" stays on screen. */
const SAID = 1600;

const when = (iso: string): string => {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d`;
  return `${Math.round(days / 30)}mo`;
};

/** A URL as a name a person recognises. `new URL` and not a
    regex: a desk gets pasted every shape of address there is,
    and one that threw on a malformed one would lose the source
    rather than the formatting. */
const host = (url: string): string => {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url.slice(0, 40); }
};

/** The ticker inside a saved stock check, out of the query it
    stores. The same read `/tools/live` makes, deliberately: a
    check is one check wherever it was started from. */
const tickerOf = (s: Scenario): string =>
  new URLSearchParams(String(s.inputs?.query ?? "")).get("ticker")?.trim().toUpperCase() ?? "";

/** Is the focus in something a single letter would type into?
    Everything the keyboard below does is guarded by this. */
const typing = (): boolean => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable
    || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
};

export function ResearchDesk() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Thread[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ThreadState | "all">("open");
  const [tag, setTag] = useState<string>("");
  const [find, setFind] = useState("");
  const [checks, setChecks] = useState<Scenario[]>([]);
  const [library, setLibrary] = useState<LibraryRow[]>([]);
  const [note, setNote] = useState<string>("");
  const [state, setState] = useState<"" | "saving" | "saved">("");
  const [err, setErr] = useState("");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const said = useRef<ReturnType<typeof setTimeout> | null>(null);
  const search = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const who = (await account()).current();
      setSignedIn(Boolean(who));
      if (!who) { setRows([]); return; }
      const m = await saved();
      const [all, scenarios, lib] = await Promise.all([
        m.listThreads(), m.listScenarios("stock"), m.listLibrary(),
      ]);
      setRows(all);
      setChecks(scenarios);
      setLibrary(lib);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not read the desk.");
      setRows([]);
      setSignedIn(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  /* The account arrives after the page does, and the sign-in
     happens in the top bar rather than here, so the desk has to
     hear about it the way every other account-aware component
     does. Without this it says "sign in" to somebody who just
     did. */
  useEffect(() => {
    const again = (): void => { void load(); };
    document.addEventListener("account:changed", again);
    return () => document.removeEventListener("account:changed", again);
  }, [load]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (said.current) clearTimeout(said.current);
  }, []);

  const open = useMemo(
    () => rows?.find((r) => r.id === openId) ?? null, [rows, openId]);

  /* ON THE THREAD'S ID AND NOT ON ITS NOTE, WHICH IS THE WHOLE
     DIFFERENCE BETWEEN A BOX YOU CAN TYPE IN AND ONE YOU CANNOT.

     The note is a controlled field, so its value has to come from
     somewhere. Taking it from the row on every change of the row
     means every write puts the server's answer back into the box:
     type a sentence, the debounce fires halfway through it, the
     response lands two hundred milliseconds later carrying the
     HALF sentence, and the second half disappears from under the
     caret. It heals itself on the next write, which is worse than
     failing, because what a reader sees is their own typing
     flickering away and coming back.

     A thread's id changing is the only moment the row is the
     source. After that the box is the reader's, and `write` is
     what carries it the other way. */
  useEffect(() => {
    setNote(rows?.find((r) => r.id === openId)?.body?.note ?? "");
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [openId]);

  /** Write a patch, and keep the row in the list in step without
      refetching: a desk that reloads the list on every keystroke
      burst is a desk that scrolls under the hand. */
  const write = useCallback(async (
    id: string, patch: Partial<Pick<Thread, "question" | "state" | "tags" | "body">>,
  ) => {
    setState("saving");
    try {
      const m = await saved();
      const back = await m.saveThread(id, patch);
      if (back) setRows((was) => (was ?? []).map((r) => (r.id === id ? back : r)));
      setErr("");
      setState("saved");
      if (said.current) clearTimeout(said.current);
      said.current = setTimeout(() => setState(""), SAID);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "That did not save.");
      setState("");
    }
  }, []);

  /** The same, on a debounce, for anything typed. */
  const later = useCallback((
    id: string, patch: Partial<Pick<Thread, "question" | "state" | "tags" | "body">>,
  ) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void write(id, patch); }, SETTLE);
  }, [write]);

  /* A patch to the body is always a WHOLE body: the column is one
     jsonb and PostgREST replaces it, so sending `{ note }` alone
     would drop the sources. Built from the row in hand, which is
     the row the last write returned. */
  const patchBody = useCallback((row: Thread, part: Partial<ThreadBody>): ThreadBody =>
    ({ ...(row.body ?? {}), ...part }), []);

  const tags = useMemo(() => {
    const seen = new Map<string, number>();
    for (const r of rows ?? []) for (const t of r.tags ?? []) seen.set(t, (seen.get(t) ?? 0) + 1);
    return [...seen.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const shown = useMemo(() => (rows ?? []).filter((r) => {
    if (filter !== "all" && r.state !== filter) return false;
    if (tag && !(r.tags ?? []).includes(tag)) return false;
    if (find) {
      const hay = [
        r.question,
        (r.tags ?? []).join(" "),
        r.body?.note ?? "",
        (r.body?.sources ?? []).map((s) => `${s.url} ${s.said}`).join(" "),
        (r.body?.next ?? []).map((s) => s.text).join(" "),
      ].join(" ").toLowerCase();
      if (!hay.includes(find.toLowerCase())) return false;
    }
    return true;
  }), [rows, filter, tag, find]);

  const start = useCallback(async () => {
    try {
      const m = await saved();
      const row = await m.addThread("New question");
      if (row) {
        setRows((was) => [row, ...(was ?? [])]);
        setOpenId(row.id);
        setFilter("open");
        setTag("");
        setFind("");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start one.");
    }
  }, []);

  /* ---- the keyboard ----

     One listener on the document, guarded by `typing()`, so a
     letter in the note is a letter. Nothing here does anything a
     control on the page does not also do: it is the same desk,
     faster. */
  const move = useCallback((by: 1 | -1) => {
    if (!shown.length) return;
    const at = shown.findIndex((r) => r.id === openId);
    const next = at < 0 ? (by === 1 ? 0 : shown.length - 1)
      : Math.min(shown.length - 1, Math.max(0, at + by));
    setOpenId(shown[next].id);
  }, [shown, openId]);

  useEffect(() => {
    const key = (e: KeyboardEvent): void => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      /* The palette, the shortcut list and the account menu are
         all dialogs, and while one is open the reader is driving
         it rather than this. */
      if (document.querySelector("dialog[open]")) return;
      if (e.key === "Escape") {
        if (typing()) { (document.activeElement as HTMLElement).blur(); return; }
        setFind("");
        return;
      }
      if (typing()) return;
      if (e.key === "f") { e.preventDefault(); search.current?.focus(); return; }
      if (e.key === "n") { e.preventDefault(); void start(); return; }
      if (e.key === "j") { e.preventDefault(); move(1); return; }
      if (e.key === "k") { e.preventDefault(); move(-1); return; }
      const at = ["1", "2", "3"].indexOf(e.key);
      if (at >= 0 && openId) { e.preventDefault(); void write(openId, { state: STATES[at] }); }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [move, start, write, openId]);

  if (rows === null) {
    return <Surface material="pane" className="ad-panel"><p className="ad-quiet">…</p></Surface>;
  }

  if (!signedIn) {
    return (
      <Surface material="pane" className="ad-panel">
        <h3>Sign in</h3>
        <p className="ad-quiet">
          A thread is a row under your own account, so there is nothing to draw
          until there is an account to draw it from.
        </p>
        <Button kind="ghost" size="sm" onClick={() => {
          const bar = document.querySelector<HTMLElement>(".account-btn");
          if (bar) { bar.click(); return; }
          window.location.href = "/account";
        }}>Sign in to your account</Button>
      </Surface>
    );
  }

  return (
    <div className="rd">
      {/* ---------- the list ---------- */}
      <Surface material="pane" className="rd-list">
        <div className="rd-list-head">
          <Field id="rd-find" label="Search the desk" hideLabel type="search"
                 ref={search} placeholder="f to search" value={find}
                 onChange={(e) => setFind(e.target.value)} />
          <Button kind="solid" size="sm" onClick={() => { void start(); }}>New</Button>
        </div>

        <div className="rd-chips">
          {(["open", "parked", "answered", "all"] as const).map((s) => (
            <button key={s} type="button" className="rd-chip"
                    aria-pressed={filter === s}
                    data-on={filter === s ? "" : undefined}
                    onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>

        {tags.length ? (
          <div className="rd-chips">
            {tag ? (
              <button type="button" className="rd-chip" data-on="" aria-pressed="true"
                      onClick={() => setTag("")}>{tag} ✕</button>
            ) : tags.slice(0, 12).map(([t, n]) => (
              <button key={t} type="button" className="rd-chip" aria-pressed="false"
                      onClick={() => setTag(t)}>{t} <span className="rd-n">{n}</span></button>
            ))}
          </div>
        ) : null}

        <ul className="rd-rows">
          {shown.map((r) => {
            const left = (r.body?.next ?? []).filter((s) => !s.done).length;
            const srcs = (r.body?.sources ?? []).length;
            return (
              <li key={r.id}>
                <button type="button" className="rd-row"
                        aria-current={r.id === openId ? "true" : undefined}
                        data-on={r.id === openId ? "" : undefined}
                        onClick={() => setOpenId(r.id)}>
                  <span className="rd-q">{r.question}</span>
                  <span className="rd-meta mono">
                    {r.state}
                    {left ? ` · ${left} left` : ""}
                    {srcs ? ` · ${srcs} src` : ""}
                    {` · ${when(r.updated_at)}`}
                  </span>
                </button>
              </li>
            );
          })}
          {shown.length === 0 ? (
            <li className="ad-quiet">{rows.length ? "Nothing matches." : "Press New."}</li>
          ) : null}
        </ul>
      </Surface>

      {/* ---------- the thread ---------- */}
      {open ? (
        <Surface material="pane" className="rd-open" key={open.id}>
          <Field
            id="rd-question" label="The question" hideLabel
            className="rd-question"
            defaultValue={open.question}
            onChange={(e) => later(open.id, { question: e.target.value })}
            onBlur={(e) => { void write(open.id, { question: e.target.value }); }}
          />

          <div className="rd-chips">
            {STATES.map((s, i) => (
              <button key={s} type="button" className="rd-chip"
                      aria-pressed={open.state === s}
                      data-on={open.state === s ? "" : undefined}
                      title={`${i + 1}`}
                      onClick={() => { void write(open.id, { state: s }); }}>{s}</button>
            ))}
            <span className="rd-spacer" />
            <span className="rd-said mono" role="status">{state}</span>
            <Button kind="ghost" size="sm" onClick={() => {
              if (!confirm(`Delete "${open.question}"? This cannot be undone.`)) return;
              void (async () => {
                const m = await saved();
                await m.removeThread(open.id);
                setRows((was) => (was ?? []).filter((r) => r.id !== open.id));
                setOpenId(null);
              })();
            }}>Delete</Button>
          </div>

          <Field
            id="rd-tags" label="Tags" hideLabel placeholder="tags, comma separated"
            className="rd-tags"
            defaultValue={(open.tags ?? []).join(", ")}
            onBlur={(e) => { void write(open.id, { tags: e.target.value.split(",") }); }}
          />

          <TextArea
            id="rd-note" label="What you know so far" hideLabel rows={12}
            className="rd-note" placeholder="What you know so far."
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              later(open.id, { body: patchBody(open, { note: e.target.value }) });
            }}
            onBlur={(e) => {
              void write(open.id, { body: patchBody(open, { note: e.target.value }) });
            }}
          />

          <SourceList row={open} onChange={(sources) =>
            write(open.id, { body: patchBody(open, { sources }) })} />

          <StepList row={open} onChange={(next) =>
            write(open.id, { body: patchBody(open, { next }) })} />

          <LinkList row={open} checks={checks} library={library}
                    onChange={(links) => write(open.id, { body: patchBody(open, { links }) })} />
        </Surface>
      ) : (
        <Surface material="pane" className="rd-open">
          <p className="ad-quiet">Pick one, or press New.</p>
          <p className="ad-quiet mono">f find · n new · j k move · 1 2 3 state</p>
        </Surface>
      )}

      {err ? <p className="rd-err" role="status">{err}</p> : null}
    </div>
  );
}

/* ---------- what has been read ---------- */

function SourceList({ row, onChange }: {
  row: Thread; onChange: (s: Source[]) => void | Promise<void>;
}) {
  const list = row.body?.sources ?? [];
  const [url, setUrl] = useState("");

  const add = (): void => {
    const clean = url.trim();
    if (!clean) return;
    void onChange([{ url: clean, said: "" }, ...list]);
    setUrl("");
  };

  return (
    <section className="rd-part">
      <h3 className="rd-h mono">Sources {list.length ? <span className="rd-n">{list.length}</span> : null}</h3>
      <div className="rd-add">
        <Field id="rd-src" label="A source" hideLabel type="url" placeholder="Paste a link"
               value={url} onChange={(e) => setUrl(e.target.value)}
               onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button kind="ghost" size="sm" onClick={add}>Add</Button>
      </div>
      <ul className="rd-srcs">
        {list.map((s, i) => (
          <li key={`${s.url}-${i}`}>
            <a href={s.url} target="_blank" rel="noreferrer noopener" className="rd-src-url mono">
              {host(s.url)}
            </a>
            <Field
              id={`rd-said-${i}`} label={`What ${host(s.url)} said`} hideLabel
              className="rd-said-in" placeholder="What it said"
              defaultValue={s.said}
              onBlur={(e) => {
                const next = [...list];
                next[i] = { ...s, said: e.target.value };
                void onChange(next);
              }}
            />
            <IconButton label={`Remove ${host(s.url)}`}
                        onClick={() => onChange(list.filter((_, n) => n !== i))}>
              <Icon name="close" size={14} />
            </IconButton>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- what is left ---------- */

function StepList({ row, onChange }: {
  row: Thread; onChange: (s: Step[]) => void | Promise<void>;
}) {
  const list = row.body?.next ?? [];
  const [text, setText] = useState("");
  const left = list.filter((s) => !s.done).length;

  const add = (): void => {
    const clean = text.trim();
    if (!clean) return;
    void onChange([...list, { text: clean }]);
    setText("");
  };

  return (
    <section className="rd-part">
      <h3 className="rd-h mono">Next {left ? <span className="rd-n">{left}</span> : null}</h3>
      <div className="rd-add">
        <Field id="rd-step" label="What is left" hideLabel placeholder="What is left"
               value={text} onChange={(e) => setText(e.target.value)}
               onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button kind="ghost" size="sm" onClick={add}>Add</Button>
      </div>
      <ul className="rd-steps">
        {list.map((s, i) => (
          <li key={`${s.text}-${i}`}>
            <label className="rd-step">
              <input type="checkbox" checked={Boolean(s.done)}
                     onChange={() => {
                       const next = [...list];
                       next[i] = { ...s, done: !s.done };
                       void onChange(next);
                     }} />
              <span data-done={s.done ? "" : undefined}>{s.text}</span>
            </label>
            <IconButton label={`Remove ${s.text}`}
                        onClick={() => onChange(list.filter((_, n) => n !== i))}>
              <Icon name="close" size={14} />
            </IconButton>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- what it touches ----------

   Nothing here is typed. Each of the three is picked out of
   something this site already holds, so a link on a thread is an
   address the site answers rather than a string somebody hoped
   was right. */

type Links = NonNullable<ThreadBody["links"]>;

function LinkList({ row, checks, library, onChange }: {
  row: Thread;
  checks: Scenario[];
  library: LibraryRow[];
  onChange: (l: Links) => void | Promise<void>;
}) {
  const links: Links = row.body?.links ?? {};
  const [what, setWhat] = useState<"tickers" | "tools" | "pages">("tickers");
  const [pick, setPick] = useState("");

  /* One saved check per ticker, the newest, because
     `listScenarios` comes back newest first. */
  const byTicker = useMemo(() => {
    const seen = new Map<string, Scenario>();
    for (const s of checks) {
      const t = tickerOf(s);
      if (t && !seen.has(t)) seen.set(t, s);
    }
    return seen;
  }, [checks]);

  const options = useMemo(() => {
    if (what === "tickers") {
      return [...byTicker.entries()]
        .filter(([t]) => !(links.tickers ?? []).includes(t))
        .map(([t, s]) => ({ value: t, label: `${t} · ${s.name}` }));
    }
    if (what === "tools") {
      return TOOLS.filter((t) => !(links.tools ?? []).includes(t.key))
        .map((t) => ({ value: t.key, label: t.label }));
    }
    const had = new Set((links.pages ?? []).map((p) => p.url));
    return library.filter((r) => !had.has(r.url))
      .map((r) => ({ value: r.url, label: r.title || r.url }));
  }, [what, byTicker, library, links]);

  const add = (): void => {
    if (!pick) return;
    if (what === "pages") {
      const found = library.find((r) => r.url === pick);
      if (!found) return;
      void onChange({
        ...links,
        pages: [...(links.pages ?? []), { url: found.url, title: found.title || found.url }],
      });
    } else {
      const had = links[what] ?? [];
      if (!had.includes(pick)) void onChange({ ...links, [what]: [...had, pick] });
    }
    setPick("");
  };

  const total = (links.tickers ?? []).length + (links.tools ?? []).length
    + (links.pages ?? []).length;

  return (
    <section className="rd-part">
      <h3 className="rd-h mono">Connected {total ? <span className="rd-n">{total}</span> : null}</h3>
      <div className="rd-add">
        <select className="rd-what" value={what} aria-label="What kind of thing to connect"
                onChange={(e) => {
                  setWhat(e.target.value as "tickers" | "tools" | "pages");
                  setPick("");
                }}>
          <option value="tickers">check</option>
          <option value="tools">tool</option>
          <option value="pages">page</option>
        </select>
        <select className="rd-pick" value={pick} aria-label="Which one"
                onChange={(e) => setPick(e.target.value)}>
          <option value="">
            {options.length ? "Pick one" : "Nothing left to connect"}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button kind="ghost" size="sm" onClick={add}>Add</Button>
      </div>

      <ul className="rd-links">
        {(links.tickers ?? []).map((t) => {
          const was = byTicker.get(t);
          return (
            <li key={`t-${t}`}>
              {/* The saved check's OWN query, so this opens the
                  analysis that was done rather than an empty form
                  with a ticker in it. `/tools/live` builds the
                  same address from the same row. */}
              <a className="rd-link" href={was
                ? `/tools/stock?${String(was.inputs?.query ?? "")}`
                : `/tools/stock?ticker=${encodeURIComponent(t)}`}>
                <span className="mono">{t}</span>
                <span className="rd-verdict">{was?.summary || "no check saved"}</span>
              </a>
              <IconButton label={`Disconnect ${t}`} onClick={() => onChange(
                { ...links, tickers: (links.tickers ?? []).filter((v) => v !== t) })}>
                <Icon name="close" size={14} />
              </IconButton>
            </li>
          );
        })}

        {(links.tools ?? []).map((k) => {
          const tool = TOOLS.find((t) => t.key === k);
          return (
            <li key={`o-${k}`}>
              <a className="rd-link" href={tool?.href ?? "/tools"}>
                <span className="mono">{tool?.label ?? k}</span>
              </a>
              <IconButton label={`Disconnect ${tool?.label ?? k}`} onClick={() => onChange(
                { ...links, tools: (links.tools ?? []).filter((v) => v !== k) })}>
                <Icon name="close" size={14} />
              </IconButton>
            </li>
          );
        })}

        {(links.pages ?? []).map((p) => {
          const row2 = library.find((r) => r.url === p.url);
          return (
            <li key={`p-${p.url}`}>
              <a className="rd-link" href={p.url}>
                <span>{p.title}</span>
                {row2?.note ? <span className="rd-verdict">you left a note</span> : null}
              </a>
              <IconButton label={`Disconnect ${p.title}`} onClick={() => onChange(
                { ...links, pages: (links.pages ?? []).filter((v) => v.url !== p.url) })}>
                <Icon name="close" size={14} />
              </IconButton>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

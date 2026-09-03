"use client";

/* ============================================================
   research/board.tsx: the front door, and the one page a reader
   opens every day.

   `RESEARCH.md` section 7. A board of widgets rather than a menu
   of rooms, because a menu is what you read once. From the top:
   the capture line, today, pick up where you left off, the
   inbox, one search over everything, and the rooms last.

   ---- the capture line decides by shape ----

   Paste a DOI and it is a source. Paste a link and it is
   clipped. Paste a BibTeX entry and it is parsed. Type a line
   starting with `todo` and it is a task. Anything else is a
   capture in the inbox. The box says what it decided before it
   saves, and a lookup that fails keeps the line as a capture
   rather than losing it.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { captureShape, toneVar } from "@reiad/shared/research";
import { parseAny } from "@reiad/shared/research-bib";
import {
  addNote, addSource, addTask, chunkHref, embedTexts, findDuplicate, listActivity, listEvents, listNotes, listQuestions,
  listSources, listTasks, lookupDoi, lookupIsbn, lookupUrl, matchChunks, saveNote, saveTask, serviceStatus,
  type Activity, type Match, type Note, type Question, type Source, type Task,
} from "../../lib/research-api";
import { RESEARCH_PAGES, isOpen } from "../../lib/research-pages";
import { GoCard } from "../deck";
import { Button } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { Field } from "../ui/field";
import { Surface } from "../ui/surface";
import { Icon } from "../icons";
import { cue } from "../../lib/sound";
import { T, W, both } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho, when } from "./use-who";
import { useKeys } from "./keys";

type Decided = "doi" | "isbn" | "url" | "bib" | "todo" | "note" | "dup" | "fail" | null;

export function Board() {
  const { w, answered } = useWho();
  const [line, setLine] = useState("");
  const [busy, setBusy] = useState(false);
  const [decided, setDecided] = useState<Decided>(null);
  const [made, setMade] = useState<{ href: string; title: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inbox, setInbox] = useState<Note[]>([]);
  const [recent, setRecent] = useState<Activity[]>([]);
  const [dates, setDates] = useState<Awaited<ReturnType<typeof listEvents>>>([]);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ sources: Source[]; notes: Note[]; questions: Question[]; tasks: Task[] } | null>(null);
  const [passages, setPassages] = useState<Match[] | null>(null);
  const [embedOn, setEmbedOn] = useState(false);
  const box = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    if (!w) return;
    const since = new Date(Date.now() - 86400000).toISOString();
    const [t, n, a, e] = await Promise.all([listTasks(w), listNotes(w, { inbox: true, limit: 20 }), listActivity(w, 12), listEvents(w, { from: since })]);
    setTasks(t);
    setInbox(n);
    setRecent(a);
    setDates(e.filter((x) => !x.done).slice(0, 5));
  }, [w]);

  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => { box.current?.focus(); }, [answered]);

  useKeys(useMemo(() => ({
    c: () => box.current?.focus(),
  }), []), Boolean(w));

  /* The capture line. */
  const capture = useCallback(async () => {
    if (!w || !line.trim() || busy) return;
    setBusy(true);
    setMade(null);
    const text = line.trim();
    const shape = captureShape(text);
    const keep = async (why: Decided): Promise<void> => {
      const note = await addNote(w, { kind: "capture", text, title: text.slice(0, 80) });
      setDecided(why);
      if (note) setMade({ href: `/tools/research/notes/${note.id}`, title: note.title });
    };
    try {
      if (shape === "todo") {
        const t = await addTask(w, text.replace(/^todo[:\s]*/i, ""), "week");
        setDecided("todo");
        if (t) setMade({ href: "/tools/research/plan", title: t.title });
      } else if (shape === "doi" || shape === "isbn" || shape === "url") {
        const found = shape === "doi" ? await lookupDoi(text)
          : shape === "isbn" ? await lookupIsbn(text) : await lookupUrl(text);
        if (!found) { await keep("fail"); }
        else {
          const dup = await findDuplicate(w, found.csl);
          if (dup?.sure) {
            setDecided("dup");
            setMade({ href: `/tools/research/library/${dup.source.id}`, title: dup.source.title });
          } else {
            const s = await addSource(w, found.csl, {
              via: shape, verified: found.via !== "clip" || Boolean(found.csl.DOI),
              retracted: found.retracted ?? null,
              oa: found.openalex ? { isOa: found.openalex.oa, url: found.openalex.oaUrl, at: new Date().toISOString() } : null,
              identifiers: found.openalex ? { openalex: found.openalex.id } : {},
            });
            setDecided(shape);
            if (s) setMade({ href: `/tools/research/library/${s.id}`, title: s.title });
          }
        }
      } else if (shape === "bibtex" || shape === "ris" || shape === "csl") {
        const { items } = parseAny(text);
        if (!items.length) { await keep("fail"); }
        else {
          let last: Source | null = null;
          for (const item of items) {
            const dup = await findDuplicate(w, item);
            if (dup?.sure) { last = dup.source; continue; }
            last = await addSource(w, item, { via: shape === "csl" ? "csl" : shape, verified: true });
          }
          setDecided("bib");
          if (last) setMade({ href: `/tools/research/library/${last.id}`, title: last.title });
        }
      } else {
        await keep("note");
      }
      cue("saved");
      setLine("");
      await reload();
    } finally { setBusy(false); }
  }, [w, line, busy, reload]);

  useEffect(() => { void serviceStatus().then((s) => setEmbedOn(s?.embed === "on")); }, []);

  /* One search over everything, from two characters; and, where
     the embeddings are on, the nearest passages by meaning through
     the RPC that runs as the reader. */
  useEffect(() => {
    if (!w || q.trim().length < 2) { setHits(null); setPassages(null); return; }
    let alive = true;
    const t = setTimeout(() => {
      void Promise.all([
        listSources(w, { q, limit: 20 }), listNotes(w, { q, limit: 20 }), listQuestions(w), listTasks(w),
      ]).then(([s, n, qs, ts]) => {
        if (!alive) return;
        const needle = q.trim().toLowerCase();
        setHits({
          sources: s, notes: n,
          questions: qs.filter((x) => x.text.toLowerCase().includes(needle)).slice(0, 20),
          tasks: ts.filter((x) => x.title.toLowerCase().includes(needle)).slice(0, 20),
        });
      });
      if (embedOn && q.trim().length >= 3) {
        void embedTexts(w, [q.trim()]).then((v) => (v?.[0] ? matchChunks(w, v[0], 8) : [])).then((m) => { if (alive) setPassages(m); });
      }
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [w, q, embedOn]);

  const today = tasks.filter((t) => t.lane === "today");

  const tick = async (t: Task): Promise<void> => {
    if (!w) return;
    const r = await saveTask(w, t, { lane: "done" });
    if (r.ok) { cue("tick"); setTasks((was) => was.map((x) => (x.id === t.id ? r.row : x))); }
  };

  const file = async (n: Note): Promise<void> => {
    if (!w) return;
    const r = await saveNote(w, n.id, { filed_at: new Date().toISOString(), kind: "permanent" }, n.title);
    if (r.ok) setInbox((was) => was.filter((x) => x.id !== n.id));
  };

  if (!w) return <SignedOut answered={answered} />;

  return (
    <div className="grid gap-6">
      {/* ---- the capture line ---- */}
      <Surface material="pane" className="rs-tint px-5 py-4 grid gap-3" accent={toneVar("gold")}>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => { e.preventDefault(); void capture(); }}
        >
          <div className="grow min-w-[16rem]">
            <Field
              id="rs-capture"
              ref={box}
              label={<W k="rs.board.capture" />}
              hint={<W k="rs.board.capture.hint" />}
              value={line}
              onChange={(e) => { setLine(e.target.value); setDecided(null); }}
              autoComplete="off"
              disabled={busy}
            />
          </div>
          <Button type="submit" kind="solid" disabled={busy || !line.trim()}>
            <Icon name="spark" size={16} /> <W k="rs.board.capture" />
          </Button>
        </form>
        {decided ? (
          <p className="text-t2 text-ink-soft" role="status">
            <W k={`rs.board.decided.${decided}`} />
            {made ? <> <Link href={made.href}>{made.title}</Link></> : null}
          </p>
        ) : null}
      </Surface>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---- today ---- */}
        <Surface material="pane" className="rs-tint px-5 py-4 grid gap-3" accent={toneVar("gold")}>
          <h2 className="text-t3 font-medium flex items-center gap-2">
            <Icon name="calendar" size={18} /> <W k="rs.board.today" />
          </h2>
          {today.length ? (
            <ul className="grid gap-1">
              {today.map((t) => (
                <li key={t.id} className="flex items-center gap-2">
                  <ChipButton onClick={() => { void tick(t); }} aria-label={`${both("rs.tasks.move")}: ${t.title}`}>
                    <Icon name="check" size={14} />
                  </ChipButton>
                  <span>{t.title}</span>
                  {t.due ? <span className="text-t1 text-ink-soft mono">{t.due}</span> : null}
                </li>
              ))}
            </ul>
          ) : <p className="text-t2 text-ink-soft"><W k="rs.board.today.empty" /></p>}
          {dates.length ? (
            <ul className="grid gap-1 text-t2" aria-label={both("rs.plan.next")}>
              {dates.map((e) => (
                <li key={e.id} className="flex items-baseline gap-2">
                  <span className="text-t1 text-ink-soft mono">{e.starts.slice(5, 10)}</span>
                  <span>{e.title}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <ChipLink href="/tools/research/plan"><T en="The planner" bn="পরিকল্পনা" /></ChipLink>
        </Surface>

        {/* ---- pick up where you left off ---- */}
        <Surface material="pane" className="rs-tint px-5 py-4 grid gap-3" accent={toneVar("blue")}>
          <h2 className="text-t3 font-medium flex items-center gap-2">
            <Icon name="keep" size={18} /> <W k="rs.board.resume" />
          </h2>
          {recent.length ? (
            <ul className="grid gap-1">
              {dedupe(recent).slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-baseline gap-2 text-t2">
                  <span className="text-t1 text-ink-soft mono">{when(a.created_at)}</span>
                  <Link href={hrefOf(a)}>{a.summary || a.kind}</Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-t2 text-ink-soft"><W k="rs.board.resume.empty" /></p>}
        </Surface>

        {/* ---- the inbox ---- */}
        <Surface material="pane" className="rs-tint px-5 py-4 grid gap-3" accent={toneVar("plum")}>
          <h2 className="text-t3 font-medium flex items-center gap-2">
            <Icon name="note" size={18} /> <W k="rs.board.inbox" />
            {inbox.length ? <Chip>{inbox.length}</Chip> : null}
          </h2>
          {inbox.length ? (
            <ul className="grid gap-1">
              {inbox.map((n) => (
                <li key={n.id} className="flex items-center gap-2">
                  <ChipButton onClick={() => { void file(n); }} aria-label={`${both("rs.board.inbox")}: ${n.title}`}>
                    <Icon name="check" size={14} />
                  </ChipButton>
                  <Link href={`/tools/research/notes/${n.id}`} className="grow">{n.title || n.text.slice(0, 80)}</Link>
                  <span className="text-t1 text-ink-soft mono">{when(n.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-t2 text-ink-soft"><W k="rs.board.inbox.empty" /></p>}
        </Surface>

        {/* ---- one search over everything ---- */}
        <Surface material="pane" className="rs-tint px-5 py-4 grid gap-3" accent={toneVar("teal")}>
          <h2 className="text-t3 font-medium flex items-center gap-2">
            <Icon name="search" size={18} /> <W k="rs.board.search" />
          </h2>
          <Field id="rs-search" label={<W k="rs.board.search" />} hideLabel
                 value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off"
                 placeholder={both("rs.board.search")} />
          {hits ? <Hits hits={hits} /> : <p className="text-t2 text-ink-soft"><W k="rs.board.search.empty" /></p>}
          {passages?.length ? (
            <div className="grid gap-1" data-testid="rs-board-passages">
              <h3 className="text-t2 font-medium"><W k="rs.board.passages" /></h3>
              {passages.map((m) => (
                <Link key={m.id} href={chunkHref(m.kind, m.ref_id)} className="flex gap-2 items-baseline">
                  <span className="grow">{m.title}</span>
                  <span className="text-t1 text-ink-soft mono shrink-0">{Math.round(m.similarity * 100)}%</span>
                </Link>
              ))}
            </div>
          ) : null}
        </Surface>
      </div>

      {/* ---- the rooms ---- */}
      <section aria-labelledby="rs-rooms-h">
        <h2 id="rs-rooms-h" className="text-t3 font-medium mb-3"><W k="rs.rooms" /></h2>
        <div className="cards grid-3">
          {RESEARCH_PAGES.map((p) => (
            <GoCard
              key={p.href}
              href={p.href}
              art={p.art}
              accent={toneVar(p.tone)}
              chip={isOpen(p) ? undefined : <T en={`Stage ${p.stage}`} bn={`ধাপ ${p.stage}`} />}
              title={<T en={p.title.en} bn={p.title.bn} />}
              dek={<T en={p.dek.en} bn={p.dek.bn} />}
              go={<T en={p.go.en} bn={p.go.bn} />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/** Where an activity line leads. */
function hrefOf(a: Activity): string {
  const id = a.item_id ?? "";
  switch (a.kind) {
    case "sources": return `/tools/research/library/${id}`;
    case "notes": return `/tools/research/notes/${id}`;
    case "questions": return "/tools/research/questions";
    case "tasks": return "/tools/research/plan";
    case "projects": return "/tools/research/settings";
    default: return "/tools/research/archive";
  }
}

/** The same item touched five times is one line. */
function dedupe(list: Activity[]): Activity[] {
  const seen = new Set<string>();
  return list.filter((a) => {
    const k = `${a.kind}:${a.item_id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function Hits({ hits }: { hits: { sources: Source[]; notes: Note[]; questions: Question[]; tasks: Task[] } }) {
  const total = hits.sources.length + hits.notes.length + hits.questions.length + hits.tasks.length;
  if (!total) return <p className="text-t2 text-ink-soft"><W k="rs.board.nothing" /></p>;
  return (
    <div className="grid gap-2 text-t2">
      {hits.sources.map((s) => (
        <Link key={s.id} href={`/tools/research/library/${s.id}`} className="flex gap-2 items-baseline">
          <Chip>{s.type}</Chip><span>{s.title}</span>
          <span className="text-ink-soft text-t1 mono">{s.year ?? ""}</span>
        </Link>
      ))}
      {hits.notes.map((n) => (
        <Link key={n.id} href={`/tools/research/notes/${n.id}`} className="flex gap-2 items-baseline">
          <Chip>{n.kind}</Chip><span>{n.title || n.text.slice(0, 80)}</span>
        </Link>
      ))}
      {hits.questions.map((x) => (
        <Link key={x.id} href="/tools/research/questions" className="flex gap-2 items-baseline">
          <Chip>{x.kind}</Chip><span>{x.text}</span>
        </Link>
      ))}
      {hits.tasks.map((t) => (
        <Link key={t.id} href="/tools/research/plan" className="flex gap-2 items-baseline">
          <Chip>{t.lane}</Chip><span>{t.title}</span>
        </Link>
      ))}
    </div>
  );
}

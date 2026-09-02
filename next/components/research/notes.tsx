"use client";

/* ============================================================
   research/notes.tsx: the notebook.

   Six kinds of note, the daily log, the links between them, in
   the site's one editor: `createEditor()` out of `/editor.js`,
   mounted into a shell this file draws, exactly as the Studio
   and the practice books mount it. `CLAUDE.md` says why a second
   contenteditable is the bug and it is not repeated here.

   ---- the editor is mounted once per note id ----

   React owns the chrome and nothing inside the box. The handle
   is created when a note opens, handed the note's HTML once, and
   destroyed when the id changes or the room unmounts; the row is
   never written back into the box while it has the focus, which
   is the controlled-field rule one floor up.
   ============================================================ */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NOTE_KINDS, NOTE_KIND_NAMES, toneVar, type NoteKind } from "@reiad/shared/research";
import { word } from "@reiad/shared/research-words";
import {
  addNote, backlinks, bin, getSource, keepVersion, listNotes, listSources, saveNote,
  type Note, type Source, type Who,
} from "../../lib/research-api";
import { runtimeModule } from "../account/runtime";
import { Button } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { Empty } from "../ui/note";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { SAID, SETTLE, isoDay, useWho, when } from "./use-who";
import { useKeys } from "./keys";

interface EditorHandle {
  html(): string;
  setHtml(value: string): void;
  focus(): void;
  destroy(): void;
}
interface EditorModule {
  createEditor(o: {
    root: HTMLElement; onChange?: () => void; lang?: () => string | undefined;
    toast?: (m: string) => void;
  }): EditorHandle;
}

export function Notebook({ openId }: { openId?: string }) {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const router = useRouter();
  const params = useSearchParams();
  const [rows, setRows] = useState<Note[] | null>(null);
  const [open, setOpen] = useState<string | null>(openId ?? null);
  const [kind, setKind] = useState<NoteKind | "">("");
  const [find, setFind] = useState("");
  const findBox = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    if (!w) return;
    setRows(await listNotes(w, { kind: kind || undefined }));
  }, [w, kind]);

  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => { if (openId) setOpen(openId); }, [openId]);

  /* `?source=<id>&new=literature` from a source page: a new
     literature note bound to that source, made on arrival. */
  const wanted = params.get("new") as NoteKind | null;
  const sourceId = params.get("source");
  const madeFor = useRef<string | null>(null);
  useEffect(() => {
    if (!w || !wanted || madeFor.current === `${wanted}:${sourceId}`) return;
    madeFor.current = `${wanted}:${sourceId}`;
    void (async () => {
      const src = sourceId ? await getSource(w, sourceId) : null;
      const n = await addNote(w, {
        kind: wanted, source_id: src?.id ?? null, title: src ? src.title : "",
        projects: src?.projects ?? [],
      });
      if (n) { setOpen(n.id); router.replace(`/tools/research/notes/${n.id}`); await reload(); }
    })();
  }, [w, wanted, sourceId, router, reload]);

  const shown = useMemo(() => {
    if (!rows) return [];
    const needle = find.trim().toLowerCase();
    return needle ? rows.filter((n) => `${n.title} ${n.text} ${n.tags.join(" ")}`.toLowerCase().includes(needle)) : rows;
  }, [rows, find]);

  const current = useMemo(() => rows?.find((n) => n.id === open) ?? null, [rows, open]);

  const make = useCallback(async (k: NoteKind = "permanent") => {
    if (!w) return;
    const n = await addNote(w, {
      kind: k, title: k === "daily" ? isoDay() : "", day: k === "daily" ? isoDay() : null,
      text: k === "daily" ? word("rs.notes.daily.template")[lang] : "",
      body: k === "daily" ? word("rs.notes.daily.template")[lang].split("\n").map((l) => `<p>${l}</p>`).join("") : "",
    });
    if (n) { setOpen(n.id); await reload(); }
  }, [w, reload, lang]);

  const today = useCallback(async () => {
    if (!w) return;
    const have = await listNotes(w, { kind: "daily", day: isoDay(), limit: 1 });
    if (have[0]) { setOpen(have[0].id); return; }
    await make("daily");
  }, [w, make]);

  const move = useCallback((by: number) => {
    if (!shown.length) return;
    const at = shown.findIndex((n) => n.id === open);
    setOpen(shown[Math.min(shown.length - 1, Math.max(0, at + by))].id);
  }, [shown, open]);

  useKeys(useMemo(() => ({
    f: () => findBox.current?.focus(),
    n: () => { void make(); },
    j: () => move(1),
    k: () => move(-1),
    Escape: () => setOpen(null),
  }), [make, move]), Boolean(w));

  if (!w) return <SignedOut answered={answered} />;

  return (
    <div className="rs-panes">
      <section className="rs-list grid gap-3 content-start" aria-label="Notes / নোট">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" kind="solid" onClick={() => { void make(); }}><W k="rs.new" /></Button>
          <Button size="sm" kind="soft" onClick={() => { void today(); }}><W k="rs.notes.daily" /></Button>
        </div>
        <Field id="rs-find" ref={findBox} label={<W k="rs.find" />} hideLabel placeholder={both("rs.find")}
               value={find} onChange={(e) => setFind(e.target.value)} autoComplete="off" />
        <Select id="rs-kind" label={<W k="rs.notes.kind" />} value={kind} onChange={(e) => setKind(e.target.value as NoteKind | "")}>
          <option value="">{both("rs.all")}</option>
          {NOTE_KINDS.map((k) => <option key={k} value={k}>{NOTE_KIND_NAMES[k][lang]}</option>)}
        </Select>
        {rows === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
          : !shown.length ? <Empty title={<W k="rs.none" />} action={<span className="text-t2 text-ink-soft"><W k="rs.notes.empty" /></span>} />
            : (
              <ul className="rs-rows grid gap-1">
                {shown.map((n) => (
                  <li key={n.id}>
                    <button type="button" className="rs-row" aria-current={n.id === open ? "true" : undefined}
                            style={{ "--tone": toneVar("plum") } as React.CSSProperties}
                            onClick={() => setOpen(n.id)}>
                      <span className="rs-row-dot" aria-hidden="true" />
                      <span className="rs-row-main">
                        <span className="rs-row-title">{n.title || n.text.slice(0, 60) || NOTE_KIND_NAMES[n.kind][lang]}</span>
                        <span className="rs-row-sub">{NOTE_KIND_NAMES[n.kind][lang]}{n.day ? ` · ${n.day}` : ""}</span>
                      </span>
                      <span className="rs-row-meta"><span className="text-t1 text-ink-soft mono">{when(n.updated_at)}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
      </section>
      <section className="rs-main min-w-0">
        {current ? (
          <NoteCard key={current.id} w={w} note={current}
                    onChange={(n) => setRows((was) => (was ?? []).map((x) => (x.id === n.id ? n : x)))}
                    onGone={() => { setOpen(null); void reload(); }} />
        ) : (
          <Surface material="sunk" className="px-5 py-8 text-t2 text-ink-soft">
            <T en="Choose a note, or press New." bn="একটা নোট বাছুন, বা নতুন চাপুন।" />
          </Surface>
        )}
      </section>
    </div>
  );
}

function NoteCard({ w, note, onChange, onGone }: {
  w: Who; note: Note; onChange: (n: Note) => void; onGone: () => void;
}) {
  const lang = useToolLang();
  const [title, setTitle] = useState(note.title);
  const [tags, setTags] = useState(note.tags.join(", "));
  const [state, setState] = useState<"" | "saving" | "saved" | "conflict" | "failed">("");
  const [source, setSource] = useState<Source | null>(null);
  const [links, setLinks] = useState<Note[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const seen = useRef(note.updated_at);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const said = useRef<ReturnType<typeof setTimeout> | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorHandle | null>(null);

  useEffect(() => {
    void backlinks(w, note.id).then(setLinks);
    if (note.source_id) void getSource(w, note.source_id).then(setSource); else setSource(null);
    void listSources(w, { limit: 200 }).then(setSources);
  }, [w, note.id, note.source_id]);

  const write = useCallback(async (part: Partial<Note>) => {
    setState("saving");
    const r = await saveNote(w, note.id, part, part.title ?? note.title, seen.current);
    if (r.ok) {
      seen.current = r.row.updated_at;
      onChange(r.row);
      setState("saved");
      cue("saved");
      if (said.current) clearTimeout(said.current);
      said.current = setTimeout(() => setState(""), SAID);
      if (part.body) void keepVersion(w, "note", note.id, part.body);
    } else setState(r.conflict ? "conflict" : "failed");
  }, [w, note.id, note.title, onChange]);

  const later = useCallback((part: Partial<Note>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void write(part); }, SETTLE);
  }, [write]);

  /* The editor, once per note. */
  useEffect(() => {
    const root = box.current;
    if (!root) return undefined;
    let alive = true;
    void runtimeModule<EditorModule>("/editor.js").then((m) => {
      if (!alive || !box.current) return;
      const h = m.createEditor({
        root: box.current,
        lang: () => lang,
        onChange: () => later({ body: box.current?.innerHTML ?? "", text: box.current?.textContent ?? "" }),
      });
      h.setHtml(note.body || "<p></p>");
      editor.current = h;
    });
    return () => {
      alive = false;
      if (timer.current) { clearTimeout(timer.current); void write({ body: box.current?.innerHTML ?? "", text: box.current?.textContent ?? "" }); }
      editor.current?.destroy();
      editor.current = null;
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [note.id]);

  return (
    <div className="grid gap-4" style={{ "--accent": toneVar("plum") } as React.CSSProperties}>
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="accent">{NOTE_KIND_NAMES[note.kind][lang]}</Chip>
        {note.day ? <Chip>{note.day}</Chip> : null}
        <span className="text-t1 text-ink-soft mono grow text-right" role="status">
          {state === "saving" ? <W k="rs.saving" /> : state === "saved" ? <W k="rs.saved" />
            : state === "conflict" ? <W k="rs.conflict" /> : state === "failed" ? <W k="rs.notsaved" /> : null}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
        <Field id="rs-n-title" label={<W k="rs.notes.title" />} value={title}
               onChange={(e) => { setTitle(e.target.value); later({ title: e.target.value }); }} />
        <Select id="rs-n-kind" label={<W k="rs.notes.kind" />} value={note.kind}
                onChange={(e) => { void write({ kind: e.target.value as NoteKind }); }}>
          {NOTE_KINDS.map((k) => <option key={k} value={k}>{NOTE_KIND_NAMES[k][lang]}</option>)}
        </Select>
      </div>
      <Surface material="pane" className="px-5 py-4">
        <div ref={box} className="article rs-editor" contentEditable suppressContentEditableWarning
             aria-label={both("rs.notes.body")} data-lang={lang} />
      </Surface>
      <div className="grid gap-3 md:grid-cols-2">
        <Field id="rs-n-tags" label={<W k="rs.tags" />} value={tags}
               onChange={(e) => { setTags(e.target.value); later({ tags: e.target.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) }); }} />
        <Select id="rs-n-source" label={<W k="rs.notes.source" />} value={note.source_id ?? ""}
                onChange={(e) => { void write({ source_id: e.target.value || null }); }}>
          <option value="">–</option>
          {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </Select>
      </div>
      {source ? (
        <p className="text-t2"><W k="rs.notes.source" />: <Link href={`/tools/research/library/${source.id}`}>{source.title}</Link></p>
      ) : null}
      {links.length ? (
        <Surface material="sunk" className="px-4 py-3">
          <h3 className="text-t2 font-medium"><W k="rs.notes.backlinks" /></h3>
          <ul className="grid gap-1 text-t2">
            {links.map((l) => <li key={l.id}><Link href={`/tools/research/notes/${l.id}`}>{l.title || l.text.slice(0, 60)}</Link></li>)}
          </ul>
        </Surface>
      ) : null}
      <div className="flex gap-2">
        <ChipButton onClick={() => {
          if (!window.confirm(`${both("rs.delete")}: ${note.title || note.kind}?`)) return;
          void bin(w, "research_notes", note.id, note.title || note.kind).then((ok) => { if (ok) onGone(); });
        }}><W k="rs.delete" /></ChipButton>
        <span className="text-t1 text-ink-soft mono self-center"><W k="rs.updated" />: {when(note.updated_at)}</span>
      </div>
    </div>
  );
}

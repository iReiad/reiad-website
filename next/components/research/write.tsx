"use client";

/* ============================================================
   research/write.tsx: the writing desk. RESEARCH.md section 16.

   A document is a row and the editor is the site's one editor,
   mounted the way the notebook mounts it. What the desk adds is
   the citation chip: `@` in the text, or the button, opens a
   picker over the library, and the chip that lands carries the
   key and the locator in its href while its text is whatever the
   document's style rendered last. The whole document is rendered
   again through citeproc (lib/cite.ts) whenever a chip lands or
   the style changes, and the bibliography under it is what the
   same engine says, never typed.

   Footnotes exist because OSCOLA does: a marker at the caret and
   a note at the foot, numbered by position after every edit, and
   a note style renders a note's chips as one citation with ibid.

   The outline is the headings; the counts are derived; the
   claims audit and the overlap check are panes over the same
   text. Word, Markdown and LaTeX come out of one row.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CslItem } from "@reiad/shared/research";
import { sourceType, toneVar } from "@reiad/shared/research";
import { CSL_STYLES } from "@reiad/shared/csl";
import {
  chipHtml, claimsOf, countWords, keysCited, outlineOf, overlapsOf, readingMinutes, renumber, textOf, toLatex, toMarkdown,
  type Chip,
} from "@reiad/shared/research-write";
import { toBibtex } from "@reiad/shared/research-bib";
import {
  DOCUMENT_KINDS, DOCUMENT_STATES, addDocument, bin, getDocument, listDocuments, listProjects, listSources,
  listVersions, rows, saveDocument, saveSource, snapshot,
  type Document, type DocumentKind, type DocumentState, type Highlight, type Project, type Source, type Version, type Who,
} from "../../lib/research-api";
import { isNoteStyle, makeEngine, preview, renderDocument } from "../../lib/cite";
import { runtimeModule } from "../account/runtime";
import { Button } from "../ui/button";
import { Chip as Pill, ChipButton, ChipLink } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { Meter } from "../ui/meter";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho, SETTLE, SAID, when } from "./use-who";
import { useKeys } from "./keys";

interface EditorHandle {
  insertHtmlAtCaret(html: string): void;
  html(): string;
  setHtml(value: string): void;
  focus(): void;
  destroy(): void;
}
interface EditorModule {
  createEditor(o: { root: HTMLElement; onChange?: () => void; lang?: () => string | undefined }): EditorHandle;
}

const KIND_TONES: Record<DocumentKind, string> = { chapter: "violet", paper: "blue", proposal: "gold", abstract: "teal", letter: "rose", other: "plum" };
const KIND_NAMES: Record<DocumentKind, { en: string; bn: string }> = {
  chapter: { en: "Chapter", bn: "অধ্যায়" }, paper: { en: "Paper", bn: "পেপার" }, proposal: { en: "Proposal", bn: "প্রস্তাব" },
  abstract: { en: "Abstract", bn: "সারাংশ" }, letter: { en: "Letter", bn: "চিঠি" }, other: { en: "Other", bn: "অন্য" },
};
const STATE_NAMES: Record<DocumentState, { en: string; bn: string }> = {
  outline: { en: "Outline", bn: "রূপরেখা" }, drafting: { en: "Drafting", bn: "খসড়া" }, revising: { en: "Revising", bn: "সংশোধন" }, done: { en: "Done", bn: "শেষ" },
};

export function Desk({ openId }: { openId?: string }) {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [docs, setDocs] = useState<Document[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [open, setOpen] = useState<string | null>(openId ?? null);
  const [doc, setDoc] = useState<Document | null>(null);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<DocumentKind>("chapter");

  useEffect(() => {
    if (!w) return;
    void listDocuments(w).then(setDocs);
    void listProjects(w).then(setProjects);
    void listSources(w, { limit: 2000 }).then(setSources);
  }, [w]);
  useEffect(() => {
    if (!w || !open) { setDoc(null); return; }
    void getDocument(w, open).then(setDoc);
  }, [w, open]);

  const make = useCallback(async () => {
    if (!w || !title.trim()) return;
    const d = await addDocument(w, { title: title.trim(), kind, position: (docs?.length ?? 0) + 1 });
    if (d) { setDocs((was) => [...(was ?? []), d]); setOpen(d.id); setTitle(""); cue("saved"); }
  }, [w, title, kind, docs]);

  useKeys(useMemo(() => ({ n: () => document.getElementById("rs-d-new")?.focus() }), []), Boolean(w));

  if (!w) return <SignedOut answered={answered} />;

  return (
    <div className="rs-panes">
      <section className="rs-list grid gap-3 content-start" aria-label={both("rs.write.documents")}>
        <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2" accent={toneVar("violet")}>
          <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); void make(); }}>
            <Field id="rs-d-new" label={<W k="rs.write.new" />} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
            <div className="flex gap-2 items-end">
              <div className="grow">
                <Select id="rs-d-kind" label={<W k="rs.write.kind" />} value={kind} onChange={(e) => setKind(e.target.value as DocumentKind)}>
                  {DOCUMENT_KINDS.map((k) => <option key={k} value={k}>{KIND_NAMES[k][lang]}</option>)}
                </Select>
              </div>
              <Button type="submit" kind="solid" size="sm" disabled={!title.trim()}><W k="rs.write.new" /></Button>
            </div>
          </form>
        </Surface>
        {docs === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
          : !docs.length ? <p className="text-t2 text-ink-soft"><W k="rs.write.empty" /></p> : (
            <ul className="rs-rows grid gap-1">
              {docs.map((d) => (
                <li key={d.id}>
                  <button type="button" className="rs-row" aria-current={d.id === open ? "true" : undefined}
                          style={{ "--tone": toneVar(KIND_TONES[d.kind] as "blue") } as React.CSSProperties} onClick={() => setOpen(d.id)}>
                    <span className="rs-row-dot" aria-hidden="true" />
                    <span className="rs-row-main">
                      <span className="rs-row-title">{d.title || KIND_NAMES[d.kind][lang]}</span>
                      <span className="rs-row-sub">{KIND_NAMES[d.kind][lang]} · {STATE_NAMES[d.state][lang]}{d.budget ? ` · ${countWords(d.text)} / ${d.budget}` : ` · ${countWords(d.text)} ${both("rs.write.words")}`}</span>
                    </span>
                    <span className="rs-row-meta"><span className="text-t1 text-ink-soft mono">{when(d.updated_at)}</span></span>
                  </button>
                </li>
              ))}
            </ul>
          )}
      </section>
      <section className="rs-main min-w-0" aria-live="polite">
        {doc ? (
          <Paper key={doc.id} w={w} doc={doc} sources={sources} projects={projects}
                 onChange={(d) => { setDoc(d); setDocs((was) => (was ?? []).map((x) => x.id === d.id ? { ...x, ...d, body: x.body } : x)); }}
                 onGone={() => { setDocs((was) => (was ?? []).filter((x) => x.id !== doc.id)); setOpen(null); }}
                 onSourceChange={(s) => setSources((was) => was.map((x) => x.id === s.id ? s : x))} />
        ) : open ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p> : <p className="text-t2 text-ink-soft"><W k="rs.write.pick" /></p>}
      </section>
    </div>
  );
}

/* ---------- one document ---------- */

function Paper({ w, doc, sources, projects, onChange, onGone, onSourceChange }: {
  w: Who; doc: Document; sources: Source[]; projects: Project[];
  onChange: (d: Document) => void; onGone: () => void; onSourceChange: (s: Source) => void;
}) {
  const lang = useToolLang();
  const box = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorHandle | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const said = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seen = useRef(doc.updated_at);
  const [state, setState] = useState<"" | "saving" | "saved" | "conflict" | "failed">("");
  const [title, setTitle] = useState(doc.title);
  const [body, setBody] = useState(doc.body);
  const [bib, setBib] = useState("");
  const [picker, setPicker] = useState(false);
  const [quotes, setQuotes] = useState(false);
  const [pane, setPane] = useState<"outline" | "audit" | "overlap" | "versions">("outline");
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [others, setOthers] = useState<{ name: string; text: string }[]>([]);
  const [files, setFiles] = useState<{ word?: string; md?: string; tex?: string; bib?: string } | null>(null);
  const [snapName, setSnapName] = useState("");
  /* Where the caret was in the prose the last time it was there.
     Opening the picker moves the focus into a field, and the
     insertion has to land where the reader was writing, not where
     the selection is now. */
  const caret = useRef<Range | null>(null);
  useEffect(() => {
    const keep = (): void => {
      const sel = document.getSelection();
      if (sel?.rangeCount && box.current?.contains(sel.anchorNode)) caret.current = sel.getRangeAt(0).cloneRange();
    };
    document.addEventListener("selectionchange", keep);
    return () => document.removeEventListener("selectionchange", keep);
  }, []);
  const restoreCaret = useCallback(() => {
    editor.current?.focus();
    const r = caret.current;
    if (!r || !box.current?.contains(r.startContainer) || !document.contains(r.endContainer)) {
      const range = document.createRange();
      if (box.current) { range.selectNodeContents(box.current); range.collapse(false); }
      const sel = document.getSelection(); sel?.removeAllRanges(); sel?.addRange(range);
      return;
    }
    const sel = document.getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
  }, []);

  const items = useMemo((): CslItem[] => sources.map((s) => ({ ...s.csl, id: s.key })), [sources]);

  const write = useCallback(async (part: Partial<Document>) => {
    setState("saving");
    const r = await saveDocument(w, doc, part, seen.current);
    if (r.ok) {
      seen.current = r.row.updated_at;
      onChange(r.row);
      setState("saved");
      if (said.current) clearTimeout(said.current);
      said.current = setTimeout(() => setState(""), SAID);
    } else setState(r.conflict ? "conflict" : "failed");
  }, [w, doc, onChange]);

  const later = useCallback((part: Partial<Document>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void write(part); }, SETTLE);
  }, [write]);

  /** The body as the editor holds it, renumbered, saved. */
  const changed = useCallback(() => {
    /* A contenteditable lets the first keystroke land before the
       first <p>; the text node is moved into one, which keeps the
       caret with it. */
    for (const n of [...(box.current?.childNodes ?? [])]) {
      if (n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim()) {
        const p = document.createElement("p");
        n.replaceWith(p);
        p.appendChild(n);
      }
    }
    const raw = box.current?.innerHTML ?? "";
    const fixed = renumber(raw);
    if (fixed !== raw && editor.current) editor.current.setHtml(fixed);
    setBody(fixed);
    later({ body: fixed, text: textOf(fixed) });
  }, [later]);

  useEffect(() => {
    const root = box.current;
    if (!root) return undefined;
    let alive = true;
    void runtimeModule<EditorModule>("/editor.js").then((m) => {
      if (!alive || !box.current) return;
      const h = m.createEditor({ root: box.current, lang: () => lang, onChange: changed });
      h.setHtml(doc.body || "<p></p>");
      editor.current = h;
    });
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "@" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setPicker(true); }
    };
    /* Capture, so the editor's own key handling never sees the @. */
    root.addEventListener("keydown", onKey, true);
    return () => {
      alive = false;
      root.removeEventListener("keydown", onKey, true);
      if (timer.current) { clearTimeout(timer.current); const html = box.current?.innerHTML ?? ""; void write({ body: html, text: textOf(html) }); }
      editor.current?.destroy();
      editor.current = null;
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [doc.id]);

  /* Every chip rendered again in the style, and the bibliography
     made; a cited source moves to status cited. */
  const render = useCallback(async (styleId = doc.style) => {
    if (!editor.current) return;
    try {
      const engine = await makeEngine(styleId, items);
      const out = renderDocument(engine, editor.current.html());
      editor.current.setHtml(out.html);
      setBib(out.bibliography);
      setBody(out.html);
      later({ body: out.html, text: textOf(out.html) });
      for (const key of out.cited) {
        const s = sources.find((x) => x.key === key);
        if (s && s.status !== "cited") { const r = await saveSource(w, s, { status: "cited" }); if (r.ok) onSourceChange(r.row); }
      }
    } catch (err) { console.warn("render", err); }
  }, [doc.style, items, later, sources, w, onSourceChange]);

  useEffect(() => { if (keysCited(doc.body).length) { const t = setTimeout(() => { void render(); }, 600); return () => clearTimeout(t); } return undefined; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [doc.id]);

  const insertChip = useCallback(async (chip: Chip) => {
    if (!editor.current) return;
    let text = `(${chip.key})`;
    try { text = preview(await makeEngine(doc.style, items), chip); } catch { /* the render will fix it */ }
    restoreCaret();
    editor.current.insertHtmlAtCaret(chipHtml(chip, text) + " ");
    setPicker(false);
    cue("tick");
    changed();
    void render();
  }, [doc.style, items, changed, render, restoreCaret]);

  const insertFootnote = useCallback(() => {
    if (!editor.current || !box.current) return;
    const n = box.current.querySelectorAll("a.fn-ref").length + 1;
    restoreCaret();
    /* The marker where the caret is; the list is made here rather
       than through the editor, so a note is one <li> the reader can
       type into at once. renumber() then says the order. */
    editor.current.insertHtmlAtCaret(`<sup><a class="fn-ref" href="#fn-${n}">${n}</a></sup>&nbsp;`);
    let list = box.current.querySelector("ol.fn");
    if (!list) { list = document.createElement("ol"); list.className = "fn"; box.current.appendChild(list); }
    const li = document.createElement("li");
    li.appendChild(document.createTextNode("\u00a0"));
    list.appendChild(li);
    changed();
    /* changed() may have re-set the HTML; the note is found again
       rather than remembered. */
    const target = box.current.querySelector("ol.fn li:last-child");
    if (target && document.contains(target)) {
      const range = document.createRange();
      range.selectNodeContents(target);
      range.collapse(false);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [changed, restoreCaret]);

  const insertQuote = useCallback((h: Highlight, s: Source) => {
    if (!editor.current) return;
    const chip: Chip = { key: s.key, locator: h.page ? String(h.page) : undefined };
    const long = countWords(h.quote) > 40;
    restoreCaret();
    editor.current.insertHtmlAtCaret(long
      ? `<blockquote>${h.quote.replace(/</g, "&lt;")} ${chipHtml(chip, `(${s.key})`)}</blockquote><p></p>`
      : `“${h.quote.replace(/</g, "&lt;")}” ${chipHtml(chip, `(${s.key})`)} `);
    setQuotes(false);
    changed();
    void render();
  }, [changed, render, restoreCaret]);

  const restyle = useCallback((styleId: string) => { void write({ style: styleId }); void render(styleId); }, [write, render]);

  const exportAll = useCallback(async () => {
    const html = editor.current?.html() ?? body;
    const cited = keysCited(html);
    const citedItems = cited.map((k) => sources.find((s) => s.key === k)).filter((s): s is Source => Boolean(s));
    const blob = (text: string, type: string): string => URL.createObjectURL(new Blob([text], { type }));
    const out: typeof files = {
      md: blob(toMarkdown(html, doc.title), "text/markdown"),
      tex: blob(toLatex(html, doc.title), "application/x-tex"),
      bib: blob(citedItems.map((s) => toBibtex(s.csl, s.key)).join("\n\n"), "application/x-bibtex"),
    };
    try {
      const { toDocx } = await import("../../lib/export-docx");
      const word = await toDocx({ title: doc.title, html, bibliography: bib, author: doc.meta.author, affiliation: doc.meta.affiliation, bangla: lang === "bn" });
      out.word = URL.createObjectURL(word);
    } catch (err) { console.warn("docx", err); }
    setFiles(out);
    cue("saved");
  }, [body, sources, doc, bib, lang]);

  const keepSnapshot = useCallback(async () => {
    if (!snapName.trim()) return;
    await snapshot(w, { ...doc, body: editor.current?.html() ?? body }, snapName.trim());
    setSnapName("");
    cue("saved");
    setVersions(await listVersions(w, doc.id));
  }, [w, doc, body, snapName]);

  useEffect(() => { if (pane === "versions") void listVersions(w, doc.id).then(setVersions); }, [pane, w, doc.id]);
  useEffect(() => {
    if (pane !== "overlap") return;
    void (async () => {
      const docs = await listDocuments(w);
      const from: { name: string; text: string }[] = [];
      for (const s of sources) if (s.abstract) from.push({ name: s.title, text: s.abstract });
      for (const d of docs) if (d.id !== doc.id && d.text) from.push({ name: d.title, text: d.text });
      const notes = await rows<{ title: string; text: string }>(w, "research_notes", "select=title,text&deleted_at=is.null&limit=500");
      for (const n of notes) if (n.text) from.push({ name: n.title || "note", text: n.text });
      setOthers(from);
    })();
  }, [pane, w, doc.id, sources]);

  const text = useMemo(() => textOf(body), [body]);
  const words = countWords(text);
  const outline = useMemo(() => outlineOf(body), [body]);
  const claims = useMemo(() => pane === "audit" ? claimsOf(body) : [], [pane, body]);
  const overlaps = useMemo(() => pane === "overlap" ? overlapsOf(text, others) : [], [pane, text, others]);
  const cited = keysCited(body).length;
  const budgets = doc.outline;
  const day = new Date().toISOString().slice(0, 10);
  const slug = (doc.title || doc.kind).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="grid gap-3" style={{ "--accent": toneVar(KIND_TONES[doc.kind] as "blue") } as React.CSSProperties}>
      <Surface material="pane" className="rs-tint px-4 py-3 grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">{KIND_NAMES[doc.kind][lang]}</Pill>
          <span className="text-t1 text-ink-soft mono grow text-right" role="status">
            {state === "saving" ? <W k="rs.saving" /> : state === "saved" ? <W k="rs.saved" /> : state === "conflict" ? <W k="rs.write.conflict" /> : state === "failed" ? <W k="rs.notsaved" /> : null}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_9rem_9rem]">
          <Field id="rs-d-title" label={<W k="rs.write.title" />} value={title} onChange={(e) => { setTitle(e.target.value); later({ title: e.target.value }); }} />
          <Select id="rs-d-state" label={<W k="rs.write.state" />} value={doc.state} onChange={(e) => { void write({ state: e.target.value as DocumentState }); }}>
            {DOCUMENT_STATES.map((s) => <option key={s} value={s}>{STATE_NAMES[s][lang]}</option>)}
          </Select>
          <Field id="rs-d-budget" label={<W k="rs.write.budget" />} inputMode="numeric" defaultValue={doc.budget ?? ""} onBlur={(e) => { void write({ budget: Number(e.target.value) || null }); }} />
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <Select id="rs-d-style" label={<W k="rs.write.style" />} value={doc.style} onChange={(e) => restyle(e.target.value)}>
            {CSL_STYLES.map((s) => <option key={s.id} value={s.id}>{s.name}{s.note ? " (footnotes)" : ""}</option>)}
          </Select>
          <Select id="rs-d-project" label={<W k="rs.project" />} value={doc.project_id ?? ""} onChange={(e) => { void write({ project_id: e.target.value || null }); }}>
            <option value="">{both("rs.noproject")}</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Field id="rs-d-author" label={<W k="rs.write.author" />} defaultValue={doc.meta.author ?? ""} onBlur={(e) => { void write({ meta: { ...doc.meta, author: e.target.value } }); }} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ChipButton onClick={() => setPicker((p) => !p)} pressed={picker} title={both("rs.write.cite.hint")}>@ <W k="rs.write.cite" /></ChipButton>
          <ChipButton onClick={insertFootnote} title={both("rs.write.footnote.hint")}>¹ <W k="rs.write.footnote" /></ChipButton>
          <ChipButton onClick={() => setQuotes((q) => !q)} pressed={quotes}><W k="rs.write.quote" /></ChipButton>
          <ChipButton onClick={() => { void render(); }}><W k="rs.write.render" /></ChipButton>
          <span className="grow" />
          <ChipButton onClick={() => { void exportAll(); }}><W k="rs.write.export" /></ChipButton>
          {files?.word ? <ChipLink href={files.word} download={`${slug}-${day}.docx`}><W k="rs.write.export.word" /></ChipLink> : null}
          {files?.md ? <ChipLink href={files.md} download={`${slug}-${day}.md`}><W k="rs.write.export.md" /></ChipLink> : null}
          {files?.tex ? <ChipLink href={files.tex} download={`${slug}-${day}.tex`}><W k="rs.write.export.tex" /></ChipLink> : null}
          {files?.bib ? <ChipLink href={files.bib} download={`library-${day}.bib`}>BibTeX</ChipLink> : null}
          <ChipButton onClick={() => window.print()}><W k="rs.write.export.print" /></ChipButton>
        </div>
        {picker ? <CitePicker sources={sources} styleId={doc.style} items={items} onPick={(c) => { void insertChip(c); }} onClose={() => setPicker(false)} /> : null}
        {quotes ? <QuotePicker w={w} sources={sources} onPick={insertQuote} /> : null}
      </Surface>

      <div className="rs-reader">
        <div className="min-w-0 grid gap-2">
          <Surface material="pane" className="px-5 py-4">
            <div ref={box} className="rs-editor article" lang={lang} contentEditable suppressContentEditableWarning />
            {bib ? <div className="article" dangerouslySetInnerHTML={{ __html: bib }} /> : null}
          </Surface>
          <p className="text-t1 text-ink-soft mono px-1">
            {words} <W k="rs.write.words" />{doc.budget ? ` ${both("rs.write.of")} ${doc.budget}` : ""} · {readingMinutes(words)} <W k="rs.write.minutes" /> · {cited} <W k="rs.write.citations" />
          </p>
          {doc.budget ? <Meter done={words} total={doc.budget} label={both("rs.write.budget")} size="sm" /> : null}
        </div>
        <aside className="rs-side grid gap-3">
          <Surface material="pane" className="px-4 py-3 grid gap-3">
            <div className="flex flex-wrap gap-1">
              {(["outline", "audit", "overlap", "versions"] as const).map((p) => (
                <ChipButton key={p} pressed={pane === p} onClick={() => setPane(p)}>{both(`rs.write.${p}`)}</ChipButton>
              ))}
            </div>
            {pane === "outline" ? (
              <>
                <p className="text-t1 text-ink-soft"><W k="rs.write.outline.hint" /></p>
                {outline.length ? (
                  <ol className="grid gap-2 text-t2">
                    {outline.map((h) => {
                      const budget = budgets.find((b) => b.text === h.text)?.budget;
                      return (
                        <li key={h.index} className={h.level === 3 ? "pl-4" : ""}>
                          <div className="flex items-baseline gap-2">
                            <button type="button" className="text-left bg-transparent border-0 p-0 cursor-pointer hover:underline" style={{ color: "inherit", font: "inherit" }}
                                    onClick={() => { const el = [...(box.current?.querySelectorAll("h2, h3") ?? [])][h.index]; el?.scrollIntoView({ block: "center", behavior: "smooth" }); }}>
                              {h.text || "…"}
                            </button>
                            <span className="text-t1 text-ink-soft mono">{h.words}{budget ? ` / ${budget}` : ""}</span>
                          </div>
                          {budget ? <Meter done={h.words} total={budget} label={h.text} size="sm" /> : null}
                          <div className="mt-1 max-w-[8rem]">
                            <Field id={`rs-d-b-${h.index}`} label={`${both("rs.write.budget")}: ${h.text}`} hideLabel inputMode="numeric" placeholder={both("rs.write.budget")} defaultValue={budget ?? ""}
                                   onBlur={(e) => { const next = budgets.filter((b) => b.text !== h.text); if (Number(e.target.value)) next.push({ text: h.text, budget: Number(e.target.value) }); void write({ outline: next }); }} />
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : <p className="text-t2 text-ink-soft"><W k="rs.write.outline.empty" /></p>}
              </>
            ) : null}
            {pane === "audit" ? (
              <>
                <p className="text-t1 text-ink-soft"><W k="rs.write.audit.hint" /></p>
                {claims.filter((c) => !c.cited).length ? (
                  <ul className="grid gap-2 text-t2">
                    {claims.filter((c) => !c.cited).map((c, i) => (
                      <li key={i} className="rs-hl-card" style={{ "--tone": toneVar(c.why === "number" ? "gold" : "rose") } as React.CSSProperties}>
                        <span className="text-t1 text-ink-soft mono">{c.why} · {both("rs.write.audit.uncited")}</span>
                        <blockquote>{c.sentence}</blockquote>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-t2 text-ink-soft"><W k="rs.write.audit.clean" /></p>}
              </>
            ) : null}
            {pane === "overlap" ? (
              <>
                <p className="text-t1 text-ink-soft"><W k="rs.write.overlap.hint" /></p>
                {overlaps.length ? (
                  <ul className="grid gap-2 text-t2">
                    {overlaps.slice(0, 30).map((o, i) => (
                      <li key={i} className="rs-hl-card" style={{ "--tone": toneVar("rose") } as React.CSSProperties}>
                        <span className="text-t1 text-ink-soft mono">{o.words} <W k="rs.write.words" /> · {o.with}</span>
                        <blockquote>{o.run}</blockquote>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-t2 text-ink-soft"><W k="rs.write.overlap.clean" /></p>}
              </>
            ) : null}
            {pane === "versions" ? (
              <>
                <p className="text-t1 text-ink-soft"><W k="rs.write.snapshot.hint" /></p>
                <form className="flex gap-2 items-end" onSubmit={(e) => { e.preventDefault(); void keepSnapshot(); }}>
                  <div className="grow"><Field id="rs-d-snap" label={<W k="rs.write.snapshot.name" />} value={snapName} onChange={(e) => setSnapName(e.target.value)} /></div>
                  <Button type="submit" size="sm" kind="soft" disabled={!snapName.trim()}><W k="rs.write.snapshot" /></Button>
                </form>
                {versions === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p> : versions.length ? (
                  <ul className="grid gap-1 text-t2">
                    {versions.map((v) => (
                      <li key={v.id} className="flex flex-wrap items-center gap-2">
                        <span className="text-t1 text-ink-soft mono">{when(v.created_at)}</span>
                        <span className="grow">{(v as unknown as { label?: string }).label || countWords(textOf(v.body)) + " " + both("rs.write.words")}</span>
                        <ChipButton onClick={() => { editor.current?.setHtml(v.body); changed(); }}><W k="rs.write.restore" /></ChipButton>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-t2 text-ink-soft"><W k="rs.none" /></p>}
              </>
            ) : null}
          </Surface>
          <div>
            <Button kind="quiet" size="sm" onClick={() => { if (window.confirm(`${both("rs.delete")}: ${doc.title}?`)) void bin(w, "research_documents", doc.id, doc.title).then((ok) => { if (ok) onGone(); }); }}>
              <W k="rs.delete" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- the pickers ---------- */

function CitePicker({ sources, styleId, items, onPick, onClose }: {
  sources: Source[]; styleId: string; items: CslItem[]; onPick: (c: Chip) => void; onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [locator, setLocator] = useState("");
  const [key, setKey] = useState<string | null>(null);
  const [shown, setShown] = useState("");
  const box = useRef<HTMLInputElement>(null);
  useEffect(() => { box.current?.focus(); }, []);
  const hits = useMemo(() => {
    const n = q.trim().toLowerCase();
    return (n ? sources.filter((s) => `${s.title} ${s.authors} ${s.year ?? ""} ${s.key}`.toLowerCase().includes(n)) : sources).slice(0, 12);
  }, [q, sources]);
  useEffect(() => {
    if (!key) { setShown(""); return; }
    void makeEngine(styleId, items).then((e) => setShown(preview(e, { key, locator: locator || undefined }))).catch(() => setShown(""));
  }, [key, locator, styleId, items]);
  /* Enter with nothing chosen takes the first hit: typing "weather",
     a page, Enter is the whole gesture. */
  const go = (): void => { const k = key ?? hits[0]?.key; if (k) onPick({ key: k, locator: locator || undefined }); };
  return (
    <Surface material="sunk" className="px-4 py-3 grid gap-2" role="dialog" aria-label={both("rs.write.cite")}>
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_6rem_auto] items-end">
        <Field id="rs-c-q" ref={box} label={<W k="rs.write.cite.find" />} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off"
               onKeyDown={(e) => { if (e.key === "Escape") onClose(); if (e.key === "Enter") { e.preventDefault(); if (key) go(); else if (hits[0]) setKey(hits[0].key); } }} />
        <Field id="rs-c-loc" label={<W k="rs.write.cite.locator" />} value={locator} onChange={(e) => setLocator(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); go(); } }} />
        <Button size="sm" kind="solid" disabled={!key && !hits.length} onClick={go}><W k="rs.write.cite.insert" /></Button>
      </div>
      {shown ? <p className="text-t2" dangerouslySetInnerHTML={{ __html: shown }} /> : null}
      <ul className="grid gap-1 text-t2">
        {hits.map((s) => (
          <li key={s.id}>
            <button type="button" className="rs-row" aria-current={key === s.key ? "true" : undefined}
                    style={{ "--tone": toneVar(sourceType(s.type).tone) } as React.CSSProperties} onClick={() => setKey(s.key)} onDoubleClick={() => { setKey(s.key); onPick({ key: s.key, locator: locator || undefined }); }}>
              <span className="rs-row-dot" aria-hidden="true" />
              <span className="rs-row-main"><span className="rs-row-title">{s.title}</span><span className="rs-row-sub">{s.authors}{s.year ? ` · ${s.year}` : ""} · {s.key}</span></span>
            </button>
          </li>
        ))}
        {!hits.length ? <li className="text-t2 text-ink-soft"><W k="rs.none" /></li> : null}
      </ul>
    </Surface>
  );
}

function QuotePicker({ w, sources, onPick }: { w: Who; sources: Source[]; onPick: (h: Highlight, s: Source) => void }) {
  const [hs, setHs] = useState<Highlight[] | null>(null);
  useEffect(() => {
    void rows<Highlight>(w, "research_highlights", "select=id,source_id,page,quote,meaning,note,fields,position,file_key,prefix,suffix,rects,created_at,updated_at&order=created_at.desc&limit=200").then(setHs);
  }, [w]);
  return (
    <Surface material="sunk" className="px-4 py-3 grid gap-2">
      <h3 className="text-t2 font-medium"><W k="rs.write.quote" /></h3>
      {hs === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p> : hs.filter((h) => h.quote).length ? (
        <ul className="grid gap-1 text-t2 max-h-64 overflow-auto">
          {hs.filter((h) => h.quote).map((h) => {
            const s = sources.find((x) => x.id === h.source_id);
            if (!s) return null;
            return (
              <li key={h.id}>
                <button type="button" className="rs-row" onClick={() => onPick(h, s)}>
                  <span className="rs-row-dot" aria-hidden="true" />
                  <span className="rs-row-main"><span className="rs-row-title">{h.quote}</span><span className="rs-row-sub">{s.key}{h.page ? ` · p. ${h.page}` : ""}</span></span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : <p className="text-t2 text-ink-soft"><W k="rs.none" /></p>}
    </Surface>
  );
}



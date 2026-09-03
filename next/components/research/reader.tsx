"use client";

/* ============================================================
   research/reader.tsx: the reader. RESEARCH.md section 11.

   A PDF is drawn by pdf.js, self-hosted: the library is bundled by
   Next and its worker is a chunk of this build, so `script-src
   'self'` stays as it is. Each page is a canvas with a text layer
   over it, the text transparent, so what a reader selects is the
   words under the picture.

   ---- a highlight is anchored to text, not to pixels ----

   What is stored is the page, the words, thirty characters either
   side of them, and the rectangles they were drawn in at scale
   one. The rectangles are a cache: when they are missing (this
   file was re-OCRed, or the highlight came from another edition),
   `findAnchor()` looks the quote up in the page's own text and the
   rectangles are made again from the text layer. The same
   arithmetic draws a highlight over a captured web page, because
   the page's prose is DOM text like the text layer is.

   ---- five meanings, five colours, five keys ----

   1 to 5 while text is selected, or the bar that appears under
   the selection. A card on the right for each, with its note and
   its extraction fields; the cards are the source's outline when
   the reading is done.

   ---- the event records and the frame draws ----

   `selectionchange` fires on every character a drag covers. It
   records that there is a selection and the frame after it reads
   the range once, which is the rule `glow.tsx` explains at length.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import {
  HIGHLIGHT_MEANINGS, MEANING_NAMES, MEANING_TONES, anchorOf, findAnchor, referenceLine, toneVar,
  type HighlightMeaning, type SourceFile,
} from "@reiad/shared/research";
import {
  addHighlight, addNote, fileTicket, getSource, keepPlace, listHighlights, listNotes, removeHighlight,
  saveHighlight, saveSource, type Highlight, type Source, type Who,
} from "../../lib/research-api";
import { readKept } from "../../lib/offline-files";
import { Button } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho, SETTLE } from "./use-who";
import { useKeys } from "./keys";
import { FileBox } from "./files";

type Pdfjs = typeof import("pdfjs-dist");

/* ---------- where a file's bytes come from ---------- */

type From = "device" | "network";

/** The copy kept on this device first, then a ticket. A blob URL
    is handed back for the device copy so `<audio>`, `<img>` and
    the capture's fetch read it like any other address; the caller
    revokes it when it is done. */
async function fileSource(w: Who, key: string): Promise<{ url: string; from: From; blob: Blob | null } | null> {
  const blob = await readKept(key);
  if (blob) return { url: URL.createObjectURL(blob), from: "device", blob };
  const url = await fileTicket(w, key);
  return url ? { url, from: "network", blob: null } : null;
}

const letGo = (src: { url: string; from: From } | null): void => { if (src?.from === "device") URL.revokeObjectURL(src.url); };

/* ---------- a swipe turns the page, and never while selecting ----------

   Pointer events, touch only: a mouse has j and k. 60px mostly
   across counts; anything with a live selection at either end is
   the reader adjusting a highlight and is left alone. `pan-y` on
   the box keeps the browser from taking a horizontal drag as a
   scroll and cancelling the pointer before it is released. */

const SWIPE = 60;

function useSwipe(turn: (by: 1 | -1) => void, selecting: () => boolean) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "touch" || selecting()) { start.current = null; return; }
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  }, [selecting]);
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s || s.id !== e.pointerId || selecting()) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 2) return;
    turn(dx < 0 ? 1 : -1);
  }, [selecting, turn]);
  const onPointerCancel = useCallback(() => { start.current = null; }, []);
  return { onPointerDown, onPointerUp, onPointerCancel, style: { touchAction: "pan-y pinch-zoom" } as React.CSSProperties };
}

/** The library, loaded once and only in a browser. The worker is
    a module chunk of this build, named by URL so the bundler
    emits it under this origin. */
let pdfjsOnce: Promise<Pdfjs> | null = null;

/* The LEGACY build, on purpose. The modern one calls
   Map.prototype.getOrInsertComputed, the upsert proposal, which
   reached browsers in late 2025: a browser a year older throws
   "is not a function" from inside the worker and nothing draws,
   and a polyfill on the page does not reach a worker. The legacy
   build carries its own, feature-tested, in both halves. */
function loadPdfjs(): Promise<Pdfjs> {
  pdfjsOnce ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((lib) => {
    if (!lib.GlobalWorkerOptions.workerPort) {
      lib.GlobalWorkerOptions.workerPort = new Worker(
        new URL("../../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url),
        { type: "module" },
      );
    }
    return lib as unknown as Pdfjs;
  });
  return pdfjsOnce;
}

/* ---------- the text under a selection ---------- */

/** The text nodes of a container, in order, with where each
    starts in the container's text. */
function textNodes(root: HTMLElement): { node: Text; at: number }[] {
  const out: { node: Text; at: number }[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let at = 0;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const node = n as Text;
    out.push({ node, at });
    at += node.data.length;
  }
  return out;
}

const textOfNodes = (nodes: { node: Text }[]): string => nodes.map((n) => n.node.data).join("");

/** A Range's offsets into a container's text, or null when it is
    not inside it. */
function offsetsOf(range: Range, root: HTMLElement): { start: number; end: number } | null {
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  const nodes = textNodes(root);
  const at = (container: Node, offset: number): number => {
    if (container.nodeType === Node.TEXT_NODE) {
      const found = nodes.find((n) => n.node === container);
      return found ? found.at + offset : 0;
    }
    /* An element boundary: the position of its offset-th child. */
    const child = container.childNodes[offset] ?? null;
    if (!child) {
      const last = [...container.childNodes].reverse().map((c) => nodes.filter((n) => c.contains(n.node)).pop()).find(Boolean);
      return last ? last.at + last.node.data.length : 0;
    }
    const first = nodes.find((n) => child.contains(n.node) || child === n.node);
    return first ? first.at : 0;
  };
  const start = at(range.startContainer, range.startOffset);
  const end = at(range.endContainer, range.endOffset);
  return end > start ? { start, end } : null;
}

/** A Range over offsets into a container's text. */
function rangeOf(root: HTMLElement, start: number, end: number): Range | null {
  const nodes = textNodes(root);
  const range = document.createRange();
  let set = 0;
  for (const n of nodes) {
    const from = n.at;
    const to = n.at + n.node.data.length;
    if (!(set & 1) && start >= from && start < to) { range.setStart(n.node, start - from); set |= 1; }
    if (!(set & 2) && end > from && end <= to) { range.setEnd(n.node, end - from); set |= 2; }
    if (set === 3) break;
  }
  return set === 3 ? range : null;
}

/** Rectangles of a Range relative to a box, at scale one. Lines
    joined where a selection wraps. */
function rectsOf(range: Range, box: HTMLElement, scale: number): number[][] {
  const base = box.getBoundingClientRect();
  const out: number[][] = [];
  for (const r of range.getClientRects()) {
    if (r.width < 1 || r.height < 1) continue;
    const rect = [(r.left - base.left) / scale, (r.top - base.top) / scale, r.width / scale, r.height / scale]
      .map((v) => Math.round(v * 100) / 100);
    const last = out[out.length - 1];
    if (last && Math.abs(last[1] - rect[1]) < 2 && Math.abs(last[3] - rect[3]) < 2 && rect[0] <= last[0] + last[2] + 3) {
      last[2] = Math.max(last[2], rect[0] + rect[2] - last[0]);
    } else out.push(rect);
  }
  return out;
}

/* ---------- the reader ---------- */

type Mode = "pdf" | "html" | "audio" | "image" | "book" | "data" | "none";

export function Reader({ id }: { id: string }) {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [source, setSource] = useState<Source | null | undefined>(undefined);
  const [marks, setMarks] = useState<Highlight[]>([]);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [asked, setAsked] = useState<"no" | "asking" | "done">("no");
  const [line, setLine] = useState("");

  useEffect(() => {
    if (!w) return;
    void getSource(w, id).then((s) => {
      setSource(s);
      if (!s) return;
      const wanted = new URLSearchParams(location.search).get("file");
      const files = s.files as SourceFile[];
      const pick = files.find((f) => f.key === wanted) ?? files.find((f) => f.kind === "pdf") ?? files.find((f) => f.kind === "html") ?? files[0] ?? null;
      setFileKey(pick?.key ?? null);
    });
    void listHighlights(w, id).then(setMarks);
  }, [w, id]);

  const file = useMemo(() => (source?.files as SourceFile[] | undefined)?.find((f) => f.key === fileKey) ?? null, [source, fileKey]);
  const mode: Mode = !source ? "none" : file ? (file.kind === "data" ? "data" : file.kind) : source.type === "book" ? "book" : "none";

  const made = useCallback((h: Highlight | null) => {
    if (!h) return;
    setMarks((was) => [...was, h].sort((a, b) => (a.page ?? 0) - (b.page ?? 0) || a.created_at.localeCompare(b.created_at)));
    setCurrent(h.id);
    cue("tick");
  }, []);

  const changed = useCallback((h: Highlight) => {
    setMarks((was) => was.map((x) => x.id === h.id ? h : x));
  }, []);

  const gone = useCallback((h: Highlight) => {
    setMarks((was) => was.filter((x) => x.id !== h.id));
    if (current === h.id) setCurrent(null);
  }, [current]);

  /* Status: read, and the one question asked once. */
  const finish = useCallback(async () => {
    if (!w || !source) return;
    const r = await saveSource(w, source, { status: "read" }, source.updated_at);
    if (!r.ok) return;
    setSource(r.row);
    cue("lesson");
    const notes = await listNotes(w, { source: source.id, kind: "literature", limit: 1 });
    setAsked(notes.length ? "done" : "asking");
  }, [w, source]);

  const keepLine = useCallback(async () => {
    if (!w || !source || !line.trim()) return;
    const n = await addNote(w, {
      kind: "literature", source_id: source.id, title: source.title,
      text: line.trim(), body: `<p>${line.trim().replace(/</g, "&lt;")}</p>`,
    });
    if (n) { cue("saved"); setAsked("done"); }
  }, [w, source, line]);

  if (!w) return <SignedOut answered={answered} />;
  if (source === undefined) return <p className="text-t2 text-ink-soft" role="status"><W k="rs.moment" /></p>;
  if (source === null) return <p className="text-t2 text-ink-soft"><W k="rs.none" /></p>;

  const meaningWord = (m: HighlightMeaning): string => lang === "bn" ? MEANING_NAMES[m].bn : MEANING_NAMES[m].en;

  return (
    <div className="grid gap-4">
      <Surface material="pane" className="px-5 py-3 grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <ChipLink href="/tools/research/read"><W k="rs.read.back" /></ChipLink>
          <ChipLink href={`/tools/research/library/${source.id}`}><W k="rs.lib.open" /></ChipLink>
          <span className="grow" />
          <Chip>{both(`rs.lib.status.${source.status}`)}</Chip>
          {source.status !== "read" && source.status !== "annotated" && source.status !== "cited" ? (
            <Button size="sm" kind="soft" onClick={() => { void finish(); }}><W k="rs.read.done" /></Button>
          ) : null}
        </div>
        <p className="text-t2 leading-relaxed">{referenceLine(source.csl)}</p>
        {(source.files as SourceFile[]).length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {(source.files as SourceFile[]).map((f) => (
              <ChipButton key={f.key} pressed={f.key === fileKey} onClick={() => setFileKey(f.key)}>{f.name || f.ext}</ChipButton>
            ))}
          </div>
        ) : null}
        {asked === "asking" ? (
          <form className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto] items-end" onSubmit={(e) => { e.preventDefault(); void keepLine(); }}>
            <Field id="rs-said" label={<W k="rs.read.said" />} hint={<W k="rs.read.said.hint" />} value={line}
                   onChange={(e) => setLine(e.target.value)} autoComplete="off" autoFocus />
            <Button type="submit" kind="solid" size="sm" disabled={!line.trim()}><W k="rs.read.said.keep" /></Button>
            <Button type="button" kind="quiet" size="sm" onClick={() => setAsked("done")}><W k="rs.read.said.skip" /></Button>
          </form>
        ) : null}
      </Surface>

      {mode === "none" ? (
        <Surface material="pane" className="px-5 py-4">
          <FileBox w={w} source={source} onChange={(s) => { setSource(s); const f = (s.files as SourceFile[])[0]; if (f) setFileKey(f.key); }} />
        </Surface>
      ) : (
        <div className="rs-reader">
          <div className="min-w-0">
            {mode === "pdf" && file ? (
              <PdfSheet w={w} source={source} file={file} marks={marks} current={current} onCurrent={setCurrent} onMade={made} onSource={setSource} />
            ) : mode === "html" && file ? (
              <HtmlSheet w={w} source={source} file={file} marks={marks} current={current} onCurrent={setCurrent} onMade={made} />
            ) : mode === "audio" && file ? (
              <AudioSheet w={w} source={source} file={file} onMade={made} />
            ) : mode === "image" && file ? (
              <ImageSheet w={w} file={file} />
            ) : mode === "book" ? (
              <TypedSheet w={w} source={source} onMade={made} />
            ) : (
              <Surface material="pane" className="px-5 py-4"><p className="text-t2 text-ink-soft"><W k="rs.read.data" /></p></Surface>
            )}
          </div>
          <aside className="rs-side grid gap-3" aria-label={`${MEANING_NAMES.quote.en} / ${MEANING_NAMES.quote.bn}`}>
            <Surface material="pane" className="px-4 py-3 grid gap-3">
              <h2 className="text-t3 font-medium"><W k="rs.read.highlights" /> {marks.length ? <Chip>{marks.length}</Chip> : null}</h2>
              <p className="text-t1 text-ink-soft"><W k="rs.read.keys" /> <W k="rs.read.swipe" /></p>
              <ul className="flex flex-wrap gap-1" aria-hidden="true">
                {HIGHLIGHT_MEANINGS.map((m, i) => (
                  <li key={m} style={{ "--accent": toneVar(MEANING_TONES[m]) } as React.CSSProperties}><Chip tone="accent">{i + 1} {meaningWord(m)}</Chip></li>
                ))}
              </ul>
              {marks.length ? (
                <ul className="grid gap-3">
                  {marks.map((h) => (
                    <HighlightCard key={h.id} w={w} h={h} on={h.id === current} onOpen={() => setCurrent(h.id)}
                                   onChange={changed} onGone={gone} word={meaningWord} />
                  ))}
                </ul>
              ) : <p className="text-t2 text-ink-soft"><W k="rs.read.highlights.empty" /></p>}
            </Surface>
            {mode !== "book" ? (
              <Surface material="pane" className="px-4 py-3">
                <FileBox w={w} source={source} onChange={setSource} />
              </Surface>
            ) : null}
          </aside>
        </div>
      )}
    </div>
  );
}

/* ---------- one highlight's card ---------- */

function HighlightCard({ w, h, on, onOpen, onChange, onGone, word }: {
  w: Who; h: Highlight; on: boolean; onOpen: () => void;
  onChange: (h: Highlight) => void; onGone: (h: Highlight) => void; word: (m: HighlightMeaning) => string;
}) {
  const [note, setNote] = useState(h.note);
  const [card, setCard] = useState(Boolean(h.fields.number || h.fields.method || h.fields.finding || h.fields.n));
  const [fields, setFields] = useState(h.fields);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seen = useRef(h.updated_at);

  const write = useCallback(async (part: Partial<Highlight>) => {
    const r = await saveHighlight(w, h, part, seen.current);
    if (r.ok) { seen.current = r.row.updated_at; onChange(r.row); }
  }, [w, h, onChange]);
  const later = (part: Partial<Highlight>): void => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void write(part); }, SETTLE);
  };
  const field = (name: keyof Highlight["fields"], value: string): void => {
    const next = { ...fields, [name]: value || undefined };
    setFields(next);
    later({ fields: next });
  };

  return (
    <li className="rs-hl-card grid gap-2" aria-current={on ? "true" : undefined}
        style={{ "--tone": toneVar(MEANING_TONES[h.meaning]), "--accent": toneVar(MEANING_TONES[h.meaning]) } as React.CSSProperties}>
      <div className="flex flex-wrap items-center gap-2">
        <Select id={`rs-hm-${h.id}`} label={<W k="rs.read.meaning" />} hideLabel value={h.meaning}
                onChange={(e) => { void write({ meaning: e.target.value as HighlightMeaning }); }}>
          {HIGHLIGHT_MEANINGS.map((m) => <option key={m} value={m}>{word(m)}</option>)}
        </Select>
        {h.page ? <span className="text-t1 text-ink-soft mono">{both("rs.read.page")} {h.page}</span> : null}
        {h.position.start !== undefined ? <span className="text-t1 text-ink-soft mono">{stamp(h.position.start)}–{stamp(h.position.end ?? h.position.start)}</span> : null}
        {h.fields.typed ? <Chip><W k="rs.read.typed" /></Chip> : null}
        <span className="grow" />
        {h.quote || h.position.start !== undefined ? <ChipButton onClick={onOpen}><W k="rs.read.goto" /></ChipButton> : null}
      </div>
      {h.quote ? <blockquote>{h.quote}</blockquote> : null}
      <TextArea id={`rs-hn-${h.id}`} label={<W k="rs.read.note" />} hideLabel rows={2} value={note}
                placeholder={both("rs.read.note")}
                onChange={(e) => { setNote(e.target.value); later({ note: e.target.value }); }} />
      <div className="flex flex-wrap gap-2">
        <ChipButton pressed={card} onClick={() => setCard((c) => !c)}><W k="rs.read.card" /></ChipButton>
        <ChipButton onClick={() => { if (window.confirm(`${both("rs.read.remove")}?`)) void removeHighlight(w, h).then((ok) => { if (ok) onGone(h); }); }}>
          <W k="rs.read.remove" />
        </ChipButton>
      </div>
      {card ? (
        <div className="grid gap-2 grid-cols-2">
          <Field id={`rs-hf-number-${h.id}`} label={<W k="rs.read.number" />} value={fields.number ?? ""} onChange={(e) => field("number", e.target.value)} />
          <Field id={`rs-hf-unit-${h.id}`} label={<W k="rs.read.unit" />} value={fields.unit ?? ""} onChange={(e) => field("unit", e.target.value)} />
          <Field id={`rs-hf-n-${h.id}`} label={<W k="rs.read.n" />} value={fields.n ?? ""} onChange={(e) => field("n", e.target.value)} />
          <Field id={`rs-hf-method-${h.id}`} label={<W k="rs.read.method" />} value={fields.method ?? ""} onChange={(e) => field("method", e.target.value)} />
          <div className="col-span-2">
            <Field id={`rs-hf-finding-${h.id}`} label={<W k="rs.read.finding" />} value={fields.finding ?? ""} onChange={(e) => field("finding", e.target.value)} />
          </div>
        </div>
      ) : null}
    </li>
  );
}

const stamp = (s: number): string => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* ---------- the bar under a selection, and the keys ---------- */

interface Picked { root: HTMLElement; page: number; start: number; end: number; rects: number[][]; x: number; y: number }

function useSelection(
  boxRef: React.RefObject<HTMLDivElement | null>,
  find: (node: Node) => { root: HTMLElement; page: number; scale: number } | null,
): { picked: Picked | null; clear: () => void } {
  const [picked, setPicked] = useState<Picked | null>(null);
  const pending = useRef(false);
  useEffect(() => {
    const read = (): void => {
      pending.current = false;
      const sel = document.getSelection();
      const box = boxRef.current;
      if (!sel || sel.isCollapsed || !sel.rangeCount || !box) { setPicked(null); return; }
      const range = sel.getRangeAt(0);
      const where = find(range.commonAncestorContainer);
      if (!where) { setPicked(null); return; }
      const offsets = offsetsOf(range, where.root);
      if (!offsets) { setPicked(null); return; }
      const rects = rectsOf(range, where.root, where.scale);
      const last = range.getClientRects()[range.getClientRects().length - 1];
      const base = box.getBoundingClientRect();
      setPicked({
        root: where.root, page: where.page, ...offsets, rects,
        x: last ? last.left - base.left : 0, y: last ? last.bottom - base.top + 6 : 0,
      });
    };
    const onChange = (): void => {
      if (pending.current) return;
      pending.current = true;
      requestAnimationFrame(read);
    };
    document.addEventListener("selectionchange", onChange);
    return () => document.removeEventListener("selectionchange", onChange);
  }, [boxRef, find]);
  const clear = useCallback(() => { document.getSelection()?.removeAllRanges(); setPicked(null); }, []);
  return { picked, clear };
}

function MeaningBar({ at, onPick, word }: { at: { x: number; y: number }; onPick: (m: HighlightMeaning) => void; word: (m: HighlightMeaning) => string }) {
  return (
    <Surface material="pane" className="rs-hl-bar" style={{ left: Math.max(0, at.x), top: at.y }}>
      {HIGHLIGHT_MEANINGS.map((m, i) => (
        <ChipButton key={m} style={{ "--accent": toneVar(MEANING_TONES[m]) } as React.CSSProperties}
                    onMouseDown={(e) => e.preventDefault()} onClick={() => onPick(m)} aria-label={`${i + 1}: ${word(m)}`}>
          {i + 1} {word(m)}
        </ChipButton>
      ))}
    </Surface>
  );
}

/** The rectangles of the highlights on one sheet, drawn from the
    cache or, when the cache is empty, from the quote found again
    in the sheet's text. */
function Marks({ marks, root, scale, current, onOpen, onFound }: {
  marks: Highlight[]; root: HTMLElement | null; scale: number; current: string | null;
  onOpen: (h: Highlight) => void; onFound?: (h: Highlight, rects: number[][]) => void;
}) {
  const [drawn, setDrawn] = useState<{ h: Highlight; rects: number[][] }[]>([]);
  useEffect(() => {
    if (!root) return;
    const out: { h: Highlight; rects: number[][] }[] = [];
    const text = textOfNodes(textNodes(root));
    for (const h of marks) {
      if (h.rects.length) { out.push({ h, rects: h.rects }); continue; }
      const at = findAnchor(text, h);
      if (!at) continue;
      const range = rangeOf(root, at.start, at.end);
      if (!range) continue;
      const rects = rectsOf(range, root, scale);
      if (rects.length) { out.push({ h, rects }); onFound?.(h, rects); }
    }
    setDrawn(out);
  }, [marks, root, scale, onFound]);
  return (
    <>
      {drawn.map(({ h, rects }) => rects.map((r, i) => (
        <div key={`${h.id}-${i}`} className="rs-mark" data-on={h.id === current ? "" : undefined} role="button" tabIndex={0}
             title={h.quote.slice(0, 120)} style={{
               left: r[0] * scale, top: r[1] * scale, width: r[2] * scale, height: r[3] * scale,
               "--tone": toneVar(MEANING_TONES[h.meaning]), cursor: "pointer",
             } as React.CSSProperties}
             onClick={() => onOpen(h)} onKeyDown={(e) => { if (e.key === "Enter") onOpen(h); }} />
      )))}
    </>
  );
}

/* ---------- a PDF ---------- */

function PdfSheet({ w, source, file, marks, current, onCurrent, onMade, onSource }: {
  w: Who; source: Source; file: SourceFile; marks: Highlight[]; current: string | null;
  onCurrent: (id: string) => void; onMade: (h: Highlight | null) => void; onSource: (s: Source) => void;
}) {
  const lang = useToolLang();
  const box = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [scale, setScale] = useState(1.2);
  const [sizes, setSizes] = useState<{ w: number; h: number }[]>([]);
  const [shown, setShown] = useState<Set<number>>(new Set([1, 2]));
  const [at, setAt] = useState(file.page ?? 1);
  const [textless, setTextless] = useState(false);
  const [from, setFrom] = useState<From | null>(null);
  const roots = useRef(new Map<number, HTMLElement>());
  const placeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    let task: PDFDocumentLoadingTask | null = null;
    void (async () => {
      try {
        const src = await fileSource(w, file.key);
        if (!src) { setState("failed"); return; }
        setFrom(src.from);
        const lib = await loadPdfjs();
        /* The device copy goes in as bytes rather than through its
           blob URL: pdf.js would fetch that with Range requests a
           blob cannot answer. */
        task = src.blob ? lib.getDocument({ data: new Uint8Array(await src.blob.arrayBuffer()) }) : lib.getDocument({ url: src.url });
        letGo(src);
        const loaded = await task.promise;
        if (!alive) return;
        const dims: { w: number; h: number }[] = [];
        for (let i = 1; i <= loaded.numPages; i += 1) {
          const p = await loaded.getPage(i);
          const v = p.getViewport({ scale: 1 });
          dims.push({ w: v.width, h: v.height });
        }
        if (!alive) return;
        setSizes(dims);
        setDoc(loaded);
        setState("ready");
        if (file.pages !== loaded.numPages) void keepPlace(w, source, file.key, file.page ?? 1, loaded.numPages).then((s) => { if (s) onSource(s); });
      } catch { if (alive) setState("failed"); }
    })();
    return () => { alive = false; if (task) void task.destroy(); };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [w, file.key]);

  /* Which pages are near the window, and which one the reader is on. */
  useEffect(() => {
    const box_ = box.current;
    if (!box_ || !sizes.length) return;
    const pages = [...box_.querySelectorAll<HTMLElement>("[data-page]")];
    const io = new IntersectionObserver((entries) => {
      setShown((was) => {
        const next = new Set(was);
        for (const e of entries) {
          const n = Number((e.target as HTMLElement).dataset.page);
          if (e.isIntersecting) for (let k = n - 1; k <= n + 1; k += 1) if (k >= 1 && k <= sizes.length) next.add(k);
        }
        return next;
      });
      const seen = entries.filter((e) => e.isIntersecting).map((e) => Number((e.target as HTMLElement).dataset.page));
      if (seen.length) {
        const page = Math.min(...seen);
        setAt(page);
        if (placeTimer.current) clearTimeout(placeTimer.current);
        placeTimer.current = setTimeout(() => {
          void keepPlace(w, source, file.key, page, sizes.length).then((s) => { if (s) onSource(s); });
        }, 1500);
      }
    }, { rootMargin: "400px 0px" });
    for (const p of pages) io.observe(p);
    return () => io.disconnect();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [sizes, scale]);

  /* The first paint lands on the page the reader left. */
  const jumped = useRef(false);
  useEffect(() => {
    if (jumped.current || !sizes.length || !file.page || file.page <= 1) return;
    jumped.current = true;
    box.current?.querySelector(`[data-page="${file.page}"]`)?.scrollIntoView({ block: "start" });
  }, [sizes, file.page]);

  const find = useCallback((node: Node) => {
    const el = (node.nodeType === Node.TEXT_NODE ? node.parentElement : node as HTMLElement)?.closest<HTMLElement>(".rs-textlayer");
    if (!el || !box.current?.contains(el)) return null;
    return { root: el, page: Number(el.dataset.page), scale };
  }, [scale]);
  const { picked, clear } = useSelection(box, find);

  const mark = useCallback(async (meaning: HighlightMeaning) => {
    if (!picked) return;
    const text = textOfNodes(textNodes(picked.root));
    const anchor = anchorOf(text, picked.start, picked.end);
    clear();
    onMade(await addHighlight(w, { source_id: source.id, file_key: file.key, page: picked.page, ...anchor, rects: picked.rects, meaning }));
  }, [picked, clear, onMade, w, source.id, file.key]);

  const go = (page: number): void => {
    box.current?.querySelector(`[data-page="${Math.max(1, Math.min(sizes.length, page))}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
  };
  const pickedRef = useRef(picked);
  pickedRef.current = picked;
  const swipe = useSwipe(
    useCallback((by) => { setAt((n) => { go(n + by); return n; }); /* eslint-disable-line react-hooks/exhaustive-deps */ }, [sizes.length]),
    useCallback(() => Boolean(pickedRef.current) || !(document.getSelection()?.isCollapsed ?? true), []),
  );
  useKeys(useMemo(() => ({
    "1": () => { void mark("claim"); }, "2": () => { void mark("evidence"); }, "3": () => { void mark("method"); },
    "4": () => { void mark("quote"); }, "5": () => { void mark("question"); },
    j: () => go(at + 1), k: () => go(at - 1), Escape: () => clear(),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }), [mark, at, sizes.length]), true);

  const open = useCallback((h: Highlight) => {
    onCurrent(h.id);
    if (h.page) go(h.page);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [onCurrent, sizes.length]);

  /* A found anchor is written back as the cache, quietly. */
  const found = useCallback((h: Highlight, rects: number[][]) => { void saveHighlight(w, h, { rects }); }, [w]);

  const word = (m: HighlightMeaning): string => lang === "bn" ? MEANING_NAMES[m].bn : MEANING_NAMES[m].en;

  return (
    <div className="grid gap-3" data-from={from ?? undefined}>
      <div className="flex flex-wrap items-center gap-2 text-t2">
        <ChipButton onClick={() => go(at - 1)} aria-label={both("rs.read.prev")}>‹</ChipButton>
        <span className="mono text-t1"><W k="rs.read.page" /> {at} <W k="rs.read.of" /> {sizes.length || file.pages || "?"}</span>
        <ChipButton onClick={() => go(at + 1)} aria-label={both("rs.read.next")}>›</ChipButton>
        <span className="grow" />
        <ChipButton onClick={() => setScale((s) => Math.max(0.6, Math.round((s - 0.2) * 10) / 10))} aria-label={both("rs.read.zoom.out")}>−</ChipButton>
        <span className="mono text-t1">{Math.round(scale * 100)}%</span>
        <ChipButton onClick={() => setScale((s) => Math.min(3, Math.round((s + 0.2) * 10) / 10))} aria-label={both("rs.read.zoom.in")}>+</ChipButton>
      </div>
      {state === "loading" ? <p className="text-t2 text-ink-soft" role="status"><W k="rs.read.loading" /></p> : null}
      {state === "failed" ? <p className="text-t2 text-ink-soft" role="status"><W k="rs.read.failed" /></p> : null}
      {textless ? <p className="text-t2 text-ink-soft" role="status"><W k="rs.read.notext" /></p> : null}
      <div ref={box} className="rs-pages relative" {...swipe}>
        {doc ? sizes.map((size, i) => (
          <PdfPage key={i + 1} doc={doc} n={i + 1} size={size} scale={scale} live={shown.has(i + 1)}
                   onRoot={(el) => { if (el) roots.current.set(i + 1, el); else roots.current.delete(i + 1); }}
                   onTextless={() => setTextless(true)}>
            <Marks marks={marks.filter((h) => h.page === i + 1)} root={roots.current.get(i + 1) ?? null} scale={scale}
                   current={current} onOpen={open} onFound={found} />
          </PdfPage>
        )) : null}
        {picked ? <MeaningBar at={picked} onPick={(m) => { void mark(m); }} word={word} /> : null}
      </div>
    </div>
  );
}

function PdfPage({ doc, n, size, scale, live, onRoot, onTextless, children }: {
  doc: PDFDocumentProxy; n: number; size: { w: number; h: number }; scale: number; live: boolean;
  onRoot: (el: HTMLElement | null) => void; onTextless: () => void; children: React.ReactNode;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!live) return;
    let alive = true;
    let page: PDFPageProxy | null = null;
    void (async () => {
      const lib = await loadPdfjs();
      page = await doc.getPage(n);
      if (!alive || !canvas.current || !layer.current) return;
      const viewport = page.getViewport({ scale });
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const c = canvas.current;
      c.width = Math.floor(viewport.width * ratio);
      c.height = Math.floor(viewport.height * ratio);
      c.style.width = `${Math.floor(viewport.width)}px`;
      c.style.height = `${Math.floor(viewport.height)}px`;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined, canvas: c }).promise;
      if (!alive) return;
      const text = await page.getTextContent();
      if (!alive || !layer.current) return;
      layer.current.replaceChildren();
      layer.current.style.setProperty("--scale-factor", String(scale));
      layer.current.style.width = `${Math.floor(viewport.width)}px`;
      layer.current.style.height = `${Math.floor(viewport.height)}px`;
      if (!text.items.some((it) => "str" in it && it.str.trim())) onTextless();
      await new lib.TextLayer({ textContentSource: text, container: layer.current, viewport }).render();
      if (!alive) return;
      setRendered(true);
      onRoot(layer.current);
    })();
    return () => { alive = false; onRoot(null); };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [doc, n, scale, live]);

  return (
    <div className="rs-sheet" data-page={n} style={{ width: Math.floor(size.w * scale), height: Math.floor(size.h * scale) }}>
      <canvas ref={canvas} aria-label={`${both("rs.read.page")} ${n}`} />
      <div ref={layer} className="rs-textlayer" data-page={n} />
      {rendered ? children : null}
    </div>
  );
}

/* ---------- a captured page ---------- */

function HtmlSheet({ w, source, file, marks, current, onCurrent, onMade }: {
  w: Who; source: Source; file: SourceFile; marks: Highlight[]; current: string | null;
  onCurrent: (id: string) => void; onMade: (h: Highlight | null) => void;
}) {
  const lang = useToolLang();
  const box = useRef<HTMLDivElement>(null);
  const prose = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const src = await fileSource(w, file.key);
      if (!src) { setFailed(true); return; }
      try {
        const text = src.blob ? await src.blob.text() : await (await fetch(src.url)).text();
        if (alive) setHtml(text);
      } catch { if (alive) setFailed(true); }
      finally { letGo(src); }
    })();
    return () => { alive = false; };
  }, [w, file.key]);
  useEffect(() => { if (html !== null) setRoot(prose.current); }, [html]);

  const find = useCallback((node: Node) => {
    const el = prose.current;
    if (!el || !el.contains(node)) return null;
    return { root: el, page: 1, scale: 1 };
  }, []);
  const { picked, clear } = useSelection(box, find);
  const mark = useCallback(async (meaning: HighlightMeaning) => {
    if (!picked) return;
    const text = textOfNodes(textNodes(picked.root));
    const anchor = anchorOf(text, picked.start, picked.end);
    clear();
    onMade(await addHighlight(w, { source_id: source.id, file_key: file.key, page: 1, ...anchor, rects: picked.rects, meaning }));
  }, [picked, clear, onMade, w, source.id, file.key]);
  useKeys(useMemo(() => ({
    "1": () => { void mark("claim"); }, "2": () => { void mark("evidence"); }, "3": () => { void mark("method"); },
    "4": () => { void mark("quote"); }, "5": () => { void mark("question"); }, Escape: () => clear(),
  }), [mark, clear]), true);
  const open = useCallback((h: Highlight) => {
    onCurrent(h.id);
    const el = box.current?.querySelector<HTMLElement>(`.rs-mark[title="${CSS.escape(h.quote.slice(0, 120))}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [onCurrent]);
  const found = useCallback((h: Highlight, rects: number[][]) => { void saveHighlight(w, h, { rects }); }, [w]);
  const word = (m: HighlightMeaning): string => lang === "bn" ? MEANING_NAMES[m].bn : MEANING_NAMES[m].en;

  return (
    <Surface material="pane" className="px-5 py-4">
      <p className="text-t1 text-ink-soft mono mb-2"><W k="rs.read.capture" /> · {file.name}</p>
      {failed ? <p className="text-t2 text-ink-soft" role="status"><W k="rs.read.failed" /></p> : null}
      {html === null && !failed ? <p className="text-t2 text-ink-soft" role="status"><W k="rs.read.loading" /></p> : null}
      <div ref={box} className="rs-sheet">
        {/* Sanitised by the Worker at capture, through the same
            sanitiser every article body passes; the policy blocks
            anything that got past it from running. */}
        {html !== null ? <div ref={prose} className="rs-capture article" dangerouslySetInnerHTML={{ __html: html }} /> : null}
        <Marks marks={marks} root={root} scale={1} current={current} onOpen={open} onFound={found} />
        {picked ? <MeaningBar at={picked} onPick={(m) => { void mark(m); }} word={word} /> : null}
      </div>
    </Surface>
  );
}

/* ---------- audio: a highlight is a time range ---------- */

function AudioSheet({ w, source, file, onMade }: { w: Who; source: Source; file: SourceFile; onMade: (h: Highlight | null) => void }) {
  const lang = useToolLang();
  const audio = useRef<HTMLAudioElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  useEffect(() => {
    let src: { url: string; from: From } | null = null;
    void fileSource(w, file.key).then((s) => { src = s; setUrl(s?.url ?? null); });
    return () => letGo(src);
  }, [w, file.key]);
  const now = (): number => audio.current?.currentTime ?? 0;
  const mark = async (meaning: HighlightMeaning): Promise<void> => {
    if (from === null) return;
    const end = to ?? now();
    onMade(await addHighlight(w, { source_id: source.id, file_key: file.key, meaning, position: { start: Math.min(from, end), end: Math.max(from, end) } }));
    setFrom(null);
    setTo(null);
  };
  const word = (m: HighlightMeaning): string => lang === "bn" ? MEANING_NAMES[m].bn : MEANING_NAMES[m].en;
  return (
    <Surface material="pane" className="px-5 py-4 grid gap-3">
      {url ? <audio ref={audio} controls src={url} className="w-full" /> : <p className="text-t2 text-ink-soft" role="status"><W k="rs.read.loading" /></p>}
      <p className="text-t1 text-ink-soft"><W k="rs.read.audio.hint" /></p>
      <div className="flex flex-wrap items-center gap-2">
        <ChipButton pressed={from !== null} onClick={() => { setFrom(now()); setTo(null); }}><W k="rs.read.audio.start" />{from !== null ? ` ${stamp(from)}` : ""}</ChipButton>
        <ChipButton pressed={to !== null} onClick={() => setTo(now())} disabled={from === null}><W k="rs.read.audio.end" />{to !== null ? ` ${stamp(to)}` : ""}</ChipButton>
        {from !== null ? HIGHLIGHT_MEANINGS.map((m, i) => (
          <ChipButton key={m} style={{ "--accent": toneVar(MEANING_TONES[m]) } as React.CSSProperties} onClick={() => { void mark(m); }}>{i + 1} {word(m)}</ChipButton>
        )) : null}
      </div>
    </Surface>
  );
}

function ImageSheet({ w, file }: { w: Who; file: SourceFile }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let src: { url: string; from: From } | null = null;
    void fileSource(w, file.key).then((s) => { src = s; setUrl(s?.url ?? null); });
    return () => letGo(src);
  }, [w, file.key]);
  return (
    <Surface material="pane" className="px-5 py-4">
      {url ? <img src={url} alt={file.name ?? ""} className="max-w-full h-auto" /> : <p className="text-t2 text-ink-soft" role="status"><W k="rs.read.loading" /></p>}
    </Surface>
  );
}

/* ---------- a book: the page and the passage, typed ---------- */

function TypedSheet({ w, source, onMade }: { w: Who; source: Source; onMade: (h: Highlight | null) => void }) {
  const lang = useToolLang();
  const [page, setPage] = useState("");
  const [text, setText] = useState("");
  const [meaning, setMeaning] = useState<HighlightMeaning>("quote");
  const add = async (): Promise<void> => {
    if (!text.trim()) return;
    onMade(await addHighlight(w, {
      source_id: source.id, page: Number(page) || null, quote: text.trim(), meaning, fields: { typed: true },
    }));
    setText("");
  };
  return (
    <Surface material="pane" className="px-5 py-4 grid gap-3">
      <h2 className="text-t3 font-medium"><W k="rs.read.typed" /></h2>
      <p className="text-t2 text-ink-soft"><W k="rs.read.typed.hint" /></p>
      <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); void add(); }}>
        <div className="grid gap-3 md:grid-cols-[8rem_minmax(0,1fr)]">
          <Field id="rs-bk-page" label={<W k="rs.read.typed.page" />} inputMode="numeric" value={page} onChange={(e) => setPage(e.target.value)} />
          <Select id="rs-bk-meaning" label={<W k="rs.read.meaning" />} value={meaning} onChange={(e) => setMeaning(e.target.value as HighlightMeaning)}>
            {HIGHLIGHT_MEANINGS.map((m) => <option key={m} value={m}>{lang === "bn" ? MEANING_NAMES[m].bn : MEANING_NAMES[m].en}</option>)}
          </Select>
        </div>
        <TextArea id="rs-bk-text" label={<W k="rs.read.typed.text" />} rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        <div><Button type="submit" kind="solid" size="sm" disabled={!text.trim()}><W k="rs.read.typed.add" /></Button></div>
      </form>
      <p className="text-t1 text-ink-soft"><T en="Every highlight is on the right, with its page." bn="প্রতিটা হাইলাইট ডানে, পাতার নম্বরসহ।" /> <Link href={`/tools/research/library/${source.id}`}><W k="rs.lib.open" /></Link></p>
    </Surface>
  );
}

"use client";

/* ============================================================
   research/source.tsx: one source, as a form that saves as it
   is typed.

   The record is CSL-JSON and the form edits it field by field;
   the columns beside it are refilled by `saveSource()` on every
   write, never here. The reference line at the top renders live
   so a correction is seen at once.

   ---- a controlled field is the reader's, not the row's ----

   Every box seeds itself from the row when the SOURCE'S ID
   changes and never again: a write is in flight while somebody
   is still typing, and taking the value from the row on every
   change would put the server's answer back under the caret.
   The desk's lesson, kept.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SOURCE_STATUSES, SOURCE_TYPES, authorsText, parseAuthors, referenceLine, sourceType, toneVar,
  type CslItem,
} from "@reiad/shared/research";
import { toBibtex, toRis } from "@reiad/shared/research-bib";
import {
  bin, listNotes, saveSource, unbin,
  type Collection, type Note, type Project, type Source, type Who,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SAID, SETTLE, when } from "./use-who";
import { FileBox, readHref } from "./files";
import { RelatedWorks } from "./find";

export function SourceCard({ w, source, projects, collections, onChange, onGone }: {
  w: Who;
  source: Source;
  projects: Project[];
  collections: Collection[];
  onChange: (s: Source) => void;
  onGone?: () => void;
}) {
  const lang = useToolLang();
  const [csl, setCsl] = useState<CslItem>(source.csl);
  const [authors, setAuthors] = useState(authorsText(source.csl.author));
  const [why, setWhy] = useState(source.why ?? "");
  const [tags, setTags] = useState(source.tags.join(", "));
  const [state, setState] = useState<"" | "saving" | "saved" | "conflict" | "failed">("");
  const [notes, setNotes] = useState<Note[]>([]);
  const seen = useRef(source.updated_at);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const said = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ON THE ID, and only the id. */
  useEffect(() => {
    setCsl(source.csl);
    setAuthors(authorsText(source.csl.author));
    setWhy(source.why ?? "");
    setTags(source.tags.join(", "));
    seen.current = source.updated_at;
    setState("");
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [source.id]);

  useEffect(() => {
    void listNotes(w, { source: source.id, limit: 50 }).then(setNotes);
  }, [w, source.id]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (said.current) clearTimeout(said.current);
  }, []);

  const write = useCallback(async (part: Parameters<typeof saveSource>[2]) => {
    setState("saving");
    const r = await saveSource(w, source, part, seen.current);
    if (r.ok) {
      seen.current = r.row.updated_at;
      onChange(r.row);
      setState("saved");
      cue("saved");
      if (said.current) clearTimeout(said.current);
      said.current = setTimeout(() => setState(""), SAID);
    } else {
      setState(r.conflict ? "conflict" : "failed");
    }
  }, [w, source, onChange]);

  const later = useCallback((part: Parameters<typeof saveSource>[2]) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void write(part); }, SETTLE);
  }, [write]);

  /** One CSL field typed. */
  const field = (name: keyof CslItem) => ({
    value: String(csl[name] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...csl, [name]: e.target.value || undefined };
      setCsl(next);
      later({ csl: next });
    },
    onBlur: () => { if (timer.current) { clearTimeout(timer.current); void write({ csl }); } },
  });

  const yearValue = String(csl.issued?.["date-parts"]?.[0]?.[0] ?? "");

  const copy = async (text: string): Promise<void> => {
    try { await navigator.clipboard.writeText(text); cue("saved"); } catch { /* no clipboard */ }
  };

  const type = sourceType(source.type);

  return (
    <div className="grid gap-4" style={{ "--accent": toneVar(type.tone) } as React.CSSProperties}>
      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="accent"><T en={type.name.en} bn={type.name.bn} /></Chip>
          <Chip tone={source.verified ? "quiet" : "warn"}>
            <W k={source.verified ? "rs.lib.verified" : "rs.lib.unverified"} />
          </Chip>
          {source.retracted ? <Chip tone="danger"><T en="Retracted" bn="প্রত্যাহৃত" /></Chip> : null}
          <span className="text-t1 text-ink-soft mono grow text-right" role="status">
            {state === "saving" ? <W k="rs.saving" /> : state === "saved" ? <W k="rs.saved" />
              : state === "conflict" ? <W k="rs.conflict" /> : state === "failed" ? <W k="rs.notsaved" /> : null}
          </span>
        </div>
        <p className="text-t3 leading-relaxed"><span className="sr-only"><W k="rs.lib.reference" /> </span>{referenceLine(csl)}</p>
        <div className="flex flex-wrap gap-2">
          <ChipButton onClick={() => { void copy(toBibtex(csl, source.key)); }}><W k="rs.lib.copybib" /></ChipButton>
          <ChipButton onClick={() => { void copy(toRis(csl, source.key)); }}><W k="rs.lib.copyris" /></ChipButton>
          {source.doi ? <ChipLink href={`https://doi.org/${source.doi}`} target="_blank" rel="noreferrer">doi.org</ChipLink> : null}
          {source.url && !source.doi ? <ChipLink href={source.url} target="_blank" rel="noreferrer"><W k="rs.lib.url" /></ChipLink> : null}
          {source.oa?.url ? <ChipLink href={source.oa.url} target="_blank" rel="noreferrer"><T en="Free copy" bn="বিনামূল্যের কপি" /></ChipLink> : null}
          {readHref(source) ? <ChipLink href={readHref(source) as string}><W k="rs.lib.read" /></ChipLink> : null}
        </div>
      </Surface>
      <Surface material="sunk" className="px-4 py-3">
        <FileBox w={w} source={source} onChange={(s) => { seen.current = s.updated_at; onChange(s); }} />
      </Surface>

      <div className="grid gap-4 md:grid-cols-2">
        <Field id="rs-s-title" label={<W k="rs.lib.title" />} {...field("title")} />
        <Field id="rs-s-authors" label={<W k="rs.lib.authors" />} hint={<W k="rs.lib.authors.hint" />}
               value={authors}
               onChange={(e) => {
                 setAuthors(e.target.value);
                 const next = { ...csl, author: parseAuthors(e.target.value) };
                 setCsl(next);
                 later({ csl: next });
               }} />
        <Field id="rs-s-year" label={<W k="rs.lib.year" />} inputMode="numeric" value={yearValue}
               onChange={(e) => {
                 const y = Number(e.target.value);
                 const next = { ...csl, issued: y > 0 ? { "date-parts": [[y]] } : undefined };
                 setCsl(next);
                 later({ csl: next });
               }} />
        <Field id="rs-s-container" label={<W k="rs.lib.container" />} {...field("container-title")} />
        <Field id="rs-s-volume" label={<W k="rs.lib.volume" />} {...field("volume")} />
        <Field id="rs-s-issue" label={<W k="rs.lib.issue" />} {...field("issue")} />
        <Field id="rs-s-pages" label={<W k="rs.lib.pages" />} {...field("page")} />
        <Field id="rs-s-doi" label={<W k="rs.lib.doi" />} {...field("DOI")} />
        <Field id="rs-s-url" label={<W k="rs.lib.url" />} {...field("URL")} />
        <Select id="rs-s-type" label={<W k="rs.lib.type" />} value={source.type}
                onChange={(e) => { void write({ type: e.target.value }); }}>
          {SOURCE_TYPES.map((t) => <option key={t.id} value={t.id}>{lang === "bn" ? t.name.bn : t.name.en}</option>)}
        </Select>
        <Select id="rs-s-status" label={<W k="rs.lib.status" />} value={source.status}
                onChange={(e) => { void write({ status: e.target.value as Source["status"] }); }}>
          {SOURCE_STATUSES.map((s) => <option key={s} value={s}>{both(`rs.lib.status.${s}`)}</option>)}
        </Select>
        <Select id="rs-s-priority" label={<W k="rs.lib.priority" />} value={String(source.priority)}
                onChange={(e) => { void write({ priority: Number(e.target.value) }); }}>
          {[0, 1, 2, 3].map((p) => <option key={p} value={p}>{"★".repeat(p) || "–"}</option>)}
        </Select>
        <Select id="rs-s-rating" label={<W k="rs.lib.rating" />} value={String(source.rating ?? "")}
                onChange={(e) => { void write({ rating: e.target.value ? Number(e.target.value) : null }); }}>
          <option value="">–</option>
          {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{"★".repeat(r)}</option>)}
        </Select>
      </div>

      <TextArea id="rs-s-why" label={<W k="rs.lib.why" />} value={why} rows={2}
                onChange={(e) => { setWhy(e.target.value); later({ why: e.target.value }); }} />
      <TextArea id="rs-s-abstract" label={<W k="rs.lib.abstract" />} rows={5} {...field("abstract")} />
      <Field id="rs-s-tags" label={<W k="rs.tags" />} value={tags}
             onChange={(e) => {
               setTags(e.target.value);
               later({ tags: e.target.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) });
             }} />

      <div className="grid gap-3 md:grid-cols-2">
        <fieldset className="grid gap-1">
          <legend className="text-t1 font-medium tracking-wide uppercase text-ink-soft"><W k="rs.projects" /></legend>
          <div className="flex flex-wrap gap-2">
            {projects.map((p) => (
              <ChipButton key={p.id} pressed={source.projects.includes(p.id)}
                          onClick={() => {
                            const next = source.projects.includes(p.id)
                              ? source.projects.filter((x) => x !== p.id) : [...source.projects, p.id];
                            void write({ projects: next });
                          }}>
                {p.name}
              </ChipButton>
            ))}
            {!projects.length ? <span className="text-t2 text-ink-soft"><W k="rs.noproject" /></span> : null}
          </div>
        </fieldset>
        <fieldset className="grid gap-1">
          <legend className="text-t1 font-medium tracking-wide uppercase text-ink-soft"><W k="rs.collections" /></legend>
          <div className="flex flex-wrap gap-2">
            {collections.map((c) => (
              <ChipButton key={c.id} pressed={source.collections.includes(c.id)}
                          onClick={() => {
                            const next = source.collections.includes(c.id)
                              ? source.collections.filter((x) => x !== c.id) : [...source.collections, c.id];
                            void write({ collections: next });
                          }}>
                {c.name}
              </ChipButton>
            ))}
            {!collections.length ? <span className="text-t2 text-ink-soft"><W k="rs.none" /></span> : null}
          </div>
        </fieldset>
      </div>

      <Surface material="sunk" className="px-4 py-3 grid gap-2">
        <h3 className="text-t2 font-medium"><W k="rs.lib.notes" /></h3>
        {notes.length ? (
          <ul className="grid gap-1 text-t2">
            {notes.map((n) => (
              <li key={n.id}>
                <Link href={`/tools/research/notes/${n.id}`}>{n.title || n.text.slice(0, 80)}</Link>
                <span className="text-t1 text-ink-soft mono"> {when(n.updated_at)}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div>
          <ChipLink href={`/tools/research/notes?source=${source.id}&new=literature`}><W k="rs.lib.note.new" /></ChipLink>
        </div>
      </Surface>

      <RelatedWorks w={w} source={source} sources={[]} />
      <p className="text-t1 text-ink-soft mono">
        <W k="rs.lib.key" />: {source.key} · <W k="rs.lib.via" />: {source.added_via} · <W k="rs.updated" />: {when(source.updated_at)}
      </p>

      <div>
        {source.deleted_at ? (
          <Button kind="soft" size="sm" onClick={() => { void unbin(w, "research_sources", source.id, source.title).then((ok) => { if (ok) onGone?.(); }); }}>
            <W k="rs.restore" />
          </Button>
        ) : (
          <Button kind="quiet" size="sm" onClick={() => {
            if (!window.confirm(`${both("rs.delete")}: ${source.title}?`)) return;
            void bin(w, "research_sources", source.id, source.title).then((ok) => { if (ok) onGone?.(); });
          }}>
            <W k="rs.delete" />
          </Button>
        )}
      </div>
    </div>
  );
}

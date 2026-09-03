"use client";

/* ============================================================
   research/review.tsx: the review room. RESEARCH.md 13.

   A review is a row holding the protocol, and what a search
   returns is a RECORD rather than a source: it sits in
   research_review_records through screening and becomes a
   library source only when it is included at full text, so four
   thousand screened abstracts stay out of the library. PRISMA is
   counts of those rows by stage and reason, drawn in SVG from
   shared/research-review.ts and never typed, so changing a
   decision changes the diagram. A narrative review is the same
   room with the screening views turned off.

   Two keyboards share the window here and must not both answer
   one press: the room binds the digits to its views, and the
   screening page binds y, x, m, j, k, and the digits only while
   an exclusion reason is being picked. `picking` is lifted to the
   room so its own digit map is empty for exactly that long.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { toneVar } from "@reiad/shared/research";
import { word } from "@reiad/shared/research-words";
import {
  APPRAISALS, FRAMES, FRAME_SLOTS, REVIEW_KINDS, REVIEW_KIND_NAMES, REVIEW_STATES, REVIEW_STATE_NAMES, agreement, appraisalScore, duplicatesOf, fillFromCards, prisma, verdictA, verdictB,
  type Criterion, type Frame, type PrismaCounts, type Protocol, type ReviewKind, type ReviewState, type Verdict,
} from "@reiad/shared/research-review";
import { gapMatrix } from "@reiad/shared/research-graph";
import type { SourceFile } from "@reiad/shared/research";
import {
  addRecords, addReview, addSearch, addSource, findDuplicate, listHighlights, listRecords, listReviews, listSearches, listSources, saveRecord, saveReview, searchIndexes,
  type Hit, type Review, type ReviewRecord, type Search, type Source, type Who,
} from "../../lib/research-api";
import type { DocTable } from "../../lib/export-docx-tables";
import { Reader } from "./reader";
import { Button } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";
import { useKeys } from "./keys";
import { DATABASES, DB_NAMES } from "./find";

type View = "protocol" | "search" | "screen" | "prisma" | "extract" | "appraise" | "synthesis";
const VIEWS: View[] = ["protocol", "search", "screen", "prisma", "extract", "appraise", "synthesis"];
/** A narrative review screens nothing, so it has no PRISMA,
    nothing to extract from and nothing to appraise. */
const NARRATIVE: View[] = ["protocol", "search", "synthesis"];
const VIEW_KEY: Record<View, string> = {
  protocol: "rs.rev.protocol", search: "rs.rev.search", screen: "rs.rev.screen", prisma: "rs.rev.prisma",
  extract: "rs.rev.extract", appraise: "rs.rev.appraise", synthesis: "rs.rev.synthesis",
};
const DEFAULT_COLUMNS = ["sample", "country", "period", "method", "finding", "effect size"];

const dbName = (d: string): string => DB_NAMES[d] ?? d;
const list = (s: string): string[] => s.split(",").map((x) => x.trim()).filter(Boolean);
const slug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "review";

function when(iso: string | null, lang: "en" | "bn"): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** A file handed to the browser to save. A blob URL rather than a
    data URL because a CSV of four hundred rows is longer than an
    address should be. */
function download(name: string, body: string | Blob, type: string): void {
  const blob = body instanceof Blob ? body : new Blob([body], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Tables as a Word file, the library loaded only now. */
async function downloadDocx(name: string, title: string, tables: DocTable[], bangla: boolean): Promise<void> {
  const { tablesDocx } = await import("../../lib/export-docx-tables");
  download(name, await tablesDocx(title, tables, { bangla }), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
}

/** The one moment a record becomes a library source: linked if the
    library already has it, added if not. Shared by an include at
    full text and by a disagreement resolved as one. */
async function becomeSource(w: Who, rec: ReviewRecord, onSource: (s: Source) => void): Promise<string | null> {
  if (rec.source_id) return rec.source_id;
  const dup = await findDuplicate(w, rec.record.csl);
  if (dup?.sure) return dup.source.id;
  const s = await addSource(w, rec.record.csl, {
    via: "search", verified: true,
    oa: rec.record.oa ? { isOa: rec.record.oa.isOa, url: rec.record.oa.url, at: new Date().toISOString() } : null,
    identifiers: rec.record.openalex ? { openalex: rec.record.openalex } : {},
  });
  if (s) onSource(s);
  return s?.id ?? null;
}

/** The library source a record stands for: the one it was linked
    to, or the one with its DOI or its hash. */
const sourceOf = (rec: ReviewRecord, sources: Source[]): Source | null =>
  (rec.source_id ? sources.find((s) => s.id === rec.source_id) : null)
  ?? sources.find((s) => (rec.doi && s.doi && s.doi.toLowerCase() === rec.doi.toLowerCase()) || s.hash === rec.hash)
  ?? null;

const pdfOf = (s: Source | null): SourceFile | null => (s?.files as SourceFile[] | undefined)?.find((f) => f.kind === "pdf") ?? null;

/* ---------- criteria: one a line, minus for an exclusion ---------- */

/** Ids are STABLE across edits: a line whose text and kind match a
    criterion the protocol already had keeps that id, because the
    exclusions already decided point at it. */
export function parseCriteria(text: string, was: Criterion[]): Criterion[] {
  const out: Criterion[] = [];
  const used = new Set<string>();
  const next = (kind: Criterion["kind"]): string => {
    const p = kind === "include" ? "I" : "E";
    let n = 1;
    while (used.has(`${p}${n}`)) n += 1;
    return `${p}${n}`;
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const kind: Criterion["kind"] = line.startsWith("-") ? "exclude" : "include";
    const t = line.replace(/^[-+]\s*/, "").trim();
    if (!t) continue;
    const old = was.find((c) => c.kind === kind && c.text === t && !used.has(c.id));
    const id = old?.id ?? next(kind);
    used.add(id);
    out.push({ id, kind, text: t });
  }
  return out;
}

const criteriaText = (cs: Criterion[]): string => cs.map((c) => (c.kind === "exclude" ? `- ${c.text}` : c.text)).join("\n");

/* ---------- the room ---------- */

export function ReviewRoom() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [records, setRecords] = useState<ReviewRecord[]>([]);
  const [searches, setSearches] = useState<Search[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [view, setView] = useState<View>("protocol");
  const [picking, setPicking] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ReviewKind>("systematic");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!w) return;
    void (async () => {
      const [r, s, l] = await Promise.all([listReviews(w), listSearches(w), listSources(w)]);
      setReviews(r); setSearches(s); setSources(l); setReady(true);
      if (r.length) setChosen((c) => c ?? r[0].id);
    })();
  }, [w]);
  useEffect(() => {
    if (!w || !chosen) { setRecords([]); return; }
    void listRecords(w, chosen).then(setRecords);
  }, [w, chosen]);

  const review = reviews.find((r) => r.id === chosen) ?? null;
  const views = review?.kind === "narrative" ? NARRATIVE : VIEWS;
  useEffect(() => { if (!views.includes(view)) setView("protocol"); }, [views, view]);

  useKeys(useMemo(() => {
    if (picking) return {};
    const map: Record<string, () => void> = {};
    views.forEach((v, i) => { map[String(i + 1)] = () => setView(v); });
    return map;
  }, [views, picking]), Boolean(w));

  const start = async (): Promise<void> => {
    if (!w || !title.trim()) return;
    const r = await addReview(w, { title: title.trim(), kind });
    if (r) { setReviews((was) => [r, ...was]); setChosen(r.id); setTitle(""); setView("protocol"); cue("saved"); }
  };
  const changed = useCallback((r: Review): void => setReviews((was) => was.map((x) => (x.id === r.id ? r : x))), []);
  const recordChanged = useCallback((rec: ReviewRecord): void => setRecords((was) => was.map((x) => (x.id === rec.id ? rec : x))), []);
  const sourceMade = useCallback((s: Source): void => setSources((was) => [s, ...was]), []);

  if (!w) return <SignedOut answered={answered} />;
  return (
    <div className="rs-panes">
      <Surface material="pane" className="rs-list px-3 py-3 grid gap-3">
        <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); void start(); }}>
          <Field id="rs-rev-title" label={<W k="rs.rev.title" />} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
          <Select id="rs-rev-kind" label={<W k="rs.rev.kind" />} value={kind} onChange={(e) => setKind(e.target.value as ReviewKind)}>
            {REVIEW_KINDS.map((k) => <option key={k} value={k}>{REVIEW_KIND_NAMES[k][lang]}</option>)}
          </Select>
          <Button type="submit" kind="solid" size="sm" disabled={!title.trim()}><W k="rs.rev.new" /></Button>
        </form>
        {ready && !reviews.length ? <p className="text-t1 text-ink-soft"><W k="rs.rev.empty" /></p> : null}
        <ul className="rs-rows grid gap-1">
          {reviews.map((r) => (
            <li key={r.id}>
              <button type="button" className="rs-row" aria-current={r.id === chosen ? "true" : undefined} onClick={() => setChosen(r.id)}>
                <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar("rose") } as CSSProperties} />
                <span className="rs-row-main">
                  <span className="rs-row-title">{r.title}</span>
                  <span className="rs-row-sub">{REVIEW_KIND_NAMES[r.kind][lang]} · {REVIEW_STATE_NAMES[r.state][lang]}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Surface>
      <div className="rs-main grid gap-4 min-w-0">
        {!review ? <p className="text-t2 text-ink-soft"><W k="rs.rev.pick" /></p> : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-t3 font-medium mr-auto">{review.title}</h2>
              <Chip tone="accent">{REVIEW_KIND_NAMES[review.kind][lang]}</Chip>
              <Select
                id="rs-rev-state" hideLabel label={<W k="rs.rev.state" />} value={review.state}
                onChange={(e) => { void saveReview(w, review, { state: e.target.value as ReviewState }).then((r) => { if (r.ok) { changed(r.row); cue("saved"); } }); }}
              >
                {REVIEW_STATES.map((s) => <option key={s} value={s}>{REVIEW_STATE_NAMES[s][lang]}</option>)}
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {views.map((v, i) => <ChipButton key={v} pressed={view === v} onClick={() => setView(v)}>{i + 1} {both(VIEW_KEY[v])}</ChipButton>)}
            </div>
            {review.kind === "narrative" ? <p className="text-t1 text-ink-soft"><W k="rs.rev.narrative" /></p> : null}
            {view === "protocol" ? <ProtocolForm key={review.id} w={w} review={review} onChanged={changed} /> : null}
            {view === "search" ? (
              <SearchLog
                w={w} review={review} records={records} searches={searches.filter((s) => s.review_id === review.id)}
                onSearch={(s) => setSearches((was) => [s, ...was])} onRecords={(made) => setRecords((was) => [...was, ...made])} onRecordChanged={recordChanged}
              />
            ) : null}
            {view === "screen" ? <Screen w={w} review={review} records={records} sources={sources} onChanged={recordChanged} onSource={sourceMade} onPicking={setPicking} /> : null}
            {view === "prisma" ? <Prisma review={review} records={records} /> : null}
            {view === "extract" ? <Extraction w={w} review={review} records={records} onChanged={recordChanged} /> : null}
            {view === "appraise" ? <Appraisal w={w} review={review} records={records} onChanged={recordChanged} /> : null}
            {view === "synthesis" ? <Synthesis records={records} sources={sources} /> : null}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- the protocol ---------- */

function ProtocolForm({ w, review, onChanged }: { w: Who; review: Review; onChanged: (r: Review) => void }) {
  const lang = useToolLang();
  const p0 = review.protocol;
  const [frame, setFrame] = useState<Frame>(p0.frame ?? "pico");
  const [question, setQuestion] = useState<Record<string, string>>(p0.question ?? {});
  const [criteria, setCriteria] = useState(criteriaText(p0.criteria ?? []));
  const [dbs, setDbs] = useState<Set<string>>(new Set(p0.databases ?? []));
  const [from, setFrom] = useState(p0.from ? String(p0.from) : "");
  const [to, setTo] = useState(p0.to ? String(p0.to) : "");
  const [languages, setLanguages] = useState((p0.languages ?? []).join(", "));
  const [screeners, setScreeners] = useState((p0.screeners ?? []).join(", "));
  const [columns, setColumns] = useState((p0.columns ?? []).join(", "));
  const [appraisal, setAppraisal] = useState(p0.appraisal ?? "econ");
  const [said, setSaid] = useState("");

  const save = async (): Promise<void> => {
    const protocol: Protocol = {
      frame, question, criteria: parseCriteria(criteria, p0.criteria ?? []), databases: [...dbs],
      from: from ? Number(from) : undefined, to: to ? Number(to) : undefined,
      languages: list(languages), screeners: list(screeners), columns: list(columns), appraisal,
    };
    const r = await saveReview(w, review, { protocol });
    if (r.ok) { onChanged(r.row); setCriteria(criteriaText(protocol.criteria ?? [])); setSaid(both("rs.saved")); cue("saved"); }
    else setSaid(both("rs.conflict"));
  };
  const toggleDb = (d: string): void => setDbs((was) => { const n = new Set(was); if (n.has(d)) n.delete(d); else n.add(d); return n; });

  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.rev.protocol.hint" /> <Chip>{both("rs.rev.changed")} {when(review.updated_at, lang)}</Chip></p>
      <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); void save(); }}>
        <div className="grid gap-2 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
          <Select id="rs-rev-frame" label={<W k="rs.rev.frame" />} value={frame} onChange={(e) => setFrame(e.target.value as Frame)}>
            {FRAMES.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </Select>
          <div className="grid gap-2">
            {FRAME_SLOTS[frame].map((s) => (
              <Field key={s.id} id={`rs-rev-q-${s.id}`} label={lang === "bn" ? s.bn : s.en} value={question[s.id] ?? ""} onChange={(e) => setQuestion((was) => ({ ...was, [s.id]: e.target.value }))} autoComplete="off" />
            ))}
          </div>
        </div>
        <TextArea id="rs-rev-criteria" label={<W k="rs.rev.criteria" />} hint={<W k="rs.rev.criteria.hint" />} value={criteria} onChange={(e) => setCriteria(e.target.value)} rows={5} />
        <div className="grid gap-1">
          <span className="text-t1 text-ink-soft"><W k="rs.rev.databases" /></span>
          <div className="flex flex-wrap gap-2">
            {DATABASES.map((d) => <ChipButton key={d} pressed={dbs.has(d)} onClick={() => toggleDb(d)}>{dbName(d)}</ChipButton>)}
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-4">
          <Field id="rs-rev-from" label={<W k="rs.rev.from" />} inputMode="numeric" value={from} onChange={(e) => setFrom(e.target.value.replace(/\D/g, "").slice(0, 4))} />
          <Field id="rs-rev-to" label={<W k="rs.rev.to" />} inputMode="numeric" value={to} onChange={(e) => setTo(e.target.value.replace(/\D/g, "").slice(0, 4))} />
          <Field id="rs-rev-languages" label={<W k="rs.rev.languages" />} value={languages} onChange={(e) => setLanguages(e.target.value)} autoComplete="off" />
          <Field id="rs-rev-screeners" label={<W k="rs.rev.screeners" />} value={screeners} onChange={(e) => setScreeners(e.target.value)} autoComplete="off" />
        </div>
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
          <Field id="rs-rev-columns" label={<W k="rs.rev.columns" />} hint={<W k="rs.rev.columns.hint" />} value={columns} onChange={(e) => setColumns(e.target.value)} autoComplete="off" />
          <Select id="rs-rev-appraisal" label={<W k="rs.rev.appraisal" />} value={appraisal} onChange={(e) => setAppraisal(e.target.value)}>
            {Object.entries(APPRAISALS).map(([k, a]) => <option key={k} value={k}>{a.name}</option>)}
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" kind="solid" size="sm"><W k="rs.rev.save" /></Button>
          {said ? <span className="text-t1 text-ink-soft" role="status">{said}</span> : null}
        </div>
      </form>
    </Surface>
  );
}

/* ---------- the search log ---------- */

function SearchLog({ w, review, records, searches, onSearch, onRecords, onRecordChanged }: {
  w: Who; review: Review; records: ReviewRecord[]; searches: Search[];
  onSearch: (s: Search) => void; onRecords: (made: ReviewRecord[]) => void; onRecordChanged: (r: ReviewRecord) => void;
}) {
  const lang = useToolLang();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState("");
  const p = review.protocol;

  /** One POST per database, so PRISMA can say how many each
      returned. A hit already held from the same database is not
      imported twice; the same hit from ANOTHER database is, and
      "Mark duplicates" is what folds it. */
  const importHits = async (hits: Hit[], search: string | null): Promise<number> => {
    const groups = new Map<string, Hit[]>();
    for (const h of hits) {
      const d = h.from[0] ?? "other";
      if (records.some((r) => r.hash === h.hash && r.database === d)) continue;
      groups.set(d, [...(groups.get(d) ?? []), h]);
    }
    let n = 0;
    for (const [d, hs] of groups) {
      const made = await addRecords(w, review.id, d, search, hs);
      n += made.length;
      if (made.length) onRecords(made);
    }
    return n;
  };
  const run = async (): Promise<void> => {
    if (!q.trim() || busy) return;
    setBusy(true); setSaid("");
    try {
      const query = { q: q.trim(), from: p.from, to: p.to, databases: p.databases?.length ? p.databases : undefined };
      const r = await searchIndexes(w, query);
      if (!r) { setSaid(both("rs.findroom.failed")); return; }
      const s = await addSearch(w, query, r.hits.length, review.project_id, review.id);
      if (s) onSearch(s);
      const n = await importHits(r.hits, s?.id ?? null);
      setSaid(`${n} ${both("rs.rev.imported")}`); setQ(""); cue("saved");
    } finally { setBusy(false); }
  };
  const rerun = async (s: Search): Promise<void> => {
    if (busy) return;
    setBusy(true); setSaid("");
    try {
      const r = await searchIndexes(w, { q: s.query, ...s.fields, databases: s.databases });
      if (!r) { setSaid(both("rs.findroom.failed")); return; }
      const n = await importHits(r.hits, s.id);
      setSaid(`${n} ${both("rs.rev.imported")}`); cue("saved");
    } finally { setBusy(false); }
  };
  const dedupe = async (): Promise<void> => {
    const dups = duplicatesOf(records.filter((r) => r.stage !== "deduplicated"));
    for (const id of dups) {
      const rec = records.find((r) => r.id === id);
      if (!rec) continue;
      const r = await saveRecord(w, rec, { stage: "deduplicated", decided_at: new Date().toISOString() });
      if (r.ok) onRecordChanged(r.row);
    }
    setSaid(`${dups.length} ${both("rs.rev.duplicates.marked")}`);
    if (dups.length) cue("saved");
  };

  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.rev.search.hint" /></p>
      <form className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] items-end" onSubmit={(e) => { e.preventDefault(); void run(); }}>
        <Field id="rs-rev-q" label={<W k="rs.rev.query" />} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!q.trim() || busy}><W k="rs.rev.run" /></Button>
      </form>
      <div className="flex flex-wrap items-center gap-2">
        <Chip>{records.length} {both("rs.rev.records")}</Chip>
        <Chip>{records.filter((r) => r.stage === "deduplicated").length} {both("rs.rev.prisma.duplicates")}</Chip>
        <Button type="button" kind="soft" size="sm" disabled={!records.length} onClick={() => { void dedupe(); }}><W k="rs.rev.dedupe" /></Button>
        {said ? <span className="text-t1 text-ink-soft" role="status">{said}</span> : null}
      </div>
      {!searches.length ? <p className="text-t2 text-ink-soft"><W k="rs.none" /></p> : (
        <div className="overflow-x-auto">
          <table className="text-t1 w-full" data-testid="rs-rev-searches">
            <thead>
              <tr>
                <th className="text-left font-normal text-ink-soft"><W k="rs.rev.date" /></th>
                <th className="text-left font-normal text-ink-soft"><W k="rs.rev.query" /></th>
                <th className="text-left font-normal text-ink-soft"><W k="rs.rev.databases" /></th>
                <th className="text-right font-normal text-ink-soft"><W k="rs.rev.hits" /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {searches.map((s) => (
                <tr key={s.id}>
                  <td className="whitespace-nowrap pr-3">{when(s.last_run ?? s.created_at, lang)}</td>
                  <td className="pr-3">{s.query}{s.fields.from || s.fields.to ? ` (${s.fields.from ?? ""}–${s.fields.to ?? ""})` : ""}</td>
                  <td className="pr-3">{(s.databases.length ? s.databases : [...DATABASES]).map(dbName).join(", ")}</td>
                  <td className="text-right tabular-nums pr-3">{s.hits ?? ""}</td>
                  <td><Button type="button" kind="ghost" size="sm" disabled={busy} onClick={() => { void rerun(s); }}><W k="rs.rev.import" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Surface>
  );
}

/* ---------- screening, by keyboard ---------- */

function Screen({ w, review, records, sources, onChanged, onSource, onPicking }: {
  w: Who; review: Review; records: ReviewRecord[]; sources: Source[];
  onChanged: (r: ReviewRecord) => void; onSource: (s: Source) => void; onPicking: (on: boolean) => void;
}) {
  const [stage, setStage] = useState<"title" | "fulltext">("title");
  const [at, setAt] = useState(0);
  const [picking, setPicking] = useState(false);
  const [said, setSaid] = useState("");
  const exclusions = useMemo(() => (review.protocol.criteria ?? []).filter((c) => c.kind === "exclude"), [review.protocol.criteria]);
  const queue = useMemo(
    () => records.filter((r) => (stage === "title" ? r.stage === "found" || r.stage === "title" : r.stage === "fulltext")),
    [records, stage],
  );
  const total = stage === "title"
    ? records.filter((r) => r.stage !== "deduplicated").length
    : records.filter((r) => r.stage === "fulltext" || r.stage === "included" || (r.stage === "excluded" && r.record.fullText)).length;
  const done = total - queue.length;
  const cur = queue[Math.min(at, Math.max(0, queue.length - 1))] ?? null;
  const curId = cur?.id ?? null;
  useEffect(() => { onPicking(picking); return () => onPicking(false); }, [picking, onPicking]);
  useEffect(() => { setPicking(false); }, [curId]);
  const inLibrary = cur ? sources.find((s) => (cur.doi && s.doi && s.doi.toLowerCase() === cur.doi.toLowerCase()) || s.hash === cur.hash) ?? null : null;

  const decide = useCallback(async (rec: ReviewRecord, part: Partial<ReviewRecord>): Promise<void> => {
    const r = await saveRecord(w, rec, { ...part, decided_at: new Date().toISOString() });
    if (r.ok) { onChanged(r.row); cue("next"); } else setSaid(both("rs.conflict"));
  }, [w, onChanged]);

  /** At title stage an include sends the record on to full text.
      At full text it is the one moment a record becomes a library
      source: linked if the library already has it, added if not. */
  const include = useCallback(async (): Promise<void> => {
    if (!cur) return;
    if (stage === "title") { await decide(cur, { stage: "fulltext" }); return; }
    let source_id = cur.source_id;
    if (!source_id) {
      const dup = await findDuplicate(w, cur.record.csl);
      if (dup?.sure) source_id = dup.source.id;
      else {
        const s = await addSource(w, cur.record.csl, {
          via: "search", verified: true,
          oa: cur.record.oa ? { isOa: cur.record.oa.isOa, url: cur.record.oa.url, at: new Date().toISOString() } : null,
          identifiers: cur.record.openalex ? { openalex: cur.record.openalex } : {},
        });
        if (s) { source_id = s.id; onSource(s); }
      }
    }
    await decide(cur, { stage: "included", source_id, record: { ...cur.record, fullText: true } });
  }, [cur, stage, w, decide, onSource]);

  const exclude = useCallback(async (reason: string | null): Promise<void> => {
    if (!cur) return;
    setPicking(false);
    await decide(cur, { stage: "excluded", reason, record: { ...cur.record, fullText: stage === "fulltext" } });
  }, [cur, stage, decide]);

  /** Maybe is "seen, undecided": the record stays in the queue and
      the page moves on, so a hard call can be left for the end. */
  const maybe = useCallback(async (): Promise<void> => {
    if (!cur) return;
    if (stage === "title" && cur.stage === "found") {
      const r = await saveRecord(w, cur, { stage: "title" });
      if (r.ok) onChanged(r.row);
    }
    setAt((a) => (a + 1 < queue.length ? a + 1 : 0));
  }, [cur, stage, w, onChanged, queue.length]);

  const askReason = useCallback((): void => {
    if (!cur) return;
    if (exclusions.length) setPicking(true); else void exclude(null);
  }, [cur, exclusions.length, exclude]);

  useKeys(useMemo(() => {
    const map: Record<string, () => void> = {
      y: () => { void include(); },
      x: askReason,
      m: () => { void maybe(); },
      j: () => setAt((a) => Math.min(a + 1, Math.max(0, queue.length - 1))),
      k: () => setAt((a) => Math.max(a - 1, 0)),
    };
    if (picking) {
      exclusions.forEach((c, i) => { map[String(i + 1)] = () => { void exclude(c.id); }; });
      map.Escape = () => setPicking(false);
    }
    return map;
  }, [include, askReason, maybe, exclude, exclusions, picking, queue.length]), true);

  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ChipButton pressed={stage === "title"} onClick={() => { setStage("title"); setAt(0); }}>{both("rs.rev.screen.title")}</ChipButton>
        <ChipButton pressed={stage === "fulltext"} onClick={() => { setStage("fulltext"); setAt(0); }}>{both("rs.rev.screen.fulltext")}</ChipButton>
        <span className="ml-auto text-t1 text-ink-soft tabular-nums" data-testid="rs-rev-meter">{done} {both("rs.rev.of")} {total} {both("rs.rev.decided")}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--paper-sunk)" }} aria-hidden="true">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: toneVar("rose"), transition: "width 240ms ease-out" }} />
      </div>
      <p className="text-t1 text-ink-soft"><W k="rs.rev.screen.hint" /></p>
      {said ? <p className="text-t1 text-danger" role="status">{said}</p> : null}
      {!cur ? <p className="text-t2 text-ink-soft"><W k="rs.rev.screen.done" /></p> : (
        <article className="grid gap-2" data-testid="rs-rev-record">
          <h3 className="text-t2 font-medium">{cur.record.title}</h3>
          <p className="text-t1 text-ink-soft">{[cur.record.authors, cur.record.year, cur.record.venue].filter(Boolean).join(" · ")} · {dbName(cur.database)}</p>
          {cur.record.abstract ? <p className="max-w-prose">{cur.record.abstract}</p> : <p className="text-t1 text-ink-soft"><W k="rs.rev.noabstract" /></p>}
          <p className="flex flex-wrap items-center gap-3 text-t1">
            {cur.doi ? <a href={`https://doi.org/${cur.doi}`} target="_blank" rel="noreferrer">{both("rs.rev.opendoi")}</a> : null}
            {cur.record.oa?.url ? <a href={cur.record.oa.url} target="_blank" rel="noreferrer">{both("rs.rev.openoa")}</a> : null}
            {inLibrary ? <Chip tone="accent">{both("rs.rev.inlibrary")} · {inLibrary.key}</Chip> : null}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" kind="solid" size="sm" onClick={() => { void include(); }}><W k="rs.rev.include" /> <kbd>y</kbd></Button>
            <Button type="button" kind="soft" size="sm" onClick={askReason}><W k="rs.rev.exclude" /> <kbd>x</kbd></Button>
            <Button type="button" kind="ghost" size="sm" onClick={() => { void maybe(); }}><W k="rs.rev.maybe" /> <kbd>m</kbd></Button>
            <span className="ml-auto text-t1 text-ink-soft tabular-nums">{Math.min(at, queue.length - 1) + 1} / {queue.length}</span>
          </div>
          {picking ? (
            <div data-testid="rs-rev-reasons">
              <Surface material="sunk" className="px-3 py-2 grid gap-1">
                <p className="text-t1"><W k="rs.rev.pickreason" /></p>
                <ol className="grid gap-1 pl-5">
                  {exclusions.map((c, i) => (
                    <li key={c.id}>
                      <button type="button" className="text-left" onClick={() => { void exclude(c.id); }}><kbd>{i + 1}</kbd> {c.id} · {c.text}</button>
                    </li>
                  ))}
                </ol>
              </Surface>
            </div>
          ) : null}
          {!exclusions.length ? <p className="text-t1 text-ink-soft"><W k="rs.rev.noreason" /></p> : null}
        </article>
      )}
    </Surface>
  );
}

/* ---------- PRISMA 2020, drawn from the rows ---------- */

interface Box { x: number; y: number; w: number; h: number; lines: string[] }

const clip = (s: string, n = 46): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function Prisma({ review, records }: { review: Review; records: ReviewRecord[] }) {
  const c = useMemo(() => prisma(records), [records]);
  const reason = (id: string): string => {
    const found = (review.protocol.criteria ?? []).find((x) => x.id === id);
    return found ? `${id} ${found.text}` : id;
  };
  return <PrismaFigure c={c} reason={reason} title={review.title} />;
}

/** The flow diagram out of counts, wherever the counts came from:
    the review's rows here, or numbers typed into the workshop's
    drawer for a review not run in the studio. */
export function PrismaFigure({ c, reason, title }: { c: PrismaCounts; reason: (id: string) => string; title: string }) {
  const lang = useToolLang();
  const ref = useRef<SVGSVGElement>(null);
  const say = (k: string): string => word(k)[lang];
  const byDb = Object.entries(c.byDatabase).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([d, n]) => `${dbName(d)}: ${n}`);
  const reasons = Object.entries(c.byReason).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id, n]) => `${clip(reason(id), 38)} (n = ${n})`);
  const L = 20, LW = 320, R = 380, RW = 300, LINE = 17;
  const h = (n: number): number => 22 + n * LINE;
  const left: Box[] = [];
  const right: Box[] = [];
  let y = 20;
  const identified: Box = { x: L, y, w: LW, h: h(1 + byDb.length), lines: [`${say("rs.rev.prisma.identified")} (n = ${c.identified})`, ...byDb] };
  left.push(identified);
  right.push({ x: R, y, w: RW, h: h(1), lines: [`${say("rs.rev.prisma.duplicates")} (n = ${c.duplicates})`] });
  y += identified.h + 40;
  const screened: Box = { x: L, y, w: LW, h: h(1), lines: [`${say("rs.rev.prisma.screened")} (n = ${c.screened})`] };
  left.push(screened);
  right.push({ x: R, y, w: RW, h: h(1), lines: [`${say("rs.rev.prisma.excluded")} (n = ${c.excludedAtTitle})`] });
  y += screened.h + 40;
  const sought: Box = { x: L, y, w: LW, h: h(1), lines: [`${say("rs.rev.prisma.sought")} (n = ${c.soughtFullText})`] };
  left.push(sought);
  y += sought.h + 40;
  const assessed: Box = { x: L, y, w: LW, h: h(1), lines: [`${say("rs.rev.prisma.assessed")} (n = ${c.soughtFullText})`] };
  left.push(assessed);
  const exFull: Box = { x: R, y, w: RW, h: h(1 + reasons.length), lines: [`${say("rs.rev.prisma.excluded.full")} (n = ${c.excludedAtFullText})`, ...reasons] };
  right.push(exFull);
  y += Math.max(assessed.h, exFull.h) + 40;
  const included: Box = { x: L, y, w: LW, h: h(1), lines: [`${say("rs.rev.prisma.included")} (n = ${c.included})`] };
  left.push(included);
  const height = y + included.h + 20;

  const box = (b: Box, i: number, bold: boolean): React.ReactNode => (
    <g key={`${b.x}-${i}`}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeWidth={1.2} />
      {b.lines.map((t, j) => (
        <text key={j} x={b.x + 12} y={b.y + 16 + j * LINE} fontSize={j === 0 ? 13 : 12} fontWeight={j === 0 && bold ? 600 : 400} fill="currentColor" fillOpacity={j === 0 ? 1 : 0.72}>{t}</text>
      ))}
    </g>
  );
  const down = (a: Box, b: Box): React.ReactNode => (
    <line key={`d${a.y}`} x1={a.x + a.w / 2} y1={a.y + a.h} x2={b.x + b.w / 2} y2={b.y - 2} stroke="currentColor" strokeWidth={1.2} markerEnd="url(#rs-prisma-arrow)" />
  );
  const across = (a: Box, b: Box): React.ReactNode => (
    <line key={`a${a.y}`} x1={a.x + a.w} y1={a.y + Math.min(a.h, b.h) / 2} x2={b.x - 2} y2={a.y + Math.min(a.h, b.h) / 2} stroke="currentColor" strokeWidth={1.2} markerEnd="url(#rs-prisma-arrow)" />
  );

  const svgText = (): string => {
    const el = ref.current;
    if (!el) return "";
    const copy = el.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copy.setAttribute("style", "color:#111;font-family:system-ui,sans-serif");
    return `<?xml version="1.0" encoding="UTF-8"?>\n${copy.outerHTML}`;
  };
  const exportSvg = (): void => download(`${slug(title)}-prisma.svg`, svgText(), "image/svg+xml");
  /** Through an <img> from a data URL, never createImageBitmap on
      the blob: an SVG is a document, and Chrome refuses to decode
      one as a bitmap. data: is allowed under img-src. */
  const exportPng = (): void => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 700 * 2; canvas.height = height * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => { if (blob) download(`${slug(title)}-prisma.png`, blob, "image/png"); }, "image/png");
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText())}`;
  };

  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.rev.prisma.hint" /></p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" kind="soft" size="sm" onClick={exportSvg}><W k="rs.rev.svg" /></Button>
        <Button type="button" kind="soft" size="sm" onClick={exportPng}><W k="rs.rev.png" /></Button>
        {c.pending.title + c.pending.fulltext ? <Chip tone="warn">{c.pending.title + c.pending.fulltext} {both("rs.rev.prisma.pending")}</Chip> : null}
      </div>
      <div className="overflow-x-auto">
        <svg ref={ref} viewBox={`0 0 700 ${height}`} width="700" height={height} className="max-w-full h-auto" role="img" aria-label={both("rs.rev.prisma")} data-testid="rs-prisma">
          <defs>
            <marker id="rs-prisma-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
            </marker>
          </defs>
          {left.map((b, i) => box(b, i, true))}
          {right.map((b, i) => box(b, i, false))}
          {down(identified, screened)}
          {down(screened, sought)}
          {down(sought, assessed)}
          {down(assessed, included)}
          {across(identified, right[0])}
          {across(screened, right[1])}
          {across(assessed, exFull)}
        </svg>
      </div>
    </Surface>
  );
}

/* ---------- extraction, a sheet with the reader's columns ---------- */

function Extraction({ w, review, records, onChanged }: { w: Who; review: Review; records: ReviewRecord[]; onChanged: (r: ReviewRecord) => void }) {
  const cols = review.protocol.columns?.length ? review.protocol.columns : DEFAULT_COLUMNS;
  const included = records.filter((r) => r.stage === "included");
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const value = (r: ReviewRecord, c: string): string => drafts[r.id]?.[c] ?? r.extraction[c] ?? "";
  const keep = async (r: ReviewRecord, c: string): Promise<void> => {
    const v = value(r, c);
    if (v === (r.extraction[c] ?? "")) return;
    const res = await saveRecord(w, r, { extraction: { ...r.extraction, [c]: v } });
    if (res.ok) { onChanged(res.row); cue("saved"); }
  };
  const csv = (): void => {
    const esc = (s: string): string => `"${s.replace(/"/g, "\"\"")}"`;
    const head = ["title", "authors", "year", "doi", ...cols].map(esc).join(",");
    const lines = included.map((r) => [r.record.title, r.record.authors, r.record.year ? String(r.record.year) : "", r.doi ?? "", ...cols.map((c) => value(r, c))].map(esc).join(","));
    download(`${slug(review.title)}-extraction.csv`, `${[head, ...lines].join("\n")}\n`, "text/csv");
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.rev.extract.hint" /></p>
      <div className="flex flex-wrap items-center gap-2">
        <Chip>{included.length} {both("rs.rev.prisma.included")}</Chip>
        <Button type="button" kind="soft" size="sm" disabled={!included.length} onClick={csv}><W k="rs.rev.extract.csv" /></Button>
      </div>
      {!included.length ? <p className="text-t2 text-ink-soft"><W k="rs.rev.included.none" /></p> : (
        <div className="overflow-x-auto">
          <table className="text-t1" data-testid="rs-rev-extract">
            <thead>
              <tr>
                <th className="text-left font-normal text-ink-soft pr-3"><W k="rs.rev.title" /></th>
                {cols.map((c) => <th key={c} className="text-left font-normal text-ink-soft pr-2">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {included.map((r) => (
                <tr key={r.id} className="align-top">
                  <th className="text-left font-normal pr-3 max-w-[18rem]">{r.record.title}<span className="block text-ink-soft">{[r.record.authors, r.record.year].filter(Boolean).join(" ")}</span></th>
                  {cols.map((c, i) => (
                    <td key={c} className="pr-2" style={{ minWidth: "9rem" }}>
                      <Field
                        id={`rs-x-${r.id}-${i}`} hideLabel label={`${c} · ${r.record.title}`} value={value(r, c)}
                        onChange={(e) => setDrafts((was) => ({ ...was, [r.id]: { ...(was[r.id] ?? {}), [c]: e.target.value } }))}
                        onBlur={() => { void keep(r, c); }} autoComplete="off"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Surface>
  );
}

/* ---------- appraisal, a checklist a source ---------- */

function Appraisal({ w, review, records, onChanged }: { w: Who; review: Review; records: ReviewRecord[]; onChanged: (r: ReviewRecord) => void }) {
  const tpl = APPRAISALS[review.protocol.appraisal ?? "econ"] ?? APPRAISALS.econ;
  const included = records.filter((r) => r.stage === "included");
  const answer = async (r: ReviewRecord, i: number, v: "yes" | "no" | "unclear"): Promise<void> => {
    const res = await saveRecord(w, r, { appraisal: { ...r.appraisal, [String(i)]: v } });
    if (res.ok) { onChanged(res.row); cue("tick"); }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.rev.appraise.hint" /> <Chip>{both("rs.rev.template")}: {tpl.name}</Chip></p>
      {!included.length ? <p className="text-t2 text-ink-soft"><W k="rs.rev.included.none" /></p> : included.map((r, n) => (
        <details key={r.id} open={n === 0} className="grid gap-2" data-testid="rs-rev-appraisal">
          <summary className="cursor-pointer flex flex-wrap items-center gap-2">
            <span className="mr-auto">{r.record.title}</span>
            <Chip tone="accent">{both("rs.rev.score")} {appraisalScore(r.appraisal, tpl.questions)} / {tpl.questions.length}</Chip>
          </summary>
          <ol className="grid gap-2 pl-5">
            {tpl.questions.map((q, i) => (
              <li key={i} className="grid gap-1">
                <span>{q}</span>
                <span className="flex flex-wrap gap-1">
                  {(["yes", "no", "unclear"] as const).map((v) => (
                    <ChipButton key={v} pressed={r.appraisal[String(i)] === v} onClick={() => { void answer(r, i, v); }}>{both(`rs.rev.${v}`)}</ChipButton>
                  ))}
                </span>
              </li>
            ))}
          </ol>
        </details>
      ))}
    </Surface>
  );
}

/* ---------- synthesis: the gap matrix, scoped to the review ---------- */

function Synthesis({ records, sources }: { records: ReviewRecord[]; sources: Source[] }) {
  const ids = new Set(records.filter((r) => r.stage === "included" && r.source_id).map((r) => r.source_id));
  const included = sources.filter((s) => ids.has(s.id));
  const tagged = included.filter((s) => s.tags.length);
  const gaps = gapMatrix(tagged);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2">
      <p className="text-t1 text-ink-soft"><W k="rs.rev.synthesis.hint" /> <Chip>{gaps.gaps} {both("rs.q.gaps.count")}</Chip></p>
      {!included.length ? <p className="text-t2 text-ink-soft"><W k="rs.rev.included.none" /></p>
        : !tagged.length ? <p className="text-t2 text-ink-soft"><W k="rs.rev.untagged" /></p> : (
          <div className="overflow-x-auto">
            <table className="text-t1" data-testid="rs-rev-gaps">
              <thead>
                <tr>
                  <th></th>
                  {tagged.map((s) => <th key={s.id} className="font-normal text-left align-bottom" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", maxHeight: "12rem" }}>{s.key}</th>)}
                </tr>
              </thead>
              <tbody>
                {gaps.tags.map((t) => (
                  <tr key={t}>
                    <th className="text-left font-normal pr-2">{t}</th>
                    {tagged.map((s) => (
                      <td key={s.id} className="text-center" style={{ minWidth: "1.6rem" }}>
                        {s.tags.includes(t) ? <span className="rs-row-dot inline-block" style={{ "--tone": toneVar("teal") } as CSSProperties} /> : <span className="text-ink-soft opacity-40">·</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </Surface>
  );
}

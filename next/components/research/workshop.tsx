"use client";

/* ============================================================
   research/workshop.tsx: the workshop. RESEARCH.md section 19.

   Thirty small tools out of lib/research-tools.ts, one card each
   on the hub and one page each, a form and an answer. The
   arithmetic is shared/research-tools.ts and is tested there; a
   tool here only draws it, and a tool that needs the library or
   the Worker asks for the account first. Most keep their answer
   in the query string, so a result is a link.
   ============================================================ */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { toneVar, type CslItem } from "@reiad/shared/research";
import { CSL_STYLES } from "@reiad/shared/csl";
import {
  EMAILS, HIJRI_MONTHS, VIVA, abbreviations, booleanString, consentForm, cvFrom, dInterval, dToOR, dToR, dataStatement, daysBetween, dueCards, eta2ToF, fromHijri,
  gridOf, idKind, intervalFromP, nCorrelation, nMean, nProportion, nRegression, nTwoMeans, nTwoProportions, newCard, orToD, pFromInterval, powerTwoMeans, questionFrom,
  rInterval, rToD, randomInts, readability, review as reviewCard, sample, shiftDays, shuffle, toHijri, toHtml, toLatex, toMarkdown, whichTest, wordStats, workingDays,
  type Card, type Clause, type Shape, type Syntax,
} from "@reiad/shared/research-tools";
import { returns } from "@reiad/shared/research-stats";
import { chartSvg } from "@reiad/shared/research-lab";
import { overlapsOf } from "@reiad/shared/research-write";
import type { PrismaCounts } from "@reiad/shared/research-review";
import {
  addNote, addReview, addSearch, addSource, checkJournal, findDuplicate, findJournals, freeCopy, getPrefs, listDocuments, listNotes, listSources, lookupDoi, lookupIsbn,
  lookupUrl, parseReference, saveNote, saveReview, type Note, type Prefs, type Who,
} from "../../lib/research-api";
import { makeEngine } from "../../lib/cite";
import { RESEARCH_TOOLS, researchTool } from "../../lib/research-tools";
import { methodsFor } from "../../lib/research-methods";
import { Button, ButtonLink } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";
import { PrismaFigure } from "./review";

/* ---------- the hub and the page ---------- */

export function Workshop({ tool }: { tool?: string }) {
  const lang = useToolLang();
  if (tool) return <ToolPage slug={tool} />;
  return (
    <div className="grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.ws.hint" /></p>
      <ul className="rs-rows grid gap-1 md:grid-cols-2" data-testid="rs-ws-deck">
        {RESEARCH_TOOLS.map((t) => (
          <li key={t.slug}>
            <a className="rs-row" href={`/tools/research/tools/${t.slug}`}>
              <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar(t.tone) } as CSSProperties} />
              <span className="rs-row-main"><span className="rs-row-title">{t.name[lang]}</span><span className="rs-row-sub">{t.dek[lang]}</span></span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToolPage({ slug }: { slug: string }) {
  const lang = useToolLang();
  const t = researchTool(slug);
  if (!t) return <p className="text-t2 text-ink-soft"><W k="rs.ws.missing" /></p>;
  const Body = TOOLS[slug];
  return (
    <div className="grid gap-3" data-testid={`rs-tool-${slug}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-t3 font-medium mr-auto"><span className="rs-row-dot inline-block mr-2" style={{ "--tone": toneVar(t.tone) } as CSSProperties} />{t.name[lang]}</h2>
        {t.room ? <ButtonLink href={`/tools/research/${t.room === "workshop" ? "tools" : t.room}`} kind="ghost" size="sm"><W k="rs.ws.room" /></ButtonLink> : null}
        <ButtonLink href="/tools/research/tools" kind="ghost" size="sm"><W k="rs.ws.all" /></ButtonLink>
      </div>
      <p className="text-t1 text-ink-soft">{t.dek[lang]}</p>
      {methodsFor({ tool: slug }).length ? (
        <p className="flex flex-wrap items-center gap-2 text-t1 text-ink-soft" data-testid="rs-tool-methods">
          <W k="rs.me.howto" />
          {methodsFor({ tool: slug }).map((m) => <ChipLink key={m.slug} href={`/tools/research/methods#${m.slug}`}>{m.title[lang]}</ChipLink>)}
        </p>
      ) : null}
      {Body ? (t.needsAccount ? <NeedsAccount><Body /></NeedsAccount> : <Body />) : <p className="text-t2 text-ink-soft"><W k="rs.ws.missing" /></p>}
    </div>
  );
}

function NeedsAccount({ children }: { children: ReactNode }) {
  const { w, answered } = useWho();
  if (!w) return <SignedOut answered={answered} />;
  return <WhoContext.Provider value={w}>{children}</WhoContext.Provider>;
}

const WhoContext = createContext<Who | null>(null);
const useW = (): Who => { const w = useContext(WhoContext); if (!w) throw new Error("signed out"); return w; };

/* ---------- small furniture ---------- */

function Out({ text, id }: { text: string; id?: string }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return (
    <div className="grid gap-1" data-testid={id}>
      <pre className="text-t1 whitespace-pre-wrap font-mono">{text}</pre>
      <div><ChipButton onClick={() => { void navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}>{copied ? both("rs.copied") : both("rs.ws.copy")}</ChipButton></div>
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: ReactNode }) => <tr><th className="text-left font-normal text-ink-soft pr-3 whitespace-nowrap">{k}</th><td className="tabular-nums">{v}</td></tr>;
const num = (v: number, d = 3): string => (Number.isFinite(v) ? v.toFixed(d) : "");
const useQuery = (): URLSearchParams => useMemo(() => (typeof location === "undefined" ? new URLSearchParams() : new URLSearchParams(location.search)), []);
const keepQuery = (o: Record<string, string>): void => {
  if (typeof history === "undefined") return;
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v) p.set(k, v);
  history.replaceState(null, "", `${location.pathname}${p.toString() ? `?${p}` : ""}`);
};

/* ---------- 1. cite this ---------- */

async function renderOne(styleId: string, csl: CslItem): Promise<{ citation: string; bibliography: string }> {
  const item = { ...csl, id: csl.id ?? "one" };
  const engine = await makeEngine(styleId, [item]);
  let citation = "", bibliography = "";
  try { citation = engine.makeCitationCluster([{ id: String(item.id) }]); } catch { citation = ""; }
  try { engine.updateItems([String(item.id)]); const b = engine.makeBibliography(); bibliography = b ? b[1].join("") : ""; } catch { bibliography = ""; }
  return { citation, bibliography: bibliography.replace(/<[^>]+>/g, "").trim() };
}

function CiteThis() {
  const w = useW();
  const q = useQuery();
  const [id, setId] = useState(q.get("id") ?? "");
  const [style, setStyle] = useState(q.get("style") ?? "apa");
  const [csl, setCsl] = useState<CslItem | null>(null);
  const [out, setOut] = useState<{ citation: string; bibliography: string } | null>(null);
  const [said, setSaid] = useState("");
  const look = async (): Promise<void> => {
    setSaid(""); setOut(null);
    const kind = idKind(id);
    const found = kind.kind === "doi" ? await lookupDoi(kind.id) : kind.kind === "isbn" ? await lookupIsbn(kind.id) : kind.kind === "url" ? await lookupUrl(kind.id) : null;
    if (!found) { setSaid(both("rs.ws.notfound")); return; }
    setCsl(found.csl);
    setOut(await renderOne(style, found.csl));
    keepQuery({ id, style });
  };
  useEffect(() => { if (csl) void renderOne(style, csl).then(setOut); }, [style, csl]);
  const keep = async (): Promise<void> => {
    if (!csl) return;
    const dup = await findDuplicate(w, csl);
    if (dup?.sure) { setSaid(both("rs.ws.already")); return; }
    const s = await addSource(w, csl, { via: idKind(id).kind === "isbn" ? "isbn" : idKind(id).kind === "url" ? "url" : "doi", verified: true });
    if (s) { cue("saved"); setSaid(both("rs.saved")); }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <form className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)_auto] items-end" onSubmit={(e) => { e.preventDefault(); void look(); }}>
        <Field id="rs-ws-id" label={<W k="rs.ws.id" />} value={id} onChange={(e) => setId(e.target.value)} autoComplete="off" />
        <Select id="rs-ws-style" label={<W k="rs.ws.style" />} value={style} onChange={(e) => setStyle(e.target.value)}>{CSL_STYLES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
        <Button type="submit" kind="solid" size="sm" disabled={!id.trim()}><W k="rs.ws.go" /></Button>
      </form>
      {said ? <p className="text-t1 text-ink-soft" role="status">{said}</p> : null}
      {out ? (
        <div className="grid gap-2" data-testid="rs-ws-cite">
          <p className="text-t1 text-ink-soft"><W k="rs.ws.intext" /></p><Out text={out.citation} />
          <p className="text-t1 text-ink-soft"><W k="rs.ws.reference" /></p><Out text={out.bibliography} />
          <div><Button type="button" kind="soft" size="sm" onClick={() => { void keep(); }}><W k="rs.ws.keep" /></Button></div>
        </div>
      ) : null}
    </Surface>
  );
}

/* ---------- 2. parse a reference ---------- */

function ParseReference() {
  const w = useW();
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<Awaited<ReturnType<typeof parseReference>>>(null);
  const [said, setSaid] = useState("");
  const go = async (): Promise<void> => { setSaid(""); const m = await parseReference(w, text); setMatches(m); if (!m) setSaid(both("rs.ws.failed")); };
  const keep = async (csl: CslItem): Promise<void> => { const s = await addSource(w, csl, { via: "doi", verified: true }); if (s) { cue("saved"); setSaid(both("rs.saved")); } };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <TextArea id="rs-ws-ref" label={<W k="rs.ws.reference.paste" />} value={text} onChange={(e) => setText(e.target.value)} rows={3} />
      <div><Button type="button" kind="solid" size="sm" disabled={!text.trim()} onClick={() => { void go(); }}><W k="rs.ws.go" /></Button></div>
      {said ? <p className="text-t1 text-ink-soft" role="status">{said}</p> : null}
      {matches ? (
        <ul className="rs-rows grid gap-1" data-testid="rs-ws-matches">
          {matches.map((m, i) => (
            <li key={i} className="rs-row">
              <span className="rs-row-main"><span className="rs-row-title">{String(m.csl.title ?? "")}</span><span className="rs-row-sub">{m.doi ?? ""} · {both("rs.ws.score")} {m.score.toFixed(0)}</span></span>
              <span className="rs-row-meta"><Button type="button" kind="soft" size="sm" onClick={() => { void keep(m.csl); }}><W k="rs.ws.keep" /></Button></span>
            </li>
          ))}
          {!matches.length ? <li className="text-t1 text-ink-soft"><W k="rs.ws.notfound" /></li> : null}
        </ul>
      ) : null}
    </Surface>
  );
}

/* ---------- 3. resolve an id ---------- */

const ID_HOMES: Record<string, (id: string) => string> = {
  doi: (id) => `https://doi.org/${id}`, arxiv: (id) => `https://arxiv.org/abs/${id}`, pmid: (id) => `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
  ssrn: (id) => `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=${id}`, openalex: (id) => `https://openalex.org/${id}`, orcid: (id) => `https://orcid.org/${id}`,
  isbn: (id) => `https://openlibrary.org/isbn/${id}`, url: (id) => id,
};

function ResolveId() {
  const [raw, setRaw] = useState("");
  const [found, setFound] = useState<CslItem | null | undefined>(undefined);
  const kind = idKind(raw);
  const look = async (): Promise<void> => {
    setFound(undefined);
    const f = kind.kind === "doi" ? await lookupDoi(kind.id) : kind.kind === "isbn" ? await lookupIsbn(kind.id) : null;
    setFound(f?.csl ?? null);
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void look(); }}>
        <Field id="rs-ws-anyid" label={<W k="rs.ws.id" />} value={raw} onChange={(e) => setRaw(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!raw.trim()}><W k="rs.ws.go" /></Button>
      </form>
      {raw.trim() ? (
        <table className="text-t1" data-testid="rs-ws-id-kind">
          <tbody>
            <Row k={both("rs.ws.kind")} v={<Chip tone="accent">{kind.kind}</Chip>} />
            <Row k={both("rs.ws.identifier")} v={<code>{kind.id}</code>} />
            {ID_HOMES[kind.kind] ? <Row k={both("rs.ws.lives")} v={<a href={ID_HOMES[kind.kind](kind.id)} target="_blank" rel="noreferrer">{ID_HOMES[kind.kind](kind.id)}</a>} /> : null}
            {found ? <Row k={both("rs.ws.title")} v={String(found.title ?? "")} /> : found === null ? <Row k={both("rs.ws.title")} v={both("rs.ws.notfound")} /> : null}
          </tbody>
        </table>
      ) : null}
    </Surface>
  );
}

/* ---------- 4. find a free copy, 5. is it retracted ---------- */

function FreeCopy() {
  const w = useW();
  const [doi, setDoi] = useState("");
  const [oa, setOa] = useState<{ isOa: boolean; url?: string } | null | undefined>(undefined);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void freeCopy(w, idKind(doi).id).then(setOa); }}>
        <Field id="rs-ws-doi" label="DOI" value={doi} onChange={(e) => setDoi(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!doi.trim()}><W k="rs.ws.go" /></Button>
      </form>
      {oa === null ? <p className="text-t1 text-ink-soft"><W k="rs.ws.failed" /></p> : oa ? (oa.isOa && oa.url ? <p className="text-t1"><Chip tone="accent">{both("rs.ws.oa.yes")}</Chip> <a href={oa.url} target="_blank" rel="noreferrer">{oa.url}</a></p> : <p className="text-t1"><Chip tone="warn">{both("rs.ws.oa.no")}</Chip></p>) : null}
    </Surface>
  );
}

function Retracted() {
  const w = useW();
  const [doi, setDoi] = useState("");
  const [rows, setRows] = useState<{ title: string; doi: string; retracted: { type: string; at?: string } | null }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const one = async (): Promise<void> => {
    const f = await lookupDoi(idKind(doi).id);
    setRows(f ? [{ title: String(f.csl.title ?? ""), doi: idKind(doi).id, retracted: f.retracted ?? null }] : []);
  };
  const library = async (): Promise<void> => {
    setBusy(true);
    try {
      const sources = (await listSources(w, { limit: 500 })).filter((s) => s.doi);
      const out: typeof rows = [];
      for (const s of sources.slice(0, 100)) {
        const f = await lookupDoi(s.doi ?? "");
        out.push({ title: s.title, doi: s.doi ?? "", retracted: f?.retracted ?? null });
      }
      setRows(out);
    } finally { setBusy(false); }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void one(); }}>
        <Field id="rs-ws-rdoi" label="DOI" value={doi} onChange={(e) => setDoi(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!doi.trim()}><W k="rs.ws.go" /></Button>
        <Button type="button" kind="soft" size="sm" disabled={busy} onClick={() => { void library(); }}><W k="rs.ws.retracted.library" /></Button>
      </form>
      {rows ? (
        <ul className="rs-rows grid gap-1" data-testid="rs-ws-retracted">
          {rows.map((r) => <li key={r.doi} className="rs-row"><span className="rs-row-main"><span className="rs-row-title">{r.title}</span><span className="rs-row-sub">{r.doi}</span></span><span className="rs-row-meta">{r.retracted ? <Chip tone="danger">{r.retracted.type}{r.retracted.at ? ` · ${r.retracted.at.slice(0, 10)}` : ""}</Chip> : <Chip>{both("rs.ws.retracted.no")}</Chip>}</span></li>)}
          {!rows.length ? <li className="text-t1 text-ink-soft"><W k="rs.ws.notfound" /></li> : null}
        </ul>
      ) : null}
    </Surface>
  );
}

/* ---------- 6. journal finder, 7. predatory check ---------- */

function JournalFinder() {
  const w = useW();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof findJournals>>>(null);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void findJournals(w, q).then(setRows); }}>
        <Field id="rs-ws-jq" label={<W k="rs.ws.journal.q" />} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!q.trim()}><W k="rs.ws.go" /></Button>
      </form>
      {rows ? (
        <div className="overflow-x-auto">
          <table className="text-t1" data-testid="rs-ws-journals">
            <thead><tr><th className="text-left font-normal text-ink-soft pr-3"><W k="rs.ws.journal" /></th><th className="text-left font-normal text-ink-soft pr-3"><W k="rs.ws.publisher" /></th><th className="text-left font-normal text-ink-soft pr-3">OA</th><th className="text-left font-normal text-ink-soft pr-3">DOAJ</th><th className="text-right font-normal text-ink-soft pr-3">APC $</th><th className="text-right font-normal text-ink-soft"><W k="rs.ws.works" /></th></tr></thead>
            <tbody>{rows.map((j) => <tr key={j.id}><td className="pr-3">{j.homepage ? <a href={j.homepage} target="_blank" rel="noreferrer">{j.name}</a> : j.name}{j.issn ? <span className="text-ink-soft"> {j.issn}</span> : null}</td><td className="pr-3">{j.publisher ?? ""}</td><td className="pr-3">{j.oa ? "✓" : ""}</td><td className="pr-3">{j.doaj ? "✓" : ""}</td><td className="text-right tabular-nums pr-3">{j.apc ?? ""}</td><td className="text-right tabular-nums">{j.works}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Surface>
  );
}

function JournalCheckTool() {
  const w = useW();
  const [issn, setIssn] = useState("");
  const [c, setC] = useState<Awaited<ReturnType<typeof checkJournal>> | undefined>(undefined);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.ws.predatory.hint" /></p>
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void checkJournal(w, issn).then(setC); }}>
        <Field id="rs-ws-issn" label="ISSN" value={issn} onChange={(e) => setIssn(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!issn.trim()}><W k="rs.ws.go" /></Button>
      </form>
      {c === null ? <p className="text-t1 text-ink-soft"><W k="rs.ws.failed" /></p> : c ? (
        <table className="text-t1" data-testid="rs-ws-doaj"><tbody>
          <Row k="DOAJ" v={c.inDoaj ? <Chip tone="accent">{both("rs.ws.doaj.yes")}</Chip> : <Chip tone="warn">{both("rs.ws.doaj.no")}</Chip>} />
          {c.title ? <Row k={both("rs.ws.journal")} v={c.title} /> : null}
          {c.publisher ? <Row k={both("rs.ws.publisher")} v={`${c.publisher}${c.country ? `, ${c.country}` : ""}`} /> : null}
          {c.apc !== null ? <Row k="APC" v={c.apc ? both("rs.rev.yes") : both("rs.rev.no")} /> : null}
          {c.licence.length ? <Row k={both("rs.ws.licence")} v={c.licence.join(", ")} /> : null}
        </tbody></table>
      ) : null}
      <ul className="text-t1 grid gap-1 pl-5 list-disc"><li><W k="rs.ws.predatory.q1" /></li><li><W k="rs.ws.predatory.q2" /></li><li><W k="rs.ws.predatory.q3" /></li><li><W k="rs.ws.predatory.q4" /></li></ul>
    </Surface>
  );
}

/* ---------- 8. boolean builder, 9. question builder ---------- */

function BooleanBuilder() {
  const { w } = useWho();
  const [clauses, setClauses] = useState<Clause[]>([{ field: "title", terms: [], op: "AND" }, { field: "all", terms: [], op: "AND" }]);
  const [texts, setTexts] = useState<string[]>(["", ""]);
  const [syntax, setSyntax] = useState<Syntax>("generic");
  const [said, setSaid] = useState("");
  const built = clauses.map((c, i) => ({ ...c, terms: texts[i].split(",").map((t) => t.trim()).filter(Boolean) }));
  const out = booleanString(built, syntax);
  const keep = async (): Promise<void> => {
    if (!w || !out) return;
    const s = await addSearch(w, { q: out, databases: [] }, null);
    if (s) { cue("saved"); setSaid(both("rs.saved")); }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      {clauses.map((c, i) => (
        <div key={i} className="grid gap-2 md:grid-cols-[6rem_8rem_minmax(0,1fr)] items-end">
          <Select id={`rs-ws-op-${i}`} label={<W k="rs.ws.operator" />} value={c.op} onChange={(e) => setClauses((was) => was.map((x, k) => (k === i ? { ...x, op: e.target.value as Clause["op"] } : x)))}>{["AND", "OR", "NOT"].map((o) => <option key={o}>{o}</option>)}</Select>
          <Select id={`rs-ws-field-${i}`} label={<W k="rs.ws.field" />} value={c.field} onChange={(e) => setClauses((was) => was.map((x, k) => (k === i ? { ...x, field: e.target.value as Clause["field"] } : x)))}>{["all", "title", "abstract", "keywords", "author"].map((o) => <option key={o}>{o}</option>)}</Select>
          <Field id={`rs-ws-terms-${i}`} label={<W k="rs.ws.terms" />} value={texts[i]} onChange={(e) => setTexts((was) => was.map((x, k) => (k === i ? e.target.value : x)))} autoComplete="off" />
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-2">
        <Button type="button" kind="ghost" size="sm" onClick={() => { setClauses((was) => [...was, { field: "all", terms: [], op: "AND" }]); setTexts((was) => [...was, ""]); }}><W k="rs.ws.clause.add" /></Button>
        <Select id="rs-ws-syntax" label={<W k="rs.ws.syntax" />} value={syntax} onChange={(e) => setSyntax(e.target.value as Syntax)}>{["generic", "pubmed", "scopus", "wos", "openalex"].map((o) => <option key={o}>{o}</option>)}</Select>
        {w ? <Button type="button" kind="soft" size="sm" disabled={!out} onClick={() => { void keep(); }}><W k="rs.ws.keep.search" /></Button> : null}
      </div>
      {said ? <p className="text-t1 text-ink-soft" role="status">{said}</p> : null}
      <Out text={out} id="rs-ws-boolean" />
    </Surface>
  );
}

function QuestionBuilder() {
  const { w } = useWho();
  const lang = useToolLang();
  const [frame, setFrame] = useState<"pico" | "spider" | "peo">("pico");
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [said, setSaid] = useState("");
  const SLOTS: Record<string, { id: string; en: string; bn: string }[]> = {
    pico: [{ id: "population", en: "Population", bn: "জনগোষ্ঠী" }, { id: "intervention", en: "Intervention or exposure", bn: "হস্তক্ষেপ" }, { id: "comparison", en: "Comparison", bn: "তুলনা" }, { id: "outcome", en: "Outcome", bn: "ফলাফল" }],
    spider: [{ id: "sample", en: "Sample", bn: "নমুনা" }, { id: "phenomenon", en: "Phenomenon of interest", bn: "আগ্রহের বিষয়" }, { id: "design", en: "Design", bn: "নকশা" }, { id: "evaluation", en: "Evaluation", bn: "মূল্যায়ন" }, { id: "research", en: "Research type", bn: "গবেষণার ধরন" }],
    peo: [{ id: "population", en: "Population", bn: "জনগোষ্ঠী" }, { id: "exposure", en: "Exposure", bn: "এক্সপোজার" }, { id: "outcome", en: "Outcome", bn: "ফলাফল" }],
  };
  const q = questionFrom(frame, slots);
  const start = async (): Promise<void> => {
    if (!w) return;
    const r = await addReview(w, { title: q.question.slice(0, 200), kind: "systematic" });
    if (!r) return;
    const criteria = q.criteria.map((c, i) => ({ id: c.startsWith("- ") ? `E${i + 1}` : `I${i + 1}`, kind: c.startsWith("- ") ? "exclude" as const : "include" as const, text: c.replace(/^- /, "") }));
    await saveReview(w, r, { protocol: { frame: frame === "peo" ? "plain" : frame, question: slots, criteria } });
    cue("saved"); setSaid(both("rs.ws.review.made"));
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="flex flex-wrap gap-1">{(["pico", "spider", "peo"] as const).map((f) => <ChipButton key={f} pressed={frame === f} onClick={() => { setFrame(f); setSlots({}); }}>{f.toUpperCase()}</ChipButton>)}</div>
      <div className="grid gap-2 md:grid-cols-2">{SLOTS[frame].map((s) => <Field key={s.id} id={`rs-ws-slot-${s.id}`} label={lang === "bn" ? s.bn : s.en} value={slots[s.id] ?? ""} onChange={(e) => setSlots((was) => ({ ...was, [s.id]: e.target.value }))} autoComplete="off" />)}</div>
      <p className="text-t2" data-testid="rs-ws-question">{q.question}</p>
      <Out text={q.criteria.join("\n")} />
      {w ? <div><Button type="button" kind="soft" size="sm" onClick={() => { void start(); }}><W k="rs.ws.review.start" /></Button></div> : null}
      {said ? <p className="text-t1 text-ink-soft" role="status">{said}</p> : null}
    </Surface>
  );
}

/* ---------- 10. sample size, 11. effect size, 12. p and CI, 13. which test ---------- */

function SampleSize() {
  const [kind, setKind] = useState("proportion");
  const [v, setV] = useState<Record<string, string>>({ p: "0.5", margin: "0.05", conf: "0.95", deff: "1", population: "", sd: "15", d: "0.5", alpha: "0.05", power: "0.8", r: "0.3", f2: "0.15", k: "3", p1: "0.4", p2: "0.5", n: "64" });
  const g = (k: string): number => Number(v[k]);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>): void => setV((was) => ({ ...was, [k]: e.target.value }));
  const F = ({ k, label }: { k: string; label: string }) => <Field id={`rs-ws-ss-${k}`} label={label} inputMode="decimal" value={v[k]} onChange={set(k)} autoComplete="off" />;
  let answer: ReactNode = null, assumptions = "";
  if (kind === "proportion") { answer = nProportion(g("p"), g("margin"), g("conf"), g("deff") || 1, v.population ? g("population") : null); assumptions = both("rs.ws.ss.a.proportion"); }
  else if (kind === "mean") { answer = nMean(g("sd"), g("margin"), g("conf")); assumptions = both("rs.ws.ss.a.mean"); }
  else if (kind === "twomeans") { answer = nTwoMeans(g("d"), g("alpha"), g("power")); assumptions = both("rs.ws.ss.a.twomeans"); }
  else if (kind === "twoprops") { answer = nTwoProportions(g("p1"), g("p2"), g("alpha"), g("power")); assumptions = both("rs.ws.ss.a.twoprops"); }
  else if (kind === "correlation") { answer = nCorrelation(g("r"), g("alpha"), g("power")); assumptions = both("rs.ws.ss.a.correlation"); }
  else if (kind === "regression") { answer = nRegression(g("f2"), g("k"), g("alpha"), g("power")); assumptions = both("rs.ws.ss.a.regression"); }
  else { answer = num(powerTwoMeans(g("n"), g("d"), g("alpha")), 3); assumptions = both("rs.ws.ss.a.power"); }
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="flex flex-wrap gap-1">{["proportion", "mean", "twomeans", "twoprops", "correlation", "regression", "power"].map((k) => <ChipButton key={k} pressed={kind === k} onClick={() => setKind(k)}>{both(`rs.ws.ss.${k}`)}</ChipButton>)}</div>
      <div className="grid gap-2 md:grid-cols-3">
        {kind === "proportion" ? <><F k="p" label="p" /><F k="margin" label={both("rs.ws.margin")} /><F k="conf" label={both("rs.ws.conf")} /><F k="deff" label="deff" /><F k="population" label="N" /></> : null}
        {kind === "mean" ? <><F k="sd" label="sd" /><F k="margin" label={both("rs.ws.margin")} /><F k="conf" label={both("rs.ws.conf")} /></> : null}
        {kind === "twomeans" ? <><F k="d" label="d" /><F k="alpha" label="α" /><F k="power" label={both("rs.ws.power")} /></> : null}
        {kind === "twoprops" ? <><F k="p1" label="p₁" /><F k="p2" label="p₂" /><F k="alpha" label="α" /><F k="power" label={both("rs.ws.power")} /></> : null}
        {kind === "correlation" ? <><F k="r" label="r" /><F k="alpha" label="α" /><F k="power" label={both("rs.ws.power")} /></> : null}
        {kind === "regression" ? <><F k="f2" label="f²" /><F k="k" label={both("rs.ws.predictors")} /><F k="alpha" label="α" /><F k="power" label={both("rs.ws.power")} /></> : null}
        {kind === "power" ? <><F k="n" label={both("rs.ws.pergroup")} /><F k="d" label="d" /><F k="alpha" label="α" /></> : null}
      </div>
      <p className="text-t3" data-testid="rs-ws-n"><Chip tone="accent">{kind === "power" ? both("rs.ws.power") : "n"} = {answer}</Chip>{kind !== "power" && kind !== "proportion" && kind !== "mean" && kind !== "regression" ? <span className="text-t1 text-ink-soft"> {both("rs.ws.pergroup")}</span> : null}</p>
      <p className="text-t1 text-ink-soft">{assumptions}</p>
    </Surface>
  );
}

function EffectSize() {
  const [d, setD] = useState("0.5");
  const [n1, setN1] = useState("50");
  const [n2, setN2] = useState("50");
  const [r, setR] = useState("0.3");
  const [n, setN] = useState("100");
  const [or, setOr] = useState("2");
  const [eta, setEta] = useState("0.06");
  const dv = Number(d), rv = Number(r), orv = Number(or), ev = Number(eta);
  const di = dInterval(dv, Number(n1), Number(n2)), ri = rInterval(rv, Number(n));
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="grid gap-2 md:grid-cols-4">
        <Field id="rs-ws-es-d" label="d" inputMode="decimal" value={d} onChange={(e) => setD(e.target.value)} /><Field id="rs-ws-es-n1" label="n₁" inputMode="numeric" value={n1} onChange={(e) => setN1(e.target.value)} /><Field id="rs-ws-es-n2" label="n₂" inputMode="numeric" value={n2} onChange={(e) => setN2(e.target.value)} />
        <Field id="rs-ws-es-r" label="r" inputMode="decimal" value={r} onChange={(e) => setR(e.target.value)} /><Field id="rs-ws-es-n" label="n" inputMode="numeric" value={n} onChange={(e) => setN(e.target.value)} />
        <Field id="rs-ws-es-or" label="OR" inputMode="decimal" value={or} onChange={(e) => setOr(e.target.value)} /><Field id="rs-ws-es-eta" label="η²" inputMode="decimal" value={eta} onChange={(e) => setEta(e.target.value)} />
      </div>
      <table className="text-t1" data-testid="rs-ws-es"><tbody>
        <Row k="d → r" v={num(dToR(dv))} /><Row k="d → OR" v={num(dToOR(dv))} /><Row k={`d 95% CI (n₁ ${n1}, n₂ ${n2})`} v={`${num(di[0])} to ${num(di[1])}`} />
        <Row k="r → d" v={num(rToD(rv))} /><Row k={`r 95% CI (n ${n})`} v={`${num(ri[0])} to ${num(ri[1])}`} />
        <Row k="OR → d" v={num(orToD(orv))} /><Row k="η² → f" v={num(eta2ToF(ev))} />
      </tbody></table>
    </Surface>
  );
}

function PAndCi() {
  const [est, setEst] = useState("2"); const [lo, setLo] = useState("1"); const [hi, setHi] = useState("3"); const [p, setP] = useState("0.03"); const [ratio, setRatio] = useState(false);
  const a = pFromInterval(Number(est), Number(lo), Number(hi), 0.95, ratio);
  const b = intervalFromP(Number(est), Number(p), 0.95, ratio);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="grid gap-2 md:grid-cols-4">
        <Field id="rs-ws-pc-est" label={both("rs.ws.estimate")} inputMode="decimal" value={est} onChange={(e) => setEst(e.target.value)} /><Field id="rs-ws-pc-lo" label={both("rs.ws.lower")} inputMode="decimal" value={lo} onChange={(e) => setLo(e.target.value)} /><Field id="rs-ws-pc-hi" label={both("rs.ws.upper")} inputMode="decimal" value={hi} onChange={(e) => setHi(e.target.value)} /><Field id="rs-ws-pc-p" label="p" inputMode="decimal" value={p} onChange={(e) => setP(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-t1"><input type="checkbox" checked={ratio} onChange={(e) => setRatio(e.target.checked)} /> <W k="rs.ws.ratio" /></label>
      <table className="text-t1" data-testid="rs-ws-pci"><tbody>
        <Row k={both("rs.ws.fromci")} v={`se ${num(a.se, 4)}, z ${num(a.z, 2)}, p ${a.p < 0.0001 ? "< 0.0001" : num(a.p, 4)}`} />
        <Row k={both("rs.ws.fromp")} v={`se ${num(b.se, 4)}, 95% CI ${num(b.lo)} to ${num(b.hi)}`} />
      </tbody></table>
    </Surface>
  );
}

function WhichTest() {
  const lang = useToolLang();
  const [s, setS] = useState<Shape>({ outcome: "continuous", groups: "two", paired: false, normal: true, predictors: "none", panel: false, endogenous: false });
  const advice = whichTest(s);
  const set = <K extends keyof Shape>(k: K, v: Shape[K]): void => setS((was) => ({ ...was, [k]: v }));
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="grid gap-2 md:grid-cols-3">
        <Select id="rs-ws-wt-outcome" label={<W k="rs.ws.wt.outcome" />} value={s.outcome} onChange={(e) => set("outcome", e.target.value as Shape["outcome"])}>{["continuous", "binary", "categorical", "count"].map((o) => <option key={o}>{o}</option>)}</Select>
        <Select id="rs-ws-wt-groups" label={<W k="rs.ws.wt.groups" />} value={s.groups} onChange={(e) => set("groups", e.target.value as Shape["groups"])}>{["one", "two", "many"].map((o) => <option key={o}>{o}</option>)}</Select>
        <Select id="rs-ws-wt-predictors" label={<W k="rs.ws.wt.predictors" />} value={s.predictors} onChange={(e) => set("predictors", e.target.value as Shape["predictors"])}>{["none", "one", "many"].map((o) => <option key={o}>{o}</option>)}</Select>
      </div>
      <div className="flex flex-wrap gap-3 text-t1">
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.paired} onChange={(e) => set("paired", e.target.checked)} /> <W k="rs.ws.wt.paired" /></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.normal} onChange={(e) => set("normal", e.target.checked)} /> <W k="rs.ws.wt.normal" /></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.panel} onChange={(e) => set("panel", e.target.checked)} /> <W k="rs.ws.wt.panel" /></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.endogenous} onChange={(e) => set("endogenous", e.target.checked)} /> <W k="rs.ws.wt.endogenous" /></label>
      </div>
      <ul className="grid gap-2" data-testid="rs-ws-advice">
        {advice.map((a, i) => <li key={i} className="grid gap-1"><p className="text-t2"><Chip tone="accent">{a.test[lang]}</Chip></p><p className="text-t1 text-ink-soft">{a.why[lang]}</p>{a.method ? <p className="text-t1"><a href={`/tools/research/lab?method=${a.method}`}><W k="rs.ws.wt.open" /></a></p> : null}</li>)}
      </ul>
    </Surface>
  );
}

/* ---------- 14. returns, 15. calculators ---------- */

function Returns() {
  const [text, setText] = useState("100, 102, 101, 105, 104");
  const prices = text.split(/[\s,;]+/).map(Number).filter((v) => Number.isFinite(v) && v > 0);
  const simple = returns(prices), log = returns(prices, true);
  const svg = prices.length > 1 ? chartSvg({ kind: "line", series: [{ name: "simple", points: simple.map((y, x) => ({ x: x + 1, y })) }, { name: "log", points: log.map((y, x) => ({ x: x + 1, y })) }], yLabel: "return", xLabel: "t" }) : "";
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <TextArea id="rs-ws-prices" label={<W k="rs.ws.prices" />} value={text} onChange={(e) => setText(e.target.value)} rows={3} />
      {simple.length ? <table className="text-t1 tabular-nums" data-testid="rs-ws-returns"><thead><tr><th className="text-left font-normal text-ink-soft pr-3">t</th><th className="text-left font-normal text-ink-soft pr-3">simple</th><th className="text-left font-normal text-ink-soft">log</th></tr></thead><tbody>{simple.map((v, i) => <tr key={i}><td className="pr-3">{i + 1}</td><td className="pr-3">{num(v, 5)}</td><td>{num(log[i], 5)}</td></tr>)}</tbody></table> : null}
      {svg ? <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="returns" className="max-w-full h-auto" /> : null}
    </Surface>
  );
}

function Calculators() {
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2">
      <p className="text-t1 text-ink-soft"><W k="rs.ws.calculators.hint" /></p>
      <div className="flex flex-wrap gap-2"><ButtonLink href="/tools" kind="soft" size="sm"><W k="rs.ws.calculators.open" /></ButtonLink></div>
    </Surface>
  );
}

/* ---------- 16. hijri, 17. dates ---------- */

function Hijri() {
  const lang = useToolLang();
  const today = new Date().toISOString().slice(0, 10);
  const [g, setG] = useState(today);
  const [h, setH] = useState({ y: String(toHijri(today).y), m: String(toHijri(today).m), d: String(toHijri(today).d) });
  const fromG = toHijri(g);
  const toG = fromHijri(Number(h.y), Number(h.m), Number(h.d));
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.ws.hijri.hint" /></p>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-1"><Field id="rs-ws-greg" type="date" label={<W k="rs.ws.gregorian" />} value={g} onChange={(e) => setG(e.target.value)} /><p className="text-t2" data-testid="rs-ws-hijri">{fromG.d} {HIJRI_MONTHS[fromG.m - 1]?.[lang]} {fromG.y} AH</p></div>
        <div className="grid gap-1"><div className="grid grid-cols-3 gap-1"><Field id="rs-ws-hd" label={<W k="rs.ws.day" />} inputMode="numeric" value={h.d} onChange={(e) => setH((was) => ({ ...was, d: e.target.value }))} /><Select id="rs-ws-hm" label={<W k="rs.ws.month" />} value={h.m} onChange={(e) => setH((was) => ({ ...was, m: e.target.value }))}>{HIJRI_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m[lang]}</option>)}</Select><Field id="rs-ws-hy" label={<W k="rs.ws.year" />} inputMode="numeric" value={h.y} onChange={(e) => setH((was) => ({ ...was, y: e.target.value }))} /></div><p className="text-t2">{toG}</p></div>
      </div>
    </Surface>
  );
}

function Dates() {
  const today = new Date().toISOString().slice(0, 10);
  const [a, setA] = useState(today); const [b, setB] = useState(shiftDays(today, 30)); const [buffer, setBuffer] = useState("14"); const [weekend, setWeekend] = useState("nz");
  const wk = weekend === "bd" ? [5, 6] : [6, 0];
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="grid gap-2 md:grid-cols-4">
        <Field id="rs-ws-da" type="date" label={<W k="rs.ws.from" />} value={a} onChange={(e) => setA(e.target.value)} /><Field id="rs-ws-db" type="date" label={<W k="rs.ws.to" />} value={b} onChange={(e) => setB(e.target.value)} />
        <Field id="rs-ws-buffer" label={<W k="rs.ws.buffer" />} inputMode="numeric" value={buffer} onChange={(e) => setBuffer(e.target.value)} />
        <Select id="rs-ws-weekend" label={<W k="rs.ws.weekend" />} value={weekend} onChange={(e) => setWeekend(e.target.value)}><option value="nz">Sat, Sun</option><option value="bd">Fri, Sat</option></Select>
      </div>
      <table className="text-t1 tabular-nums" data-testid="rs-ws-dates"><tbody>
        <Row k={both("rs.ws.days")} v={a && b ? daysBetween(a, b) : ""} /><Row k={both("rs.ws.workingdays")} v={a && b ? workingDays(a, b, wk) : ""} /><Row k={both("rs.ws.minusbuffer")} v={b ? shiftDays(b, -(Number(buffer) || 0)) : ""} />
      </tbody></table>
    </Surface>
  );
}

/* ---------- 18. words, 19. abbreviations, 20. readability, 21. self-overlap ---------- */

function Words() {
  const [text, setText] = useState("");
  const s = wordStats(text);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <TextArea id="rs-ws-text" label={<W k="rs.ws.text" />} value={text} onChange={(e) => setText(e.target.value)} rows={8} />
      <table className="text-t1 tabular-nums" data-testid="rs-ws-words"><tbody>
        <Row k={both("rs.ws.words")} v={s.words} /><Row k={both("rs.ws.latin")} v={s.latin} /><Row k={both("rs.ws.bangla")} v={s.bangla} /><Row k={both("rs.ws.characters")} v={`${s.characters} (${s.noSpaces})`} /><Row k={both("rs.ws.sentences")} v={s.sentences} /><Row k={both("rs.ws.minutes")} v={s.minutes} />
      </tbody></table>
    </Surface>
  );
}

function Abbreviations() {
  const [text, setText] = useState("");
  const rows = abbreviations(text);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <TextArea id="rs-ws-abbr" label={<W k="rs.ws.text" />} value={text} onChange={(e) => setText(e.target.value)} rows={8} />
      {rows.length ? <table className="text-t1" data-testid="rs-ws-abbrs"><thead><tr><th className="text-left font-normal text-ink-soft pr-3"><W k="rs.ws.abbr" /></th><th className="text-left font-normal text-ink-soft pr-3"><W k="rs.ws.definition" /></th><th className="text-left font-normal text-ink-soft pr-3"><W k="rs.ws.uses" /></th><th className="text-left font-normal text-ink-soft"></th></tr></thead><tbody>{rows.map((r) => <tr key={r.abbr}><td className="pr-3"><code>{r.abbr}</code></td><td className="pr-3">{r.definition ?? <span className="text-ink-soft">{both("rs.ws.undefined")}</span>}</td><td className="pr-3 tabular-nums">{r.uses}</td><td>{r.usedBefore ? <Chip tone="warn">{both("rs.ws.usedbefore")}</Chip> : null}</td></tr>)}</tbody></table> : null}
    </Surface>
  );
}

function ReadabilityTool() {
  const [text, setText] = useState("");
  const r = readability(text);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <TextArea id="rs-ws-read" label={<W k="rs.ws.text" />} value={text} onChange={(e) => setText(e.target.value)} rows={8} />
      <table className="text-t1 tabular-nums" data-testid="rs-ws-readability"><tbody>
        <Row k={both("rs.ws.sentences")} v={r.sentences} /><Row k={both("rs.ws.meansentence")} v={num(r.meanSentence, 1)} /><Row k={both("rs.ws.longest")} v={r.longest} /><Row k={both("rs.ws.longwords")} v={r.longWords} /><Row k={both("rs.ws.passive")} v={r.passive} />
      </tbody></table>
      {r.passiveSentences.length ? <ul className="text-t1 text-ink-soft grid gap-1 pl-5 list-disc">{r.passiveSentences.map((s, i) => <li key={i}>{s}</li>)}</ul> : null}
    </Surface>
  );
}

function SelfOverlap() {
  const w = useW();
  const [text, setText] = useState("");
  const [docs, setDocs] = useState<{ name: string; text: string }[]>([]);
  useEffect(() => { void listDocuments(w).then((d) => setDocs(d.map((x) => ({ name: x.title, text: x.text })))); }, [w]);
  const runs = overlapsOf(text, docs);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.ws.overlap.hint" /> <Chip>{docs.length}</Chip></p>
      <TextArea id="rs-ws-overlap" label={<W k="rs.ws.text" />} value={text} onChange={(e) => setText(e.target.value)} rows={8} />
      {text.trim() ? (runs.length ? <ul className="grid gap-1 text-t1" data-testid="rs-ws-overlaps">{runs.map((o, i) => <li key={i}><Chip tone="warn">{o.with}</Chip> {o.run} <span className="text-ink-soft">({o.words})</span></li>)}</ul> : <p className="text-t1 text-ink-soft"><W k="rs.ws.overlap.none" /></p>) : null}
    </Surface>
  );
}

/* ---------- 22. table maker, 23. equation, 24. PRISMA drawer ---------- */

function TableMaker() {
  const [text, setText] = useState("name\tvalue\nrice\t10\ndal\t20");
  const g = gridOf(text);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <TextArea id="rs-ws-grid" label={<W k="rs.ws.grid" />} hint={<W k="rs.ws.grid.hint" />} value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      <p className="text-t1 text-ink-soft">Markdown</p><Out text={toMarkdown(g)} id="rs-ws-md" />
      <p className="text-t1 text-ink-soft">HTML</p><Out text={toHtml(g)} />
      <p className="text-t1 text-ink-soft">LaTeX</p><Out text={toLatex(g)} />
    </Surface>
  );
}

function Equation() {
  const [tex, setTex] = useState("\\hat{\\beta} = (X'X)^{-1} X'y");
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.ws.equation.hint" /></p>
      <TextArea id="rs-ws-tex" label="LaTeX" value={tex} onChange={(e) => setTex(e.target.value)} rows={3} className="font-mono" />
      <Out text={`$$\n${tex}\n$$`} />
    </Surface>
  );
}

function PrismaDrawer() {
  const [v, setV] = useState<Record<string, string>>({ identified: "1200", duplicates: "300", excludedTitle: "700", sought: "200", excludedFull: "150", included: "50", reasons: "wrong population: 80\nno outcome: 40\nnot empirical: 30" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setV((was) => ({ ...was, [k]: e.target.value }));
  const g = (k: string): number => Number(v[k]) || 0;
  const byReason: Record<string, number> = {};
  for (const line of v.reasons.split("\n")) { const m = /^(.*?):\s*(\d+)\s*$/.exec(line.trim()); if (m) byReason[m[1]] = Number(m[2]); }
  const c: PrismaCounts = { identified: g("identified"), byDatabase: {}, duplicates: g("duplicates"), screened: g("identified") - g("duplicates"), excludedAtTitle: g("excludedTitle"), soughtFullText: g("sought"), excludedAtFullText: g("excludedFull"), byReason, included: g("included"), pending: { title: 0, fulltext: 0 } };
  return (
    <div className="grid gap-3">
      <Surface material="pane" className="px-4 py-3 grid gap-2">
        <div className="grid gap-2 md:grid-cols-3">
          {(["identified", "duplicates", "excludedTitle", "sought", "excludedFull", "included"] as const).map((k) => <Field key={k} id={`rs-ws-pr-${k}`} label={both(`rs.ws.pr.${k}`)} inputMode="numeric" value={v[k]} onChange={set(k)} />)}
        </div>
        <TextArea id="rs-ws-pr-reasons" label={<W k="rs.ws.pr.reasons" />} value={v.reasons} onChange={set("reasons")} rows={3} />
      </Surface>
      <PrismaFigure c={c} reason={(id) => id} title={both("rs.rev.prisma")} />
    </div>
  );
}

/* ---------- 25. quiz me, 26. viva bank ---------- */

function QuizMe() {
  const w = useW();
  const today = new Date().toISOString().slice(0, 10);
  const [note, setNote] = useState<Note | null | undefined>(undefined);
  const [front, setFront] = useState(""); const [back, setBack] = useState("");
  const [show, setShow] = useState(false);
  const cards = useMemo(() => (Array.isArray(note?.meta.cards) ? (note.meta.cards as Card[]) : []), [note]);
  const due = dueCards(cards, today);
  const current = due[0];
  useEffect(() => { void listNotes(w, { kind: "memo", limit: 200 }).then((ns) => setNote(ns.find((n) => n.meta.quiz === true) ?? null)); }, [w]);
  const keep = async (next: Card[]): Promise<void> => {
    if (note) { const r = await saveNote(w, note.id, { meta: { ...note.meta, cards: next } }, note.title); if (r.ok) setNote(r.row); }
    else { const n = await addNote(w, { kind: "memo", title: both("rs.ws.quiz"), meta: { quiz: true, cards: next }, text: "", body: "" }); if (n) setNote(n); }
  };
  const add = async (): Promise<void> => { if (!front.trim() || !back.trim()) return; await keep([...cards, newCard(crypto.randomUUID(), front.trim(), back.trim(), today)]); setFront(""); setBack(""); cue("saved"); };
  const grade = async (g: 0 | 1 | 2 | 3 | 4 | 5): Promise<void> => { if (!current) return; await keep(cards.map((c) => (c.id === current.id ? reviewCard(c, g, today) : c))); setShow(false); cue("tick"); };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <form className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end" onSubmit={(e) => { e.preventDefault(); void add(); }}>
        <Field id="rs-ws-front" label={<W k="rs.ws.front" />} value={front} onChange={(e) => setFront(e.target.value)} autoComplete="off" /><Field id="rs-ws-back" label={<W k="rs.ws.back" />} value={back} onChange={(e) => setBack(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!front.trim() || !back.trim()}><W k="rs.ws.card.add" /></Button>
      </form>
      <p className="text-t1 text-ink-soft"><Chip>{cards.length} {both("rs.ws.cards")}</Chip> <Chip tone="accent">{due.length} {both("rs.ws.due")}</Chip></p>
      {current ? (
        <div className="grid gap-2" data-testid="rs-ws-card">
          <p className="text-t3">{current.front}</p>
          {show ? <p className="text-t2">{current.back}</p> : <div><Button type="button" kind="soft" size="sm" onClick={() => setShow(true)}><W k="rs.ws.show" /></Button></div>}
          {show ? <div className="flex flex-wrap gap-1">{([0, 3, 4, 5] as const).map((g) => <ChipButton key={g} onClick={() => { void grade(g); }}>{both(`rs.ws.grade.${g}`)}</ChipButton>)}</div> : null}
        </div>
      ) : note !== undefined ? <p className="text-t1 text-ink-soft"><W k="rs.ws.nothing.due" /></p> : null}
    </Surface>
  );
}

function VivaBank() {
  const w = useW();
  const lang = useToolLang();
  const [note, setNote] = useState<Note | null | undefined>(undefined);
  const answers = useMemo(() => (typeof note?.meta.answers === "object" && note.meta.answers ? (note.meta.answers as Record<string, string>) : {}), [note]);
  useEffect(() => { void listNotes(w, { kind: "memo", limit: 200 }).then((ns) => setNote(ns.find((n) => n.meta.viva === true) ?? null)); }, [w]);
  const keep = async (i: number, text: string): Promise<void> => {
    if ((answers[String(i)] ?? "") === text) return;
    const next = { ...answers, [String(i)]: text };
    if (note) { const r = await saveNote(w, note.id, { meta: { ...note.meta, answers: next } }, note.title); if (r.ok) { setNote(r.row); cue("saved"); } }
    else { const n = await addNote(w, { kind: "memo", title: both("rs.ws.viva"), meta: { viva: true, answers: next }, text: "", body: "" }); if (n) { setNote(n); cue("saved"); } }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <ol className="grid gap-3 pl-5" data-testid="rs-ws-viva">
        {VIVA.map((q, i) => <li key={i} className="grid gap-1"><p className="text-t2">{q[lang]}</p><TextArea id={`rs-ws-viva-${i}`} hideLabel label={q.en} defaultValue={answers[String(i)] ?? ""} onBlur={(e) => { void keep(i, e.target.value); }} rows={2} /></li>)}
      </ol>
    </Surface>
  );
}

/* ---------- 27. ethics helper, 28. email templates, 29. CV ---------- */

function usePrefs(w: Who): Prefs | null {
  const [p, setP] = useState<Prefs | null>(null);
  useEffect(() => { void getPrefs(w).then(setP); }, [w]);
  return p;
}

function EthicsHelper() {
  const { w } = useWho();
  const lang = useToolLang();
  const [d, setD] = useState({ name: "", affiliation: "", project: "", supervisor: "", data: "", storage: "", retention: "" });
  useEffect(() => { if (w) void getPrefs(w).then((p) => setD((was) => ({ ...was, name: was.name || String(p.name ?? ""), affiliation: was.affiliation || String(p.affiliation ?? "") }))); }, [w]);
  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement>): void => setD((was) => ({ ...was, [k]: e.target.value }));
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="grid gap-2 md:grid-cols-3">
        {(Object.keys(d) as (keyof typeof d)[]).map((k) => <Field key={k} id={`rs-ws-eth-${k}`} label={both(`rs.ws.eth.${k}`)} value={d[k]} onChange={set(k)} autoComplete="off" />)}
      </div>
      <p className="text-t1 text-ink-soft"><W k="rs.ws.eth.statement" /></p><Out text={dataStatement(d, lang)} id="rs-ws-statement" />
      <p className="text-t1 text-ink-soft"><W k="rs.ws.eth.consent" /></p><Out text={consentForm(d, lang)} />
    </Surface>
  );
}

function EmailTemplates() {
  const w = useW();
  const lang = useToolLang();
  const prefs = usePrefs(w);
  const [which, setWhich] = useState("author");
  const [o, setO] = useState({ to: "", paper: "", venue: "" });
  const d = { name: String(prefs?.name ?? ""), affiliation: String(prefs?.affiliation ?? ""), email: typeof prefs?.email === "string" ? prefs.email : undefined, project: "" };
  const tpl = EMAILS.find((e) => e.id === which) ?? EMAILS[0];
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="flex flex-wrap gap-1">{EMAILS.map((e) => <ChipButton key={e.id} pressed={which === e.id} onClick={() => setWhich(e.id)}>{e.name[lang]}</ChipButton>)}</div>
      <div className="grid gap-2 md:grid-cols-3">
        <Field id="rs-ws-em-to" label={<W k="rs.ws.em.to" />} value={o.to} onChange={(e) => setO((was) => ({ ...was, to: e.target.value }))} autoComplete="off" /><Field id="rs-ws-em-paper" label={<W k="rs.ws.em.paper" />} value={o.paper} onChange={(e) => setO((was) => ({ ...was, paper: e.target.value }))} autoComplete="off" /><Field id="rs-ws-em-venue" label={<W k="rs.ws.em.venue" />} value={o.venue} onChange={(e) => setO((was) => ({ ...was, venue: e.target.value }))} autoComplete="off" />
      </div>
      <Out text={tpl.write(d, o)} id="rs-ws-email" />
    </Surface>
  );
}

function CvTool() {
  const w = useW();
  const prefs = usePrefs(w);
  const [name, setName] = useState("");
  const [text, setText] = useState<string | null>(null);
  useEffect(() => { if (prefs && !name) setName(String(prefs.name ?? "")); }, [prefs, name]);
  const build = async (): Promise<void> => { const sources = await listSources(w, { limit: 500 }); setText(cvFrom(sources, name)); };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void build(); }}>
        <Field id="rs-ws-cv-name" label={<W k="rs.ws.cv.name" />} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        <Button type="submit" kind="solid" size="sm" disabled={!name.trim()}><W k="rs.ws.go" /></Button>
      </form>
      {text !== null ? (text ? <Out text={text} id="rs-ws-cv" /> : <p className="text-t1 text-ink-soft"><W k="rs.ws.cv.none" /></p>) : null}
    </Surface>
  );
}

/* ---------- 30. random and sampling ---------- */

function Random() {
  const [seed, setSeed] = useState(String(Math.floor(Math.random() * 1e6)));
  const [n, setN] = useState("10"); const [lo, setLo] = useState("1"); const [hi, setHi] = useState("100"); const [rows, setRows] = useState(""); const [k, setK] = useState("3");
  const s = Number(seed) || 0;
  const list = rows.split("\n").map((r) => r.trim()).filter(Boolean);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <div className="grid gap-2 md:grid-cols-5">
        <Field id="rs-ws-seed" label={<W k="rs.ws.seed" />} inputMode="numeric" value={seed} onChange={(e) => setSeed(e.target.value)} /><Field id="rs-ws-rn" label="n" inputMode="numeric" value={n} onChange={(e) => setN(e.target.value)} /><Field id="rs-ws-rlo" label={both("rs.ws.lower")} inputMode="numeric" value={lo} onChange={(e) => setLo(e.target.value)} /><Field id="rs-ws-rhi" label={both("rs.ws.upper")} inputMode="numeric" value={hi} onChange={(e) => setHi(e.target.value)} /><Field id="rs-ws-rk" label="k" inputMode="numeric" value={k} onChange={(e) => setK(e.target.value)} />
      </div>
      <p className="text-t1 text-ink-soft"><W k="rs.ws.numbers" /></p><Out text={randomInts(s, Math.min(1000, Number(n) || 0), Number(lo) || 0, Number(hi) || 0).join(", ")} id="rs-ws-random" />
      <TextArea id="rs-ws-rows" label={<W k="rs.ws.rows" />} value={rows} onChange={(e) => setRows(e.target.value)} rows={4} />
      {list.length ? <><p className="text-t1 text-ink-soft"><W k="rs.ws.sample" /></p><Out text={sample(s, list, Number(k) || 0).join("\n")} /><p className="text-t1 text-ink-soft"><W k="rs.ws.order" /></p><Out text={shuffle(s, list).join("\n")} /></> : null}
      <p className="text-t1 text-ink-soft"><W k="rs.ws.seed.hint" /> <code>{s}</code></p>
    </Surface>
  );
}

const TOOLS: Record<string, () => ReactNode> = {
  "cite-this": CiteThis, "parse-reference": ParseReference, "resolve-id": ResolveId, "free-copy": FreeCopy, retracted: Retracted, "journal-finder": JournalFinder,
  "journal-check": JournalCheckTool, "boolean-builder": BooleanBuilder, "question-builder": QuestionBuilder, "sample-size": SampleSize, "effect-size": EffectSize,
  "p-and-ci": PAndCi, "which-test": WhichTest, returns: Returns, calculators: Calculators, hijri: Hijri, dates: Dates, words: Words, abbreviations: Abbreviations,
  readability: ReadabilityTool, "self-overlap": SelfOverlap, "table-maker": TableMaker, equation: Equation, "prisma-drawer": PrismaDrawer, "quiz-me": QuizMe,
  "viva-bank": VivaBank, "ethics-helper": EthicsHelper, "email-templates": EmailTemplates, cv: CvTool, random: Random,
};

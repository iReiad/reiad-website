"use client";

/* ============================================================
   research/atlas.tsx: one graph of everything. RESEARCH.md 18.

   Four views, all derived from rows and never edited here. The
   graph is every source, note, question, document and person as a
   dot and every link, evidence row and citation as a line, laid
   out by shared/research-graph.ts in SVG; the citation network
   is two hops out from a chosen source through OpenAlex, hollow
   dots for what is not in the library yet; the literature
   timeline is the library on a year axis in the reader's own
   lanes; and people are rows with an ORCID that brings what they
   have published.
   ============================================================ */


import { useCallback, useEffect, useMemo, useState } from "react";
import { sourceType, toneVar } from "@reiad/shared/research";
import { PEOPLE_ROLES, PEOPLE_ROLE_NAMES, type PersonRole } from "@reiad/shared/research-plan";
import { layout, timeline, type GraphEdge, type GraphNode } from "@reiad/shared/research-graph";
import {
  addPerson, addSource, listDocuments, listNotes, listPeople, listQuestions, listSources, orcidWorksOf, relatedWorks, removePerson,
  savePerson, type Hit, type Person, type Source, type Who,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";
import { useKeys } from "./keys";
import { HitRow } from "./find";

type View = "graph" | "network" | "timeline" | "people";

const KIND_TONES: Record<string, string> = { source: "teal", note: "plum", question: "violet", document: "blue", person: "gold" };

export function Atlas() {
  const { w, answered } = useWho();
  const [view, setView] = useState<View>("graph");
  useKeys(useMemo(() => ({ "1": () => setView("graph"), "2": () => setView("network"), "3": () => setView("timeline"), "4": () => setView("people") }), []), Boolean(w));
  if (!w) return <SignedOut answered={answered} />;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {(["graph", "network", "timeline", "people"] as const).map((v, i) => (
          <ChipButton key={v} pressed={view === v} onClick={() => setView(v)}>{i + 1} {both(`rs.atlas.${v}`)}</ChipButton>
        ))}
      </div>
      {view === "graph" ? <Graph w={w} /> : null}
      {view === "network" ? <Network w={w} /> : null}
      {view === "timeline" ? <LitTimeline w={w} /> : null}
      {view === "people" ? <People w={w} /> : null}
    </div>
  );
}

/* ---------- the graph ---------- */

function Graph({ w }: { w: Who }) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [kinds, setKinds] = useState<Set<string>>(new Set(["source", "note", "question", "document", "person"]));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void (async () => {
      const [sources, notes, questions, docs, people] = await Promise.all([
        listSources(w, { limit: 500 }), listNotes(w, { limit: 500 }), listQuestions(w), listDocuments(w), listPeople(w),
      ]);
      const ns: GraphNode[] = [
        ...sources.map((s) => ({ id: s.id, kind: "source", label: s.title, href: `/tools/research/library/${s.id}`, tone: sourceType(s.type).tone })),
        ...notes.filter((n) => n.kind !== "capture").map((n) => ({ id: n.id, kind: "note", label: n.title || n.text.slice(0, 40), href: `/tools/research/notes/${n.id}` })),
        ...questions.map((q) => ({ id: q.id, kind: "question", label: q.text, href: "/tools/research/questions" })),
        ...docs.map((d) => ({ id: d.id, kind: "document", label: d.title, href: "/tools/research/write" })),
        ...people.map((p) => ({ id: p.id, kind: "person", label: p.name, href: "/tools/research/atlas" })),
      ];
      const es: GraphEdge[] = [];
      for (const n of notes) { if (n.source_id) es.push({ from: n.id, to: n.source_id, kind: "about" }); for (const l of n.links) es.push({ from: n.id, to: l, kind: "link" }); }
      for (const q of questions) { if (q.parent_id) es.push({ from: q.id, to: q.parent_id, kind: "under" }); for (const e of q.body.evidence ?? []) es.push({ from: q.id, to: e.source_id, kind: e.stance }); }
      for (const d of docs) for (const m of d.body.matchAll(/#cite=([^&"]+)/g)) { const s = sources.find((x) => x.key === decodeURIComponent(m[1])); if (s) es.push({ from: d.id, to: s.id, kind: "cites" }); }
      for (const p of people) for (const s of p.sources) es.push({ from: p.id, to: s, kind: "wrote" });
      setNodes(ns);
      setEdges(es);
      setReady(true);
    })();
  }, [w]);
  const shown = useMemo(() => nodes.filter((n) => kinds.has(n.kind)), [nodes, kinds]);
  const placed = useMemo(() => layout(shown, edges, 1000, 700), [shown, edges]);
  const at = useMemo(() => new Map(placed.map((p) => [p.id, p])), [placed]);
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2">
      <p className="text-t1 text-ink-soft"><W k="rs.atlas.graph.hint" /></p>
      <div className="flex flex-wrap gap-1 items-center">
        <span className="text-t1 text-ink-soft"><W k="rs.atlas.kinds" /></span>
        {Object.keys(KIND_TONES).map((k) => (
          <span key={k} style={{ "--accent": toneVar(KIND_TONES[k] as "teal") } as React.CSSProperties}>
            <ChipButton pressed={kinds.has(k)} onClick={() => setKinds((was) => { const next = new Set(was); if (next.has(k)) next.delete(k); else next.add(k); return next; })}>{k} {nodes.filter((n) => n.kind === k).length}</ChipButton>
          </span>
        ))}
      </div>
      {!ready ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p> : !placed.length ? <p className="text-t2 text-ink-soft"><W k="rs.atlas.empty" /></p> : (
        <svg viewBox="0 0 1000 700" className="w-full rs-graph" role="img" aria-label={both("rs.atlas.graph")}>
          {edges.filter((e) => at.has(e.from) && at.has(e.to)).map((e, i) => {
            const a = at.get(e.from)!; const b = at.get(e.to)!;
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" opacity={0.18} strokeWidth={1.2} />;
          })}
          {placed.map((p) => (
            <a key={p.id} href={p.href}>
              <circle cx={p.x} cy={p.y} r={p.kind === "source" ? 7 : 5} fill={toneVar((p.tone ?? KIND_TONES[p.kind]) as "teal")} opacity={0.92} />
              <text x={p.x + 9} y={p.y + 4} fontSize={10} fill="currentColor" opacity={0.85}>{p.label.slice(0, 32)}</text>
            </a>
          ))}
        </svg>
      )}
    </Surface>
  );
}

/* ---------- the citation network ---------- */

function Network({ w }: { w: Who }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [from, setFrom] = useState("");
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [hits, setHits] = useState<Map<string, Hit>>(new Map());
  const [busy, setBusy] = useState(false);
  useEffect(() => { void listSources(w, { limit: 500 }).then((s) => setSources(s.filter((x) => x.doi))); }, [w]);
  const draw = useCallback(async (id: string) => {
    const root = sources.find((s) => s.id === id);
    if (!root?.doi) return;
    setBusy(true);
    try {
      const rel = await relatedWorks(w, root.doi);
      if (!rel) return;
      const ns: GraphNode[] = [{ id: root.id, kind: "source", label: root.title, tone: "gold", href: `/tools/research/library/${root.id}` }];
      const es: GraphEdge[] = [];
      const seen = new Map<string, Hit>();
      const add = (h: Hit, kind: string): void => {
        const key = h.doi ?? h.hash;
        const have = sources.find((s) => s.doi && h.doi && s.doi.toLowerCase() === h.doi.toLowerCase());
        const nid = have ? have.id : `hit:${key}`;
        if (!ns.some((n) => n.id === nid)) { ns.push({ id: nid, kind: have ? "source" : "hit", label: h.title, tone: have ? "teal" : undefined, href: have ? `/tools/research/library/${have.id}` : undefined }); if (!have) seen.set(nid, h); }
        es.push(kind === "cites" ? { from: root.id, to: nid, kind } : { from: nid, to: root.id, kind });
      };
      rel.references.slice(0, 40).forEach((h) => add(h, "cites"));
      rel.citedBy.slice(0, 40).forEach((h) => add(h, "citedby"));
      rel.related.slice(0, 20).forEach((h) => add(h, "related"));
      setNodes(ns); setEdges(es); setHits(seen);
    } finally { setBusy(false); }
  }, [w, sources]);
  const placed = useMemo(() => layout(nodes, edges, 1000, 700), [nodes, edges]);
  const at = useMemo(() => new Map(placed.map((p) => [p.id, p])), [placed]);
  const take = async (nid: string): Promise<void> => {
    const h = hits.get(nid);
    if (!h) return;
    const s = await addSource(w, h.csl, { via: "search", verified: true, identifiers: h.openalex ? { openalex: h.openalex } : {} });
    if (s) { setSources((was) => [s, ...was]); setNodes((was) => was.map((n) => n.id === nid ? { ...n, id: s.id, kind: "source", tone: "teal", href: `/tools/research/library/${s.id}` } : n)); setEdges((was) => was.map((e) => ({ ...e, from: e.from === nid ? s.id : e.from, to: e.to === nid ? s.id : e.to }))); cue("saved"); }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2">
      <p className="text-t1 text-ink-soft"><W k="rs.atlas.network.hint" /></p>
      <div className="flex flex-wrap items-end gap-2">
        <div className="grow max-w-md">
          <Select id="rs-net-from" label={<W k="rs.atlas.network.pick" />} value={from} onChange={(e) => { setFrom(e.target.value); void draw(e.target.value); }}>
            <option value="">–</option>
            {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </Select>
        </div>
        {busy ? <span className="text-t1 text-ink-soft"><W k="rs.moment" /></span> : null}
      </div>
      {placed.length > 1 ? (
        <svg viewBox="0 0 1000 700" className="w-full rs-graph" role="img" aria-label={both("rs.atlas.network")}>
          {edges.map((e, i) => { const a = at.get(e.from); const b = at.get(e.to); return a && b ? <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" opacity={0.2} /> : null; })}
          {placed.map((p) => p.kind === "hit" ? (
            <g key={p.id} onClick={() => { void take(p.id); }} style={{ cursor: "pointer" }} role="button" aria-label={`${both("rs.findroom.add")}: ${p.label}`}>
              <circle cx={p.x} cy={p.y} r={6} fill="none" stroke={toneVar("teal")} strokeWidth={1.5} />
              <text x={p.x + 9} y={p.y + 4} fontSize={9} fill="currentColor" opacity={0.7}>{p.label.slice(0, 30)}</text>
            </g>
          ) : (
            <a key={p.id} href={p.href}>
              <circle cx={p.x} cy={p.y} r={p.id === from ? 10 : 7} fill={toneVar((p.tone ?? "teal") as "teal")} />
              <text x={p.x + 11} y={p.y + 4} fontSize={10} fill="currentColor" opacity={0.9}>{p.label.slice(0, 30)}</text>
            </a>
          ))}
        </svg>
      ) : null}
    </Surface>
  );
}

/* ---------- the literature timeline ---------- */

function LitTimeline({ w }: { w: Who }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [lanes, setLanes] = useState("");
  useEffect(() => { void listSources(w, { limit: 1000 }).then(setSources); }, [w]);
  const tl = useMemo(() => timeline(sources, lanes.split(",").map((l) => l.trim().toLowerCase()).filter(Boolean)), [sources, lanes]);
  const width = 1000; const laneH = 48; const height = 40 + tl.lanes.length * laneH;
  const x = (y: number): number => tl.years ? 40 + ((y - tl.years[0]) / Math.max(1, tl.years[1] - tl.years[0])) * (width - 80) : 0;
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2">
      <p className="text-t1 text-ink-soft"><W k="rs.atlas.timeline.hint" /></p>
      <div className="max-w-md"><Field id="rs-tl-lanes" label={<W k="rs.atlas.lanes" />} value={lanes} onChange={(e) => setLanes(e.target.value)} placeholder={both("rs.atlas.lanes.eg")} /></div>
      {!tl.dots.length ? <p className="text-t2 text-ink-soft"><W k="rs.atlas.empty" /></p> : (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full rs-graph" role="img" aria-label={both("rs.atlas.timeline")}>
          {tl.years ? Array.from({ length: tl.years[1] - tl.years[0] + 1 }, (_, i) => tl.years![0] + i).filter((y, i, arr) => arr.length <= 20 || i % Math.ceil(arr.length / 20) === 0).map((y) => (
            <g key={y}><line x1={x(y)} y1={24} x2={x(y)} y2={height} stroke="currentColor" opacity={0.1} /><text x={x(y)} y={16} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.7} fontFamily="ui-monospace, monospace">{y}</text></g>
          )) : null}
          {tl.lanes.map((lane, li) => (
            <g key={lane}>
              <text x={4} y={40 + li * laneH + 14} fontSize={10} fill="currentColor" opacity={0.7}>{lane}</text>
              {tl.dots.filter((d) => d.lane === lane).map((d, i) => (
                <a key={d.id} href={`/tools/research/library/${d.id}`}>
                  <circle cx={x(d.year)} cy={40 + li * laneH + 24 + ((i % 3) - 1) * 9} r={5} fill={toneVar(sourceType(d.type).tone)} opacity={0.85}>
                    <title>{d.title} ({d.year})</title>
                  </circle>
                </a>
              ))}
            </g>
          ))}
        </svg>
      )}
    </Surface>
  );
}

/* ---------- people ---------- */

function People({ w }: { w: Who }) {
  const lang = useToolLang();
  const [people, setPeople] = useState<Person[] | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState<PersonRole>("supervisor");
  const [orcid, setOrcid] = useState("");
  const [institution, setInstitution] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [works, setWorks] = useState<Record<string, Hit[] | null>>({});
  useEffect(() => { void listPeople(w).then(setPeople); void listSources(w, { limit: 500 }).then(setSources); }, [w]);
  const add = async (): Promise<void> => {
    if (!name.trim()) return;
    const p = await addPerson(w, { name: name.trim(), role, orcid: orcid.trim(), institution: institution.trim() });
    if (p) { setPeople((was) => [...(was ?? []), p]); setName(""); setOrcid(""); setInstitution(""); cue("saved"); }
  };
  const change = async (p: Person, part: Partial<Person>): Promise<void> => {
    const r = await savePerson(w, p, part);
    if (r.ok) setPeople((was) => (was ?? []).map((x) => x.id === p.id ? r.row : x));
  };
  const fetchWorks = async (p: Person): Promise<void> => {
    if (!p.orcid) return;
    setWorks((was) => ({ ...was, [p.id]: null }));
    const list = await orcidWorksOf(w, p.orcid);
    setWorks((was) => ({ ...was, [p.id]: list ?? [] }));
  };
  return (
    <div className="rs-panes">
      <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2 content-start" accent={toneVar("gold")}>
        <h2 className="text-t3 font-medium"><W k="rs.atlas.people" /></h2>
        <p className="text-t1 text-ink-soft"><W k="rs.atlas.people.hint" /></p>
        <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); void add(); }}>
          <Field id="rs-pp-name" label={<W k="rs.atlas.person.name" />} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          <Select id="rs-pp-role" label={<W k="rs.atlas.person.role" />} value={role} onChange={(e) => setRole(e.target.value as PersonRole)}>
            {PEOPLE_ROLES.map((r) => <option key={r} value={r}>{PEOPLE_ROLE_NAMES[r][lang]}</option>)}
          </Select>
          <Field id="rs-pp-orcid" label={<W k="rs.atlas.person.orcid" />} value={orcid} onChange={(e) => setOrcid(e.target.value)} placeholder="0000-0000-0000-0000" autoComplete="off" />
          <Field id="rs-pp-inst" label={<W k="rs.atlas.person.institution" />} value={institution} onChange={(e) => setInstitution(e.target.value)} autoComplete="off" />
          <div><Button type="submit" kind="solid" size="sm" disabled={!name.trim()}><W k="rs.atlas.person.new" /></Button></div>
        </form>
      </Surface>
      <section className="rs-main min-w-0 grid gap-2">
        {people === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p> : !people.length ? <p className="text-t2 text-ink-soft"><W k="rs.atlas.person.none" /></p> : (
          <ul className="rs-rows grid gap-1">
            {people.map((p) => (
              <li key={p.id} className="grid gap-2">
                <button type="button" className="rs-row" aria-current={open === p.id ? "true" : undefined} style={{ "--tone": toneVar("gold") } as React.CSSProperties} onClick={() => setOpen(open === p.id ? null : p.id)}>
                  <span className="rs-row-dot" aria-hidden="true" />
                  <span className="rs-row-main"><span className="rs-row-title">{p.name}</span><span className="rs-row-sub">{PEOPLE_ROLE_NAMES[p.role][lang]}{p.institution ? ` · ${p.institution}` : ""}{p.orcid ? ` · ${p.orcid}` : ""}</span></span>
                  <span className="rs-row-meta">{p.sources.length ? <Chip>{p.sources.length}</Chip> : null}</span>
                </button>
                {open === p.id ? (
                  <Surface material="sunk" className="px-4 py-3 grid gap-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <Field id={`rs-pp-email-${p.id}`} label={<W k="rs.atlas.person.email" />} defaultValue={p.email ?? ""} onBlur={(e) => { void change(p, { email: e.target.value || null }); }} />
                      <Field id={`rs-pp-fit-${p.id}`} label={<W k="rs.atlas.person.fit" />} defaultValue={p.body.fit ?? ""} onBlur={(e) => { void change(p, { body: { ...p.body, fit: e.target.value } }); }} />
                    </div>
                    <TextArea id={`rs-pp-note-${p.id}`} label={<W k="rs.atlas.person.note" />} rows={3} defaultValue={p.note} onBlur={(e) => { void change(p, { note: e.target.value }); }} />
                    <div className="flex flex-wrap gap-1">
                      {sources.slice(0, 60).map((s) => (
                        <ChipButton key={s.id} pressed={p.sources.includes(s.id)} onClick={() => { void change(p, { sources: p.sources.includes(s.id) ? p.sources.filter((x) => x !== s.id) : [...p.sources, s.id] }); }}>{s.key}</ChipButton>
                      ))}
                    </div>
                    {p.orcid ? (
                      <div className="grid gap-2">
                        <div><ChipButton onClick={() => { void fetchWorks(p); }}><W k="rs.atlas.person.works" /></ChipButton></div>
                        {works[p.id] === null ? <p className="text-t1 text-ink-soft"><W k="rs.moment" /></p> : works[p.id]?.length ? (
                          <ul className="grid gap-2">{works[p.id]!.slice(0, 20).map((h) => <HitRow key={h.doi ?? h.hash} h={h} have={sources.find((s) => s.doi && h.doi && s.doi.toLowerCase() === h.doi.toLowerCase()) ?? null} onAdd={() => { void addSource(w, h.csl, { via: "search", verified: true }).then((s) => { if (s) { setSources((was) => [s, ...was]); cue("saved"); } }); }} dbName={(d) => d} />)}</ul>
                        ) : works[p.id] ? <p className="text-t1 text-ink-soft"><W k="rs.none" /></p> : null}
                      </div>
                    ) : null}
                    <div><ChipButton onClick={() => { if (window.confirm(`${both("rs.delete")}: ${p.name}?`)) void removePerson(w, p).then((ok) => { if (ok) setPeople((was) => (was ?? []).filter((x) => x.id !== p.id)); }); }}><W k="rs.delete" /></ChipButton></div>
                  </Surface>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}



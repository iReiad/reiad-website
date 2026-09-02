"use client";

/* ============================================================
   research/find.tsx: one search box, every index, one list.

   RESEARCH.md section 10. The query goes to the Worker, which
   asks every index that is on and merges the answers; each row
   says which indexes had it, whether a free copy exists, how
   often it is cited, and whether it is already in the library,
   so the list is also "what have I got on this". A search worth
   keeping is a row, which is the search log a review's methods
   section prints; a row with the flag on is rerun by the Monday
   cron, and what it finds is collected into the inbox here.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SOURCE_TYPES, normaliseDoi, toneVar } from "@reiad/shared/research";
import {
  addNote, addSearch, addSource, collectAlerts, dropAlert, listSearches, listSources, pushAlert, removeSearch,
  saveSearch, searchIndexes, serviceStatus, type Hit, type Search, type SearchQuery, type Searched, type Source, type Who,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho, when } from "./use-who";
import { useKeys } from "./keys";

const DATABASES = ["openalex", "crossref", "semanticscholar", "arxiv", "europepmc", "core", "doaj"] as const;
const DB_NAMES: Record<string, string> = {
  openalex: "OpenAlex", crossref: "Crossref", semanticscholar: "Semantic Scholar", arxiv: "arXiv",
  europepmc: "Europe PMC", core: "CORE", doaj: "DOAJ",
};
const DB_TONES: Record<string, string> = {
  openalex: "teal", crossref: "blue", semanticscholar: "violet", arxiv: "rose", europepmc: "green", core: "gold", doaj: "plum",
};

/** A hit's place in the library, by DOI or by the title hash. */
function inLibrary(h: Hit, sources: Source[]): Source | null {
  const doi = h.doi ? normaliseDoi(h.doi) ?? h.doi.toLowerCase() : null;
  return sources.find((s) => (doi && s.doi && (normaliseDoi(s.doi) ?? s.doi.toLowerCase()) === doi) || s.hash === h.hash) ?? null;
}

export function Find() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const box = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [author, setAuthor] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [oa, setOa] = useState(false);
  const [type, setType] = useState("");
  const [dbs, setDbs] = useState<Set<string>>(new Set(DATABASES));
  const [services, setServices] = useState<Record<string, "on" | "off"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [found, setFound] = useState<Searched | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [searches, setSearches] = useState<Search[]>([]);
  const [alerted, setAlerted] = useState<number | null>(null);
  const [said, setSaid] = useState("");

  useEffect(() => {
    if (!w) return;
    void serviceStatus().then((s) => {
      setServices(s);
      if (s) setDbs(new Set(DATABASES.filter((d) => s[d] !== "off")));
    });
    void listSources(w, { limit: 2000 }).then(setSources);
    void listSearches(w).then(setSearches);
    /* What the cron found while nobody was here goes to the inbox
       as captures, one per work, and the room says how many. */
    void collectAlerts(w).then(async (hits) => {
      let n = 0;
      for (const h of hits) {
        const made = await addNote(w, {
          kind: "capture", title: h.title.slice(0, 200),
          text: `${h.title}${h.year ? ` (${h.year})` : ""}${h.doi ? ` doi:${h.doi}` : ""}${h.authors ? ` · ${h.authors}` : ""}`,
        });
        if (made) n += 1;
      }
      setAlerted(n);
    });
  }, [w]);

  const query = useMemo((): SearchQuery => ({
    q: q.trim(), author: author.trim() || undefined, from: Number(from) || undefined, to: Number(to) || undefined,
    oa: oa || undefined, type: type || undefined, databases: [...dbs],
  }), [q, author, from, to, oa, type, dbs]);

  const search = useCallback(async (override?: SearchQuery) => {
    if (!w) return;
    const use = override ?? query;
    if (!use.q) return;
    setBusy(true);
    setSaid("");
    try {
      const r = await searchIndexes(w, use);
      setFound(r);
      if (!r) setSaid(both("rs.findroom.failed"));
    } finally { setBusy(false); }
  }, [w, query]);

  const keep = useCallback(async () => {
    if (!w || !query.q) return;
    const s = await addSearch(w, query, found?.hits.length ?? null);
    if (s) { setSearches((was) => [s, ...was]); cue("saved"); }
  }, [w, query, found]);

  const add = useCallback(async (h: Hit) => {
    if (!w) return;
    const s = await addSource(w, h.csl, {
      via: "search", verified: true,
      oa: h.oa ? { isOa: h.oa.isOa, url: h.oa.url, at: new Date().toISOString() } : null,
      identifiers: h.openalex ? { openalex: h.openalex } : {},
    });
    if (s) { setSources((was) => [s, ...was]); cue("saved"); }
  }, [w]);

  const toggleAlert = useCallback(async (s: Search) => {
    if (!w) return;
    const next = !s.alert;
    const r = await saveSearch(w, s, { alert: next });
    if (!r.ok) return;
    setSearches((was) => was.map((x) => x.id === s.id ? r.row : x));
    if (next) await pushAlert(w, r.row); else await dropAlert(w, s.id);
    cue("saved");
  }, [w]);

  const rerun = useCallback((s: Search) => {
    setQ(s.query);
    setAuthor(s.fields.author ?? "");
    setFrom(s.fields.from ? String(s.fields.from) : "");
    setTo(s.fields.to ? String(s.fields.to) : "");
    setOa(Boolean(s.fields.oa));
    setType(s.fields.type ?? "");
    if (s.databases.length) setDbs(new Set(s.databases));
    void search({ q: s.query, ...s.fields, databases: s.databases });
  }, [search]);

  useKeys(useMemo(() => ({ f: () => box.current?.focus() }), []), Boolean(w));

  if (!w) return <SignedOut answered={answered} />;

  const dbName = (d: string): string => DB_NAMES[d] ?? d;

  return (
    <div className="grid gap-4">
      <Surface material="pane" className="px-5 py-4 grid gap-3" accent={toneVar("teal")}>
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); void search(); }}>
          <div className="flex flex-wrap items-end gap-3">
            <div className="grow min-w-[16rem]">
              <Field id="rs-fq" ref={box} label={<W k="rs.findroom.q" />} hint={<W k="rs.findroom.q.hint" />} value={q}
                     onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            </div>
            <Button type="submit" kind="solid" disabled={busy || !q.trim()}><W k="rs.findroom.go" /></Button>
            <Button type="button" kind="soft" disabled={!q.trim()} onClick={() => { void keep(); }}><W k="rs.findroom.save" /></Button>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_6rem_6rem_12rem_auto] items-end">
            <Field id="rs-fa" label={<W k="rs.findroom.author" />} value={author} onChange={(e) => setAuthor(e.target.value)} autoComplete="off" />
            <Field id="rs-ff" label={<W k="rs.findroom.from" />} inputMode="numeric" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Field id="rs-ft" label={<W k="rs.findroom.to" />} inputMode="numeric" value={to} onChange={(e) => setTo(e.target.value)} />
            <Select id="rs-fk" label={<W k="rs.lib.type" />} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">{both("rs.findroom.anytype")}</option>
              {["article", "book", "book-chapter", "dissertation", "report", "dataset", "preprint"].map((t) => {
                const named = SOURCE_TYPES.find((s) => s.id === (t === "article" ? "article-journal" : t === "book-chapter" ? "chapter" : t === "dissertation" ? "thesis" : t === "preprint" ? "article" : t));
                return <option key={t} value={t}>{named ? (lang === "bn" ? named.name.bn : named.name.en) : t}</option>;
              })}
            </Select>
            <label className="flex items-center gap-2 text-t2 pb-2">
              <input type="checkbox" checked={oa} onChange={(e) => setOa(e.target.checked)} />
              <span><W k="rs.findroom.oa" /></span>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-t1 text-ink-soft"><W k="rs.findroom.databases" /></span>
            {DATABASES.map((d) => (
              <span key={d} style={{ "--accent": toneVar(DB_TONES[d] as "teal") } as React.CSSProperties}>
                <ChipButton pressed={dbs.has(d)} disabled={services?.[d] === "off"}
                            title={services?.[d] === "off" ? both("rs.set.off") : undefined}
                            onClick={() => setDbs((was) => { const next = new Set(was); if (next.has(d)) next.delete(d); else next.add(d); return next; })}>
                  {dbName(d)}
                </ChipButton>
              </span>
            ))}
          </div>
        </form>
        {said ? <p className="text-t2 text-ink-soft" role="status">{said}</p> : null}
        {alerted ? <p className="text-t2" role="status"><W k="rs.findroom.alerted" /> <strong>{alerted}</strong> <Link href="/tools/research">{both("rs.board.inbox")}</Link></p> : null}
      </Surface>

      <div className="rs-panes">
        <section className="rs-list grid gap-3 content-start" aria-label={`${both("rs.findroom.saved")}`}>
          <Surface material="pane" className="px-4 py-3 grid gap-2">
            <h2 className="text-t2 font-medium"><W k="rs.findroom.saved" /></h2>
            <p className="text-t1 text-ink-soft"><W k="rs.findroom.saved.hint" /></p>
            {searches.length ? (
              <ul className="grid gap-2">
                {searches.map((s) => (
                  <li key={s.id} className="grid gap-1 text-t2">
                    <button type="button" className="text-left font-medium underline-offset-2 hover:underline" onClick={() => rerun(s)}>{s.query}</button>
                    <span className="text-t1 text-ink-soft mono">
                      {s.hits !== null ? `${s.hits} · ` : ""}{s.databases.length ? `${s.databases.map(dbName).join(", ")} · ` : ""}{when(s.last_run ?? s.created_at)}
                    </span>
                    <span className="flex flex-wrap gap-1">
                      <ChipButton pressed={s.alert} onClick={() => { void toggleAlert(s); }}>{both(s.alert ? "rs.findroom.alert.on" : "rs.findroom.alert.off")}</ChipButton>
                      <ChipButton onClick={() => { void removeSearch(w, s).then((ok) => { if (ok) setSearches((was) => was.filter((x) => x.id !== s.id)); }); }}><W k="rs.delete" /></ChipButton>
                    </span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-t1 text-ink-soft"><W k="rs.none" /></p>}
          </Surface>
        </section>

        <section className="rs-main min-w-0 grid gap-3" aria-live="polite">
          {busy ? <p className="text-t2 text-ink-soft" role="status"><W k="rs.findroom.searching" /></p> : null}
          {found ? (
            <>
              <div className="flex flex-wrap items-center gap-2 text-t1 text-ink-soft">
                <span className="mono">{found.hits.length} · {found.ms} ms</span>
                {Object.entries(found.asked).filter(([, v]) => v !== "not-asked").map(([d, v]) => (
                  <span key={d} style={{ "--accent": toneVar(DB_TONES[d] as "teal") } as React.CSSProperties}>
                    <Chip tone={v === "answered" ? "accent" : "warn"}>{dbName(d)}{v === "answered" ? "" : `: ${both(v === "no-key" ? "rs.set.off" : "rs.findroom.noanswer")}`}</Chip>
                  </span>
                ))}
              </div>
              {found.hits.length ? (
                <ul className="grid gap-2">
                  {found.hits.map((h) => <HitRow key={`${h.doi ?? h.hash}`} h={h} have={inLibrary(h, sources)} onAdd={() => { void add(h); }} dbName={dbName} />)}
                </ul>
              ) : <p className="text-t2 text-ink-soft"><W k="rs.findroom.none" /></p>}
            </>
          ) : !busy ? <p className="text-t2 text-ink-soft"><W k="rs.findroom.empty" /></p> : null}
        </section>
      </div>
    </div>
  );
}

export function HitRow({ h, have, onAdd, dbName }: { h: Hit; have: Source | null; onAdd: () => void; dbName: (d: string) => string }) {
  return (
    <li>
      <Surface material="glass" className="px-4 py-3 grid gap-1">
        <p className="text-t2 font-medium leading-snug">
          {have ? <Link href={`/tools/research/library/${have.id}`}>{h.title}</Link> : h.title}
        </p>
        <p className="text-t1 text-ink-soft">{h.authors}{h.year ? ` · ${h.year}` : ""}{h.venue ? ` · ${h.venue}` : ""}</p>
        {h.abstract ? <p className="text-t1 text-ink-soft line-clamp-2">{h.abstract}</p> : null}
        <div className="flex flex-wrap items-center gap-1">
          {h.from.map((d) => <span key={d} style={{ "--accent": toneVar(DB_TONES[d] as "teal") } as React.CSSProperties}><Chip tone="accent">{dbName(d)}</Chip></span>)}
          {h.oa?.isOa ? <Chip tone="quiet"><T en="free copy" bn="বিনামূল্যের কপি" /></Chip> : null}
          {h.cited !== null ? <span className="text-t1 text-ink-soft mono">{h.cited} <T en="cited" bn="উদ্ধৃত" /></span> : null}
          <span className="grow" />
          {have ? <Chip tone="accent">{both(`rs.lib.status.${have.status}`)}</Chip>
            : <ChipButton onClick={onAdd}><W k="rs.findroom.add" /></ChipButton>}
          {h.doi ? <ChipLink href={`https://doi.org/${h.doi}`} target="_blank" rel="noreferrer">doi</ChipLink>
            : h.url ? <ChipLink href={h.url} target="_blank" rel="noreferrer"><W k="rs.lib.url" /></ChipLink> : null}
        </div>
      </Surface>
    </li>
  );
}

/* ---------- related works, on a source page ---------- */

export function RelatedWorks({ w, source, sources }: { w: Who; source: Source; sources: Source[] }) {
  const [rel, setRel] = useState<import("../../lib/research-api").Related | null | undefined>(undefined);
  const [have, setHave] = useState<Source[]>(sources);
  const [tab, setTab] = useState<"references" | "citedBy" | "related">("citedBy");
  useEffect(() => { setHave(sources); }, [sources]);
  if (!source.doi) return null;
  const doi = source.doi;
  const load = (): void => {
    if (rel !== undefined) return;
    setRel(null);
    void import("../../lib/research-api").then((m) => m.relatedWorks(w, doi)).then((r) => setRel(r ?? null));
  };
  const add = async (h: Hit): Promise<void> => {
    const s = await addSource(w, h.csl, { via: "search", verified: true, identifiers: h.openalex ? { openalex: h.openalex } : {} });
    if (s) { setHave((was) => [s, ...was]); cue("saved"); }
  };
  const list = rel ? rel[tab] : [];
  return (
    <Surface material="sunk" className="px-4 py-3 grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-t2 font-medium"><W k="rs.findroom.related" /></h3>
        {rel === undefined ? <ChipButton onClick={load}><W k="rs.findroom.show" /></ChipButton> : null}
        {rel ? (["citedBy", "references", "related"] as const).map((t) => (
          <ChipButton key={t} pressed={tab === t} onClick={() => setTab(t)}>{both(`rs.findroom.${t.toLowerCase()}`)} {rel[t].length}</ChipButton>
        )) : null}
      </div>
      {rel === null ? <p className="text-t1 text-ink-soft" role="status"><W k="rs.moment" /></p> : null}
      {rel ? (list.length ? (
        <ul className="grid gap-2">
          {list.slice(0, 30).map((h) => <HitRow key={h.doi ?? h.hash} h={h} have={inLibrary(h, have)} onAdd={() => { void add(h); }} dbName={(d) => DB_NAMES[d] ?? d} />)}
        </ul>
      ) : <p className="text-t1 text-ink-soft"><W k="rs.none" /></p>) : null}
    </Surface>
  );
}

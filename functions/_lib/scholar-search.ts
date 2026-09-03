/* ============================================================
   _lib/scholar-search.ts: one search box, every index, one list.

   RESEARCH.md section 10. A query goes to every adapter that is
   on, in parallel, each with a budget of two and a half seconds;
   the answers are merged by DOI and by the title hash, ranked by
   how many indexes returned a work and then by how often it is
   cited and how new it is, and each row says which indexes had
   it. The browser never talks to an index: connect-src is 'self',
   and this is the one place that can hold a key, keep under a
   limit and cache honestly.

   ---- one shape out of nine ----

   Every adapter answers `Hit[]` in the same shape, a CSL record
   with the columns the library fills from it beside it, so the
   room draws one row for a work whether OpenAlex, Crossref,
   Semantic Scholar, arXiv, Europe PMC, CORE or DOAJ found it.
   An adapter that throws or times out is reported as `failed` in
   `asked`, never as an empty result, so the page can say "CORE
   did not answer" rather than "CORE had nothing".

   ---- alerts, for a reader who is asleep ----

   The Worker holds no service key and cannot read a reader's
   rows, so a flagged search is copied into D1 by the browser
   (`research_alerts`), the Monday cron reruns each against
   OpenAlex and Crossref, and what is new is written to D1
   (`research_alert_hits`) for the browser to collect into the
   inbox at the next visit. A search string is public data; the
   reader id beside it is the one thing that makes the row worth
   deleting when the alert is switched off, and the collect
   deletes what it collected.
   ============================================================ */

import type { CslItem } from "../../shared/research.ts";
import { hashOf, normaliseDoi, fieldsOf } from "../../shared/research.ts";
import {
  DAY, UA, WEEK, cached, canOpenAlex, cslFromCrossref, cslFromOpenAlex, openalexWork,
  type Answered, type CrossrefWork, type OpenAlexWork, type ScholarEnv,
} from "./scholar.ts";
import type { D1Database } from "./db.ts";

export interface Hit {
  csl: CslItem;
  doi: string | null;
  title: string;
  year: number | null;
  authors: string;
  venue: string;
  type: string;
  abstract: string;
  url: string | null;
  oa: { isOa: boolean; url?: string } | null;
  cited: number | null;
  /** Which indexes returned it. */
  from: string[];
  /** OpenAlex's id where it had one, for the related lists. */
  openalex: string | null;
  hash: string;
}

export interface SearchQuery {
  q: string;
  author?: string;
  from?: number;
  to?: number;
  oa?: boolean;
  type?: string;
  databases?: string[];
}

export const DATABASES = ["openalex", "crossref", "semanticscholar", "arxiv", "europepmc", "core", "doaj"] as const;
export type Database = typeof DATABASES[number];

const BUDGET_MS = 2500;

async function getWithin(url: string, headers: Record<string, string> = {}, ms = BUDGET_MS): Promise<unknown> {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json", ...headers }, signal: AbortSignal.timeout(ms) });
  if (!res.ok) throw new Error(`http-${res.status}`);
  return res.json();
}

async function getTextWithin(url: string, ms = BUDGET_MS): Promise<string> {
  const res = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(ms) });
  if (!res.ok) throw new Error(`http-${res.status}`);
  return res.text();
}

/** One row out of a CSL record and what the index said beside it. */
function hit(csl: CslItem, from: string, extra: Partial<Hit> = {}): Hit {
  const f = fieldsOf(csl);
  return {
    csl, doi: f.doi ?? null, title: f.title, year: f.year ?? null, authors: f.authors,
    venue: String(csl["container-title"] ?? ""), type: f.type, abstract: String(csl.abstract ?? ""),
    url: f.url ?? null, oa: null, cited: null, from: [from], openalex: null, hash: f.hash, ...extra,
  };
}

const yearIn = (q: SearchQuery, y: number | null): boolean =>
  y === null ? !q.from && !q.to : (!q.from || y >= q.from) && (!q.to || y <= q.to);

/* ---------- the adapters ---------- */

const abstractOf = (idx?: Record<string, number[]>): string => {
  if (!idx) return "";
  const words: string[] = [];
  for (const [word, at] of Object.entries(idx)) for (const i of at) words[i] = word;
  return words.filter(Boolean).join(" ").slice(0, 1500);
};

export function openalexHit(w: OpenAlexWork): Hit {
  const csl = cslFromOpenAlex(w);
  if (!csl.abstract && w.abstract_inverted_index) csl.abstract = abstractOf(w.abstract_inverted_index);
  return hit(csl, "openalex", {
    oa: w.open_access ? { isOa: Boolean(w.open_access.is_oa), url: w.open_access.oa_url ?? undefined } : null,
    cited: w.cited_by_count ?? null,
    openalex: w.id ? w.id.replace("https://openalex.org/", "") : null,
  });
}

async function openalex(env: ScholarEnv, q: SearchQuery): Promise<Hit[]> {
  if (!canOpenAlex(env)) throw new Error("no-key");
  const filters: string[] = [];
  if (q.from || q.to) filters.push(`publication_year:${q.from ?? 1000}-${q.to ?? 2100}`);
  if (q.oa) filters.push("is_oa:true");
  if (q.type) filters.push(`type:${q.type}`);
  if (q.author) filters.push(`raw_author_name.search:${q.author}`);
  const url = "https://api.openalex.org/works?search=" + encodeURIComponent(q.q)
    + (filters.length ? "&filter=" + encodeURIComponent(filters.join(",")) : "")
    + "&per-page=25&select=id,doi,title,publication_year,type,authorships,primary_location,biblio,open_access,cited_by_count,abstract_inverted_index"
    + `&api_key=${encodeURIComponent(env.OPENALEX_KEY as string)}`;
  const data = await getWithin(url) as { results?: OpenAlexWork[] };
  return (data.results ?? []).map(openalexHit);
}

async function crossref(env: ScholarEnv, q: SearchQuery): Promise<Hit[]> {
  const filters: string[] = [];
  if (q.from) filters.push(`from-pub-date:${q.from}`);
  if (q.to) filters.push(`until-pub-date:${q.to}`);
  if (q.type) filters.push(`type:${q.type === "article" ? "journal-article" : q.type}`);
  const url = "https://api.crossref.org/works?query=" + encodeURIComponent(q.q)
    + (q.author ? "&query.author=" + encodeURIComponent(q.author) : "")
    + (filters.length ? "&filter=" + encodeURIComponent(filters.join(",")) : "")
    + "&rows=25&select=DOI,type,title,author,issued,container-title,volume,issue,page,URL,abstract,is-referenced-by-count"
    + (env.CROSSREF_MAILTO ? `&mailto=${encodeURIComponent(env.CROSSREF_MAILTO)}` : "");
  const data = await getWithin(url) as { message?: { items?: CrossrefWork[] } };
  return (data.message?.items ?? []).map((w) => hit(cslFromCrossref(w), "crossref", { cited: w["is-referenced-by-count"] ?? null }));
}

interface S2Paper {
  paperId?: string; title?: string; year?: number; venue?: string; abstract?: string; citationCount?: number;
  externalIds?: { DOI?: string; ArXiv?: string }; authors?: { name?: string }[];
  openAccessPdf?: { url?: string } | null; publicationTypes?: string[] | null; url?: string;
}

async function semanticscholar(env: ScholarEnv, q: SearchQuery): Promise<Hit[]> {
  const url = "https://api.semanticscholar.org/graph/v1/paper/search?query=" + encodeURIComponent(q.q)
    + "&limit=25&fields=title,year,venue,abstract,citationCount,externalIds,authors,openAccessPdf,publicationTypes,url"
    + (q.from || q.to ? `&year=${q.from ?? ""}-${q.to ?? ""}` : "")
    + (q.oa ? "&openAccessPdf" : "");
  const data = await getWithin(url, env.S2_KEY ? { "x-api-key": env.S2_KEY } : {}) as { data?: S2Paper[] };
  return (data.data ?? []).filter((p) => !q.author || (p.authors ?? []).some((a) => (a.name ?? "").toLowerCase().includes(q.author!.toLowerCase())))
    .map((p) => {
      const csl: CslItem = {
        type: (p.publicationTypes ?? []).includes("Book") ? "book" : "article-journal",
        title: p.title, "container-title": p.venue || undefined, abstract: p.abstract || undefined,
        DOI: p.externalIds?.DOI || undefined, URL: p.url || undefined,
        issued: p.year ? { "date-parts": [[p.year]] } : undefined,
        author: (p.authors ?? []).map((a) => a.name ?? "").filter(Boolean).map((n) => {
          const parts = n.split(" ");
          return parts.length > 1 ? { family: parts.pop() as string, given: parts.join(" ") } : { literal: n };
        }),
      };
      return hit(csl, "semanticscholar", {
        cited: p.citationCount ?? null,
        oa: p.openAccessPdf?.url ? { isOa: true, url: p.openAccessPdf.url } : null,
      });
    });
}

const unxml = (s: string): string => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/\s+/g, " ").trim();

async function arxiv(_env: ScholarEnv, q: SearchQuery): Promise<Hit[]> {
  const terms = [`all:${q.q}`];
  if (q.author) terms.push(`au:${q.author}`);
  const url = "https://export.arxiv.org/api/query?search_query=" + encodeURIComponent(terms.join(" AND ")) + "&max_results=25&sortBy=relevance";
  const xml = await getTextWithin(url);
  const out: Hit[] = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const title = unxml(/<title>([\s\S]*?)<\/title>/.exec(e)?.[1] ?? "");
    const id = /<id>([\s\S]*?)<\/id>/.exec(e)?.[1]?.trim() ?? "";
    const year = Number(/<published>(\d{4})/.exec(e)?.[1]) || null;
    if (!yearIn(q, year)) continue;
    const doi = /<arxiv:doi[^>]*>([\s\S]*?)<\/arxiv:doi>/.exec(e)?.[1]?.trim();
    const authors = [...e.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((a) => unxml(a[1]));
    const csl: CslItem = {
      type: "article", title, URL: id || undefined, DOI: doi || undefined,
      abstract: unxml(/<summary>([\s\S]*?)<\/summary>/.exec(e)?.[1] ?? "").slice(0, 1500) || undefined,
      "container-title": "arXiv", issued: year ? { "date-parts": [[year]] } : undefined,
      author: authors.map((n) => { const p = n.split(" "); return p.length > 1 ? { family: p.pop() as string, given: p.join(" ") } : { literal: n }; }),
    };
    out.push(hit(csl, "arxiv", { oa: { isOa: true, url: id.replace("/abs/", "/pdf/") } }));
  }
  return out;
}

interface PmcResult { doi?: string; title?: string; authorString?: string; journalTitle?: string; pubYear?: string; isOpenAccess?: string; citedByCount?: number; pmid?: string; abstractText?: string }

async function europepmc(_env: ScholarEnv, q: SearchQuery): Promise<Hit[]> {
  let query = q.q;
  if (q.author) query += ` AND AUTH:"${q.author}"`;
  if (q.from || q.to) query += ` AND PUB_YEAR:[${q.from ?? 1900} TO ${q.to ?? 2100}]`;
  if (q.oa) query += " AND OPEN_ACCESS:y";
  const url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=" + encodeURIComponent(query) + "&format=json&pageSize=25&resultType=lite";
  const data = await getWithin(url) as { resultList?: { result?: PmcResult[] } };
  return (data.resultList?.result ?? []).map((r) => {
    const year = Number(r.pubYear) || null;
    const csl: CslItem = {
      type: "article-journal", title: r.title, "container-title": r.journalTitle || undefined, DOI: r.doi || undefined,
      issued: year ? { "date-parts": [[year]] } : undefined,
      author: (r.authorString ?? "").split(",").map((n) => n.trim()).filter(Boolean).map((n) => {
        const p = n.split(" "); return p.length > 1 ? { family: p[0], given: p.slice(1).join(" ") } : { literal: n };
      }),
    };
    return hit(csl, "europepmc", { cited: r.citedByCount ?? null, oa: r.isOpenAccess === "Y" ? { isOa: true } : null });
  });
}

interface CoreWork { doi?: string; title?: string; yearPublished?: number; authors?: { name?: string }[]; publisher?: string; downloadUrl?: string; abstract?: string; citationCount?: number }

async function core(env: ScholarEnv, q: SearchQuery): Promise<Hit[]> {
  if (!env.CORE_KEY) throw new Error("no-key");
  let query = q.q;
  if (q.author) query += ` AND authors:"${q.author}"`;
  if (q.from || q.to) query += ` AND yearPublished>=${q.from ?? 1900} AND yearPublished<=${q.to ?? 2100}`;
  const url = "https://api.core.ac.uk/v3/search/works?q=" + encodeURIComponent(query) + "&limit=25";
  const data = await getWithin(url, { authorization: `Bearer ${env.CORE_KEY}` }) as { results?: CoreWork[] };
  return (data.results ?? []).map((w) => {
    const csl: CslItem = {
      type: "article", title: w.title, DOI: w.doi || undefined, publisher: w.publisher || undefined,
      abstract: (w.abstract ?? "").slice(0, 1500) || undefined,
      issued: w.yearPublished ? { "date-parts": [[w.yearPublished]] } : undefined,
      author: (w.authors ?? []).map((a) => a.name ?? "").filter(Boolean).map((n) => {
        const p = n.split(", "); return p.length > 1 ? { family: p[0], given: p[1] } : { literal: n };
      }),
    };
    return hit(csl, "core", { cited: w.citationCount ?? null, oa: w.downloadUrl ? { isOa: true, url: w.downloadUrl } : null });
  });
}

interface DoajArticle { bibjson?: { title?: string; year?: string; author?: { name?: string }[]; journal?: { title?: string }; identifier?: { type?: string; id?: string }[]; abstract?: string; link?: { url?: string }[] } }

async function doaj(_env: ScholarEnv, q: SearchQuery): Promise<Hit[]> {
  const url = "https://doaj.org/api/search/articles/" + encodeURIComponent(q.q) + "?pageSize=25";
  const data = await getWithin(url) as { results?: DoajArticle[] };
  return (data.results ?? []).map((r) => r.bibjson ?? {}).filter((b) => yearIn(q, Number(b.year) || null))
    .filter((b) => !q.author || (b.author ?? []).some((a) => (a.name ?? "").toLowerCase().includes(q.author!.toLowerCase())))
    .map((b) => {
      const year = Number(b.year) || null;
      const doi = (b.identifier ?? []).find((i) => i.type?.toLowerCase() === "doi")?.id;
      const csl: CslItem = {
        type: "article-journal", title: b.title, "container-title": b.journal?.title || undefined, DOI: doi || undefined,
        abstract: (b.abstract ?? "").slice(0, 1500) || undefined, URL: b.link?.[0]?.url || undefined,
        issued: year ? { "date-parts": [[year]] } : undefined,
        author: (b.author ?? []).map((a) => a.name ?? "").filter(Boolean).map((n) => {
          const p = n.split(" "); return p.length > 1 ? { family: p.pop() as string, given: p.join(" ") } : { literal: n };
        }),
      };
      return hit(csl, "doaj", { oa: { isOa: true, url: b.link?.[0]?.url } });
    });
}

const ADAPTERS: Record<Database, (env: ScholarEnv, q: SearchQuery) => Promise<Hit[]>> = {
  openalex, crossref, semanticscholar, arxiv, europepmc, core, doaj,
};

/* ---------- merge and rank ---------- */

/** Two answers for one work become one row that says both had
    it, keeping the fuller record: the one with an abstract, then
    the one with a DOI. */
export function merge(lists: Hit[][]): Hit[] {
  const byKey = new Map<string, Hit>();
  for (const list of lists) {
    for (const h of list) {
      const key = h.doi ? `doi:${normaliseDoi(h.doi) ?? h.doi.toLowerCase()}` : `hash:${h.hash}`;
      const had = byKey.get(key);
      if (!had) { byKey.set(key, { ...h, from: [...h.from] }); continue; }
      const fuller = (had.abstract ? 1 : 0) + (had.doi ? 1 : 0) >= (h.abstract ? 1 : 0) + (h.doi ? 1 : 0) ? had : h;
      byKey.set(key, {
        ...fuller,
        from: [...new Set([...had.from, ...h.from])],
        cited: Math.max(had.cited ?? -1, h.cited ?? -1) < 0 ? null : Math.max(had.cited ?? 0, h.cited ?? 0),
        oa: had.oa?.isOa ? had.oa : h.oa?.isOa ? h.oa : had.oa ?? h.oa,
        openalex: had.openalex ?? h.openalex,
      });
    }
  }
  return [...byKey.values()].sort((a, b) =>
    b.from.length - a.from.length
    || Math.log10((b.cited ?? 0) + 1) - Math.log10((a.cited ?? 0) + 1)
    || (b.year ?? 0) - (a.year ?? 0));
}

export interface Searched { hits: Hit[]; asked: Record<string, Answered>; ms: number }

const keyOf = (db: string, q: SearchQuery): string =>
  `search:${db}:${hashOf(JSON.stringify([q.q.trim().toLowerCase(), q.author ?? "", q.from ?? 0, q.to ?? 0, q.oa ?? false, q.type ?? ""]), 0)}`;

/** Every index that is on, in parallel, within the budget. */
export async function searchAll(env: ScholarEnv, q: SearchQuery): Promise<Searched> {
  const started = Date.now();
  const wanted = (q.databases?.length ? q.databases : [...DATABASES]).filter((d): d is Database => (DATABASES as readonly string[]).includes(d));
  const asked: Record<string, Answered> = {};
  for (const d of DATABASES) asked[d] = "not-asked";
  const answers = await Promise.all(wanted.map(async (db) => {
    try {
      const hits = await cached<Hit[]>(env, keyOf(db, q), DAY, () => ADAPTERS[db](env, q));
      asked[db] = "answered";
      return hits ?? [];
    } catch (err) {
      asked[db] = String((err as Error).message) === "no-key" ? "no-key" : "failed";
      return [];
    }
  }));
  return { hits: merge(answers).slice(0, 60), asked, ms: Date.now() - started };
}

/* ---------- a free copy ---------- */

export async function unpaywall(env: ScholarEnv, doi: string): Promise<{ isOa: boolean; url?: string } | null> {
  if (!env.UNPAYWALL_EMAIL) return null;
  return cached(env, `unpaywall:${doi}`, 30 * DAY, async () => {
    const data = await getWithin(`https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=${encodeURIComponent(env.UNPAYWALL_EMAIL as string)}`) as {
      is_oa?: boolean; best_oa_location?: { url_for_pdf?: string | null; url?: string | null } | null;
    };
    return { isOa: Boolean(data.is_oa), url: data.best_oa_location?.url_for_pdf ?? data.best_oa_location?.url ?? undefined };
  });
}

/* ---------- related works, OpenAlex's three lists ---------- */

export interface Related { references: Hit[]; citedBy: Hit[]; related: Hit[] }

async function worksByIds(env: ScholarEnv, ids: string[]): Promise<Hit[]> {
  if (!ids.length) return [];
  const short = ids.slice(0, 50).map((i) => i.replace("https://openalex.org/", ""));
  const url = "https://api.openalex.org/works?filter=" + encodeURIComponent(`ids.openalex:${short.join("|")}`)
    + "&per-page=50&select=id,doi,title,publication_year,type,authorships,primary_location,biblio,open_access,cited_by_count"
    + `&api_key=${encodeURIComponent(env.OPENALEX_KEY as string)}`;
  const data = await getWithin(url, {}, 6000) as { results?: OpenAlexWork[] };
  return (data.results ?? []).map(openalexHit);
}

export async function related(env: ScholarEnv, doi: string): Promise<Related | null> {
  if (!canOpenAlex(env)) return null;
  return cached(env, `related:${doi}`, WEEK, async () => {
    const work = await openalexWork(env, doi);
    if (!work?.id) return null;
    const [references, relatedWorks, citedBy] = await Promise.all([
      worksByIds(env, work.referenced_works ?? []),
      worksByIds(env, work.related_works ?? []),
      (async () => {
        const url = "https://api.openalex.org/works?filter=" + encodeURIComponent(`cites:${(work.id as string).replace("https://openalex.org/", "")}`)
          + "&per-page=50&sort=cited_by_count:desc&select=id,doi,title,publication_year,type,authorships,primary_location,biblio,open_access,cited_by_count"
          + `&api_key=${encodeURIComponent(env.OPENALEX_KEY as string)}`;
        const data = await getWithin(url, {}, 6000) as { results?: OpenAlexWork[] };
        return (data.results ?? []).map(openalexHit);
      })(),
    ]);
    return { references, citedBy, related: relatedWorks };
  });
}

/* ---------- an author, by ORCID ---------- */

interface OrcidWorks { group?: { "work-summary"?: { title?: { title?: { value?: string } }; "publication-date"?: { year?: { value?: string } }; "external-ids"?: { "external-id"?: { "external-id-type"?: string; "external-id-value"?: string }[] }; type?: string; "journal-title"?: { value?: string } }[] }[] }

/** What the public ORCID record lists for an author, newest first,
    as hits the library can take. A week in the cache. */
export async function orcidWorks(env: ScholarEnv, orcid: string): Promise<Hit[] | null> {
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(orcid)) return null;
  return cached(env, `orcid:${orcid}`, WEEK, async () => {
    const data = await getWithin(`https://pub.orcid.org/v3.0/${orcid}/works`, { accept: "application/json" }, 6000) as OrcidWorks;
    const out: Hit[] = [];
    for (const g of data.group ?? []) {
      const s = g["work-summary"]?.[0];
      if (!s?.title?.title?.value) continue;
      const year = Number(s["publication-date"]?.year?.value) || null;
      const doi = (s["external-ids"]?.["external-id"] ?? []).find((i) => i["external-id-type"] === "doi")?.["external-id-value"];
      const csl: CslItem = {
        type: s.type === "book" ? "book" : s.type === "book-chapter" ? "chapter" : "article-journal",
        title: s.title.title.value, DOI: doi || undefined, "container-title": s["journal-title"]?.value || undefined,
        issued: year ? { "date-parts": [[year]] } : undefined,
      };
      out.push(hit(csl, "orcid"));
    }
    return out.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  });
}

/* ---------- the Monday cron ---------- */

export interface AlertRow { reader_id: string; id: string; query: string; fields: string; databases: string; seen: string; last_run: string | null; created_at: string }

/** Every flagged search, rerun against OpenAlex and Crossref, and
    what is new since the last run written for the reader to
    collect. Two indexes rather than seven because an alert is a
    weekly question and those two answer it. */
export async function runAlerts(env: ScholarEnv, d1: D1Database): Promise<{ alerts: number; found: number }> {
  const { results } = await d1.prepare("SELECT * FROM research_alerts").all<AlertRow>();
  let found = 0;
  const year = new Date().getFullYear();
  for (const row of results ?? []) {
    let seen: string[] = [];
    let fields: Partial<SearchQuery> = {};
    try { seen = JSON.parse(row.seen || "[]"); } catch { seen = []; }
    try { fields = JSON.parse(row.fields || "{}"); } catch { fields = {}; }
    const q: SearchQuery = { ...fields, q: row.query, databases: ["openalex", "crossref"], from: Math.max(fields.from ?? 0, year - 1) };
    let hits: Hit[] = [];
    try { hits = (await searchAll(env, q)).hits; } catch { continue; }
    const fresh = hits.filter((h) => {
      const key = h.doi ? `doi:${normaliseDoi(h.doi) ?? h.doi}` : `hash:${h.hash}`;
      if (seen.includes(key)) return false;
      seen.push(key);
      return true;
    }).slice(0, 20);
    for (const h of fresh) {
      await d1.prepare("INSERT INTO research_alert_hits (reader_id, alert_id, json, found_at) VALUES (?, ?, ?, ?)")
        .bind(row.reader_id, row.id, JSON.stringify(h), new Date().toISOString()).run();
      found += 1;
    }
    await d1.prepare("UPDATE research_alerts SET seen = ?, last_run = ? WHERE reader_id = ? AND id = ?")
      .bind(JSON.stringify(seen.slice(-500)), new Date().toISOString(), row.reader_id, row.id).run();
  }
  return { alerts: results?.length ?? 0, found };
}

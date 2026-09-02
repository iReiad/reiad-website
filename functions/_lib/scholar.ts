/* ============================================================
   _lib/scholar.ts: the world's indexes, read as one shape.

   `RESEARCH.md` sections 10 and 22. The browser never talks to
   an index: `connect-src` is 'self', `scripts/check-csp.ts`
   scans every string under `next/` for a hostname, and one
   caller is the only place that can hold a key, meter requests
   and cache honestly. Everything here answers CSL-JSON, which is
   the record the library stores, so an adapter's whole job is to
   turn one service's shape into that one.

   ---- every service is optional ----

   Each adapter reports a status word and degrades to "not
   connected" rather than throwing: a lookup by DOI works with
   Crossref alone, OpenAlex adds citation counts where its key
   is set, and a page says which answered. Nothing about a
   reader passes through here.

   ---- the cache is public data ----

   `scholar_cache` in D1 holds a DOI's record for a week and a
   search for a day, keyed by the request and nothing else,
   because a DOI's record is the same for everybody and a rate
   limit is a shared resource.
   ============================================================ */

import type { DbEnv } from "./db.ts";
import type { CslItem, CslName } from "../../shared/research.ts";
import { normaliseDoi, normaliseIsbn } from "../../shared/research.ts";

export interface ScholarEnv extends DbEnv {
  /** Required by OpenAlex for every request since February 2026. */
  OPENALEX_KEY?: string;
  /** The email Crossref's polite pool asks for. Not a secret. */
  CROSSREF_MAILTO?: string;
}

export type Answered = "answered" | "no-key" | "failed" | "not-asked";

const UA = "reiad.co.uk research studio (https://reiad.co.uk)";

/* ============================================================
   the cache
   ============================================================ */

async function cached<T>(
  env: ScholarEnv, key: string, seconds: number, fetcher: () => Promise<T | null>,
): Promise<T | null> {
  const d1 = env.DB;
  if (d1) {
    try {
      const row = await d1.prepare("SELECT json, fetched_at FROM scholar_cache WHERE key = ?")
        .bind(key).first<{ json: string; fetched_at: string }>();
      if (row && Date.now() - new Date(row.fetched_at).getTime() < seconds * 1000) {
        return JSON.parse(row.json) as T;
      }
    } catch { /* a cache miss */ }
  }
  const fresh = await fetcher();
  if (fresh !== null && d1) {
    try {
      await d1.prepare(
        "INSERT INTO scholar_cache (key, json, fetched_at) VALUES (?, ?, ?)"
        + " ON CONFLICT(key) DO UPDATE SET json = excluded.json, fetched_at = excluded.fetched_at",
      ).bind(key, JSON.stringify(fresh), new Date().toISOString()).run();
    } catch { /* the cache is a nicety */ }
  }
  return fresh;
}

const DAY = 24 * 60 * 60;
const WEEK = 7 * DAY;

async function getJSON(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": UA, ...headers },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

/* ============================================================
   Crossref
   ============================================================ */

const CROSSREF_TYPES: Record<string, string> = {
  "journal-article": "article-journal",
  "book-chapter": "chapter",
  "book-section": "chapter",
  "book-part": "chapter",
  book: "book",
  monograph: "book",
  "edited-book": "book",
  "reference-book": "book",
  "proceedings-article": "paper-conference",
  proceedings: "book",
  dissertation: "thesis",
  report: "report",
  "report-component": "report",
  "posted-content": "article",
  dataset: "dataset",
  standard: "standard",
  "journal-issue": "article-journal",
  "reference-entry": "entry-encyclopedia",
  other: "document",
};

interface CrossrefWork {
  DOI?: string; type?: string; title?: string[]; subtitle?: string[];
  author?: { given?: string; family?: string; name?: string }[];
  editor?: { given?: string; family?: string; name?: string }[];
  issued?: { "date-parts"?: number[][] };
  "published-print"?: { "date-parts"?: number[][] };
  "published-online"?: { "date-parts"?: number[][] };
  "container-title"?: string[]; publisher?: string; "publisher-location"?: string;
  volume?: string; issue?: string; page?: string; ISSN?: string[]; ISBN?: string[];
  URL?: string; abstract?: string; language?: string;
  "update-to"?: { type?: string; DOI?: string; updated?: { "date-time"?: string } }[];
  link?: { URL?: string; "content-type"?: string }[];
  "is-referenced-by-count"?: number;
}

const names = (list?: { given?: string; family?: string; name?: string }[]): CslName[] | undefined => {
  const out = (list ?? []).map((n) => n.name ? { literal: n.name } : { family: n.family, given: n.given })
    .filter((n) => n.literal || n.family);
  return out.length ? out : undefined;
};

/** JATS in an abstract, stripped to its sentences. */
const plain = (s: string | undefined): string | undefined =>
  s ? s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : undefined;

export function cslFromCrossref(w: CrossrefWork): CslItem {
  const item: CslItem = { type: CROSSREF_TYPES[w.type ?? ""] ?? "document" };
  const title = [w.title?.[0], w.subtitle?.[0]].filter(Boolean).join(": ");
  if (title) item.title = plain(title);
  const au = names(w.author);
  if (au) item.author = au;
  const ed = names(w.editor);
  if (ed) item.editor = ed;
  const issued = w.issued?.["date-parts"] ?? w["published-print"]?.["date-parts"]
    ?? w["published-online"]?.["date-parts"];
  if (issued?.[0]?.[0]) item.issued = { "date-parts": [issued[0].filter((n) => n)] };
  if (w["container-title"]?.[0]) item["container-title"] = w["container-title"][0];
  if (w.publisher) item.publisher = w.publisher;
  if (w["publisher-location"]) item["publisher-place"] = w["publisher-location"];
  if (w.volume) item.volume = w.volume;
  if (w.issue) item.issue = w.issue;
  if (w.page) item.page = w.page.replace(/-/g, "–");
  if (w.DOI) item.DOI = w.DOI.toLowerCase();
  if (w.ISSN?.[0]) item.ISSN = w.ISSN[0];
  if (w.ISBN?.[0]) item.ISBN = w.ISBN[0];
  if (w.URL) item.URL = w.URL;
  if (w.abstract) item.abstract = plain(w.abstract);
  if (w.language) item.language = w.language;
  return item;
}

export interface Lookup {
  csl: CslItem;
  /** Which index answered with the record. */
  via: "crossref" | "openalex" | "openlibrary" | "clip";
  /** What Crossref says about a retraction, if anything. */
  retracted?: { type: string; doi?: string; at?: string } | null;
  /** OpenAlex's numbers, when its key is set. */
  openalex?: { id: string; cited: number; oa: boolean; oaUrl?: string } | null;
  /** A PDF the page named, from a clip. */
  pdf?: string;
  /** Which services were asked and what each did. */
  sources: Record<string, Answered>;
}

export async function crossrefWork(env: ScholarEnv, doi: string): Promise<CrossrefWork | null> {
  return cached(env, `crossref:${doi}`, WEEK, async () => {
    const mailto = env.CROSSREF_MAILTO ? `?mailto=${encodeURIComponent(env.CROSSREF_MAILTO)}` : "";
    const data = await getJSON(`https://api.crossref.org/works/${encodeURIComponent(doi)}${mailto}`) as
      { message?: CrossrefWork };
    return data.message ?? null;
  });
}

/* ============================================================
   OpenAlex
   ============================================================ */

interface OpenAlexWork {
  id?: string; cited_by_count?: number;
  open_access?: { is_oa?: boolean; oa_url?: string | null };
  title?: string; publication_year?: number; type?: string; doi?: string;
  authorships?: { author?: { display_name?: string } }[];
  primary_location?: { source?: { display_name?: string } };
  biblio?: { volume?: string; issue?: string; first_page?: string; last_page?: string };
}

export const canOpenAlex = (env: ScholarEnv): boolean => Boolean(env.OPENALEX_KEY);

export async function openalexWork(env: ScholarEnv, doi: string): Promise<OpenAlexWork | null> {
  if (!canOpenAlex(env)) return null;
  return cached(env, `openalex:${doi}`, WEEK, async () => {
    const url = `https://api.openalex.org/works/doi:${encodeURIComponent(doi)}`
      + `?api_key=${encodeURIComponent(env.OPENALEX_KEY as string)}`;
    return await getJSON(url) as OpenAlexWork;
  });
}

const summariseOpenAlex = (w: OpenAlexWork | null): Lookup["openalex"] =>
  w ? {
    id: (w.id ?? "").replace("https://openalex.org/", ""),
    cited: w.cited_by_count ?? 0,
    oa: Boolean(w.open_access?.is_oa),
    oaUrl: w.open_access?.oa_url ?? undefined,
  } : null;

/* ============================================================
   by DOI
   ============================================================ */

export async function byDoi(env: ScholarEnv, raw: string): Promise<Lookup | null> {
  const doi = normaliseDoi(raw);
  if (!doi) return null;
  const sources: Record<string, Answered> = { crossref: "not-asked", openalex: "not-asked" };
  let work: CrossrefWork | null = null;
  try {
    work = await crossrefWork(env, doi);
    sources.crossref = work ? "answered" : "failed";
  } catch { sources.crossref = "failed"; }
  let oa: OpenAlexWork | null = null;
  if (canOpenAlex(env)) {
    try { oa = await openalexWork(env, doi); sources.openalex = oa ? "answered" : "failed"; }
    catch { sources.openalex = "failed"; }
  } else sources.openalex = "no-key";
  if (!work) {
    if (!oa) return null;
    /* Crossref down and OpenAlex up: a thinner record, still a
       record. */
    return {
      csl: cslFromOpenAlex(oa), via: "openalex", openalex: summariseOpenAlex(oa),
      retracted: null, sources,
    };
  }
  const update = (work["update-to"] ?? []).find((u) => /retract/i.test(u.type ?? ""));
  return {
    csl: cslFromCrossref(work),
    via: "crossref",
    retracted: update ? { type: update.type ?? "retraction", doi: update.DOI, at: update.updated?.["date-time"] } : null,
    openalex: summariseOpenAlex(oa),
    sources,
  };
}

function cslFromOpenAlex(w: OpenAlexWork): CslItem {
  const TYPES: Record<string, string> = {
    article: "article-journal", book: "book", "book-chapter": "chapter",
    dissertation: "thesis", report: "report", dataset: "dataset", preprint: "article",
  };
  const item: CslItem = { type: TYPES[w.type ?? ""] ?? "document" };
  if (w.title) item.title = w.title;
  const au = (w.authorships ?? []).map((a) => a.author?.display_name).filter(Boolean) as string[];
  if (au.length) {
    item.author = au.map((n) => {
      const parts = n.split(/\s+/);
      return parts.length > 1 ? { family: parts[parts.length - 1], given: parts.slice(0, -1).join(" ") } : { literal: n };
    });
  }
  if (w.publication_year) item.issued = { "date-parts": [[w.publication_year]] };
  if (w.primary_location?.source?.display_name) item["container-title"] = w.primary_location.source.display_name;
  if (w.biblio?.volume) item.volume = w.biblio.volume;
  if (w.biblio?.issue) item.issue = w.biblio.issue;
  if (w.biblio?.first_page) {
    item.page = w.biblio.last_page && w.biblio.last_page !== w.biblio.first_page
      ? `${w.biblio.first_page}–${w.biblio.last_page}` : w.biblio.first_page;
  }
  const doi = normaliseDoi(w.doi);
  if (doi) item.DOI = doi;
  return item;
}

/* ============================================================
   Open Library, by ISBN
   ============================================================ */

interface OpenLibraryBook {
  title?: string; subtitle?: string; authors?: { name?: string }[];
  publish_date?: string; publishers?: { name?: string }[]; number_of_pages?: number;
  identifiers?: { isbn_13?: string[]; isbn_10?: string[] }; url?: string;
  publish_places?: { name?: string }[];
}

export async function byIsbn(env: ScholarEnv, raw: string): Promise<Lookup | null> {
  const isbn = normaliseIsbn(raw);
  if (!isbn) return null;
  const sources: Record<string, Answered> = { openlibrary: "not-asked" };
  let book: OpenLibraryBook | null = null;
  try {
    book = await cached(env, `openlibrary:${isbn}`, WEEK, async () => {
      const data = await getJSON(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
      ) as Record<string, OpenLibraryBook>;
      return data[`ISBN:${isbn}`] ?? null;
    });
    sources.openlibrary = book ? "answered" : "failed";
  } catch { sources.openlibrary = "failed"; }
  if (!book) return null;
  const item: CslItem = { type: "book", ISBN: isbn };
  item.title = [book.title, book.subtitle].filter(Boolean).join(": ");
  const au = (book.authors ?? []).map((a) => a.name).filter(Boolean) as string[];
  if (au.length) {
    item.author = au.map((n) => {
      const parts = n.split(/\s+/);
      return parts.length > 1 ? { family: parts[parts.length - 1], given: parts.slice(0, -1).join(" ") } : { literal: n };
    });
  }
  const year = /\b(1[5-9]\d\d|20\d\d)\b/.exec(book.publish_date ?? "")?.[1];
  if (year) item.issued = { "date-parts": [[Number(year)]] };
  if (book.publishers?.[0]?.name) item.publisher = book.publishers[0].name;
  if (book.publish_places?.[0]?.name) item["publisher-place"] = book.publish_places[0].name;
  if (book.number_of_pages) item["number-of-pages"] = String(book.number_of_pages);
  if (book.url) item.URL = book.url;
  return { csl: item, via: "openlibrary", retracted: null, openalex: null, sources };
}

/* ============================================================
   the clipper: a page's own tags
   ============================================================ */

/** The `citation_*` meta tags every publisher, SSRN, RePEc and
    arXiv page carries, which are what Google Scholar itself
    reads. Plus the Open Graph fallback for a page that has none. */
function metaTags(html: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const m of html.matchAll(/<meta\s+[^>]*>/gi)) {
    const tag = m[0];
    const name = /(?:name|property)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase();
    const content = /content\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1];
    if (!name || content === undefined) continue;
    const decoded = content.replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    if (!out.has(name)) out.set(name, []);
    out.get(name)?.push(decoded);
  }
  return out;
}

const HOST_OK = (u: URL): boolean => /^https?:$/.test(u.protocol) && !/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname);

export async function clip(env: ScholarEnv, raw: string): Promise<Lookup | null> {
  let url: URL;
  try { url = new URL(raw); } catch { return null; }
  if (!HOST_OK(url)) return null;
  const sources: Record<string, Answered> = { page: "not-asked", crossref: "not-asked" };
  let html = "";
  try {
    const res = await fetch(url.toString(), {
      headers: { "user-agent": UA, accept: "text/html" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`${res.status}`);
    html = (await res.text()).slice(0, 2_000_000);
    sources.page = "answered";
  } catch { sources.page = "failed"; return null; }
  const meta = metaTags(html);
  const one = (...keys: string[]): string | undefined => {
    for (const k of keys) { const v = meta.get(k)?.[0]; if (v) return v; }
    return undefined;
  };
  /* A DOI on the page wins: Crossref's record is the verified
     one, and the page's own tags fill in what Crossref lacks. */
  const doi = normaliseDoi(one("citation_doi", "dc.identifier", "dc.identifier.doi") ?? "")
    ?? normaliseDoi(html.match(/doi\.org\/(10\.\d{4,9}\/[^\s"'<>]+)/)?.[1] ?? "");
  const pdf = one("citation_pdf_url");
  if (doi) {
    const found = await byDoi(env, doi);
    if (found) {
      found.sources = { ...sources, ...found.sources };
      if (pdf) found.pdf = pdf;
      if (!found.csl.URL) found.csl.URL = url.toString();
      return found;
    }
  }
  const title = one("citation_title", "dc.title", "og:title") ?? /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
  if (!title) return null;
  const item: CslItem = { type: one("citation_journal_title") ? "article-journal" : one("citation_isbn") ? "book" : "webpage", title, URL: url.toString() };
  const authors = meta.get("citation_author") ?? meta.get("dc.creator") ?? [];
  if (authors.length) {
    item.author = authors.map((n) => {
      if (n.includes(",")) { const [family, given] = n.split(",").map((s) => s.trim()); return { family, given }; }
      const parts = n.split(/\s+/);
      return parts.length > 1 ? { family: parts[parts.length - 1], given: parts.slice(0, -1).join(" ") } : { literal: n };
    });
  }
  const date = one("citation_publication_date", "citation_date", "citation_online_date", "dc.date", "article:published_time");
  const year = /\b(1[5-9]\d\d|20\d\d)\b/.exec(date ?? "")?.[1];
  if (year) item.issued = { "date-parts": [[Number(year)]] };
  const container = one("citation_journal_title", "citation_conference_title", "og:site_name");
  if (container) item["container-title"] = container;
  if (one("citation_volume")) item.volume = one("citation_volume");
  if (one("citation_issue")) item.issue = one("citation_issue");
  const first = one("citation_firstpage");
  const last = one("citation_lastpage");
  if (first) item.page = last && last !== first ? `${first}–${last}` : first;
  if (one("citation_publisher", "dc.publisher")) item.publisher = one("citation_publisher", "dc.publisher");
  if (one("citation_technical_report_institution")) { item.type = "report"; item.publisher = one("citation_technical_report_institution"); }
  if (one("citation_dissertation_institution")) { item.type = "thesis"; item.publisher = one("citation_dissertation_institution"); }
  const isbn = normaliseIsbn(one("citation_isbn"));
  if (isbn) item.ISBN = isbn;
  const abstract = one("citation_abstract", "dc.description", "description", "og:description");
  if (abstract) item.abstract = abstract;
  item.accessed = { "date-parts": [[new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, new Date().getUTCDate()]] };
  return { csl: item, via: "clip", retracted: null, openalex: null, pdf, sources };
}

/* ============================================================
   Zotero, with the reader's own key, never stored
   ============================================================ */

export interface ZoteroItem {
  key: string;
  csl: CslItem;
  collections: string[];
  tags: string[];
  dateAdded?: string;
  itemType: string;
}

export interface ZoteroPage {
  items: ZoteroItem[];
  total: number;
  next: number | null;
  collections: { key: string; name: string; parent: string | null }[];
}

export async function zoteroPull(
  userId: string, key: string, start = 0,
): Promise<ZoteroPage> {
  const base = `https://api.zotero.org/users/${encodeURIComponent(userId)}`;
  const headers = { "Zotero-API-Key": key, "Zotero-API-Version": "3", "user-agent": UA };
  const res = await fetch(
    `${base}/items?include=data,csljson&limit=100&start=${start}&itemType=-attachment%20||%20note%20||%20annotation`,
    { headers, signal: AbortSignal.timeout(15000) },
  );
  if (!res.ok) throw new Error(`zotero ${res.status}`);
  const total = Number(res.headers.get("Total-Results") ?? 0);
  const raw = await res.json() as {
    key: string; csljson?: CslItem;
    data?: { itemType?: string; collections?: string[]; tags?: { tag: string }[]; dateAdded?: string };
  }[];
  const items: ZoteroItem[] = raw.filter((r) => r.csljson).map((r) => ({
    key: r.key,
    csl: { ...(r.csljson as CslItem), id: r.key },
    collections: r.data?.collections ?? [],
    tags: (r.data?.tags ?? []).map((t) => t.tag),
    dateAdded: r.data?.dateAdded,
    itemType: r.data?.itemType ?? "",
  }));
  let collections: ZoteroPage["collections"] = [];
  if (start === 0) {
    const cres = await fetch(`${base}/collections?limit=100`, { headers, signal: AbortSignal.timeout(15000) });
    if (cres.ok) {
      const list = await cres.json() as { key: string; data?: { name?: string; parentCollection?: string | false } }[];
      collections = list.map((c) => ({
        key: c.key, name: c.data?.name ?? c.key,
        parent: c.data?.parentCollection ? String(c.data.parentCollection) : null,
      }));
    }
  }
  const next = start + 100 < total ? start + 100 : null;
  return { items, total, next, collections };
}

/* ============================================================
   status
   ============================================================ */

export function status(env: ScholarEnv): Record<string, "on" | "off"> {
  return {
    crossref: "on",
    openalex: canOpenAlex(env) ? "on" : "off",
    openlibrary: "on",
    clipper: "on",
    zotero: "on",
    cache: env.DB ? "on" : "off",
  };
}

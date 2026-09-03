/* ============================================================
   functions/_lib/workshop.ts: the workshop's three lookups that
   need another server. RESEARCH.md section 19.

   A messy reference to Crossref's bibliographic search with the
   match's score; journals by name or concept from OpenAlex with
   their open access status; and a journal by ISSN in DOAJ, which
   is membership and a publisher, never a blacklist. Each cached
   like the scholar cache and each answered by the Worker because
   connect-src is 'self'.
   ============================================================ */

import { cached, cslFromCrossref, DAY, getJSON, UA, WEEK, type ScholarEnv } from "./scholar.ts";
import type { CslItem } from "../../shared/research.ts";

export interface Parsed { csl: CslItem; score: number; doi: string | null }

export async function parseReference(env: ScholarEnv, text: string): Promise<Parsed[]> {
  const q = text.trim().slice(0, 500);
  if (!q) return [];
  const out = await cached<Parsed[]>(env, `ref:${q.toLowerCase()}`, WEEK, async () => {
    const data = await getJSON(`https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(q)}&rows=5&mailto=research@reiad.co.uk`, { "user-agent": UA }) as { message?: { items?: Record<string, unknown>[] } };
    const items = data.message?.items ?? [];
    return items.map((w) => ({ csl: cslFromCrossref(w as never), score: Number(w.score ?? 0), doi: typeof w.DOI === "string" ? w.DOI : null }));
  });
  return out ?? [];
}

export interface Journal { id: string; name: string; issn: string | null; publisher: string | null; oa: boolean; apc: number | null; works: number; cited: number; homepage: string | null; doaj: boolean }

export async function findJournals(env: ScholarEnv, q: string): Promise<Journal[]> {
  const term = q.trim().slice(0, 200);
  if (!term) return [];
  const out = await cached<Journal[]>(env, `journals:${term.toLowerCase()}`, WEEK, async () => {
    const data = await getJSON(`https://api.openalex.org/sources?search=${encodeURIComponent(term)}&filter=type:journal&per-page=15&mailto=research@reiad.co.uk`) as { results?: Record<string, unknown>[] };
    return (data.results ?? []).map((s) => ({
      id: String(s.id ?? ""), name: String(s.display_name ?? ""), issn: typeof s.issn_l === "string" ? s.issn_l : null,
      publisher: typeof s.host_organization_name === "string" ? s.host_organization_name : null, oa: Boolean(s.is_oa),
      apc: typeof (s.apc_usd) === "number" ? (s.apc_usd as number) : null, works: Number(s.works_count ?? 0), cited: Number(s.cited_by_count ?? 0),
      homepage: typeof s.homepage_url === "string" ? s.homepage_url : null, doaj: Boolean(s.is_in_doaj),
    }));
  });
  return out ?? [];
}

export interface JournalCheck { issn: string; inDoaj: boolean; title: string | null; publisher: string | null; country: string | null; apc: boolean | null; licence: string[]; since: string | null }

/** DOAJ's own record for an ISSN: listed or not, and what it
    says. Not listed is not a verdict, and the tool says so. */
export async function checkJournal(env: ScholarEnv, issn: string): Promise<JournalCheck | null> {
  const id = issn.trim().toUpperCase().replace(/[^0-9X]/g, "");
  if (id.length !== 8) return null;
  const dashed = `${id.slice(0, 4)}-${id.slice(4)}`;
  return cached<JournalCheck>(env, `doaj:${dashed}`, DAY, async () => {
    const data = await getJSON(`https://doaj.org/api/search/journals/issn:${dashed}?pageSize=1`) as { results?: { bibjson?: Record<string, unknown>; created_date?: string }[] };
    const b = data.results?.[0]?.bibjson;
    if (!b) return { issn: dashed, inDoaj: false, title: null, publisher: null, country: null, apc: null, licence: [], since: null };
    const publisher = b.publisher as { name?: string; country?: string } | undefined;
    const apc = b.apc as { has_apc?: boolean } | undefined;
    const licence = Array.isArray(b.license) ? (b.license as { type?: string }[]).map((l) => l.type ?? "").filter(Boolean) : [];
    return { issn: dashed, inDoaj: true, title: typeof b.title === "string" ? b.title : null, publisher: publisher?.name ?? null, country: publisher?.country ?? null, apc: apc?.has_apc ?? null, licence, since: data.results?.[0]?.created_date?.slice(0, 10) ?? null };
  });
}

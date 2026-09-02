/* ============================================================
   research-api.ts: the Research Studio's rows, read and written
   as the reader.

   `RESEARCH.md` section 23. Every table is private to one person
   under the row-level security everything else here uses, and
   there is NO LOCAL COPY: nothing in the studio works signed out,
   so a second record would be a second thing to keep in step for
   nobody's benefit. The diet tool and the routine made the same
   call.

   ---- the browser is the caller, not a Worker ----

   Every request here goes straight to PostgREST with the
   READER'S OWN bearer, exactly as `diet-api.ts` does. This
   project holds no service-role key and this tool is not a
   reason to start one. What does go through a Worker is a
   LOOKUP against somebody else's index, `/api/research/*`,
   which never sees a reader's rows.

   ---- every write is a line in the activity log ----

   `RESEARCH.md` section 36: `research_activity` holds one line
   per write, and it is written HERE, by the one function every
   write passes through, so nothing can forget to log itself.
   The line is fire-and-forget: a log that could fail a save
   would be a log nobody wants.

   ---- and a patch carries what it last saw ----

   `patch()` sends `updated_at=eq.<seen>` beside the id. Zero
   rows changed means somebody else, usually the same person on
   a phone, wrote first, and the caller shows that rather than
   silently winning. Section 12.
   ============================================================ */

import type { CslItem } from "@reiad/shared/research";
import { citeKey, fieldsOf, normaliseDoi, type HighlightMeaning, type SourceFile } from "@reiad/shared/research";
import type {
  NoteKind, ProjectKind, ProjectState, QuestionKind, QuestionState, SourceStatus,
  SourceVia, TaskLane, Tone,
} from "@reiad/shared/research";
import { runtimeModule } from "../components/account/runtime";

type AccountModule = typeof import("/account.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");

let rest: string | null = null;
let anon: string | null = null;

/** A signed-in reader, and the bearer every call below sends as
    them. PASSED IN rather than read here, so a page asks once. */
export interface Who { id: string; token: string }

export async function who(): Promise<Who | null> {
  try {
    const m = await accountModule();
    rest ??= `${m.SUPABASE_URL}/rest/v1`;
    anon ??= m.SUPABASE_KEY;
    const id = m.current()?.id;
    if (!id) return null;
    const t = await m.token();
    return t ? { id, token: t } : null;
  } catch { return null; }
}

export interface Answer<T> { ok: boolean; data?: T; status: number }

async function call<T>(path: string, init: RequestInit, w: Who): Promise<Answer<T>> {
  try {
    if (!rest || !anon) {
      const m = await accountModule();
      rest = `${m.SUPABASE_URL}/rest/v1`;
      anon = m.SUPABASE_KEY;
    }
    const res = await fetch(`${rest}/${path}`, {
      ...init,
      headers: {
        apikey: anon,
        authorization: `Bearer ${w.token}`,
        "content-type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    if (!res.ok) return { ok: false, status: res.status };
    const text = await res.text();
    return { ok: true, status: res.status, data: text ? JSON.parse(text) as T : undefined };
  } catch {
    return { ok: false, status: 0 };
  }
}

/* ============================================================
   the rows
   ============================================================ */

interface Row { id: string; created_at: string; updated_at: string }

export interface Project extends Row {
  name: string;
  kind: ProjectKind;
  state: ProjectState;
  tone: Tone;
  body: { aims?: string; brief?: string; rules?: Record<string, unknown>; [k: string]: unknown };
}

export interface Collection extends Row {
  parent_id: string | null;
  name: string;
  position: number;
  zotero_key: string | null;
}

export interface Source extends Row {
  type: string;
  title: string;
  year: number | null;
  authors: string;
  doi: string | null;
  isbn: string | null;
  url: string | null;
  identifiers: Record<string, string>;
  key: string;
  csl: CslItem;
  status: SourceStatus;
  priority: number;
  rating: number | null;
  why: string | null;
  tags: string[];
  projects: string[];
  collections: string[];
  abstract: string | null;
  files: { key: string; kind: string; size: number; pages?: number; page?: number }[];
  oa: { isOa?: boolean; url?: string; at?: string } | null;
  retracted: { type: string; doi?: string; at?: string } | null;
  verified: boolean;
  hash: string;
  added_via: SourceVia;
  deleted_at: string | null;
}

export interface Note extends Row {
  kind: NoteKind;
  title: string;
  body: string;
  text: string;
  source_id: string | null;
  projects: string[];
  collections: string[];
  tags: string[];
  links: string[];
  day: string | null;
  meta: Record<string, unknown>;
  filed_at: string | null;
  deleted_at: string | null;
}

export interface Evidence {
  source_id: string;
  stance: "supports" | "contradicts" | "method" | "context";
  page?: string;
  quote?: string;
  note?: string;
}

export interface Question extends Row {
  project_id: string | null;
  parent_id: string | null;
  kind: QuestionKind;
  text: string;
  state: QuestionState;
  tags: string[];
  position: number;
  body: {
    note?: string;
    evidence?: Evidence[];
    measure?: string;
    carried?: {
      sources?: { url: string; said: string }[];
      steps?: { text: string; done?: boolean }[];
      links?: Record<string, unknown>;
    };
    [k: string]: unknown;
  };
}

export interface Task extends Row {
  project_id: string | null;
  title: string;
  lane: TaskLane;
  position: number;
  due: string | null;
  done_at: string | null;
  waiting_since: string | null;
  links: { kind: string; id: string; title: string }[];
  note: string | null;
}

export interface ListItem {
  source_id?: string;
  title: string;
  note?: string;
  state: "to-find" | "saved" | "not-found";
}

export interface ReadingList extends Row {
  project_id: string | null;
  name: string;
  items: ListItem[];
}

export interface Activity extends Row {
  kind: string;
  item_id: string | null;
  action: "added" | "changed" | "removed" | "restored" | "imported";
  summary: string;
}

export interface Version {
  id: string;
  kind: "note" | "document" | "sheet";
  item_id: string;
  body: string;
  label: string | null;
  created_at: string;
}

export interface Prefs {
  name?: string;
  affiliation?: string;
  orcid?: string;
  style?: string;
  dense?: boolean;
  assistant?: boolean;
  [k: string]: unknown;
}

/* ============================================================
   the generic four
   ============================================================ */

const enc = encodeURIComponent;

/** A read. `user_id=eq.<me>` is written even though the policy
    already makes any other row unreachable: two locks on the
    door, for the reason `account.ts` gives beside `getProfile`. */
export async function rows<T>(w: Who, table: string, query = ""): Promise<T[]> {
  const r = await call<T[]>(`${table}?user_id=eq.${w.id}${query ? `&${query}` : ""}`, { method: "GET" }, w);
  return r.ok && r.data ? r.data : [];
}

export async function row<T>(w: Who, table: string, id: string): Promise<T | null> {
  const r = await call<T[]>(`${table}?user_id=eq.${w.id}&id=eq.${enc(id)}&limit=1`, { method: "GET" }, w);
  return r.ok && r.data?.length ? r.data[0] : null;
}

/** An insert, answered with the row as Postgres made it. */
export async function insert<T extends Row>(
  w: Who, table: string, body: Record<string, unknown>, summary: string,
): Promise<T | null> {
  const r = await call<T[]>(table, {
    method: "POST",
    headers: { prefer: "return=representation" },
    body: JSON.stringify([{ ...body, user_id: w.id }]),
  }, w);
  const made = r.ok && r.data?.length ? r.data[0] : null;
  if (made) void log(w, table, made.id, "added", summary);
  return made;
}

export type PatchAnswer<T> = { ok: true; row: T } | { ok: false; conflict: boolean; status: number };

/** A change to the named fields only. `seen` is the `updated_at`
    the caller last had: with it, a write that finds a newer row
    changes nothing and answers `conflict`. */
export async function patch<T extends Row>(
  w: Who, table: string, id: string, body: Record<string, unknown>,
  summary: string, seen?: string,
): Promise<PatchAnswer<T>> {
  const guard = seen ? `&updated_at=eq.${enc(seen)}` : "";
  const r = await call<T[]>(`${table}?user_id=eq.${w.id}&id=eq.${enc(id)}${guard}`, {
    method: "PATCH",
    headers: { prefer: "return=representation" },
    body: JSON.stringify(body),
  }, w);
  if (!r.ok) return { ok: false, conflict: false, status: r.status };
  if (!r.data?.length) return { ok: false, conflict: Boolean(seen), status: r.status };
  void log(w, table, id, "changed", summary);
  return { ok: true, row: r.data[0] };
}

/** A hard delete, for a table with no bin. */
export async function remove(w: Who, table: string, id: string, summary: string): Promise<boolean> {
  const r = await call(`${table}?user_id=eq.${w.id}&id=eq.${enc(id)}`, { method: "DELETE" }, w);
  if (r.ok) void log(w, table, id, "removed", summary);
  return r.ok;
}

/** The thirty-day bin, for a table with `deleted_at`. */
export async function bin<T extends Row>(w: Who, table: string, id: string, summary: string): Promise<boolean> {
  const r = await patch<T>(w, table, id, { deleted_at: new Date().toISOString() }, summary);
  return r.ok;
}

export async function unbin<T extends Row>(w: Who, table: string, id: string, summary: string): Promise<boolean> {
  const r = await patch<T>(w, table, id, { deleted_at: null }, summary);
  if (r.ok) void log(w, table, id, "restored", summary);
  return r.ok;
}

/** One line per write. The `kind` is the table without its
    prefix, which is what the archive room draws. */
async function log(
  w: Who, table: string, itemId: string | null, action: Activity["action"], summary: string,
): Promise<void> {
  await call("research_activity", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify([{
      user_id: w.id, kind: table.replace(/^research_/, ""), item_id: itemId, action,
      summary: summary.slice(0, 200),
    }]),
  }, w);
}

export const logImport = (w: Who, summary: string): Promise<void> =>
  log(w, "research_sources", null, "imported", summary);

/* ============================================================
   projects and preferences
   ============================================================ */

export const listProjects = (w: Who): Promise<Project[]> =>
  rows<Project>(w, "research_projects", "order=updated_at.desc");

export const addProject = (w: Who, name: string, kind: ProjectKind, tone: Tone): Promise<Project | null> =>
  insert<Project>(w, "research_projects", { name, kind, tone, body: {} }, name);

export async function getPrefs(w: Who): Promise<Prefs> {
  const r = await call<{ research_prefs: Prefs }[]>(
    `profiles?id=eq.${w.id}&select=research_prefs&limit=1`, { method: "GET" }, w);
  return r.ok && r.data?.[0]?.research_prefs ? r.data[0].research_prefs : {};
}

/** SPREADS, for the reason `savePrefs` in `prefs.ts` gives: a
    field named by hand is a field the next one silently loses. */
export async function savePrefs(w: Who, patchPrefs: Prefs): Promise<Prefs> {
  const current = await getPrefs(w);
  const next = { ...current, ...patchPrefs };
  await call(`profiles?id=eq.${w.id}`, {
    method: "PATCH",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({ research_prefs: next }),
  }, w);
  return next;
}

/* ============================================================
   collections
   ============================================================ */

export const listCollections = (w: Who): Promise<Collection[]> =>
  rows<Collection>(w, "research_collections", "order=position.asc,name.asc");

export const addCollection = (
  w: Who, name: string, parent: string | null = null, zoteroKey: string | null = null,
): Promise<Collection | null> =>
  insert<Collection>(w, "research_collections",
    { name, parent_id: parent, zotero_key: zoteroKey }, name);

/* ============================================================
   sources
   ============================================================ */

export interface SourceFilter {
  q?: string;
  type?: string;
  status?: string;
  project?: string;
  collection?: string;
  tag?: string;
  binned?: boolean;
  limit?: number;
}

const SOURCE_COLUMNS = "id,type,title,year,authors,doi,isbn,url,identifiers,key,status,priority,"
  + "rating,why,tags,projects,collections,abstract,files,oa,retracted,verified,hash,added_via,"
  + "deleted_at,created_at,updated_at,csl";

export async function listSources(w: Who, f: SourceFilter = {}): Promise<Source[]> {
  const q: string[] = [`select=${SOURCE_COLUMNS}`, "order=updated_at.desc", `limit=${f.limit ?? 500}`];
  q.push(f.binned ? "deleted_at=not.is.null" : "deleted_at=is.null");
  if (f.type) q.push(`type=eq.${enc(f.type)}`);
  if (f.status) q.push(`status=eq.${enc(f.status)}`);
  if (f.project) q.push(`projects=cs.{${enc(f.project)}}`);
  if (f.collection) q.push(`collections=cs.{${enc(f.collection)}}`);
  if (f.tag) q.push(`tags=cs.{${enc(JSON.stringify(f.tag))}}`);
  if (f.q) q.push(`fts=wfts(simple).${enc(f.q)}`);
  return rows<Source>(w, "research_sources", q.join("&"));
}

export const getSource = (w: Who, id: string): Promise<Source | null> =>
  row<Source>(w, "research_sources", id);

/** The same paper, already here: by DOI first, by ISBN, then by
    the title hash. A DOI match is a duplicate outright; a hash
    match is offered as one. */
export async function findDuplicate(
  w: Who, csl: CslItem,
): Promise<{ source: Source; sure: boolean } | null> {
  const f = fieldsOf(csl);
  if (f.doi) {
    const hits = await rows<Source>(w, "research_sources",
      `select=${SOURCE_COLUMNS}&doi=eq.${enc(f.doi)}&deleted_at=is.null&limit=1`);
    if (hits[0]) return { source: hits[0], sure: true };
  }
  if (f.isbn) {
    const hits = await rows<Source>(w, "research_sources",
      `select=${SOURCE_COLUMNS}&isbn=eq.${enc(f.isbn)}&deleted_at=is.null&limit=1`);
    if (hits[0]) return { source: hits[0], sure: true };
  }
  const hits = await rows<Source>(w, "research_sources",
    `select=${SOURCE_COLUMNS}&hash=eq.${enc(f.hash)}&deleted_at=is.null&limit=1`);
  if (hits[0]) return { source: hits[0], sure: false };
  return null;
}

/** The keys already taken, for `citeKey()`. */
async function takenKeys(w: Who, prefix: string): Promise<Set<string>> {
  const hits = await rows<{ key: string }>(w, "research_sources",
    `select=key&key=like.${enc(`${prefix}*`)}`);
  return new Set(hits.map((h) => h.key));
}

export interface AddSourceOptions {
  via: SourceVia;
  verified?: boolean;
  projects?: string[];
  collections?: string[];
  tags?: string[];
  identifiers?: Record<string, string>;
  why?: string;
  oa?: Source["oa"];
  retracted?: Source["retracted"];
}

/** One record in, one row out, with every column filled from the
    record and the key made once. Refuses nothing: the caller
    asked `findDuplicate` first if it cared. */
export async function addSource(w: Who, csl: CslItem, o: AddSourceOptions): Promise<Source | null> {
  const f = fieldsOf(csl);
  const base = citeKey(csl);
  const key = citeKey(csl, await takenKeys(w, base.replace(/[a-z]$/, "")));
  const clean: CslItem = { ...csl };
  delete clean.id;
  const made = await insert<Source>(w, "research_sources", {
    ...f,
    key,
    csl: { ...clean, id: key },
    identifiers: o.identifiers ?? {},
    verified: Boolean(o.verified),
    added_via: o.via,
    projects: o.projects ?? [],
    collections: o.collections ?? [],
    tags: (o.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean),
    why: o.why ?? null,
    oa: o.oa ?? null,
    retracted: o.retracted ?? null,
  }, f.title);
  return made;
}

/** A change to the record: the columns beside it are refilled
    here, never by the caller. */
export function saveSource(
  w: Who, s: Source, part: Partial<Source> & { csl?: CslItem }, seen?: string,
): Promise<PatchAnswer<Source>> {
  const body: Record<string, unknown> = { ...part };
  if (part.csl) {
    const f = fieldsOf(part.csl);
    Object.assign(body, f, { csl: { ...part.csl, id: s.key } });
  }
  delete body.id;
  delete body.key;
  delete body.created_at;
  delete body.updated_at;
  return patch<Source>(w, "research_sources", s.id, body, s.title, seen);
}

/* ============================================================
   notes
   ============================================================ */

export interface NoteFilter {
  kind?: NoteKind | "";
  source?: string;
  project?: string;
  q?: string;
  inbox?: boolean;
  binned?: boolean;
  day?: string;
  limit?: number;
}

const NOTE_COLUMNS = "id,kind,title,body,text,source_id,projects,collections,tags,links,day,meta,"
  + "filed_at,deleted_at,created_at,updated_at";

export async function listNotes(w: Who, f: NoteFilter = {}): Promise<Note[]> {
  const q: string[] = [`select=${NOTE_COLUMNS}`, "order=updated_at.desc", `limit=${f.limit ?? 300}`];
  q.push(f.binned ? "deleted_at=not.is.null" : "deleted_at=is.null");
  if (f.kind) q.push(`kind=eq.${enc(f.kind)}`);
  if (f.source) q.push(`source_id=eq.${enc(f.source)}`);
  if (f.project) q.push(`projects=cs.{${enc(f.project)}}`);
  if (f.inbox) q.push("kind=eq.capture", "filed_at=is.null");
  if (f.day) q.push(`day=eq.${enc(f.day)}`);
  if (f.q) q.push(`fts=wfts(simple).${enc(f.q)}`);
  return rows<Note>(w, "research_notes", q.join("&"));
}

export const getNote = (w: Who, id: string): Promise<Note | null> =>
  row<Note>(w, "research_notes", id);

export const addNote = (
  w: Who, note: Partial<Note> & { kind: NoteKind },
): Promise<Note | null> =>
  insert<Note>(w, "research_notes", {
    kind: note.kind,
    title: note.title ?? "",
    body: note.body ?? "",
    text: note.text ?? "",
    source_id: note.source_id ?? null,
    projects: note.projects ?? [],
    collections: note.collections ?? [],
    tags: note.tags ?? [],
    links: note.links ?? [],
    day: note.day ?? null,
    meta: note.meta ?? {},
    filed_at: note.filed_at ?? null,
  }, note.title || note.text?.slice(0, 60) || note.kind);

export const saveNote = (
  w: Who, id: string, part: Partial<Note>, summary: string, seen?: string,
): Promise<PatchAnswer<Note>> => {
  const body: Record<string, unknown> = { ...part };
  delete body.id;
  delete body.created_at;
  delete body.updated_at;
  return patch<Note>(w, "research_notes", id, body, summary, seen);
};

/** Notes that point at this id, which is the backlinks list. */
export const backlinks = (w: Who, id: string): Promise<Note[]> =>
  rows<Note>(w, "research_notes",
    `select=${NOTE_COLUMNS}&links=cs.{${enc(id)}}&deleted_at=is.null&order=updated_at.desc&limit=100`);

/** A snapshot, kept when the last one is older than ten minutes. */
export async function keepVersion(
  w: Who, kind: Version["kind"], itemId: string, body: string, label?: string,
): Promise<void> {
  const last = await rows<Version>(w, "research_versions",
    `select=id,created_at&item_id=eq.${enc(itemId)}&order=created_at.desc&limit=1`);
  const recent = last[0] && Date.now() - new Date(last[0].created_at).getTime() < 10 * 60 * 1000;
  if (recent && !label) return;
  await call("research_versions", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify([{ user_id: w.id, kind, item_id: itemId, body, label: label ?? null }]),
  }, w);
}

export const listVersions = (w: Who, itemId: string): Promise<Version[]> =>
  rows<Version>(w, "research_versions",
    `select=id,kind,item_id,body,label,created_at&item_id=eq.${enc(itemId)}&order=created_at.desc&limit=50`);

/* ============================================================
   questions
   ============================================================ */

export const listQuestions = (w: Who, state?: QuestionState | ""): Promise<Question[]> =>
  rows<Question>(w, "research_questions",
    `order=position.asc,updated_at.desc${state ? `&state=eq.${enc(state)}` : ""}`);

export const addQuestion = (
  w: Who, text: string, kind: QuestionKind, parent: string | null, project: string | null,
): Promise<Question | null> =>
  insert<Question>(w, "research_questions",
    { text: text.slice(0, 400), kind, parent_id: parent, project_id: project, body: { note: "", evidence: [] } },
    text.slice(0, 80));

export const saveQuestion = (
  w: Who, id: string, part: Partial<Question>, summary: string, seen?: string,
): Promise<PatchAnswer<Question>> => {
  const body: Record<string, unknown> = { ...part };
  delete body.id;
  delete body.created_at;
  delete body.updated_at;
  return patch<Question>(w, "research_questions", id, body, summary, seen);
};

/* ============================================================
   tasks
   ============================================================ */

export const listTasks = (w: Who): Promise<Task[]> =>
  rows<Task>(w, "research_tasks", "order=lane.asc,position.asc,created_at.desc&limit=500");

export const addTask = (
  w: Who, title: string, lane: TaskLane = "week", project: string | null = null,
  links: Task["links"] = [], due: string | null = null,
): Promise<Task | null> =>
  insert<Task>(w, "research_tasks", {
    title: title.slice(0, 300), lane, project_id: project, links, due,
    waiting_since: lane === "waiting" ? new Date().toISOString() : null,
  }, title.slice(0, 80));

export const saveTask = (
  w: Who, t: Task, part: Partial<Task>,
): Promise<PatchAnswer<Task>> => {
  const body: Record<string, unknown> = { ...part };
  if (part.lane && part.lane !== t.lane) {
    body.waiting_since = part.lane === "waiting" ? new Date().toISOString() : null;
    body.done_at = part.lane === "done" ? new Date().toISOString() : null;
  }
  delete body.id;
  delete body.created_at;
  delete body.updated_at;
  return patch<Task>(w, "research_tasks", t.id, body, t.title);
};

export const removeTask = (w: Who, t: Task): Promise<boolean> =>
  remove(w, "research_tasks", t.id, t.title);

/* ============================================================
   reading lists
   ============================================================ */

export const listLists = (w: Who): Promise<ReadingList[]> =>
  rows<ReadingList>(w, "research_lists", "order=updated_at.desc");

export const addList = (w: Who, name: string, project: string | null = null): Promise<ReadingList | null> =>
  insert<ReadingList>(w, "research_lists", { name, project_id: project, items: [] }, name);

export const saveList = (
  w: Who, l: ReadingList, items: ListItem[], name?: string,
): Promise<PatchAnswer<ReadingList>> =>
  patch<ReadingList>(w, "research_lists", l.id, name ? { name, items } : { items }, l.name);

/* ============================================================
   activity
   ============================================================ */

export const listActivity = (w: Who, limit = 200): Promise<Activity[]> =>
  rows<Activity>(w, "research_activity", `order=created_at.desc&limit=${limit}`);

/* ============================================================
   the Worker's lookups
   ============================================================ */

export interface Lookup {
  csl: CslItem;
  via: "crossref" | "openalex" | "openlibrary" | "clip";
  retracted?: { type: string; doi?: string; at?: string } | null;
  openalex?: { id: string; cited: number; oa: boolean; oaUrl?: string } | null;
  pdf?: string;
  sources: Record<string, string>;
}

async function lookup(path: string): Promise<Lookup | null> {
  try {
    const res = await fetch(`/api/research/lookup/${path}`);
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean; found?: Lookup };
    return data.ok && data.found ? data.found : null;
  } catch { return null; }
}

export const lookupDoi = (doi: string): Promise<Lookup | null> => {
  const clean = normaliseDoi(doi);
  return clean ? lookup(`doi/${encodeURIComponent(clean)}`) : Promise.resolve(null);
};
export const lookupIsbn = (isbn: string): Promise<Lookup | null> =>
  lookup(`isbn/${encodeURIComponent(isbn)}`);
export const lookupUrl = (url: string): Promise<Lookup | null> =>
  lookup(`url?u=${encodeURIComponent(url)}`);

export async function serviceStatus(): Promise<Record<string, "on" | "off"> | null> {
  try {
    const res = await fetch("/api/research/status");
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean; services?: Record<string, "on" | "off"> };
    return data.services ?? null;
  } catch { return null; }
}

export interface ZoteroPage {
  items: { key: string; csl: CslItem; collections: string[]; tags: string[]; dateAdded?: string; itemType: string }[];
  total: number;
  next: number | null;
  collections: { key: string; name: string; parent: string | null }[];
}

export async function zoteroPage(
  w: Who, userId: string, key: string, start: number,
): Promise<{ page?: ZoteroPage; reason?: string }> {
  try {
    const res = await fetch("/api/research/zotero/pull", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${w.token}` },
      body: JSON.stringify({ userId, key, start }),
    });
    const data = await res.json() as { ok: boolean; page?: ZoteroPage; reason?: string };
    return data.ok && data.page ? { page: data.page } : { reason: data.reason ?? `${res.status}` };
  } catch { return { reason: "network" }; }
}

/* ============================================================
   the reading room: highlights, files, the queue
   ============================================================ */

export interface Highlight extends Row {
  source_id: string;
  file_key: string | null;
  page: number | null;
  quote: string;
  prefix: string;
  suffix: string;
  /** In the page's own units at scale one, top-left origin:
      `[x, y, w, h]` each. A cache; the quote is the anchor. */
  rects: number[][];
  meaning: HighlightMeaning;
  note: string;
  /** The extraction card. Each a field rather than free text so the
      review room's table can be filled from the reading. */
  fields: { number?: string; unit?: string; n?: string; method?: string; finding?: string; typed?: boolean };
  /** A time range for audio, `{ start, end }` in seconds. */
  position: { start?: number; end?: number };
}

const HIGHLIGHT_COLUMNS = "id,source_id,file_key,page,quote,prefix,suffix,rects,meaning,note,fields,position,created_at,updated_at";

export const listHighlights = (w: Who, sourceId: string): Promise<Highlight[]> =>
  rows<Highlight>(w, "research_highlights",
    `select=${HIGHLIGHT_COLUMNS}&source_id=eq.${enc(sourceId)}&order=page.asc.nullsfirst,created_at.asc&limit=2000`);

export const addHighlight = (
  w: Who, h: Omit<Partial<Highlight>, "id" | "created_at" | "updated_at"> & { source_id: string; meaning: HighlightMeaning },
): Promise<Highlight | null> =>
  insert<Highlight>(w, "research_highlights", {
    source_id: h.source_id, file_key: h.file_key ?? null, page: h.page ?? null,
    quote: h.quote ?? "", prefix: h.prefix ?? "", suffix: h.suffix ?? "", rects: h.rects ?? [],
    meaning: h.meaning, note: h.note ?? "", fields: h.fields ?? {}, position: h.position ?? {},
  }, (h.quote ?? "").slice(0, 80) || h.meaning);

export const saveHighlight = (
  w: Who, h: Highlight, part: Partial<Highlight>, seen?: string,
): Promise<PatchAnswer<Highlight>> =>
  patch<Highlight>(w, "research_highlights", h.id, part, h.quote.slice(0, 80) || h.meaning, seen);

export const removeHighlight = (w: Who, h: Highlight): Promise<boolean> =>
  remove(w, "research_highlights", h.id, h.quote.slice(0, 80) || h.meaning);

/* ---- the files, through the Worker ----

   Bytes never go to PostgREST and never come from it: the Worker
   stores them in R2 under the reader's prefix and answers with a
   key, and the key goes on the source row as one of its `files`.
   Reading is by ticket, because pdf.js and <audio> send no bearer. */

export interface Usage { bytes: number; files: number; cap: number; quota: number }

export async function fileUsage(w: Who): Promise<Usage | null> {
  try {
    const res = await fetch("/api/research/files", { headers: { authorization: `Bearer ${w.token}` } });
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean } & Usage;
    return data.ok ? { bytes: data.bytes, files: data.files, cap: data.cap, quota: data.quota } : null;
  } catch { return null; }
}

export type Uploaded = { ok: true; key: string; ext: string; size: number; already: boolean } | { ok: false; reason: string };

export async function uploadFile(w: Who, file: File): Promise<Uploaded> {
  try {
    const res = await fetch(`/api/research/file?name=${enc(file.name)}`, {
      method: "PUT",
      headers: { authorization: `Bearer ${w.token}`, "content-type": file.type || "application/octet-stream" },
      body: file,
    });
    const data = await res.json() as { ok: boolean; reason?: string; key?: string; ext?: string; size?: number; already?: boolean };
    if (!res.ok || !data.ok || !data.key) return { ok: false, reason: data.reason ?? `http-${res.status}` };
    return { ok: true, key: data.key, ext: data.ext ?? "", size: data.size ?? file.size, already: Boolean(data.already) };
  } catch { return { ok: false, reason: "network" }; }
}

/** A thirty-minute address for one file, or null. */
export async function fileTicket(w: Who, key: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/research/ticket/${key}`, { headers: { authorization: `Bearer ${w.token}` } });
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean; url?: string };
    return data.ok && data.url ? data.url : null;
  } catch { return null; }
}

export type Captured = { ok: true; key: string; size: number; title: string; words: number } | { ok: false; reason: string };

export async function captureUrl(w: Who, url: string): Promise<Captured> {
  try {
    const res = await fetch("/api/research/capture", {
      method: "POST",
      headers: { authorization: `Bearer ${w.token}`, "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json() as { ok: boolean; reason?: string; key?: string; size?: number; title?: string; words?: number };
    if (!res.ok || !data.ok || !data.key) return { ok: false, reason: data.reason ?? `http-${res.status}` };
    return { ok: true, key: data.key, size: data.size ?? 0, title: data.title ?? "", words: data.words ?? 0 };
  } catch { return { ok: false, reason: "network" }; }
}

/** Every file under the reader's prefix, gone. The account page's
    erase calls the same endpoint through its own module. */
export async function eraseFiles(w: Who): Promise<boolean> {
  try {
    const res = await fetch("/api/research/files", { method: "DELETE", headers: { authorization: `Bearer ${w.token}` } });
    return res.ok;
  } catch { return false; }
}

/** A file put on a source. `files` is replaced whole, which is
    what PostgREST does with a jsonb column, so the caller sends the
    row it has rather than a merge. */
export function attachFile(w: Who, s: Source, file: SourceFile, seen?: string): Promise<PatchAnswer<Source>> {
  const files = [...(s.files as SourceFile[]).filter((f) => f.key !== file.key), file];
  return saveSource(w, s, { files } as Partial<Source>, seen);
}

/** Where the reader got to in one file, on the row so it follows
    the account. Quiet: no activity line, because "page 12" is not
    a thing that happened. */
export async function keepPlace(w: Who, s: Source, key: string, page: number, pages?: number): Promise<Source | null> {
  const files = (s.files as SourceFile[]).map((f) => f.key === key ? { ...f, page, ...(pages ? { pages } : {}) } : f);
  const r = await call<Source[]>(`research_sources?user_id=eq.${w.id}&id=eq.${enc(s.id)}`, {
    method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify({ files }),
  }, w);
  return r.ok && r.data?.length ? r.data[0] : null;
}

/** The queue: every source with a file and a status short of
    read, priority first, then the most recently touched. A book
    with no file is queued too, because a book is read from paper
    and its highlights are typed. */
export async function listQueue(w: Who): Promise<Source[]> {
  const all = await listSources(w, { limit: 1000 });
  return all
    .filter((s) => ["unread", "skimmed"].includes(s.status) && (s.files.length > 0 || s.type === "book"))
    .sort((a, b) => b.priority - a.priority || b.updated_at.localeCompare(a.updated_at));
}

/* ============================================================
   finding: the indexes, related works, saved searches, alerts
   ============================================================ */

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
  from: string[];
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

export interface Searched { hits: Hit[]; asked: Record<string, "answered" | "no-key" | "failed" | "not-asked">; ms: number }

const bearer = (w: Who): Record<string, string> => ({ authorization: `Bearer ${w.token}` });

export async function searchIndexes(w: Who, q: SearchQuery): Promise<Searched | null> {
  const p = new URLSearchParams({ q: q.q });
  if (q.author) p.set("author", q.author);
  if (q.from) p.set("from", String(q.from));
  if (q.to) p.set("to", String(q.to));
  if (q.oa) p.set("oa", "1");
  if (q.type) p.set("type", q.type);
  if (q.databases?.length) p.set("db", q.databases.join(","));
  try {
    const res = await fetch(`/api/research/search?${p.toString()}`, { headers: bearer(w) });
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean } & Searched;
    return data.ok ? { hits: data.hits, asked: data.asked, ms: data.ms } : null;
  } catch { return null; }
}

export interface Related { references: Hit[]; citedBy: Hit[]; related: Hit[] }

export async function relatedWorks(w: Who, doi: string): Promise<Related | null> {
  try {
    const res = await fetch(`/api/research/related/${enc(doi)}`, { headers: bearer(w) });
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean } & Related;
    return data.ok ? { references: data.references, citedBy: data.citedBy, related: data.related } : null;
  } catch { return null; }
}

export async function freeCopy(w: Who, doi: string): Promise<{ isOa: boolean; url?: string } | null> {
  try {
    const res = await fetch(`/api/research/oa/${enc(doi)}`, { headers: bearer(w) });
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean; isOa?: boolean; url?: string };
    return data.ok ? { isOa: Boolean(data.isOa), url: data.url } : null;
  } catch { return null; }
}

export interface Search extends Row {
  query: string;
  fields: Omit<SearchQuery, "q" | "databases">;
  databases: string[];
  hits: number | null;
  alert: boolean;
  last_run: string | null;
  project_id: string | null;
  review_id: string | null;
}

export const listSearches = (w: Who): Promise<Search[]> =>
  rows<Search>(w, "research_searches", "order=updated_at.desc&limit=200");

export const addSearch = (w: Who, q: SearchQuery, hits: number | null, project: string | null = null): Promise<Search | null> =>
  insert<Search>(w, "research_searches", {
    query: q.q, fields: { author: q.author, from: q.from, to: q.to, oa: q.oa, type: q.type },
    databases: q.databases ?? [], hits, alert: false, last_run: new Date().toISOString(), project_id: project,
  }, q.q.slice(0, 80));

export const saveSearch = (w: Who, s: Search, part: Partial<Search>): Promise<PatchAnswer<Search>> =>
  patch<Search>(w, "research_searches", s.id, part, s.query.slice(0, 80));

export const removeSearch = (w: Who, s: Search): Promise<boolean> =>
  remove(w, "research_searches", s.id, s.query.slice(0, 80));

/** The flag, copied to D1 for the cron, or taken off it. */
export async function pushAlert(w: Who, s: Search): Promise<boolean> {
  try {
    const res = await fetch("/api/research/alerts", {
      method: "PUT", headers: { ...bearer(w), "content-type": "application/json" },
      body: JSON.stringify({ id: s.id, query: s.query, fields: s.fields, databases: s.databases }),
    });
    return res.ok;
  } catch { return false; }
}

export async function dropAlert(w: Who, id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/research/alerts/${enc(id)}`, { method: "DELETE", headers: bearer(w) });
    return res.ok;
  } catch { return false; }
}

/** What the cron found since the last visit, collected and cleared
    on the Worker in one call, so a work is offered once. */
export async function collectAlerts(w: Who): Promise<(Hit & { alert: string; found_at: string })[]> {
  try {
    const res = await fetch("/api/research/alerts/hits", { headers: bearer(w) });
    if (!res.ok) return [];
    const data = await res.json() as { ok: boolean; hits?: (Hit & { alert: string; found_at: string })[] };
    return data.ok ? data.hits ?? [] : [];
  } catch { return []; }
}

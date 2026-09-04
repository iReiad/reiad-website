/* routine.ts: the browser's half of the routine. Three tables in
   Postgres behind row-level security, no copy on the device, for
   the reason `saved.ts` gives. `shared/routine.ts` is the shapes
   and the one calculation; this is the wire.
   NOTHING HERE COUNTS CONSECUTIVE ANYTHING (`ROUTINE.md` §0):
   every counter is "how many times ever", and one that becomes
   "how many times lately" has started being a streak. */

import { SUPABASE_URL, SUPABASE_KEY, token, current } from "/account.js";

const REST = `${SUPABASE_URL}/rest/v1`;

/* Named rather than `*`, for the reason `account.js` gives about
   the profile: a column added for some other reason should not
   start arriving in a browser without anybody deciding it
   should. */
const ROUTINE_FIELDS = "id,name,bands,tasks,is_active,created_at,updated_at";
const ENTRY_FIELDS = "id,routine_id,entry_date,marks,mood,note,chose,updated_at";

export interface RoutineRow {
  id: string;
  name: string;
  bands: unknown[];
  tasks: unknown[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EntryRow {
  id: string;
  routine_id: string;
  entry_date: string;
  marks: Record<string, number>;
  mood: string | null;
  note: string | null;
  chose: string | null;
  updated_at: string;
}

export interface TemplateRow {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  data: { bands: unknown[]; tasks: unknown[] };
}

async function headers(extra?: Record<string, string>): Promise<Record<string, string> | null> {
  const access = await token();
  if (!access) return null;
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * One read, with the failure written down rather than thrown at a
 * page that cannot do anything about it.
 *
 * Reads answer with a fallback so a day can render empty; writes
 * throw, because somebody who marked something has to be told
 * when it did not save. `saved.ts` makes the same split and the
 * asymmetry is deliberate.
 */
async function get<T>(path: string, fallback: T): Promise<T> {
  const head = await headers();
  if (!head) return fallback;
  try {
    const res = await fetch(`${REST}/${path}`, { headers: head });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json() as T;
  } catch (err) {
    console.warn("routine: could not read", path, err);
    return fallback;
  }
}

/* ============================================================
   Which day it is
   ============================================================ */

/**
 * Today, for somebody whose day ends at `roll` rather than at
 * midnight.
 *
 * Marking something at 1am belongs to yesterday, because that is
 * what the person doing it means. The default is 4, so the small
 * hours are still the night before, and somebody who works nights
 * can genuinely set it to 11.
 *
 * Local time throughout, and deliberately: a routine is about the
 * day somebody is living in, not about UTC.
 */
export function todayFor(roll = 4, now = new Date()): string {
  const d = new Date(now);
  if (d.getHours() < roll) d.setDate(d.getDate() - 1);
  return isoDay(d);
}

/** `YYYY-MM-DD` in LOCAL time. `toISOString()` is UTC and would
    put anybody east of Greenwich on the wrong day for part of
    every evening, which is most of this site's readers. */
export function isoDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** `n` days either side of a date, as `YYYY-MM-DD`. */
export function daysAround(day: string, back: number, forward = 0): string[] {
  const out: string[] = [];
  for (let i = -back; i <= forward; i += 1) {
    const d = new Date(`${day}T12:00:00`);
    d.setDate(d.getDate() + i);
    out.push(isoDay(d));
  }
  return out;
}

/* ============================================================
   The routine
   ============================================================ */

/** The templates the site ships, plus this reader's own. */
export function listTemplates(): Promise<TemplateRow[]> {
  return get<TemplateRow[]>(
    "routine_templates?select=id,owner_id,name,description,data&order=owner_id.asc,name.asc", []);
}

/** This reader's active routine, or null if they have none yet.

    `limit=1` with an `order`, rather than bare: there is normally
    one, and "whichever the planner reached first" is not an
    answer a page should act on. The lesson is #159's. */
export async function activeRoutine(): Promise<RoutineRow | null> {
  const rows = await get<RoutineRow[]>(
    `routines?select=${ROUTINE_FIELDS}&is_active=is.true&order=created_at.asc&limit=1`, []);
  return rows[0] ?? null;
}

/**
 * Put a routine on this account, copied from a shape.
 *
 * COPIED, always. Editing your routine must never reach back into
 * the template it came from, which is the whole reason
 * `routines` and `routine_templates` are two tables holding the
 * same shape rather than one table with a flag.
 */
export async function makeRoutine(
  name: string, shape: { bands: unknown[]; tasks: unknown[] },
): Promise<RoutineRow> {
  const who = current();
  const head = await headers({ Prefer: "return=representation" });
  if (!head || !who) throw new Error("Not signed in.");

  const res = await fetch(`${REST}/routines?select=${ROUTINE_FIELDS}`, {
    method: "POST",
    headers: head,
    /* `user_id` written out, though the policy would refuse any
       other value: the with-check half of a policy is a lock and
       not a default, and PostgREST sends null without this. */
    body: JSON.stringify([{
      user_id: who.id,
      name,
      bands: shape.bands,
      tasks: shape.tasks,
    }]),
  });
  if (!res.ok) {
    const said = await res.json().catch(() => null) as { message?: string } | null;
    throw new Error(said?.message || `That did not save (${res.status}).`);
  }
  const [row] = await res.json() as RoutineRow[];
  return row;
}

/** Change the list itself: a renamed task, a new one, an archived
    one, a reordered band. */
export async function saveRoutine(
  id: string, patch: Partial<Pick<RoutineRow, "name" | "bands" | "tasks">>,
): Promise<boolean> {
  const head = await headers({ Prefer: "return=minimal" });
  if (!head) throw new Error("Not signed in.");
  const res = await fetch(`${REST}/routines?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH", headers: head, body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`That did not save (${res.status}).`);
  return true;
}

/* ============================================================
   The days
   ============================================================ */

/** One day, or null if nothing has been marked on it yet.

    Null rather than an empty row, because an empty day and a day
    with nothing marked are the same thing and neither should
    cause a write. A row appears the first time somebody touches
    it. */
export async function dayEntry(date: string): Promise<EntryRow | null> {
  const rows = await get<EntryRow[]>(
    `routine_entries?select=${ENTRY_FIELDS}&entry_date=eq.${encodeURIComponent(date)}&limit=1`, []);
  return rows[0] ?? null;
}

/** Every day in a range, oldest first. The week strip asks for
    seven, the heatmap for eighty-four, and the year page for
    everything. */
export function daysBetween(from: string, to: string): Promise<EntryRow[]> {
  return get<EntryRow[]>(
    `routine_entries?select=${ENTRY_FIELDS}`
    + `&entry_date=gte.${encodeURIComponent(from)}`
    + `&entry_date=lte.${encodeURIComponent(to)}`
    + "&order=entry_date.asc", []);
}

/**
 * Write a day.
 *
 * ONE ROW PER PERSON PER DAY, so this is an upsert on
 * `(user_id, entry_date)` and the whole of saving is one request.
 *
 * ---- what it sends, and the bug that shape avoids ----
 *
 * `resolution=merge-duplicates` REPLACES the conflicting row with
 * what is sent. So a caller sending only `{ marks }` would erase
 * the note somebody wrote this morning, and a caller sending only
 * `{ note }` would erase every tick. That is the one destructive
 * thing this endpoint could do, and `keepPage()` in `saved.ts`
 * says the same about the two columns of a library row.
 *
 * So the caller passes the WHOLE day as it now stands and this
 * sends the whole day. The day view holds it in state anyway,
 * because it has to draw it.
 */
export async function saveDay(
  routineId: string,
  date: string,
  day: { marks: Record<string, number>; mood?: string | null; note?: string | null; chose?: string | null },
): Promise<EntryRow | null> {
  const who = current();
  const head = await headers({
    Prefer: "resolution=merge-duplicates,return=representation",
  });
  if (!head || !who) throw new Error("Not signed in.");

  /* A mark of 0 is not a mark. Cleared ticks leave the object
     rather than sitting in it as zeroes, so a day nobody has
     marked is `{}` and `done()` can tell the difference between
     "nothing" and "nothing yet". */
  const marks: Record<string, number> = {};
  for (const [id, m] of Object.entries(day.marks)) {
    if (typeof m === "number" && m > 0) marks[id] = Math.min(1, m);
  }

  const res = await fetch(
    `${REST}/routine_entries?on_conflict=user_id,entry_date&select=${ENTRY_FIELDS}`, {
      method: "POST",
      headers: head,
      body: JSON.stringify([{
        user_id: who.id,
        routine_id: routineId,
        entry_date: date,
        marks,
        mood: day.mood ?? null,
        note: (day.note ?? "").slice(0, 20000) || null,
        chose: (day.chose ?? "").slice(0, 500) || null,
      }]),
    });
  if (!res.ok) {
    const said = await res.json().catch(() => null) as { message?: string } | null;
    throw new Error(said?.message || `Not saved (${res.status}).`);
  }
  const [back] = await res.json().catch(() => []) as EntryRow[];
  return back ?? null;
}

/* ============================================================
   The counters, which only go up
   ============================================================ */

/**
 * How many times a task has EVER been marked.
 *
 * The birds, the garden and every milestone are this function.
 * It has no window, no "recently" and no reset, which is the
 * whole of ROUTINE.md §0: a counter with a window is a streak,
 * and a person who stops for a fortnight and comes back must find
 * the flock exactly as they left it.
 *
 * If a `since` argument ever appears here, that is the moment
 * this stopped being a gift.
 */
export async function everMarked(taskId: string): Promise<number> {
  /* Counted by the database rather than fetched and counted here:
     a year of days is 365 rows and this is drawn on first paint.
     `count=exact` with `head` sends no body at all. */
  const head = await headers({ Prefer: "count=exact" });
  if (!head) return 0;
  try {
    const res = await fetch(
      `${REST}/routine_entries?select=id&marks->>${encodeURIComponent(taskId)}=not.is.null`,
      { method: "HEAD", headers: head });
    if (!res.ok) throw new Error(String(res.status));
    /* `Content-Range` is `0-24/117`, and the half after the slash
       is the only part wanted. `*` where the count is unknown. */
    const range = res.headers.get("content-range") ?? "";
    const total = Number(range.split("/")[1]);
    return Number.isFinite(total) ? total : 0;
  } catch (err) {
    console.warn("routine: could not count", taskId, err);
    return 0;
  }
}

/** Everything a reader has ever written, newest first, for the
    jar and for the reflection log. */
export function everyNote(): Promise<EntryRow[]> {
  return get<EntryRow[]>(
    `routine_entries?select=entry_date,note,mood&note=not.is.null&note=neq.`
    + "&order=entry_date.desc", []);
}

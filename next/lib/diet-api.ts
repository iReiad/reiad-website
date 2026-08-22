/* ============================================================
   diet-api.ts: the diet tool's rows, read and written as the
   reader.

   `DIET.md` section 27 is the shape and the reasoning. Six
   tables, all private to one person, all behind the same row
   level security everything else here uses, and NO LOCAL COPY:
   nothing in this tool works signed out, so a second record
   would be a second thing to keep in step for nobody's benefit.
   `scenarios` and `targets` already made that call and the
   routine's entries made it again.

   ---- the browser is the caller, not a Worker ----

   Every request here goes straight to PostgREST with the
   READER'S OWN bearer, exactly as the routine tool does. This
   project holds no service-role key and this tool is not a
   reason to start one. The one thing that does go through a
   Worker is food SEARCH, which is a read-only proxy over
   somebody else's public database and never sees a reader's log.

   ---- and the filter is not a second lock ----

   Every table here is `auth.uid() = user_id`, so a read with no
   filter returns your own rows and nothing else. The filters
   below are for the QUERY rather than for safety: `profiles` is
   the one table on this site where a missing filter returns a
   stranger's row, and the paragraph in `account.ts` about that
   is worth reading before touching any of this.

   ---- a queued write is not a local copy ----

   `queue()` holds a request that has not gone yet, for the
   reader on a bad connection, which is most of Bangladesh some
   of the time. It is shown as pending, retried, and gone the
   moment it lands. It is never read back as data and nothing
   renders from it except its own pending state. That is the
   distinction that keeps this out of the argument `sync.ts`
   settled.
   ============================================================ */

import type { Day, Entry, Phase } from "@reiad/shared/diet";
import { runtimeModule } from "../components/account/runtime";

type AccountModule = typeof import("/account.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");

/* The project's address and its publishable key come from
   `/account.js`, which is where they already are. A second copy
   here would be a second thing to rotate, and the one I first
   wrote was a stale JWT from an older project: it would have
   401ed on every request while the code read as correct. */

export interface Who { id: string; token: string }

let rest: string | null = null;
let anon: string | null = null;

export interface Who { id: string; token: string }

/** Who is signed in, with a token that is good right now.

    Null is the ordinary answer for a signed-out reader and not
    an error anywhere: every page in this tool that needs an
    account says so rather than failing, and `/tools/diet/you`
    needs none at all. */
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

async function call<T>(
  path: string, init: RequestInit, w: Who,
): Promise<{ ok: boolean; data?: T; status: number }> {
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
    /* A network failure rather than a refusal, which is the one
       case worth queueing. `fetch` rejects only here: a 500 and
       a 404 both resolve, which is the trap `sw.js` v170 was
       written for. */
    return { ok: false, status: 0 };
  }
}

/* ---------------------------------------------------------- */
/* the profile                                                */
/* ---------------------------------------------------------- */

export interface Profile {
  sex?: "male" | "female";
  birth_year?: number;
  height_cm?: number;
  place?: "bd" | "uk";
  ancestry?: "general" | "asian";
  units?: "metric" | "imperial";
  activity?: string;
  goal_kind?: "lose" | "maintain" | "gain";
  goal_rate?: number;
  goal_waist_cm?: number;
  goal_weight_kg?: number;
  band_low_kg?: number;
  band_high_kg?: number;
  cycle_tracking?: boolean;
  /** One date and a length, not a diary: everything the cycle
      reading does is arithmetic on a repeating interval, so a
      log of periods would be a more sensitive record collected
      for no extra answer. Both are behind `cycle_tracking`,
      which is off by default. */
  cycle_start?: string;
  cycle_days?: number;
  meds?: string[];
  food_budget?: number;
  budget_currency?: string;
  oil_ml_week?: number;
  oil_people?: number;
  oil_meals?: number;
  board?: string[];
  onboarded_at?: string;
}

export async function getProfile(w: Who): Promise<Profile | null> {
  /* `user_id=eq.<me>` even though the policy already makes any
     other row unreachable. Two locks on this door, and the
     reason is written out at length beside `getProfile` in
     `account.ts`: the one table where the filter was missing
     returned whichever row the planner reached first. */
  const r = await call<Profile[]>(
    `diet_profile?user_id=eq.${w.id}&select=*&limit=1`, { method: "GET" }, w,
  );
  return r.ok && r.data?.length ? r.data[0] : null;
}

export async function saveProfile(w: Who, patch: Profile): Promise<boolean> {
  const r = await call(`diet_profile?on_conflict=user_id`, {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ ...patch, user_id: w.id, updated_at: new Date().toISOString() }),
  }, w);
  return r.ok;
}

/* ---------------------------------------------------------- */
/* the days                                                   */
/* ---------------------------------------------------------- */

/** A row as PostgREST holds it. Separate from `Day` because the
    columns are snake_case and the component's shape is not, and
    one shape pretending to be both is how a save silently drops
    a column. */
interface DayRow {
  entry_date: string;
  weight_kg?: number | null;
  kcal?: number | null;
  protein_g?: number | null; carbs_g?: number | null;
  fat_g?: number | null; fibre_g?: number | null;
  sodium_mg?: number | null;
  ketones_mmol?: number | null;
  steps?: number | null; sleep_hours?: number | null;
  water_ml?: number | null; hunger?: number | null;
  waist_cm?: number | null; hip_cm?: number | null; neck_cm?: number | null;
  chest_cm?: number | null; thigh_cm?: number | null; arm_cm?: number | null;
  marks?: string[] | null; tags?: string[] | null; note?: string | null;
}

const toDay = (r: DayRow): Day => ({
  date: r.entry_date,
  weightKg: r.weight_kg ?? undefined,
  kcal: r.kcal ?? undefined,
  proteinG: r.protein_g ?? undefined,
  carbsG: r.carbs_g ?? undefined,
  fatG: r.fat_g ?? undefined,
  fibreG: r.fibre_g ?? undefined,
  sodiumMg: r.sodium_mg ?? undefined,
  ketonesMmol: r.ketones_mmol ?? undefined,
  steps: r.steps ?? undefined,
  sleepHours: r.sleep_hours ?? undefined,
  waterMl: r.water_ml ?? undefined,
  hunger: r.hunger ?? undefined,
  waistCm: r.waist_cm ?? undefined,
  hipCm: r.hip_cm ?? undefined,
  neckCm: r.neck_cm ?? undefined,
  chestCm: r.chest_cm ?? undefined,
  thighCm: r.thigh_cm ?? undefined,
  armCm: r.arm_cm ?? undefined,
  marks: r.marks ?? undefined,
  tags: r.tags ?? undefined,
  note: r.note ?? undefined,
});

const fromDay = (d: Day): DayRow => ({
  entry_date: d.date,
  weight_kg: d.weightKg ?? null,
  kcal: d.kcal ?? null,
  protein_g: d.proteinG ?? null,
  carbs_g: d.carbsG ?? null,
  fat_g: d.fatG ?? null,
  fibre_g: d.fibreG ?? null,
  sodium_mg: d.sodiumMg ?? null,
  ketones_mmol: d.ketonesMmol ?? null,
  steps: d.steps ?? null,
  sleep_hours: d.sleepHours ?? null,
  water_ml: d.waterMl ?? null,
  hunger: d.hunger ?? null,
  waist_cm: d.waistCm ?? null,
  hip_cm: d.hipCm ?? null,
  neck_cm: d.neckCm ?? null,
  chest_cm: d.chestCm ?? null,
  thigh_cm: d.thighCm ?? null,
  arm_cm: d.armCm ?? null,
  marks: d.marks ?? [],
  tags: d.tags ?? [],
  note: d.note ?? null,
});

/** The last n days, newest first out of the index and reversed
    here, because every reading downstream wants them in order. */
export async function getDays(w: Who, from: string): Promise<Day[]> {
  const r = await call<DayRow[]>(
    `diet_days?user_id=eq.${w.id}&entry_date=gte.${from}`
    + `&select=*&order=entry_date.asc&limit=800`, { method: "GET" }, w,
  );
  return r.ok && r.data ? r.data.map(toDay) : [];
}

/** One row per person per day, which is what makes this an
    upsert on `(user_id, entry_date)` rather than a read, a
    branch and two code paths. */
export async function saveDay(w: Who, day: Day): Promise<boolean> {
  const r = await writeDay(w, day);
  /* Only a network failure is worth holding. A 400 is a refusal
     and retrying it for ever is a loop. */
  if (!r.ok && r.status === 0) queue(async () => (await writeDay(w, day)).ok);
  return r.ok;
}

/** The write with no queueing in it, which is what the queue
    itself must call. `saveDay` queued a retry of `saveDay`, so
    every failed attempt pushed ANOTHER copy of itself on to an
    array `drain()` had already refused to shift, and a reader on
    a bad connection grew a queue rather than emptying one. */
function writeDay(w: Who, day: Day): Promise<{ ok: boolean; status: number }> {
  return call("diet_days?on_conflict=user_id,entry_date", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ ...fromDay(day), user_id: w.id,
      updated_at: new Date().toISOString() }),
  }, w);
}

/* ---------------------------------------------------------- */
/* what was eaten                                             */
/* ---------------------------------------------------------- */

interface EntryRow {
  id?: string;
  entry_date: string;
  at_time?: string | null;
  meal?: string | null;
  label: string;
  label_bn?: string | null;
  qty?: number | null;
  unit?: string | null;
  kcal?: number | null;
  macros?: Record<string, number> | null;
  micros?: Record<string, number> | null;
  est_low?: number | null;
  est_high?: number | null;
  planned?: boolean | null;
  source?: string | null;
  source_id?: string | null;
}

const toEntry = (r: EntryRow): Entry => ({
  id: r.id,
  date: r.entry_date,
  atTime: r.at_time ?? undefined,
  meal: r.meal ?? undefined,
  label: r.label,
  labelBn: r.label_bn ?? undefined,
  qty: r.qty ?? undefined,
  unit: r.unit ?? undefined,
  kcal: r.kcal ?? undefined,
  macros: r.macros ?? undefined,
  micros: r.micros ?? undefined,
  estLow: r.est_low ?? undefined,
  estHigh: r.est_high ?? undefined,
  planned: r.planned ?? undefined,
  source: r.source ?? undefined,
  sourceId: r.source_id ?? undefined,
});

export async function getEntries(w: Who, from: string, to?: string): Promise<Entry[]> {
  const range = to ? `&entry_date=lte.${to}` : "";
  const r = await call<EntryRow[]>(
    `diet_entries?user_id=eq.${w.id}&entry_date=gte.${from}${range}`
    + `&select=*&order=entry_date.asc&limit=2000`, { method: "GET" }, w,
  );
  return r.ok && r.data ? r.data.map(toEntry) : [];
}

export async function addEntry(w: Who, e: Entry): Promise<Entry | null> {
  const row: EntryRow & { user_id: string } = {
    user_id: w.id,
    entry_date: e.date,
    /* THE CLOCK GOES IN `at_time` AND THE MEAL STAYS A MEAL.
       This wrote "HH:MM" into `meal` for a while, which left the
       hour readable only by a regex and left no row on this site
       carrying a breakfast, a lunch or a dinner, so section 16's
       reading of how protein is spread across a day had nothing
       to read. */
    at_time: e.atTime ?? null,
    meal: e.meal ?? null,
    label: e.label,
    label_bn: e.labelBn ?? null,
    qty: e.qty ?? null,
    unit: e.unit ?? null,
    kcal: e.kcal ?? null,
    macros: e.macros ?? {},
    micros: e.micros ?? {},
    est_low: e.estLow ?? null,
    est_high: e.estHigh ?? null,
    planned: e.planned ?? false,
    /* WHERE THE NUMBER CAME FROM, on every row, and what it was
       copied from. The log must not depend on a public database
       still being there next year, and a history that changed
       because somebody edited an entry in one would be worse
       than one that went missing: nothing would announce it. */
    source: e.source ?? "free",
    source_id: e.sourceId ?? null,
  };
  const r = await call<EntryRow[]>("diet_entries", {
    method: "POST",
    headers: { prefer: "return=representation" },
    body: JSON.stringify(row),
  }, w);
  /* Not `addEntry` again: that would push a fresh copy on to the
     queue on every failed retry. The queued job is the request
     and nothing else, and it reports whether the row landed. */
  if (!r.ok && r.status === 0) {
    queue(async () => {
      const again = await call<EntryRow[]>("diet_entries", {
        method: "POST",
        headers: { prefer: "return=representation" },
        body: JSON.stringify(row),
      }, w);
      return again.ok;
    });
  }
  return r.ok && r.data?.length ? toEntry(r.data[0]) : null;
}

export async function removeEntry(w: Who, id: string): Promise<boolean> {
  const r = await call(`diet_entries?id=eq.${id}`, { method: "DELETE" }, w);
  return r.ok;
}

/* ---------------------------------------------------------- */
/* the reader's own items, and what protocol was running       */
/* ---------------------------------------------------------- */

export interface OwnFood {
  id?: string;
  label: string;
  label_bn?: string;
  qty?: number;
  unit?: string;
  kcal?: number;
  macros?: Record<string, number>;
  micros?: Record<string, number>;
  kind?: "item" | "pot" | "recipe" | "meal";
  parts?: unknown;
  serves?: number;
  uses?: number;
  last_used?: string;
  source?: string;
}

/** Your usuals, worked out rather than asked for: most used
    first, because anything logged three times is something you
    will log again. */
export async function getOwnFoods(w: Who): Promise<OwnFood[]> {
  const r = await call<OwnFood[]>(
    `diet_foods?user_id=eq.${w.id}&select=*&order=uses.desc&limit=200`,
    { method: "GET" }, w,
  );
  return r.ok && r.data ? r.data : [];
}

export async function saveOwnFood(w: Who, food: OwnFood): Promise<boolean> {
  const r = await call("diet_foods", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({ ...food, user_id: w.id,
      updated_at: new Date().toISOString() }),
  }, w);
  return r.ok;
}

export async function getPhases(w: Who): Promise<Phase[]> {
  const r = await call<Array<{ style: string; started_on: string; ended_on?: string }>>(
    `diet_phases?user_id=eq.${w.id}&select=*&order=started_on.asc`, { method: "GET" }, w,
  );
  if (!r.ok || !r.data) return [];
  /* `Phase.startDay` counts from the same origin `Point.day`
     does, and the caller owns that origin, so the ISO date is
     carried through and converted there. A date turned into a
     day number in two places is two places to get an off-by-one. */
  return r.data.map((p) => ({
    protocol: p.style as Phase["protocol"],
    startDay: dayNumber(p.started_on),
    endDay: p.ended_on ? dayNumber(p.ended_on) : undefined,
  }));
}

export async function startPhase(w: Who, style: string, on: string): Promise<boolean> {
  const r = await call("diet_phases", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({ user_id: w.id, style, started_on: on }),
  }, w);
  return r.ok;
}

/* ---------------------------------------------------------- */
/* the clinic's numbers                                       */
/* ---------------------------------------------------------- */

/** One reading off one report.

    `ref_low` and `ref_high` are on the ROW rather than derived
    from the marker, because a reference interval is a property
    of an assay and a population and is printed on the report the
    reader is holding. Two labs differ by more than the changes
    this tool would be drawing, so a figure judged against a
    borrowed range is a figure judged wrongly. */
export interface Lab {
  id?: string;
  /** The date on the report, not the date it was typed in. */
  takenOn: string;
  /** A `MARKERS` id from `components/diet/words.ts`. A stored
      value: it is in real rows and is renamed the way a storage
      key is renamed, which is to say not at all. */
  marker: string;
  value: number;
  unit: string;
  refLow?: number;
  refHigh?: number;
  note?: string;
}

interface LabRow {
  id?: string;
  taken_on: string;
  marker: string;
  value: number;
  unit: string;
  ref_low?: number | null;
  ref_high?: number | null;
  note?: string | null;
}

const toLab = (r: LabRow): Lab => ({
  id: r.id,
  takenOn: r.taken_on,
  marker: r.marker,
  value: Number(r.value),
  unit: r.unit,
  refLow: r.ref_low ?? undefined,
  refHigh: r.ref_high ?? undefined,
  note: r.note ?? undefined,
});

/** Everything, oldest first, because every reading of these is a
    line over time rather than a latest value. There are a dozen
    markers and a person is tested twice a year, so the whole
    history is smaller than one day of food. */
export async function getLabs(w: Who): Promise<Lab[]> {
  const r = await call<LabRow[]>(
    `diet_labs?user_id=eq.${w.id}&select=*&order=taken_on.asc&limit=500`,
    { method: "GET" }, w,
  );
  return r.ok && r.data ? r.data.map(toLab) : [];
}

export async function saveLab(w: Who, lab: Lab): Promise<Lab | null> {
  const row: LabRow & { user_id: string } = {
    user_id: w.id,
    taken_on: lab.takenOn,
    marker: lab.marker,
    value: lab.value,
    unit: lab.unit,
    ref_low: lab.refLow ?? null,
    ref_high: lab.refHigh ?? null,
    note: lab.note ?? null,
  };
  const r = await call<LabRow[]>("diet_labs", {
    method: "POST",
    headers: { prefer: "return=representation" },
    body: JSON.stringify(row),
  }, w);
  if (!r.ok && r.status === 0) {
    queue(async () => (await call("diet_labs", {
      method: "POST",
      headers: { prefer: "return=minimal" },
      body: JSON.stringify(row),
    }, w)).ok);
  }
  return r.ok && r.data?.length ? toLab(r.data[0]) : null;
}

/** A number typed off the wrong line of a report is worse than
    no number, so it has to be removable. */
export async function removeLab(w: Who, id: string): Promise<boolean> {
  const r = await call(`diet_labs?id=eq.${id}`, { method: "DELETE" }, w);
  return r.ok;
}

/* ---------------------------------------------------------- */
/* dates, said once                                           */
/* ---------------------------------------------------------- */

/** Days since 1970, from an ISO date.

    The STRING is read in UTC, which is arithmetic and not a
    timezone decision: `2026-08-22` is a day rather than an
    instant, and parsing it in local time makes the difference
    between two of them wrong by an hour twice a year. */
export const dayNumber = (iso: string): number => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
};

/** Which day it is WHERE THE READER IS, never in UTC.

    This was `toISOString().slice(0, 10)` and the argument for it
    was that two cities must agree which day it was. They must
    not: `entry_date` is the reader's own day, and section 4's
    morning weight is a local-morning fact. At UTC+6 that spelling
    filed everything logged between midnight and 6am on
    YESTERDAY'S row, and because `diet_days` is unique on
    `(user_id, entry_date)` and `saveDay` merges, weighing at
    5:30am in Dhaka overwrote the previous morning's reading. The
    streak, the strip and the by-weekday reading all moved with
    it. */
export const isoDate = (at: Date = new Date()): string =>
  `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, "0")}`
  + `-${String(at.getDate()).padStart(2, "0")}`;

/** The reader's own clock as "HH:MM", which is what `at_time`
    holds. Local for the same reason the date is. */
export const clockTime = (at: Date = new Date()): string =>
  `${String(at.getHours()).padStart(2, "0")}:${String(at.getMinutes()).padStart(2, "0")}`;

export const shiftDate = (iso: string, by: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + by)).toISOString().slice(0, 10);
};

/* ---------------------------------------------------------- */
/* the queue, which is a request rather than a record          */
/* ---------------------------------------------------------- */

type Pending = () => Promise<boolean>;
const pending: Pending[] = [];
let draining = false;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

/** Hold a write that failed on the NETWORK, and only on the
    network: a 400 is a refusal and retrying it forever is a
    loop. `call()` reports status 0 for the one case worth
    keeping.

    It is never read back. Nothing renders from it except
    `pendingCount()`, which is how the page says "not saved yet"
    rather than pretending it did.

    ---- three things it has to do that it did not ----

    RETRY ON A TIMER AS WELL AS ON `online`. The listener fires
    on a transition, so a request that died on a timeout while
    the browser still believed it was online waited for an event
    that never came.

    HOLD THE REAL ANSWER. `drain()` shifts a job off the queue
    only when the job says it landed, so a retry that returns
    `true` unconditionally is a write dropped in silence. The one
    caller that did that is `addEntry`, and its `.then(() =>
    true)` is gone.

    SAY THAT A CLOSED TAB LOSES IT. This is memory, deliberately:
    a persisted queue would be a second record of what somebody
    ate, which is the argument `sync.ts` settled. So the page
    tells the reader it has not gone yet, and `subscribePending`
    is how the count on screen stays true. */
function queue(job: Pending): void {
  pending.push(job);
  announce();
  if (typeof window === "undefined") return;
  window.addEventListener("online", () => void drain(), { once: true });
  schedule(4000);
}

/** Back off to a minute, so a reader who is genuinely off the
    network is not retried at every four seconds for an hour. */
function schedule(ms: number): void {
  if (timer !== null || !pending.length) return;
  timer = setTimeout(() => {
    timer = null;
    void drain().then(() => { if (pending.length) schedule(Math.min(ms * 2, 60000)); });
  }, ms);
}

function announce(): void { for (const f of listeners) f(); }

export function pendingCount(): number { return pending.length; }

/** Anything drawing the pending count subscribes, for the same
    reason every meter reading a progress key does: a component
    that reads it once on mount is drawn against the queue as it
    was before the write it is reporting on. */
export function subscribePending(f: () => void): () => void {
  listeners.add(f);
  return () => { listeners.delete(f); };
}

export async function drain(): Promise<void> {
  if (draining) return;
  draining = true;
  try {
    while (pending.length) {
      const job = pending[0];
      if (!await job()) break;
      pending.shift();
      announce();
    }
  } finally { draining = false; }
}

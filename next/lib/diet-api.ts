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
  const r = await call("diet_days?on_conflict=user_id,entry_date", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ ...fromDay(day), user_id: w.id,
      updated_at: new Date().toISOString() }),
  }, w);
  if (!r.ok && r.status === 0) queue(() => saveDay(w, day));
  return r.ok;
}

/* ---------------------------------------------------------- */
/* what was eaten                                             */
/* ---------------------------------------------------------- */

interface EntryRow {
  id?: string;
  entry_date: string;
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
  if (!r.ok && r.status === 0) queue(() => addEntry(w, e).then(() => true));
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
/* dates, said once                                           */
/* ---------------------------------------------------------- */

/** Days since 1970, from an ISO date, in UTC.

    UTC AND NOT LOCAL, deliberately: a reader who logs at 11pm in
    Dhaka and 11pm in Manchester must not have two different
    ideas of which day it was, and a difference of one day is a
    whole entry in a table keyed on `(user_id, entry_date)`. */
export const dayNumber = (iso: string): number => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
};

export const isoDate = (at: Date = new Date()): string =>
  at.toISOString().slice(0, 10);

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

/** Hold a write that failed on the NETWORK, and only on the
    network: a 400 is a refusal and retrying it forever is a
    loop. `call()` reports status 0 for the one case worth
    keeping.

    It is never read back. Nothing renders from it except
    `pendingCount()`, which is how the page says "not saved yet"
    rather than pretending it did. */
function queue(job: Pending): void {
  pending.push(job);
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => void drain(), { once: true });
  }
}

export function pendingCount(): number { return pending.length; }

export async function drain(): Promise<void> {
  if (draining) return;
  draining = true;
  try {
    while (pending.length) {
      const job = pending[0];
      if (!await job()) break;
      pending.shift();
    }
  } finally { draining = false; }
}

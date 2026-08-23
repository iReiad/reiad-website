/* ============================================================
   bundle.ts: reading back a copy this site wrote.

   `DIET.md` section 26: "The importer reads the exporter's
   format, so this tool can be left and returned to, which is the
   only real test of whether an export is honest."

   `aab/src/account-page.ts` writes that copy: one JSON file with
   the profile, the progress, the library, the targets, the
   scenarios and the diet tool's six tables in it. Until this
   file existed the importer read CSV and nothing else, so a
   reader could take their whole account away and had no way to
   bring any of it back. An export nothing can read is a promise
   about leaving that has never been tested.

   ---- what comes back, and why not the other four ----

   `diet_days` and `diet_entries`, and those two because they are
   the two tables in the schema that carry an `origin` column.
   That is not a coincidence and it is not a shortcut: section 26
   requires that "a bad import is undone as one operation rather
   than three hundred", and `origin` is the only thing that makes
   that possible. A table with no `origin` is a table this cannot
   offer to undo, so it is named rather than written.

   `diet_profile` is the one that would still be refused if it
   had the column. It is a single row holding a reader's height,
   their medicines and whether they track a cycle, and writing a
   file over it is destructive in the one direction nobody
   notices: everything still renders, with somebody else's body
   in it.

   ---- and it never trusts the file's ids ----

   A copy carries the `user_id` it was taken under. Written back
   unchanged into another account it is refused by row level
   security, silently, and the page reports a successful import
   of nothing. The caller stamps its own reader on every row, so
   nothing here reads `user_id` at all: it is dropped on the way
   through rather than corrected, because a field that is never
   carried cannot be carried wrongly.
   ============================================================ */

import type { Day, Entry } from "./diet.ts";

/** Rows as they come out of the file: a database row, so snake
    case, and every value is whatever JSON held. */
type Raw = Record<string, unknown>;

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

const num = (v: unknown): number | undefined => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const list = (v: unknown): string[] | undefined =>
  Array.isArray(v) && v.every((x) => typeof x === "string") && v.length
    ? (v as string[])
    : undefined;

/** Assign only where there is a value. An absent column has to
    stay ABSENT rather than becoming an explicit `undefined`,
    which `JSON.stringify` sends as `null` and which overwrites a
    real value on an upsert. */
const set = <T, K extends keyof T>(row: T, key: K, value: T[K] | undefined): void => {
  if (value !== undefined) row[key] = value;
};

const dict = (v: unknown): Record<string, number> | undefined => {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const out: Record<string, number> = {};
  for (const [k, raw] of Object.entries(v as Raw)) {
    const n = num(raw);
    if (n !== undefined) out[k] = n;
  }
  return Object.keys(out).length ? out : undefined;
};

/** An ISO date and nothing else. A copy is machine written, so
    unlike a CSV there is no day-first or month-first question to
    answer: a value that is not `YYYY-MM-DD` is a file this did
    not write. */
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** A table in the file that is not written back, with the reason
    said out loud. A row silently dropped is the failure the
    preview screen exists to stop. */
export interface Left {
  table: string;
  rows: number;
  why: string;
}

export interface BundleRead {
  /** When the copy was taken, and whose, so the page can say
      before it writes anything. */
  taken?: string;
  account?: { name?: string; email?: string };
  days: Day[];
  entries: Entry[];
  left: Left[];
  /** A row that could not be read, and why. Keyed by its place
      in its own table, because a JSON file has no lines a reader
      can go and look at. */
  skipped: Array<{ line: number; why: string }>;
  from?: string;
  to?: string;
}

/** The four tables a copy holds that this does not bring back.
    Named here rather than at the call site so the page and the
    test read the same sentences. */
const WHY_NOT: Record<string, string> = {
  diet_profile:
    "your own height, weight, medicines and settings. Writing a file over"
    + " those is the one change nothing on the page would look wrong after,"
    + " so it is never done from a file.",
  diet_foods:
    "the dishes and pots you built. They carry no origin, so an import of"
    + " them could not be undone in one go, and a half undone library is"
    + " worse than none.",
  diet_phases:
    "the protocols you ran. Same reason: no origin, so no undo.",
  diet_labs:
    "your clinic numbers. Same reason: no origin, so no undo.",
};

/** Read a copy, and COMMIT NOTHING.

    A string rather than a parsed object, so every way the file
    can be wrong is answered in one place: not JSON at all, JSON
    that is not one of ours, and ours with nothing in it. */
export function readBundle(text: string): BundleRead | { why: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { why: "that file is not JSON. A copy of your account is a .json file." };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { why: "that file is JSON but not a copy of an account." };
  }

  const top = parsed as Raw;
  const diet = top.diet;
  if (!diet || typeof diet !== "object" || Array.isArray(diet)) {
    return {
      why: "that copy has no diet in it. A copy taken from this site holds a"
        + " `diet` section with six tables under it.",
    };
  }
  const tables = diet as Record<string, unknown>;

  const skipped: BundleRead["skipped"] = [];
  const left: Left[] = [];
  for (const [table, why] of Object.entries(WHY_NOT)) {
    const rows = tables[table];
    if (Array.isArray(rows) && rows.length) left.push({ table, rows: rows.length, why });
  }

  const days: Day[] = [];
  const dayRows = Array.isArray(tables.diet_days) ? (tables.diet_days as Raw[]) : [];
  dayRows.forEach((r, i) => {
    const date = str(r.entry_date);
    if (!date || !ISO.test(date)) {
      skipped.push({ line: i + 1, why: "no entry_date this can read" });
      return;
    }
    const day: Day = { date };
    set(day, "weightKg", num(r.weight_kg));
    set(day, "kcal", num(r.kcal));
    set(day, "proteinG", num(r.protein_g));
    set(day, "carbsG", num(r.carbs_g));
    set(day, "fatG", num(r.fat_g));
    set(day, "fibreG", num(r.fibre_g));
    set(day, "sodiumMg", num(r.sodium_mg));
    set(day, "ketonesMmol", num(r.ketones_mmol));
    set(day, "steps", num(r.steps));
    set(day, "sleepHours", num(r.sleep_hours));
    set(day, "waterMl", num(r.water_ml));
    set(day, "hunger", num(r.hunger));
    set(day, "waistCm", num(r.waist_cm));
    set(day, "hipCm", num(r.hip_cm));
    set(day, "neckCm", num(r.neck_cm));
    set(day, "chestCm", num(r.chest_cm));
    set(day, "thighCm", num(r.thigh_cm));
    set(day, "armCm", num(r.arm_cm));
    set(day, "marks", list(r.marks));
    set(day, "tags", list(r.tags));
    set(day, "note", str(r.note));
    days.push(day);
  });

  const entries: Entry[] = [];
  const entryRows = Array.isArray(tables.diet_entries) ? (tables.diet_entries as Raw[]) : [];
  entryRows.forEach((r, i) => {
    const date = str(r.entry_date);
    const label = str(r.label);
    if (!date || !ISO.test(date)) {
      skipped.push({ line: i + 1, why: "an entry with no entry_date this can read" });
      return;
    }
    /* `label` is `not null` in the schema, so a row without one
       came from something that is not this site's export. */
    if (!label) {
      skipped.push({ line: i + 1, why: "an entry with no label, which this site never writes" });
      return;
    }
    /* THE ID IS NOT CARRIED. A copy's row ids belong to the
       account it was taken from, and reusing one either collides
       with a live row or resurrects a deleted one. The database
       mints a fresh id, which is what makes re-importing the
       same file twice add rows rather than corrupt them. */
    const entry: Entry = { date, label };
    set(entry, "meal", str(r.meal));
    set(entry, "atTime", str(r.at_time)?.slice(0, 5));
    set(entry, "labelBn", str(r.label_bn));
    set(entry, "qty", num(r.qty));
    set(entry, "unit", str(r.unit));
    set(entry, "kcal", num(r.kcal));
    set(entry, "macros", dict(r.macros));
    set(entry, "micros", dict(r.micros));
    set(entry, "estLow", num(r.est_low));
    set(entry, "estHigh", num(r.est_high));
    set(entry, "planned", r.planned === true ? true : undefined);
    set(entry, "source", str(r.source));
    set(entry, "sourceId", str(r.source_id));
    entries.push(entry);
  });

  if (!days.length && !entries.length) {
    return {
      why: left.length
        ? "that copy holds no days and no meals, only tables this cannot bring back."
        : "that copy has a diet section with nothing in it.",
    };
  }

  /* The span, for the same reason the CSV preview prints one: a
     file that reads as 1970 is a file that was misread, and it
     is visible in two dates where it is invisible in four
     hundred rows. */
  const dates = [...days.map((d) => d.date), ...entries.map((e) => e.date)].sort();

  const who = top.account;
  return {
    taken: str(top.taken),
    account: who && typeof who === "object" && !Array.isArray(who)
      ? { name: str((who as Raw).name), email: str((who as Raw).email) }
      : undefined,
    days,
    entries,
    left,
    skipped,
    from: dates[0],
    to: dates[dates.length - 1],
  };
}

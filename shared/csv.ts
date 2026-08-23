/* ============================================================
   csv.ts: a file somebody exported from another app, read.

   `DIET.md` section 26. "Leaving should be as easy as arriving"
   is already this site's rule about accounts, and THE REVERSE IS
   WHAT STOPS SOMEBODY ARRIVING AT ALL: a reader with three years
   of data elsewhere is being asked to abandon it.

   MyFitnessPal, Cronometer and LoseIt all export CSV. Apple
   Health and Google Fit export weight. A Withings, Renpho or
   Xiaomi scale exports a file of readings. Anything else is a
   file, a preview of the first rows, and a screen that maps
   columns to fields.

   ---- the preview screen is the whole feature ----

   An importer that guesses silently is an importer that fills a
   year of somebody's history with the wrong column, and the
   reader finds out in March. So NOTHING HERE COMMITS ANYTHING.
   It parses, it guesses a mapping, it says which guesses it made
   and how confident it is, and it hands back rows for a person
   to look at. The writing is somewhere else.

   ---- and it is here rather than in the browser ----

   `shared/` is for what more than one runtime must say the same
   way. This is arithmetic over text with no DOM in it, which
   makes it testable under plain node, and a parser that can only
   be exercised by clicking is a parser nobody exercises.
   ============================================================ */

/** One row, already split. Values are strings because that is
    what a CSV holds: turning them into numbers is the mapping's
    job and it may fail, which is a thing the preview has to be
    able to show. */
export type Row = string[];

export interface Sheet {
  header: Row;
  rows: Row[];
  /** What could not be read, with the line it was on. A file
      that is half readable is worth importing half of, and a
      reader has to be told which half. */
  skipped: Array<{ line: number; why: string }>;
}

/** RFC 4180 enough for the files these apps actually write.

    Quoted fields, doubled quotes inside them, commas and
    newlines inside quotes, and a BOM at the front because
    Windows exports carry one and an unstripped BOM turns the
    first column name into something no mapping will match. */
export function parseCSV(text: string, sep = ","): Sheet {
  const clean = text.replace(/^﻿/, "");
  const rows: Row[] = [];
  const skipped: Sheet["skipped"] = [];
  let field = "";
  let row: Row = [];
  let quoted = false;
  let line = 1;

  const endField = (): void => { row.push(field); field = ""; };
  const endRow = (): void => {
    endField();
    /* A trailing newline makes one empty row at the end of every
       file ever exported. It is not a row and not an error. */
    if (row.length > 1 || row[0] !== "") rows.push(row);
    row = [];
  };

  for (let i = 0; i < clean.length; i += 1) {
    const c = clean[i];
    if (quoted) {
      if (c === '"') {
        if (clean[i + 1] === '"') { field += '"'; i += 1; continue; }
        quoted = false;
        continue;
      }
      if (c === "\n") line += 1;
      field += c;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === sep) { endField(); continue; }
    if (c === "\r") continue;
    if (c === "\n") { endRow(); line += 1; continue; }
    field += c;
  }
  if (field !== "" || row.length) endRow();

  if (quoted) skipped.push({ line, why: "a quote was opened and never closed" });
  if (!rows.length) return { header: [], rows: [], skipped };

  const header = rows[0].map((h) => h.trim());
  const width = header.length;
  const body: Row[] = [];
  rows.slice(1).forEach((r, i) => {
    /* A row with the wrong number of fields is a row whose
       columns do not mean what the header says, and importing it
       would put a weight in the calories column. */
    if (r.length !== width) {
      skipped.push({ line: i + 2, why: `${r.length} fields where the header has ${width}` });
      return;
    }
    body.push(r);
  });
  return { header, rows: body, skipped };
}

/** Which of this tool's fields a column could be. */
export type Field =
  | "date" | "weightKg" | "kcal"
  | "proteinG" | "carbsG" | "fatG" | "fibreG"
  | "steps" | "waterMl" | "sleepHours" | "note"
  | "ignore";

/** What the exporters actually call their columns.

    Read rather than guessed at: these are the header rows of a
    MyFitnessPal weight export, a Cronometer daily summary, a
    LoseIt export, and the CSVs a Withings, Renpho or Xiaomi
    scale writes. Lowercased and stripped of punctuation before
    matching, so "Weight (kg)" and "weight_kg" are one entry. */
const NAMES: Record<Exclude<Field, "ignore">, string[]> = {
  date: ["date", "day", "time", "datetime", "recorded", "logged", "start"],
  weightKg: ["weight", "weightkg", "weightkilograms", "mass", "bodyweight"],
  kcal: ["calories", "energy", "kcal", "energykcal", "caloriesconsumed"],
  proteinG: ["protein", "proteing"],
  carbsG: ["carbs", "carbohydrates", "carbohydrate", "netcarbs", "carbsg"],
  fatG: ["fat", "fatg", "totalfat"],
  fibreG: ["fiber", "fibre", "fiberg", "fibreg"],
  steps: ["steps", "stepcount", "stepstaken"],
  waterMl: ["water", "waterml", "waterintake"],
  sleepHours: ["sleep", "sleephours", "hoursslept", "timeasleep"],
  note: ["note", "notes", "comment", "comments"],
};

const flatten = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** A guess at what each column is, with how sure it is.

    `exact` where the flattened name is one this tool knows,
    `loose` where it merely contains one, and null where it does
    not. THE PREVIEW SHOWS THE DIFFERENCE, because a loose match
    on "weight goal" is exactly the column that would fill a year
    of somebody's history with a number they never weighed. */
export interface Guess {
  field: Field;
  how: "exact" | "loose" | "none";
}

export function guessColumns(header: Row): Guess[] {
  const used = new Set<Field>();
  const first: Guess[] = header.map((h) => {
    const flat = flatten(h);
    for (const [field, names] of Object.entries(NAMES) as Array<[Field, string[]]>) {
      if (names.includes(flat)) return { field, how: "exact" as const };
    }
    return { field: "ignore" as const, how: "none" as const };
  });

  /* A loose pass, and only over columns the exact pass did not
     claim: "weight" beating "weight goal" is the whole reason
     the two passes are separate. */
  first.forEach((g) => { if (g.how === "exact") used.add(g.field); });
  return first.map((g, i) => {
    if (g.how === "exact") return g;
    const flat = flatten(header[i]);
    for (const [field, names] of Object.entries(NAMES) as Array<[Field, string[]]>) {
      if (used.has(field)) continue;
      if (names.some((n) => flat.includes(n))) {
        used.add(field);
        return { field, how: "loose" as const };
      }
    }
    return g;
  });
}

/** A date, in whatever the exporter felt like writing.

    ISO first because it is unambiguous, then the two ordinary
    orders. **A slash date with both parts under 13 is refused**,
    because 03/04 is the third of April or the fourth of March
    and there is no way to tell: an importer that picks one fills
    a year with dates that are silently a month out, which is the
    failure this whole file is arranged against. */
export function readDate(raw: string): { iso: string } | { why: string } {
  const s = raw.trim();
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
  if (iso) {
    const [, y, m, d] = iso;
    return { iso: `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` };
  }
  const slash = /^(\d{1,2})[/.](\d{1,2})[/.](\d{4})/.exec(s);
  if (slash) {
    const [, a, b, y] = slash;
    const na = Number(a), nb = Number(b);
    if (na > 12 && nb <= 12) {
      return { iso: `${y}-${String(nb).padStart(2, "0")}-${String(na).padStart(2, "0")}` };
    }
    if (nb > 12 && na <= 12) {
      return { iso: `${y}-${String(na).padStart(2, "0")}-${String(nb).padStart(2, "0")}` };
    }
    return { why: `${s} is either day first or month first and nothing in the file says which` };
  }
  return { why: `${s} is not a date this can read` };
}

export interface Reading {
  date: string;
  weightKg?: number;
  kcal?: number;
  proteinG?: number; carbsG?: number; fatG?: number; fibreG?: number;
  steps?: number; waterMl?: number; sleepHours?: number;
  note?: string;
}

export interface Preview {
  /** What would be written, in file order. */
  rows: Reading[];
  /** What would not be, and why, with the line. */
  skipped: Array<{ line: number; why: string }>;
  /** The span, so a reader can see at a glance whether the
      dates came out plausible. A file that reads as 1970 is a
      file whose date column was misread. */
  from?: string;
  to?: string;
}

/** Read a sheet through a mapping, and COMMIT NOTHING.

    Pounds are converted where the header says so, because a
    weight column labelled "lbs" written into a kilogram field is
    the same class of error as a misread date and is likelier. */
export function preview(sheet: Sheet, mapping: Field[]): Preview {
  const rows: Reading[] = [];
  const skipped = [...sheet.skipped];
  const dateAt = mapping.indexOf("date");
  const lbs = dateAt >= 0
    && mapping.some((f, i) => f === "weightKg" && /lb|pound/i.test(sheet.header[i]));

  if (dateAt < 0) {
    return { rows: [], skipped: [{ line: 1, why: "no column is mapped to a date" }] };
  }

  sheet.rows.forEach((r, i) => {
    const line = i + 2;
    const when = readDate(r[dateAt] ?? "");
    if ("why" in when) { skipped.push({ line, why: when.why }); return; }

    const out: Reading = { date: when.iso };
    let held = false;
    mapping.forEach((field, col) => {
      if (field === "ignore" || field === "date") return;
      const raw = (r[col] ?? "").trim();
      if (!raw) return;
      if (field === "note") { out.note = raw; held = true; return; }
      const n = Number(raw.replace(/,/g, ""));
      if (!Number.isFinite(n) || n <= 0) return;
      out[field] = field === "weightKg" && lbs ? n * 0.45359237 : n;
      held = true;
    });

    /* A row with a date and nothing else is a day the other app
       had no data for either. */
    if (!held) { skipped.push({ line, why: "a date and no values" }); return; }
    rows.push(out);
  });

  const dates = rows.map((r) => r.date).sort();
  return {
    rows,
    skipped,
    from: dates[0],
    to: dates[dates.length - 1],
  };
}

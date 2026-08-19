/* `/streak.js`: a year of days, and how many of them were active.
   Served at that path and imported at runtime. */

/** Every day the reader opened something, as `YYYY-MM-DD`,
    sorted and deduplicated. An ARRAY: callers count it with
    `.length` and wrap it in a `Set` when they want lookups, and
    this file said `Set` for one commit, which typechecks
    `.length` as an error and `new Set(...)` as pointless. */
export function activeDays(): string[];

/** How many days that set holds inside the last `n`. */
export function daysIn(n: number): number;

/** The current run of consecutive active days. */
export function run(): number;

/** A date as `YYYY-MM-DD`, in the reader's own timezone.
    Defaults to today, and takes any `Date` so a caller drawing a
    year of squares can key each one the same way. */
export function today(at?: Date): string;

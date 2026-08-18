/* `/streak.js`: a year of days, and how many of them were active.
   Served at that path and imported at runtime. */

/** Every day the reader opened something, as `YYYY-MM-DD`. */
export function activeDays(): Set<string>;

/** How many days that set holds inside the last `n`. */
export function daysIn(n: number): number;

/** The current run of consecutive active days. */
export function run(): number;

/** Today, as `YYYY-MM-DD`, in the reader's own timezone. */
export function today(): string;

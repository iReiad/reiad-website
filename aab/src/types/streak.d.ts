/* `/streak.js`, described just enough for the modules that have
   moved. See `content.d.ts` beside it for the arrangement. */

/** Local YYYY-MM-DD, which is what a person means by a date.
    Local and not UTC on purpose: somebody in Dhaka reading at 1am
    has turned up today, by any definition of "today" they would
    use. */
export function today(at?: Date): string;

/** Every day this reader turned up, sorted, without duplicates. */
export function activeDays(): string[];

/** How many of the last `span` days had something on them. */
export function daysIn(span?: number): number;

/** Days in a row, ending today. It exists because "eleven days in
    a row" is a nice thing to be told once on a settings page, not
    because anything should happen when it ends. */
export function run(): number;

export function markToday(): void;
export function initStreak(): void;

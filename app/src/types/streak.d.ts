/** Local YYYY-MM-DD, which is what a person means by a date. */
export declare function today(at?: Date): string;
/** Every day this person has done something, oldest first. */
export declare const activeDays: () => string[];
/** Today, recorded once. Returns whether it was new. */
export declare function markToday(): boolean;
/**
 * How many of the last `span` days had something on them, counted
 * back from today inclusive. Seven is a week the way a person
 * means it: the last seven days, not since Monday.
 */
export declare function daysIn(span?: number): number;
/**
 * Consecutive days up to today, or up to yesterday if today is
 * still empty. Counting from yesterday matters: at nine in the
 * morning a run of eleven days is not over, and telling somebody
 * it has reset before they have had breakfast is just wrong.
 */
export declare function run(): number;
/** Wired once by app.js, on every page, signed in or not. */
export declare function initStreak(): void;

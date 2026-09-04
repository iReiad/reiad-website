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
    data: {
        bands: unknown[];
        tasks: unknown[];
    };
}
/**
 * Today, for somebody whose day ends at `roll` rather than at
 * midnight: marking something at 1am belongs to yesterday.
 * LOCAL time throughout, never UTC: a routine is about the day
 * somebody is living in.
 */
export declare function todayFor(roll?: number, now?: Date): string;
/** `YYYY-MM-DD` in LOCAL time. `toISOString()` is UTC and would
    put anybody east of Greenwich on the wrong day for part of
    every evening, which is most of this site's readers. */
export declare function isoDay(d: Date): string;
/** `n` days either side of a date, as `YYYY-MM-DD`. */
export declare function daysAround(day: string, back: number, forward?: number): string[];
/** The templates the site ships, plus this reader's own. */
export declare function listTemplates(): Promise<TemplateRow[]>;
/** This reader's active routine, or null if they have none yet.

    `limit=1` with an `order`, rather than bare: there is normally
    one, and "whichever the planner reached first" is not an
    answer a page should act on. The lesson is #159's. */
export declare function activeRoutine(): Promise<RoutineRow | null>;
/**
 * Put a routine on this account, copied from a shape.
 *
 * COPIED, always. Editing your routine must never reach back into
 * the template it came from, which is the whole reason
 * `routines` and `routine_templates` are two tables holding the
 * same shape rather than one table with a flag.
 */
export declare function makeRoutine(name: string, shape: {
    bands: unknown[];
    tasks: unknown[];
}): Promise<RoutineRow>;
/** Change the list itself: a renamed task, a new one, an archived
    one, a reordered band. */
export declare function saveRoutine(id: string, patch: Partial<Pick<RoutineRow, "name" | "bands" | "tasks">>): Promise<boolean>;
/** One day, or null if nothing has been marked on it yet.

    Null rather than an empty row, because an empty day and a day
    with nothing marked are the same thing and neither should
    cause a write. A row appears the first time somebody touches
    it. */
export declare function dayEntry(date: string): Promise<EntryRow | null>;
/** Every day in a range, oldest first. The week strip asks for
    seven, the heatmap for eighty-four, and the year page for
    everything. */
export declare function daysBetween(from: string, to: string): Promise<EntryRow[]>;
/**
 * Write a day. ONE ROW PER PERSON PER DAY, so it is an upsert on
 * `(user_id, entry_date)` and saving is one request.
 *
 * `resolution=merge-duplicates` REPLACES the conflicting row, so
 * the caller must pass the WHOLE day as it now stands: sending
 * only `{ marks }` would erase this morning's note and only
 * `{ note }` would erase every tick.
 */
export declare function saveDay(routineId: string, date: string, day: {
    marks: Record<string, number>;
    mood?: string | null;
    note?: string | null;
    chose?: string | null;
}): Promise<EntryRow | null>;
/**
 * How many times a task has EVER been marked. No window, no
 * "recently", no reset: `ROUTINE.md` §0. A `since` argument here
 * would make this a streak.
 */
export declare function everMarked(taskId: string): Promise<number>;
/** Everything a reader has ever written, newest first, for the
    jar and for the reflection log. */
export declare function everyNote(): Promise<EntryRow[]>;

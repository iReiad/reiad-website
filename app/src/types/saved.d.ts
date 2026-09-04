/** What every row of these three tables has in common: it belongs
    to exactly one person and the database stamps when it moved. */
interface Row {
    id: string;
    created_at: string;
    /** Not optional, because every one of these tables declares the
        column `not null` with a default and every SELECT here names
        it. A `?` would be this file hedging about something the
        database does not hedge about. */
    updated_at: string;
}
/** A filled-in calculator under a name. `inputs` is whatever
    shape the tool already had for its own state, which for the
    stock check is `{ query }`: the query string that page has
    shared analyses in since it was written. */
export interface Scenario extends Row {
    tool: string;
    name: string;
    inputs: {
        query?: string;
    } & Record<string, unknown>;
    summary: string;
}
/** A goal with a number on it. The three kinds are three sources
    of progress that already existed; see the migration. */
export type TargetKind = "course" | "habit" | "metric";
export interface Target extends Row {
    kind: TargetKind;
    subject: string;
    label: string;
    target: number;
    reached: number;
    unit: string;
    done_at: string | null;
}
/** A page this reader kept, wrote on, or both. One row per person
    per page: `saved` and `note` are two facts about it rather
    than two kinds of it. */
export interface LibraryRow extends Row {
    url: string;
    title: string;
    kind: "piece" | "lesson";
    saved: boolean;
    note: string;
}
/** Every scenario saved for one calculator, newest first. */
export declare function listScenarios(tool?: string): Promise<Scenario[]>;
/**
 * Save one, and hand the stored row back. `inputs` is whatever
 * shape the calculator already had; the stock check passes its
 * own query string, which is the format it has shared analyses in
 * since it was written, so there is one encoder.
 */
export declare function saveScenario({ tool, name, inputs, summary }: Pick<Scenario, "tool" | "name" | "inputs"> & {
    summary?: string;
}): Promise<Scenario>;
/** Rename, or overwrite the inputs of, one that already exists. */
export declare function updateScenario(id: string, patch: Partial<Scenario>): Promise<boolean>;
export declare function removeScenario(id: string): Promise<boolean>;
export declare const KINDS: readonly ["course", "habit", "metric"];
export declare function listTargets(): Promise<Target[]>;
export declare function saveTarget({ kind, subject, label, target, reached, unit }: Pick<Target, "kind" | "label"> & Partial<Pick<Target, "subject" | "target" | "reached" | "unit">>): Promise<Target>;
export declare function updateTarget(id: string, patch: Partial<Target>): Promise<boolean>;
export declare function removeTarget(id: string): Promise<boolean>;
/** What this account holds about one page, or null.

    Null means the reader has neither kept it nor written on it,
    which is the state nearly every page is in and the reason this
    returns null rather than an empty row: a control that has to
    tell "not kept" from "kept and then unkept" would be a control
    with three states and two of them identical. */
export declare function libraryRow(url: string): Promise<LibraryRow | null>;
/**
 * Write this page's row. An upsert on `(user_id, url)`: one round
 * trip, and it cannot race with the same reader's phone writing
 * the other column. The trigger in the migration removes the row
 * once both facts have gone, so the reading list can be COUNTED
 * rather than filtered.
 */
export declare function keepPage({ url, title, kind, saved, note }: Pick<LibraryRow, "url"> & Partial<Pick<LibraryRow, "title" | "kind" | "saved" | "note">>): Promise<LibraryRow | null>;
/** Everything kept, newest first. `only` narrows it to the
    reading list or to the pages with something written on them,
    which are the two lists the account page draws. */
export declare function listLibrary(only?: "saved" | "notes"): Promise<LibraryRow[]>;
export declare function removeLibraryRow(id: string): Promise<boolean>;
export {};

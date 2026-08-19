declare const VALID: readonly ["learn", "work"];
declare const TRACKS: readonly ["finance", "skills"];
/** Who is reading: someone here to learn, or a recruiter. */
export type Audience = (typeof VALID)[number];
/** Which half of the library a learner came for. */
export type Track = (typeof TRACKS)[number];
export declare const getAudience: () => Audience | null;
export declare const getTrack: () => Track | null;
export declare function setAudience(value: string | undefined, track?: string): void;
export declare function setTrack(track?: string): void;
export declare function clearAudience(): void;
/** As much of one Ctrl+K row as ranking reads. `hint` is
    optional because `SearchEntry` in `shared/content.ts` has it
    optional: a page with no hint is a row with no hint. */
export interface PaletteItem {
    url: string;
    hint?: string;
}
export declare function audienceBoost(item: PaletteItem): number;
/** Menu column order, so the overlay leads with the right half. */
export declare function menuOrder<T extends {
    work?: unknown;
}>(titles: T[]): T[];
export declare function initAudience(): void;
export {};

export declare const PREFS_KEY = "reader-prefs";
/** One option of one preference. `size` and `ch` are the values
    that reach the stylesheet, and they are strings because that
    is what a custom property is: writing `1.12` as a number here
    would be a number this file then had to stringify at the one
    place it is used. */
export interface PrefOption {
    readonly id: string;
    readonly label: string;
    readonly note?: string;
    readonly size?: string;
    readonly ch?: string;
}
export declare const SCALES: readonly [{
    readonly id: "small";
    readonly label: "Compact";
    readonly note: "more on a screen";
    readonly size: "0.94";
}, {
    readonly id: "normal";
    readonly label: "Normal";
    readonly note: "what this site has always been";
    readonly size: "1";
}, {
    readonly id: "large";
    readonly label: "Comfortable";
    readonly note: "easier on the eyes";
    readonly size: "1.12";
}];
export declare const MEASURES: readonly [{
    readonly id: "narrow";
    readonly label: "Narrow";
    readonly note: "about 56 characters";
    readonly ch: "56ch";
}, {
    readonly id: "normal";
    readonly label: "Normal";
    readonly note: "about 66 characters";
    readonly ch: "66ch";
}, {
    readonly id: "wide";
    readonly label: "Wide";
    readonly note: "about 78 characters";
    readonly ch: "78ch";
}];
export declare const THEMES: readonly [{
    readonly id: "system";
    readonly label: "Follow my system";
}, {
    readonly id: "light";
    readonly label: "Always light";
}, {
    readonly id: "dark";
    readonly label: "Always dark";
}];
export declare const LANGS: readonly [{
    readonly id: "bn";
    readonly label: "বাংলা";
    readonly note: "the calculators open in Bangla";
}, {
    readonly id: "en";
    readonly label: "English";
    readonly note: "the calculators open in English";
}];
export type Scale = (typeof SCALES)[number]["id"];
export type Measure = (typeof MEASURES)[number]["id"];
export type Theme = (typeof THEMES)[number]["id"];
export type Lang = (typeof LANGS)[number]["id"];
export interface Prefs {
    text: Scale;
    measure: Measure;
    theme: Theme;
    lang: Lang;
}
/** What this device holds, with anything unrecognised replaced.

    Filtering on read rather than migrating on write, which is the
    rule `next/lib/progress.ts` states for ticks and holds for the
    same reason: it needs no version flag, cannot half-run, and
    fixes a device the first time it is opened. A preference that
    arrived from a newer version of this file, or from somebody
    editing localStorage, is simply not one of the options. */
export declare function readPrefs(): Prefs;
/**
 * Write some of them, apply them, and say so.
 *
 * `ts` is what makes this key reconcilable: `aab/sync.js` files
 * it under the `mark` rule, which takes the newer of two devices
 * by the timestamp it already carries. A set could not be used
 * here, because changing a preference is a replacement rather
 * than an addition, and "the union of two devices' text sizes" is
 * not a size.
 */
export declare function savePrefs(patch: Partial<Prefs>): Prefs;
export declare function applyPrefs(prefs?: Prefs): void;

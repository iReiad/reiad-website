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
    /** The multiplier on `--measure-base`, which is per script. Not
        a width: see MEASURES. */
    readonly wide?: string;
    /** The multiplier on every blur radius. */
    readonly amount?: string;
    /** The alpha of the tint over the blur. */
    readonly alpha?: string;
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
    readonly note: "about 9 words a line";
    readonly wide: "0.85";
}, {
    readonly id: "normal";
    readonly label: "Normal";
    readonly note: "about 11 words a line";
    readonly wide: "1";
}, {
    readonly id: "wide";
    readonly label: "Wide";
    readonly note: "about 13 words a line";
    readonly wide: "1.18";
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
export declare const GLASSES: readonly [{
    readonly id: "frost";
    readonly label: "Frost";
    readonly note: "cold, and you see a long way through";
}, {
    readonly id: "paper";
    readonly label: "Paper";
    readonly note: "a wove tooth, laid lines, and the way the pulp fell";
}, {
    readonly id: "thin-reed";
    readonly label: "Thin reed";
    readonly note: "narrow ridges, the quietest of the nine";
}, {
    readonly id: "linear-ridge";
    readonly label: "Linear ridge";
    readonly note: "the same ridge, broader and deeper";
}, {
    readonly id: "crossed-reed";
    readonly label: "Crossed reed";
    readonly note: "reeded both ways, into pillows";
}, {
    readonly id: "deep-flute";
    readonly label: "Deep flute";
    readonly note: "channels cut in, so the light runs the other way up";
}, {
    readonly id: "aquatex";
    readonly label: "Aquatex";
    readonly note: "rain standing on the glass";
}, {
    readonly id: "arctic-ice";
    readonly label: "Arctic ice";
    readonly note: "facets, and no two of them the same";
}, {
    readonly id: "callisto";
    readonly label: "Callisto";
    readonly note: "a fine ripple with no centre to it";
}, {
    readonly id: "champagne";
    readonly label: "Champagne";
    readonly note: "bubbles, sparse, rising";
}, {
    readonly id: "eurodrop";
    readonly label: "Eurodrop";
    readonly note: "drops, lit on top and shaded under";
}, {
    readonly id: "plain";
    readonly label: "Plain";
    readonly note: "no blur at all, solid grounds";
}];
export declare const BLURS: readonly [{
    readonly id: "soft";
    readonly label: "Soft";
    readonly note: "barely there";
    readonly amount: "0.55";
}, {
    readonly id: "normal";
    readonly label: "Normal";
    readonly note: "what this site has always been";
    readonly amount: "1";
}, {
    readonly id: "deep";
    readonly label: "Deep";
    readonly note: "properly frosted";
    readonly amount: "1.7";
}];
export declare const TEXTURES: readonly [{
    readonly id: "faint";
    readonly label: "Faint";
    readonly note: "barely a tooth";
    readonly amount: "0.5";
}, {
    readonly id: "normal";
    readonly label: "Normal";
    readonly note: "the finish as it is cast";
    readonly amount: "1";
}, {
    readonly id: "strong";
    readonly label: "Strong";
    readonly note: "you can feel it";
    readonly amount: "1.6";
}];
export declare const VEILS: readonly [{
    readonly id: "clear";
    readonly label: "Clear";
    readonly note: "the page shows through";
    readonly alpha: "0.54";
}, {
    readonly id: "normal";
    readonly label: "Normal";
    readonly note: "what this site has always been";
    readonly alpha: "0.72";
}, {
    readonly id: "dense";
    readonly label: "Dense";
    readonly note: "quieter behind the words";
    readonly alpha: "0.9";
}];
export declare const SOUNDS: readonly [{
    readonly id: "on";
    readonly label: "On";
    readonly note: "a quiet note when something finishes";
}, {
    readonly id: "off";
    readonly label: "Off";
    readonly note: "the site is silent";
}];
export declare const DEPTHS: readonly [{
    readonly id: "quick";
    readonly label: "The main numbers";
    readonly note: "eleven figures, the rest assumed";
}, {
    readonly id: "all";
    readonly label: "Everything";
    readonly note: "every field the model reads";
}];
export declare const WEATHERS: readonly [{
    readonly id: "on";
    readonly label: "On";
    readonly note: "the sky where you are, on the page";
}, {
    readonly id: "off";
    readonly label: "Off";
    readonly note: "nothing, whatever the weather";
}];
export type Scale = (typeof SCALES)[number]["id"];
export type Measure = (typeof MEASURES)[number]["id"];
export type Theme = (typeof THEMES)[number]["id"];
export type Lang = (typeof LANGS)[number]["id"];
export type Glass = (typeof GLASSES)[number]["id"];
export type Blur = (typeof BLURS)[number]["id"];
export type Texture = (typeof TEXTURES)[number]["id"];
export type Veil = (typeof VEILS)[number]["id"];
export type Sound = (typeof SOUNDS)[number]["id"];
export type Weather = (typeof WEATHERS)[number]["id"];
export type Depth = (typeof DEPTHS)[number]["id"];
export interface Prefs {
    text: Scale;
    measure: Measure;
    theme: Theme;
    lang: Lang;
    glass: Glass;
    blur: Blur;
    texture: Texture;
    veil: Veil;
    sound: Sound;
    weather: Weather;
    depth: Depth;
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

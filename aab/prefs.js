/* prefs.ts: how this reader wants to be read to. Text size,
   measure, theme, which language the calculators open in, and
   how many of a calculator's fields they are asked to fill.
   The account is the record and is still not what a page READS: a
   preference has to be applied before the first paint, and
   nothing involving a network can be. So the browser holds a
   copy, the boot script in `shell.tsx` reads it synchronously,
   and `sync.js` carries the key. Signed out it is local. */
/* One key, holding all of them, because they are read together on
   every page and five keys would be five reads in a blocking
   inline script. `theme` is the exception and stays its own key:
   `/app.js` has written it since 2025, the boot script has read
   it for as long, and CLAUDE.md is unambiguous about renaming a
   key somebody's browser already holds. */
export const PREFS_KEY = "reader-prefs";
export const SCALES = [
    { id: "small", label: "Compact", note: "more on a screen", size: "0.94" },
    { id: "normal", label: "Normal", note: "what this site has always been", size: "1" },
    { id: "large", label: "Comfortable", note: "easier on the eyes", size: "1.12" },
];
/* A STEP, NOT A WIDTH, and the note counts WORDS. `ch` is the
   width of the "0" glyph, so a character count cannot be true in
   a site written in two scripts: measured, `66ch` delivered 78
   characters of English and 116 of Bangla. The value is a
   multiplier on `--measure-base`, which the stylesheet sets per
   script, so one control moves both and nothing here has to know
   which page it is on. `next/reading.test.ts` measures all six
   combinations and fails if a note stops being true. */
export const MEASURES = [
    { id: "narrow", label: "Narrow", note: "about 9 words a line", wide: "0.85" },
    { id: "normal", label: "Normal", note: "about 11 words a line", wide: "1" },
    { id: "wide", label: "Wide", note: "about 13 words a line", wide: "1.18" },
];
export const THEMES = [
    { id: "system", label: "Follow my system" },
    { id: "light", label: "Always light" },
    { id: "dark", label: "Always dark" },
];
export const LANGS = [
    { id: "bn", label: "বাংলা", note: "the calculators open in Bangla" },
    { id: "en", label: "English", note: "the calculators open in English" },
];
/* HOW MUCH OF A CALCULATOR A READER FILLS IN. The stock check
   reads eighty-five inputs; `quick` shows eleven and leaves the
   rest at the sector's typical figures, which is the same model
   against an assumed background and the page says so. It is here
   rather than in the calculator's own storage so that it travels
   with the account like every other preference. */
export const DEPTHS = [
    { id: "quick", label: "The main numbers", note: "eleven figures, the rest assumed" },
    { id: "all", label: "Everything", note: "every field the model reads" },
];
const DEFAULTS = {
    text: "normal", measure: "normal", lang: "bn",
    depth: "quick",
};
const known = (list, value, fallback) => (list.some((x) => x.id === value) ? value : fallback);
/* ============================================================
   Reading and writing
   ============================================================ */
/** What this device holds, with anything unrecognised replaced.

    Filtering on read rather than migrating on write, which is the
    rule `next/lib/progress.ts` states for ticks and holds for the
    same reason: it needs no version flag, cannot half-run, and
    fixes a device the first time it is opened. A preference that
    arrived from a newer version of this file, or from somebody
    editing localStorage, is simply not one of the options. */
export function readPrefs() {
    let stored = {};
    try {
        stored = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") || {};
    }
    catch {
        stored = {};
    }
    return {
        text: known(SCALES, stored.text, DEFAULTS.text),
        measure: known(MEASURES, stored.measure, DEFAULTS.measure),
        lang: known(LANGS, stored.lang, DEFAULTS.lang),
        depth: known(DEPTHS, stored.depth, DEFAULTS.depth),
        /* Not stored here, and read from where it has always lived so
           that this file and `/app.js` cannot disagree about it. */
        theme: readTheme(),
    };
}
function readTheme() {
    try {
        const t = localStorage.getItem("theme");
        return t === "dark" || t === "light" ? t : "system";
    }
    catch {
        return "system";
    }
}
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
export function savePrefs(patch) {
    const next = { ...readPrefs(), ...patch };
    /* The tools' own key, written here so that one choice is one
       choice. `stock.js` reads it before its first render and has
       since long before there were accounts, so this needs nothing
       of that file and cannot drift from it: there is one key. */
    if (patch.lang !== undefined) {
        try {
            localStorage.setItem("tool-lang", next.lang);
        }
        catch { /* private mode */ }
    }
    /* The same arrangement one field along: `stock.js` reads
       `tool-depth` before its first render, which is a string
       comparison rather than a JSON parse, and this is the only
       place that writes it. */
    if (patch.depth !== undefined) {
        try {
            localStorage.setItem("tool-depth", next.depth);
        }
        catch { /* private mode */ }
    }
    if (patch.theme !== undefined) {
        try {
            if (next.theme === "system")
                localStorage.removeItem("theme");
            else
                localStorage.setItem("theme", next.theme);
        }
        catch { /* private mode: it holds for this page */ }
    }
    /* SPREAD, never a field list: naming fields by hand looks
       identical on the day it is written and silently drops
       whatever is added later. `theme` is the one exclusion,
       because it lives under its own key, written above. */
    const { theme: _theme, ...device } = next;
    try {
        localStorage.setItem(PREFS_KEY, JSON.stringify({ ...device, ts: Date.now() }));
    }
    catch { /* private mode */ }
    applyPrefs(next);
    dispatchEvent(new CustomEvent("prefs:changed", { detail: next }));
    return next;
}
/* Putting them on the page: custom properties and attributes on
   <html>, and NOTHING HERE TOUCHES AN ELEMENT. A preference that
   walked the DOM would be wrong on anything rendered after it
   ran, and the boot script that runs before the first paint has
   no DOM to walk. `next/components/shell.tsx` carries the same
   two tables inline for that paint, and `scripts/check-prefs.ts`
   holds the copies to the same values. */
export function applyPrefs(prefs = readPrefs()) {
    const root = document.documentElement;
    const scale = SCALES.find((s) => s.id === prefs.text) ?? SCALES[1];
    const measure = MEASURES.find((m) => m.id === prefs.measure) ?? MEASURES[1];
    root.style.setProperty("--read-scale", scale.size);
    root.style.setProperty("--read-wide", measure.wide);
    if (prefs.theme === "light" || prefs.theme === "dark") {
        root.setAttribute("data-theme", prefs.theme);
    }
    else {
        root.removeAttribute("data-theme");
    }
}
/* A change arriving from another device through sync.js, or from
   the account page in another tab. The event is the one sync.js
   announces for this key. */
addEventListener("prefs:sync", () => applyPrefs(), { passive: true });
/* And on load, for the six pages that are files rather than
   routes and therefore have no boot script of the shell's. It is
   a no-op everywhere else: the boot script has already set the
   same values, so nothing moves. */
applyPrefs();

/* ============================================================
   prefs.ts: how this reader wants to be read to.

   Four settings, and every one of them has to pass the same test
   the account page's three questions pass: it changes something
   the reader can point at, on every page, immediately.

     text     the body size of an article. Three steps, and the
              middle one is what the site has always been.
     measure  how wide a line of prose runs. The single biggest
              lever on whether long-form Bangla is comfortable,
              and the one nobody can set in a browser.
     theme    light, dark, or whatever the system says. It was
              already stored under `theme` by /app.js; this is
              the same key, read by the same boot script, now
              carried between devices as well.
     lang     which language the calculators open in. Named for
              exactly what it does rather than for what it sounds
              like it might do: this site is Bangla-first
              everywhere and a preference that turned that off
              would be a preference against the point of it. The
              tools are the one place with a real switch, they
              have stored `tool-lang` since long before accounts,
              and this writes that same key so the choice is the
              same on every device.

   ---- why the account is not the source ----

   It is the record, like everything else since the sync rewrite,
   and it is still not what a page READS. A preference has to be
   applied before the first paint or the reader watches the page
   resize itself, and nothing that involves a network can happen
   before the first paint. So the shape is the same one the whole
   site uses: the browser holds a copy, the boot script in
   `next/components/shell.tsx` reads it synchronously, and
   `aab/sync.js` carries the key so the copy is the account's.

   Signed out it is simply a local preference, which is what it
   was before this file existed, and every page still works.
   ============================================================ */
/* One key, holding all four, because they are read together on
   every page and four keys would be four reads in a blocking
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
/* The middle one is the `--measure` this site has always used,
   which is why it is 66 and not a round number: the two either
   side are steps away from what is already there rather than a
   scale invented around it. */
export const MEASURES = [
    { id: "narrow", label: "Narrow", note: "about 56 characters", ch: "56ch" },
    { id: "normal", label: "Normal", note: "about 66 characters", ch: "66ch" },
    { id: "wide", label: "Wide", note: "about 78 characters", ch: "78ch" },
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
const DEFAULTS = { text: "normal", measure: "normal", lang: "bn" };
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
    if (patch.theme !== undefined) {
        try {
            if (next.theme === "system")
                localStorage.removeItem("theme");
            else
                localStorage.setItem("theme", next.theme);
        }
        catch { /* private mode: it holds for this page */ }
    }
    try {
        localStorage.setItem(PREFS_KEY, JSON.stringify({
            text: next.text, measure: next.measure, lang: next.lang, ts: Date.now(),
        }));
    }
    catch { /* private mode */ }
    applyPrefs(next);
    dispatchEvent(new CustomEvent("prefs:changed", { detail: next }));
    return next;
}
/* ============================================================
   Putting them on the page

   Two custom properties on <html>, and the stylesheet answers.
   Nothing here touches an element: a preference that had to walk
   the DOM would be a preference that is wrong on anything
   rendered after it ran, and the boot script that runs before the
   first paint could not walk one anyway.
   ============================================================ */
export function applyPrefs(prefs = readPrefs()) {
    const root = document.documentElement;
    const scale = SCALES.find((s) => s.id === prefs.text) ?? SCALES[1];
    const measure = MEASURES.find((m) => m.id === prefs.measure) ?? MEASURES[1];
    root.style.setProperty("--read-scale", scale.size);
    root.style.setProperty("--read-measure", measure.ch);
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
   same three values, so nothing moves. */
applyPrefs();

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
     glass    what the site's translucent surfaces are made of.
              Three finishes, and `plain` is the honest name for
              off: no blur, solid grounds, which is also what a
              browser with no `backdrop-filter` and a reader who
              has asked for reduced transparency both get.
     blur     how far through those surfaces you can see. A
              multiplier on every radius rather than a radius, so
              one step moves the whole site together and the top
              bar stays thicker than a chip.
     veil     how much tint sits over the blur. The two are a
              pair: a reader who wants to see the page moving
              under the bar turns the veil down, and one who finds
              that busy turns it up.
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
/* ============================================================
   Glass

   ELEVEN FINISHES, NOT ELEVEN BLURS. What separates them is what
   the surface is MADE of, and the two sliders below then move
   whichever one is on.

   Nine of them are cast glass and the names are the trade's own.
   The distinction that runs through them is the one the design
   system already makes between a plate and a groove: REEDING is a
   run of convex ridges and FLUTING is a run of concave channels,
   so a reed is lit on the flank nearest the light and a flute on
   the wall furthest from it.

   Two are not glass. `paper` is the site's own sheet, rebuilt: it
   was two hairlines crossing at 45 degrees every five pixels,
   which is a fabric at an angle no paper-making process produces
   and a lattice the eye finds in about a second. It is a wove
   tooth, laid lines and the cloudiness a sheet has from the way
   the pulp fell.

   `plain` is the one to keep working. It is what a browser with
   no `backdrop-filter` gets, what `prefers-reduced-transparency`
   gets, and what anybody who finds moving text under a bar hard
   to read chooses. So it is a real finish with its own solid
   grounds rather than the others with a feature switched off.

   ---- adding one is three places and a check ----

   Here, a `[data-glass="<id>"]` block in `next/styles/site.css`,
   and the whitelist in the boot script in
   `next/components/shell.tsx`. `scripts/check-glass.ts` fails if
   the three stop being the same set, because each way of getting
   it wrong is silent in its own way: a finish offered and never
   drawn, a finish drawn and never offered, and a finish the boot
   script throws away before the first paint.
   ============================================================ */
export const GLASSES = [
    { id: "frost", label: "Frost", note: "cold, and you see a long way through" },
    { id: "paper", label: "Paper", note: "a wove tooth, laid lines, and the way the pulp fell" },
    { id: "thin-reed", label: "Thin reed", note: "narrow ridges, the quietest of the nine" },
    { id: "linear-ridge", label: "Linear ridge", note: "the same ridge, broader and deeper" },
    { id: "crossed-reed", label: "Crossed reed", note: "reeded both ways, into pillows" },
    { id: "deep-flute", label: "Deep flute", note: "channels cut in, so the light runs the other way up" },
    { id: "aquatex", label: "Aquatex", note: "rain standing on the glass" },
    { id: "arctic-ice", label: "Arctic ice", note: "facets, and no two of them the same" },
    { id: "callisto", label: "Callisto", note: "a fine ripple with no centre to it" },
    { id: "champagne", label: "Champagne", note: "bubbles, sparse, rising" },
    { id: "eurodrop", label: "Eurodrop", note: "drops, lit on top and shaded under" },
    { id: "plain", label: "Plain", note: "no blur at all, solid grounds" },
];
/* A multiplier rather than a radius, so one step moves every
   surface together and the top bar stays thicker than a chip.
   `--glass-r` in the stylesheet is what it multiplies. */
export const BLURS = [
    { id: "soft", label: "Soft", note: "barely there", amount: "0.55" },
    { id: "normal", label: "Normal", note: "what this site has always been", amount: "1" },
    { id: "deep", label: "Deep", note: "properly frosted", amount: "1.7" },
];
/* The middle one is the 0.72 the stylesheet has always carried,
   for the same reason the middle measure is 66ch: the steps are
   away from what is already there rather than a scale invented
   around it. */
export const VEILS = [
    { id: "clear", label: "Clear", note: "the page shows through", alpha: "0.54" },
    { id: "normal", label: "Normal", note: "what this site has always been", alpha: "0.72" },
    { id: "dense", label: "Dense", note: "quieter behind the words", alpha: "0.9" },
];
/* ============================================================
   Sound

   The site says a handful of things out loud: a lesson finished,
   a stage finished, a setting saved, a page turned. They are
   SYNTHESISED rather than played, in `next/lib/sound.ts`, so
   there is no audio file in this repository and nothing to fetch;
   a cue is a few oscillators and an envelope.

   ON by default, and that is a real decision rather than a
   default nobody thought about. Every cue is tied to something
   the reader just did, none of them can fire on a page load, and
   a browser will not let any of them make a noise before the
   first gesture anyway. What it must not be is loud or
   surprising, which is why the whole bus sits under a low master
   gain and a press is a tenth of what finishing a stage is.
   ============================================================ */
export const SOUNDS = [
    { id: "on", label: "On", note: "a quiet note when something finishes" },
    { id: "off", label: "Off", note: "the site is silent" },
];
/* ============================================================
   Weather

   A little of the reader's own sky on the glass: rain when it is
   raining where they are, stars at night, fog in fog. It costs
   one permission, asked once from a button and never from a page
   loading, and what is kept is two coordinates rounded to about a
   kilometre, on this device only.

   ON is the default and it draws NOTHING until that button has
   been pressed, which is the only arrangement that is honest:
   defaulting to off would mean a reader who granted the
   permission then had to find a second switch, and defaulting to
   on cannot leak anything, because with no coordinates there is
   nothing to ask about.
   ============================================================ */
export const WEATHERS = [
    { id: "on", label: "On", note: "the sky where you are, on the page" },
    { id: "off", label: "Off", note: "nothing, whatever the weather" },
];
const DEFAULTS = {
    text: "normal", measure: "normal", lang: "bn",
    glass: "frost", blur: "normal", veil: "normal", sound: "on",
    weather: "on",
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
        glass: known(GLASSES, stored.glass, DEFAULTS.glass),
        blur: known(BLURS, stored.blur, DEFAULTS.blur),
        veil: known(VEILS, stored.veil, DEFAULTS.veil),
        sound: known(SOUNDS, stored.sound, DEFAULTS.sound),
        weather: known(WEATHERS, stored.weather, DEFAULTS.weather),
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
            text: next.text, measure: next.measure, lang: next.lang,
            glass: next.glass, blur: next.blur, veil: next.veil,
            sound: next.sound, weather: next.weather, ts: Date.now(),
        }));
    }
    catch { /* private mode */ }
    applyPrefs(next);
    dispatchEvent(new CustomEvent("prefs:changed", { detail: next }));
    return next;
}
/* ============================================================
   Putting them on the page

   Custom properties and attributes on <html>, and the stylesheet
   answers. Nothing here touches an element: a preference that had
   to walk the DOM would be a preference that is wrong on anything
   rendered after it ran, and the boot script that runs before the
   first paint could not walk one anyway.

   `data-glass` is an attribute because it names a material and
   the stylesheet has a block per material; the two numbers are
   custom properties because every radius and every tint on the
   site is derived from them by `calc()`. Both are read before the
   first paint by the boot script in `next/components/shell.tsx`,
   which carries the same three tables inline: a bar that arrived
   at one thickness and thickened a frame later would be worse
   than one that never blurred.
   ============================================================ */
export function applyPrefs(prefs = readPrefs()) {
    const root = document.documentElement;
    const scale = SCALES.find((s) => s.id === prefs.text) ?? SCALES[1];
    const measure = MEASURES.find((m) => m.id === prefs.measure) ?? MEASURES[1];
    const blur = BLURS.find((b) => b.id === prefs.blur) ?? BLURS[1];
    const veil = VEILS.find((v) => v.id === prefs.veil) ?? VEILS[1];
    root.style.setProperty("--read-scale", scale.size);
    root.style.setProperty("--read-measure", measure.ch);
    root.style.setProperty("--glass-amount", blur.amount);
    root.style.setProperty("--glass-veil", veil.alpha);
    root.setAttribute("data-glass", prefs.glass);
    /* An ATTRIBUTE rather than a value the sound module reads out
       of storage itself. `next/lib/sound.ts` has to answer "is this
       allowed" inside a click handler, and parsing JSON out of
       localStorage on every press to find out is a read a page does
       not need to make. One attribute, set here and by the boot
       script, and the answer is a string comparison. */
    root.setAttribute("data-sound", prefs.sound);
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

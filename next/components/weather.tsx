"use client";

/* ============================================================
   weather.tsx: a little of the reader's own sky, on the glass.

   The site is made of glass and every surface on it is lit from
   the top left by a light that follows a pointer. This is the
   other side of that window: if it is raining where the reader
   is, it rains on the page.

   ---- asked once, and only once ----

   Nothing here happens until a reader presses "Use my location"
   in their account's appearance panel, or types a town into the
   box beside it. What is kept is TWO NUMBERS ROUNDED TO TWO
   DECIMAL PLACES, which is about a kilometre: enough to know
   whether it is raining, nowhere near enough to find a house.
   That rounding happens here as well as in the Worker, because a
   coordinate is the most personal thing this site ever touches
   and one place doing it is one too few.

   ---- and the header has to allow it ----

   `Permissions-Policy: geolocation=()` was on every response this
   site sends for as long as this file existed, which is not "ask
   the reader" but "this page does not have that API". No prompt
   was ever shown, `getCurrentPosition` failed at once with
   PERMISSION_DENIED, and a reader who went into their browser's
   own site settings and granted location was told, on reload,
   that their browser had said no. Both header lists say
   `geolocation=(self)` now, and `scripts/check-headers.ts` is
   what keeps the two in step.

   ---- and it stays on this device ----

   `weather-place` is deliberately NOT carried by `aab/sync.js`,
   which is a decision rather than an omission. Every other key
   that syncs is something the reader made: a tick, a note, a
   preference. Where somebody is standing is not that, it is
   different on every device by definition, and the account is a
   server. A phone in Dhaka and a laptop in Brighton are two
   places, and the honest thing is for each to ask its own
   browser.

   ---- what it draws ----

   Seven skies and no more, because seven is what can be told
   apart at forty per cent opacity. `functions/api/weather.ts`
   does that reduction from the WMO codes; this file never sees a
   number.

   The whole layer is one attribute on `<html>` and a block of CSS
   in `@layer weather`. Nothing here animates anything: a
   component driving rain from JavaScript would be a rAF loop
   running on every page for as long as the tab is open.
   ============================================================ */

import { useEffect } from "react";

/** Where the reader is, coarsely. A device fact, not an account
    fact: see the note above about why this is not synced. */
const PLACE = "weather-place";

/** What the sky was, and when we asked. In `sessionStorage`
    rather than `localStorage`: a tab is about as long as weather
    stays the same, and a stale sky from three days ago drawn
    before the fetch lands would be a page briefly lying. */
const SEEN = "weather-seen";

/** Fifteen minutes, matching the Worker's edge cache, so a reader
    clicking through six pages makes one request. */
const FRESH = 15 * 60 * 1000;

interface Sky { sky: string; day: boolean }

/** On, unless the reader turned it off. Read out of the same one
    key every other preference lives in. */
function wanted(): boolean {
  try {
    const prefs = JSON.parse(localStorage.getItem("reader-prefs") || "{}") || {};
    return prefs.weather !== "off";
  } catch { return false; }
}

function place(): { lat: number; lon: number; name?: string } | null {
  try {
    const raw = JSON.parse(localStorage.getItem(PLACE) || "null");
    if (!raw || typeof raw.lat !== "number" || typeof raw.lon !== "number") return null;
    return raw;
  } catch { return null; }
}

/** What happened when we asked. Four answers rather than a
    boolean, because "no" was the whole vocabulary for as long as
    this existed and it made the one real bug unreadable: the page
    said "your browser said no" whether the reader had refused,
    whether the device could not fix a position, or whether this
    site's own Permissions-Policy had switched the API off before
    the browser could ask anybody anything. */
export type AskResult = "got" | "refused" | "unavailable" | "no-api";

/** Round to about a kilometre and keep it. The one place in the
    browser that writes this key, so the rounding cannot be
    skipped by a caller that forgot. */
function keep(lat: number, lon: number, name?: string): void {
  try {
    localStorage.setItem(PLACE, JSON.stringify({
      lat: Math.round(lat * 100) / 100,
      lon: Math.round(lon * 100) / 100,
      ...(name ? { name } : {}),
    }));
    sessionStorage.removeItem(SEEN);
  } catch { /* private mode: it holds for this page */ }
}

/** Ask the browser once, keep the answer rounded, and say what
    happened. Exported because the appearance panel is what asks:
    a permission prompt has to come from a button a reader
    pressed, never from a page loading. */
export async function askForPlace(): Promise<AskResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return "no-api";
  }
  return new Promise((done) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        keep(pos.coords.latitude, pos.coords.longitude);
        done("got");
      },
      (err) => done(
        /* PERMISSION_DENIED is 1 and is the only one that means a
           person said no. 2 is the device failing to fix a
           position and 3 is it taking too long, and telling a
           reader on a desktop with no radio that they refused
           something is a page blaming them for its own limits. */
        err && err.code === 1 ? "refused" : "unavailable"),
      { maximumAge: 30 * 60 * 1000, timeout: 8000, enableHighAccuracy: false },
    );
  });
}

/** Whether the browser has already been asked, where it will say.
    `navigator.permissions` is not everywhere and the answer is
    advisory: a "denied" here is what lets the panel say "your
    browser is holding this one, and here is where to change it"
    rather than offering a button that cannot work. */
export async function placePermission(): Promise<PermissionState | null> {
  try {
    if (typeof navigator === "undefined" || !navigator.permissions) return null;
    const status = await navigator.permissions.query(
      { name: "geolocation" as PermissionName });
    return status.state;
  } catch { return null; }
}

/** A place the reader typed, chosen off the list the Worker
    answered with. The same rounding and the same key: a place is
    a place however it arrived. */
export function setPlace(lat: number, lon: number, name: string): void {
  keep(lat, lon, name);
}

/** What this browser calls where it is, for the panel to print
    back. Empty for a coordinate the device gave us, because the
    honest label for that is not a place name. */
export function placeName(): string {
  const at = place();
  return at && typeof at.name === "string" ? at.name : "";
}

/** Forget it, which has to be one press and has to be complete:
    the coordinates go, the cached sky goes, and the page stops
    drawing immediately rather than at the next load. */
export function forgetPlace(): void {
  try {
    localStorage.removeItem(PLACE);
    sessionStorage.removeItem(SEEN);
  } catch { /* private mode */ }
  document.documentElement.removeAttribute("data-weather");
}

export function hasPlace(): boolean { return place() !== null; }

/** Put it on `<html>`, which is the whole of the interface
    between this file and the stylesheet. */
function show(now: Sky | null): void {
  const root = document.documentElement;
  if (!now) { root.removeAttribute("data-weather"); return; }
  root.setAttribute("data-weather",
    now.sky === "clear" && !now.day ? "night" : now.sky);
}

export function Weather() {
  useEffect(() => {
    if (!wanted()) { show(null); return; }
    const at = place();
    if (!at) { show(null); return; }

    /* What this tab already knows, drawn before anything is
       fetched, so a reader clicking through pages does not watch
       the rain restart on each one. */
    try {
      const seen = JSON.parse(sessionStorage.getItem(SEEN) || "null");
      if (seen && Date.now() - seen.at < FRESH) show(seen.now);
    } catch { /* nothing cached */ }

    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/weather?lat=${at.lat}&lon=${at.lon}`,
          { signal: AbortSignal.timeout(9000) });
        const data = await res.json() as { ok?: boolean } & Sky;
        if (!alive || !data?.ok) return;
        const now = { sky: data.sky, day: data.day };
        show(now);
        try {
          sessionStorage.setItem(SEEN, JSON.stringify({ at: Date.now(), now }));
        } catch { /* private mode */ }
      } catch {
        /* No answer is not an error worth showing. The page has
           no weather on it, which is what it had a moment ago. */
      }
    })();
    return () => { alive = false; };
  }, []);

  /* Three layers, always rendered and always empty. The
     stylesheet decides what each one is for a given sky, which
     is what keeps seven weathers out of this file: `display:
     none` until `<html>` carries an attribute, so a page with no
     weather on it pays for nothing. */
  return (
    <div className="weather" aria-hidden="true">
      <span className="wx-far" />
      <span className="wx-near" />
      <span className="wx-light" />
    </div>
  );
}

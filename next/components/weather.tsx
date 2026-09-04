"use client";

/* A little of the reader's own sky, behind the page.

   Nothing happens until a reader presses "Use my location" or types a
   town. What is kept is TWO NUMBERS ROUNDED TO TWO DECIMAL PLACES, about
   a kilometre, and the rounding happens here as well as in the Worker
   because one place doing it is one too few.

   `Permissions-Policy: geolocation` must be `(self)`, never `()`: an
   empty allowlist is not "ask the reader", it is the page telling the
   browser it does not have the API, so no prompt appears and
   `getCurrentPosition` fails at once with PERMISSION_DENIED.
   `scripts/check-headers.ts` keeps the two header lists in step.

   `weather-place` is deliberately NOT carried by `aab/sync.js`: every
   other synced key is something the reader MADE, and where somebody is
   standing is different on every device by definition.

   Seven skies, reduced from the WMO codes by `functions/api/weather.ts`,
   so this file never sees a number. The drawing is one attribute on
   `<html>` and `@layer weather`; nothing here animates anything. It sits
   BEHIND the page, and that layer says which two facts about `<html>` and
   `body` hold it there. */

import { useEffect } from "react";

/** Where the reader is, coarsely. A device fact, not an account
    fact: see the note above about why this is not synced. */
const PLACE = "weather-place";

    /** What the sky was, and when we asked. `sessionStorage` rather than
        `localStorage`: a tab is about as long as weather stays the same,
        and a stale sky drawn before the fetch lands is a page lying. */
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

    /** What happened when we asked. Four answers rather than a boolean,
        because "no" as the whole vocabulary made the one real bug
        unreadable: it could not tell a reader refusing from a device that
        cannot fix a position from this site's own Permissions-Policy
        switching the API off before the browser asked anybody. */
export type AskResult = "got" | "refused" | "unavailable" | "no-api";

    /** Round to about a kilometre and keep it. The one place in the
        browser that writes this key, so the rounding cannot be skipped by
        a caller that forgot. */
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
        happened. Exported because the appearance panel is what asks: a
        permission prompt has to come from a button a reader pressed. */
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
               person said no. 2 is the device failing to fix a position
               and 3 is it timing out, and telling a reader on a desktop
               with no radio that they refused is a page blaming them. */
        err && err.code === 1 ? "refused" : "unavailable"),
      { maximumAge: 30 * 60 * 1000, timeout: 8000, enableHighAccuracy: false },
    );
  });
}

    /** Whether the browser has already been asked, where it will say.
        `navigator.permissions` is not everywhere and the answer is
        advisory: a "denied" here lets the panel say where to change it
        rather than offering a button that cannot work. */
export async function placePermission(): Promise<PermissionState | null> {
  try {
    if (typeof navigator === "undefined" || !navigator.permissions) return null;
    const status = await navigator.permissions.query(
      { name: "geolocation" as PermissionName });
    return status.state;
  } catch { return null; }
}

    /** A place the reader typed, chosen off the list the Worker answered
        with. The same rounding and the same key. */
export function setPlace(lat: number, lon: number, name: string): void {
  keep(lat, lon, name);
}

    /** What this browser calls where it is, for the panel to print back.
        Empty for a coordinate the device gave us, because the honest label
        for that is not a place name. */
export function placeName(): string {
  const at = place();
  return at && typeof at.name === "string" ? at.name : "";
}

    /** Forget it, which has to be one press and has to be complete: the
        coordinates go, the cached sky goes, and the page stops drawing
        immediately rather than at the next load. */
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

        /* What this tab already knows, drawn before anything is fetched,
           so a reader clicking through pages does not watch the rain
           restart on each one. */
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

      /* Five layers, always rendered and always empty: the wash, three
         depths of weather and the light. The stylesheet decides what each
         is for a given sky, and `display: none` until `<html>` carries an
         attribute, so a page with no weather pays for nothing.

         THREE DEPTHS RATHER THAN TWO is what makes it read as weather
         instead of as a pattern. The drawing is entirely in
         `@layer weather`. */
  return (
    <div className="weather" aria-hidden="true">
      <span className="wx-sky" />
      <span className="wx-far" />
      <span className="wx-mid" />
      <span className="wx-near" />
      <span className="wx-light" />
    </div>
  );
}

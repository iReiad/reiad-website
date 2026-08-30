"use client";

/* ============================================================
   weather.tsx: a little of the reader's own sky, on the glass.

   The site is made of glass and every surface on it is lit from
   the top left by a light that follows a pointer. This is the
   other side of that window: if it is raining where the reader
   is, it rains on the page.

   ---- asked once, and only once ----

   Nothing here happens until a reader presses "Use my location"
   in their account's appearance panel. What is kept is TWO
   NUMBERS ROUNDED TO TWO DECIMAL PLACES, which is about a
   kilometre: enough to know whether it is raining, nowhere near
   enough to find a house. That rounding happens here as well as
   in the Worker, because a coordinate is the most personal thing
   this site ever touches and one place doing it is one too few.

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

function place(): { lat: number; lon: number } | null {
  try {
    const raw = JSON.parse(localStorage.getItem(PLACE) || "null");
    if (!raw || typeof raw.lat !== "number" || typeof raw.lon !== "number") return null;
    return raw;
  } catch { return null; }
}

/** Ask the browser once, keep the answer rounded, and say whether
    it worked. Exported because the appearance panel is what asks:
    a permission prompt has to come from a button a reader
    pressed, never from a page loading. */
export async function askForPlace(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return false;
  return new Promise((done) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          localStorage.setItem(PLACE, JSON.stringify({
            lat: Math.round(pos.coords.latitude * 100) / 100,
            lon: Math.round(pos.coords.longitude * 100) / 100,
          }));
          sessionStorage.removeItem(SEEN);
        } catch { /* private mode: it holds for this page */ }
        done(true);
      },
      () => done(false),
      { maximumAge: 30 * 60 * 1000, timeout: 8000, enableHighAccuracy: false },
    );
  });
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

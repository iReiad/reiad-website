"use client";

/* ============================================================
   account/prefs.tsx: the seven reading preferences, as a
   component rather than as DOM built in a loop.

   The type size, the measure, the theme, which language the
   calculators open in, and what the site's translucent surfaces
   are made of. Pressed here, applied on every page immediately,
   carried between devices by `sync.ts` under `reader-prefs`.

   ---- the tables are not written out here ----

   Every option, label, note and value comes from `/prefs.js`,
   which is also what the boot script and the stylesheet answer
   to. A second copy of the three glass tables in this file would
   be a panel that offers a finish the site cannot draw.

   ---- why this imports a path rather than a package ----

   `/prefs.js` is served by the other Worker at that address and
   is precached, and this reads it at RUN time through
   `runtimeModule()`, whose header says how and why it has to hide
   the specifier from two bundlers rather than one.

   It is the same arrangement the Studio and the desk already use:
   `vite.config.ts` leaves `/app.js`, `/api.js` and five others
   external so every page shares one copy of each rather than
   carrying a second that can drift.

   The types come from `app/src/types/prefs.d.ts`, which those
   two apps already had, mapped in `next/tsconfig.json`. Do not
   answer an untyped import here with a `@ts-expect-error`: it
   silences the complaint without describing anything, and it
   silences the next one too.

   ---- and why it is a client component ----

   Preferences are one reader's, kept in their own browser. The
   server has no session and no localStorage, so there is nothing
   for it to render: this draws nothing until it has read them,
   which is the same rule `next/lib/progress.ts` states for what
   a reader has read.
   ============================================================ */

import { cue } from "../../lib/sound";
import { Field } from "../ui/field";
import {
  askForPlace, forgetPlace, hasPlace, placeName, placePermission, setPlace,
  type AskResult,
} from "../weather";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { Prefs, PrefOption } from "/prefs.js";
import { runtimeModule } from "./runtime";

type PrefsModule = typeof import("/prefs.js");

const prefsModule = () => runtimeModule<PrefsModule>("/prefs.js");

interface Row {
  key: keyof Prefs;
  label: string;
  options: readonly PrefOption[];
}

/** A run of rows under one heading. The heading is optional
    because the first group has none: the section around this card
    already carries the title, and repeating it would say the same
    thing twice. */
interface Group {
  id: string;
  heading?: string;
  why?: string;
  rows: Row[];
  /** The one group with a control that is not a row of chips: a
      permission has to be asked from a button somebody pressed,
      so it cannot be a preference like the others. */
  place?: boolean;
}

/** A town, as the Worker answered. Mirrors `Place` in
    `functions/api/weather.ts`; not imported from there because
    `functions/` is the Worker's and this is the browser's, and
    the wire between them is JSON either way. */
interface Found {
  id: string;
  name: string;
  where: string;
  lat: number;
  lon: number;
}

/** Where you are, asked once, or typed.

    Its own component because it holds the one piece of state on
    this panel that is not a preference: whether this browser has
    a place at all, and how it got one.

    TWO WAYS IN, and the second is not a fallback. A browser can
    refuse, a desktop can have no radio, a work laptop can have
    the permission turned off three levels up, and a reader can
    simply prefer to say where they are rather than be found. Any
    of those used to end at a sentence saying the browser had said
    no, with nothing to press next. */
function PlaceRow() {
  const [has, setHas] = useState(false);
  const [named, setNamed] = useState("");
  const [asking, setAsking] = useState(false);
  const [said, setSaid] = useState<AskResult | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<Found[] | null>(null);
  const [looking, setLooking] = useState(false);
  const box = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setHas(hasPlace());
    setNamed(placeName());
    /* Advisory, and only used to soften the copy: a browser that
       has already been told no will not show a prompt however
       many times the button is pressed, so saying where to change
       it is more use than offering the button again. */
    placePermission().then((state) => { setBlocked(state === "denied"); });
  }, []);

  /* One request per pause in the typing, not one per keystroke.
     The Worker caches a place name for a day, so a second reader
     typing "Dhaka" costs nothing, but a request per letter would
     still be six requests to spell it. */
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setFound(null); setLooking(false); return; }
    setLooking(true);
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/weather/place?q=${encodeURIComponent(q)}`,
          { signal: AbortSignal.timeout(9000) });
        const data = await res.json() as { ok?: boolean; places?: Found[] };
        if (!alive) return;
        setFound(data?.ok ? (data.places ?? []) : []);
      } catch {
        if (alive) setFound([]);
      } finally {
        if (alive) setLooking(false);
      }
    }, 280);
    return () => { alive = false; clearTimeout(timer); };
  }, [query]);

  const choose = useCallback((row: Found) => {
    setPlace(row.lat, row.lon, row.where ? `${row.name}, ${row.where}` : row.name);
    cue("saved");
    /* A reload rather than a state update, because the layer
       reads its place once on mount and the honest way to say
       "start now" is to start now. */
    location.reload();
  }, []);

  if (has) {
    return (
      <div className="pref-row">
        <span className="pref-label">Your place</span>
        <div className="pref-chips" role="group" aria-label="Your place">
          <button className="pref-chip" type="button" onClick={() => {
            forgetPlace();
            setHas(false); setNamed(""); setSaid(null);
            cue("press");
          }}>
            <strong>Forget it</strong>
            <small>
              {named
                ? `${named}: the coordinates go, and the page stops`
                : "the coordinates go, and the page stops"}
            </small>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pref-row">
      <span className="pref-label">Your place</span>
      <div className="grid gap-3">
        <div className="pref-chips" role="group" aria-label="Your place">
          <button className="pref-chip" type="button" disabled={asking}
                  onClick={async () => {
                    setAsking(true);
                    const got = await askForPlace();
                    setAsking(false);
                    setSaid(got);
                    setHas(got === "got");
                    if (got !== "got") {
                      placePermission().then(
                        (state) => { setBlocked(state === "denied"); });
                    }
                    cue(got === "got" ? "saved" : "refused");
                    if (got === "got") location.reload();
                  }}>
            <strong>{asking ? "Asking..." : "Use my location"}</strong>
            <small>rounded to about a kilometre, kept on this device</small>
          </button>
          <button className="pref-chip" type="button"
                  onClick={() => { box.current?.focus(); cue("press"); }}>
            <strong>Or name a town</strong>
            <small>nothing is asked of your device at all</small>
          </button>
        </div>

        {said && said !== "got" ? (
          <p className="m-0 max-w-[var(--measure)] text-[0.85rem] text-ink-soft">
            {said === "refused" && blocked
              ? "Your browser is holding on to a no for this site. It is in the "
                + "padlock beside the address, under Location. Or name a town "
                + "below, which asks your device nothing."
              : said === "refused"
                ? "Your browser said no, which is fine. Name a town below "
                  + "instead."
                : said === "no-api"
                  ? "This browser has no location API. Name a town below."
                  : "Your device could not work out where it is, which is "
                    + "common on a desktop. Name a town below."}
          </p>
        ) : null}

        <div className="grid gap-2">
          <Field
            id="weather-place-search"
            label="Search for a town or city"
            ref={box}
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="Sylhet, Brighton, Dhaka..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {looking ? (
            <p className="m-0 text-[0.85rem] text-ink-soft">Looking...</p>
          ) : null}

          {found && found.length > 0 ? (
            <ul className="m-0 grid list-none gap-1 p-0">
              {found.map((row) => (
                <li key={row.id}>
                  <button className="pref-chip w-full text-left" type="button"
                          onClick={() => choose(row)}>
                    <strong>{row.name}</strong>
                    {row.where ? <small>{row.where}</small> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {found && found.length === 0 && !looking && query.trim().length >= 2 ? (
            <p className="m-0 text-[0.85rem] text-ink-soft">
              Nothing by that name. Try the nearest bigger town.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Preferences() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [now, setNow] = useState<Prefs | null>(null);

  useEffect(() => {
    let live = true;
    prefsModule().then((m) => {
      if (!live) return;
      setGroups([
        {
          id: "reading",
          rows: [
            { key: "text", label: "Type size", options: m.SCALES },
            { key: "measure", label: "Line width", options: m.MEASURES },
            { key: "theme", label: "Theme", options: m.THEMES },
            { key: "lang", label: "Calculators open in", options: m.LANGS },
          ],
        },
        {
          id: "glass",
          heading: "What the glass is made of",
          why: "The bar, the rail, the menus and every button, tab and "
            + "chip are made of the same translucent stuff, each scaled "
            + "to its job. Pick the material first: the two below move "
            + "whichever one is on, and Plain has no blur for them to "
            + "move.",
          rows: [
            { key: "glass", label: "Finish", options: m.GLASSES },
            { key: "blur", label: "Blur", options: m.BLURS },
            { key: "veil", label: "Transparency", options: m.VEILS },
          ],
        },
        {
          id: "sound",
          heading: "Whether the site makes a sound",
          why: "A quiet note when a lesson is finished, a stage is "
            + "finished, or a setting is saved, and a much quieter one "
            + "under a button. Nothing plays on a page load, nothing "
            + "plays before you have pressed something, and there is no "
            + "audio file: every note is a few oscillators, worked out "
            + "as the page needs it.",
          rows: [
            { key: "sound", label: "Sound", options: m.SOUNDS },
          ],
        },
        {
          id: "weather",
          heading: "The sky where you are",
          why: "Rain on the page when it is raining, stars at night, "
            + "fog in fog. It needs your location once: what is kept is "
            + "two numbers rounded to about a kilometre, on this device "
            + "only, and they are never sent to your account. Weather "
            + "data by Open-Meteo.",
          rows: [
            { key: "weather", label: "Weather", options: m.WEATHERS },
          ],
          place: true,
        },
      ]);
      setNow(m.readPrefs());
    });
    return () => { live = false; };
  }, []);

  const pick = useCallback(async (key: keyof Prefs, id: string) => {
    const m = await prefsModule();
    const saved = m.savePrefs({ [key]: id } as Partial<Prefs>);
    /* AFTER the save, so turning sound ON says so out loud and
       turning it off is the last thing you hear it do, which is
       the switch confirming itself in its own terms. */
    cue(saved.sound === "off" ? "press" : "saved");
    /* Read back rather than assuming: `savePrefs` applies the
       change to the document and may normalise what it was
       given, and a component that trusted its own optimistic
       copy would be a second answer to what the preference is. */
    setNow({ ...m.readPrefs() });
  }, []);

  /* Nothing until the reader's own preferences are known. An
     empty row set here would be seven rows of chips with none of
     them pressed, which reads as "you have chosen nothing"
     rather than as "this has not loaded". */
  if (!groups || !now) return null;

  return (
    <>
      {groups.map((group) => (
        /* A fragment rather than a wrapper: the card is a grid and
           its gap is what spaces these rows, so a div around each
           group would collapse a group into one grid item. */
        <Fragment key={group.id}>
          {group.heading ? (
            <div className="mt-1 grid gap-1 border-t border-hairline pt-5">
              <h3 id={`prefs-${group.id}`} className="m-0 font-read text-t6">
                {group.heading}
              </h3>
              {group.why ? (
                <p className="m-0 max-w-[var(--measure)] text-[0.9rem] text-ink-soft">
                  {group.why}
                </p>
              ) : null}
            </div>
          ) : null}

          {group.place ? <PlaceRow /> : null}

          {group.rows.map((row) => (
            <div className="pref-row" key={String(row.key)}>
              <span className="pref-label">{row.label}</span>
              <div className="pref-chips" role="group" aria-label={row.label}>
                {row.options.map((option) => {
                  const on = now[row.key] === option.id;
                  return (
                    <button
                      key={option.id}
                      className="pref-chip"
                      type="button"
                      aria-pressed={on}
                      data-on={on ? "" : undefined}
                      onClick={() => pick(row.key, option.id)}
                    >
                      <strong>{option.label}</strong>
                      {option.note ? <small>{option.note}</small> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Fragment>
      ))}
    </>
  );
}

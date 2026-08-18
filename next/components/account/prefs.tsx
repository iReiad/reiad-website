"use client";

/* ============================================================
   account/prefs.tsx: the four reading preferences, as a
   component rather than as DOM built in a loop.

   The type size, the measure, the theme and which language the
   calculators open in. Pressed here, applied on every page
   immediately, carried between devices by `sync.ts` under
   `reader-prefs`.

   ---- why this imports a path rather than a package ----

   `/prefs.js` is served by the other Worker at that address and
   is precached, and this reads it at RUN time:

       await import(/* turbopackIgnore *\/ "/prefs.js")

   which is the same arrangement the Studio and the desk already
   use. `vite.config.ts` leaves `/app.js`, `/api.js` and five
   others external for exactly this reason, and `CLAUDE.md` gives
   it: one copy of each module, shared by every page, rather than
   a second that can drift.

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

import { useCallback, useEffect, useState } from "react";
import type { Prefs, PrefOption } from "/prefs.js";

type PrefsModule = typeof import("/prefs.js");

let loading: Promise<PrefsModule> | null = null;
/** One import for the page, however many components ask. */
const prefsModule = (): Promise<PrefsModule> =>
  (loading ??= import(/* turbopackIgnore: true */ "/prefs.js"));

interface Row {
  key: keyof Prefs;
  label: string;
  options: readonly PrefOption[];
}

export function Preferences() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [now, setNow] = useState<Prefs | null>(null);

  useEffect(() => {
    let live = true;
    prefsModule().then((m) => {
      if (!live) return;
      setRows([
        { key: "text", label: "Type size", options: m.SCALES },
        { key: "measure", label: "Line width", options: m.MEASURES },
        { key: "theme", label: "Theme", options: m.THEMES },
        { key: "lang", label: "Calculators open in", options: m.LANGS },
      ]);
      setNow(m.readPrefs());
    });
    return () => { live = false; };
  }, []);

  const pick = useCallback(async (key: keyof Prefs, id: string) => {
    const m = await prefsModule();
    m.savePrefs({ [key]: id } as Partial<Prefs>);
    /* Read back rather than assuming: `savePrefs` applies the
       change to the document and may normalise what it was
       given, and a component that trusted its own optimistic
       copy would be a second answer to what the preference is. */
    setNow({ ...m.readPrefs() });
  }, []);

  /* Nothing until the reader's own preferences are known. An
     empty row set here would be four rows of chips with none of
     them pressed, which reads as "you have chosen nothing"
     rather than as "this has not loaded". */
  if (!rows || !now) return null;

  return (
    <>
      {rows.map((row) => (
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
    </>
  );
}

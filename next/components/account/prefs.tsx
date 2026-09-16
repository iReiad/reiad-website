"use client";

/* The five reading preferences, as a component rather than DOM built in
   a loop: pressed here, applied on every page immediately, carried
   between devices by `sync.ts` under `reader-prefs`.

   THE TABLES ARE NOT WRITTEN OUT HERE. Every option, label, note and
   value comes from `/prefs.js`, which is also what the boot script
   answers to: a second copy would be a panel that offers a step the
   page cannot apply.

   `/prefs.js` is served by the other Worker at that address and is
   precached, and this reads it at RUN time through `runtimeModule()`,
   whose header says why it has to hide the specifier from two bundlers.
   The types come from `app/src/types/prefs.d.ts`, mapped in
   `next/tsconfig.json`. Do not answer an untyped import here with a
   `@ts-expect-error`: it silences the complaint without describing
   anything, and it silences the next one too.

   A client component, because preferences are one reader's and kept in
   their own browser: the server has no session and no localStorage, so
   this draws nothing until it has read them. */

import { PrefSwatch } from "./pref-swatch";
import { useCallback, useEffect, useState } from "react";
import type { Prefs, PrefOption } from "/prefs.js";
import { runtimeModule } from "./runtime";

type PrefsModule = typeof import("/prefs.js");

const prefsModule = () => runtimeModule<PrefsModule>("/prefs.js");

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
        { key: "depth", label: "Calculators open with", options: m.DEPTHS },
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
     empty row set here would be five rows of chips with none of
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
                  {/* The picture first, because it is what a
                      reader is choosing between: the words
                      under it are the name of what they can
                      already see. */}
                  <PrefSwatch row={row.key} id={option.id} />
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

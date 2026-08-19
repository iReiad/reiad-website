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

import { Fragment, useCallback, useEffect, useState } from "react";
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
          why: "The bar at the top, the rail and the cards float on "
            + "translucent surfaces. Pick the material first: the two "
            + "below move whichever one is on, and Plain has no blur "
            + "for them to move.",
          rows: [
            { key: "glass", label: "Finish", options: m.GLASSES },
            { key: "blur", label: "Blur", options: m.BLURS },
            { key: "veil", label: "Tint", options: m.VEILS },
          ],
        },
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

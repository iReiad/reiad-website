"use client";

/* ============================================================
   account/held.tsx: everything this site keeps in this browser,
   in the words a reader would use, with what leaves the machine
   marked.

   The account page already said "only what is listed here" and
   then listed eleven counts. This is the whole list, and it is
   drawn from `shared/storage.ts` rather than written out, so a
   key added anywhere on the site appears here without anybody
   coming to this file. That is the same rule as every count on
   the front page: a list of things that exist elsewhere is built
   from the data.

   ---- what it says, and what it deliberately does not ----

   Whether a thing is here, not what is in it. The counts a reader
   wants per school are `<Kept />` one card up; repeating them
   would be two answers to one question. What this adds is the
   question that had no answer anywhere: what IS all of it, and
   which parts leave this machine.
   ============================================================ */

import { useEffect, useState } from "react";
import { KEPT, HELD_ORDER, HELD_LABEL, type Held, type Keep } from "@reiad/shared/storage";

/** Whether a key has anything under it, on this machine, right
    now. Read in an effect and never on the server: what a browser
    holds is not a fact the server has, which is the same rule
    every meter on this page follows. */
function useHere(): Set<string> {
  const [here, setHere] = useState<Set<string>>(new Set());
  useEffect(() => {
    const look = (): void => {
      const found = new Set<string>();
      for (const row of KEPT) {
        try {
          const store = row.where === "session" ? sessionStorage : localStorage;
          if (store.getItem(row.key) !== null) found.add(row.key);
        } catch { /* private mode: nothing is here, which is true */ }
      }
      setHere(found);
    };
    look();
    document.addEventListener("sync:done", look);
    return () => document.removeEventListener("sync:done", look);
  }, []);
  return here;
}

export function HeldHere() {
  const here = useHere();

  return (
    <div className="held">
      {HELD_ORDER.map((held: Held) => {
        const rows = KEPT.filter((k: Keep) => k.held === held);
        /* A kind with nothing under any of its keys is a kind
           this reader has never used, and a heading over an empty
           list is a page describing somebody else. `legacy` never
           shows: it is a sweep, and a reader has no decision to
           make about it. */
        if (held === "legacy" || !rows.some((r: Keep) => here.has(r.key))) return null;
        return (
          /* The account page's own card, by class rather than by
             its local `<Card>` helper, which is a private function
             in that route. `@layer admin` gives this one the same
             ground, edge and corner. */
          <div key={held} className="held-group">
            <h3>{HELD_LABEL[held]}</h3>
            <dl className="held-list">
              {rows.filter((r: Keep) => here.has(r.key)).map((row: Keep) => (
                <div key={row.key} className="held-row">
                  <dt>
                    {row.what}
                    {row.syncs ? (
                      <span className="held-mark" title="Carried to your account">
                        on your account
                      </span>
                    ) : null}
                  </dt>
                  {row.why ? <dd>{row.why}</dd> : null}
                </div>
              ))}
            </dl>
          </div>
        );
      })}
      <p className="held-note">
        Everything marked <em>on your account</em> travels between your
        devices. Everything else stays in this browser and goes when you
        clear its data.
      </p>
    </div>
  );
}

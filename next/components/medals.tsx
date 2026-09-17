"use client";

/* ============================================================
   medals.tsx: the shelf on a school hub.

   `lib/medals.ts` is the arithmetic and says why there is no
   storage key. This is the drawing, and three rules of the site's
   progress components hold here too:

     · NOTHING ON THE SERVER. The ticks are the browser's, so the
       server snapshot is empty and the shelf renders null until
       hydration has read storage. A stranger, and a reader who
       has not opened this school, get nothing: a row of dashed
       medals is a list of things a child has not done.
     · IT SUBSCRIBES. `subscribe()` covers the same-tab event, the
       cross-tab `storage` event and `sync:done`; the days are
       `streak:changed`, which `aab/src/streak.ts` fires and the
       store does not listen for, so it is added here.
     · THE POP IS ON THE CHANGE, not the state. A medal that was
       earned last week does not land again on every load; one
       earned while this page is open does, once, off `data-just`
       and `animationend` exactly as the tick button does.
   ============================================================ */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  checkKeyOf, checkSet, daysActive, readKeyOf, readSet, subscribe,
} from "../lib/progress";
import { medalsFor, newlyEarned, shelf, toGo, type Medal } from "../lib/medals";
import { Icon } from "./icons";
import { SectionLabel } from "./ui/label";

const EMPTY: Medal[] = [];

function listen(fn: () => void): () => void {
  const off = subscribe(fn);
  window.addEventListener("streak:changed", fn);
  return () => { off(); window.removeEventListener("streak:changed", fn); };
}

/** One string that changes whenever any of the three keys does,
    so `useSyncExternalStore` has a stable, comparable snapshot. */
function snapshotOf(school: string): string {
  try {
    return [
      localStorage.getItem(readKeyOf(school)) ?? "",
      localStorage.getItem(checkKeyOf(school)) ?? "",
      localStorage.getItem("days-active") ?? "",
    ].join("|");
  } catch {
    return "";
  }
}

export function Medals({ school, stages }: {
  school: string;
  /** Every stage's live lesson ids, from `lib/medal-stages.ts`. */
  stages: string[][];
}) {
  const snap = useSyncExternalStore(listen, () => snapshotOf(school), () => "");

  /* Derived from the snapshot each render, which is cheap: eleven
     rules over three sets. */
  const medals = snap
    ? medalsFor({ read: readSet(school), checks: checkSet(school), days: daysActive(), stages })
    : EMPTY;

  const [just, setJust] = useState<string[]>([]);
  const prev = useRef<Medal[] | null>(null);
  useEffect(() => {
    if (prev.current && medals !== EMPTY) {
      const won = newlyEarned(prev.current, medals);
      if (won.length) setJust(won.map((m) => m.id));
    }
    if (medals !== EMPTY) prev.current = medals;
  }, [snap, medals]);

  if (medals === EMPTY) return null;
  const mine = readSet(school).size > 0 || checkSet(school).size > 0;
  if (!mine) return null;

  return (
    <section className="medals" aria-labelledby={`medals-${school}`}>
      <SectionLabel id={`medals-${school}`} lang="bn">
        পদক · <span lang="en">Medals</span>
      </SectionLabel>
      <ul className="medal-shelf">
        {shelf(medals).map((m) => (
          <li key={m.id} className="medal" lang="bn"
              data-earned={m.earned ? "" : undefined}
              data-just={just.includes(m.id) ? "" : undefined}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setJust((ids) => ids.filter((id) => id !== m.id));
              }}>
            <span className="medal-mark" aria-hidden="true">
              <Icon name="spark" size={18} />
            </span>
            <span>
              <span className="medal-name">{m.bn}</span>
              <span className="medal-sub" lang="en">{m.en}</span>
              {m.earned ? null : (
                <span className="medal-need">{toGo(m)}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

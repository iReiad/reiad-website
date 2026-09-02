"use client";

/* ============================================================
   research/use-who.ts: who is signed in, and staying up to date
   with it.

   The account arrives after the page does and the sign-in
   happens in the top bar, so every room hears about it the way
   the diet board does: `account:changed` on the document. Until
   the first answer lands `answered` is false and a room draws
   "one moment" rather than "sign in" to somebody who just did.
   ============================================================ */

import { useEffect, useState } from "react";
import { who, type Who } from "../../lib/research-api";

export function useWho(): { w: Who | null; answered: boolean } {
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    let alive = true;
    const paint = (): void => {
      void who().then((found) => {
        if (!alive) return;
        setW(found);
        setAnswered(true);
      });
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);
  return { w, answered };
}

/** How long a burst of typing settles before it is written. Long
    enough that a sentence is one request, short enough that
    closing the tab a second after the last keystroke has saved.
    The desk's number, kept. */
export const SETTLE = 700;

/** How long "saved" stays on screen. */
export const SAID = 1600;

/** A relative time a list can show. */
export function when(iso: string | null | undefined): string {
  if (!iso) return "";
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}

export const isoDay = (): string => new Date().toISOString().slice(0, 10);

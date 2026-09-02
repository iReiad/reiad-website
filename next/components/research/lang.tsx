"use client";

/* ============================================================
   research/lang.tsx: both languages in the markup, one shown.

   The diet tool's arrangement, borrowed rather than copied:
   `T`, `TBlock`, `LangSwitch` and `useToolLang` are that file's,
   and `@layer diet`'s two rules on `data-tool-lang` are what
   show one half. `W` is the one thing added: a phrase by KEY out
   of `shared/research-words.ts`, so the Android app can draw the
   same rooms from the same table.
   ============================================================ */

import { word } from "@reiad/shared/research-words";
import { T } from "../diet/lang";

export { T, TBlock, LangSwitch, useToolLang, digits } from "../diet/lang";

/** One phrase, by key, rendered twice. A key nobody wrote comes
    out as `[key]` in both halves rather than as nothing. */
export function W({ k }: { k: string }) {
  const p = word(k);
  return <T en={p.en} bn={p.bn} />;
}

/** The same phrase as a plain string, for the few places that
    cannot hold two nodes: an `aria-label`, a `placeholder`, a
    `title`. Both languages joined, so a screen reader hears one
    and a Bangla reader is not met by English alone. */
export const both = (k: string): string => {
  const p = word(k);
  return p.en === p.bn ? p.en : `${p.en} / ${p.bn}`;
};

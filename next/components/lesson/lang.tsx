/* ============================================================
   lesson/lang.tsx: a lesson in two languages, one on the screen.

   The same arrangement `components/diet/lang.tsx` explains at
   length, and the reason is worth repeating rather than pointing
   at: a component that read the preference and returned one
   language would render Bangla on the server and English in the
   browser, React would print #418 and discard the page, and that
   is the failure that left every calculator on this site blank
   for a day.

   So both languages are in the markup and `@layer lesson` shows
   one, keyed on `data-read-lang` on the root.

   ---- and it defaults the other way from the tools ----

   `data-read-lang` is set from `tool-lang`, the key the
   calculators have written since before there were accounts. One
   key, so a reader who set the stock check to Bangla arrives here
   in Bangla and nothing has to be chosen twice.

   The DEFAULT differs, and deliberately. A calculator with no
   preference stored opens in English; a lesson opens in Bangla,
   because Bangla is the language this school teaches in and a
   reader who has never touched a setting should not have to
   choose their own language to read it. `shell.tsx` writes
   `l === "en" ? "en" : "bn"`, so null and "bn" both give Bangla
   and only an explicit English choice gives English.

   ---- and why this file is NOT "use client" ----

   `T` reads no state and calls no hook: it renders two spans and
   the stylesheet decides which one is seen. Marking it a client
   component would put a boundary around every phrase on the page,
   with both halves of every label serialised into the payload
   twice. The hook and the switch, which do hold state, are in
   `lang-switch.tsx` next door. A module with no directive is
   compiled for whichever side imports it, so both get it.
   ============================================================ */

import type { ReactNode } from "react";
import { bnNum, say, type Say } from "@reiad/shared/lesson";

export type ReadLang = "bn" | "en";

/** One phrase, twice.

    `lang` on each half is what tells a screen reader which voice
    to use and what lets the stylesheet give Bangla its own
    leading, which is 1.9 against English's 1.7. */
export function T({ s }: { s: Say | undefined }) {
  if (!s) return null;
  return (
    <>
      <span className="ls-bn" lang="bn">{s.bn}</span>
      <span className="ls-en" lang="en">{s.en}</span>
    </>
  );
}

/** The same for something that holds a block: a paragraph, a
    list item's whole contents, a table cell with more than a
    phrase in it. A `<span>` inside a `<p>` is fine and a `<p>`
    inside a `<span>` is not. */
export function TBlock({ s, className }: { s: Say | undefined; className?: string }) {
  if (!s) return null;
  const cls = className ? ` ${className}` : "";
  return (
    <>
      <div className={`ls-bn${cls}`} lang="bn">{s.bn}</div>
      <div className={`ls-en${cls}`} lang="en">{s.en}</div>
    </>
  );
}

/** Arbitrary children in two languages, for a label built out of
    more than one `Say`. */
export function TPair({ bn, en }: { bn: ReactNode; en: ReactNode }) {
  return (
    <>
      <span className="ls-bn" lang="bn">{bn}</span>
      <span className="ls-en" lang="en">{en}</span>
    </>
  );
}


/** The half of a `Say` this reader wants, for the few places
    that cannot render both: an `aria-label`, a `title`, the text
    inside an `<option>`, which the operating system draws. */
export const pick = (s: Say | undefined, lang: ReadLang): string => say(s, lang);

/* ---------- numbers ----------

   Bangla digits inside Bangla, from the one `bnNum` in
   `shared/`, which had a Devanagari bug once and does not need a
   second implementation to have it again. */

/** A number written both ways, as a `Say`, so it can go through
    `T` like any other phrase. Taka groups the Bangla way in
    Bangla: a reader who groups by two after the first three has
    to stop and re-read 1,250,000. */
export function numSay(n: number, fmt: string): Say {
  const round = (d: number): string => {
    const abs = Math.abs(n);
    const places = abs >= 100 ? 0 : abs >= 10 ? 1 : d;
    return n.toFixed(places);
  };

  switch (fmt) {
    case "taka": {
      const r = Math.round(n);
      const bn = Math.abs(r) >= 10000000
        ? `${bnNum((r / 10000000).toFixed(2))} কোটি টাকা`
        : Math.abs(r) >= 100000
          ? `${bnNum((r / 100000).toFixed(2))} লাখ টাকা`
          : `${bnNum(r.toLocaleString("en-IN"))} টাকা`;
      const en = Math.abs(r) >= 10000000
        ? `${(r / 10000000).toFixed(2)} crore taka`
        : Math.abs(r) >= 100000
          ? `${(r / 100000).toFixed(2)} lakh taka`
          : `${r.toLocaleString("en-US")} taka`;
      return { bn, en };
    }
    case "pct":
      return { bn: `${bnNum(round(1))}%`, en: `${round(1)}%` };
    case "year":
      return { bn: `${bnNum(round(1))} বছর`, en: `${round(1)} years` };
    case "month":
      return { bn: `${bnNum(round(0))} মাস`, en: `${round(0)} months` };
    case "day":
      return { bn: `${bnNum(round(1))} দিন`, en: `${round(1)} days` };
    case "times":
      return { bn: `${bnNum(round(1))} গুণ`, en: `${round(1)}x` };
    default:
      return { bn: bnNum(round(1)), en: round(1) };
  }
}

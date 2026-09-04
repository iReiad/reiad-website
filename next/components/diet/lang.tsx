/* Both languages in the HTML, one on the screen.

   A component that read the preference and returned one string cannot
   work: the preference lives in localStorage, which the server cannot
   see, so the server would render English, the browser would hydrate
   Bangla, and React would throw #418 and discard the difference. That is
   the failure that left every calculator on this site blank for a day.

   So both languages are in the markup and `@layer diet` shows one, keyed
   on `data-tool-lang`, which `shell.tsx` sets from `tool-lang` before the
   first paint. The switch writes that attribute and the page changes in
   the same frame, with no request and no re-render. It works with
   JavaScript off, and a screen reader gets one language because the other
   is `display: none` rather than hidden with opacity.

   `tool-lang` is the key the stock check has read since long before
   accounts, and `prefs.ts` writes the same one: one choice, one key. */

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { bnNum } from "@reiad/shared/schools";
import { DIET_WORDS } from "@reiad/shared/diet-words";

/** One phrase, twice.

    `lang` on each half is not decoration: it is what tells a
    screen reader which voice to use, and what lets the
    stylesheet give Bangla its own leading, which is 1.9 against
    English's 1.7. */
export function T({ en, bn, k }: {
  en?: ReactNode;
  bn?: ReactNode;
      /** A key of `DIET_WORDS` in `shared/diet-words.ts`, which is where a
          phrase belongs once more than one runtime says it: the Android
          app draws these same figures and would otherwise carry a second
          copy of every sentence. Both halves still go into the DOM and the
          stylesheet still picks. */
  k?: string;
}) {
  const said = k ? DIET_WORDS[k] : undefined;
  if (k && !said) {
    /* Loud rather than blank. A missing key rendering as nothing
       is a sentence that quietly disappears from a page that
       looks finished, which is the failure this whole repository
       keeps returning to. `check-diet.ts` fails on one too, so
       this is the second line of defence and not the first. */
    return <span className="t-en" lang="en">{`[${k}]`}</span>;
  }
  return (
    <>
      <span className="t-en" lang="en">{said ? said.en : en}</span>
      <span className="t-bn" lang="bn">{said ? said.bn : bn}</span>
    </>
  );
}

/** The same for a block: a paragraph, a list, a table cell that
    holds more than a phrase. `<span>` inside a `<p>` is fine and
    `<p>` inside a `<span>` is not, so a block needs its own
    element rather than a prop on `T`. */
export function TBlock({ en, bn }: { en: ReactNode; bn: ReactNode }) {
  return (
    <>
      <div className="t-en" lang="en">{en}</div>
      <div className="t-bn" lang="bn">{bn}</div>
    </>
  );
}

export type ToolLang = "en" | "bn";

const read = (): ToolLang => {
  if (typeof document === "undefined") return "en";
  return document.documentElement.getAttribute("data-tool-lang") === "bn" ? "bn" : "en";
};

    /** The language, for the few strings that CANNOT be rendered twice and
        hidden: `<option>`, whose text is drawn by the operating system,
        and `aria-label`, `title` and `placeholder`, which are attributes
        rather than nodes.

        It returns "en" on the server AND on the first client render, which
        is not a default but the contract: matching what the server sent is
        what stops React discarding the page. The real value arrives in an
        effect, and the cost is a flash inside two `<select>` boxes, which
        is why `T` is the one to reach for first.

        It listens, because the switch is a sibling rather than a parent. */
export function useToolLang(): ToolLang {
  const [lang, setLang] = useState<ToolLang>("en");
  useEffect(() => {
    setLang(read());
    const el = document.documentElement;
    const watch = new MutationObserver(() => setLang(read()));
    watch.observe(el, { attributes: true, attributeFilter: ["data-tool-lang"] });
    return () => watch.disconnect();
  }, []);
  return lang;
}

/** Bangla digits inside Bangla, from the one `bnNum` in
    `shared/`, which had a Devanagari bug once and does not need
    a second implementation to have it again. */
export const digits = (n: number | string, lang: ToolLang): string =>
  lang === "bn" ? bnNum(n) : String(n);

    /** The switch. It renders with no pressed state on the server and
        takes one from the attribute on mount: the attribute is the state,
        the stylesheet has already answered it, and giving the server a
        guess would reintroduce the hydration mismatch this file exists to
        avoid.

        `@layer diet` lights it off `:root[data-tool-lang]`, which the boot
        script has already set, so the drawing is right before this
        component exists and `aria-pressed` catches up. `data-half` is what
        lets the stylesheet tell the two apart without depending on child
        order. */
export function LangSwitch() {
  const [lang, setLang] = useState<ToolLang | null>(null);

  useEffect(() => { setLang(read()); }, []);

  const choose = (next: ToolLang): void => {
    document.documentElement.setAttribute("data-tool-lang", next);
    setLang(next);
    try { localStorage.setItem("tool-lang", next); } catch { /* private mode */ }
    /* The account's own copy, so a device that syncs carries the
       choice with the rest of the reading preferences rather
       than only this browser. Written through the same shape
       `prefs.ts` uses; a failure here is not worth a message,
       because the page has already changed. */
    try {
      const raw = JSON.parse(localStorage.getItem("reader-prefs") || "{}") as
        Record<string, unknown>;
      localStorage.setItem("reader-prefs", JSON.stringify({ ...raw, lang: next }));
      window.dispatchEvent(new CustomEvent("prefs:changed", { detail: { lang: next } }));
    } catch { /* private mode */ }
  };

  return (
    <div className="dt-lang" role="group" aria-label="Language / ভাষা">
      <button
        type="button"
        className="dt-lang-btn"
        data-half="en"
        aria-pressed={lang === null ? undefined : lang === "en"}
        onClick={() => choose("en")}
      >
        English
      </button>
      <button
        type="button"
        className="dt-lang-btn"
        data-half="bn"
        aria-pressed={lang === null ? undefined : lang === "bn"}
        onClick={() => choose("bn")}
        lang="bn"
      >
        বাংলা
      </button>
    </div>
  );
}

/* ============================================================
   lesson/lang-switch.tsx: the one piece of the language pair
   that holds state.

   `lang.tsx` next door renders both languages and holds none, so
   it is not a client component. This is: it reads the attribute
   on mount, watches it, and writes the preference. See that
   file's header for why both languages are in the markup at all.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import type { ReadLang } from "./lang";

export type { ReadLang };

const read = (): ReadLang => {
  if (typeof document === "undefined") return "bn";
  return document.documentElement.getAttribute("data-read-lang") === "en" ? "en" : "bn";
};

/** The language, for the few strings that CANNOT be rendered
    twice and hidden: an `aria-label`, a `title`, the text inside
    an `<option>`, which the operating system draws.

    It returns "bn" on the server AND on the first client render,
    which is not a default but the contract: matching what the
    server sent is what stops React discarding the page. The real
    value arrives one frame later. Anything that CAN be rendered
    twice uses `T` and has no flash at all. */
export function useReadLang(): ReadLang {
  const [lang, setLang] = useState<ReadLang>("bn");
  useEffect(() => {
    setLang(read());
    const el = document.documentElement;
    const watch = new MutationObserver(() => setLang(read()));
    watch.observe(el, { attributes: true, attributeFilter: ["data-read-lang"] });
    return () => watch.disconnect();
  }, []);
  return lang;
}


/** The switch.

    It renders with no pressed state on the server and takes one
    from the attribute on mount, for the reason the diet tool's
    switch gives: the attribute is the state, the stylesheet has
    already answered it before this component exists, and a guess
    on the server would reintroduce the mismatch the whole file
    avoids. `@layer lesson` lights the right half off
    `:root[data-read-lang]`, so the drawing is correct before this
    runs and `aria-pressed` catches up. */
export function ReadLangSwitch() {
  const [lang, setLang] = useState<ReadLang | null>(null);

  useEffect(() => { setLang(read()); }, []);

  const choose = (next: ReadLang): void => {
    document.documentElement.setAttribute("data-read-lang", next);
    /* The tools read `data-tool-lang` off the same key, so a
       lesson switched to English switches the calculators too.
       One choice, one key: the alternative is a reader setting
       their language twice and wondering which one lost. */
    document.documentElement.setAttribute("data-tool-lang", next);
    setLang(next);
    try { localStorage.setItem("tool-lang", next); } catch { /* private mode */ }
    try {
      const raw = JSON.parse(localStorage.getItem("reader-prefs") || "{}") as
        Record<string, unknown>;
      localStorage.setItem("reader-prefs", JSON.stringify({ ...raw, lang: next }));
      window.dispatchEvent(new CustomEvent("prefs:changed", { detail: { lang: next } }));
    } catch { /* private mode */ }
  };

  return (
    <div className="ls-lang" role="group" aria-label="ভাষা / Language">
      <button
        type="button"
        className="ls-lang-btn"
        data-half="bn"
        aria-pressed={lang === null ? undefined : lang === "bn"}
        onClick={() => choose("bn")}
        lang="bn"
      >
        বাংলা
      </button>
      <button
        type="button"
        className="ls-lang-btn"
        data-half="en"
        aria-pressed={lang === null ? undefined : lang === "en"}
        onClick={() => choose("en")}
      >
        English
      </button>
    </div>
  );
}

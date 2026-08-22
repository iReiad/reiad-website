/* ============================================================
   diet/lang.tsx: both languages in the HTML, one on the screen.

   The site is Bangla-first everywhere and the tools are the one
   place with a real switch. This tool is the largest body of
   explanatory prose outside the schools, so the rule bites
   hardest here: a Bangla reader should never have to read
   English to find out that something exists in their own
   language.

   ---- why both are rendered and the stylesheet chooses ----

   The obvious build is a component that reads the preference and
   returns one string. It cannot work here, and the reason is the
   one `next/components/scripts.tsx` exists for.

   The preference lives in localStorage, which the server cannot
   see. So the server would render English, the browser would
   hydrate and render Bangla, and React would throw #418 and
   discard the difference: exactly the failure that left every
   calculator on this site blank for a day.

   So both languages are in the markup and `@layer diet` shows
   one, keyed on `data-tool-lang`, which `shell.tsx` sets from
   the same `tool-lang` key before the first paint. The switch
   writes that attribute and the page changes in the same frame,
   with no request, no re-render and no flash. It also works with
   JavaScript off, and a screen reader gets one language because
   the other is `display: none` rather than hidden with opacity.

   The cost is that both languages ship. For a tool whose text is
   labels and short explanations that is a few kilobytes, and it
   buys the only version of this that is correct.

   ---- and the switch is not a second preference ----

   `tool-lang` is what the stock check has read since long before
   there were accounts, and `prefs.ts` writes it from the account
   page. One choice, one key, carried between devices by
   `sync.ts` under `reader-prefs`. A reader who set the stock
   check to Bangla arrives here already in Bangla.
   ============================================================ */

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { bnNum } from "@reiad/shared/schools";

/** One phrase, twice.

    `lang` on each half is not decoration: it is what tells a
    screen reader which voice to use, and what lets the
    stylesheet give Bangla its own leading, which is 1.9 against
    English's 1.7. */
export function T({ en, bn }: { en: ReactNode; bn: ReactNode }) {
  return (
    <>
      <span className="t-en" lang="en">{en}</span>
      <span className="t-bn" lang="bn">{bn}</span>
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

/** The language, for the few strings that CANNOT be rendered
    twice and hidden.

    `<option>` is the whole list of them: its text is drawn by
    the operating system, so a span inside it is not a span, it
    is characters. The same goes for an `aria-label`, a `title`
    and a `placeholder`, which are attributes rather than nodes.

    It returns "en" on the server AND on the first client render,
    which is not a default, it is the contract: matching what the
    server sent is what stops React discarding the page. The real
    value arrives in an effect, one frame later, and the cost is
    a flash inside two `<select>` boxes. Everything that can be
    rendered twice uses `T` and has no flash at all, which is why
    that is the one to reach for first.

    It listens, because the switch is a sibling rather than a
    parent: pressing it writes the attribute, and every reader of
    this hook has to hear about it. */
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

/** The switch.

    It renders with no pressed state on the server and takes one
    from the attribute on mount. That is deliberate rather than
    lazy: the attribute is the state, the stylesheet has already
    answered it before this component exists, and giving the
    server a guess at which half to mark would reintroduce the
    hydration mismatch this whole file exists to avoid.

    WHICH LEFT IT LOOKING BROKEN FOR A PAINT. Neither half was
    lit until an effect ran, so a Bangla reader's first sight of
    their own switch was two grey buttons. `@layer diet` lights
    it off `:root[data-tool-lang]`, which the boot script has
    already set, so the drawing is right before this component
    exists and `aria-pressed` catches up. `data-half` is what the
    stylesheet needs to tell the two apart without depending on
    child order. */
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

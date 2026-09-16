"use client";

/* What pressing this would look like: every reading option carries a
   small picture of itself, because a row of chips reading "Compact",
   "Narrow", "Dark" asks a reader to imagine the result.

   Each picture is made of the site's own tokens, so it cannot drift
   from the thing it previews. THEME is drawn rather than applied,
   because applying it would mean three copies of the page. */

import type { CSSProperties } from "react";
import type { Prefs } from "/prefs.js";

/** A style object with custom properties on it. React's
    `CSSProperties` cannot express one, which is the same cast
    `shell.tsx` and `footer.tsx` make. */
const vars = (o: Record<string, string>): CSSProperties => o as CSSProperties;

/** The three measures as they really are, so the tiles differ by
    exactly what the setting differs by. */
const MEASURE_W: Record<string, string> = {
  narrow: "30px", normal: "40px", wide: "48px",
};

/** The type scale, at the size it sets. */
const SCALE_SIZE: Record<string, string> = {
  small: "15px", normal: "19px", large: "24px",
};

/** Bengali digits, which is what the calculators open in. */
const DIGITS: Record<string, string> = { bn: "১২৩", en: "123" };

export function PrefSwatch({ row, id }: {
  /** Which preference this is a picture of. */
  row: keyof Prefs;
  /** Which of its options. */
  id: string;
}) {
  switch (row) {
    /* The letters, at the size. */
    case "text":
      return (
        <span className="pref-swatch" aria-hidden="true">
          <i className="pref-swatch-ink"
             style={{ fontSize: SCALE_SIZE[id] ?? "19px" }}>Aa</i>
        </span>
      );

    /* A column at the width, with a short last line, which is
       what a paragraph looks like. */
    case "measure":
      return (
        <span className="pref-swatch" aria-hidden="true">
          <i className="pref-swatch-lines"
             style={vars({ "--w": MEASURE_W[id] ?? "40px" })}>
            <i /><i /><i />
          </i>
        </span>
      );

    /* Two halves of a page. `system` shows both, split, which is
       what following the operating system means. The two grounds
       are tokens rather than four hex values because this is the
       one drawing on the site that has to show a theme it is not
       in, and a copy of the palette in a component is a copy that
       stops matching the palette. */
    case "theme":
      return (
        <span className="pref-swatch" aria-hidden="true">
          <i className="pref-swatch-theme" style={vars(
            id === "light"
              ? { "--half-a": "var(--ground-light)",
                  "--half-b": "var(--ground-light-sunk)" }
              : id === "dark"
                ? { "--half-a": "var(--ground-dark)",
                    "--half-b": "var(--ground-dark-sunk)" }
                : { "--half-a": "var(--ground-light)",
                    "--half-b": "var(--ground-dark)" })}>
            <i /><i />
          </i>
        </span>
      );

    /* The digits themselves. A reader who has never seen ১২৩
       learns more from one look at it than from the word
       "Bangla". */
    case "lang":
      return (
        <span className="pref-swatch" aria-hidden="true">
          <i className="pref-swatch-ink" lang={id === "bn" ? "bn" : "en"}
             style={{ fontSize: "18px" }}>{DIGITS[id] ?? "123"}</i>
        </span>
      );

    default:
      return null;
  }
}

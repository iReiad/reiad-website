"use client";

/* ============================================================
   account/pref-swatch.tsx: what pressing this would look like.

   The appearance panel used to be rows of chips reading "Frost",
   "Paper", "Soft", "Deep", "Narrow", "Wide", which is a reader
   being asked to imagine eleven materials and three blurs from
   their names. Every option carries a picture of itself now.

   ---- the picture is made of the same tokens the site is ----

   Not a screenshot, not an icon: the finish swatch is a real
   piece of the material, painted from `--glass-fill`,
   `--glass-grain` and `--glass-blur` exactly as the top bar is.
   So it cannot drift from the thing it previews, and a finish
   added tomorrow draws here without this file learning its name.

   The one stylesheet change that made it possible is
   `[data-finish]` in `@layer tokens`: a finish is declared on
   `:root[data-glass="x"]` AND on `[data-finish="x"]`, so an
   element can wear a material the document is not wearing.

   ---- and a swatch is a window, not a square ----

   Half of what a finish does is to what is BEHIND it. A face
   over nothing shows a texture and no glass, and a blur over a
   flat ground shows nothing at all, because a blur is only
   visible on an edge. So every glass swatch is two layers: a lit
   ground with a hard edge across it, and the material over that.

   ---- three of them cannot be previewed from tokens ----

   VEIL is drawn by mixing the alpha in by hand rather than by
   setting `--glass-veil` on the swatch. `--glass-base` names that
   token and is declared on `:root`, and a custom property
   substitutes on the element it is declared on, so a scoped veil
   would change nothing. The mix is the same arithmetic one step
   later.

   SOUND has no picture. The chip plays the cue instead, which is
   the only honest preview of a sound, and the bars say which of
   the two it is.

   THEME is drawn rather than applied, because applying it would
   mean three copies of the page.
   ============================================================ */

import type { CSSProperties, ReactNode } from "react";
import type { Prefs } from "/prefs.js";

/** A style object with custom properties on it. React's
    `CSSProperties` cannot express one, which is the same cast
    `shell.tsx` and `footer.tsx` make. */
const vars = (o: Record<string, string>): CSSProperties => o as CSSProperties;

/** The window: a lit ground with a hard edge across it, and
    whatever is handed in over the top. */
function Window({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="pref-swatch" style={style} aria-hidden="true">
      <i className="pref-swatch-lit" />
      {children}
    </span>
  );
}

/** The three measures as they really are, so the tiles differ by
    exactly what the setting differs by. */
const MEASURE_W: Record<string, string> = {
  narrow: "30px", normal: "40px", wide: "48px",
};

/** The type scale, at the size it sets. */
const SCALE_SIZE: Record<string, string> = {
  small: "15px", normal: "19px", large: "24px",
};

/** The veil's alpha, which is the number in `VEILS`. Written here
    rather than read off the option because the panel hands this
    component an id and the table is the module's. */
const VEIL_A: Record<string, string> = {
  clear: "0.54", normal: "0.72", dense: "0.9",
};

const BLUR_A: Record<string, string> = {
  soft: "0.55", normal: "1", deep: "1.7",
};

const TEX_A: Record<string, string> = {
  faint: "0.5", normal: "1", strong: "1.6",
};

/** Bengali digits, which is what the calculators open in. */
const DIGITS: Record<string, string> = { bn: "১২৩", en: "123" };

export function PrefSwatch({ row, id, now }: {
  /** Which preference this is a picture of. */
  row: keyof Prefs;
  /** Which of its options. */
  id: string;
  /** Everything else the reader has chosen, because three of
      these previews are only honest against the rest: a texture
      is a texture OF a finish, and a blur is a blur of one too. */
  now: Prefs;
}) {
  switch (row) {
    /* The material itself, wearing its own name. */
    case "glass":
      return (
        <Window>
          <i className="pref-swatch-face" data-finish={id} />
        </Window>
      );

    /* The reader's current finish at three strengths, because
       "Strong" means nothing on its own: it is more of whatever
       they have already chosen. */
    case "texture":
      return (
        <Window>
          <i className="pref-swatch-face" data-finish={now.glass}
             style={vars({ "--tex-strength": TEX_A[id] ?? "1" })} />
        </Window>
      );

    /* The same, at three radii. The hard edge in the ground is
       the whole of what makes a blur visible. */
    case "blur":
      return (
        <Window>
          <i className="pref-swatch-face" data-finish={now.glass}
             style={vars({ "--glass-amount": BLUR_A[id] ?? "1" })} />
        </Window>
      );

    /* Transparency, mixed by hand. See the note at the top about
       why setting `--glass-veil` here would do nothing. */
    case "veil":
      return (
        <Window>
          <i className="pref-swatch-face" data-finish={now.glass}
             style={vars({
               "--glass-fill": `color-mix(in oklab, var(--glass-solid) `
                 + `${Number(VEIL_A[id] ?? "0.72") * 100}%, transparent)`,
             })} />
        </Window>
      );

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
       what following the operating system means. */
    case "theme":
      return (
        <span className="pref-swatch" aria-hidden="true">
          {/* The two grounds by name. They are tokens rather than
              four hex values because this is the one drawing on
              the site that has to show a theme it is not in, and
              a copy of the palette in a component is a copy that
              stops matching the palette. */}
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

    /* Three bars rising, or one flat. The cue the chip plays is
       the real preview. */
    case "sound":
      return (
        <span className="pref-swatch" aria-hidden="true">
          <i className="pref-swatch-bars">
            {(id === "off" ? ["3px"] : ["8px", "16px", "11px"]).map((h, i) => (
              <i key={i} style={vars({ "--h": h })} />
            ))}
          </i>
        </span>
      );

    /* A little rain over the accent ground.

       Drawn here rather than by `@layer weather`, which is the
       real thing on the page: that layer answers `data-weather`
       on `<html>` and nothing else, deliberately, because it has
       to cost a page with no weather on it nothing at all. A
       swatch cannot set an attribute on the root without raining
       on the whole account page. */
    case "weather":
      return (
        <Window>
          {id === "on" ? <i className="pref-swatch-sky" /> : null}
        </Window>
      );

    default:
      return null;
  }
}

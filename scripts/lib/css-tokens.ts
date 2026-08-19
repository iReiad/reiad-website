/* ============================================================
   lib/css-tokens.ts: what a token in `styles.css` actually is,
   as a colour, in one mode.

   Two checks ask that question and they used to ask it with two
   copies of the same parser. `check-contrast.mjs` measures whether
   a colour can be read; `check-surfaces.mjs` measures whether a
   raised surface is still raised. Both need `--panel` resolved
   through a `var()`, a `light-dark()`, a `color-mix()` and an
   accent, and a second copy of that is a second thing to get
   wrong: this file's own history is a parser that read a comment
   as a declaration for a fortnight.

   `..` is one level further up from here than it was, which is
   the only edit made while moving this.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/* The stylesheet with its prose taken out.

   Not tidiness: the comments in this file explain the tokens, so
   they QUOTE them. One of them says `--accent: blue` while
   describing a bug, and this file read that as the first
   declaration of `--accent` and resolved every surface on the
   site against it. Nothing failed; twenty-eight pairs reported
   "could not be resolved" and the twenty-one that did resolve
   measured the wrong colour. A parser that reads prose as code is
   a parser that measures whatever the last person wrote about. */
const CSS = readFileSync(join(ROOT, "next", "styles", "site.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "");

/* ============================================================
   OKLCH to a luminance
   ============================================================ */

/** A colour in OKLab with an alpha, which is the one shape
    everything below passes around. Held in OKLab rather than
    OKLCH because that is what `color-mix(in oklab, ...)`
    interpolates in, and the stylesheet mixes. */
export interface Lab {
  L: number;
  a: number;
  b: number;
  alpha: number;
}

/** Linear sRGB, three channels 0..1, clamped to gamut. */
type Rgb = [r: number, g: number, b: number];

const cube = (x: number): number => x * x * x;

/** OKLCH (L 0..1, C, H degrees) to OKLab, which is the space
    everything below works in.

    Colours are held as OKLab rather than OKLCH because that is
    what `color-mix(in oklab, ...)` interpolates in, and the
    stylesheet mixes now: a panel is its base colour with a trace
    of the page's accent in it. Mixing in polar coordinates would
    take the long way round the hue circle and give a different
    answer from the browser's. */
const oklchToLab = (L: number, C: number, H: number): Lab => {
  const h = (H * Math.PI) / 180;
  return { L, a: C * Math.cos(h), b: C * Math.sin(h), alpha: 1 };
};

/** OKLab to linear sRGB, clamped to gamut. */
function oklabToLinear({ L, a, b }: Lab): Rgb {
  const l = cube(L + 0.3963377774 * a + 0.2158037573 * b);
  const m = cube(L - 0.1055613458 * a - 0.0638541728 * b);
  const s = cube(L - 0.0894841775 * a - 1.2914855480 * b);

  const clamp = (v: number): number => Math.min(1, Math.max(0, v));
  return [
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

/** WCAG relative luminance. The coefficients are the sRGB ones
    and the input is already linear, which is the whole reason
    the conversion above stops where it does. */
const luminance = ([r, g, b]: Rgb): number =>
  0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Two colours in OKLab, as a WCAG contrast ratio. */
function ratio(fg: Lab, bg: Lab): number {
  const a = luminance(oklabToLinear(fg));
  const b = luminance(oklabToLinear(bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** `a` over `b`, which is what a translucent surface actually
    shows a reader.

    A panel is 86% opaque over the page, so measuring the panel's
    own colour would measure something nobody sees. What is on
    screen is the panel composited over the ground beneath it. */
const over = (a: Lab, b: Lab): Lab => (a.alpha >= 1 ? a : {
  L: a.L * a.alpha + b.L * (1 - a.alpha),
  a: a.a * a.alpha + b.a * (1 - a.alpha),
  b: a.b * a.alpha + b.b * (1 - a.alpha),
  alpha: 1,
});

/** `color-mix(in oklab, A p%, B)`: p of A, the rest of B.

    PREMULTIPLIED, because that is what CSS does and the
    difference is not subtle. Mixing a colour with `transparent`
    is how a translucent surface is written, and interpolating the
    channels straight would drag the result toward black: 86% of a
    near-white panel would come out at 86% lightness rather than
    at the panel's own colour with 0.86 alpha. That is a 5.67:1
    pair reading 3.87:1, which is what it did until this was
    fixed. */
function mix(a: Lab, b: Lab, p: number): Lab {
  const q = 1 - p;
  const alpha = a.alpha * p + b.alpha * q;
  if (alpha === 0) return { L: 0, a: 0, b: 0, alpha: 0 };

  /* Interpolate premultiplied, then divide the alpha back out. */
  return {
    L: (a.L * a.alpha * p + b.L * b.alpha * q) / alpha,
    a: (a.a * a.alpha * p + b.a * b.alpha * q) / alpha,
    b: (a.b * a.alpha * p + b.b * b.alpha * q) / alpha,
    alpha,
  };
}

/* ============================================================
   Reading the tokens out of the stylesheet

   The values are the stylesheet's, parsed, rather than a second
   copy written here. A check with its own copy of the palette is
   a check that passes while the site fails.
   ============================================================ */

/** `--h-green: 162;` and friends. */
function hues(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [, name, value] of CSS.matchAll(/--h-([a-z-]+):\s*([\d.]+);/g)) {
    out[`--h-${name}`] = Number(value);
  }
  return out;
}

const HUES = hues();

/** `oklch(41% 0.08 var(--h-green))`, with an optional `/ alpha`. */
function parseOklch(text: string): Lab | null {
  const m = text.trim().match(
    /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+(?:var\(\s*(--h-[a-z-]+)\s*\)|([\d.]+))\s*(?:\/\s*([\d.]+)\s*)?\)$/);
  if (!m) return null;
  const hue = m[3] ? HUES[m[3]] : Number(m[4]);
  if (hue === undefined) return null;
  const colour = oklchToLab(Number(m[1]) / 100, Number(m[2]), hue);
  if (m[5] !== undefined) colour.alpha = Number(m[5]);
  return colour;
}

/* ---------- the declarations, as written ---------- */

/** Which theme a token is being read in. */
export type Mode = "light" | "dark";

/** `--name` to the text on the right of the colon, unresolved:
    `var(...)`, `color-mix(...)` and `oklch(...)` are all still
    strings here. `resolve()` is what turns one into a colour. */
type Decls = Record<string, string>;

/** Every `--name: <value>;` in the stylesheet, as text, split into
    the two modes.

    ---- why this is not one map any more ----

    It was, and it worked while every token that differed between
    themes was written as `light-dark(a, b)`: one declaration, two
    values inside it, and reading the first occurrence of each name
    was enough.

    The surfaces stopped being written that way, because
    `color-mix()` CANNOT CONTAIN `light-dark()`: the property does
    not compute at all, the background lands at rgba(0,0,0,0) and
    the border shorthand is dropped with it. So a tinted surface is
    now a light block and a dark block declaring the same name
    twice, and first-wins reads the light one in both modes. Every
    dark pair was measured against a near-white panel and failed at
    1.19:1, which is a real reading of a colour the site never
    paints.

    So: which region a declaration is in decides which map it goes
    into, and dark starts as a copy of light because a token the
    dark blocks do not mention keeps its value. */
function declarations(): { light: Decls; dark: Decls } {
  const light: Decls = {};
  const darkOnly: Decls = {};

  /* Balanced to three levels of brackets, which is what
     `color-mix(in oklab, var(--accent) 4%, color-mix(in srgb,
     var(--panel-base) 86%, transparent))` needs. */
  const VALUE = String.raw`(?:[^;()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))+`;
  const DECL = new RegExp(String.raw`(--[a-z0-9-]+):\s*(${VALUE});`, "g");

  /* The two ways this stylesheet says "dark". Both are needed:
     the media query is the reader's system setting and the
     attribute is the toggle, and the toggle has to win in both
     directions, so every dark value is written twice. */
  const DARK = /prefers-color-scheme:\s*dark|\[data-theme=["']dark["']\]/;

  /* Walk the braces, carrying whether the region we are inside is
     a dark one. The text since the last brace or semicolon is the
     selector or at-rule that opened it. */
  let depth = 0;
  const dark = [false];
  let since = 0;

  for (let i = 0; i < CSS.length; i += 1) {
    const c = CSS[i];
    if (c === "{") {
      const head = CSS.slice(since, i);
      depth += 1;
      dark[depth] = dark[depth - 1] || DARK.test(head);
      since = i + 1;
    } else if (c === "}") {
      const body = CSS.slice(since, i);
      const into = dark[depth] ? darkOnly : light;
      for (const [, name, value] of body.matchAll(DECL)) {
        if (!(name in into)) into[name] = value.trim();  // the first wins, as in the cascade
      }
      depth = Math.max(0, depth - 1);
      since = i + 1;
    } else if (c === ";") {
      /* A declaration ends here, so anything after it is the head
         of the next rule rather than part of this one. Collect it
         now: a block that opens another block still has its own
         declarations, and they are in the text before the `{`. */
      const body = CSS.slice(since, i + 1);
      const into = dark[depth] ? darkOnly : light;
      for (const [, name, value] of body.matchAll(DECL)) {
        if (!(name in into)) into[name] = value.trim();
      }
      since = i + 1;
    }
  }

  return { light, dark: { ...light, ...darkOnly } };
}

const DECLS_BY_MODE = declarations();

/** The declarations that apply in one mode. */
const decls = (mode: Mode): Decls =>
  (mode === "dark" ? DECLS_BY_MODE.dark : DECLS_BY_MODE.light);

/** Split `a, b` at the top level, ignoring commas inside brackets. */
function parts(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let at = 0;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === "(") depth += 1;
    else if (c === ")") depth -= 1;
    else if (c === "," && depth === 0) { out.push(text.slice(at, i)); at = i + 1; }
  }
  out.push(text.slice(at));
  return out.map((x) => x.trim());
}

/**
 * One value, in one mode, as OKLab.
 *
 * Handles what the stylesheet actually writes: an `oklch()`, a
 * `light-dark()` pair, a `var()` naming another token, a
 * `color-mix()` in either space, and `transparent`.
 *
 * Returns null for anything else, and the caller reports that
 * rather than skipping it. A check that quietly stops measuring
 * is worse than one that fails: ten pairs went unmeasured the
 * moment `--panel` became a mix, and the only thing that noticed
 * was the count in this file's own output.
 */
/** A percentage, as a fraction of one.

    `8%`, `var(--tint-panel)` naming a `light-dark(8%, 17%)`, or
    `calc(var(--tint-panel) + 6%)`, which is how a hover state
    says "a little more than a panel" without repeating the
    ladder. */
function percent(
  text: string | undefined, mode: Mode, depth = 0,
): number | null {
  const t = String(text ?? "").trim();
  if (depth > 8) return null;

  const lit = /^([\d.]+)%$/.exec(t);
  if (lit) return Number(lit[1]) / 100;

  const name = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(t)?.[1];
  if (name) return percent(decls(mode)[name], mode, depth + 1);

  const ld = /^light-dark\(([\s\S]*)\)$/.exec(t);
  if (ld) {
    const [light, dark] = parts(ld[1]);
    return percent(mode === "dark" ? dark : light, mode, depth + 1);
  }

  /* Only addition and subtraction of two terms, which is all the
     stylesheet writes. Anything else returns null and the caller
     reports it rather than guessing. */
  const sum = /^calc\(([\s\S]+?)\s*([+-])\s*([\s\S]+?)\)$/.exec(t);
  if (sum) {
    const a = percent(sum[1], mode, depth + 1);
    const b = percent(sum[3], mode, depth + 1);
    if (a === null || b === null) return null;
    return sum[2] === "+" ? a + b : a - b;
  }

  return null;
}

function resolve(
  value: string | undefined,
  mode: Mode,
  seen = new Set<string>(),
  accent: string | null = null,
): Lab | null {
  const text = String(value ?? "").trim();
  if (!text) return null;

  if (text === "transparent") return { L: 0, a: 0, b: 0, alpha: 0 };

  if (text.startsWith("oklch(")) return parseOklch(text);

  const varName = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(text)?.[1];
  if (varName) {
    /* `--accent` is whatever the page is wearing, so a surface
       that mixes it is a different colour in each section. The
       caller names one and every token downstream follows, which
       is how the seven sections get measured rather than only the
       default green. */
    if (varName === "--accent" && accent) {
      return resolve(`var(${accent})`, mode, seen, accent);
    }
    if (seen.has(varName)) return null;             // a token naming itself
    return resolve(decls(mode)[varName], mode, new Set([...seen, varName]), accent);
  }

  const ld = /^light-dark\(([\s\S]*)\)$/.exec(text);
  if (ld) {
    const [light, dark] = parts(ld[1]);
    return resolve(mode === "dark" ? dark : light, mode, seen, accent);
  }

  const cm = /^color-mix\(([\s\S]*)\)$/.exec(text);
  if (cm) {
    const [space, first, second] = parts(cm[1]);
    if (!/^in\s+(oklab|srgb|oklch)$/i.test(space)) return null;

    /* The percentage can be a literal, a `var()` naming one, or a
       `calc()` of the two. It is a token because the right tint
       is not the same in both themes and one number has to be
       wrong in one of them, so this has to follow the same
       indirection every colour does. */
    const split = /^([\s\S]*?)\s*(\S+%|var\([^()]*\)|calc\([^()]*\))\s*$/.exec(first);
    if (!split) return null;
    const p = percent(split[2], mode);
    if (p === null) return null;

    const a = resolve(split[1], mode, seen, accent);
    const b = resolve(second, mode, seen, accent);
    if (!a || !b) return null;
    return mix(a, b, p);
  }

  return null;
}

/** Every `--name: light-dark(oklch(...), oklch(...));` token.

    Every declaration is resolved in both modes through
    `resolve()` above, so a token is measured whatever it is
    written as: a literal, a `light-dark()` pair, a `var()` naming
    another, or a `color-mix()`. It used to read `light-dark(oklch,
    oklch)` and nothing else, which is why ten pairs stopped being
    measured the day `--panel` became a mix. */
/** One token, resolved in both themes. Every check that measures
    a colour reads this shape. */
export interface TokenPair {
  light: Lab;
  dark: Lab;
}

function tokens(): Record<string, TokenPair> {
  const out: Record<string, TokenPair> = {};
  for (const name of new Set([...Object.keys(DECLS_BY_MODE.light), ...Object.keys(DECLS_BY_MODE.dark)])) {
    const light = resolve(`var(${name})`, "light");
    const dark = resolve(`var(${name})`, "dark");
    if (light && dark) out[name] = { light, dark };
  }
  return out;
}


export { CSS, HUES, over, mix, ratio, luminance, oklabToLinear, oklchToLab,
         parseOklch, parts, percent, resolve, tokens, decls, DECLS_BY_MODE };

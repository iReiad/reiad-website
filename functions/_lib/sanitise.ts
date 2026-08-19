/* _lib/sanitise.ts: server-side HTML cleaning.

   The Studio sanitises what you paste, which protects the person
   pasting and not the site: a client-side sanitiser is bypassed by
   anyone who can reach the write endpoint directly. Anything
   stored and later rendered is cleaned again here, where it cannot
   be skipped.

   Workers have no DOM, so this is a tokeniser rather than a
   DOMParser pass, and allowlist-only: anything not named below is
   dropped, tags and attributes alike.

   ALLOWED_CLASSES is the twin of KEEP_CLASSES in aab/editor.js and
   the two must agree. `check-css.ts` fails if they drift, or if a
   class is allowed here and styled nowhere. */

/* `class` is allowed on most of these because the article blocks
   the Studio inserts are built out of ordinary tags with a class
   on them: a box of quick answers is a <div> holding a <p> label
   and a <ul>, and the steps are an <ol>. The class is the whole
   difference between that and a bare list, and it survives only
   what ALLOWED_CLASSES below permits. */
const ALLOWED: Record<string, string[]> = {
  p: ["class"], h2: [], h3: [], ul: ["class"], ol: ["class"], li: [],
  blockquote: [],
  strong: [], em: [], br: [], hr: [], code: [], sup: [], sub: [],
  figure: ["class"], figcaption: [], div: ["class"],
  table: [], thead: [], tbody: [], tr: [], th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
  a: ["href", "title", "class", "rel"],
  img: ["src", "alt", "width", "height", "loading", "decoding"],
};

/* Only these class names survive: they're the ones the stylesheet
   knows about. Anything else is styling smuggled in from outside.

   This list is the twin of KEEP_CLASSES in aab/studio.js. When the
   two disagreed the browser's was the stricter one, and the result
   was a server that supported callouts nothing could produce. Add
   to one, add to the other. */
const ALLOWED_CLASSES: Set<string> = new Set([
  /* photos: how big, what shape, and which part to keep */
  "wide", "full", "duo", "lead-photo",
  "frame-wide", "frame-square", "frame-tall", "focus-top", "focus-bottom",
  /* the blocks a long read is made of */
  "at-a-glance", "at-a-glance-label", "side-note", "side-note-label",
  "step-list", "checklist", "figures", "fig",
  "table-scroll", "term", "note", "ex",
]);

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;
const SAFE_IMG = /^(https?:\/\/|\/|data:image\/(png|jpeg|webp|gif|svg\+xml);)/i;

const escapeText = (s: string): string =>
  s.replace(/&(?![a-z#0-9]+;)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cleanAttrs(tag: string, raw: string): string {
  const allowed = ALLOWED[tag];
  if (!allowed?.length) return "";

  const out: string[] = [];
  for (const m of raw.matchAll(/([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
    const name = m[1].toLowerCase();
    const value = (m[3] ?? m[4] ?? "").trim();
    if (!allowed.includes(name)) continue;

    if (name === "href" && !SAFE_URL.test(value)) continue;
    if (name === "src" && !SAFE_IMG.test(value)) continue;
    if (name === "class") {
      const kept = value.split(/\s+/).filter((c) => ALLOWED_CLASSES.has(c));
      if (!kept.length) continue;
      out.push(`class="${kept.join(" ")}"`);
      continue;
    }
    if ((name === "width" || name === "height") && !/^\d{1,5}$/.test(value)) continue;

    out.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
  }

  // Any link that survived leaves this site, so make it safe to click.
  if (tag === "a" && out.some((a) => a.startsWith("href=")) &&
      !out.some((a) => a.startsWith("rel="))) {
    out.push('rel="noopener"');
  }
  return out.length ? " " + out.join(" ") : "";
}

export function sanitiseHTML(input: unknown): string {
  if (!input) return "";

  // Drop whole dangerous elements, contents and all, before tokenising.
  let html = String(input)
    .replace(/<(script|style|iframe|object|embed|form|input|button|svg|math)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|input|button)\b[^>]*\/?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const open: string[] = [];
  let out = "";
  let last = 0;

  for (const m of html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g)) {
    out += escapeText(html.slice(last, m.index));
    last = m.index + m[0].length;

    const tag = m[1].toLowerCase();
    const closing = m[0].startsWith("</");
    if (!(tag in ALLOWED)) continue;                 // unknown tag: drop the tag, keep the text

    if (closing) {
      const at = open.lastIndexOf(tag);
      if (at === -1) continue;                       // stray close
      while (open.length > at) out += `</${open.pop()}>`;
    } else if (tag === "br" || tag === "hr" || tag === "img") {
      out += `<${tag}${cleanAttrs(tag, m[2])}>`;
    } else {
      out += `<${tag}${cleanAttrs(tag, m[2])}>`;
      open.push(tag);
    }
  }
  out += escapeText(html.slice(last));

  // Anything the author left open, we close.
  while (open.length) out += `</${open.pop()}>`;

  return out.trim();
}

/** Plain text out of cleaned HTML, for reading time and search. */
export const textOf = (html: unknown): string =>
  String(html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/** `unknown` like `textOf` above, and for the same reason: this
    is handed whatever a row's body column held, which is a string
    on every path anybody has written and is not a promise the
    database makes. */
export const readingMinutes = (html: unknown): number =>
  Math.max(1, Math.round(textOf(html).split(" ").filter(Boolean).length / 200));

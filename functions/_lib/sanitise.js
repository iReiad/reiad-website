/* ============================================================
   _lib/sanitise.js — server-side HTML cleaning.

   The Studio already sanitises what you paste, but that protects
   the person doing the pasting, not the site: a client-side
   sanitiser is trivially bypassed by anyone who can reach the
   write endpoint directly. So anything that ends up stored and
   later rendered gets cleaned again here, where it can't be
   skipped.

   Workers have no DOM, so this is a small tokeniser rather than a
   DOMParser pass. It is deliberately allowlist-only: anything not
   explicitly permitted is dropped, tags and attributes alike.
   ============================================================ */

const ALLOWED = {
  p: [], h2: [], h3: [], ul: [], ol: [], li: [], blockquote: [],
  strong: [], em: [], br: [], hr: [], code: [], sup: [], sub: [],
  figure: ["class"], figcaption: [], div: ["class"],
  table: [], thead: [], tbody: [], tr: [], th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
  a: ["href", "title", "class", "rel"],
  img: ["src", "alt", "width", "height", "loading", "decoding"],
};

/* Only these class names survive — they're the ones the stylesheet
   knows about. Anything else is styling smuggled in from outside. */
const ALLOWED_CLASSES = new Set([
  "wide", "duo", "table-scroll", "term", "note", "ex", "lead-photo",
]);

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;
const SAFE_IMG = /^(https?:\/\/|\/|data:image\/(png|jpeg|webp|gif|svg\+xml);)/i;

const escapeText = (s) =>
  s.replace(/&(?![a-z#0-9]+;)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cleanAttrs(tag, raw) {
  const allowed = ALLOWED[tag];
  if (!allowed?.length) return "";

  const out = [];
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

export function sanitiseHTML(input) {
  if (!input) return "";

  // Drop whole dangerous elements, contents and all, before tokenising.
  let html = String(input)
    .replace(/<(script|style|iframe|object|embed|form|input|button|svg|math)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|input|button)\b[^>]*\/?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const open = [];
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

/** Plain text out of cleaned HTML — for reading time and search. */
export const textOf = (html) =>
  String(html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const readingMinutes = (html) =>
  Math.max(1, Math.round(textOf(html).split(" ").filter(Boolean).length / 200));

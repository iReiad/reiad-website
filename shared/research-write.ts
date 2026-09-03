/* ============================================================
   shared/research-write.ts: the writing desk's arithmetic.

   Everything here reads the site's article HTML with citation
   chips in it and answers without a browser: the chips, the
   outline, the counts in both scripts, Markdown and LaTeX out,
   the claims audit and the self-overlap check. RESEARCH.md
   section 16. Pure on purpose, so scripts/research.test.ts can
   hold every one of them to a fixture.

   ---- a citation chip ----

   <a class="cite" href="#cite=KEY&loc=14&label=page">rendering</a>

   The key is the source's citation key, the locator is what the
   reader typed after the chip, and the text is whatever the
   document's style rendered last. Everything a style needs is in
   the href, so the text can be thrown away and made again.

   ---- a footnote ----

   <sup><a class="fn-ref" href="#fn-3">3</a></sup> in the prose and
   <ol class="fn"><li>…chips…</li></ol> at the foot. The number is
   the marker's position, never typed, and the note's chips form
   one cluster for a note style, which is what lets citeproc say
   ibid on the second citation of the same source.
   ============================================================ */

import type { CslItem } from "./research.ts";

export interface Chip { key: string; locator?: string; label?: string; suppress?: boolean }

export const chipHref = (c: Chip): string => {
  const p = new URLSearchParams({ cite: c.key });
  if (c.locator) p.set("loc", c.locator);
  if (c.label && c.label !== "page") p.set("label", c.label);
  if (c.suppress) p.set("sa", "1");
  return `#${p.toString()}`;
};

export function chipOf(href: string): Chip | null {
  if (!href.startsWith("#cite=")) return null;
  const p = new URLSearchParams(href.slice(1));
  const key = p.get("cite");
  if (!key) return null;
  return { key, locator: p.get("loc") ?? undefined, label: p.get("label") ?? undefined, suppress: p.get("sa") === "1" };
}

/** The HTML of a chip, with its current rendering as the text. */
export const chipHtml = (c: Chip, text: string): string =>
  `<a class="cite" href="${chipHref(c)}">${escape(text)}</a>`;

export const escape = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const unescape = (s: string): string =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

/** One attribute out of a tag's attribute string, whatever order
    the editor wrote them in: its sanitiser rebuilds every tag and
    puts href before class. */
export const attrOf = (attrs: string, name: string): string | null =>
  new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i").exec(attrs)?.[1] ?? null;

const hasClass = (attrs: string, cls: string): boolean =>
  (attrOf(attrs, "class") ?? "").split(/\s+/).includes(cls);

/* Every <a …>…</a>; the callback keeps the ones that are chips. */
const ANCHOR = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;

/** Replace every chip in `html` through `fn(href, text, whole)`;
    any other anchor is left alone. */
export function mapChips(html: string, fn: (href: string, text: string, whole: string) => string): string {
  return html.replace(ANCHOR, (whole, attrs: string, text: string) => {
    if (!hasClass(attrs, "cite")) return whole;
    const href = attrOf(attrs, "href");
    return href ? fn(href, text, whole) : whole;
  });
}

const MARKER = /<sup>\s*<a\b([^>]*)>([\s\S]*?)<\/a>\s*<\/sup>/gi;

/** Replace every footnote marker through `fn(n, whole)`. */
export function mapMarkers(html: string, fn: (n: number, whole: string) => string): string {
  return html.replace(MARKER, (whole, attrs: string) => {
    if (!hasClass(attrs, "fn-ref")) return whole;
    const n = Number(/#fn-(\d+)/.exec(attrOf(attrs, "href") ?? "")?.[1]);
    return n ? fn(n, whole) : whole;
  });
}

const NOTE_LIST = /<ol\b([^>]*)>([\s\S]*?)<\/ol>/gi;

/** The footnote list's inner HTML, and `html` without it. */
export function splitNotes(html: string): { inner: string | null; rest: string } {
  let inner: string | null = null;
  const rest = html.replace(NOTE_LIST, (whole, attrs: string, body: string) => {
    if (!hasClass(attrs, "fn")) return whole;
    inner = body;
    return "";
  });
  return { inner, rest };
}

const BIB = /<div\b[^>]*class="[^"]*\bbib\b[^"]*"[^>]*>[\s\S]*<\/div>/i;

const BLOCK = /<(h[1-6]|p|blockquote|ul|ol|div|figure|table|pre)\b[^>]*>[\s\S]*?<\/\1>|<hr\s*\/?>/gi;

/** The body with any text the editor left outside a block wrapped
    in a paragraph, and the bibliography block taken out: a
    contenteditable lets a first keystroke land before the first
    <p>, and every writer here walks blocks. */
export function normalise(html: string): string {
  const src = html.replace(BIB, "");
  let out = "";
  let last = 0;
  const stray = (s: string): string => s.replace(/&nbsp;|\s|<br\s*\/?>/g, "") ? `<p>${s.trim()}</p>` : "";
  for (const m of src.matchAll(BLOCK)) {
    out += stray(src.slice(last, m.index));
    out += m[0];
    last = (m.index ?? 0) + m[0].length;
  }
  return out + stray(src.slice(last));
}

/** Every chip in a body, in document order. */
export function chipsIn(html: string): Chip[] {
  const out: Chip[] = [];
  mapChips(html, (href, _t, whole) => { const c = chipOf(unescape(href)); if (c) out.push(c); return whole; });
  return out;
}

export const keysCited = (html: string): string[] => [...new Set(chipsIn(html).map((c) => c.key))];

/* ---------- text and counts ---------- */

export const textOf = (html: string): string =>
  unescape(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr|figcaption|figure)>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t]+/g, " ").trim();

/** Words in both scripts: a run of letters or digits, where a
    Bangla word is a run of Bengali letters, marks and virama, so
    a conjunct is one word rather than three. */
export const WORD = /[\p{L}\p{N}\p{M}\u09BC-\u09CD\u09D7]+(?:['’-][\p{L}\p{N}]+)*/gu;

export const countWords = (text: string): number => (text.match(WORD) ?? []).length;

export const readingMinutes = (words: number): number => Math.max(1, Math.round(words / 200));

/* ---------- what kind a document is ---------- */

/** The migration's own CHECK constraint, said once. `slides` joined
    it in 20260903100000_research_slides.sql; check-research.ts
    compares this list against that constraint by name. */
export const DOCUMENT_KINDS = ["chapter", "paper", "proposal", "abstract", "letter", "other", "slides"] as const;
export type DocumentKind = typeof DOCUMENT_KINDS[number];

/* ---------- the outline ---------- */

export interface Heading { level: 2 | 3; text: string; words: number; index: number }

/** The headings of a body with the words under each, which is the
    outline the desk draws and the meter under each heading. */
export function outlineOf(html: string): Heading[] {
  const parts = normalise(html).split(/(?=<h[23]\b)/i);
  const out: Heading[] = [];
  let index = 0;
  for (const part of parts) {
    const m = /^<h([23])\b[^>]*>([\s\S]*?)<\/h[23]>([\s\S]*)$/i.exec(part);
    if (!m) continue;
    out.push({ level: Number(m[1]) as 2 | 3, text: textOf(m[2]).trim(), words: countWords(textOf(m[3])), index });
    index += 1;
  }
  return out;
}

/* ---------- slides ---------- */

export interface Slide { title: string; bullets: string[] }

/** A kind-`slides` document as a deck: every h2 a slide, its own
    text the title, and its `<li>` items the bullets (its
    paragraphs where it holds no list). Content before the first
    h2 is not a slide, the same rule `outlineOf` uses. */
export function slidesOf(html: string): Slide[] {
  const parts = normalise(html).split(/(?=<h2\b)/i);
  const out: Slide[] = [];
  for (const part of parts) {
    const m = /^<h2\b[^>]*>([\s\S]*?)<\/h2>([\s\S]*)$/i.exec(part);
    if (!m) continue;
    const body = m[2];
    const bullets = [...body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((li) => textOf(li[1]).trim()).filter(Boolean);
    if (!bullets.length) for (const p of body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) { const t = textOf(p[1]).trim(); if (t) bullets.push(t); }
    out.push({ title: textOf(m[1]).trim(), bullets });
  }
  return out;
}

/* ---------- moving a section ---------- */

const HEADING_LEVEL = /^<h([23])\b/i;

/** The heading at outline index `from`, and everything under it
    down to (not including) the next heading of the same or
    higher level, moved to sit at outline index `to`: the standard
    array move, `from` spliced out and reinserted at `to` in the
    result. A heading's own subheadings move with it because they
    are between it and the next boundary. Out-of-range or a no-op
    move returns `html` unchanged. */
export function moveSection(html: string, from: number, to: number): string {
  const pieces = normalise(html).split(/(?=<h[23]\b)/i);
  const levelOf = (p: string): 2 | 3 | null => { const m = HEADING_LEVEL.exec(p); return m ? (Number(m[1]) as 2 | 3) : null; };
  const levels = pieces.map(levelOf);
  const headingAt: number[] = [];
  levels.forEach((lvl, i) => { if (lvl !== null) headingAt.push(i); });
  const n = headingAt.length;
  if (from < 0 || from >= n || to < 0 || to >= n || from === to) return html;
  const startPiece = headingAt[from];
  const level = levels[startPiece] as 2 | 3;
  let endPiece = startPiece + 1;
  while (endPiece < pieces.length && (levels[endPiece] ?? 0) > level) endPiece += 1;
  const section = pieces.slice(startPiece, endPiece);
  const without = [...pieces.slice(0, startPiece), ...pieces.slice(endPiece)];
  const withoutHeadingAt: number[] = [];
  without.forEach((p, i) => { if (levelOf(p) !== null) withoutHeadingAt.push(i); });
  const insertPiece = to < withoutHeadingAt.length ? withoutHeadingAt[to] : without.length;
  return [...without.slice(0, insertPiece), ...section, ...without.slice(insertPiece)].join("");
}

/* ---------- the glossary ---------- */

export interface GlossaryTerm { term: string; definition: string }

/** A term marked with `<dfn>`, its definition the rest of the
    paragraph; or a term bold at the start of a paragraph, its
    definition the rest of that paragraph. First use only, so a
    term explained once is not listed twice. */
export function glossaryOf(html: string): GlossaryTerm[] {
  const out: GlossaryTerm[] = [];
  const seen = new Set<string>();
  for (const block of normalise(splitNotes(html).rest).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const inner = block[1];
    for (const m of inner.matchAll(/<dfn\b[^>]*>([\s\S]*?)<\/dfn>/gi)) {
      const term = textOf(m[1]).trim();
      if (!term || seen.has(term.toLowerCase())) continue;
      const definition = textOf(inner.replace(m[0], "")).trim();
      if (!definition) continue;
      seen.add(term.toLowerCase());
      out.push({ term, definition });
    }
    const bold = /^\s*<strong\b[^>]*>([\s\S]*?)<\/strong>/i.exec(inner);
    if (bold) {
      const term = textOf(bold[1]).trim();
      const definition = textOf(inner.slice(bold[0].length)).trim();
      if (term && definition && !seen.has(term.toLowerCase())) { seen.add(term.toLowerCase()); out.push({ term, definition }); }
    }
  }
  return out;
}

/* ---------- footnotes ---------- */

/** The notes at the foot, in order: each one's inner HTML. */
export function notesOf(html: string): string[] {
  const list = splitNotes(html).inner ?? "";
  return [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => m[1]);
}

/** The markers in the prose, renumbered by position, and the
    notes list reordered to match. Called after every edit so a
    note deleted or moved never leaves a number behind. */
export function renumber(html: string): string {
  const notes = notesOf(html);
  let n = 0;
  const seen: number[] = [];
  const body = mapMarkers(splitNotes(html).rest, (old) => {
    n += 1;
    seen.push(old - 1);
    return `<sup><a class="fn-ref" href="#fn-${n}">${n}</a></sup>`;
  });
  const ordered = seen.map((i) => notes[i] ?? "");
  const list = ordered.length ? `<ol class="fn">${ordered.map((x) => `<li>${x}</li>`).join("")}</ol>` : "";
  return body.trimEnd() + list;
}

/* ---------- Markdown and LaTeX ---------- */

const inline = (html: string, cite: (c: Chip) => string): string =>
  mapChips(html, (href) => { const c = chipOf(unescape(href)); return c ? cite(c) : ""; })
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**").replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, h: string, t: string) => `[${t}](${unescape(h)})`)
    .replace(/<[^>]+>/g, "");

const pandocCite = (c: Chip): string =>
  `[${c.suppress ? "-" : ""}@${c.key}${c.locator ? `, ${c.label && c.label !== "page" ? c.label : "p."} ${c.locator}` : ""}]`;

/** Pandoc's Markdown: headings, lists, quotes, footnotes as
    `[^n]`, chips as `[@key, p. 14]`, which Pandoc and Quarto read
    with a bibliography beside it. */
export function toMarkdown(html: string, title?: string): string {
  const notes = notesOf(html);
  const body = mapMarkers(normalise(splitNotes(html).rest), (n) => `[^${n}]`);
  const blocks: string[] = [];
  if (title) blocks.push(`# ${title}`);
  for (const m of body.matchAll(/<(h2|h3|p|blockquote|ul|ol|div)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1].toLowerCase();
    const inner = m[2];
    if (tag === "h2") blocks.push(`## ${unescape(inline(inner, pandocCite)).trim()}`);
    else if (tag === "h3") blocks.push(`### ${unescape(inline(inner, pandocCite)).trim()}`);
    else if (tag === "blockquote") blocks.push(unescape(inline(inner, pandocCite)).trim().split("\n").map((l) => `> ${l}`).join("\n"));
    else if (tag === "ul" || tag === "ol") {
      const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((li, i) => `${tag === "ul" ? "-" : `${i + 1}.`} ${unescape(inline(li[1], pandocCite)).trim()}`);
      blocks.push(items.join("\n"));
    } else if (tag === "div" && /class="[^"]*\bbib\b/.test(m[0])) { /* the bibliography is Pandoc's to make */ }
    else { const t = unescape(inline(inner, pandocCite)).trim(); if (t) blocks.push(t); }
  }
  for (const [i, note] of notes.entries()) blocks.push(`[^${i + 1}]: ${unescape(inline(note, pandocCite)).trim()}`);
  return blocks.join("\n\n") + "\n";
}

const latexCite = (c: Chip): string =>
  `\\${c.suppress ? "citeyear" : "cite"}${c.locator ? `[${c.label && c.label !== "page" ? `${c.label} ` : "p.~"}${c.locator}]` : ""}{${c.key}}`;

const tex = (s: string): string => s.replace(/([\\{}$&#_%])/g, "\\$1").replace(/~/g, "\\textasciitilde{}").replace(/\^/g, "\\textasciicircum{}");

/** A LaTeX skeleton: sections, paragraphs, lists, quotations,
    footnotes and \cite{} with the key, for a journal that wants
    .tex; the BibTeX beside it is the library's. */
export function toLatex(html: string, title?: string): string {
  const notes = notesOf(html);
  const lines: string[] = [];
  if (title) lines.push(`\\title{${tex(title)}}`, "\\maketitle", "");
  const body = normalise(splitNotes(html).rest);
  const run = (s: string): string => {
    const withNotes = mapMarkers(s, (n) => `\u0000\\footnote{${run(notes[n - 1] ?? "")}}\u0000`);
    return mapChips(withNotes, (href) => { const c = chipOf(unescape(href)); return c ? `\u0000${latexCite(c)}\u0000` : ""; })
      .replace(/<strong>([\s\S]*?)<\/strong>/gi, "\u0000\\textbf{\u0000$1\u0000}\u0000").replace(/<em>([\s\S]*?)<\/em>/gi, "\u0000\\emph{\u0000$1\u0000}\u0000")
      .replace(/<[^>]+>/g, "")
      .split("\u0000").map((part, i) => i % 2 ? part : tex(unescape(part))).join("");
  };
  for (const m of body.matchAll(/<(h2|h3|p|blockquote|ul|ol|div)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1].toLowerCase();
    const inner = m[2];
    if (tag === "h2") lines.push(`\\section{${run(inner).trim()}}`, "");
    else if (tag === "h3") lines.push(`\\subsection{${run(inner).trim()}}`, "");
    else if (tag === "blockquote") lines.push("\\begin{quote}", run(inner).trim(), "\\end{quote}", "");
    else if (tag === "ul" || tag === "ol") {
      lines.push(tag === "ul" ? "\\begin{itemize}" : "\\begin{enumerate}");
      for (const li of inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) lines.push(`  \\item ${run(li[1]).trim()}`);
      lines.push(tag === "ul" ? "\\end{itemize}" : "\\end{enumerate}", "");
    } else if (tag === "div" && /class="[^"]*\bbib\b/.test(m[0])) { /* \bibliography{} below */ }
    else { const t = run(inner).trim(); if (t) lines.push(t, ""); }
  }
  lines.push("\\bibliographystyle{apalike}", "\\bibliography{library}", "");
  return lines.join("\n");
}

/* ---------- the claims audit ---------- */

export interface Claim { sentence: string; why: "number" | "claim"; cited: boolean; index: number }

const CLAIM_WORDS = /\b(shows?|showed|finds?|found|demonstrates?|demonstrated|significant(ly)?|proves?|proved|establishe[sd]|confirms?|confirmed|reveals?|revealed|evidence|according to|estimates?|estimated|increases?d?|decreases?d?|reduces?d?|causes?d?)\b/i;
const NUMBER = /(\d+([.,]\d+)?\s?(%|per cent|percent|million|billion|crore|lakh|bn|m\b|k\b)|\b\d{2,}(\.\d+)?\b)/i;

/** Every sentence holding a number or a claim word, and whether a
    chip sits within it. The ones with neither a chip nor an
    excuse are the reader's list. Sentences inside a footnote or
    the bibliography are not the reader's prose and are skipped. */
export function claimsOf(html: string): Claim[] {
  const prose = normalise(splitNotes(html).rest);
  const out: Claim[] = [];
  let index = 0;
  for (const block of prose.matchAll(/<(p|li|blockquote|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const marked = mapMarkers(mapChips(block[2], () => "\u0001"), () => "\u0001");
    const plain = unescape(marked.replace(/<[^>]+>/g, ""));
    for (const sentence of plain.split(/(?<=[.!?।])\s+/)) {
      const cited = sentence.includes("\u0001");
      const clean = sentence.replace(/\u0001/g, "").trim();
      if (!clean) continue;
      const why = NUMBER.test(clean) ? "number" : CLAIM_WORDS.test(clean) ? "claim" : null;
      if (why) out.push({ sentence: clean, why, cited, index });
      index += 1;
    }
  }
  return out;
}

/* ---------- the self-overlap check ---------- */

const shingles = (text: string, n: number): Map<string, number> => {
  const words = (text.toLowerCase().match(WORD) ?? []);
  const out = new Map<string, number>();
  for (let i = 0; i + n <= words.length; i += 1) {
    const s = words.slice(i, i + n).join(" ");
    if (!out.has(s)) out.set(s, i);
  }
  return out;
};

export interface Overlap { with: string; run: string; words: number }

/** Runs of `n` or more words the document shares with another
    text, by shingled n-grams, locally: an unquoted paraphrase too
    close to its source, seen before an examiner sees it. Only what
    the studio holds is compared, and the desk says so. */
export function overlapsOf(text: string, others: { name: string; text: string }[], n = 8): Overlap[] {
  const mine = (text.toLowerCase().match(WORD) ?? []);
  const out: Overlap[] = [];
  for (const other of others) {
    const theirs = shingles(other.text, n);
    let i = 0;
    while (i + n <= mine.length) {
      const key = mine.slice(i, i + n).join(" ");
      if (!theirs.has(key)) { i += 1; continue; }
      let end = i + n;
      while (end < mine.length && theirs.has(mine.slice(end - n + 1, end + 1).join(" "))) end += 1;
      out.push({ with: other.name, run: mine.slice(i, end).join(" "), words: end - i });
      i = end;
    }
  }
  return out.sort((a, b) => b.words - a.words);
}

/* ---------- the bibliography's BibTeX, for the LaTeX export ---------- */

export const bibtexKeysOf = (items: CslItem[], keys: string[]): CslItem[] =>
  keys.map((k) => items.find((i) => i.id === k)).filter((i): i is CslItem => Boolean(i));

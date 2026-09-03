/* ============================================================
   lib/cite.ts: citeproc, and the document rendered through it.

   One engine per style per library, built on demand from the
   vendored CSL and the en-GB locale (shared/csl). A document is
   rendered whole every time: the chips in the prose and in the
   footnotes are gathered in order, handed to citeproc as clusters
   with their note numbers, and the rendering written back into
   each chip's text. Whole rather than one chip at a time because
   ibid, "op. cit." and "Bashar 2020a" are facts about the
   sequence and only the sequence can answer them. The
   bibliography is what the same engine says it is.

   For a note style every footnote is one cluster, so two chips in
   one note are one note; a chip left in the running text of a
   note style is rendered as its own note, which is what OSCOLA
   does with an in-text citation nobody meant to leave there.
   ============================================================ */

import type { CslItem } from "@reiad/shared/research";
import { cslStyle, loadLocale, loadStyle } from "@reiad/shared/csl";
import { chipOf, chipsIn, mapChips, mapMarkers, notesOf, splitNotes, type Chip } from "@reiad/shared/research-write";
import type { Citation, Engine } from "citeproc";

type CSLModule = typeof import("citeproc");

let cslOnce: Promise<CSLModule["default"]> | null = null;
const loadCiteproc = (): Promise<CSLModule["default"]> => {
  cslOnce ??= import("citeproc").then((m) => (m as unknown as { default?: CSLModule["default"] }).default ?? (m as unknown as CSLModule["default"]));
  return cslOnce;
};

const engines = new Map<string, { engine: Engine; keys: string }>();

/** An engine for this style over these items. Rebuilt when the
    library it was built over changed, which is what the joined
    keys say. */
export async function makeEngine(styleId: string, items: CslItem[]): Promise<Engine> {
  const keys = items.map((i) => i.id).sort().join("|");
  const had = engines.get(styleId);
  if (had && had.keys === keys) return had.engine;
  const [CSL, style, locale] = await Promise.all([loadCiteproc(), loadStyle(styleId), loadLocale()]);
  const byId = new Map(items.map((i) => [String(i.id), i]));
  const engine = new CSL.Engine({
    retrieveLocale: () => locale,
    retrieveItem: (id: string) => (byId.get(id) ?? { id, type: "document", title: `[${id}]` }) as unknown as Record<string, unknown>,
  }, style, "en-GB", true);
  engines.set(styleId, { engine, keys });
  return engine;
}

export const isNoteStyle = (styleId: string): boolean => cslStyle(styleId).note;

const unescape = (s: string): string =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const escape = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const toItem = (c: Chip) => ({
  id: c.key, locator: c.locator, label: c.locator ? (c.label ?? "page") : undefined,
  "suppress-author": c.suppress || undefined,
});

export interface Rendered { html: string; bibliography: string; cited: string[] }

/** The document with every chip's text made again in the style,
    and the bibliography for everything it cites. */
export function renderDocument(engine: Engine, html: string): Rendered {
  const noteStyle = engine.opt.xclass === "note";
  const notes = notesOf(html);
  const prose = splitNotes(html).rest;
  /* Every chip in the prose and in the notes, each with the note
     it belongs to: a prose chip is note 0 in an in-text style and
     its own note in a note style; a chip inside footnote n is in
     note n. Markers in the prose fix the order of the notes. */
  interface Slot { where: "prose" | "note"; note: number; chip: Chip }
  const slots: Slot[] = [];
  const order: number[] = [];
  let noteCount = 0;
  void order;
  let cursor = 0;
  /* Where every chip and every marker is, as offsets, so a prose
     chip in a note style can be numbered between the notes it
     sits between. */
  const proseChips: { index: number; href: string }[] = [];
  mapChips(prose, (href, _t, whole) => { proseChips.push({ index: prose.indexOf(whole, proseChips.length ? proseChips[proseChips.length - 1].index + 1 : 0), href }); return whole; });
  const markers: { index: number }[] = [];
  mapMarkers(prose, (_n, whole) => { markers.push({ index: prose.indexOf(whole, markers.length ? markers[markers.length - 1].index + 1 : 0) }); return whole; });
  /* Walk the prose left to right, counting notes as their markers
     pass, so a prose chip in a note style gets a note number
     between the two footnotes it sits between. */
  let mi = 0;
  for (const m of proseChips) {
    while (mi < markers.length && markers[mi].index < m.index) { noteCount += 1; mi += 1; }
    const chip = chipOf(unescape(m.href));
    if (!chip) continue;
    if (noteStyle) { noteCount += 1; slots.push({ where: "prose", note: noteCount, chip }); }
    else slots.push({ where: "prose", note: 0, chip });
    cursor = m.index;
  }
  void cursor;
  /* The notes' own chips, one cluster per note in a note style. */
  const noteClusters: { note: number; chips: Chip[] }[] = [];
  notes.forEach((inner, i) => {
    const chips = chipsIn(inner);
    if (chips.length) noteClusters.push({ note: i + 1, chips });
  });
  /* Clusters in document order: by note number, prose chips of an
     in-text style in their own order. */
  const clusters: { id: string; note: number; chips: Chip[] }[] = [];
  slots.forEach((s, i) => clusters.push({ id: `p${i}`, note: s.note, chips: [s.chip] }));
  noteClusters.forEach((n) => clusters.push({ id: `n${n.note}`, note: n.note, chips: n.chips }));
  clusters.sort((a, b) => a.note - b.note || a.id.localeCompare(b.id, undefined, { numeric: true }));

  const cited = [...new Set(clusters.flatMap((c) => c.chips.map((x) => x.key)))];
  engine.updateItems(cited);
  const citations: Citation[] = clusters.map((c) => ({
    citationID: c.id, citationItems: c.chips.map(toItem), properties: { noteIndex: c.note },
  }));
  const results = citations.length ? engine.rebuildProcessorState(citations, "html") : [];
  const textFor = new Map<string, string>();
  for (const [id, , text] of results) textFor.set(id, text);

  /* Write each rendering back. A cluster of one chip is that
     chip's text; a note with several chips puts the whole cluster
     on the first chip and empties the others, so the note reads
     as one citation the way the style wants. */
  let pi = 0;
  const proseOut = mapChips(prose, (href, old, whole) => {
    const chip = chipOf(unescape(href));
    if (!chip) return whole;
    const text = textFor.get(`p${pi}`) ?? old;
    pi += 1;
    return `<a class="cite" href="${escape(unescape(href))}">${text}</a>`;
  });
  const notesOut = notes.map((inner, i) => {
    const text = textFor.get(`n${i + 1}`);
    if (text === undefined) return inner;
    let first = true;
    return mapChips(inner, (href) => {
      const out = first ? `<a class="cite" href="${escape(unescape(href))}">${text}</a>` : "";
      first = false;
      return out;
    });
  });
  const list = notesOut.length ? `<ol class="fn">${notesOut.map((n) => `<li>${n}</li>`).join("")}</ol>` : "";
  const bib = engine.makeBibliography();
  const bibliography = bib && bib[1].length ? `<div class="bib">${bib[1].join("")}</div>` : "";
  return { html: proseOut.trimEnd() + list, bibliography, cited };
}

/** One chip rendered alone, for the picker's preview. */
export function preview(engine: Engine, chip: Chip): string {
  try { return engine.makeCitationCluster([toItem(chip)]); } catch { return `[${chip.key}]`; }
}

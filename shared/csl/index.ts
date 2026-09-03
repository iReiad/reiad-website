/* ============================================================
   shared/csl: the citation styles, and how one is loaded.

   Each style is a module exporting its CSL XML as a string,
   vendored by scripts/import-csl.ts; this file is the registry
   and the loader. A document row stores the id; the desk imports
   the style when the document opens, so nine styles cost a
   reader nothing until one is asked for.

   `note` styles (OSCOLA, Chicago notes) cite in footnotes, and
   citeproc needs to be told which citations share a note; the
   desk reads `note` here to decide whether a citation chip is
   in-text or a footnote marker. RESEARCH.md section 16.
   ============================================================ */

export interface CslStyle { id: string; name: string; note: boolean }

export const CSL_STYLES: readonly CslStyle[] = [
  { id: "apa", name: "APA 7th", note: false },
  { id: "harvard", name: "Harvard (Cite Them Right)", note: false },
  { id: "oscola", name: "OSCOLA", note: true },
  { id: "chicago-ad", name: "Chicago author-date", note: false },
  { id: "chicago-notes", name: "Chicago notes and bibliography", note: true },
  { id: "mla", name: "MLA 9th", note: false },
  { id: "ieee", name: "IEEE", note: false },
  { id: "elsevier-harvard", name: "Elsevier Harvard", note: false },
  { id: "emerald-harvard", name: "Emerald Harvard", note: false },
] as const;

export const CSL_STYLE_IDS: readonly string[] = CSL_STYLES.map((s) => s.id);

export const cslStyle = (id: string): CslStyle => CSL_STYLES.find((s) => s.id === id) ?? CSL_STYLES[0];

/** The XML of one style, loaded on demand. Written out as a switch
    rather than a template string in the import, because a bundler
    can only make a chunk of an import it can read. */
export async function loadStyle(id: string): Promise<string> {
  switch (id) {
    case "harvard": return (await import("./harvard.ts")).default;
    case "oscola": return (await import("./oscola.ts")).default;
    case "chicago-ad": return (await import("./chicago-ad.ts")).default;
    case "chicago-notes": return (await import("./chicago-notes.ts")).default;
    case "mla": return (await import("./mla.ts")).default;
    case "ieee": return (await import("./ieee.ts")).default;
    case "elsevier-harvard": return (await import("./elsevier-harvard.ts")).default;
    case "emerald-harvard": return (await import("./emerald-harvard.ts")).default;
    default: return (await import("./apa.ts")).default;
  }
}

export async function loadLocale(): Promise<string> {
  return (await import("./locale-en-gb.ts")).default;
}

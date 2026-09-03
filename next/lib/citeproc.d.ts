/* citeproc-js ships no types. This is the slice of it the writing
   desk calls, and nothing else: the engine, the two ways to render
   a whole document's citations, and the bibliography. */
declare module "citeproc" {
  export interface CiteItem { id: string; locator?: string; label?: string; prefix?: string; suffix?: string; "suppress-author"?: boolean; "author-only"?: boolean }
  export interface Citation { citationID?: string; citationItems: CiteItem[]; properties: { noteIndex: number } }
  export interface Sys {
    retrieveLocale(lang: string): string;
    retrieveItem(id: string): Record<string, unknown>;
  }
  export class Engine {
    constructor(sys: Sys, style: string, lang?: string, forceLang?: boolean);
    opt: { xclass: "in-text" | "note"; [k: string]: unknown };
    updateItems(ids: string[]): void;
    rebuildProcessorState(citations: Citation[], mode?: string, uncitedItemIDs?: string[]): [string, number, string][];
    makeCitationCluster(items: CiteItem[]): string;
    makeBibliography(): [Record<string, unknown>, string[]] | false;
  }
  const CSL: { Engine: typeof Engine };
  export default CSL;
}

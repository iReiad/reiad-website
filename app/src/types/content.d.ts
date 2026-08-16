/* `/content.js`, the manifest of what exists on this site. See
   ./README.md.

   This is the module it would be worst to duplicate. It is what
   the menu, the Ctrl+K palette, the sitemap and the portfolio
   count all read, and a second copy of it inside a committed
   bundle would be a second answer to "what is on this site" that
   nothing would ever check against the first. */

/** A place a piece of writing can live: /insights/, /cooking/, /travel/. */
export interface Section {
  id: string;
  en: string;
  bn: string;
  lang: string;
}

/** A piece written as a committed file rather than a database row. */
export interface FilePiece {
  slug: string;
  title: string;
  tag?: string;
  topics?: string[];
  lang?: string;
  date?: string;
  status?: string;
}

export const SECTIONS: Section[];

/** The section with that id, or the default one. Never null, which
    is why callers can write `findSection(a.section).id` safely. */
export function findSection(id: string): Section;

export function pieceUrl(section: Section, slug: string): string;

/** Everything in that section published as a committed file. */
export function livePieces(section: Section): FilePiece[];

/** Every page, lesson, tool and piece on this site, with its
    title. The palette reads this; the desk reads it so that "most
    read" can say what a path is rather than showing the path and
    leaving you to work it out. */
export function searchIndex(): { title: string; url: string; hint?: string; kind: string }[];

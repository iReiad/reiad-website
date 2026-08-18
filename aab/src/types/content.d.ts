/* `/content.js`, described just enough for the modules that have
   moved. archive/TRANSITION.md Stage 13, and the same arrangement as
   `activation.d.ts` beside it: a module in `aab/src/` imports its
   neighbours by the path the browser fetches them from, and
   TypeScript needs a claim about that path until the neighbour
   moves here too and emits its own.

   Only what has actually been imported is described. A
   declaration that guessed at the rest of this module would be a
   claim nobody checked, and the whole argument for these files
   rather than `@ts-expect-error` is that they say something. */

/** A course is a ladder: it has stages, it keeps what you have
    read, and it can tell you what comes next. `id` is the same
    word the progress store and `sync.ts` use as a key prefix. */
export interface Course {
  id: string;
  bn: string;
  en: string;
  url: string;
  icon: string;
  blurb?: string;
}

export const COURSES: Course[];
export function findCourse(id: string): Course | null;

/* ---- the site's own facts ---- */

export interface Site {
  name: string;
  tagline: string;
  origin: string;
  email: string;
  linkedin: string;
}

export const SITE: Site;

/** One entry of the menu, the palette and the sitemap. */
export interface Page {
  title: string;
  url: string;
  hint?: string;
  blurb?: string;
  group?: string;
  /** Kept out of the sitemap and the menu. */
  private?: boolean;
  /** Case studies only: which kind, and a title short enough for
      a list that already says what these are. */
  kind?: "model" | "analysis" | "research";
  short?: string;
}

export const PAGES: Page[];

/** A reading section: the kitchen, the travel desk. Not a school,
    but it hangs off Skills the same way one does. */
export interface ReadSection {
  id: string;
  bn: string;
  en: string;
  /** The path every piece in the section starts with. */
  mount: string;
  /** The section's own index. */
  hub: string;
}

export const READS: ReadSection[];

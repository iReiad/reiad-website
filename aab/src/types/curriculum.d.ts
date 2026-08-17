/* The four schools' ladders, described once.

   ONE DECLARATION FOR FOUR MODULES, and the three accessor names
   are all on it. That is deliberate rather than lazy: the schools
   name the same idea three ways for historical reasons,
   `allTeile` is German for what `allParts` is English for, and
   the one place that reads all four is a table of school → which
   name to call. Four files differing by one line would not stop a
   caller picking the wrong name, because the caller is reading a
   table it wrote itself.

   What this does buy is the shape of a rung, which is the part
   the account page actually depends on and the part that would
   shorten a progress bar silently if it changed. */

/** A lesson, a Teil, a part or a day: one rung of a ladder,
    however the school that owns it spells the word. */
export interface Rung {
  id: string;
  url: string;
  bn?: string;
  en?: string;
  /** "live", or anything else for a rung that is promised and not
      yet written. A ladder counts only the live ones. */
  status?: string;
}

export function allLessons(): Rung[];
export function allTeile(): Rung[];
export function allParts(): Rung[];

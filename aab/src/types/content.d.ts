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

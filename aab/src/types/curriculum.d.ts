/* The four schools' ladders, described once.

   ONE DECLARATION FOR FOUR MODULES, and the accessor names for
   all four are on it. That is deliberate rather than lazy: the
   schools name the same idea several ways for historical reasons,
   `allTeile` is German for what `allParts` is English for, and
   the one place that reads all four is a table of school to which
   name to call. Four files differing by one line would not stop a
   caller picking the wrong name, because the caller is reading a
   table it wrote itself.

   `shared/schools.ts` is the typed version of the same ladders and
   `check-schools.ts` holds the two to agreeing. This file exists
   because these modules are what the BROWSER loads, by the path it
   fetches them from. */

/** A stage, a Stufe, a ধাপ or a term: one rung of the ladder above
    a lesson, however the school spells the word. */
export interface Stage {
  slug: string;
  bn: string;
  en?: string;
  /** The tiny label above the name, "ধাপ ২". */
  kicker?: string;
  blurb?: string;
  /** Where this stage's pages go, when they do not go under the
      school's own folder. `basics-1` carries `/money/terms/`
      because eighteen term pages were published there first. */
  base?: string;
  /** Present when the stage has a generated practice book. */
  workbook?: { slug: string; days: number };
  /** The German school's other kind of book. Exactly one of these
      two, never both. */
  uebung?: { slug: string; days: number };
  lessons?: Rung[];
}

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
  /** The stage this rung hangs off, under the name its own school
      uses. One of these is set, by the module that built it, and
      a caller that reads the wrong one gets `undefined` rather
      than a wrong answer. */
  stage?: Stage;
  stufe?: Stage;
  term?: Stage;
  dhap?: Stage;
}

/* ---- the ladders ---- */

export const STAGES: Stage[];
export const STUFEN: Stage[];
export const DHAPS: Stage[];
export const TERMS: Stage[];

/* ---- a stage's own address ---- */

export function stageUrl(stage: Stage): string;
export function stufeUrl(stage: Stage): string;
export function dhapUrl(stage: Stage): string;
export function termUrl(stage: Stage): string;

/** The generated practice book that hangs off a stage. Only the
    German and English schools have one, which is why only their
    modules export this. */
export function workbookUrl(stage: Stage): string;

/* ---- finding one by slug ---- */

export function findStage(slug: string): Stage | undefined;
export function findStufe(slug: string): Stage | undefined;
export function findTerm(slug: string): Stage | undefined;

/* ---- every rung, flattened ---- */

export function allLessons(): Rung[];
export function allTeile(): Rung[];
export function allParts(): Rung[];

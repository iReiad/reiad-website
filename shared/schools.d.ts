/* Types for schools.js, so the Next.js route can read the same
   four ladders the Worker and the builders read without a
   `@ts-expect-error` over the import. Same reasoning as
   look.d.ts: silencing the complaint does not describe the
   module, and it silences the next complaint too. */

/** What each school calls the things inside a section. */
export const WITHIN: Record<string, string>;
export const SCHOOL_IDS: readonly string[];
export function isSchool(id: unknown): boolean;

/** A section of a stage. Its lessons sit under the school's own
    key, which is why this carries an index signature rather than
    a `lessons` field: `laddered()` is the thing that knows. */
export interface SchoolSection {
  id: string;
  bn: string;
  en?: string;
  de?: string;
  [within: string]: unknown;
}

/** A stage, with its own fields spread back out of `meta`. */
export interface SchoolStage {
  slug: string;
  bn: string;
  status: string;
  kicker?: string;
  en?: string;
  de?: string;
  icon?: string;
  /** Where its lesson pages are written, when not its own folder. */
  base?: string;
  /** Its lessons are anchors in a hand-written hub, not pages. */
  inline?: boolean;
  workbook?: { slug: string; days: number };
  sections: SchoolSection[];
  [key: string]: unknown;
}

/** A lesson as the ladder holds it, before it is decorated. */
export interface SchoolLesson {
  slug: string;
  bn: string;
  status: string;
  minutes: number;
  blurb?: string;
  en?: string;
  de?: string;
  ar?: string;
  icon?: string;
  n?: number;
  from?: number;
  to?: number;
  [key: string]: unknown;
}

/** One lesson with its text, as `lessonOf` returns it. */
export interface SchoolLessonRow extends SchoolLesson {
  school: string;
  stage: string;
  body: string;
}

/** A lesson flattened out of its section by `laddered()`. */
export interface LadderedLesson extends SchoolLesson {
  stage: SchoolStage;
  section: SchoolSection;
  id: string;
  url: string;
  label: string;
  days: number;
}

export function stagesOf(d1: D1Database, school: string): Promise<SchoolStage[]>;
export function lessonOf(
  d1: D1Database, school: string, stage: string, slug: string
): Promise<SchoolLessonRow | null>;
export function lessonsOf(
  d1: D1Database, school: string, stage: string
): Promise<(SchoolLesson & { written: boolean })[]>;
export function countsOf(
  d1: D1Database, school: string
): Promise<{ total: number; written: number }>;

export function stageBase(school: string, stage: SchoolStage): string;
export function stageUrl(school: string, stage: SchoolStage): string;
export function lessonUrl(
  school: string, stage: SchoolStage, lesson: SchoolLesson
): string;
export function lessonId(stage: SchoolStage, lesson: SchoolLesson): string;
export function bnNum(n: number | string): string;
export function lessonDays(lesson: SchoolLesson): number;
export function lessonLabel(school: string, lesson: SchoolLesson): string;
export function workbookUrl(school: string, stage: SchoolStage): string | null;
export function laddered(school: string, stage: SchoolStage): LadderedLesson[];

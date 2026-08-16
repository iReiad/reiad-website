/* ============================================================
   lessons.ts: the four schools, as the Studio talks to them.

   TRANSITION.md Stage 8, step 4. The prose of a lesson lives in
   `school_lessons` now, and this is what the writing surface uses
   to read and change it. `functions/api/schools/` is the other
   end.

   ---- why nothing here knows about `teile` or `parts` ----

   A school's own vocabulary is real: /deutsch/ calls a lesson a
   Teil and /english/ calls it a part, and `shared/schools.js`
   hands a stage back with its lessons under that key because the
   builders and the hubs index by it.

   A picker does not. It wants the lessons of one stage in page
   order, which is exactly what `GET /api/schools/<school>/<stage>`
   already answers with: a flat list, under one name, for all four
   schools. So this file asks for that rather than reaching into a
   ladder and having to know which key to reach for. The mapping
   lives in one place and this is not a second one.

   ---- and why the ladder is read-only from here ----

   Which lessons exist, what order they come in and which section
   they sit in are decided by each school's `curriculum.js` and
   the builders that read it. This module can change a lesson's
   prose and the few things that belong to the lesson rather than
   to the ladder. It cannot add one. The endpoint refuses that
   too, and the note above the PUT there says why.
   ============================================================ */

import { api } from "../api.ts";

/** The schools, in the order the site lists them, with the name a
    person would recognise. The ids are the ones in the database
    and in `shared/schools.js`. */
export const SCHOOLS = [
  { id: "learn", name: "Money", where: "/learn/" },
  { id: "deutsch", name: "German", where: "/deutsch/" },
  { id: "quran", name: "Quran", where: "/quran/" },
  { id: "english", name: "English", where: "/english/" },
] as const;

export type SchoolId = (typeof SCHOOLS)[number]["id"];

export const schoolName = (id: string) =>
  SCHOOLS.find((s) => s.id === id)?.name ?? id;

/** How many lessons a school has and how many are written. Counted
    by the database, never carried around and added up here: the
    rule at the top of CLAUDE.md is about exactly this number. */
export interface Counts {
  total: number;
  written: number;
}

/** A rung of the ladder. `bn` is the title, because Bangla is the
    site's learning language and that is the column the importer
    puts a stage's own name in. Everything else a school's file
    said about it is spread back out alongside these. */
export interface Stage {
  slug: string;
  bn: string;
  status: string;
  /** The money school's starter guide: its steps are anchors on
      `/learn/` itself rather than pages of their own. */
  inline?: boolean;
  /** A stage whose pages were published somewhere else first and
      kept those URLs. `basics-1` is `/learn/terms/`. */
  base?: string;
  [extra: string]: unknown;
}

/** Whether a stage's prose lives somewhere other than these rows,
    and where.

    THE BUG THIS EXISTS FOR

    The money school reads 34 written out of 89 and the first
    stage looked entirely unwritten, which is true of the rows and
    false about the site: `start`'s eight steps are anchors on the
    hub page and `basics-1`'s eighteen were published at
    `/learn/terms/` and kept those URLs. `build-lessons.mjs` skips
    both stages by name (`if (stage.inline || stage.base)`), so
    their rows have empty bodies because nothing has ever put text
    in them and nothing ever reads it.

    Without this the editor offers to write 26 lessons whose text
    the builder will not look at: type a paragraph, press Save, and
    it goes into a row that no page is built from. That is the
    "finished work nobody can reach" failure, arrived at from the
    other end. */
export function elsewhere(stage: Stage): { what: string; where: string } | null {
  if (stage.inline) {
    return { what: "on the hub page itself, as anchors rather than pages", where: "/learn/" };
  }
  if (stage.base) {
    return { what: "published at their own URLs first, and they kept them", where: stage.base };
  }
  return null;
}

/** A lesson, as a picker sees it: no body. A ladder page names 89
    lessons and wants none of their text. */
export interface Lesson {
  slug: string;
  bn: string;
  minutes: number;
  status: string;
  section?: string;
  /** Whether it has prose yet, computed by the database. 55 of the
      233 rows do not, and that is the normal state of a lesson
      the ladder names and nobody has written: the builders draw an
      আসছে page from exactly this. */
  written: boolean;
  [extra: string]: unknown;
}

/** A lesson with its prose, which is the one the editor opens. */
export interface FullLesson extends Lesson {
  school: string;
  stage: string;
  body: string;
}

/** What a save is allowed to change. Deliberately not `slug`,
    `section` or `position`: those are the ladder. */
export interface LessonPatch {
  body?: string;
  title?: string;
  minutes?: number;
  status?: string;
}

/* ---------- reading ---------- */

/** Every school, with its counts. What the picker opens on. */
export async function allCounts(): Promise<Record<string, Counts>> {
  const res = await api<{ schools: Record<string, Counts> }>("schools");
  return res?.ok ? res.schools : {};
}

/** One school's ladder, in ladder order rather than alphabetical.
    The endpoint is responsible for that ordering and the reason it
    matters is written down there: three of the four schools have
    slugs that happen to sort correctly and the money school does
    not. */
export async function ladder(
  school: string
): Promise<{ stages: Stage[]; counts: Counts | null }> {
  const res = await api<{ stages: Stage[]; counts: Counts }>(`schools/${school}`);
  if (!res?.ok) return { stages: [], counts: null };
  return { stages: res.stages ?? [], counts: res.counts ?? null };
}

/** The lessons of one stage, in page order, without their text. */
export async function lessonsOf(school: string, stage: string): Promise<Lesson[]> {
  const res = await api<{ lessons: Lesson[] }>(`schools/${school}/${stage}`);
  return res?.ok ? res.lessons ?? [] : [];
}

/** One lesson, with its prose.

    A lesson nobody has written yet comes back as a row with an
    empty body, which is a different thing from a lesson that is
    not there, and the editor has to be able to tell them apart:
    the first is the normal case for 55 of the 233 rows and is
    what an আসছে page is built from. */
export async function readLesson(
  school: string, stage: string, slug: string
): Promise<FullLesson | null> {
  const res = await api<{ lesson: FullLesson }>(`schools/${school}/${stage}/${slug}`);
  return res?.ok ? res.lesson ?? null : null;
}

/* ---------- writing ---------- */

/** Save one lesson. Returns the row as it now is, so the caller
    shows what was stored rather than what it sent: the body is
    sanitised on the way in and the two can differ. */
export async function saveLesson(
  school: string, stage: string, slug: string, patch: LessonPatch
): Promise<{ lesson: FullLesson } | { error: string }> {
  const res = await api<{ lesson: FullLesson }>(
    `schools/${school}/${stage}/${slug}`,
    { method: "PUT", body: patch }
  );
  if (!res) return { error: "The site did not answer." };
  if (!res.ok) {
    return { error: res.reason === "no-such-lesson"
      ? "That lesson is not in the ladder, so there is no row to write."
      : res.message ?? res.reason };
  }
  return { lesson: res.lesson };
}

/** Where a lesson is on the live site. The builders write every
    school's pages to <where><stage>/<slug>.html and that has been
    the shape of these URLs since before any of this moved. */
export const lessonUrl = (school: string, stage: string, slug: string) => {
  const where = SCHOOLS.find((s) => s.id === school)?.where ?? `/${school}/`;
  return `${where}${stage}/${slug}.html`;
};

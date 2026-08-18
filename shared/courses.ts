/* ============================================================
   courses.ts: the third-party course catalogue, and where every
   part of it lives.

   ---- what this is, and what it is not ----

   The six schools are this site's own writing: prose in D1, a
   ladder in `schools.ts`, a page per lesson rendered from the
   row. This is the other thing. A third-party course is somebody
   else's material sitting in a Drive folder, and what this
   repository holds is a CATALOGUE of it: which courses, which
   modules, which lessons, and the Drive id of the file behind
   each one. No prose, no video, no copy of anything.

   That distinction is the reason for every decision below.

   ---- it is the Worker's, and it must stay the Worker's ----

   **Nothing under `next/` may import the value half of this
   file.** The catalogue is admin-only: it names a private Drive
   folder belonging to one person, and a Next.js page that
   imported `COURSES` would put all of it into a JavaScript
   bundle that anybody can fetch, whatever the page then drew.
   `scripts/check-courses.mjs` fails on any such import.

   What a page may import is the TYPES, with `import type`, which
   TypeScript erases before anything is bundled. The catalogue
   itself reaches the browser exactly one way: a signed-in admin
   asks `/api/courses`, `functions/_lib/admins.js` says yes, and
   the Worker answers with JSON. That is the same shape
   `/tools/live.html` uses for the broker, and for the same
   reason: the one place that can be trusted to check is the one
   place the reader cannot edit.

   ---- the data is generated ----

   `courses.data.json` beside this file is written by
   `scripts/import-courses.mjs` out of the Drive folder. Do not
   edit it by hand. The rule at the top of `CLAUDE.md` is exactly
   this rule: a list of things that exist elsewhere is derived,
   never remembered, because it was right on the day it was typed
   and then the thing it counted grew.
   ============================================================ */

import data from "./courses.data.json" with { type: "json" };

/* ---------- what a catalogue is made of ---------- */

/** A file that hangs off a lesson: a template, a dataset, a
    slide deck. Not the lesson itself. */
export interface CourseFile {
  name: string;
  /** The extension, lower case, which is all the chip says. */
  ext: string;
  drive: string;
}

export type LessonKind = "video" | "reading" | "quiz" | "exam" | "file";

export interface CourseLesson {
  slug: string;
  title: string;
  kind: LessonKind;
  /** Which group of the module this came from. A heading in the
      sidebar, never part of an address: a lesson that moves
      between groups keeps its id and its tick. */
  section: string;
  /** Where it sits in the module, counted across all groups. */
  position: number;
  /** The Drive id of the video, when there is one. */
  video?: string;
  reading?: string;
  quiz?: string;
  exam?: string;
  transcript?: string;
  files?: CourseFile[];
}

export interface CourseModule {
  slug: string;
  n: number;
  title: string;
  drive: string;
  lessons: CourseLesson[];
  /** No lessons yet: either the Drive folder is empty or the
      import has not reached it. Said out loud rather than hidden,
      because a module missing from a ladder looks like a course
      with fewer weeks in it. */
  pending?: boolean;
}

export interface Course {
  slug: string;
  n: number;
  title: string;
  drive: string;
  modules: CourseModule[];
}

export interface Catalogue {
  root: string;
  source: string;
  courses: Course[];
}

/** A lesson with everything the page needs to draw it, which is
    more than the lesson knows about itself. */
export interface LadderLesson extends CourseLesson {
  module: string;
  moduleTitle: string;
  id: string;
  url: string;
}

/* ---------- the catalogue ---------- */

export const CATALOGUE = data as unknown as Catalogue;
export const COURSES: Course[] = CATALOGUE.courses;

export const courseOf = (slug: string): Course | null =>
  COURSES.find((c) => c.slug === slug) ?? null;

export const moduleOf = (course: Course, slug: string): CourseModule | null =>
  course.modules.find((m) => m.slug === slug) ?? null;

export const lessonOf = (
  mod: CourseModule, slug: string
): CourseLesson | null =>
  mod.lessons.find((l) => l.slug === slug.replace(/\.html$/i, "")) ?? null;

/* ---------- where a thing lives ----------

   One function each, and everything else on the site calls them
   rather than building a path. The sidebar, the route, the
   "mark complete and continue" button and the checks all have to
   agree, and the way they agree is by asking here. */

export const courseUrl = (course: string): string =>
  `/skills/courses/${course}/index.html`;

export const moduleUrl = (course: string, mod: string): string =>
  `/skills/courses/${course}/${mod}/index.html`;

export const lessonUrl = (course: string, mod: string, lesson: string): string =>
  `/skills/courses/${course}/${mod}/${lesson}.html`;

/** What a tick is filed under.

    All three parts, because a slug is only unique inside its
    module: `01_get-started` exists in more than one course, and a
    reader who finished one has not finished the other. The id is
    what goes into `courses-read`, so it is a string somebody's
    browser will hold for years: it is built from slugs, which are
    Coursera's own and do not move, rather than from titles or
    positions, which do. */
export const lessonId = (course: string, mod: string, lesson: string): string =>
  `${course}/${mod}/${lesson}`;

/** Where the browser gets a lesson's bytes.

    This site, not Drive, and that is the fix for the bug the
    whole section had: a private Drive file cannot be embedded
    cross-site, because browsers block or partition the cookies
    Drive would need to recognise the viewer. A `/preview` iframe
    of a private file answers "Unable to load video", and a link
    to one answers a sign-in wall. Neither is fixable from this
    side; the mechanism only ever worked for files shared by link.

    So the Worker holds the credential and serves the bytes from
    this origin, where no third-party anything is involved. See
    `functions/_lib/drive.ts`.

    Still no player events, and still a button: the reason has not
    changed, only the source. A `<video>` element would happily
    report `ended`, and using it would still be guessing that
    somebody who left a tab open has learnt something. A lesson is
    finished when the reader says it is. */
export const fileUrl = (drive: string): string =>
  `/api/courses/file/${drive}`;

/** A reading, sanitised and rendered into the page rather than
    handed to Drive's viewer. */
export const readingUrl = (drive: string): string =>
  `/api/courses/reading/${drive}`;

/** Drive's own page, kept for one job only: the "open in Drive"
    link beside a file, for when somebody wants the original
    rather than this site's copy of it. Never used for playback
    and never framed. */
export const driveUrl = (drive: string): string =>
  `https://drive.google.com/file/d/${drive}/view`;

/* ---------- what the Worker is allowed to fetch ----------

   Every Drive id the catalogue names, and nothing else.

   This is the second lock on `/api/courses/file/<id>`, and it is
   the one that does the real work. The first is `isAdmin()`, and
   on its own it would leave a proxy that fetches ANY id it is
   handed: a read-only window onto the whole of somebody's Drive,
   one guessed id at a time, standing or falling entirely on that
   one check. This set means a request for an id that is not part
   of a lesson is refused before a credential is even loaded,
   whoever is asking.

   Built once at module load. 1,331 strings is nothing to hold and
   the alternative is walking eight courses per request. */
const driveIds = (): Set<string> => {
  const ids = new Set<string>();
  for (const course of COURSES) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        for (const key of ["video", "reading", "quiz", "exam", "transcript"] as const) {
          const id = lesson[key];
          if (id) ids.add(id);
        }
        for (const file of lesson.files ?? []) ids.add(file.drive);
      }
    }
  }
  return ids;
};

export const DRIVE_IDS: Set<string> = driveIds();

/** Is this id one a lesson actually names? */
export const isCourseFile = (id: unknown): boolean =>
  typeof id === "string" && DRIVE_IDS.has(id);

/** The lesson a Drive id belongs to, for labelling a response.
    Null when the id is not in the catalogue at all, which the
    caller should already have refused. */
export function lessonForFile(id: string): { course: Course; mod: CourseModule; lesson: CourseLesson } | null {
  for (const course of COURSES) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.video === id || lesson.reading === id || lesson.quiz === id
          || lesson.exam === id || lesson.transcript === id
          || (lesson.files ?? []).some((f) => f.drive === id)) {
          return { course, mod, lesson };
        }
      }
    }
  }
  return null;
}

/* ---------- the ladder ---------- */

/** Every lesson of a course, in order, with its id and address.

    This is what the sidebar draws and what "continue" walks. It
    is computed rather than stored for the same reason
    `laddered()` in `schools.ts` is: the ordering is a fact about
    the catalogue, and a stored copy of it is a second thing to
    keep in step. */
export function laddered(course: Course): LadderLesson[] {
  return course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      ...lesson,
      module: mod.slug,
      moduleTitle: mod.title,
      id: lessonId(course.slug, mod.slug, lesson.slug),
      url: lessonUrl(course.slug, mod.slug, lesson.slug),
    }))
  );
}

/** The ids of one module's lessons, which is what a per-module
    percentage is counted against. */
export const moduleIds = (course: string, mod: CourseModule): string[] =>
  mod.lessons.map((l) => lessonId(course, mod.slug, l.slug));

export interface CourseCounts {
  modules: number;
  lessons: number;
  videos: number;
  /** Modules whose lessons have not been imported. Counted so a
      page can say so rather than looking complete. */
  pending: number;
}

export function countsOf(course: Course): CourseCounts {
  return {
    modules: course.modules.length,
    lessons: course.modules.reduce((n, m) => n + m.lessons.length, 0),
    videos: course.modules.reduce(
      (n, m) => n + m.lessons.filter((l) => l.video).length, 0),
    pending: course.modules.filter((m) => m.pending).length,
  };
}

/** What the whole section adds up to, for the index page. */
export const catalogueCounts = () => COURSES.reduce((acc, course) => {
  const c = countsOf(course);
  return {
    courses: acc.courses + 1,
    modules: acc.modules + c.modules,
    lessons: acc.lessons + c.lessons,
    videos: acc.videos + c.videos,
    pending: acc.pending + c.pending,
  };
}, { courses: 0, modules: 0, lessons: 0, videos: 0, pending: 0 });

/* ---------- what the browser is given ----------

   Deliberately narrower than the catalogue, and narrower than it
   needs to be for the page to work, which is the point of having
   a function rather than answering with the row.

   One course at a time: a lesson page needs its own course's
   ladder for the sidebar and has no use for the other seven, so
   sending all eight would be forty times the bytes and seven
   courses' worth of Drive ids handed to a page that draws none
   of them. */
export const forBrowser = (course: Course) => ({
  slug: course.slug,
  n: course.n,
  title: course.title,
  modules: course.modules.map((mod) => ({
    slug: mod.slug,
    n: mod.n,
    title: mod.title,
    pending: mod.pending ?? false,
    lessons: mod.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      kind: l.kind,
      section: l.section,
      position: l.position,
      video: l.video ?? null,
      reading: l.reading ?? null,
      quiz: l.quiz ?? null,
      exam: l.exam ?? null,
      transcript: l.transcript ?? null,
      files: l.files ?? [],
    })),
  })),
});

/** The list page's version: no Drive ids at all, because the
    list draws none. */
export const listForBrowser = () => COURSES.map((course) => ({
  slug: course.slug,
  n: course.n,
  title: course.title,
  ...countsOf(course),
}));

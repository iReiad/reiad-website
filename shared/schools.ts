/* ============================================================
   schools.ts: the four curricula, out of the database, in the
   shape the site already speaks.

   ---- why this file exists, and what it replaces ----

   Each school keeps a `curriculum.js` that is not a data file: it
   is a module whose helpers close over its own array.
   `totalDays()` in the Quran school reduces over the module-level
   `DHAPS`; `stageLessons()`, `dhapCount()` and `lessonUrl()` do
   the same in the other three. Forty files import from one of
   those four modules, and only four of them are builders.

   So this is not a replacement for those modules and does not try
   to be. It is the door the DATABASE is read through, and it
   returns the same shape the files export, so that anything
   reading it can be written once and pointed at either.

   ---- who reads it ----

   The Worker (`functions/api/schools/`), the Next.js route that
   will render a lesson, and the tests.

   ---- the shape ----

   A stage comes back with its own fields spread back out of
   `meta`, its sections attached, and its lessons inside them
   under the key that school uses for them: `lessons` for
   /money/ and /quran/, `teile` for /deutsch/, `parts` for
   /english/.
   ============================================================ */

export interface D1Database {
  prepare(query: string): {
    bind(...args: unknown[]): {
      all(): Promise<{ results?: unknown[] }>;
      first(): Promise<unknown>;
    };
  };
}

export interface SchoolSection {
  id: string;
  bn: string;
  en?: string;
  de?: string;
  ident?: string;
  [within: string]: unknown;
}

export interface SchoolStage {
  slug: string;
  bn: string;
  status: string;
  kicker?: string;
  en?: string;
  de?: string;
  icon?: string;
  base?: string;
  inline?: boolean;
  workbook?: { slug: string; days: number };
  sections: SchoolSection[];
  [key: string]: unknown;
}

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
  written?: boolean;
  [key: string]: unknown;
}

export interface SchoolLessonRow extends SchoolLesson {
  school: string;
  stage: string;
  body: string;
}

export interface LadderedLesson extends SchoolLesson {
  stage: SchoolStage;
  section: SchoolSection;
  id: string;
  url: string;
  label: string;
  days: number;
}

export const WITHIN: Record<string, string> = {
  money: "lessons",
  deutsch: "teile",
  quran: "lessons",
  english: "parts",
};

export const SCHOOL_IDS = ["money", "deutsch", "quran", "english"] as const;

export const isSchool = (id: unknown): boolean => SCHOOL_IDS.includes(String(id) as never);

const spread = (row: Record<string, unknown>, extra: Record<string, unknown> = {}): Record<string, unknown> => {
  let meta = {};
  try { meta = JSON.parse((row.meta as string) || "{}"); } catch { meta = {}; }
  return { ...meta, ...extra };
};

const stageFrom = (row: Record<string, unknown>): Record<string, unknown> => spread(row, {
  slug: row.slug,
  bn: row.title,
  status: row.status,
});

const lessonFrom = (row: Record<string, unknown>): Record<string, unknown> => spread(row, {
  slug: row.slug,
  bn: row.title,
  minutes: row.minutes,
  status: row.status,
  ...(row.written === undefined ? {} : { written: Boolean(row.written) }),
});

export async function stagesOf(d1: D1Database, school: string): Promise<SchoolStage[]> {
  if (!isSchool(school)) return [];

  const [stages, sections, lessons] = await Promise.all([
    d1.prepare(
      `SELECT * FROM school_stages WHERE school = ? ORDER BY position`
    ).bind(school).all(),
    d1.prepare(
      `SELECT * FROM school_sections WHERE school = ? ORDER BY stage, position`
    ).bind(school).all(),
    d1.prepare(
      `SELECT school, stage, slug, section, position, title, minutes, status, meta,
              CASE WHEN body <> '' THEN 1 ELSE 0 END AS written
         FROM school_lessons WHERE school = ? ORDER BY stage, position`
    ).bind(school).all(),
  ]);

  const within = WITHIN[school] ?? "lessons";

  return ((stages.results ?? []) as Record<string, unknown>[]).map((stageRow) => {
    const stage = stageFrom(stageRow) as unknown as SchoolStage;

    stage.sections = ((sections.results ?? []) as Record<string, unknown>[])
      .filter((s) => s.stage === stageRow.slug)
      .map((sectionRow) => {
        const section = spread(sectionRow, {
          id: sectionRow.ident,
          bn: sectionRow.title,
        }) as unknown as SchoolSection;
        section[within] = ((lessons.results ?? []) as Record<string, unknown>[])
          .filter((l) => l.stage === stageRow.slug && l.section === sectionRow.ident)
          .map(lessonFrom);
        return section;
      });

    return stage;
  });
}

export async function lessonOf(
  d1: D1Database, school: string, stage: string, slug: string
): Promise<SchoolLessonRow | null> {
  if (!isSchool(school)) return null;

  const row = await d1.prepare(
    `SELECT * FROM school_lessons
      WHERE school = ? AND stage = ? AND slug = ?`
  ).bind(school, String(stage), String(slug).replace(/\.html$/i, "")).first();

  if (!row) return null;
  return {
    ...lessonFrom(row as Record<string, unknown>),
    school: (row as Record<string, unknown>).school,
    stage: (row as Record<string, unknown>).stage,
    body: (row as Record<string, unknown>).body,
  } as SchoolLessonRow;
}

export async function lessonsOf(
  d1: D1Database, school: string, stage: string
): Promise<(SchoolLesson & { written: boolean })[]> {
  if (!isSchool(school)) return [];
  const rows = await d1.prepare(
    `SELECT school, stage, slug, section, position, title, minutes, status, meta,
            CASE WHEN body <> '' THEN 1 ELSE 0 END AS written
       FROM school_lessons WHERE school = ? AND stage = ? ORDER BY position`
  ).bind(school, String(stage)).all();
  return ((rows.results ?? []) as Record<string, unknown>[]).map((row) => ({
    ...lessonFrom(row),
    written: Boolean(row.written),
  })) as (SchoolLesson & { written: boolean })[];
}

export async function countsOf(
  d1: D1Database, school: string
): Promise<{ total: number; written: number }> {
  const row = await d1.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN body <> '' THEN 1 ELSE 0 END) AS written
       FROM school_lessons WHERE school = ?`
  ).bind(school).first();
  return { total: (row as Record<string, unknown> | undefined)?.total as number ?? 0, written: (row as Record<string, unknown> | undefined)?.written as number ?? 0 };
}

export const stageBase = (school: string, stage: SchoolStage): string =>
  stage.base ?? `/${school}/${stage.slug}/`;

export const stageUrl = (school: string, stage: SchoolStage): string =>
  `/${school}/${stage.slug}/index.html`;

export const lessonUrl = (school: string, stage: SchoolStage, lesson: SchoolLesson): string =>
  `${stageBase(school, stage)}${lesson.slug}.html`;

export const lessonId = (stage: SchoolStage, lesson: SchoolLesson): string =>
  stage.slug === "basics-1" ? lesson.slug : `${stage.slug}/${lesson.slug}`;

/** Bangla numerals, for pages that are Bangla throughout.

    The digits are BENGALI, U+09E6 to U+09EF, and they are built
    from their code points rather than typed as a literal. A port
    of this function retyped the string and produced the
    Devanagari digits instead, U+0966 to U+096F, which look close
    enough in a diff to survive review and put every number on a
    Bangla page into the wrong script. scripts/check-schools.ts
    caught it by comparing a label computed here against the same
    label computed by the school's own curriculum.js. */
const BN_DIGITS = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x09e6 + i)).join("");

export const bnNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

export const lessonDays = (lesson: SchoolLesson): number =>
  lesson.from == null ? 1 : (lesson.to ?? lesson.from) - lesson.from + 1;

export const lessonLabel = (school: string, lesson: SchoolLesson): string => {
  if (school === "quran") {
    return lesson.to != null && lesson.from != null
      ? `দিন ${bnNum(lesson.from)}–${bnNum(lesson.to)}`
      : lesson.from != null ? `দিন ${bnNum(lesson.from)}` : "";
  }
  if (school === "english") return lesson.n != null ? `পর্ব ${bnNum(lesson.n)}` : "";
  return "";
};

export const workbookUrl = (school: string, stage: SchoolStage): string | null => {
  if (!stage?.workbook) return null;
  if (school === "deutsch" && stage.status !== "live") return null;
  if (school !== "deutsch" && school !== "english") return null;
  return `/${school}/${stage.slug}/${stage.workbook.slug}.html`;
};

export const laddered = (school: string, stage: SchoolStage): LadderedLesson[] => {
  const within = WITHIN[school] ?? "lessons";
  return (stage.sections ?? []).flatMap((section) =>
    ((section[within] ?? []) as SchoolLesson[]).map((lesson) => ({
      ...lesson,
      stage,
      section,
      id: lessonId(stage, lesson),
      url: lessonUrl(school, stage, lesson),
      label: lessonLabel(school, lesson),
      days: lessonDays(lesson),
      status: lesson.status ?? "live",
    }))
  );
};

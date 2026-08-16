/* ============================================================
   schools.js: the four curricula, out of the database, in the
   shape the site already speaks.

   ---- why this file exists, and what it replaces ----

   Each school keeps a `curriculum.js` that is not a data file: it
   is a module whose helpers close over its own array.
   `totalDays()` in the Quran school reduces over the module-level
   `DHAPS`; `stageLessons()`, `dhapCount()` and `lessonUrl()` do
   the same in the other three. Forty files import from one of
   those four modules, and only four of them are builders:
   `content.js` builds the Ctrl+K palette, `crumbs.js` the
   breadcrumb trail, `home.js` the front page, `build-meta.mjs` the
   sitemap, `sw.js` the precache list, and every school's own
   `hub.js` and `progress.js` its ladder.

   So this is not a replacement for those modules and does not try
   to be. It is the door the DATABASE is read through, and it
   returns the same shape the files export, so that anything
   reading it can be written once and pointed at either.

   ---- who reads it ----

   The Worker (`functions/api/schools/`), the Next.js route that
   will render a lesson, and the tests. Not the browser: a page
   that renders a ladder cannot wait on a query to know what the
   ladder is, and the committed `curriculum.js` is what it keeps
   reading until Stage 11.7 takes those pages too. That is the
   same arrangement every other part of this transition has: the
   file is the fallback until the route that replaces it exists.

   ---- the shape ----

   A stage comes back with its own fields spread back out of
   `meta`, its sections attached, and its lessons inside them
   under the key that school uses for them: `lessons` for
   /learn/ and /quran/, `teile` for /deutsch/, `parts` for
   /english/. That last detail is not decoration. Those keys are
   what the builders and the hubs index by, and a reader handing
   back `lessons` to a school that says `teile` is handing back
   something that looks right and is empty.
   ============================================================ */

/** What each school calls the things inside a section. */
export const WITHIN = {
  learn: "lessons",
  deutsch: "teile",
  quran: "lessons",
  english: "parts",
};

/** The schools, in the order the site lists them. */
export const SCHOOL_IDS = ["learn", "deutsch", "quran", "english"];

export const isSchool = (id) => SCHOOL_IDS.includes(String(id));

/** `meta` back into the object it came out of.

    The column exists because the four schools have genuinely
    different fields and flattening them would have meant either
    losing some or inventing forty nullable columns. Spreading it
    back here is what makes that invisible to everything upstream:
    a caller sees the same object the file had. */
const spread = (row, extra = {}) => {
  let meta = {};
  try { meta = JSON.parse(row.meta || "{}"); } catch { meta = {}; }
  return { ...meta, ...extra };
};

const stageFrom = (row) => spread(row, {
  slug: row.slug,
  bn: row.title,
  status: row.status,
});

const lessonFrom = (row) => spread(row, {
  slug: row.slug,
  bn: row.title,
  minutes: row.minutes,
  status: row.status,
});

/* ---------- reading ---------- */

/** Every stage of one school, with sections and lessons attached.

    Ordered by `position` on both, and never by slug. Three of the
    four schools have stage slugs that happen to sort into ladder
    order (`dhap-1..3`, `stufe-1..4`, `term-1..2`) and the money
    school does not: its ladder is start, basics-1, basics-2,
    basics-3, inter-1 and so on, which sorts as advanced,
    basics-1, ..., start. A query ordered by slug looks right on
    three schools and quietly reorders the fourth. */
export async function stagesOf(d1, school) {
  if (!isSchool(school)) return [];

  const [stages, sections, lessons] = await Promise.all([
    d1.prepare(
      `SELECT * FROM school_stages WHERE school = ? ORDER BY position`
    ).bind(school).all(),
    d1.prepare(
      `SELECT * FROM school_sections WHERE school = ? ORDER BY stage, position`
    ).bind(school).all(),
    /* Without the body. A ladder page names 89 lessons and needs
       none of their text, and the money school's prose alone is
       most of a megabyte. The body is fetched one lesson at a
       time, by the page that is actually going to show it. */
    d1.prepare(
      `SELECT school, stage, slug, section, position, title, minutes, status, meta
         FROM school_lessons WHERE school = ? ORDER BY stage, position`
    ).bind(school).all(),
  ]);

  const within = WITHIN[school] ?? "lessons";

  return (stages.results ?? []).map((stageRow) => {
    const stage = stageFrom(stageRow);

    stage.sections = (sections.results ?? [])
      .filter((s) => s.stage === stageRow.slug)
      .map((sectionRow) => {
        const section = spread(sectionRow, {
          id: sectionRow.ident,
          bn: sectionRow.title,
        });
        section[within] = (lessons.results ?? [])
          .filter((l) => l.stage === stageRow.slug && l.section === sectionRow.ident)
          .map(lessonFrom);
        return section;
      });

    return stage;
  });
}

/** One lesson, with its text.

    Returns null rather than throwing for anything that is not a
    lesson this site has, because every caller's answer to that is
    the same: fall through to whatever would have answered before
    the database existed. */
export async function lessonOf(d1, school, stage, slug) {
  if (!isSchool(school)) return null;

  const row = await d1.prepare(
    `SELECT * FROM school_lessons
      WHERE school = ? AND stage = ? AND slug = ?`
  ).bind(school, String(stage), String(slug).replace(/\.html$/i, "")).first();

  if (!row) return null;
  return { ...lessonFrom(row), school: row.school, stage: row.stage, body: row.body };
}

/** The lessons of one stage, in page order, without their text.
    This is what a prev/next pair and a contents list are built
    from, and it is deliberately the same order the builders write
    the pages in.

    `written` rather than the body itself. Whether a lesson has
    been written is the one thing about its prose that a list
    wants: a contents page marks the ones that are not there yet
    and the Studio's picker does the same. Sending the prose to
    answer that would be most of a megabyte for the money school,
    which is the reason the body is left out here in the first
    place. It is computed by the database and never by counting
    what came back. */
export async function lessonsOf(d1, school, stage) {
  if (!isSchool(school)) return [];
  const rows = await d1.prepare(
    `SELECT school, stage, slug, section, position, title, minutes, status, meta,
            CASE WHEN body <> '' THEN 1 ELSE 0 END AS written
       FROM school_lessons WHERE school = ? AND stage = ? ORDER BY position`
  ).bind(school, String(stage)).all();
  return (rows.results ?? []).map((row) => ({
    ...lessonFrom(row),
    written: Boolean(row.written),
  }));
}

/** How many lessons a school has, and how many are written.

    Counted, never remembered. The rule at the top of CLAUDE.md is
    about pages saying how many of something there are, and a
    school's hub says exactly that. */
export async function countsOf(d1, school) {
  const row = await d1.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN body <> '' THEN 1 ELSE 0 END) AS written
       FROM school_lessons WHERE school = ?`
  ).bind(school).first();
  return { total: row?.total ?? 0, written: row?.written ?? 0 };
}

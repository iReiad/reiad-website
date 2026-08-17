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
  /* Only where the query asked for it. `lessonOf()` selects the
     body itself and has no such column, so the field is absent
     there rather than false, which is the honest answer to "has
     this been written" from a query that did not ask. */
  ...(row.written === undefined ? {} : { written: Boolean(row.written) }),
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
    /* Without the body, but with whether there is one. A ladder
       page names 89 lessons and needs none of their text, and the
       money school's prose alone is most of a megabyte. The body
       is fetched one lesson at a time, by the page that is
       actually going to show it.

       `written` is the one thing about the prose a ladder does
       want: a hub that says how much of a school exists has to
       count the lessons that have words in them, and a lesson can
       be live and empty. It is computed by the database, never by
       counting what came back. */
    d1.prepare(
      `SELECT school, stage, slug, section, position, title, minutes, status, meta,
              CASE WHEN body <> '' THEN 1 ELSE 0 END AS written
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

/* ============================================================
   the ladder's arithmetic

   ---- why these are here and not left in curriculum.js ----

   Every one of them is already a pure function of the object it
   is handed. `lessonUrl(school, stage, lesson)` reads three
   slugs; `dayLabel(lesson)` reads two numbers. The four
   `curriculum.js` modules each hold their own spelling of the
   same handful, closed over nothing except the school they
   belong to, which is why `scripts/school-source.mjs` can already
   hand a builder a ladder read out of D1 and let the file's own
   helpers decorate it.

   TRANSITION.md Stage 11.7 needs the same arithmetic somewhere a
   Next.js route can reach, and `next/` cannot import out of its
   own directory. So it is written once, here, beside the reader
   that produces the objects it works on.

   ---- the copy, and what watches it ----

   The four modules still hold their versions, because forty files
   in `aab/` import them and those files are the browser's. That
   is a second copy and this repository has been bitten by exactly
   that twice, so it is checked rather than trusted:
   `scripts/check-schools.mjs` computes every lesson's URL, id and
   label both ways and fails if one pair disagrees. When the
   school pages stop being files, the modules go and this stays.
   ============================================================ */

/** Where a stage's lesson pages are written.

    Almost always the stage's own folder. `basics-1` in the money
    school is the exception and it is a deliberate one: its
    eighteen term pages were published at `/learn/terms/` for a
    year before that school had a builder, and a URL somebody has
    shared does not move because the generator that writes it
    changed. The `base` in its meta is what says so. */
export const stageBase = (school, stage) =>
  stage.base ?? `/${school}/${stage.slug}/`;

/** A stage's contents page. */
export const stageUrl = (school, stage) =>
  `/${school}/${stage.slug}/index.html`;

/** A lesson's page.

    There used to be a branch here for an `inline` stage, whose
    lessons were sections of a hand-written hub rather than pages
    of their own. The money school's starter guide was the only
    one, and the reason it was inline was the sanitiser rather
    than the builder: its eight steps carried a layout of classes
    no article allowlist held. They were rewritten in the
    article's own vocabulary in August 2026 and they are eight
    pages at `/learn/start/`. No stage on this site is inline. */
export const lessonUrl = (school, stage, lesson) =>
  `${stageBase(school, stage)}${lesson.slug}.html`;

/** Progress is stored per lesson under a stable id.

    The id is the stage's slug and the lesson's, except for the
    money school's `basics-1`, where it is the lesson's alone.
    That is not a tidier scheme, it is the eighteen original term
    pages: they were published at `/learn/terms/` and their
    progress was filed under a bare slug for a year before the
    stage that now holds them existed. Changing the key would not
    move anybody's ticks, it would lose them. */
export const lessonId = (stage, lesson) =>
  stage.slug === "basics-1" ? lesson.slug : `${stage.slug}/${lesson.slug}`;

/** Bangla numerals, for pages that are Bangla throughout. */
export const bnNum = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/** How many days a lesson covers. Most cover one, and only the
    Quranic Arabic school has any that cover more: a lesson with
    no day number at all belongs to a school that does not count
    in days, and one day is the honest answer for it rather than
    the NaN that arithmetic on `undefined` gives. */
export const lessonDays = (lesson) =>
  lesson.from == null ? 1 : (lesson.to ?? lesson.from) - lesson.from + 1;

/** The short label above a lesson's reading time, for the two
    schools that number their lessons, and nothing for the two
    that do not.

    The en dash in a day range is deliberate and allowed: a number
    range is the one thing the house rule on dashes keeps it for. */
export const lessonLabel = (school, lesson) => {
  if (school === "quran") {
    return lesson.to
      ? `দিন ${bnNum(lesson.from)}–${bnNum(lesson.to)}`
      : `দিন ${bnNum(lesson.from)}`;
  }
  if (school === "english") return `পর্ব ${bnNum(lesson.n)}`;
  return "";
};

/** A stage's practice book, or null.

    Null for a German Stufe still marked "soon" even though it
    declares a workbook: the declaration is the plan, the page is
    the thing, and letting this name a page nobody has generated
    is how a course advertises a 404. The English school has no
    such state and its terms are checked for the book alone. */
export const workbookUrl = (school, stage) => {
  if (!stage?.workbook) return null;
  if (school === "deutsch" && stage.status !== "live") return null;
  if (school !== "deutsch" && school !== "english") return null;
  return `/${school}/${stage.slug}/${stage.workbook.slug}.html`;
};

/** One stage's lessons, flattened out of its sections, in page
    order, each carrying the things a page states about it: which
    section it came from, its id, its URL, its label and how many
    days it covers.

    This is `dhapLessons()`, `stageLessons()`, `stufeTeile()` and
    `termParts()`, which are four spellings of one function. The
    key the lessons sit under is the school's own, which is the
    detail the note at the top of this file exists for. */
export const laddered = (school, stage) => {
  const within = WITHIN[school] ?? "lessons";
  return (stage.sections ?? []).flatMap((section) =>
    (section[within] ?? []).map((lesson) => ({
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

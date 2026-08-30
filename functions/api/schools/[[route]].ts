/* ============================================================
   /api/schools, the four curricula out of the database.

   GET  /api/schools/audit                        admin: what is
                                                  unwritten, undeclared
                                                  or linked to nothing
   GET  /api/schools/<school>                     the ladder
   GET  /api/schools/<school>/<stage>             its lessons
   GET  /api/schools/<school>/<stage>/<lesson>    one lesson, with
                                                  its text
   PUT  /api/schools                              admin: write a
                                                  whole school
   PUT  /api/schools/<school>/<stage>/<lesson>    admin: write one
                                                  lesson's prose

   archive/TRANSITION.md Stage 8. The rows exist and this is the door they
   are read through. Nothing on the site reads it yet: the pages
   are still generated from `curriculum.js` and the committed HTML
   is still what a reader gets. This is the half that has to exist
   and be right before any of that changes.

   ---- why the write side is a PUT of whole rows ----

   The importer is a browser away from the files, not a server
   with a copy of them. `scripts/import-schools.ts` reads the
   four curricula and writes SQL, which is one `wrangler d1
   execute` and is the fastest way in; this endpoint is the other
   way, and the one that survives the files being deleted. It
   takes the same rows as JSON and upserts them, so the desk can
   fill the tables without anybody having a terminal, and so a
   lesson editor has something to save into later.

   It replaces rows rather than merging them. While the files are
   still the source of truth these tables are a copy, and a copy
   that half-updates is worse than one that is rewritten: the
   lesson that quietly kept its old text is the failure this
   whole stage is arranged around.

   ---- and why one lesson is a different route ----

   The whole-school PUT replaces a ladder. Saving a paragraph
   through it would mean sending every lesson of that school back,
   most of a megabyte for the money school, and any bug in the
   round trip would rewrite 89 rows instead of one.

   So the lesson editor has its own address, and it can only
   UPDATE. The ladder is `curriculum.js` and the builders that
   read it; the prose is these rows. A slug that is not already a
   row is a 404 rather than an insert, because a lesson invented
   at the editor is a lesson no page links to.
   ============================================================ */

import { db } from "../../_lib/db.ts";
import type { DbEnv } from "../../_lib/db.ts";
import { body, fail, methods, notConfigured, ok, nowISO } from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";
import { requireAdmin } from "../../_lib/auth.ts";
import {
  isSchool, stagesOf, lessonOf, lessonsOf, countsOf, SCHOOL_IDS,
  stageUrl, stageBase, workbookUrl, laddered,
} from "../../../shared/schools.ts";
import type { SchoolStage } from "../../../shared/schools.ts";
import type { SchoolLessonRow } from "../../../shared/rows.ts";
import { sanitiseHTML } from "../../_lib/sanitise.ts";

/** What a caller sends: JSON, so every field is unknown until the
    write below coerces it. Deliberately NOT `SchoolLessonRow` and
    friends: those describe a row that is already in the database,
    and this is a request that has not been believed yet. */
type Sent = Record<string, unknown>;

/* ---- the audit's small print ----

   `href="..."` as the sanitiser leaves it, and the two targets
   that are never a page on this site: anything carrying a scheme,
   and a bare fragment. */
const HREF = /href=["']([^"']+)["']/g;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/** One address, spelled the single way the comparison uses: no
    fragment, no query, no trailing slash. `bare()` in `worker.js`
    takes the slash off every path before the route table is
    consulted, so `/money/` and `/money` are one address. */
const norm = (url: string): string => {
  const path = url.split("#")[0].split("?")[0];
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
};

/** The spellings of one address that answer through a 301 rather
    than directly, both of them rules in `aab/_redirects`:
    `/x/index.html` was the canonical form of every page that was a
    directory, and `.html` came off every route in task #28. */
const spellings = (path: string): string[] => [
  path.endsWith("/index.html") ? path.slice(0, -"/index.html".length) : "",
  path.endsWith(".html") ? path.slice(0, -".html".length) : `${path}.html`,
].filter(Boolean);

/** How many rows of any one list the audit returns. The count
    beside each list is the whole number. */
const CAP = 50;

/** A lesson as the audit reads it: no body, and `written` is the
    one thing it needs to know about one. */
type AuditLesson =
  Pick<SchoolLessonRow, "school" | "stage" | "slug" | "section" | "title">
  & { written: number };

/** One link: where it was written, and where it points. */
interface AuditLink {
  school: string;
  stage: string;
  slug: string;
  href: string;
  to: string;
}

export async function onRequest(
  context: RouteContext<DbEnv, { route?: string[] }>,
): Promise<Response> {
  const { request, params } = context;
  const [school, stage, lesson] = params.route ?? [];

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  return methods(request, {
    GET: async () => {
      if (!school) {
        /* No school named: what there is. A hub page asking "how
           much of this is written" gets a number that was counted
           rather than one somebody typed, which is the rule at the
           top of CLAUDE.md and the reason four pages once
           disagreed about the same figure. */
        const counts: Record<string, { total: number; written: number }> = {};
        /* The four, from the one place that names them. This was
           written out here as well until Stage 12 step 1. */
        for (const id of SCHOOL_IDS) {
          counts[id] = await countsOf(d1, id);
        }
        return ok({ schools: counts });
      }

      /* ---- the prose, as opposed to the ladder ----

         ADMIN.md §3 B 7. `check-schools.ts` compares the two
         ladders and runs on a laptop; this is the half that can
         only be asked of the database: which lessons have no words
         in them yet, which rows the ladder does not declare, and
         which links inside a lesson body go nowhere.

         Behind the passphrase like the rest of §3 B. Nothing here
         is a secret, but a list of what is unwritten is the site
         talking about itself rather than to a reader.

         ---- what it will and will not adjudicate ----

         A link is decided against the rows, so it is decided
         COMPLETELY inside the space those rows describe: the four
         schools and every stage's own base. Within that, "no such
         address" is a fact. A link to `/tools` or to a piece is
         not decided here at all and is returned as such, because
         the route table is not in this database and a check that
         guessed would cry wolf until nobody read it.
         `check-routes.ts` is what walks the rest.

         The three answers are three, and not two, for the same
         reason the health dot has three states. An old spelling
         (`/money/index.html`, `/deutsch/stufe-1/arbeitsbuch.html`)
         still answers, through a 301 in `aab/_redirects`, so
         calling it dead would be a wrong word for a real thing:
         it is worth fixing and it is not broken. */
      if (school === "audit") {
        const denied = await requireAdmin(context);
        if (denied) return denied;

        /* One row per lesson, whatever the ladder says about it.
           `stagesOf()` below answers the other question, which is
           what the ladder DECLARES, and the difference between the
           two lists is the point of this endpoint. */
        const [lessons, linked, ...ladderList] = await Promise.all([
          d1.prepare(
            `SELECT school, stage, slug, section, title,
                    CASE WHEN body <> '' THEN 1 ELSE 0 END AS written
               FROM school_lessons ORDER BY school, stage, position`
          ).all<AuditLesson>(),
          d1.prepare(
            `SELECT school, stage, slug, body FROM school_lessons
              WHERE body LIKE '%href=%' ORDER BY school, stage, position`
          ).all<Pick<SchoolLessonRow, "school" | "stage" | "slug" | "body">>(),
          ...SCHOOL_IDS.map((id) => stagesOf(d1, id)),
        ]);

        const ladders: Record<string, SchoolStage[]> = {};
        SCHOOL_IDS.forEach((id, i) => { ladders[id] = ladderList[i] ?? []; });
        const rows = lessons.results ?? [];

        /* Every address these four schools have, computed by
           `shared/schools.ts` and not assembled here. A second
           opinion about where a lesson lives is exactly what
           `check-schools.ts` exists to catch, and this would be a
           third. */
        const known = new Set<string>();
        const owned: string[] = [];
        const from = new Map<string, string>();
        for (const id of SCHOOL_IDS) {
          known.add(`/${id}`);
          owned.push(`/${id}/`);
          for (const stage of ladders[id]) {
            known.add(norm(stageUrl(id, stage)));
            const book = workbookUrl(id, stage);
            if (book) known.add(norm(book));
            /* A stage's `base` is where its pages actually go, and
               it is not always under the school: `basics-1` has
               eighteen term pages that were published at their own
               address for a year and do not move. */
            owned.push(stageBase(id, stage));
            from.set(`${id}/${stage.slug}`, stageBase(id, stage));
            for (const lesson of laddered(id, stage)) known.add(norm(lesson.url));
          }
        }

        const dead: AuditLink[] = [];
        const redirected: AuditLink[] = [];
        const elsewhere: AuditLink[] = [];
        let checked = 0;
        let alive = 0;

        for (const row of linked.results ?? []) {
          const here = from.get(`${row.school}/${row.stage}`)
            ?? `/${row.school}/${row.stage}/`;
          for (const found of String(row.body ?? "").matchAll(HREF)) {
            const href = found[1];
            if (!href || href.startsWith("#") || SCHEME.test(href)) continue;
            checked += 1;

            let path: string;
            try {
              path = norm(href.startsWith("/")
                ? href
                : new URL(href, `https://reiad.co.uk${here}`).pathname);
            } catch { path = norm(href); }

            if (known.has(path)) { alive += 1; continue; }
            const at: AuditLink = {
              school: row.school, stage: row.stage, slug: row.slug, href, to: path,
            };
            if (!owned.some((prefix) => path.startsWith(prefix))) elsewhere.push(at);
            else if (spellings(path).some((one) => known.has(one))) redirected.push(at);
            else dead.push(at);
          }
        }

        /* A lesson the ladder does not declare renders nowhere and
           is in no ring, and the two ways of getting there are the
           same failure: a stage that is not a stage, and a section
           that stage does not have. `stagesOf()` drops the second
           silently, which is why it is named here. */
        const undeclared = rows.flatMap((l) => {
          const stage = (ladders[l.school] ?? []).find((s) => s.slug === l.stage);
          const at = { school: l.school, stage: l.stage, slug: l.slug };
          if (!stage) return [{ ...at, why: "no stage of that name" }];
          return (stage.sections ?? []).some((s) => s.id === l.section)
            ? []
            : [{ ...at, why: `no section "${l.section}" in that stage` }];
        });

        return ok({
          schools: SCHOOL_IDS.map((id) => {
            const mine = rows.filter((l) => l.school === id);
            return {
              school: id,
              total: mine.length,
              written: mine.filter((l) => l.written).length,
              stages: ladders[id].map((stage) => {
                const theirs = mine.filter((l) => l.stage === stage.slug);
                const empty = theirs.filter((l) => !l.written);
                return {
                  slug: stage.slug,
                  title: String(stage.bn ?? stage.slug),
                  status: String(stage.status ?? "live"),
                  url: stageUrl(id, stage),
                  total: theirs.length,
                  written: theirs.length - empty.length,
                  empty: empty.slice(0, CAP).map((l) => ({ slug: l.slug, title: l.title })),
                };
              }),
            };
          }),
          undeclared: undeclared.slice(0, CAP),
          undeclaredCount: undeclared.length,
          links: {
            checked,
            alive,
            dead: dead.slice(0, CAP),
            deadCount: dead.length,
            redirected: redirected.slice(0, CAP),
            redirectedCount: redirected.length,
            /* Returned rather than counted away: three links a
               check cannot decide is a sentence somebody can read,
               and a silent zero is not. */
            elsewhere: elsewhere.slice(0, CAP),
            elsewhereCount: elsewhere.length,
          },
        });
      }

      if (!isSchool(school)) return fail("no-such-school", 404);

      if (lesson) {
        const found = await lessonOf(d1, school, String(stage), lesson);
        /* 404 rather than an empty object, because the caller's
           fallback is the committed page and it needs to be able
           to tell "not here" from "here and empty". A lesson
           nobody has written yet is a row with an empty body, and
           that is a different thing. */
        return found ? ok({ lesson: found }) : fail("no-such-lesson", 404);
      }

      if (stage) return ok({ lessons: await lessonsOf(d1, school, stage) });

      return ok({ stages: await stagesOf(d1, school), counts: await countsOf(d1, school) });
    },

    PUT: async () => {
      const admin = await requireAdmin(context);
      if (admin) return admin;

      /* One lesson, which is what the Studio's lesson editor
         saves. It is a separate path from the whole-school write
         below rather than a special case of it, because the two
         are answering different questions. The whole-school write
         is the importer's door: it replaces a ladder. This one
         changes the prose of a lesson that already exists, and
         must not be able to change anything else.

         So it UPDATEs and never inserts. Which lessons exist,
         what order they come in and which section they sit in are
         decided by `curriculum.js` and the builders that read it,
         and a lesson invented here would be a row no page links
         to: a written lesson nobody can reach, which is the
         failure the publishing checklist in CLAUDE.md exists for.
         A slug that is not already there is a 404, not an insert. */
      if (lesson) {
        if (!isSchool(school)) return fail("no-such-school", 404);

        const patch = await body(request);
        const slug = String(lesson).replace(/\.html$/i, "");

        /* Typed at the query, out of `shared/rows.ts`, because
           `SELECT *` on this table IS that interface and the four
           fields read below are the whole contract with it. */
        const existing = await d1.prepare(
          `SELECT * FROM school_lessons
            WHERE school = ? AND stage = ? AND slug = ?`
        ).bind(school, String(stage), slug).first<SchoolLessonRow>();
        if (!existing) return fail("no-such-lesson", 404);

        /* The same sanitiser an article goes through. A lesson
           body is the same kind of HTML written in the same
           editor, and `aab/schema.sql` says so where the column
           is defined. Two sanitisers that disagree is the bug the
           three-place rule in CLAUDE.md exists for. */
        const html = patch.body === undefined
          ? existing.body
          : sanitiseHTML(String(patch.body));

        /* An empty body is not a failure and is not a deletion.
           It is what "nobody has written this yet" looks like,
           and it is what makes the builders draw an আসছে page.
           Emptying a lesson has to stay possible. */
        /* THE CARD IS MERGED INTO META, never written over it.

           `meta` is the school's own fields: the lesson's English
           title, its blurb, its icon, its day range. A PUT that
           replaced the object would take all of them off the day
           somebody drew a picture, and the Studio's lesson editor
           does not send meta at all, so the replacement would be
           `{}`. One key in, everything else untouched.

           Narrow on purpose: this accepts `card` and nothing
           else. A general meta merge would let any caller write
           any field of a school's vocabulary through the one
           endpoint that is meant for prose. */
        let meta = existing.meta;
        if (patch.card !== undefined) {
          let held: Record<string, unknown> = {};
          try { held = JSON.parse(String(existing.meta || "{}")); } catch { held = {}; }
          const card = String(patch.card).trim();
          if (card) held.card = card.slice(0, 300);
          else delete held.card;
          meta = JSON.stringify(held);
        }

        await d1.prepare(
          `UPDATE school_lessons
              SET body = ?, title = ?, minutes = ?, status = ?, meta = ?, updated_at = ?
            WHERE school = ? AND stage = ? AND slug = ?`
        ).bind(
          html,
          patch.title === undefined ? existing.title : String(patch.title),
          patch.minutes === undefined ? existing.minutes : Number(patch.minutes) || 0,
          patch.status === undefined ? existing.status : String(patch.status),
          meta,
          nowISO(), school, String(stage), slug
        ).run();

        return ok({ lesson: await lessonOf(d1, school, String(stage), slug) });
      }

      /* Anything shorter than a lesson is a school or a stage,
         and neither is writable one at a time: changing a ladder
         means changing rows this endpoint deletes wholesale. */
      if (school) return fail("write-the-whole-school", 400);

      const payload = await body(request);
      const stages: Sent[] = Array.isArray(payload.stages) ? payload.stages : [];
      const sections: Sent[] = Array.isArray(payload.sections) ? payload.sections : [];
      const lessons: Sent[] = Array.isArray(payload.lessons) ? payload.lessons : [];

      if (!lessons.length) return fail("nothing-to-write", 400);

      /* One school at a time, and it has to say which. A payload
         that wrote every school at once could half-succeed across
         all four, and the recovery from that is worse than the
         import. */
      const named = new Set<unknown>([
        ...stages.map((s) => s.school),
        ...sections.map((s) => s.school),
        ...lessons.map((l) => l.school),
      ]);
      if (named.size !== 1) return fail("one-school-at-a-time", 400);

      /* Still `unknown`: `isSchool()` answers a boolean rather
         than narrowing, and what goes into the bind below is the
         value the caller sent either way. */
      const [only] = [...named];
      if (!isSchool(only)) return fail("no-such-school", 400);

      const now = nowISO();
      const statements = [
        d1.prepare(`DELETE FROM school_lessons WHERE school = ?`).bind(only),
        d1.prepare(`DELETE FROM school_sections WHERE school = ?`).bind(only),
        d1.prepare(`DELETE FROM school_stages WHERE school = ?`).bind(only),
      ];

      for (const s of stages) {
        statements.push(d1.prepare(
          `INSERT INTO school_stages (school, slug, position, title, status, meta, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(only, String(s.slug), Number(s.position) || 0, String(s.title ?? ""),
          String(s.status ?? "live"), JSON.stringify(s.meta ?? {}), now));
      }
      for (const s of sections) {
        statements.push(d1.prepare(
          `INSERT INTO school_sections (school, stage, ident, position, title, meta, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(only, String(s.stage), String(s.ident), Number(s.position) || 0,
          String(s.title ?? ""), JSON.stringify(s.meta ?? {}), now));
      }
      for (const l of lessons) {
        statements.push(d1.prepare(
          `INSERT INTO school_lessons
             (school, stage, slug, section, position, title, minutes, status, meta, body, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(only, String(l.stage), String(l.slug), String(l.section ?? ""),
          Number(l.position) || 0, String(l.title ?? ""), Number(l.minutes) || 0,
          String(l.status ?? "live"), JSON.stringify(l.meta ?? {}),
          String(l.body ?? ""), now));
      }

      /* One batch, so the delete and the inserts are one
         transaction. A failure halfway through this without it
         leaves a school with no lessons at all, and the site
         reading those rows would then be a site with no school. */
      await d1.batch(statements);

      return ok({
        school: only,
        stages: stages.length,
        sections: sections.length,
        lessons: lessons.length,
        written: lessons.filter((l) => l.body).length,
      });
    },
  });
}

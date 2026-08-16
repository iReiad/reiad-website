/* ============================================================
   /api/schools, the four curricula out of the database.

   GET  /api/schools/<school>                     the ladder
   GET  /api/schools/<school>/<stage>             its lessons
   GET  /api/schools/<school>/<stage>/<lesson>    one lesson, with
                                                  its text
   PUT  /api/schools                              admin: write rows

   TRANSITION.md Stage 8. The rows exist and this is the door they
   are read through. Nothing on the site reads it yet: the pages
   are still generated from `curriculum.js` and the committed HTML
   is still what a reader gets. This is the half that has to exist
   and be right before any of that changes.

   ---- why the write side is a PUT of whole rows ----

   The importer is a browser away from the files, not a server
   with a copy of them. `scripts/import-schools.mjs` reads the
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
   ============================================================ */

import { db } from "../../_lib/db.js";
import { body, fail, methods, notConfigured, ok, nowISO } from "../../_lib/http.js";
import { requireAdmin } from "../../_lib/auth.js";
import { isSchool, stagesOf, lessonOf, lessonsOf, countsOf } from "../../../shared/schools.js";

export async function onRequest(context) {
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
        const counts = {};
        for (const id of ["learn", "deutsch", "quran", "english"]) {
          counts[id] = await countsOf(d1, id);
        }
        return ok({ schools: counts });
      }

      if (!isSchool(school)) return fail("no-such-school", 404);

      if (lesson) {
        const found = await lessonOf(d1, school, stage, lesson);
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

      const payload = await body(request);
      const stages = Array.isArray(payload?.stages) ? payload.stages : [];
      const sections = Array.isArray(payload?.sections) ? payload.sections : [];
      const lessons = Array.isArray(payload?.lessons) ? payload.lessons : [];

      if (!lessons.length) return fail("nothing-to-write", 400);

      /* One school at a time, and it has to say which. A payload
         that wrote every school at once could half-succeed across
         all four, and the recovery from that is worse than the
         import. */
      const named = new Set([
        ...stages.map((s) => s.school),
        ...sections.map((s) => s.school),
        ...lessons.map((l) => l.school),
      ]);
      if (named.size !== 1) return fail("one-school-at-a-time", 400);

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

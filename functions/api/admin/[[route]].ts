/* ============================================================
   /api/admin/*

   ONE ROUTE so far, `health`, and it answers TWO different things
   depending on whether the caller has a credential.

   ---- why it answers a stranger at all ----

   Because the panel has to be useful on the day the credential is
   the thing that is broken. A page that can only tell you the
   site is healthy once you have proved who you are cannot tell
   you that the sign-in is what is down, which is the one moment
   somebody opens it in a hurry.

   That argument justifies exactly ONE fact, and this used to give
   away six. A stranger gets `{ worker: true }`: this Worker
   answered. Everything after that needs the passphrase session or
   an admin reader.

   ---- what it was leaking, and the rule that should have caught it ----

   The rule was already written here: could somebody work this out
   by using the site for a minute? Every field failed it. That D1
   answers in 66ms, that Supabase is unreachable, that a Drive
   credential and a broker seal are configured, that there is
   exactly ONE admin reader. None of that is inferable from
   outside, all of it was served to anybody who opened /admin
   signed out, and together it is a map of what to attack and
   which parts are already weak.

   A rule enforced by whoever last read the prose is the failure
   this repository opens with, and this route was IN the `PUBLIC`
   list in `scripts/check-admin.ts` with that reasoning written
   beside it. The list was right about what it was told. It is
   `scripts/admin.test.ts` that asks now, by CALLING this with no
   credential and reading what comes back.

   ============================================================ */

import { fail, methods, notConfigured, ok } from "../../_lib/http.ts";
import { readSession } from "../../_lib/auth.ts";
import { readerFrom } from "../../_lib/reader.ts";
import { isAdmin } from "../../_lib/admins.ts";
import type { D1Database } from "../../_lib/db.ts";
import {
  ART_MOTIFS, ART_SUBJECTS_SVG, ART_VIEWBOX, MOTIF_OF,
} from "../../../shared/art-svg.ts";
import { subjectOf } from "../../../shared/art-of.ts";

export interface AdminEnv {
  /* `D1Database` out of `_lib/db.ts`, which is where the rest of
     `functions/` gets it. This declared its own one-method shape
     so as not to depend on the package, and that stopped being
     possible the moment the route had to read a session: two
     descriptions of one binding is the second copy `check-rows.ts`
     exists to ban, one level down. */
  DB?: D1Database;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
  /** The two Drive secrets, asked about and never read. */
  GOOGLE_SA_EMAIL?: string;
  GOOGLE_SA_KEY?: string;
  /** The sealed-key secret the broker needs to store one at all. */
  BROKER_TOKEN_KEY?: string;
  ADMIN_READERS?: string;
  /** Set by the deploy. Absent locally, which is not a fault. */
  COMMIT?: string;
}

interface AdminContext {
  request: Request;
  env: AdminEnv;
  params: { route?: string[] };
}

/** One round trip, timed, and never fatal: a store that is down
    is a thing to REPORT rather than a reason for this endpoint to
    fail, which is the whole point of it. */
async function reach(run: () => Promise<unknown>): Promise<{ ok: boolean; ms: number }> {
  const at = Date.now();
  try {
    await run();
    return { ok: true, ms: Date.now() - at };
  } catch {
    return { ok: false, ms: Date.now() - at };
  }
}

/** Is this caller an admin?

    Either credential opens it, because either one means the
    caller is already trusted with more than what is behind it.
    The passphrase is a cookie the Worker can read on its own; the
    account half goes through `isAdmin()`, which is the ONE place
    that answers that question.

    A function rather than eight lines inside the health handler,
    because there are two routes here now and a second copy of a
    gate is how one of them ends up ungated. */
async function allowed(context: AdminContext): Promise<boolean> {
  const { request, env } = context;
  if (await readSession(context)) return true;
  const reader = await readerFrom(request, env);
  return reader ? await isAdmin(env, request, reader.id) : false;
}

export async function onRequest(context: AdminContext): Promise<Response> {
  const { request, env, params } = context;
  const route = (params.route ?? []).join("/");

  /* ---------- the drawings, for whoever is drawing a card ----------

     `shared/art-svg.ts` holds the twelve subjects and the six
     walls as the inside of an `<svg>`, and it is 34 KB. The eight
     shared files that ARE compiled into `aab/` are there because
     every reader needs them; nobody needs these except whoever is
     publishing, which is one admin. So they are fetched rather
     than served, behind the same gate as everything else here.

     Both callers use this one path rather than one of them
     importing the table: the Studio is a Vite bundle that cannot
     reach `shared/` except through a served address, and two ways
     in is two things to keep in step. */
  if (route === "art") {
    return methods(request, {
      GET: async () => {
        if (!await allowed(context)) return fail("forbidden", 403);

        /* AND WHICH ONE THIS PIECE WEARS, when the caller says
           what the piece is. `subjectFor` is `shared/art.ts` and
           is the one place that decides; the Studio is a Vite
           bundle that cannot import it, and a second copy of the
           rule in the browser is the failure CLAUDE.md opens
           with. So it is answered here, in the same request that
           carries the drawings, rather than in a route of its
           own: one round trip either way. */
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        const pick = id || url.searchParams.get("title")
          ? subjectOf({
            id,
            section: url.searchParams.get("section"),
            title: url.searchParams.get("title"),
            tags: (url.searchParams.get("tags") ?? "").split(",").filter(Boolean),
          })
          : null;

        return ok({
          subjects: ART_SUBJECTS_SVG, motifs: ART_MOTIFS, motifOf: MOTIF_OF,
          box: ART_VIEWBOX, pick,
        });
      },
    });
  }

  /* ---------- what has no picture yet ----------

     THE QUEUE, and it is one list rather than two.

     A drawn card is `/media/<slug>-card/<hash>.jpg`, and anything
     else in a `cover` is a raw photograph, which half the
     scrapers refuse to read. A lesson's is in its `meta`, and a
     lesson with none falls back to its STAGE's standing card, so
     every lesson in a stage shares one picture: three lessons
     pasted into a chat are the same image three times.

     Both are read here rather than in the browser because both
     are one SQL query and neither is a thing the desk should be
     assembling out of four ladder fetches. Nothing is drawn here:
     a card is a canvas and this is a Worker. The browser draws
     and PATCHes back, one at a time, which is what makes it a
     queue rather than a job.

     Answered oldest first, so the run always makes progress on
     the things that have been waiting longest, and a run that is
     interrupted has done the most useful half. */
  if (route === "cards") {
    return methods(request, {
      GET: async () => {
        if (!await allowed(context)) return fail("forbidden", 403);
        if (!env.DB) return notConfigured();

        const url = new URL(request.url);
        const limit = Math.min(400, Math.max(1, Number(url.searchParams.get("limit")) || 200));

        /* `LIKE` rather than the regexp `isDrawnCard` uses,
           because SQLite has no regexp and the two agree on the
           part that matters: a drawn card is under
           `/media/<something>-card/`. A cover that passes here
           and fails the browser's stricter test is drawn again,
           which costs one card and is the safe direction. */
        const pieces = await env.DB.prepare(
          `SELECT slug, title, tag, section, cover, published_at
             FROM articles
            WHERE status = 'live'
              AND (cover IS NULL OR cover = '' OR cover NOT LIKE '/media/%-card/%')
            ORDER BY published_at ASC
            LIMIT ?`
        ).bind(limit).all<{ slug: string; title: string; tag: string;
          section: string; cover: string | null }>();

        const lessons = await env.DB.prepare(
          `SELECT school, stage, slug, title, meta
             FROM school_lessons
            WHERE status = 'live' AND body <> ''
              AND (meta IS NULL OR meta NOT LIKE '%"card"%')
            ORDER BY school ASC, stage ASC, position ASC
            LIMIT ?`
        ).bind(limit).all<{ school: string; stage: string; slug: string;
          title: string; meta: string | null }>();

        return ok({
          pieces: pieces.results ?? [],
          lessons: (lessons.results ?? []).map((l) => {
            let meta: Record<string, unknown> = {};
            try { meta = JSON.parse(l.meta || "{}"); } catch { meta = {}; }
            return {
              school: l.school, stage: l.stage, slug: l.slug, title: l.title,
              /* The lesson's own words, for the card's kicker and
                 its subject: `blurb` and the English title are in
                 `meta` and nothing else here has them. */
              en: typeof meta.en === "string" ? meta.en : "",
              icon: typeof meta.icon === "string" ? meta.icon : "",
            };
          }),
        });
      },
    });
  }

  if (route !== "health") return fail("not-found", 404);

  return methods(request, {
    GET: async () => {
      /* The one fact a stranger gets, and the whole of what the
         ungated version was FOR: this Worker answered, so a panel
         that is not working is not the Worker. Nothing here is a
         store, a secret or a count. */
      if (!await allowed(context)) return ok({ worker: true, detail: false });

      const d1 = env.DB
        ? await reach(() => env.DB!.prepare("select 1").first())
        : { ok: false, ms: 0 };

      /* A REAL resource, and the reason is that this reported a
         healthy project as unreachable for as long as the row
         existed. It asked for `/rest/v1/`, which is PostgREST's
         OpenAPI root, and Supabase does not serve that to a
         publishable key: it answers 401, the probe read any
         non-2xx as down, and /admin drew a red dot beside a
         project that was ACTIVE_HEALTHY and answering every
         query the site made.

         PostgREST rather than `/auth/v1/health`, which would also
         have answered 200: what this site needs Supabase FOR is
         rows. A sign-in service that is up while PostgREST is
         down is exactly the state a green dot must not describe.

         `limit=0` so no row is read and row-level security has
         nothing to decide. Asked without a reader's bearer, so
         what it establishes is that the service answers, not what
         any one reader can see. */
      const supa = env.SUPABASE_URL && env.SUPABASE_KEY
        ? await reach(async () => {
          const res = await fetch(
            `${env.SUPABASE_URL}/rest/v1/progress?select=user_id&limit=0`,
            { headers: { apikey: env.SUPABASE_KEY! } },
          );
          if (!res.ok) throw new Error(String(res.status));
        })
        : { ok: false, ms: 0 };

      return ok({
        commit: env.COMMIT ?? null,
        stores: {
          d1: { bound: Boolean(env.DB), ...d1 },
          supabase: { configured: Boolean(env.SUPABASE_URL && env.SUPABASE_KEY), ...supa },
        },
        /* Configured, never read. `canReachDrive()` asks the same
           question one level down and this deliberately does not
           call it: that would spend a token exchange on a page
           load. */
        secrets: {
          drive: Boolean(env.GOOGLE_SA_EMAIL && env.GOOGLE_SA_KEY),
          brokerSeal: Boolean(env.BROKER_TOKEN_KEY),
          adminReaders: String(env.ADMIN_READERS ?? "").split(",").filter((s) => s.trim()).length,
        },
      });
    },
  });
}

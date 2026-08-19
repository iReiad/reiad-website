/* ============================================================
   /api/routine/*

   ONE ROUTE, and it exists for one reason: a template that is a
   real person's day rather than a suggestion.

   Everything else about the routine tool is the reader's own rows
   in Supabase, read by the browser with the reader's own token
   under the row-level security every other table has. There is no
   Worker in that path and there should not be one: it would be a
   second thing holding somebody's private days.

   What the browser cannot do is decide whether it is talking to
   an admin. `isAdmin()` reads `ADMIN_READERS` and `public.admins`,
   and both are the Worker's. So the private template comes from
   here, and it comes as DATA rather than as a yes or a no: an
   admin gets the list, everybody else gets an empty one.

   ---- an empty list rather than a 403 ----

   A 403 tells a reader that something exists which they may not
   have, and the settings page would then have to say so. An empty
   list is the truth from where they are standing: there are no
   private templates for this account. The public ones are in
   `TEMPLATES` in `shared/routine.ts` and reach the browser in the
   bundle, as they should.

   ---- why the data is in shared/ and not here ----

   Because `scripts/routine.test.ts` asserts against it: the
   template's own hours are the arithmetic the whole tool is built
   on, and a fixture would be a second copy of the numbers. It is
   kept out of the public bundle by not being in `TEMPLATES` and
   by `check-courses.ts`, which fails on anything under `next/`
   importing it by value.
   ============================================================ */

import { fail, methods, ok } from "../../_lib/http.ts";
import { readerFrom } from "../../_lib/reader.js";
import { isAdmin } from "../../_lib/admins.js";
import { PRIVATE_TEMPLATES } from "../../../shared/routine.ts";

export interface RoutineEnv {
  ADMIN_READERS?: string;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
}

interface RoutineContext {
  request: Request;
  env: RoutineEnv;
  params: { route?: string[] };
}

export async function onRequest(context: RoutineContext): Promise<Response> {
  const { request, env, params } = context;
  const route = (params.route ?? []).join("/");

  if (route !== "templates") return fail("not-found", 404);

  return methods(request, {
    GET: async () => {
      /* A reader who is not signed in is not an error here. They
         have no private templates for the same reason a
         signed-out reader has no routine: there is no account for
         one to belong to. */
      const reader = await readerFrom(request, env);
      const admin = reader ? await isAdmin(reader, env) : false;
      return ok({ templates: admin ? PRIVATE_TEMPLATES : [] });
    },
  });
}

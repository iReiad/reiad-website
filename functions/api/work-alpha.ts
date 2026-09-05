/* /api/work-alpha: is this reader the owner of the control room?

   One question and one gate. `isAdmin()` is the only place that
   decides, and a reader who is not one gets a 404 rather than a 403:
   the page answers the same way, so a stranger learns nothing from
   either. The state itself never passes through here; the browser
   reads and writes `work_alpha_state` with the reader's own bearer. */

import { fail, methods, ok } from "../_lib/http.ts";
import { readerFrom, type ReaderEnv } from "../_lib/reader.ts";
import { isAdmin, type AdminEnv } from "../_lib/admins.ts";

interface Context {
  request: Request;
  env: AdminEnv & ReaderEnv;
}

export function onRequest({ request, env }: Context): Response | Promise<Response> {
  return methods(request, {
    GET: async () => {
      const reader = await readerFrom(request, env).catch(() => null);
      const owner = reader ? await isAdmin(env, request, reader.id) : false;
      return owner ? ok({ owner: true }) : fail("not-found", 404);
    },
  });
}

/* ============================================================
   /api/courses/*: the third-party course catalogue, to an admin
   and to nobody else.

   GET /api/courses            the eight courses and their counts
   GET /api/courses/<slug>     one course: its modules, its
                               lessons, and the Drive id behind
                               each one

   ---- why this is an endpoint rather than a page ----

   Every other ladder on this site is rendered by the server into
   the HTML, because every other ladder is this site's own
   writing and a crawler is welcome to it. This one is somebody
   else's course sitting in one person's private Drive folder. It
   is not published, and the way a thing is not published is that
   the server does not put it in a response it will give anybody.

   So the pages under `/skills/courses/` are shells: real
   addresses, real chrome, and no catalogue in them. The
   catalogue arrives here, once the reader has proved who they
   are and `isAdmin()` has said yes. A reader who is not an admin
   gets 403 and a shell that says so, which is the truth rather
   than a 404 pretending the section does not exist.

   That is the same arrangement `/tools/live.html` uses for the
   broker's admin half, and the argument is the one in
   `_lib/admins.js`: anything that wants to know whether somebody
   is an admin asks `isAdmin()`, and nothing keeps a second list.

   ---- what "gated" does and does not mean ----

   It means the catalogue is not readable without an admin
   session. It does NOT mean the Drive files are protected by
   this site: they are protected by Drive, which is where they
   live and whose permissions decide who may open them. This
   endpoint hands out ids, and an id opens nothing on its own.
   Both locks are real and neither is the other.
   ============================================================ */

import { fail, methods, ok } from "../../_lib/http.js";
import { readerFrom } from "../../_lib/reader.js";
import { isAdmin } from "../../_lib/admins.js";
import { courseOf, forBrowser, listForBrowser } from "../../../shared/courses.ts";

export async function onRequest(context) {
  const { request, env, params } = context;
  const route = (params.route ?? []).join("/");

  /* Sign-in first, and its failure is separate from the
     permission failure below on purpose: "you are not signed in"
     and "you are signed in and this is not yours" are different
     things to be told, and a page that conflates them offers a
     sign-in button to somebody already signed in. */
  let reader;
  try {
    reader = await readerFrom(request, env);
  } catch (err) {
    return fail("bad-token", 401, { message: String(err?.message ?? err) });
  }
  if (!reader) return fail("sign-in-required", 401);

  if (!await isAdmin(env, request, reader.id)) {
    return fail("not-yours", 403, {
      message: "This section is one person's own copy of a third-party course. "
        + "It is not published.",
    });
  }

  if (!route) {
    return methods(request, {
      GET: async () => ok({ courses: listForBrowser() }),
    });
  }

  const course = courseOf(route);
  if (!course) return fail("no-such-course", 404);

  return methods(request, {
    /* No Cache-Control, deliberately. This is a per-reader answer
       behind a permission check, and the one thing that must not
       happen is a shared cache holding it for the next person. */
    GET: async () => ok({ course: forBrowser(course) }),
  });
}

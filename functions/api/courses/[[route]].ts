/* ============================================================
   /api/courses/*: the third-party course catalogue, to an admin
   and to nobody else.

   GET /api/courses               the eight courses and their counts
   GET /api/courses/<slug>        one course: its modules, its
                                  lessons, and the id behind each
   GET /api/courses/ticket/<id>   a short pass for that file
   GET /api/courses/file/<id>     that file's bytes, streamed
   GET /api/courses/reading/<id>  that page, sanitised

   ---- why the last two exist ----

   Because the first version handed Drive ids to the browser and
   let it embed Drive directly, and that cannot work for a private
   file. A cross-site iframe gets no Drive cookie in a modern
   browser, so Drive sees an anonymous request for something that
   is not public and answers "Unable to load video". The file is
   fine and the embed is fine; the mechanism only ever worked for
   files shared by link, and these deliberately are not.

   So the browser asks this origin instead and the Worker holds
   the one credential. `_lib/drive.ts` is that seam.

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

   That is the same arrangement `/tools/live` uses for the
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

import { fail, methods, ok } from "../../_lib/http.ts";
import { readerFrom } from "../../_lib/reader.js";
import { isAdmin } from "../../_lib/admins.ts";
import { sanitiseHTML } from "../../_lib/sanitise.ts";
import { canReachDrive, driveFile } from "../../_lib/drive.ts";
import {
  courseOf, forBrowser, listForBrowser, isCourseFile, lessonForFile,
} from "../../../shared/courses.ts";
import { canTicket, checkTicket, mintTicket } from "../../_lib/ticket.ts";
import { parseQuiz } from "../../_lib/quiz.ts";
import type { DriveEnv } from "../../_lib/drive.ts";
import type { TicketEnv } from "../../_lib/ticket.ts";

/* What this handler needs out of the Worker's environment, which
   is the Drive credential and whatever `isAdmin()` and
   `readerFrom()` read for themselves. Declared rather than typed
   as `any` so that adding a secret is a change to a type as well
   as to a dashboard. */
export interface CoursesEnv extends DriveEnv, TicketEnv {
  ADMIN_READERS?: string;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
}

interface CoursesContext {
  request: Request;
  env: CoursesEnv;
  params: { route?: string[] };
}

export async function onRequest(context: CoursesContext): Promise<Response> {
  const { request, env, params } = context;
  const route = (params.route ?? []).join("/");

  const parts = (params.route ?? []).map(String);

  /* ---- bytes, and the one route that is NOT behind sign-in ----

     `<video src>` is the browser fetching a URL by itself. It
     sends no `Authorization` header, and this site's reader
     session is a bearer token in localStorage rather than a
     cookie, so such a request arrives with NO credential of any
     kind. Putting it behind the sign-in check below would 401
     every video that has ever been played. It did, for exactly as
     long as it took to ask the deployed site.

     A ticket is the credential instead, and it is not a weaker
     one: it is signed with a key only this Worker holds, it names
     this one file, it expires in half an hour, and it is only ever
     minted for a reader who was signed in and an admin at the
     moment they asked. Possession of a valid ticket therefore
     means an admin minted it, minutes ago, for this file, which is
     the whole of what the two checks below would establish.

     `isCourseFile()` still runs first, so an id the catalogue does
     not name is refused before a credential is even loaded. */
  if (parts[0] === "file") {
    const id = parts[1] ?? "";
    if (!isCourseFile(id)) return fail("no-such-file", 404);
    if (!canReachDrive(env)) return notConnected();

    const url = new URL(request.url);
    if (!await checkTicket(env, id, url.searchParams.get("t"))) {
      return fail("bad-ticket", 403, {
        message: "That pass is missing or has expired. Reload the lesson.",
      });
    }
    return serveFile(request, env, id);
  }

  /* ---- captions, in front of sign-in for the same reason ----

     A `<track>` inside a `<video>` is fetched by the browser on
     its own, exactly like the video, with no header this site can
     add. So it carries the same signed ticket and rests on the
     same argument. */
  if (parts[0] === "captions") {
    const id = parts[1] ?? "";
    if (!isCourseFile(id)) return fail("no-such-file", 404);
    if (!canReachDrive(env)) return notConnected();

    const url = new URL(request.url);
    if (!await checkTicket(env, id, url.searchParams.get("t"))) {
      return fail("bad-ticket", 403, {
        message: "That pass is missing or has expired. Reload the lesson.",
      });
    }
    return serveCaptions(env, id);
  }

  /* Everything else is somebody signed in, and that failure is
     separate from the permission failure below on purpose: "you
     are not signed in" and "you are signed in and this is not
     yours" are different things to be told, and a page that
     conflates them offers a sign-in button to somebody already
     signed in. */
  let reader;
  try {
    reader = await readerFrom(request, env);
  } catch (err) {
    return fail("bad-token", 401, { message: String((err as Error)?.message ?? err) });
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

  /* ---- a pass, and a reading's HTML ----

     `isCourseFile()` is the second lock and the load-bearing one.
     Without it this is a proxy that fetches any Drive id it is
     handed, which is a read-only window onto the whole of
     somebody's Drive resting entirely on the admin check above.
     With it, an id that is not part of a lesson is refused before
     a credential is even loaded. */
  if (parts[0] === "ticket" || parts[0] === "reading" || parts[0] === "quiz") {
    const id = parts[1] ?? "";

    if (!isCourseFile(id)) return fail("no-such-file", 404);
    if (!canReachDrive(env) || !canTicket(env)) return notConnected();

    if (parts[0] === "reading") return serveReading(env, id);
    if (parts[0] === "quiz") return serveQuiz(env, id);
    return ok({ url: `/api/courses/file/${id}?t=${await mintTicket(env, id)}` });
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

/* Only an admin ever reads this, which is the one place on this
   site where naming the missing secret in a response is the right
   thing to do rather than a leak. It names the Worker too: there
   are two, and secrets set on the wrong one look exactly like
   secrets that were never set. */
const notConnected = (): Response => fail("drive-not-connected", 503, {
  message: "This site cannot read the course files yet: GOOGLE_SA_EMAIL and "
    + "GOOGLE_SA_KEY are not set on the reiad-website Worker. The Drive folder "
    + "also has to be shared with that service account. See CLAUDE.md.",
});

/** Stream one file through, without holding it.

    The upstream response is passed on rather than read, so a
    thirty-megabyte lesson video never sits in the Worker's
    memory. `Range` is forwarded both ways, which is the whole of
    what makes a video scrubbable: without it the browser can only
    play from the beginning and dragging the bar re-downloads
    everything before the point dragged to. */
async function serveFile(request: Request, env: CoursesEnv, id: string): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return fail("method-not-allowed", 405);
  }

  const upstream = await driveFile(env, id, { range: request.headers.get("Range") });
  if (!upstream) return fail("drive-not-connected", 503);
  if (!upstream.ok && upstream.status !== 206) {
    return fail("drive-said-no", upstream.status === 404 ? 404 : 502, {
      message: `Drive answered ${upstream.status} for that file.`,
    });
  }

  const headers = new Headers();
  for (const key of ["Content-Type", "Content-Length", "Content-Range", "Accept-Ranges"]) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }
  if (!headers.has("Accept-Ranges")) headers.set("Accept-Ranges", "bytes");

  /* Private to this reader and never to a shared cache: the
     permission was checked per request and a CDN holding the
     answer would be handing it to whoever asked next. */
  headers.set("Cache-Control", "private, max-age=0, no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  /* Whatever Drive says this is, it is never something the
     browser should run in this site's origin. */
  headers.set("Content-Security-Policy", "default-src 'none'; sandbox");

  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

/** A saved Coursera page, cleaned up enough to sit inside a
    lesson.

    These are scraped web pages, so they arrive as whole documents
    with their own stylesheets, scripts and asset links that point to
    a server that stopped serving them years ago. `sanitiseHTML()`
    is the same one the Studio runs over an article on the way
    into the database, and it drops script, style, iframe and the
    rest outright. What is left is the words, which is what a
    reading is.

    The result reads plainly rather than beautifully, and that is
    the honest outcome: this site is showing somebody else's page
    without its stylesheet, not recreating it. */
async function serveReading(env: CoursesEnv, id: string): Promise<Response> {
  const upstream = await driveFile(env, id);
  if (!upstream) return fail("drive-not-connected", 503);
  if (!upstream.ok) {
    return fail("drive-said-no", upstream.status === 404 ? 404 : 502, {
      message: `Drive answered ${upstream.status} for that page.`,
    });
  }

  /* A reading is tens of kilobytes; the largest in this catalogue
     is about half a megabyte. Read it whole, unlike a video,
     because it has to be rewritten before it can be sent. */
  const raw = await upstream.text();
  const found = lessonForFile(id);

  return ok({
    title: found?.lesson.title ?? "",
    html: sanitiseHTML(bodyOf(raw)),
  });
}

/** A quiz, as questions rather than as somebody else's markup.

    `serveReading` cannot do this job. Every option in a Coursera
    quiz lives inside a `<form>`, and `sanitiseHTML()` drops `form`
    whole, contents and all, which is correct for an article and
    silently deletes the entire answer list here. The page showed
    "Question 2", a rule, "Question 3", a rule, and looked fine.

    So the structure is read before anything is sanitised, and what
    goes over the wire is data: a prompt, a type, and a list of
    option strings. The browser builds its own inputs from that,
    which is also why no foreign `<input>` ever reaches this page.

    Falls back to the reading renderer when the file turns out not
    to be a quiz after all, so an export in a shape this does not
    know is still readable rather than blank. */
async function serveQuiz(env: CoursesEnv, id: string): Promise<Response> {
  const upstream = await driveFile(env, id);
  if (!upstream) return fail("drive-not-connected", 503);
  if (!upstream.ok) {
    return fail("drive-said-no", upstream.status === 404 ? 404 : 502, {
      message: `Drive answered ${upstream.status} for that quiz.`,
    });
  }

  const raw = await upstream.text();
  const questions = parseQuiz(raw);
  const found = lessonForFile(id);

  return ok({
    title: found?.lesson.title ?? "",
    questions,
    /* Said out loud rather than left for the browser to infer from
       an empty list, because "this is not a quiz" and "this quiz
       has no questions" want different words on the page. */
    parsed: questions.length > 0,
    html: questions.length ? "" : sanitiseHTML(bodyOf(raw)),
  });
}

/** A video's captions, as WebVTT.

    The files in Drive are SubRip, which no browser has ever read
    in a `<track>`: point one at an `.srt` and you get a player
    with a captions button that turns nothing on. The two formats
    are close enough that converting is a header and a decimal
    point, and far enough apart that not converting fails silently.

    Read whole rather than streamed: a caption file for a ten
    minute lesson is a few kilobytes, and it has to be rewritten
    before it can be sent. */
async function serveCaptions(env: CoursesEnv, id: string): Promise<Response> {
  const upstream = await driveFile(env, id);
  if (!upstream) return fail("drive-not-connected", 503);
  if (!upstream.ok) {
    return fail("drive-said-no", upstream.status === 404 ? 404 : 502, {
      message: `Drive answered ${upstream.status} for those captions.`,
    });
  }

  return new Response(toVTT(await upstream.text()), {
    headers: {
      "Content-Type": "text/vtt; charset=utf-8",
      /* Same as the video it belongs to: checked per request, so
         never held by a cache that would hand it to the next
         person to ask. */
      "Cache-Control": "private, max-age=0, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** SubRip to WebVTT.

    Three differences and that is all of them: VTT wants a
    `WEBVTT` line at the top, it writes the fraction of a second
    after a full stop where SubRip writes a comma, and it will not
    tolerate a byte order mark before the header. Cue numbers are
    legal in both and are left alone.

    The comma is replaced only inside a timecode, not everywhere.
    Captions are prose and prose has commas in it; a blanket
    replace turns "first, we will" into "first. we will" in every
    subtitle on the site. */
export function toVTT(srt: string): string {
  const text = srt.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");

  /* Already VTT, which is what a future export might hand us.
     Passing it through is one line and saves a corrupted file. */
  if (/^WEBVTT/.test(text.trimStart())) return text;

  const cues = text.replace(
    /(\d{1,2}:\d{2}(?::\d{2})?),(\d{1,3})\s*-->\s*(\d{1,2}:\d{2}(?::\d{2})?),(\d{1,3})/g,
    "$1.$2 --> $3.$4",
  );

  return `WEBVTT\n\n${cues.trimStart()}`;
}

/** The inside of `<body>`, when the file is a whole document.

    A saved page carries `<html>`, `<head>` and a title bar that
    would be a second heading inside a page that already has one.
    Anything without a body tag is passed through as it stands,
    which is what a fragment is. */
function bodyOf(html: string): string {
  const match = /<body[^>]*>([\s\S]*?)<\/body\s*>/i.exec(html);
  return match ? match[1] : html;
}

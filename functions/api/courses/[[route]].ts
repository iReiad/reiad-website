/* /api/courses/*: the third-party course catalogue, to an admin
   and to nobody else.

   GET /api/courses               the programmes, each with its
                                  courses and their counts
   GET /api/courses/<programme>/<course>
                                  one course: its modules, its
                                  lessons, and the id behind each
   GET /api/courses/ticket/<id>   a short pass for that file
   GET /api/courses/file/<id>     that file's bytes, streamed
   GET /api/courses/reading/<id>  that page, sanitised

   The last two exist because a private Drive file cannot be
   embedded: a cross-site iframe gets no Drive cookie, so Drive
   answers an anonymous request for something not public with
   "Unable to load video". So the browser asks this origin and the
   Worker holds the one credential. `_lib/drive.ts` is that seam.

   AN ENDPOINT RATHER THAN A PAGE, because this is somebody else's
   course in one person's private Drive folder. The way a thing is
   not published is that the server does not put it in a response
   it will give anybody, so the pages under `/skills/courses/` are
   shells with no catalogue in them. A reader who is not an admin
   gets 403 and a shell that says so, which is the truth rather
   than a 404 pretending the section does not exist.

   Anything that wants to know whether somebody is an admin asks
   `isAdmin()`, and nothing keeps a second list.

   "Gated" means the catalogue is not readable without an admin
   session. It does NOT mean the Drive files are protected by this
   site: they are protected by Drive. This endpoint hands out ids,
   and an id opens nothing on its own. */

import { fail, methods, ok } from "../../_lib/http.ts";
import { readerFrom } from "../../_lib/reader.ts";
import { isAdmin } from "../../_lib/admins.ts";
import { sanitiseHTML } from "../../_lib/sanitise.ts";
import { canReachDrive, driveFile } from "../../_lib/drive.ts";
import {
  courseOf, programmeOf, forBrowser, listForBrowser, isCourseFile, lessonForFile,
  COURSES, ID_FIELDS,
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
     kind: putting it behind the sign-in check below 401s every
     video that has ever been played.

     A ticket is the credential instead, and it is not a weaker
     one: signed with a key only this Worker holds, naming this one
     file, expiring in half an hour, and only ever minted for a
     reader who was signed in and an admin at the moment they
     asked.

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
     its own, with no header this site can add, so it carries the
     same signed ticket. */
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
     handed, which is a read-only window on to the whole of
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

  /* ---- what the admin panel asks, and why it is answered HERE ----

     Every number is counted out of `shared/courses.data.json`
     rather than typed, and it is counted in the WORKER because
     `next/` may not import the value half of `shared/courses.ts`:
     a page that did would put 1,629 Drive ids into a bundle
     anybody can fetch, and would look identical. So the panel gets
     totals and a handful of lesson titles, and never the ids. */
  if (route === "status") {
    return methods(request, {
      GET: async () => {
        let modules = 0;
        let lessons = 0;
        let ids = 0;
        let videos = 0;
        let missingCaptions = 0;
        /* A handful of titles, not the list. The panel's job is to
           say IF something is wrong and roughly how much; the id
           behind each one is the thing that must not travel. */
        const samples: Array<{ course: string; lesson: string }> = [];
        for (const c of COURSES) {
          modules += c.modules.length;
          for (const m of c.modules) {
            for (const l of m.lessons) {
              lessons += 1;
              for (const f of ID_FIELDS) if (l[f]) ids += 1;
              if (l.video) {
                videos += 1;
                if (!l.captions) {
                  missingCaptions += 1;
                  if (samples.length < 12) samples.push({ course: c.title, lesson: l.title });
                }
              }
            }
          }
        }
        return ok({
          courses: COURSES.length,
          modules, lessons, ids, videos,
          missingCaptions,
          samples,
          drive: canReachDrive(env),
          tickets: canTicket(env),
        });
      },
    });
  }

  /* ONE COURSE, NAMED THE WAY ITS ADDRESS NAMES IT: the programme
     and then the course. A course slug is unique across the
     catalogue, so this could have taken one segment, but the page
     asks with the address it is on, and a route that quietly
     accepts half of one stops matching the page the day two
     programmes hold the same slug. */
  const programme = programmeOf(parts[0] ?? "");
  const course = programme && parts.length === 2
    ? courseOf(programme, parts[1])
    : null;
  if (!programme || !course) return fail("no-such-course", 404);

  return methods(request, {
    /* No Cache-Control, deliberately. This is a per-reader answer
       behind a permission check, and the one thing that must not
       happen is a shared cache holding it for the next person. */
    GET: async () => ok({
      course: forBrowser(course),
      /* Beside the course rather than inside it: a programme is
         the other thing this address names, not a field of a
         course, and `forBrowser()` is also what the module and
         lesson pages read. It is here so a course page can name
         the certificate it is in without a second request. */
      programme: { slug: programme.slug, title: programme.title },
    }),
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

/** Stream one file through, without holding it: a thirty-megabyte
    lesson video never sits in the Worker's memory. `Range` is
    forwarded both ways, which is the whole of what makes a video
    scrubbable. */
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
    with their own stylesheets, scripts and asset links pointing at
    a server that stopped serving them years ago. `sanitiseHTML()`
    is the same one the Studio runs over an article, and it drops
    script, style, iframe and the rest outright. The result reads
    plainly rather than beautifully, which is honest: this is
    somebody else's page without its stylesheet, not a recreation
    of it. */
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

    `serveReading` cannot do this job: every option lives inside a
    `<form>` and `sanitiseHTML()` drops `form` whole, contents and
    all, which is correct for an article and silently deletes the
    entire answer list here. So the structure is read before
    anything is sanitised and what goes over the wire is data: a
    prompt, a type, and a list of option strings. The browser
    builds its own inputs from that, which is also why no foreign
    `<input>` ever reaches this page.

    Falls back to the reading renderer when the file turns out not
    to be a quiz, so an unknown shape is readable rather than
    blank. */
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
    in a `<track>`: point one at an `.srt` and you get a captions
    button that turns nothing on. Converting is a header and a
    decimal point, and not converting fails silently.

    Read whole rather than streamed: a caption file is a few
    kilobytes and has to be rewritten before it can be sent. */
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

/** SubRip to WebVTT. Three differences and that is all of them:
    VTT wants a `WEBVTT` line at the top, writes the fraction of a
    second after a full stop where SubRip writes a comma, and will
    not tolerate a byte order mark before the header. Cue numbers
    are legal in both.

    The comma is replaced ONLY inside a timecode. Captions are
    prose and prose has commas in it: a blanket replace turns
    "first, we will" into "first. we will" in every subtitle on the
    site. */
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

/** The inside of `<body>`, when the file is a whole document. A
    saved page carries `<html>`, `<head>` and a title bar that
    would be a second heading. Anything without a body tag is
    passed through as it stands, which is what a fragment is. */
function bodyOf(html: string): string {
  const match = /<body[^>]*>([\s\S]*?)<\/body\s*>/i.exec(html);
  return match ? match[1] : html;
}

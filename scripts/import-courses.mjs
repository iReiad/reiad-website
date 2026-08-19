/* ============================================================
   import-courses.mjs: the third-party course catalogue, from the
   Drive folder it actually lives in.

   `shared/courses.data.json` is GENERATED. Do not hand-edit it,
   for the reason at the top of `CLAUDE.md`: a list that is typed
   is a list that is right on the day it was typed. A course
   folder gains a lesson, somebody renames a week, and the only
   thing that notices is a reader clicking a video that is not
   there. So the catalogue is derived from Drive and re-derived
   whenever Drive changes, and `--check` fails the build when the
   committed copy has drifted from the folder it claims to
   describe.

   ---- two front ends, one transform ----

     --drive <folderId>   walk the Drive API. What you run to
                          refresh the catalogue.
     --crawl  <dir>       read a folder listing already captured
                          as TSV. What seeded the first commit,
                          and what lets this be tested with no
                          network and no credential.

   Both produce the same tree and hand it to the same builder, so
   the seed and every later refresh cannot disagree about what a
   lesson is. `scripts/lib/coursera.ts` is that agreement.

   ---- the credential ----

   The files are private, which is the whole point of this
   section: it is one person's own copy of a course they are
   working through, gated behind the admin check, never
   published. A private file needs an OAuth ACCESS TOKEN. An API
   key will not open one, and neither will a service account
   unless the folder has been shared with it, so do not reach for
   either.

   The scope to ask for is the narrowest one that works:

     https://www.googleapis.com/auth/drive.metadata.readonly

   This script reads three fields per row, `id`, `name` and
   `mimeType`, and never opens a file. That scope cannot read file
   CONTENT at all, which is the right amount of power to hand a
   catalogue builder: if it is ever wrong, the worst it can do is
   read the names of things.

   TWO WAYS TO GET ONE. Both give a token that lasts about an
   hour, which is roughly fifty times longer than a full walk of
   the folder takes.

   1. The OAuth playground, if you want no setup at all.

      https://developers.google.com/oauthplayground

      Put the scope above into "Input your own scopes" in step 1,
      authorise as the account that OWNS the folder, then press
      "Exchange authorization code for tokens" in step 2. The
      access token is the `ya29....` string.

      Note the playground is a Google-owned OAuth client, so this
      grants that client read access to your Drive metadata for
      the hour the token lives. Revoke it afterwards at
      myaccount.google.com/permissions if you would rather not
      leave it sitting there.

   2. gcloud, if it is already installed, which leaves no
      third-party client holding anything:

        gcloud auth application-default login \
          --scopes=https://www.googleapis.com/auth/drive.metadata.readonly
        gcloud auth application-default print-access-token

   Then either pass it or export it. Exporting is better, because
   an argument ends up in the shell history and a token is a
   bearer credential for the hour it lives:

     export GOOGLE_OAUTH_TOKEN=ya29....
     node scripts/import-courses.mjs --drive 1dyYLbVa2lS9o7oRAEZOpQgZMpUtd15La

   NOTHING IS WRITTEN UNTIL THE WHOLE WALK SUCCEEDS, so a token
   that expires halfway leaves the committed catalogue exactly as
   it was. Get a fresh one and run it again.

   ---- the three ways to run it ----

     node scripts/import-courses.mjs --drive 1dyYL...    refresh
     node scripts/import-courses.mjs --crawl <dir>       from a listing
     node scripts/import-courses.mjs --crawl <dir> --check   has it drifted

   Add `--dump <dir>` to a `--drive` run to write the listing back
   out as TSV. Do that whenever the catalogue is refreshed, so the
   fixture CI reads stays in step with it:

     node scripts/import-courses.mjs --drive 1dyYL... \
       --dump scripts/fixtures/course-crawl
   ============================================================ */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  splitName, splitCourse, kindOf, titleOf, slugify,
} from "./lib/coursera.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "shared", "courses.data.json");

/* ---------- arguments ---------- */

const argv = process.argv.slice(2);
const flag = (name) => {
  const at = argv.indexOf(name);
  return at === -1 ? null : (argv[at + 1] ?? "");
};
const has = (name) => argv.includes(name);

const CHECK = has("--check");
const DUMP = flag("--dump");
const DRIVE = flag("--drive");
const CRAWL = flag("--crawl");
const TOKEN = flag("--token") ?? process.env.GOOGLE_OAUTH_TOKEN ?? "";

/* Folders that are in the download and are not part of the
   course. The one this exists for ships with every scraped
   Coursera export and holds nothing but links to piracy sites;
   it is not a module and must never become one. */
const SKIP_FOLDER = /^0\.\s|^Websites you may like/i;

/* ============================================================
   Front end 1: the Drive API
   ============================================================ */

const API = "https://www.googleapis.com/drive/v3/files";

/* At most this many listings in the air at once.

   The tree is walked a level at a time, and the bottom level of a
   Coursera export is about 170 folders. Firing all of those at
   once is not faster: Drive answers a burst like that with 429s,
   the walk then fails on whichever folders happened to lose, and
   the failure looks like a permissions problem because the body
   of a 429 mentions quota. Eight is comfortably under the
   per-user ceiling and finishes the whole tree in well under a
   minute. */
const AT_ONCE = 8;

/* A 429 or a 5xx is Drive asking for a moment, not an answer. The
   backoff is exponential from a quarter second, which is the
   shape Google's own client libraries use, with a cap so a
   genuinely broken call fails in seconds rather than minutes. */
const RETRIES = 5;

const sleep = (ms) => new Promise((go) => { setTimeout(go, ms); });

async function askDrive(url, parent) {
  for (let attempt = 0; ; attempt += 1) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (res.ok) return res.json();

    const said = await res.text();

    /* 401 is the one worth naming, because it is the one that
       will actually happen: an access token from the OAuth
       playground or from gcloud lasts an hour, and an import
       started at fifty-nine minutes dies in the middle with a
       message about credentials that reads like a scope problem. */
    if (res.status === 401) {
      throw new Error(
        "Drive said 401: the access token is expired or wrong.\n"
        + "  Access tokens last about an hour. Get a fresh one and re-run;\n"
        + "  nothing is written until the whole walk succeeds.");
    }
    if (res.status === 403 && !/rateLimit|userRateLimit|quota/i.test(said)) {
      throw new Error(
        `Drive said 403 for ${parent}: the token is valid and is not allowed to read `
        + `this folder.\n  Check the scope covers metadata, and that this account `
        + `owns the folder.\n  ${said}`);
    }

    const worthRetrying = res.status === 429 || res.status >= 500
      || (res.status === 403 && /rateLimit|userRateLimit|quota/i.test(said));

    if (!worthRetrying || attempt >= RETRIES) {
      throw new Error(`Drive said ${res.status} for ${parent}: ${said}`);
    }

    await sleep(Math.min(250 * 2 ** attempt, 8000));
  }
}

async function listChildren(parent) {
  const rows = [];
  let pageToken = "";

  do {
    const url = new URL(API);
    url.searchParams.set("q", `'${parent}' in parents and trashed = false`);
    url.searchParams.set("fields", "nextPageToken,files(id,name,mimeType)");
    url.searchParams.set("pageSize", "1000");
    url.searchParams.set("supportsAllDrives", "true");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const body = await askDrive(url, parent);
    for (const f of body.files ?? []) rows.push(f);
    pageToken = body.nextPageToken ?? "";
  } while (pageToken);

  return rows;
}

/** Run `job` over every item, `AT_ONCE` at a time, keeping the
    results in the order the items came in. */
async function pooled(items, job) {
  const out = new Array(items.length);
  let next = 0;

  const worker = async () => {
    while (next < items.length) {
      const mine = next;
      next += 1;
      out[mine] = await job(items[mine]);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(AT_ONCE, items.length) }, worker));
  return out;
}

const FOLDER = "application/vnd.google-apps.folder";

/** Breadth-first, a level at a time, so the progress line means
    something and so the pool above has a whole level to work
    through rather than one folder's children. */
async function walkDrive(root) {
  if (!TOKEN) {
    throw new Error(
      "No credential. These files are private, so an API key will not open them.\n"
      + "  Pass --token <access token>, or set GOOGLE_OAUTH_TOKEN.\n"
      + "  See the head of this file for the two ways to get one.");
  }

  const tree = new Map();
  let level = [root];
  let depth = 0;

  while (level.length) {
    const listings = await pooled(level, listChildren);
    const next = [];

    level.forEach((parent, i) => {
      for (const row of listings[i]) {
        if (row.mimeType === FOLDER && SKIP_FOLDER.test(row.name)) continue;
        tree.set(row.id, { parent, name: row.name, folder: row.mimeType === FOLDER });
        if (row.mimeType === FOLDER) next.push(row.id);
      }
    });

    depth += 1;
    process.stderr.write(
      `  level ${depth}: read ${level.length} folder(s), found ${next.length} more, `
      + `${tree.size} entries so far\n`);
    level = next;
  }

  return tree;
}

/* ============================================================
   Front end 2: a captured listing

   Two tab-separated files, `id parent kind name` for folders and
   `id parent name` for files. Exactly what the Drive listing
   gives, with nothing added, so that a tree read from here and a
   tree read from the API are the same object.
   ============================================================ */

function walkCrawl(dir) {
  const tree = new Map();

  const rows = (file) => {
    const path = join(dir, file);
    if (!existsSync(path)) return [];
    return readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => l.split("\t"));
  };

  for (const [id, parent, , name] of rows("tree.tsv")) {
    if (SKIP_FOLDER.test(name)) continue;
    tree.set(id, { parent, name, folder: true });
  }
  for (const [id, parent, name] of rows("files.tsv")) {
    tree.set(id, { parent, name, folder: false });
  }

  return tree;
}

/* ============================================================
   The transform: a tree of Drive rows becomes a catalogue
   ============================================================ */

const childrenOf = (tree, parent, folder) =>
  [...tree.entries()]
    .filter(([, row]) => row.parent === parent && row.folder === folder)
    .map(([id, row]) => ({ id, name: row.name }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

function build(tree, root) {
  const courses = [];

  for (const folder of childrenOf(tree, root, true)) {
    const said = splitCourse(folder.name);
    if (!said) continue;                       // not `N. Title`: not a course

    const course = {
      slug: slugOf(said.title),
      n: said.n,
      title: said.title,
      drive: folder.id,
      modules: [],
    };

    for (const modFolder of childrenOf(tree, folder.id, true)) {
      const parsed = /^(\d{2})_(.+)$/.exec(modFolder.name);
      if (!parsed) continue;

      const mod = {
        slug: slugify(parsed[2]),
        n: Number(parsed[1]),
        title: titleOf(parsed[2]),
        drive: modFolder.id,
        lessons: [],
      };

      /* The group folder folds into the lesson's `section`, and
         the lessons are numbered across the whole module rather
         than restarting per group, because the ladder in the
         sidebar reads straight down and a reader counting "lesson
         7 of 22" should not meet three lesson ones. */
      let position = 0;
      for (const group of childrenOf(tree, modFolder.id, true)) {
        const parsedGroup = /^(\d{2})_(.+)$/.exec(group.name);
        const section = titleOf(parsedGroup ? parsedGroup[2] : group.name);

        const groupSlug = parsedGroup ? parsedGroup[2] : group.name;
        for (const lesson of lessonsIn(tree, group.id, groupSlug)) {
          position += 1;
          mod.lessons.push({ ...lesson, section, position });
        }
      }

      /* A module with no lessons is kept and SAYS so, rather than
         being dropped. Two different things produce one, and the
         reader is owed the difference either way: a folder in
         Drive that is genuinely empty, and a module this
         catalogue has not been walked far enough to fill. A
         dropped module is a hole in the ladder that looks like a
         course with fewer weeks in it; a pending one is a rung
         that says "not imported". After a full `--drive` run
         nothing carries this. */
      if (!mod.lessons.length) mod.pending = true;
      course.modules.push(mod);
    }

    if (course.modules.length) courses.push(course);
  }

  courses.sort((a, b) => a.n - b.n);
  for (const course of courses) course.modules.sort((a, b) => a.n - b.n);
  return { courses };
}

/** Every lesson inside one group folder, in file order.

    A lesson is a `NN_` prefix, and everything sharing that prefix
    belongs to it: the video, the transcript, the reading, the
    quiz and any attachments. */
function lessonsIn(tree, group, groupSlug) {
  const byPrefix = new Map();

  for (const file of childrenOf(tree, group, false)) {
    const part = splitName(file.name);
    if (!part) continue;
    const key = `${String(part.n).padStart(2, "0")}_${part.slug}`;
    if (!byPrefix.has(key)) byPrefix.set(key, []);
    byPrefix.get(key).push({ ...part, id: file.id, name: file.name });
  }

  return [...byPrefix.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "en"))
    .map(([, parts]) => oneLesson(parts, groupSlug));
}

function oneLesson(parts, groupSlug) {
  const first = parts[0];
  const pick = (kind) => parts.find((p) => p.kind === kind)?.id ?? null;

  /* A `bare` page is named after its file rather than after
     itself, and the same file name recurs across groups, so it
     takes its group's name as well. Qualified for EVERY such page
     rather than only on collision, deliberately: a slug that
     changed the day a second `01__resources.html` appeared in the
     module would be a URL that moved and a tick that was lost. */
  const slug = slugify(first.bare ? `${groupSlug}-${first.slug}` : first.slug);

  const lesson = {
    slug,
    title: titleOf(slug),
    kind: kindOf(parts),
  };

  const video = pick("video");
  if (video) lesson.video = video;

  /* A reading, a quiz and an exam are all a page of Coursera HTML
     and all open in Drive's own viewer. They are named separately
     because the lesson SAYS which it is, and "quiz" and "reading"
     are different promises to somebody deciding whether they have
     twenty minutes. */
  for (const kind of ["reading", "quiz", "exam"]) {
    const id = pick(kind);
    if (id) lesson[kind] = id;
  }

  /* Two files, and they are not the same thing. The `.en.txt` is
     the transcript: prose, offered as a link, for reading instead
     of watching. The `.en.srt` is the captions: the same words
     with timings on them, which is what a <track> needs and what
     puts subtitles over the picture.

     Only the first was carried for a while. Every video had both
     in Drive, `coursera.mjs` classified both correctly, and the
     player had no captions because the id stopped here. */
  for (const kind of ["transcript", "captions"]) {
    const id = pick(kind);
    if (id) lesson[kind] = id;
  }

  const files = parts
    .filter((p) => p.kind === "attachment")
    .map((p) => ({ name: attachmentName(p), ext: p.ext, drive: p.id }));
  if (files.length) lesson.files = files;

  return lesson;
}

/** `..._Learning_Log_Template__Think_about_data.docx` -> `Learning Log Template: Think about data`.

    Coursera writes a double underscore where the original title
    had a colon, and single underscores for its spaces. Both are
    reversible and neither is a guess. */
const attachmentName = (part) =>
  part.suffix
    .replace(/^_/, "")
    .replace(new RegExp(`\\.${part.ext}$`, "i"), "")
    .replace(/__/g, ": ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const slugOf = slugify;

/* ============================================================
   Run
   ============================================================ */

const root = DRIVE || readFileSync(OUT, "utf8").match(/"root":\s*"([^"]+)"/)?.[1];

if (!root) {
  console.error("Nothing to import: pass --drive <folderId>.");
  process.exit(1);
}

/* A tool somebody runs by hand, so a failure is a sentence rather
   than a stack trace: every throw above is written to be read,
   and a trace would bury the one line that says what to do. */
let tree;
try {
  tree = CRAWL ? walkCrawl(join(ROOT, CRAWL)) : await walkDrive(root);
} catch (err) {
  console.error(`\n${err?.message ?? err}\n`);
  process.exit(1);
}

/* Write the listing back out as TSV, so that a walk which needed a
   credential leaves behind something that does not. That is what
   `scripts/fixtures/course-crawl/` is: without it, the catalogue
   is the one generated file in this repository whose generator
   only one person can run, and a generated file nobody can
   regenerate quietly becomes a hand-maintained one. */
if (DUMP) {
  const dir = join(ROOT, DUMP);
  mkdirSync(dir, { recursive: true });

  const rows = [...tree.entries()];
  const line = (cols) => `${cols.join("\t")}\n`;

  writeFileSync(join(dir, "tree.tsv"), rows
    .filter(([, r]) => r.folder)
    .map(([id, r]) => line([id, r.parent, "folder", r.name]))
    .join(""));

  writeFileSync(join(dir, "files.tsv"), rows
    .filter(([, r]) => !r.folder)
    .map(([id, r]) => line([id, r.parent, r.name]))
    .join(""));

  console.log(`${DUMP}: ${rows.filter(([, r]) => r.folder).length} folder(s), `
    + `${rows.filter(([, r]) => !r.folder).length} file(s)`);
}

const built = build(tree, root);

const catalogue = {
  /* Where this came from, so a refresh needs no argument and a
     reader of the file can go and look at the folder. */
  root,
  source: "Google Drive",
  /* No timestamp, deliberately, for the reason
     `content/schools.backup.json` gives: identical content should
     be identical bytes, so that the git log answers "did the
     catalogue change" rather than "was this re-run". */
  ...built,
};

const json = `${JSON.stringify(catalogue, null, 2)}\n`;

const counts = built.courses.reduce((acc, c) => ({
  courses: acc.courses + 1,
  modules: acc.modules + c.modules.length,
  lessons: acc.lessons + c.modules.reduce((n, m) => n + m.lessons.length, 0),
  videos: acc.videos + c.modules.reduce(
    (n, m) => n + m.lessons.filter((l) => l.video).length, 0),
}), { courses: 0, modules: 0, lessons: 0, videos: 0 });

if (CHECK) {
  const have = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (have !== json) {
    console.error(
      "shared/courses.data.json is not what the source says it should be.\n"
      + "Re-run without --check to rewrite it.");
    process.exit(1);
  }
  console.log(`courses: ok (${counts.courses} courses, ${counts.modules} modules, `
    + `${counts.lessons} lessons)`);
} else {
  writeFileSync(OUT, json);
  console.log(`shared/courses.data.json: ${counts.courses} courses, ${counts.modules} modules, `
    + `${counts.lessons} lessons, ${counts.videos} with video`);
}

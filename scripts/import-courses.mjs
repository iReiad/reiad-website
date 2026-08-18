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
   lesson is. `scripts/lib/coursera.mjs` is that agreement.

   ---- the credential ----

   The files are private, which is the whole point of this
   section: it is one person's own copy of a course they are
   working through, gated behind the admin check, never
   published. A private file needs an OAuth access token; an API
   key will not open one. Pass `--token`, or set
   GOOGLE_OAUTH_TOKEN.

     node scripts/import-courses.mjs --drive 1dyYL... --token ya29....
     node scripts/import-courses.mjs --crawl tmp/crawl
     node scripts/import-courses.mjs --drive 1dyYL... --check
   ============================================================ */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  splitName, splitCourse, kindOf, titleOf,
} from "./lib/coursera.mjs";

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

    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) {
      throw new Error(`Drive said ${res.status} for ${parent}: ${await res.text()}`);
    }
    const body = await res.json();
    for (const f of body.files ?? []) rows.push(f);
    pageToken = body.nextPageToken ?? "";
  } while (pageToken);

  return rows;
}

const FOLDER = "application/vnd.google-apps.folder";

/** Breadth-first, so a slow folder does not hold up the level
    below it, and so the progress line means something. */
async function walkDrive(root) {
  if (!TOKEN) {
    throw new Error(
      "No credential. These files are private, so an API key will not open them: "
      + "pass --token <oauth access token> or set GOOGLE_OAUTH_TOKEN.");
  }

  const tree = new Map();
  let level = [root];
  let depth = 0;

  while (level.length) {
    const listings = await Promise.all(level.map((id) => listChildren(id)));
    const next = [];

    level.forEach((parent, i) => {
      for (const row of listings[i]) {
        if (row.mimeType === FOLDER && SKIP_FOLDER.test(row.name)) continue;
        tree.set(row.id, { parent, name: row.name, folder: row.mimeType === FOLDER });
        if (row.mimeType === FOLDER) next.push(row.id);
      }
    });

    depth += 1;
    process.stderr.write(`  level ${depth}: ${next.length} folders, ${tree.size} entries so far\n`);
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
        slug: parsed[2],
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

        for (const lesson of lessonsIn(tree, group.id)) {
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
function lessonsIn(tree, group) {
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
    .map(([, parts]) => oneLesson(parts));
}

function oneLesson(parts) {
  const first = parts[0];
  const pick = (kind) => parts.find((p) => p.kind === kind)?.id ?? null;

  const lesson = {
    slug: first.slug,
    title: titleOf(first.slug),
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

  const transcript = pick("transcript");
  if (transcript) lesson.transcript = transcript;

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

const slugOf = (title) =>
  title.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ============================================================
   Run
   ============================================================ */

const root = DRIVE || readFileSync(OUT, "utf8").match(/"root":\s*"([^"]+)"/)?.[1];

if (!root) {
  console.error("Nothing to import: pass --drive <folderId>.");
  process.exit(1);
}

const tree = CRAWL ? walkCrawl(join(ROOT, CRAWL)) : await walkDrive(root);
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

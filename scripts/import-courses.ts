/* import-courses.ts: the third-party course catalogue, from the
   Drive folder it lives in.

     node scripts/import-courses.ts --drive <folderId> --dump <dir>
     node scripts/import-courses.ts --crawl <dir>
     node scripts/import-courses.ts --crawl <dir> --check

   `shared/courses.data.json` is GENERATED. Do not hand-edit it:
   a typed list is right on the day it was typed, and `--check`
   fails the build when the committed copy has drifted.

   Two front ends, one transform. `--drive` walks the Drive API and
   `--crawl` reads a listing already captured as TSV, and both hand
   the same tree to the same builder, so the seed and every later
   refresh cannot disagree about what a lesson is.
   `scripts/lib/coursera.ts` is that agreement.

   ALWAYS PASS `--dump` ON A `--drive` RUN. The listing it writes
   back out is the only reason CI can rebuild the catalogue with no
   credential; refresh one without the other and the next `--check`
   fails on a drift that is really a stale fixture.

   The credential is an OAuth ACCESS TOKEN in `GOOGLE_OAUTH_TOKEN`,
   scoped `drive.metadata.readonly`, which cannot read file content
   at all. An API key will not open a private file and neither will
   a service account unless the folder is shared with it. CLAUDE.md
   has the two ways to get one; export it rather than passing it,
   because an argument goes into the shell history and a token is a
   bearer credential for the hour it lives.

   NOTHING IS WRITTEN UNTIL THE WHOLE WALK SUCCEEDS, so a token
   that expires halfway leaves the committed catalogue alone. */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  splitName, splitCourse, kindOf, titleOf, slugify, type Part, type PartKind,
} from "./lib/coursera.ts";
import type {
  Catalogue, Course, CourseLesson, CourseModule, Programme,
} from "../shared/courses.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "shared", "courses.data.json");

/* ---------- arguments ---------- */

const argv = process.argv.slice(2);
const flag = (name: string): string | null => {
  const at = argv.indexOf(name);
  return at === -1 ? null : (argv[at + 1] ?? "");
};
const has = (name: string): boolean => argv.includes(name);

const CHECK = has("--check");
const DUMP = flag("--dump");
const DRIVE = flag("--drive");
const CRAWL = flag("--crawl");
const TOKEN = flag("--token") ?? process.env.GOOGLE_OAUTH_TOKEN ?? "";

/* Folders that are in the download and are not part of the
   course. The one this exists for ships with every scraped
   Coursera export and holds nothing but links to piracy sites; it
   is not a module and must never become one. */
const SKIP_FOLDER = /^0\.\s|^Websites you may like/i;

/* ============================================================
   Front end 1: the Drive API
   ============================================================ */

const API = "https://www.googleapis.com/drive/v3/files";

/* At most this many listings in the air at once. The bottom level
   of a Coursera export is about 170 folders, and firing all of
   those at once is not faster: Drive answers a burst like that
   with 429s, and the failure looks like a permissions problem
   because the body of a 429 mentions quota. */
const AT_ONCE = 8;

/* A 429 or a 5xx is Drive asking for a moment, not an answer.
   Exponential from a quarter second, with a cap so a genuinely
   broken call fails in seconds rather than minutes. */
const RETRIES = 5;

const sleep = (ms: number): Promise<void> =>
  new Promise((go) => { setTimeout(go, ms); });

/** One file as Drive lists it: the three fields the query asks for
    and nothing else. `mimeType` is how a folder is told from a
    file, and it is the ONLY difference between the two front ends
    below: the TSV carries the same fact as a column. */
interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface DriveListing {
  files?: DriveFile[];
  nextPageToken?: string;
}

async function askDrive(url: URL, parent: string): Promise<DriveListing> {
  for (let attempt = 0; ; attempt += 1) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (res.ok) return await res.json() as DriveListing;

    const said = await res.text();

    /* 401 is the one worth naming, because it is the one that
       will happen: a token lasts an hour, and an import started at
       fifty-nine minutes dies in the middle with a message about
       credentials that reads like a scope problem. */
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

async function listChildren(parent: string): Promise<DriveFile[]> {
  const rows: DriveFile[] = [];
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
async function pooled<T, R>(items: T[], job: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
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

/** One entry of the tree, and what both front ends produce. A row
    read from Drive and a row read from the TSV have to be the same
    object or the two would drift. */
interface Node {
  parent: string;
  name: string;
  folder: boolean;
}

type Tree = Map<string, Node>;

/** One folder's own name, which listing its children does not
    give. Drive answers `files.get` with the fields asked for. */
async function folderName(id: string): Promise<string> {
  const url = new URL(`${API}/${id}`);
  url.searchParams.set("fields", "name");
  url.searchParams.set("supportsAllDrives", "true");
  const res = await fetch(url, { headers: { authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) {
    throw new Error(`Drive refused to name the root folder (${res.status}). `
      + "The token may not reach it.");
  }
  const said = await res.json() as { name?: string };
  if (!said.name) throw new Error("Drive named the root folder nothing.");
  return said.name;
}

/** Breadth-first, a level at a time, so the progress line means
    something and so the pool above has a whole level to work
    through rather than one folder's children. */
async function walkDrive(root: string): Promise<Tree> {
  if (!TOKEN) {
    throw new Error(
      "No credential. These files are private, so an API key will not open them.\n"
      + "  Pass --token <access token>, or set GOOGLE_OAUTH_TOKEN.\n"
      + "  See the head of this file for the two ways to get one.");
  }

  const tree: Tree = new Map();

  /* THE ROOT'S OWN ROW, with an empty parent so it is nobody's
     child and `childrenOf` never returns it. Listing a folder's
     children never says what the folder is called, and a
     programme has to be called something: the only honest source
     is the folder. */
  tree.set(root, { parent: "", name: await folderName(root), folder: true });

  let level = [root];
  let depth = 0;

  while (level.length) {
    const listings = await pooled(level, listChildren);
    const next: string[] = [];

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

/* Front end 2: a captured listing. Two tab-separated files,
   `id parent kind name` for folders and `id parent name` for
   files: exactly what the Drive listing gives, with nothing added,
   so a tree read from here and one read from the API are the same
   object. */

function walkCrawl(dir: string): Tree {
  const tree: Tree = new Map();

  const rows = (file: string): string[][] => {
    const path = join(dir, file);
    if (!existsSync(path)) return [];
    return readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => l.split("\t"));
  };

  /* A row with an empty parent is the root's own, written by
     `--dump` so a crawl carries the name of the folder it walked.
     It is nobody's child, so nothing else has to know about it. */
  for (const [id, parent, , name] of rows("tree.tsv")) {
    if (SKIP_FOLDER.test(name)) continue;
    tree.set(id, { parent: parent ?? "", name, folder: true });
  }
  for (const [id, parent, name] of rows("files.tsv")) {
    tree.set(id, { parent, name, folder: false });
  }

  return tree;
}

/* ============================================================
   The transform: a tree of Drive rows becomes a catalogue
   ============================================================ */

/** A folder's children of one kind, by name. */
const childrenOf = (
  tree: Tree, parent: string, folder: boolean,
): Array<{ id: string; name: string }> =>
  [...tree.entries()]
    .filter(([, row]) => row.parent === parent && row.folder === folder)
    .map(([id, row]) => ({ id, name: row.name }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

/** Is this folder a course, or a programme holding courses?

    STRUCTURAL, NOT A GUESS. A course's child folders are modules
    and a module is `NN_something`; a programme's child folders are
    courses and a course is `N. Something`. Both conventions are
    Coursera's own. A folder with neither shape under it is
    neither, and `build` skips it. */
const holdsModules = (tree: Tree, folder: string): boolean =>
  childrenOf(tree, folder, true).some((kid) => /^\d{2}_/.test(kid.name));

function buildCourse(tree: Tree, folder: { id: string; name: string }): Course | null {
  const said = splitCourse(folder.name);
  if (!said) return null;                      // not `N. Title`: not a course
  const course: Course = {
    slug: slugOf(said.title),
    n: said.n,
    title: said.title,
    drive: folder.id,
    modules: [],
  };

  for (const modFolder of childrenOf(tree, folder.id, true)) {
      const parsed = /^(\d{2})_(.+)$/.exec(modFolder.name);
      if (!parsed) continue;

      const mod: CourseModule = {
        slug: slugify(parsed[2]),
        n: Number(parsed[1]),
        title: titleOf(parsed[2]),
        drive: modFolder.id,
        lessons: [],
      };

      /* The group folder folds into the lesson's `section`, and
         the lessons are numbered across the whole module rather
         than restarting per group: the sidebar reads straight
         down, and a reader counting "lesson 7 of 22" should not
         meet three lesson ones. */
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

      /* A module with no lessons is kept and SAYS so rather than
         being dropped, because two different things produce one
         and the reader is owed the difference: a Drive folder that
         is genuinely empty, and a module this catalogue has not
         been walked far enough to fill. After a full `--drive` run
         nothing carries this. */
    if (!mod.lessons.length) mod.pending = true;
    course.modules.push(mod);
  }

  if (!course.modules.length) return null;
  course.modules.sort((a, b) => a.n - b.n);
  return course;
}

/** The catalogue: programmes, each holding its courses.

    TWO LAYOUTS, AND BOTH ARE REAL. A Drive root may hold programme
    folders, or it may hold course folders directly, which is what
    it holds today. `holdsModules()` tells them apart by what is
    under them.

    Where the root holds courses, the root ITSELF is the programme:
    that is what the folder already was, and the eight were listed
    as unrelated courses only because this importer started one
    level too deep. A part-moved Drive works too, so nothing is
    dropped while somebody is halfway through tidying. */
function build(tree: Tree, root: string, rootName: string): { programmes: Programme[] } {
  const programmes: Programme[] = [];
  const loose: Course[] = [];

  for (const folder of childrenOf(tree, root, true)) {
    if (holdsModules(tree, folder.id)) {
      const course = buildCourse(tree, folder);
      if (course) loose.push(course);
      continue;
    }

    const said = splitCourse(folder.name);
    const courses: Course[] = [];
    for (const kid of childrenOf(tree, folder.id, true)) {
      const course = buildCourse(tree, kid);
      if (course) courses.push(course);
    }
    if (!courses.length) continue;

    courses.sort((a, b) => a.n - b.n);
    programmes.push({
      slug: slugOf(said ? said.title : folder.name),
      n: said ? said.n : programmes.length + 1,
      title: said ? said.title : folder.name,
      drive: folder.id,
      courses,
    });
  }

  if (loose.length) {
    loose.sort((a, b) => a.n - b.n);
    /* FIRST, and numbered from one, because the root programme is
       the one that was already there: a new folder added beside
       it should not renumber somebody's existing shelf. */
    programmes.unshift({
      slug: slugOf(rootName),
      n: 1,
      title: rootName,
      drive: root,
      courses: loose,
    });
    programmes.forEach((p, i) => { p.n = i + 1; });
  }

  programmes.sort((a, b) => a.n - b.n);
  return { programmes };
}

/** Every lesson inside one group folder, in file order. A lesson
    is a `NN_` prefix, and everything sharing that prefix belongs
    to it: the video, the transcript, the reading, the quiz and any
    attachments. */
function lessonsIn(tree: Tree, group: string, groupSlug: string): NewLesson[] {
  const byPrefix = new Map<string, FilePart[]>();

  for (const file of childrenOf(tree, group, false)) {
    const part = splitName(file.name);
    if (!part) continue;
    const key = `${String(part.n).padStart(2, "0")}_${part.slug}`;
    const filed = byPrefix.get(key);
    const one: FilePart = { ...part, id: file.id, name: file.name };
    if (filed) filed.push(one);
    else byPrefix.set(key, [one]);
  }

  return [...byPrefix.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "en"))
    .map(([, parts]) => oneLesson(parts, groupSlug));
}

/** One file of a lesson: what its name says it is, plus where it
    sits in Drive. `Part` is the reading of the name and knows
    nothing about Drive; the id is what turns it into something the
    catalogue can point at. */
interface FilePart extends Part {
  id: string;
  name: string;
}

/** A lesson before the module has placed it. `section` and
    `position` are the module's to decide, because the numbering
    runs across the groups rather than restarting inside each. */
type NewLesson = Omit<CourseLesson, "section" | "position">;

function oneLesson(parts: FilePart[], groupSlug: string): NewLesson {
  const first = parts[0];
  const pick = (kind: PartKind): string | null =>
    parts.find((p) => p.kind === kind)?.id ?? null;

  /* A `bare` page is named after its file rather than after
     itself, and the same file name recurs across groups, so it
     takes its group's name as well. Qualified for EVERY such page
     rather than only on collision: a slug that changed the day a
     second `01__resources.html` appeared would be a URL that moved
     and a tick that was lost. */
  const slug = slugify(first.bare ? `${groupSlug}-${first.slug}` : first.slug);

  const lesson: NewLesson = {
    slug,
    title: titleOf(slug),
    kind: kindOf(parts),
  };

  const video = pick("video");
  if (video) lesson.video = video;

  /* A reading, a quiz and an exam are all a page of Coursera HTML
     and all open in Drive's own viewer. Named separately because
     the lesson SAYS which it is, and they are different promises
     to somebody deciding whether they have twenty minutes. */
  for (const kind of ["reading", "quiz", "exam"] as const) {
    const id = pick(kind);
    if (id) lesson[kind] = id;
  }

  /* Two files, and they are not the same thing. The `.en.txt` is
     the transcript: prose, offered as a link, for reading instead
     of watching. The `.en.srt` is the captions, the same words
     with timings on them, which is what a <track> needs. Only the
     first was carried for a while, so every player had a captions
     button that turned nothing on. */
  for (const kind of ["transcript", "captions"] as const) {
    const id = pick(kind);
    if (id) lesson[kind] = id;
  }

  const files = parts
    .filter((p) => p.kind === "attachment")
    .map((p) => ({ name: attachmentName(p), ext: p.ext ?? "", drive: p.id }));
  if (files.length) lesson.files = files;

  return lesson;
}

/** `..._Learning_Log_Template__Think_about_data.docx` -> `Learning Log Template: Think about data`.
    Coursera writes a double underscore where the original title
    had a colon, and single underscores for its spaces. Both are
    reversible and neither is a guess. */
const attachmentName = (part: FilePart): string =>
  /* `suffix` and `ext` are optional on a `Part` because a video
     and a transcript have neither, and every part reaching here
     is an attachment, which `splitName` gives both to. */
  (part.suffix ?? "")
    .replace(/^_/, "")
    .replace(new RegExp(`\\.${part.ext ?? ""}$`, "i"), "")
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
let tree: Tree;
try {
  tree = CRAWL ? walkCrawl(join(ROOT, CRAWL)) : await walkDrive(root);
} catch (err) {
  console.error(`\n${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}

/* Write the listing back out as TSV, so a walk that needed a
   credential leaves behind something that does not. Without
   `scripts/fixtures/course-crawl/`, the catalogue is the one
   generated file here whose generator only one person can run, and
   a generated file nobody can regenerate becomes a hand-maintained
   one. */
if (DUMP) {
  const dir = join(ROOT, DUMP);
  mkdirSync(dir, { recursive: true });

  const rows = [...tree.entries()];
  const line = (cols: string[]): string => `${cols.join("\t")}\n`;

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

/* The root folder's own name, out of its own row in the tree.
   Absent only in a crawl taken before `--dump` wrote that row, so
   the message names the fix rather than inventing a name. */
const rootName = tree.get(root)?.name;
if (!rootName) {
  console.error(
    "\nThis crawl does not say what the root folder is called, so the\n"
    + "programme holding these courses has no name.\n"
    + "  Re-run with --drive <folderId> --dump <dir> to refresh it.\n");
  process.exit(1);
}

const built = build(tree, root, rootName);

const catalogue: Catalogue = {
  /* Where this came from, so a refresh needs no argument and a
     reader of the file can go and look at the folder. */
  root,
  source: "Google Drive",
  /* No timestamp, deliberately, for the reason
     `content/schools.backup.json` gives: identical content should
     be identical bytes, so the git log answers "did the catalogue
     change" rather than "was this re-run". */
  ...built,
};

const json = `${JSON.stringify(catalogue, null, 2)}\n`;

const counts = built.programmes.flatMap((p) => p.courses).reduce((acc, c) => ({
  programmes: acc.programmes,
  courses: acc.courses + 1,
  modules: acc.modules + c.modules.length,
  lessons: acc.lessons + c.modules.reduce((n, m) => n + m.lessons.length, 0),
  videos: acc.videos + c.modules.reduce(
    (n, m) => n + m.lessons.filter((l) => l.video).length, 0),
}), { programmes: built.programmes.length, courses: 0, modules: 0, lessons: 0, videos: 0 });

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

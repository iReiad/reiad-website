#!/usr/bin/env node
/* ============================================================
   check-courses.mjs: the third-party course section, held to the
   four things about it that are easy to get quietly wrong.

       node scripts/check-courses.mjs

   None of these produces an error at runtime. Each of them
   produces a page that renders, looks finished, and is wrong,
   which is the shape of bug this repository writes checks for.

   1. A DRIVE ID THAT IS NOT ONE. The catalogue is a list of
      33-character Drive ids and nothing else identifies a lesson's
      video. A truncated or mistyped id is a `/preview` iframe that
      loads Drive's "file not found" page inside a 16:9 box. It
      looks like a permissions problem, it is reported as one, and
      no amount of changing sharing settings fixes it.

   2. THE CATALOGUE LEAKING INTO THE BROWSER BUNDLE. The whole
      section is admin-only, and the way it stays that way is that
      no page renders it: the shells are empty and the data comes
      from `/api/courses` behind `isAdmin()`. One `import { COURSES }`
      in a Next component undoes all of that silently, because the
      page still looks identical. Only `import type` is allowed.

   3. THE TWO COPIES OF "WHERE DOES A LESSON LIVE" DISAGREEING.
      `shared/courses.ts` is the Worker's and `aab/src/courses.ts`
      is the browser's, and neither can import the other. So the
      six address rules are written twice on purpose, and this is
      what stops the two from drifting: a sidebar that links to
      one address while the router serves another is a section of
      dead links that every individual page passes.

   4. A SLUG THAT IS NOT AN ADDRESS. Every slug is both a URL
      segment and part of the id a reader's ticks are filed under,
      so it has to be lower case and hyphens like every other
      address here. The first real import produced 21 that were
      not, and a slug is the one thing that cannot be tidied later
      without losing somebody's progress.

   5. AN ADDRESS THE WORKER DOES NOT ROUTE. `NEXT_ROUTES` in
      `worker.js` decides which paths reach the Next.js Worker at
      all. A slug shape it does not match is a page that 404s on
      the live site while every other check here passes, and the
      Cloudflare branch preview CANNOT catch it: the preview is
      the Next Worker addressed directly, so it answers whatever
      it is asked and never consults that table. This is the one
      thing about this section that only a local check can see.

   6. FILES THE IMPORTER QUIETLY DROPPED. `splitName()` decides
      what a filename is, and anything it does not recognise is
      skipped. That is not a visible failure: the lesson still
      renders, with one fewer thing under it, and two whole modules
      once came back empty and were drawn as "not imported" while
      their pages sat in the folder. The first real import dropped
      133 of 1,579 files this way. So the drop rate is measured
      against the committed listing and has to stay near zero.

   7. THE API SAYING SOMETHING THE BROWSER DOES NOT EXPECT.
      `forBrowser()` decides what a lesson looks like on the wire
      and the `Lesson` interface in the browser module describes
      it. A field added to one and not the other is `undefined`
      where a title should be.
   ============================================================ */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  COURSES, CATALOGUE, forBrowser, laddered, catalogueCounts,
  courseUrl, moduleUrl, lessonUrl,
} from "../shared/courses.ts";
import { NEXT_ROUTES } from "../worker.js";
import { splitName } from "./lib/coursera.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];
const say = (what) => problems.push(what);

/* ============================================================
   1. Every Drive id is a Drive id
   ============================================================ */

/* Drive's own format: base64url, and in practice 28 to 44
   characters. The range rather than a fixed 33 because Drive has
   issued more than one length over the years and a check that
   insisted on today's would fail on a folder made in 2019. What
   it is really catching is the truncation and the stray quote. */
const DRIVE_ID = /^[A-Za-z0-9_-]{25,60}$/;

/* Every slug goes into an address and into the tick's id, so it is
   held to the shape every other address on this site has. The
   first real import produced 21 that were not: a `06_Resources`
   folder kept its capital, and the saved pages named after files
   rather than titles brought underscores with them. Neither is
   fatal on its own; both are expensive to correct later, because
   moving a slug moves the id a reader's progress is filed under. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const checkSlug = (value, what, where) => {
  if (!SLUG.test(value)) say(`${where}: ${what} slug "${value}" is not lower case and hyphens`);
};

let ids = 0;
const seen = new Map();

const checkId = (value, where) => {
  ids += 1;
  if (!DRIVE_ID.test(value)) {
    say(`${where}: "${value}" is not a Drive id`);
    return;
  }
  /* The same file used twice is not an error in itself, but the
     same VIDEO on two lessons almost always means a copied line. */
  const already = seen.get(value);
  if (already) say(`${where}: the same Drive id is also on ${already}`);
  else seen.set(value, where);
};

checkId(CATALOGUE.root, "the catalogue root");

for (const course of COURSES) {
  checkId(course.drive, `course ${course.slug}`);
  checkSlug(course.slug, "course", course.slug);

  const slugs = new Set();
  for (const mod of course.modules) {
    checkId(mod.drive, `${course.slug}/${mod.slug}`);
    checkSlug(mod.slug, "module", `${course.slug}/${mod.slug}`);

    if (slugs.has(mod.slug)) say(`${course.slug}: two modules called ${mod.slug}`);
    slugs.add(mod.slug);

    const lessonSlugs = new Set();
    for (const lesson of mod.lessons) {
      const at = `${course.slug}/${mod.slug}/${lesson.slug}`;

      /* A lesson slug has to be unique inside its module, because
         the address and the tick's id are both built from it. Two
         lessons sharing one means one of them is unreachable and
         both share a tick. */
      checkSlug(lesson.slug, "lesson", at);
      if (lessonSlugs.has(lesson.slug)) say(`${at}: two lessons share this slug`);
      lessonSlugs.add(lesson.slug);

      for (const key of ["video", "reading", "quiz", "exam", "transcript"]) {
        if (lesson[key]) checkId(lesson[key], `${at} (${key})`);
      }
      for (const file of lesson.files ?? []) checkId(file.drive, `${at} (${file.name})`);
    }

    /* `pending` and lessons are mutually exclusive by definition.
       Both at once means the importer wrote one and not the
       other, and the page would draw an empty module with lessons
       in it. */
    if (mod.pending && mod.lessons.length) {
      say(`${course.slug}/${mod.slug}: marked pending and has lessons`);
    }
    if (!mod.pending && !mod.lessons.length) {
      say(`${course.slug}/${mod.slug}: no lessons and not marked pending`);
    }
  }

  /* The ladder is what the sidebar walks and what "continue"
     steps through, so a duplicate id in it is a reader who cannot
     get past a lesson. */
  const ladder = laddered(course);
  const unique = new Set(ladder.map((l) => l.id));
  if (unique.size !== ladder.length) {
    say(`${course.slug}: ${ladder.length - unique.size} duplicate lesson id(s) in the ladder`);
  }
}

/* ============================================================
   2. Nothing under next/ imports the catalogue
   ============================================================ */

const grep = (pattern, path) => {
  try {
    return execFileSync("grep", ["-rn", "--include=*.ts", "--include=*.tsx", pattern, path],
      { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    return [];                                  // grep exits 1 on no match
  }
};

for (const line of grep("shared/courses", join(ROOT, "next"))) {
  /* `import type { … }` is erased by TypeScript before anything
     is bundled, so it costs the browser nothing and is the
     supported way for a component to know what a lesson is. */
  if (/import\s+type\s/.test(line)) continue;
  say(`next/ imports the catalogue, which publishes it: ${line.trim()}`);
}

/* ============================================================
   3. The two copies of the address rules agree
   ============================================================ */

const sharedSrc = readFileSync(join(ROOT, "shared", "courses.ts"), "utf8");
const browserSrc = readFileSync(join(ROOT, "aab", "src", "courses.ts"), "utf8");

/** The template literal a named arrow function returns.

    Deliberately dumb: both files write these as one-liners
    returning a single template, so the first backtick-delimited
    string after the name is the rule. A rewrite that made either
    of them a block body would fail here rather than pass
    vacuously, which is the right way round. */
function template(src, name) {
  const at = src.indexOf(`const ${name} =`);
  if (at === -1) return null;
  const open = src.indexOf("`", at);
  if (open === -1) return null;
  const close = src.indexOf("`", open + 1);
  return close === -1 ? null : src.slice(open + 1, close);
}

/* The address rules both files define. `readingUrl` is only in
   `shared/courses.ts`: the browser reaches that endpoint through
   `api()`, which composes the path itself, so a second copy of it
   here would be a rule with one author and nothing to check. */
const RULES = ["courseUrl", "moduleUrl", "lessonUrl", "lessonId", "fileUrl", "driveUrl"];

for (const name of RULES) {
  const a = template(sharedSrc, name);
  const b = template(browserSrc, name);
  if (a === null) { say(`shared/courses.ts has no one-line ${name}`); continue; }
  if (b === null) { say(`aab/src/courses.ts has no one-line ${name}`); continue; }
  if (a !== b) {
    say(`${name} differs:\n    shared/courses.ts   ${a}\n    aab/src/courses.ts  ${b}`);
  }
}

/* ============================================================
   5. Every address the catalogue generates is one the Worker
      forwards
   ============================================================ */

{
  const urls = ["/skills/courses/index.html"];
  for (const course of COURSES) {
    urls.push(courseUrl(course.slug));
    for (const mod of course.modules) {
      urls.push(moduleUrl(course.slug, mod.slug));
      for (const lesson of mod.lessons) {
        urls.push(lessonUrl(course.slug, mod.slug, lesson.slug));
      }
    }
  }

  const missed = urls.filter((url) => !NEXT_ROUTES.some((re) => re.test(url)));
  if (missed.length) {
    say(`${missed.length} of ${urls.length} address(es) are not in NEXT_ROUTES, so the `
      + `Worker would hand them to the asset router and they would 404:`);
    for (const url of missed.slice(0, 8)) say(`  unrouted: ${url}`);
    if (missed.length > 8) say(`  ... and ${missed.length - 8} more`);
  }
}

/* ============================================================
   6. Almost nothing was dropped on the way in
   ============================================================ */

/* A ratio rather than a count, so it keeps meaning something when
   the folder grows. 133 of 1,579 is 8.4% and has to fail; the two
   that survive today are 0.13% and are genuinely not lessons: the
   README at the root of the download, and one saved link whose
   name ends `.with.google` so its last dot is not an extension. */
const DROP_ALLOWANCE = 0.01;

const listing = join(ROOT, "scripts", "fixtures", "course-crawl", "files.tsv");

if (existsSync(listing)) {
  const files = readFileSync(listing, "utf8").split("\n").filter(Boolean)
    .map((line) => line.split("\t")[2] ?? "");
  const dropped = files.filter((name) => !splitName(name));

  if (files.length && dropped.length / files.length > DROP_ALLOWANCE) {
    say(`the importer drops ${dropped.length} of ${files.length} file(s), over `
      + `${Math.round(DROP_ALLOWANCE * 100)}%. Each one is a lesson or an attachment `
      + `nobody will see is missing.`);
    for (const name of dropped.slice(0, 12)) say(`  dropped: ${name}`);
    if (dropped.length > 12) say(`  ... and ${dropped.length - 12} more`);
  }
}

/* ============================================================
   7. The wire format is what the browser expects
   ============================================================ */

/** The field names of one `export interface` in the browser
    module, which is its claim about what the API sends. */
function fields(src, name) {
  const at = src.indexOf(`export interface ${name} {`);
  if (at === -1) return null;
  const end = src.indexOf("\n}", at);
  if (end === -1) return null;
  return src.slice(at, end)
    .split("\n")
    .map((line) => /^\s{2}([A-Za-z_][A-Za-z0-9_]*)\??:/.exec(line)?.[1])
    .filter(Boolean)
    .sort();
}

const sample = COURSES.find((c) => c.modules.some((m) => m.lessons.length));

if (!sample) {
  say("no course has any lessons, so the wire format cannot be checked");
} else {
  const wire = forBrowser(sample);
  const mod = wire.modules.find((m) => m.lessons.length);

  const pairs = [
    ["Course", Object.keys(wire)],
    ["Module", Object.keys(wire.modules[0])],
    ["Lesson", Object.keys(mod.lessons[0])],
  ];

  for (const [name, got] of pairs) {
    const said = fields(browserSrc, name);
    if (!said) { say(`aab/src/courses.ts has no exported ${name} interface`); continue; }
    const sent = [...got].sort();

    const missing = sent.filter((k) => !said.includes(k));
    const extra = said.filter((k) => !sent.includes(k));
    if (missing.length) {
      say(`forBrowser() sends ${name}.${missing.join(", ")}, which the browser does not describe`);
    }
    if (extra.length) {
      say(`the browser expects ${name}.${extra.join(", ")}, which forBrowser() does not send`);
    }
  }
}

/* ============================================================ */

const counts = catalogueCounts();

if (problems.length) {
  console.error(`courses: ${problems.length} problem(s).\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(
  `courses: ${counts.courses} course(s), ${counts.modules} module(s) `
  + `(${counts.pending} not imported), ${counts.lessons} lesson(s), `
  + `${ids} Drive id(s), all well formed.`);

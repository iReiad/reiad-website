#!/usr/bin/env node
/* check-courses.ts: the third-party course section, held to the
   eight things that are easy to get quietly wrong. None produces
   an error at runtime; each produces a page that renders, looks
   finished, and is wrong.

       node scripts/check-courses.ts

   1. A DRIVE ID THAT IS NOT ONE: a truncated id is Drive's "file
      not found" page inside a 16:9 box, which reads as a
      permissions problem no sharing setting fixes.
   2. THE CATALOGUE LEAKING INTO A BROWSER BUNDLE. The section is
      admin-only because no page renders it. One
      `import { COURSES }` under `next/` undoes that silently.
      Only `import type` is allowed.
   3. THE TWO COPIES OF "WHERE DOES A LESSON LIVE" DISAGREEING.
      `shared/courses.ts` is the Worker's and `aab/src/courses.ts`
      the browser's, and neither can import the other, so the
      seven address rules are written twice on purpose.
   4. A SLUG THAT IS NOT AN ADDRESS. A slug is a URL segment AND
      part of the id a reader's ticks are filed under, so it
      cannot be tidied later without losing progress.
   5. AN ADDRESS THE WORKER DOES NOT ROUTE. The Cloudflare branch
      preview cannot catch this: it is the Next Worker addressed
      directly and never consults `NEXT_ROUTES`.
   6. FILES THE IMPORTER QUIETLY DROPPED. Anything `splitName()`
      does not recognise is skipped, and the lesson still renders
      with one fewer thing under it, so the drop rate is measured
      against the committed listing.
   7. THE API SAYING SOMETHING THE BROWSER DOES NOT EXPECT: a
      field on `forBrowser()` and not on `Lesson` is `undefined`
      where a title should be.
   8. A TICK ID THAT GAINED THE SEGMENT THE ADDRESS GAINED. See
      section 2 below.

   The sections are numbered in reading order and are not one per
   reason: reason 4 is checked inside section 1. */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  COURSES, PROGRAMMES, CATALOGUE, forBrowser, laddered, catalogueCounts, lessonId,
  programmeFor, programmeUrl, courseUrl, moduleUrl, lessonUrl, ID_FIELDS,
} from "../shared/courses.ts";
import { nextOwns } from "../worker.js";
import { splitName } from "./lib/coursera.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const problems: string[] = [];
const say = (what: string): number => problems.push(what);

/* ============================================================
   1. Every Drive id is a Drive id
   ============================================================ */

/* Drive's own format: base64url, in practice 28 to 44 characters.
   A range rather than a fixed 33 because Drive has issued more
   than one length over the years. What it really catches is the
   truncation and the stray quote. */
const DRIVE_ID = /^[A-Za-z0-9_-]{25,60}$/;

/* Every slug goes into an address AND into the tick's id, so it is
   held to the shape every other address here has. Both ways it
   went wrong are cheap now and expensive later, because moving a
   slug moves the id a reader's progress is filed under. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const checkSlug = (value: string, what: string, where: string): void => {
  if (!SLUG.test(value)) say(`${where}: ${what} slug "${value}" is not lower case and hyphens`);
};

let ids = 0;
/** A Drive id, to the first place it was seen. Two lessons naming
    one file is a lesson pointing at somebody else's video. */
const seen = new Map<string, string>();

const checkId = (value: string, where: string): void => {
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

/* A COURSE SLUG HAS TO BE UNIQUE ACROSS THE WHOLE CATALOGUE, not
   only inside its programme, and the reason is in `lessonId()`:
   the address gained a programme segment and the tick did not, so
   two programmes each holding a "Foundations" would share one set
   of ticks and a reader would open a course they had never started
   and find it half done. The fix is renaming a Drive folder. */
const courseSlugs = new Map<string, string>();

for (const programme of PROGRAMMES) {
  /* THE ROOT PROGRAMME SHARES THE ROOT'S ID, and that is the
     arrangement rather than a collision: where the Drive root
     holds courses directly, the root folder IS the programme.
     Everything else sharing an id is still a parsing bug. */
  if (programme.drive !== CATALOGUE.root) {
    checkId(programme.drive, `programme ${programme.slug}`);
  }
  checkSlug(programme.slug, "programme", programme.slug);
  if (!programme.courses.length) {
    say(`programme ${programme.slug} holds no courses`);
  }
}

for (const course of COURSES) {
  const where = programmeFor(course);
  if (!where) {
    say(`course ${course.slug} is in no programme, so it has no address`);
  }
  const clash = courseSlugs.get(course.slug);
  if (clash) {
    say(`two courses are called ${course.slug} (${clash} and ${where?.slug ?? "?"}), `
      + "so they would share one set of ticks: rename one of the Drive folders");
  } else {
    courseSlugs.set(course.slug, where?.slug ?? "?");
  }

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
         lessons sharing one means one is unreachable and both
         share a tick. */
      checkSlug(lesson.slug, "lesson", at);
      if (lessonSlugs.has(lesson.slug)) say(`${at}: two lessons share this slug`);
      lessonSlugs.add(lesson.slug);

      /* `ID_FIELDS`, not a list written out here. This check kept
         its own and quietly stopped covering `captions` the day it
         was added: 298 ids never validated, and the summary line
         said everything was well formed. */
      for (const key of ID_FIELDS) {
        if (lesson[key]) checkId(lesson[key], `${at} (${key})`);
      }
      for (const file of lesson.files ?? []) checkId(file.drive, `${at} (${file.name})`);
    }

    /* `pending` and lessons are mutually exclusive by definition.
       Both at once means the importer wrote one and not the other,
       and the page draws an empty module with lessons in it. */
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
  const ladder = laddered(programmeFor(course)?.slug ?? "", course);
  const unique = new Set(ladder.map((l) => l.id));
  if (unique.size !== ladder.length) {
    say(`${course.slug}: ${ladder.length - unique.size} duplicate lesson id(s) in the ladder`);
  }
}

/* 2. A tick id is still three segments, and none is the programme

   `courses-read` and `courses-last` hold `<course>/<module>/<lesson>`
   in real browsers and `courses-answers` holds it with two more on
   the end, so putting the programme in front does not move
   somebody's ticks, it loses them.

   The uniqueness rule above protects the CONSEQUENCE; this
   protects the change itself, which is the likelier one to be
   made: `lessonId()` and `lessonUrl()` sit four lines apart in
   `shared/courses.ts` and one of them takes a programme, so making
   the other match looks like tidying. */

for (const programme of PROGRAMMES) {
  for (const course of programme.courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        const id = lessonId(course.slug, mod.slug, lesson.slug);
        const parts = id.split("/");
        if (parts.length !== 3) {
          say(`the tick id for ${id} has ${parts.length} segments where it must have 3: `
            + "the address gained the programme and the tick must not");
        }
        /* Compared segment by segment rather than with `includes`,
           because a course legitimately called
           `google-data-analytics-capstone-...` contains its own
           programme's slug. What would be a bug is the programme
           standing as a segment of its own. */
        if (parts.includes(programme.slug)) {
          say(`the tick id for ${id} carries the programme ${programme.slug} as a segment, `
            + "which orphans every tick already filed under the old id");
        }
        /* The address, by contrast, MUST carry it, and must carry
           the tick's three segments after it. Writing only the
           first rule would pass a `lessonId` that had quietly
           become `lessonUrl` with the prefix stripped back off. */
        const url = lessonUrl(programme.slug, course.slug, mod.slug, lesson.slug);
        if (url !== `/skills/courses/${programme.slug}/${id}`) {
          say(`${url} is not /skills/courses/<programme>/ followed by the tick id ${id}`);
        }
      }
    }
  }
}

/* ============================================================
   3. Nothing under next/ imports the catalogue
   ============================================================ */

const grep = (pattern: string, path: string): string[] => {
  try {
    return execFileSync("grep", ["-rn", "--include=*.ts", "--include=*.tsx",
      /* `next/node_modules/@reiad/shared` is the package copied in
         by npm, so it holds the source it is copied FROM and
         matches every pattern this looks for. It is gitignored;
         reading it makes this fail on nothing having gone wrong. */
      "--exclude-dir=node_modules", pattern, path],
      { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    return [];                                  // grep exits 1 on no match
  }
};

/* `PRIVATE_TEMPLATES` in `shared/routine.ts` is here for the same
   reason and not because it is a course: it is one real person's
   day, offered to an admin by `/api/routine/templates` and to
   nobody else, and an import under `next/` would put it in a
   bundle anybody can fetch while the page looked identical. */
/** A grep hit inside a COMMENT is prose, not an import, and a
    check that fails on the explanation teaches people to delete
    the explanation. This file's banner continuation lines start
    with whatever the sentence starts with, so "does the line begin
    with a star" is not a test: the file is read again and every
    comment blanked, spaces for characters and newlines kept, so
    line numbers stay where grep found them. */
const codeOnly = (file: string): string[] => {
  let src: string;
  try { src = readFileSync(file, "utf8"); } catch { return []; }
  const blanked = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
  return blanked.split("\n");
};

/** `path:number:text`, the shape grep -rn prints. */
const isComment = (line: string): boolean => {
  const m = /^(.*?):(\d+):/.exec(line);
  if (!m) return false;
  const code = codeOnly(m[1])[Number(m[2]) - 1] ?? "";
  return code.trim() === "";
};

for (const line of grep("PRIVATE_TEMPLATES", join(ROOT, "next"))) {
  if (/import\s+type\s/.test(line) || isComment(line)) continue;
  say(`next/ imports the private template, which publishes it: ${line.trim()}`);
}

for (const line of grep("shared/courses", join(ROOT, "next"))) {
  /* `import type { … }` is erased by TypeScript before anything
     is bundled, so it costs the browser nothing and is the
     supported way for a component to know what a lesson is. */
  if (/import\s+type\s/.test(line) || isComment(line)) continue;
  say(`next/ imports the catalogue, which publishes it: ${line.trim()}`);
}

/* ============================================================
   4. The two copies of the address rules agree
   ============================================================ */

const sharedSrc = readFileSync(join(ROOT, "shared", "courses.ts"), "utf8");
const browserSrc = readFileSync(join(ROOT, "aab", "src", "courses.ts"), "utf8");

/** The template literal a named arrow function returns.
    Deliberately dumb: both files write these as one-liners
    returning a single template, so the first backtick-delimited
    string after the name is the rule. A rewrite to a block body
    fails here rather than passing vacuously. */
function template(src: string, name: string): string | null {
  const at = src.indexOf(`const ${name} =`);
  if (at === -1) return null;
  const open = src.indexOf("`", at);
  if (open === -1) return null;
  const close = src.indexOf("`", open + 1);
  return close === -1 ? null : src.slice(open + 1, close);
}

/* The address rules both files define. `readingUrl` is only in
   `shared/courses.ts`: the browser reaches that endpoint through
   `api()`, which composes the path itself, so a second copy here
   would be a rule with one author and nothing to check. */
const RULES = [
  "programmeUrl", "courseUrl", "moduleUrl", "lessonUrl",
  "lessonId", "fileUrl", "driveUrl",
];

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
  const urls = ["/skills/courses", "/skills/courses/index.html"];
  for (const programme of PROGRAMMES) {
    urls.push(programmeUrl(programme.slug));
    for (const course of programme.courses) {
      urls.push(courseUrl(programme.slug, course.slug));
      for (const mod of course.modules) {
        urls.push(moduleUrl(programme.slug, course.slug, mod.slug));
        for (const lesson of mod.lessons) {
          urls.push(lessonUrl(programme.slug, course.slug, mod.slug, lesson.slug));
        }
      }
    }
  }

  const missed = urls.filter((url) => !nextOwns(url));
  if (missed.length) {
    say(`${missed.length} of ${urls.length} address(es) are not in NEXT_ROUTES, so the `
      + `Worker would hand them to the asset router and they would 404:`);
    for (const url of missed.slice(0, 8)) say(`  unrouted: ${url}`);
    if (missed.length > 8) say(`  ... and ${missed.length - 8} more`);
  }
}

/* ============================================================
   6. The file route is reachable without a session
   ============================================================ */

{
  const endpoint = readFileSync(
    join(ROOT, "functions", "api", "courses", "[[route]].ts"), "utf8");

  const atFile = endpoint.indexOf('parts[0] === "file"');
  const atSignIn = endpoint.indexOf('"sign-in-required"');

  if (atFile === -1 || atSignIn === -1) {
    say("cannot find the file route or the sign-in check in the courses endpoint");
  } else if (atFile > atSignIn) {
    say("the file route is behind the sign-in check, so every <video> will 401: "
      + "a media element sends no Authorization header, which is the whole reason "
      + "it carries a signed ticket instead");
  }

  /* And the ticket must still be checked. Putting that route in
     front of sign-in is only safe because of this line. */
  if (!/checkTicket\(/.test(endpoint)) {
    say("the file route no longer checks a ticket, and nothing else guards it");
  }
}

/* ============================================================
   7. Almost nothing was dropped on the way in
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
   8. The wire format is what the browser expects
   ============================================================ */

/** The field names of one `export interface` in the browser
    module, which is its claim about what the API sends. */
function fields(src: string, name: string): string[] | null {
  const at = src.indexOf(`export interface ${name} {`);
  if (at === -1) return null;
  const end = src.indexOf("\n}", at);
  if (end === -1) return null;
  return src.slice(at, end)
    .split("\n")
    .map((line) => /^\s{2}([A-Za-z_][A-Za-z0-9_]*)\??:/.exec(line)?.[1])
    .filter((name): name is string => Boolean(name))
    .sort();
}

const sample = COURSES.find((c) => c.modules.some((m) => m.lessons.length));

if (!sample) {
  say("no course has any lessons, so the wire format cannot be checked");
} else {
  const wire = forBrowser(sample);
  const mod = wire.modules.find((m) => m.lessons.length);

  /* `sample` was chosen for having lessons, so a module with some
     exists; saying so rather than assuming it is what stops this
     throwing on a catalogue that ever stops being true. */
  if (!mod) {
    say("the sample course has modules and none of them has a lesson");
  }

  const pairs: Array<[name: string, got: string[]]> = mod ? [
    ["Course", Object.keys(wire)],
    ["Module", Object.keys(wire.modules[0])],
    ["Lesson", Object.keys(mod.lessons[0])],
  ] : [];

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

/* 9. Every storage key this section writes is one the account carries

   `aab/src/courses.ts` names its keys as `*_KEY` constants and
   `aab/src/sync.ts` lists what an account owns. A key in the first
   and not the second saves on this device and goes nowhere else,
   which is a feature that works when you test it and quietly does
   not when you pick up a phone. `courses-answers` was added to the
   BUILT `aab/sync.js` rather than to its source and the next
   build overwrote it, with every check passing.

   Read as text rather than imported: both files touch
   `localStorage` as they load, and a check should not need a DOM
   to answer a question about a string. */
{
  const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

  const keys = [...read("aab/src/courses.ts")
    .matchAll(/^const\s+\w*_KEY\s*=\s*"([^"]+)"/gm)].map((m) => m[1]);

  const synced = new Set([...read("aab/src/sync.ts")
    .matchAll(/^\s*"([a-z-]+)":\s*\[\s*"(?:set|mark|count)"/gm)].map((m) => m[1]));

  if (!keys.length) say("no *_KEY constants found in aab/src/courses.ts, so this check is blind");
  if (!synced.size) say("no keys parsed out of aab/src/sync.ts, so this check is blind");

  for (const key of keys) {
    if (!synced.has(key)) {
      say(`aab/src/courses.ts writes "${key}", which aab/src/sync.ts does not carry: `
        + "it would save on one device and reach no other");
    }
  }
}

/* 10. What CLAUDE.md says the catalogue holds

   That row states five numbers about a generated file, which is
   the shape of claim the rule at the top of that file is about:
   the next Drive folder somebody adds moves four of the five, and
   nobody adding a folder will think to come here.

   Matched loosely on purpose: what is checked is the FIGURES, not
   the prose around them, so the sentence can be rewritten without
   coming here. `ids` is every Drive id this file validates, the
   lesson files PLUS the folders, which is 53 more than
   `DRIVE_IDS.size` and looks like it should not be. */

const counts = catalogueCounts();

{
  const rules = readFileSync(join(ROOT, "CLAUDE.md"), "utf8");
  const row = rules.split("\n").find((line) =>
    line.includes("shared/courses.data.json") && line.includes("Generated"));

  if (!row) {
    say("CLAUDE.md no longer has a row saying what the catalogue holds. "
      + "Either it moved, in which case fix the finder here, or it went, "
      + "in which case this check has nothing to hold and should go too.");
  } else {
    const said = (what: string): number | null => {
      const found = new RegExp(`([\\d,]+) ${what}`).exec(row);
      return found ? Number(found[1].replace(/,/g, "")) : null;
    };
    const claims: Array<[string, number | null, number]> = [
      ["programme", said("programme"), counts.programmes],
      ["course", said("course"), counts.courses],
      ["module", said("module"), counts.modules],
      ["lesson", said("lesson"), counts.lessons],
      ["Drive id", said("Drive ids"), ids],
    ];
    for (const [what, claimed, real] of claims) {
      if (claimed === null) {
        say(`CLAUDE.md's catalogue row no longer says how many ${what}s there are`);
      } else if (claimed !== real) {
        say(`CLAUDE.md says ${claimed} ${what}(s) and the catalogue holds ${real}`);
      }
    }
  }
}

if (problems.length) {
  console.error(`courses: ${problems.length} problem(s).\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(
  `courses: ${counts.courses} course(s), ${counts.modules} module(s) `
  + `(${counts.pending} not imported), ${counts.lessons} lesson(s), `
  + `${ids} Drive id(s), all well formed.`);

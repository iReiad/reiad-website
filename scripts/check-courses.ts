#!/usr/bin/env node
/* ============================================================
   check-courses.ts: the third-party course section, held to the
   four things about it that are easy to get quietly wrong.

       node scripts/check-courses.ts

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
      seven address rules are written twice on purpose, and this is
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
  COURSES, PROGRAMMES, CATALOGUE, forBrowser, laddered, catalogueCounts,
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
   the address gained a programme segment and the tick did not,
   because `courses-read` holds those strings in real browsers.
   Two programmes each holding a "Foundations" would therefore
   share one set of ticks, and a reader would open a course they
   had never started and find it half done.

   This is the cheap end of that trade and it is where the price
   is paid: renaming a Drive folder costs one crawl, and the
   alternative was making every tick anybody already has
   worthless. */
const courseSlugs = new Map<string, string>();

for (const programme of PROGRAMMES) {
  /* THE ROOT PROGRAMME SHARES THE ROOT'S ID, and that is the
     arrangement rather than a collision. Where the Drive root
     holds courses directly, the root folder IS the programme, so
     the two name one folder on purpose. Everything else sharing
     an id is still a parsing bug and still caught. */
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
         lessons sharing one means one of them is unreachable and
         both share a tick. */
      checkSlug(lesson.slug, "lesson", at);
      if (lessonSlugs.has(lesson.slug)) say(`${at}: two lessons share this slug`);
      lessonSlugs.add(lesson.slug);

      /* `ID_FIELDS`, not a list written out here. This check kept
         its own and quietly stopped covering `captions` the day it
         was added: 298 ids, none of them ever validated, and the
         summary line said everything was well formed. */
      for (const key of ID_FIELDS) {
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
  const ladder = laddered(programmeFor(course)?.slug ?? "", course);
  const unique = new Set(ladder.map((l) => l.id));
  if (unique.size !== ladder.length) {
    say(`${course.slug}: ${ladder.length - unique.size} duplicate lesson id(s) in the ladder`);
  }
}

/* ============================================================
   2. Nothing under next/ imports the catalogue
   ============================================================ */

const grep = (pattern: string, path: string): string[] => {
  try {
    return execFileSync("grep", ["-rn", "--include=*.ts", "--include=*.tsx",
      /* `next/node_modules/@reiad/shared` is the package copied in
         by npm, so it holds the source it is copied FROM and
         matches every pattern this looks for. It is a build
         artifact and gitignored; reading it turns this check into
         one that fails on nothing having gone wrong. */
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
   bundle anybody can fetch while the page looked identical. Two
   private things, one guard, rather than a second check whose
   name would have to be remembered. */
/** A grep hit inside a COMMENT is prose, not an import.

    Both rules below are worth explaining where somebody will read
    them, and a check that fails on the explanation teaches people
    to delete the explanation. This file's own comment style is a
    banner whose continuation lines start with whatever the
    sentence starts with, so "does the line begin with a star" is
    not a test: the only honest one is to know where the comments
    ARE.

    So the file is read again and every comment is blanked, spaces
    for characters and newlines kept, which leaves line numbers
    exactly where grep found them. */
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
   `api()`, which composes the path itself, so a second copy of it
   here would be a rule with one author and nothing to check. */
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
   7. The wire format is what the browser expects
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

/* ============================================================
   Every storage key this section writes is one the account carries

   `aab/src/courses.ts` names its keys as `*_KEY` constants and
   `aab/src/sync.ts` lists what an account owns. A key in the first
   and not the second saves on this device and goes nowhere else,
   which is a feature that works when you test it and quietly does
   not when you pick up a phone.

   That is not hypothetical. `courses-answers` was added to the
   BUILT `aab/sync.js` rather than to its source, and the next
   `build-modules` run overwrote it. Every check passed: the built
   file matched its source again, because the edit was gone.

   Read as text rather than imported. Both files are browser
   modules that touch `localStorage` as they load, and a check
   should not need a DOM to answer a question about a string. */
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

/* ============================================================
   9. What CLAUDE.md says the catalogue holds

   That row states five numbers about a generated file, which is
   the shape of claim the rule at the top of that very file is
   about: right on the day it was typed, beside a thing that
   grows. Every one of them was right, and the row gained a fifth
   when programmes arrived. That is not the argument for this
   check, though: the argument is that the next Drive folder
   somebody adds moves four of the five, and nobody adding a
   folder will think to come here.

   So the sentence is read and compared rather than trusted. The
   row is the one in the courses table naming
   `shared/courses.data.json`, and it is matched loosely on
   purpose: what is checked is the FIGURES, not the prose around
   them, so the sentence can be rewritten without coming here.

   `ids` is every Drive id this file validates, which is the
   lesson files PLUS the folders: the root, each programme, each
   course and each module. That is worth saying because the
   number looks like it should be `DRIVE_IDS.size` and is 53
   larger.
   ============================================================ */

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

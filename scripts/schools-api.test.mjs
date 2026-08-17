/* ============================================================
   scripts/schools-api.test.mjs: /api/schools, against real SQLite.

     node scripts/schools-api.test.mjs

   archive/TRANSITION.md Stage 8. `schools.test.mjs` proves the rows are
   the same thing the files say. This proves the door they are
   read and written through: that a ladder comes back in ladder
   order, that a lesson comes back with its text, that the write
   side refuses a stranger, and that a half-finished write cannot
   leave a school with no lessons in it.

   The handler is given its database exactly the way the Worker
   gives it one, through `env.DB`, and the real `db()` runs the
   real migrations against it. So this also proves the CREATE
   TABLE statements in `_lib/db.js` are valid SQLite, which is the
   other thing that would only fail in production.
   ============================================================ */

import { DatabaseSync } from "node:sqlite";
import { webcrypto } from "node:crypto";
import { onRequest } from "../functions/api/schools/[[route]].js";
import { WITHIN } from "../shared/schools.ts";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

let failures = 0;
const check = (name, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
};
const okay = (name, cond) => check(name, !!cond, true);

/* ---------- the D1 shape, over node:sqlite ---------- */

const db = new DatabaseSync(":memory:");
const D1 = {
  prepare(sql) {
    const make = (args) => ({
      all: async () => ({ results: db.prepare(sql).all(...args) }),
      first: async () => db.prepare(sql).get(...args) ?? null,
      run: async () => { db.prepare(sql).run(...args); return { success: true }; },
    });
    return { bind: (...args) => make(args), ...make([]) };
  },
  batch: async (statements) => {
    for (const st of statements) await st.run();
    return [];
  },
};

const env = { DB: D1 };

/* ---------- calling it the way the Worker does ---------- */

const call = async (method, path, { json, cookie } = {}) => {
  const url = new URL(`https://reiad.co.uk/api/schools${path}`);
  const request = new Request(url, {
    method,
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: json ? JSON.stringify(json) : undefined,
  });
  const route = path.replace(/^\//, "").split("/").filter(Boolean);
  const res = await onRequest({
    request, env, params: { route },
    waitUntil: () => {}, next: async () => new Response("next"), data: {},
  });
  return { status: res.status, body: await res.json() };
};

/* ---------- a school to write ----------

   Two stages whose slugs sort the wrong way round on purpose.
   "start" then "basics-1" is the money school's real problem in
   miniature: alphabetically basics-1 comes first, and in the
   ladder it does not. Every ordering check below would pass on a
   fixture whose slugs happened to sort correctly. */

const PAYLOAD = {
  stages: [
    { school: "money", slug: "start", position: 0, title: "শুরু",
      status: "live", meta: { kicker: "ধাপ ০", icon: "seed", can: "শুরু করা" } },
    { school: "money", slug: "basics-1", position: 1, title: "ভিত্তি",
      status: "live", meta: { kicker: "ধাপ ১", icon: "bridge" } },
  ],
  sections: [
    { school: "money", stage: "start", ident: "steps", position: 0, title: "ধাপে ধাপে", meta: {} },
    { school: "money", stage: "basics-1", ident: "terms", position: 0, title: "শব্দ", meta: {} },
  ],
  lessons: [
    { school: "money", stage: "start", slug: "money-first", section: "steps", position: 0,
      title: "টাকাটা আগে ঠিক করুন", minutes: 6, status: "live",
      meta: { icon: "coin", blurb: "প্রথম কাজ" }, body: "<p>প্রথমে বাজেট।</p>" },
    { school: "money", stage: "start", slug: "emergency", section: "steps", position: 1,
      title: "জরুরি তহবিল", minutes: 5, status: "live", meta: { icon: "shield" },
      /* Not written yet. A row with an empty body is a real state:
         the builders draw an "আসছে" page for it and a hub counts
         it as not-yet-written, so it must survive the trip as an
         empty string rather than as a missing row. */
      body: "" },
    { school: "money", stage: "basics-1", slug: "share", section: "terms", position: 0,
      title: "শেয়ার", minutes: 4, status: "live", meta: { icon: "slice" },
      body: "<p>একটা কোম্পানির টুকরো।</p>" },
  ],
};

/* ---------- the write side refuses a stranger first ---------- */

console.log("/api/schools");

{
  const res = await call("PUT", "", { json: PAYLOAD });
  check("a stranger cannot write a curriculum", res.status, 401);
  const after = db.prepare("SELECT COUNT(*) n FROM school_lessons").get();
  check("and nothing was written", after.n, 0);
}

/* ---------- a session, the way the Worker makes one ---------- */

/* The row stores the SHA-256 of the cookie, not the cookie, so a
   dump of the sessions table is not a set of working logins. The
   fixture has to do the same thing or it is testing a session
   shape the site does not have. */
const toB64 = (buf) => Buffer.from(new Uint8Array(buf)).toString("base64");
const hashed = toB64(await webcrypto.subtle.digest(
  "SHA-256", new TextEncoder().encode("t-admin")));

db.prepare(
  `INSERT INTO sessions (token, label, created_at, expires_at) VALUES (?, ?, ?, ?)`
).run(hashed, "test", new Date().toISOString(),
  new Date(Date.now() + 3600_000).toISOString());
const ADMIN = "reiad_session=t-admin";

{
  const res = await call("PUT", "", { json: PAYLOAD, cookie: ADMIN });
  check("an admin can write one", res.status, 200);
  check("and is told what landed",
    [res.body.stages, res.body.sections, res.body.lessons, res.body.written],
    [2, 2, 3, 2]);
}

/* ---------- reading it back ---------- */

{
  const res = await call("GET", "/money");
  check("the ladder answers", res.status, 200);
  check("in ladder order, not alphabetical",
    res.body.stages.map((s) => s.slug), ["start", "basics-1"]);
  check("and counts what is written rather than remembering it",
    res.body.counts, { total: 3, written: 2 });

  const first = res.body.stages[0];
  check("a stage keeps its own fields out of meta", first.kicker, "ধাপ ০");
  check("and its title", first.bn, "শুরু");

  /* The key each school uses for the things inside a section. A
     reader that always said `lessons` would look correct here and
     hand /deutsch/ and /english/ something empty. */
  const key = WITHIN.money;
  check("the lessons are under the key this school uses", key, "lessons");
  check("and they are there",
    first.sections[0][key].map((l) => l.slug), ["money-first", "emergency"]);
  check("with their own fields spread back out",
    first.sections[0][key][0].icon, "coin");

  /* The ladder is 89 lessons in the real money school and their
     bodies are most of a megabyte. A page that lists them needs
     none of that text. */
  okay("and without their bodies",
    first.sections[0][key].every((l) => l.body === undefined));
}

{
  const res = await call("GET", "/money/start");
  check("a stage's lessons answer in page order",
    res.body.lessons.map((l) => l.slug), ["money-first", "emergency"]);
}

{
  const res = await call("GET", "/money/start/money-first");
  check("one lesson answers", res.status, 200);
  check("with its text", res.body.lesson.body, "<p>প্রথমে বাজেট।</p>");
  check("and its title", res.body.lesson.bn, "টাকাটা আগে ঠিক করুন");
}

{
  /* Every URL on this site ends in .html, and the slug guard in
     the Next article route once refused exactly that. Once is
     enough for it to be a check everywhere a slug is read. */
  const res = await call("GET", "/money/start/money-first.html");
  check("asked for at the address the site actually uses", res.status, 200);
}

{
  const res = await call("GET", "/money/start/emergency");
  check("a lesson nobody has written is a row, not a 404", res.status, 200);
  check("and its body is empty rather than absent", res.body.lesson.body, "");
}

{
  const res = await call("GET", "/money/start/not-a-lesson");
  check("an unknown lesson is a 404", res.status, 404);
  const school = await call("GET", "/pottery");
  check("and so is an unknown school", school.status, 404);
}

/* ---------- what a bad write must not do ---------- */

{
  const res = await call("PUT", "", {
    json: {
      stages: [{ school: "money", slug: "start", position: 0, title: "x" }],
      lessons: [{ school: "deutsch", stage: "stufe-1", slug: "y", position: 0, title: "z" }],
    },
    cookie: ADMIN,
  });
  check("a payload naming two schools is refused", res.status, 400);
  const after = await call("GET", "/money");
  check("and the school it would have half-written is untouched",
    after.body.counts, { total: 3, written: 2 });
}

{
  const res = await call("PUT", "", { json: { stages: [], lessons: [] }, cookie: ADMIN });
  check("an empty payload is refused", res.status, 400);
  const after = await call("GET", "/money");
  check("because a curriculum is never emptied by accident",
    after.body.counts, { total: 3, written: 2 });
}

{
  /* A list says which lessons are written without carrying any
     prose to say it. That is what a contents page marks and what
     the Studio's picker greys out, and sending the bodies to
     answer it would be most of a megabyte for the money school. */
  const res = await call("GET", "/money/start");
  const flags = res.body.lessons.map((l) => [l.slug, l.written]);
  check("a lesson list says which are written", flags,
    [["money-first", true], ["emergency", false]]);
  okay("and carries no bodies to say it",
    res.body.lessons.every((l) => l.body === undefined));
}

/* ---------- one lesson, which is what the editor saves ---------- */

{
  const res = await call("PUT", "/money/start/money-first", {
    json: { body: "<p>নতুন কথা।</p>" },
  });
  check("a stranger cannot write one lesson either", res.status, 401);
  const after = await call("GET", "/money/start/money-first");
  check("and the lesson it would have overwritten is untouched",
    after.body.lesson.body, "<p>প্রথমে বাজেট।</p>");
}

{
  const res = await call("PUT", "/money/start/money-first", {
    json: { body: "<p>নতুন কথা।</p>" }, cookie: ADMIN,
  });
  check("one lesson's prose can be written", res.status, 200);
  check("and comes back written", res.body.lesson.body, "<p>নতুন কথা।</p>");

  const again = await call("GET", "/money/start/money-first");
  check("and is what the next reader gets", again.body.lesson.body, "<p>নতুন কথা।</p>");
  check("its title was not asked about, so it did not change",
    again.body.lesson.bn, "টাকাটা আগে ঠিক করুন");
}

{
  /* The lesson body goes through the same sanitiser an article
     does. `aab/schema.sql` says so where the column is defined,
     and a lesson editor that skipped it would be the second
     sanitiser the three-place rule exists to prevent. */
  const res = await call("PUT", "/money/start/money-first", {
    json: { body: '<p>ঠিক আছে।</p><script>alert(1)</script>' }, cookie: ADMIN,
  });
  check("a lesson body is sanitised on the way in", res.status, 200);
  okay("and the script does not survive it",
    !res.body.lesson.body.includes("<script"));
}

{
  const before = await call("GET", "/money");
  const res = await call("PUT", "/money/start/invented", {
    json: { body: "<p>কেউ এটা চায়নি।</p>" }, cookie: ADMIN,
  });
  check("a lesson that is not in the ladder is a 404", res.status, 404);
  const after = await call("GET", "/money");
  check("and it was not inserted", after.body.counts, before.body.counts);
}

{
  /* Emptying a lesson is not a deletion and not a failure: an
     empty body is what makes a builder draw an আসছে page, so a
     writer taking a lesson back has to be able to say it. */
  const res = await call("PUT", "/money/start/money-first", {
    json: { body: "" }, cookie: ADMIN,
  });
  check("a lesson can be emptied", res.status, 200);
  const after = await call("GET", "/money");
  check("and that means unwritten, not gone",
    after.body.counts, { total: 3, written: 1 });
  const still = await call("GET", "/money/start/money-first");
  check("the row is still there", still.status, 200);
}

{
  const res = await call("PUT", "/money/start", {
    json: { body: "<p>x</p>" }, cookie: ADMIN,
  });
  check("a stage is not writable one at a time", res.status, 400);
  const school = await call("PUT", "/money", { json: { body: "<p>x</p>" }, cookie: ADMIN });
  check("and neither is a school", school.status, 400);
}

/* ---------- done ---------- */

console.log(failures
  ? `\n${failures} failed.\n`
  : "\nall good: the schools are readable, and only writable by me\n");
process.exit(failures ? 1 : 0);

#!/usr/bin/env node
/* The practice book, without its answer key.
     node next/book-api.test.ts
   No browser and no build: the two route handlers are functions over data
   already in the repository.

   WHAT IT GUARDS: that no answer leaves in the book. Every prompt has its
   answer beside it, so a book sent whole hands a reader the lot whether
   or not they pressed the button, and the whole correctness of
   `/api/book/<stage>` is that `say[].a` is gone.

   Not a thing a reader would notice going wrong: the book renders
   identically with the answers present in the payload. So it is asserted
   on the SERIALISED bytes rather than on the shape, because a check that
   walked the object could be fooled by an answer somewhere the walk did
   not go and JSON.stringify goes everywhere. */

export {};

const { bookFor, BOOKS } = await import("./lib/workbook.ts");
const book = await import("./app/api/book/[stage]/route.ts");
const key = await import("./app/api/book/[stage]/key/[day]/route.ts");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed++; console.log(`  ok   ${what}`); }
  else { failures.push(`${what}${detail ? `: ${detail}` : ""}`); console.log(`  FAIL ${what}   ${detail}`); }
};

const req = new Request("https://reiad.co.uk/api/book/stufe-1");
const get = (stage: string) =>
  book.GET(req, { params: Promise.resolve({ stage }) });
const getKey = (stage: string, day: string) =>
  key.GET(req, { params: Promise.resolve({ stage, day }) });

/* ---------- 1. every book answers, and none of them leaks ---------- */

for (const slug of Object.keys(BOOKS)) {
  const answer = await get(slug);
  ok(`${slug}: the book is served`, answer.status === 200, `status ${answer.status}`);

  const text = await answer.text();
  const sent = JSON.parse(text);
  const source = bookFor(slug)!;

  ok(`${slug}: every day arrives`,
    sent.book.days.length === source.days.length,
    `${sent.book.days.length} of ${source.days.length}`);

  ok(`${slug}: every prompt arrives`,
    sent.book.days.every((d: { say: unknown[] }, i: number) =>
      d.say.length === source.days[i].say.length),
    "a day lost a prompt");

  /* The one that matters, and asked of the bytes. */
  ok(`${slug}: no answer is in the response at all`,
    sent.book.days.every((d: { say: Array<Record<string, unknown>> }) =>
      d.say.every((p) => !("a" in p))),
    "a prompt still carries its answer");

      /* And no field called `a` survives anywhere in the bytes: a prompt
         renamed from `a`, or an answer tucked into a field added next
         year, passes the shape check above and fails this one.

         Asserted on the FIELD and not on the answers' text: an answer's
         words legitimately appear elsewhere in the same book, so a text
         search reports the book working as designed as a leak. */
  ok(`${slug}: no field called "a" is left in the bytes`,
    !text.includes('"a":'),
    "something is still carrying an answer");
}

/* ---------- 2. the key comes one day at a time ---------- */

{
  const answer = await getKey("stufe-1", "1");
  ok("a day's key is served", answer.status === 200, `status ${answer.status}`);
  const sent = await answer.json() as { answers: string[] };
  const source = bookFor("stufe-1")!.days.find((d) => d.n === 1)!;
  ok("it holds that day's answers and no others",
    JSON.stringify(sent.answers) === JSON.stringify(source.say.map((p) => p.a)));
  /* Cached like the book. The guarantee is that a key does not
     arrive UNASKED, and caching the answer to an explicit ask
     does not weaken it. An earlier draft said `no-store` here on
     a hunch about shared proxies that does not survive asking
     what the key actually is: something anybody can have by
     pressing a button. */
  ok("and it may be kept, like the book",
    answer.headers.get("Cache-Control") === "public, max-age=1800",
    answer.headers.get("Cache-Control") ?? "absent");
}

/* ---------- 3. what is not there says so ---------- */

{
  /* Stufe 4 has no book and that is not a fault: at B2 the
     exercise stops being a page you fill in. */
  const answer = await get("stufe-4");
  ok("a stage with no book answers 404 rather than empty",
    answer.status === 404, `status ${answer.status}`);
  ok("and says which kind of nothing it is",
    (await answer.json() as { reason: string }).reason === "no-book");
}

/* Every one of these reached a real day through `Number()`
   before the check was moved on to the string. */
for (const bad of ["0", "-1", "999", "", "3x", "1e1", "0x2", "+3", " 4 ", "Infinity", "1.0"]) {
  const answer = await getKey("stufe-1", bad);
  ok(`a day of "${bad}" is refused`, answer.status === 404, `status ${answer.status}`);
}

    /* ---------- 4. the caching is the route's, not the middleware's ----------
       `middleware.ts` sets the security headers on everything this Worker
       sends, which is why the routes do not: a second copy of that list is
       the drift `check-headers.ts` exists to catch.

       A middleware that overwrote Cache-Control on everything except
       `/_next/` would quietly turn the first handler's `no-store` into a
       minute of public caching on a response that looked exactly
       right. */

{
  const answer = await get("stufe-1");
  ok("the book says how long it may be kept",
    answer.headers.get("Cache-Control") === "public, max-age=1800",
    answer.headers.get("Cache-Control") ?? "absent");
}

{
  /* Asserted on the SOURCE rather than by calling it, because
     `middleware.ts` imports `next/server`, which node cannot
     resolve without the framework's own resolver. A source check
     is weaker than a behaviour one and is what is available here;
     what it catches is the regression that matters, somebody
     removing the exclusion while tidying. */
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(new URL("./middleware.ts", import.meta.url), "utf8");
  ok("the middleware leaves an API route's caching alone",
    /!path\.startsWith\("\/api\/"\)/.test(src),
    "middleware.ts overwrites Cache-Control on /api/, so a handler's own is ignored");
  ok("and still puts the security headers on everything",
    /SECURITY_HEADERS/.test(src));
}

console.log(failures.length
  ? `\n${failures.length} failed, ${passed} passed\n`
  : `\nbook api: ${passed} checks passed\n`);
process.exit(failures.length ? 1 : 0);

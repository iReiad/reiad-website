#!/usr/bin/env node
/* ============================================================
   input.test.mjs: what a bad request looks like, tested.

       node scripts/input.test.mjs

   TRANSITION.md Stage 12, step 2. `functions/_lib/input.js` is
   now the one place that decides whether a request body is good
   enough, for three endpoints that used to decide it three ways.
   That makes it the kind of file where a small mistake is a
   large one: a rule that stops rejecting is a hole in every
   endpoint that reads it at once, and none of the three would
   fail visibly.

   No database, no Worker, no network. A `Request` is a global in
   node now, and the module under test takes one and returns
   either a value or a `Response`.
   ============================================================ */

import { read, safeId, safeSlug } from "../functions/_lib/input.js";

let passed = 0;
const failures = [];

const ok = (name, condition, detail = "") => {
  if (condition) { passed += 1; return; }
  failures.push(name + (detail ? `\n      ${detail}` : ""));
};
const eq = (name, got, want) =>
  ok(name, got === want, `wanted ${JSON.stringify(want)}, got ${JSON.stringify(got)}`);

/** A POST with a JSON body, which is every caller this has. */
const post = (data) => new Request("https://reiad.co.uk/api/x", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: typeof data === "string" ? data : JSON.stringify(data),
});

/** The reason inside a failure Response. */
const reasonOf = async (res) => (await res.json()).reason;

/* ---------- the two helpers ---------- */

eq("a slug is lowercased", safeSlug("DSE-Basics"), "dse-basics");
eq("a slug with a slash is refused", safeSlug("a/b"), "");
eq("a slug with a dot is refused", safeSlug("a.html"), "");
eq("a slug with a space is refused", safeSlug("a b"), "");
eq("an empty slug is empty", safeSlug(""), "");
eq("a slug is capped", safeSlug("a".repeat(500), 10).length, 10);

eq("an id is an integer", safeId("42"), 42);
eq("a fractional id is refused", safeId(3.7), 0);
eq("a negative id is refused", safeId(-1), 0);
eq("a zero id is refused", safeId(0), 0);
eq("a word is not an id", safeId("twelve"), 0);

/* ---------- text, and the three minimums ---------- */

{
  const spec = { body: { text: true, min: 10, max: 4000, short: "too-short" } };

  const short = await read(post({ body: "hello" }), spec);
  ok("a body under the minimum fails", Boolean(short.bad));
  eq("  with the reason the declaration named", await reasonOf(short.bad), "too-short");

  const fine = await read(post({ body: "a body long enough to pass" }), spec);
  ok("a body over the minimum passes", !fine.bad);
  eq("  and comes back trimmed", fine.value.body, "a body long enough to pass");

  /* The cap is applied BEFORE the minimum, which is the one
     ordering decision in the file. A 5000 character body capped
     at 4000 is 4000 long and passes; checking the raw length
     would pass it too, and then store the truncated one, which
     is the same outcome by luck rather than on purpose. */
  const long = await read(post({ body: "x".repeat(5000) }), spec);
  ok("a body over the cap passes", !long.bad);
  eq("  and is truncated to the cap", long.value.body.length, 4000);

  /* Whitespace is trimmed before it is measured, so nine
     characters and a newline is nine characters. */
  const padded = await read(post({ body: `   ${"x".repeat(9)}   ` }), spec);
  ok("whitespace does not count towards the minimum", Boolean(padded.bad));
}

/* ---------- required, which is not the same as a minimum ---------- */

{
  const spec = { slug: { slug: true, required: "slug-required" } };
  const missing = await read(post({}), spec);
  ok("a required slug that is absent fails", Boolean(missing.bad));
  eq("  with its own reason", await reasonOf(missing.bad), "slug-required");

  const bad = await read(post({ slug: "../etc/passwd" }), spec);
  ok("a required slug that is not a slug fails the same way", Boolean(bad.bad));
  eq("  and does not smuggle a path through",
    await reasonOf(bad.bad), "slug-required");

  const optional = await read(post({}), { slug: { slug: true } });
  ok("an optional slug that is absent does not fail", !optional.bad);
  eq("  and comes back empty", optional.value.slug, "");
}

/* ---------- email, where absent and wrong are different ---------- */

{
  const spec = { email: { email: true, required: "bad-email", invalid: "bad-email" } };
  eq("an absent required email fails",
    await reasonOf((await read(post({}), spec)).bad), "bad-email");
  eq("a malformed email fails",
    await reasonOf((await read(post({ email: "not-an-email" }), spec)).bad), "bad-email");
  const good = await read(post({ email: "  i@reiad.co.uk " }), spec);
  ok("a good email passes", !good.bad);
  eq("  and is trimmed", good.value.email, "i@reiad.co.uk");

  /* Optional, and this is the shape the questions endpoint
     wants: a reader who typed their address wrongly still gets
     their question stored, with no address on it, rather than a
     400 telling them to fix a field they were told was
     optional. */
  const loose = await read(post({ email: "nonsense" }), { email: { email: true } });
  ok("an optional email that is wrong does not fail the request", !loose.bad);
  eq("  and is dropped rather than stored", loose.value.email, "");
}

/* ---------- oneOf ---------- */

{
  const spec = { kind: { oneOf: ["hiring", "project"] } };
  eq("a listed value passes through",
    (await read(post({ kind: "hiring" }), spec)).value.kind, "hiring");
  eq("an unlisted value is dropped, not accepted",
    (await read(post({ kind: "admin" }), spec)).value.kind, "");
  const strict = await read(post({ kind: "admin" }),
    { kind: { oneOf: ["hiring"], invalid: "bad-kind" } });
  eq("and fails when the declaration says it should",
    await reasonOf(strict.bad), "bad-kind");
}

/* ---------- a body that is not JSON at all ---------- */

{
  const spec = { body: { text: true, required: "empty" } };
  eq("a body that is not JSON is an empty object, and required catches it",
    await reasonOf((await read(post("not json at all"), spec)).bad), "empty");

  const nothing = await read(post("null"), spec);
  ok("and so is a literal null", Boolean(nothing.bad));
}

/* ---------- the untouched body is handed back ---------- */

{
  const got = await read(post({ body: "x", website: "a bot filled this in" }),
    { body: { text: true } });
  eq("a field the declaration does not name is still readable",
    got.input.website, "a bot filled this in");
}

/* ---------- done ---------- */

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log("One place decides what a bad request looks like, and it says\n"
  + "the same thing every time.\n");

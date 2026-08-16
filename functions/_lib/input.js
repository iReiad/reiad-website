/* ============================================================
   _lib/input.js: what a bad request looks like, decided once.

   TRANSITION.md Stage 12, step 2. The error SHAPE has been one
   thing since the beginning: `_lib/http.js` writes
   `{ ok: false, reason }` and every endpoint uses it. What was
   never one thing is the RULES, and the two handlers the plan
   names are the clearest case of it.

   A comment shorter than its minimum answers `empty`. A question
   shorter than its minimum answers `too-short`. An enquiry
   shorter than its minimum also answers `too-short`. The
   minimums are 2, 10 and 10. Three numbers and two words for one
   idea, in three files that are otherwise the same handler with
   different nouns, and a browser that wanted to say "that is too
   short" in Bangla had to know all three.

   ---- what this is, and what it is not ----

   It is a declaration read once per request:

       const got = await read(request, {
         slug: { slug: true, required: "slug-required" },
         body: { text: true, min: 2, max: 4000, short: "empty" },
         parent_id: { id: true },
       });
       if (got.bad) return got.bad;
       got.value.slug   // a safe slug, or ""

   It is NOT a schema library and does not want to become one.
   There is no nesting, no coercion beyond what the site already
   does in `str()` and `isEmail()`, and no way to express a rule
   that only one endpoint has: those stay in the endpoint, which
   is where a reader of that endpoint will look for them.

   ---- why the reason strings did not get tidied ----

   They are an API contract. `aab/api.js` and the two React apps
   read `reason` and some of them switch on it, so renaming
   `empty` to `too-short` to make this file read better would be
   changing an interface to improve a comment. Each declaration
   names the reason its endpoint already returns, and the words
   converge when somebody decides they should rather than as a
   side effect of a refactor.
   ============================================================ */

import { body as readBody, fail, isEmail, str } from "./http.js";

/** A slug, or "".

    The same test three endpoints were making separately: lower
    case, and nothing in it that could become a path segment
    somewhere else. A slug from a request body becomes a URL
    prefix, and a URL prefix from a request body is how you end up
    serving /etc/passwd.html. */
export const safeSlug = (value, max = 120) => {
  const s = str(value, max).toLowerCase();
  return /^[a-z0-9-]+$/.test(s) ? s : "";
};

/** A positive integer, or 0.

    `Number(x) || 0` is what six endpoints wrote, and it says yes
    to 3.7 and to -1. A row id is neither. */
export const safeId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 0;
};

/* ---------- the one reader ---------- */

/**
 * Read and check a request body against a declaration.
 *
 * Returns `{ value }` when everything passed, or `{ bad }` where
 * `bad` is the Response to return. Never both, and never throws:
 * a body that is not JSON at all is an empty object, which is
 * what `http.js` has always done and what every "required" rule
 * then catches by itself.
 *
 * Each field takes one of four kinds and some options:
 *
 *   { text: true, min, max, required, short, long }
 *   { slug: true, max, required }
 *   { id: true, required }
 *   { email: true, required, invalid }
 *   { oneOf: [...], required, invalid }
 *
 * `required`, `short`, `long` and `invalid` are the reason
 * strings to answer with. A rule with no reason named is a rule
 * that cannot fail the request: the value is cleaned and handed
 * back, which is what an optional field wants.
 */
export async function read(request, spec) {
  const input = await readBody(request);
  const value = {};

  for (const [name, rule] of Object.entries(spec)) {
    const raw = input[name];

    if (rule.slug) {
      const s = safeSlug(raw, rule.max ?? 120);
      if (!s && rule.required) return { bad: fail(rule.required) };
      value[name] = s;
      continue;
    }

    if (rule.id) {
      const n = safeId(raw);
      if (!n && rule.required) return { bad: fail(rule.required) };
      value[name] = n;
      continue;
    }

    if (rule.email) {
      const e = str(raw, rule.max ?? 200);
      if (!e) {
        if (rule.required) return { bad: fail(rule.required) };
        value[name] = "";
        continue;
      }
      if (!isEmail(e)) {
        /* An address that is present and wrong is a different
           answer from one that is absent, and the two were
           already told apart by every endpoint that checks. */
        if (rule.invalid) return { bad: fail(rule.invalid) };
        value[name] = "";
        continue;
      }
      value[name] = e;
      continue;
    }

    if (rule.oneOf) {
      const s = str(raw, 80);
      if (!s) {
        if (rule.required) return { bad: fail(rule.required) };
        value[name] = "";
        continue;
      }
      if (!rule.oneOf.includes(s)) {
        if (rule.invalid) return { bad: fail(rule.invalid) };
        value[name] = "";
        continue;
      }
      value[name] = s;
      continue;
    }

    /* Text, which is the default and the one with lengths.

       The cap is applied before the minimum is checked, in that
       order deliberately: `str()` truncates, so a 5000 character
       body capped at 4000 is 4000 long and passes a minimum of
       10, which is the right answer. Checking the minimum against
       the raw value would pass the same body and then store the
       truncated one, which is the same outcome by luck. */
    const text = str(raw, rule.max ?? 4000);
    if (!text && rule.required) return { bad: fail(rule.required) };
    if (rule.min !== undefined && text.length < rule.min && (rule.short || rule.required)) {
      return { bad: fail(rule.short ?? rule.required) };
    }
    value[name] = text;
  }

  /* The untouched body, for the fields a handler reads itself.
     A declaration that had to name every field would be a
     declaration nobody keeps up to date, and the honeypot on the
     questions endpoint is exactly the kind of field that belongs
     to one endpoint and nowhere else. */
  return { value, input };
}

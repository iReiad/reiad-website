/* _lib/input.ts: what a bad request looks like, decided once.

   The error SHAPE has always been one thing: `_lib/http.ts` writes
   `{ ok: false, reason }`. What was never one thing is the RULES.
   A comment shorter than its minimum answered `empty`, a question
   `too-short`, an enquiry `too-short`; the minimums were 2, 10 and
   10. Three numbers and two words for one idea, in three files
   that are otherwise the same handler with different nouns.

   A declaration read once per request:

       const got = await read(request, {
         slug: { slug: true, required: "slug-required" },
         body: { text: true, min: 2, max: 4000, short: "empty" },
         parent_id: { id: true },
       });
       if (got.bad) return got.bad;
       got.value.slug   // a safe slug, or ""

   It is NOT a schema library and does not want to become one: no
   nesting, no coercion beyond `str()` and `isEmail()`, and no way
   to express a rule only one endpoint has. Those stay in the
   endpoint, where a reader of that endpoint will look.

   THE REASON STRINGS ARE AN API CONTRACT. `aab/api.js` and the two
   React apps read `reason` and some switch on it, so renaming
   `empty` to `too-short` to make this file read better would be
   changing an interface to improve a comment. */

import { body as readBody, fail, isEmail, str } from "./http.ts";

/* ---- the four kinds a field can be ----

   Written out rather than left as an index signature, because the
   point of this file is that a declaration is checkable: a rule
   with a `slug` and a `min` is a rule whose `min` does nothing,
   and that is a compile error rather than a quiet no-op.

   `required`, `short`, `long` and `invalid` are REASON STRINGS
   rather than booleans, and are not free to rename. */

interface Common {
  /** The reason to answer with when the field is missing. A rule
      naming none cannot fail the request: the value is cleaned
      and handed back, which is what an optional field wants. */
  required?: string;
}

export interface SlugRule extends Common { slug: boolean; max?: number }
export interface IdRule extends Common { id: boolean }
export interface EmailRule extends Common { email: boolean; max?: number; invalid?: string }
export interface OneOfRule extends Common { oneOf: readonly string[]; invalid?: string }
export interface TextRule extends Common {
  /* `boolean` and not the literal `true`, because a caller writing
     `{ text: true, min: 10 }` in a variable has an inferred `boolean`
     and this flag is only ever truthiness-tested. Text is the default
     branch: nothing reads the flag, it is there to be read by a
     person. */
  text?: boolean; min?: number; max?: number; short?: string; long?: string;
}

export type Rule = SlugRule | IdRule | EmailRule | OneOfRule | TextRule;
export type Spec = Record<string, Rule>;

/** What a checked body looks like. A field is a string or a
    number depending on its rule, which is more than the old
    `Record<string, any>` said and less than a mapped type worth
    the reading. */
export type Checked = Record<string, string | number>;

/** Either the value or the Response to return. Never both, which
    is why this is a union rather than two optional fields. */
export type ReadResult =
  | { value: Checked; input: Record<string, unknown>; bad?: undefined }
  | { bad: Response; value?: undefined; input?: undefined };

/** A slug, or "". The same test three endpoints were making
    separately: lower case, and nothing in it that could become a
    path segment somewhere else. A URL prefix from a request body
    is how you end up serving /etc/passwd.html. */
export const safeSlug = (value: unknown, max = 120): string => {
  const s = str(value, max).toLowerCase();
  return /^[a-z0-9-]+$/.test(s) ? s : "";
};

/** A positive integer, or 0.

    `Number(x) || 0` is what six endpoints wrote, and it says yes
    to 3.7 and to -1. A row id is neither. */
export const safeId = (value: unknown): number => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 0;
};

/* ---------- the one reader ---------- */

/**
 * Read and check a request body against a declaration.
 *
 * Returns `{ value }` when everything passed, or `{ bad }` where
 * `bad` is the Response to return. Never both, and never throws: a
 * body that is not JSON at all is an empty object, which every
 * "required" rule then catches by itself.
 *
 * Each field takes one of four kinds and some options:
 *
 *   { text: true, min, max, required, short, long }
 *   { slug: true, max, required }
 *   { id: true, required }
 *   { email: true, required, invalid }
 *   { oneOf: [...], required, invalid }
 *
 * A rule with no reason named cannot fail the request: the value
 * is cleaned and handed back, which is what an optional field
 * wants.
 */
export async function read(request: Request, spec: Spec): Promise<ReadResult> {
  const input = await readBody(request) as Record<string, unknown>;
  const value: Checked = {};

  for (const [name, rule] of Object.entries(spec)) {
    const raw = input[name];

    if ("slug" in rule && rule.slug) {
      const s = safeSlug(raw, rule.max ?? 120);
      if (!s && rule.required) return { bad: fail(rule.required) };
      value[name] = s;
      continue;
    }

    if ("id" in rule && rule.id) {
      const n = safeId(raw);
      if (!n && rule.required) return { bad: fail(rule.required) };
      value[name] = n;
      continue;
    }

    if ("email" in rule && rule.email) {
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

    if ("oneOf" in rule && rule.oneOf) {
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

       The cap is applied BEFORE the minimum is checked: `str()`
       truncates, so a 5000 character body capped at 4000 is 4000
       long and passes a minimum of 10, which is the right answer.
       Checking the minimum against the raw value would pass the
       same body and then store the truncated one. */
    const text = str(raw, ("max" in rule ? rule.max : undefined) ?? 4000);
    if (!text && rule.required) return { bad: fail(rule.required) };
    const t = rule as TextRule;
    if (t.min !== undefined && text.length < t.min && (t.short || t.required)) {
      return { bad: fail((t.short ?? t.required) as string) };
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

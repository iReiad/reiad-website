/* ============================================================
   saved.js: the two things an account holds that are not a tick.

   A saved scenario is a filled-in calculator under a name. A
   target is a goal with a number on it. Both are rows in Postgres
   behind row-level security, both belong to exactly one person,
   and neither has a copy on the device.

   THAT IS THE POINT, and it is the same rule `sync.js` was
   rewritten around. Progress has a copy here because four schools
   have read localStorage since before there were accounts and a
   reader with no account still gets all of it. Nothing below has
   that history and nothing below works signed out, so a local
   copy would be a second record to keep in step for no reader's
   benefit. Every function here answers `null` or `[]` when nobody
   is signed in, and the pages that call them show the sign-in
   button instead.

   ---- why there is no client library, again ----

   Same answer as `account.js`: what this needs from Supabase is
   four verbs against two tables over HTTP, which is the file you
   are reading. The token is fetched through `token()` so that
   refresh happens in one place.
   ============================================================ */

import { SUPABASE_URL, SUPABASE_KEY, token, current } from "/account.js";

const REST = `${SUPABASE_URL}/rest/v1`;

/* Named rather than `*`, for the reason `account.js` gives about
   the profile: a column added to a table for some other reason
   should not start arriving in a browser without anybody deciding
   that it should. */
const SCENARIO_FIELDS = "id,tool,name,inputs,summary,created_at,updated_at";
const TARGET_FIELDS = "id,kind,subject,label,target,reached,unit,done_at,created_at";

async function headers(extra) {
  const access = await token();
  if (!access) return null;
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * One request, with the failure written down rather than thrown
 * at a page that cannot do anything about it.
 *
 * Reads answer with a fallback so a list can render empty; writes
 * throw, because a reader who pressed Save has to be told when it
 * did not save. That asymmetry is deliberate: silence is fine for
 * something nobody asked for and never fine for something
 * somebody did.
 */
async function get(path, fallback) {
  const head = await headers();
  if (!head) return fallback;
  try {
    const res = await fetch(`${REST}/${path}`, { headers: head });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } catch (err) {
    console.warn("saved: could not read", path, err);
    return fallback;
  }
}

async function send(path, method, body, prefer) {
  const head = await headers(prefer ? { Prefer: prefer } : undefined);
  if (!head) throw new Error("Not signed in.");
  const res = await fetch(`${REST}/${path}`, {
    method,
    headers: head,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    /* Postgres speaks through PostgREST, and its message is the
       useful one: a name too long or a ceiling reached both come
       back as a sentence worth showing. */
    const said = await res.json().catch(() => null);
    throw new Error(said?.message || `That did not save (${res.status}).`);
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

/** The one filter every write carries. The policies already make
    it impossible to touch anybody else's row; without a filter
    PostgREST would send the statement across the whole table and
    the policy would be the only thing standing between that and
    everybody's. Two locks on a door that is never meant to open,
    which is the argument `account.js` makes for the same line. */
const mine = () => {
  const who = current();
  if (!who) throw new Error("Not signed in.");
  return `user_id=eq.${encodeURIComponent(who.id)}`;
};

/* ============================================================
   Scenarios
   ============================================================ */

/** Every scenario saved for one calculator, newest first. */
export function listScenarios(tool) {
  if (!current()) return Promise.resolve([]);
  const where = tool ? `&tool=eq.${encodeURIComponent(tool)}` : "";
  return get(`scenarios?select=${SCENARIO_FIELDS}${where}&order=updated_at.desc`, []);
}

/**
 * Save one, and hand the stored row back.
 *
 * `inputs` is whatever shape the calculator already had for its
 * own state. The stock check passes its query string, which is
 * the format it has shared analyses in since it was written: a
 * second serialisation of the same forty fields would be a second
 * thing to keep in step with the model, and this one is already
 * proved by every link anybody has ever copied off that page.
 */
export function saveScenario({ tool, name, inputs, summary = "" }) {
  return send(
    `scenarios?select=${SCENARIO_FIELDS}`,
    "POST",
    [{ tool, name: String(name ?? "").slice(0, 80), inputs, summary: String(summary).slice(0, 200) }],
    "return=representation",
  ).then((rows) => (Array.isArray(rows) ? rows[0] : rows));
}

/** Rename, or overwrite the inputs of, one that already exists. */
export function updateScenario(id, patch) {
  return send(
    `scenarios?id=eq.${encodeURIComponent(id)}&${mine()}`,
    "PATCH", patch, "return=minimal",
  ).then(() => true);
}

export function removeScenario(id) {
  return send(
    `scenarios?id=eq.${encodeURIComponent(id)}&${mine()}`,
    "DELETE", undefined, "return=minimal",
  ).then(() => true);
}

/* ============================================================
   Targets

   The three kinds are in the migration and the shape is the same
   for all three: a label, a number to reach, and a unit. Where
   the progress comes from is the account page's question, not
   this file's, because two of the three read it out of the
   reader's own ticks and this module does not hold those.
   ============================================================ */

export const KINDS = ["course", "habit", "metric"];

export function listTargets() {
  if (!current()) return Promise.resolve([]);
  return get(`targets?select=${TARGET_FIELDS}&order=created_at.desc`, []);
}

export function saveTarget({ kind, subject = "", label, target = 0, reached = 0, unit = "" }) {
  if (!KINDS.includes(kind)) throw new Error("That is not a kind of target.");
  return send(
    `targets?select=${TARGET_FIELDS}`,
    "POST",
    [{
      kind,
      subject: String(subject).slice(0, 60),
      label: String(label ?? "").slice(0, 80),
      target: Number(target) || 0,
      reached: Number(reached) || 0,
      unit: String(unit).slice(0, 20),
    }],
    "return=representation",
  ).then((rows) => (Array.isArray(rows) ? rows[0] : rows));
}

export function updateTarget(id, patch) {
  return send(
    `targets?id=eq.${encodeURIComponent(id)}&${mine()}`,
    "PATCH", patch, "return=minimal",
  ).then(() => true);
}

export function removeTarget(id) {
  return send(
    `targets?id=eq.${encodeURIComponent(id)}&${mine()}`,
    "DELETE", undefined, "return=minimal",
  ).then(() => true);
}

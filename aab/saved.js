/* saved.ts: the things an account holds that are not a tick. A
   saved scenario, a target, a library row. All three are rows in
   Postgres behind row-level security and none has a copy on the
   device: progress has one because four schools read localStorage
   from before there were accounts, and nothing here has that
   history or works signed out. Every function answers `null` or
   `[]` signed out and the page shows the sign-in button. */
import { SUPABASE_URL, SUPABASE_KEY, token, current } from "/account.js";
const REST = `${SUPABASE_URL}/rest/v1`;
/* Named rather than `*`, for the reason `account.js` gives about
   the profile: a column added to a table for some other reason
   should not start arriving in a browser without anybody deciding
   that it should. */
const SCENARIO_FIELDS = "id,tool,name,inputs,summary,created_at,updated_at";
const TARGET_FIELDS = "id,kind,subject,label,target,reached,unit,done_at,created_at";
const LIBRARY_FIELDS = "id,url,title,kind,saved,note,created_at,updated_at";
async function headers(extra) {
    const access = await token();
    if (!access)
        return null;
    return {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
        ...extra,
    };
}
/**
 * One request. Reads answer with a fallback so a list can render
 * empty; writes THROW, because a reader who pressed Save has to
 * be told when it did not save.
 */
async function get(path, fallback) {
    const head = await headers();
    if (!head)
        return fallback;
    try {
        const res = await fetch(`${REST}/${path}`, { headers: head });
        if (!res.ok)
            throw new Error(String(res.status));
        return await res.json();
    }
    catch (err) {
        console.warn("saved: could not read", path, err);
        return fallback;
    }
}
async function send(path, method, body, prefer) {
    const head = await headers(prefer ? { Prefer: prefer } : undefined);
    if (!head)
        throw new Error("Not signed in.");
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
    if (res.status === 204)
        return null;
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
    if (!who)
        throw new Error("Not signed in.");
    return `user_id=eq.${encodeURIComponent(who.id)}`;
};
/* ============================================================
   Scenarios
   ============================================================ */
/** Every scenario saved for one calculator, newest first. */
export function listScenarios(tool) {
    if (!current())
        return Promise.resolve([]);
    const where = tool ? `&tool=eq.${encodeURIComponent(tool)}` : "";
    return get(`scenarios?select=${SCENARIO_FIELDS}${where}&order=updated_at.desc`, []);
}
/**
 * Save one, and hand the stored row back. `inputs` is whatever
 * shape the calculator already had; the stock check passes its
 * own query string, which is the format it has shared analyses in
 * since it was written, so there is one encoder.
 */
export function saveScenario({ tool, name, inputs, summary = "" }) {
    return send(`scenarios?select=${SCENARIO_FIELDS}`, "POST", [{ tool, name: String(name ?? "").slice(0, 80), inputs, summary: String(summary).slice(0, 200) }], "return=representation").then((rows) => (Array.isArray(rows) ? rows[0] : rows));
}
/** Rename, or overwrite the inputs of, one that already exists. */
export function updateScenario(id, patch) {
    return send(`scenarios?id=eq.${encodeURIComponent(id)}&${mine()}`, "PATCH", patch, "return=minimal").then(() => true);
}
export function removeScenario(id) {
    return send(`scenarios?id=eq.${encodeURIComponent(id)}&${mine()}`, "DELETE", undefined, "return=minimal").then(() => true);
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
    if (!current())
        return Promise.resolve([]);
    return get(`targets?select=${TARGET_FIELDS}&order=created_at.desc`, []);
}
export function saveTarget({ kind, subject = "", label, target = 0, reached = 0, unit = "" }) {
    if (!KINDS.includes(kind))
        throw new Error("That is not a kind of target.");
    return send(`targets?select=${TARGET_FIELDS}`, "POST", [{
            kind,
            subject: String(subject).slice(0, 60),
            label: String(label ?? "").slice(0, 80),
            target: Number(target) || 0,
            reached: Number(reached) || 0,
            unit: String(unit).slice(0, 20),
        }], "return=representation").then((rows) => (Array.isArray(rows) ? rows[0] : rows));
}
export function updateTarget(id, patch) {
    return send(`targets?id=eq.${encodeURIComponent(id)}&${mine()}`, "PATCH", patch, "return=minimal").then(() => true);
}
export function removeTarget(id) {
    return send(`targets?id=eq.${encodeURIComponent(id)}&${mine()}`, "DELETE", undefined, "return=minimal").then(() => true);
}
/* ============================================================
   The library: pages kept, and notes written on them

   One row per person per page, and `saved` and `note` are two
   facts about that row rather than two kinds of it. The migration
   says why at length; the shape it produces here is that a page
   has ONE state, `{ saved, note }`, and both controls on the page
   write the same row.
   ============================================================ */
/** What this account holds about one page, or null.

    Null means the reader has neither kept it nor written on it,
    which is the state nearly every page is in and the reason this
    returns null rather than an empty row: a control that has to
    tell "not kept" from "kept and then unkept" would be a control
    with three states and two of them identical. */
export async function libraryRow(url) {
    if (!current())
        return null;
    const rows = await get(`library?select=${LIBRARY_FIELDS}&url=eq.${encodeURIComponent(url)}&limit=1`, []);
    return rows[0] ?? null;
}
/**
 * Write this page's row. An upsert on `(user_id, url)`: one round
 * trip, and it cannot race with the same reader's phone writing
 * the other column. The trigger in the migration removes the row
 * once both facts have gone, so the reading list can be COUNTED
 * rather than filtered.
 */
export async function keepPage({ url, title = "", kind = "piece", saved, note }) {
    const head = await headers({ Prefer: "resolution=merge-duplicates,return=representation" });
    if (!head)
        throw new Error("Not signed in.");
    /* Only the columns being changed, plus the three that identify
       the row. Sending `note: ""` from a Save button would erase
       what the reader wrote on their phone this morning, which is
       the one destructive thing this endpoint could do. */
    const row = { url, title: String(title).slice(0, 200), kind };
    if (saved !== undefined)
        row.saved = Boolean(saved);
    if (note !== undefined)
        row.note = String(note).slice(0, 20000);
    const res = await fetch(`${REST}/library?on_conflict=user_id,url&select=${LIBRARY_FIELDS}`, {
        method: "POST",
        headers: head,
        body: JSON.stringify([row]),
    });
    if (!res.ok) {
        const said = await res.json().catch(() => null);
        throw new Error(said?.message || `That did not save (${res.status}).`);
    }
    const [back] = (await res.json().catch(() => []));
    return back ?? null;
}
/** Everything kept, newest first. `only` narrows it to the
    reading list or to the pages with something written on them,
    which are the two lists the account page draws. */
export function listLibrary(only) {
    if (!current())
        return Promise.resolve([]);
    const where = only === "saved" ? "&saved=is.true"
        : only === "notes" ? "&note=neq."
            : "";
    return get(`library?select=${LIBRARY_FIELDS}${where}&order=updated_at.desc`, []);
}
export function removeLibraryRow(id) {
    return send(`library?id=eq.${encodeURIComponent(id)}&${mine()}`, "DELETE", undefined, "return=minimal").then(() => true);
}

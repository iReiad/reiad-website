/* ============================================================
   _lib/backup.js: a copy of the database that is not the database.

   Until the Studio existed, the repository WAS the backup: every
   article was a file in git with its whole history. The moment D1
   became the place a piece actually lives, that stopped being
   true, and `article_versions` does not fix it, because it is a
   table in the same database as the thing it is protecting. A
   dropped table takes its own version history with it.

   So there are two backups, going to two places, and the split
   between them is not about size or convenience. It is about who
   can read them.

   ---- WHAT GOES IN GIT, AND WHY THAT DOES NOT RELAX ----

   This repository was public when the split below was designed,
   and it was made private on 15 August 2026. The rule did not
   change with it, and that is deliberate.

   Repository visibility is one setting, one click, reversible by
   anyone with admin, and retroactive in neither direction: making
   a repository private does not unpublish a single byte that was
   already fetched, forked or cached, and making it public later
   publishes the entire history at once, including every commit
   made while it was private. A rule that holds only while a
   checkbox holds is not a rule.

   So git gets exactly one of these tables: live articles. Every
   byte of a live article is already served to anyone who asks for
   its URL, so a copy in git publishes nothing that was not
   published, whatever the setting says today or in five years.

   Everything else in this database is somebody's, and none of it
   goes anywhere near git:

     drafts          not published yet. Committing a draft IS
                     publishing it, which is the opposite of what a
                     draft is for.
     questions       a reader's name, their email and their words,
                     often before I have answered them.
     subscribers     email addresses, and their confirmation tokens.
     enquiries       people writing about work, with their address
                     and whatever they chose to tell me.
     settings        holds the admin password hash. Committing it
                     hands an attacker an offline target with all
                     the time in the world.
     sessions        live credentials.

   Those go to R2 instead: a different service, a different failure
   mode, and not readable without the account. That is a weaker
   guarantee than off-provider, and it is written down here so
   nobody mistakes it for a strong one. It protects against the
   realistic accident (a bad query, a dropped table, a bad deploy).
   It does not protect against losing the Cloudflare account.

   ---- WHAT IS DELIBERATELY NOT BACKED UP ----

     sessions   credentials with an expiry. Restoring them would
                restore a logged-in browser from a month ago.
     throttle   rate-limit counters. Meaningless an hour later.
     views      one row per path per day, the biggest table here
                and the least valuable: a lost view count is a lost
                view count. It is in the R2 snapshot only because
                it costs almost nothing there and nothing at all in
                git, and if that ever changes it is the first thing
                to drop.

   TRANSITION.md, Stage 2.
   ============================================================ */

import { all } from "./db.js";

/** Bumped when the shape below changes, so a restore can refuse a
    file it does not understand rather than half-applying it. */
export const BACKUP_FORMAT = 1;

/* Every table in the R2 snapshot, and the order they have to be
   restored in. Order matters for nothing today (D1 has no foreign
   keys here) and is kept anyway, because the day one is added is
   not the day anyone will remember to think about it. */
const SNAPSHOT_TABLES = [
  "articles",
  "article_versions",
  "questions",
  "subscribers",
  "enquiries",
  "reactions",
  "views",
  "settings",
];

/* Never, under any circumstances, in either backup. Listed rather
   than merely omitted so that adding a table to SNAPSHOT_TABLES by
   copying a line cannot quietly pick one of these up. */
const NEVER = new Set(["sessions", "throttle"]);

/**
 * The public backup: live articles, and nothing else.
 *
 * This is what gets committed to git, so the rule for the column
 * list below is narrower than "everything about an article". It is
 * **only fields that are already published**.
 *
 * Two are therefore missing. `notion_page_id` and
 * `notion_synced_at` identify a page in a private Notion
 * workspace. Neither is a credential and neither grants access to
 * anything, but neither is public either, and "a public file
 * contains only what is already public" is a rule that can be
 * checked at a glance. "A public file contains only things that
 * are not quite credentials" is not.
 *
 * The cost is small and worth stating: a restore from git alone
 * gives back every article and leaves the Notion links to be
 * reconnected by hand. The R2 snapshot has them, and that is the
 * one you would reach for in any disaster short of losing the
 * Cloudflare account.
 *
 * `status = 'live'` is not a tidiness filter either. It is the
 * other half of the boundary: a draft is unpublished writing, and
 * committing it to a public repository publishes it.
 */
export async function articleBackup(d1) {
  const rows = await all(
    d1,
    `SELECT slug, section, title, dek, tag, topics, lang, body, minutes,
            status, cover, published_at, created_at, updated_at
       FROM articles
      WHERE status = 'live'
      ORDER BY slug`
  );

  return {
    format: BACKUP_FORMAT,
    kind: "articles",
    taken_at: new Date().toISOString(),
    note:
      "Live articles only. Generated nightly; do not edit by hand. "
      + "Drafts, anything belonging to a reader, and any identifier "
      + "of a system outside this site are deliberately absent: see "
      + "functions/_lib/backup.js.",
    count: rows.length,
    articles: rows,
  };
}

/**
 * The private backup: everything worth keeping, for R2.
 *
 * A table that does not exist yet answers with an error rather
 * than an empty list, and that must not lose the other seven, so
 * each one is caught on its own and recorded as missing.
 */
export async function fullSnapshot(d1) {
  const tables = {};
  const missing = [];

  for (const table of SNAPSHOT_TABLES) {
    if (NEVER.has(table)) continue;          // see the note above
    try {
      tables[table] = await all(d1, `SELECT * FROM ${table}`);
    } catch {
      missing.push(table);
    }
  }

  return {
    format: BACKUP_FORMAT,
    kind: "full",
    taken_at: new Date().toISOString(),
    counts: Object.fromEntries(
      Object.entries(tables).map(([name, rows]) => [name, rows.length])
    ),
    missing,
    tables,
  };
}

/* ============================================================
   Writing it to R2
   ============================================================ */

/** One snapshot a day, kept for a fortnight, plus `latest`. */
const KEEP_DAYS = 14;

const dayKey = (at) => `backups/${at.toISOString().slice(0, 10)}.json`;

/**
 * Take a snapshot and put it in R2. Returns what happened, so the
 * cron can log one line rather than nothing.
 *
 * Old snapshots are deleted by name rather than by listing the
 * bucket, because the bucket also holds every photo on the site
 * and a list-then-delete loop over it is one typo away from being
 * the worst function in this repository.
 */
export async function writeSnapshot(env, d1) {
  if (!env?.MEDIA) return { ok: false, reason: "no-r2" };

  const at = new Date();
  const snapshot = await fullSnapshot(d1);
  const json = JSON.stringify(snapshot);
  const meta = {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
    customMetadata: { taken_at: snapshot.taken_at, format: String(BACKUP_FORMAT) },
  };

  await env.MEDIA.put(dayKey(at), json, meta);
  await env.MEDIA.put("backups/latest.json", json, meta);

  // A fortnight and a day ago, which is the one that has just aged out.
  const stale = new Date(at);
  stale.setDate(stale.getDate() - (KEEP_DAYS + 1));
  await env.MEDIA.delete(dayKey(stale)).catch(() => {});

  return {
    ok: true,
    key: dayKey(at),
    bytes: json.length,
    counts: snapshot.counts,
    missing: snapshot.missing,
  };
}

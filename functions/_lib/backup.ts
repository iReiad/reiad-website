/* _lib/backup.ts: a copy of the database that is not the database.

   `article_versions` does not count: it is a table in the same
   database as the thing it protects, and a dropped table takes its
   own version history with it. So there are two backups going to
   two places, and the split is about WHO CAN READ THEM.

   GIT GETS EXACTLY ONE TABLE: live articles. Every byte of one is
   already served to anyone who asks for its URL, so a copy in git
   publishes nothing that was not published. Repository visibility
   does not relax this: it is one click, reversible by anyone with
   admin, and retroactive in neither direction, and a rule that
   holds only while a checkbox holds is not a rule.

   Everything else is somebody's and goes nowhere near git:

     drafts          not published yet. Committing one IS
                     publishing it.
     questions       a reader's name, email and words, often
                     before I have answered them.
     subscribers     email addresses and confirmation tokens.
     enquiries       people writing about work, with their address.
     settings        the admin password hash. Committing it hands
                     an attacker an offline target.
     sessions        live credentials.

   Those go to R2: a different service and a different failure
   mode, not readable without the account. That is weaker than
   off-provider and is written down as weaker. It protects against
   a bad query, a dropped table or a bad deploy, and not against
   losing the Cloudflare account.

   NOT BACKED UP AT ALL:

     sessions   credentials with an expiry. Restoring them would
                restore a logged-in browser from a month ago.
     throttle   rate-limit counters, meaningless an hour later.
     views      one row per path per day, the biggest table here
                and the least valuable. In the R2 snapshot only
                because it costs almost nothing there. */

import { all } from "./db.ts";
import type { MediaEnv } from "./r2.ts";

/** Bumped when the shape below changes, so a restore can refuse a
    file it does not understand rather than half-applying it. */
import type { D1Database, Row } from "./db.ts";

/** What this file needs off the Worker's environment: the bucket,
    and nothing else. `MediaEnv` is the declaration, in `r2.ts`,
    because two other modules bind the same thing. */
export type BackupEnv = MediaEnv;

/** What goes in git: live articles and nothing else. Every byte of
    it is already served at a public URL, which is the whole reason
    it is safe to commit. */
export interface BackupFile {
  format: number;
  kind: "articles";
  taken_at: string;
  note: string;
  count: number;
  articles: Row[];
}

/** What goes to R2: every table except the two that are state. */
export interface Snapshot {
  format: number;
  kind: "full";
  taken_at: string;
  counts: Record<string, number>;
  missing: string[];
  tables: Record<string, Row[]>;
}

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
 * This is committed to git, so the column list is narrower than
 * "everything about an article": ONLY FIELDS THAT ARE ALREADY
 * PUBLISHED. `notion_page_id` and `notion_synced_at` are therefore
 * missing. Neither is a credential, but "a public file contains
 * only what is already public" is a rule that can be checked at a
 * glance and "only things that are not quite credentials" is not.
 * The cost: a restore from git alone leaves the Notion links to be
 * reconnected by hand, and the R2 snapshot has them.
 *
 * `status = 'live'` is not a tidiness filter: a draft is
 * unpublished writing, and committing it publishes it.
 */
export async function articleBackup(d1: D1Database): Promise<BackupFile> {
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
      + "functions/_lib/backup.ts.",
    count: rows.length,
    articles: rows,
  };
}

/**
 * The private backup: everything worth keeping, for R2.
 *
 * A table that does not exist yet answers with an error rather
 * than an empty list, and that must not lose the other seven, so
 * each is caught on its own and recorded as missing.
 */
export async function fullSnapshot(d1: D1Database): Promise<Snapshot> {
  const tables: Record<string, Row[]> = {};
  const missing: string[] = [];

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

const dayKey = (at: Date): string => `backups/${at.toISOString().slice(0, 10)}.json`;

/**
 * Take a snapshot and put it in R2. Returns what happened, so the
 * cron can log one line rather than nothing.
 *
 * Old snapshots are deleted BY NAME rather than by listing the
 * bucket, because the bucket also holds every photo on the site
 * and a list-then-delete loop over it is one typo away from being
 * the worst function in this repository.
 */
export async function writeSnapshot(env: BackupEnv, d1: D1Database) {
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

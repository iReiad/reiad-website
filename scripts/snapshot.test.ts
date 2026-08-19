/* ============================================================
   scripts/snapshot.test.ts: the R2 half of the backup.

     node scripts/snapshot.test.ts

   The nightly snapshot into R2 runs from a cron, at 03:17, with
   nobody watching. If it throws, the only trace is a line in a log
   that nobody reads, and the first sign of trouble is an empty
   bucket on the day it is needed. That is the exact failure this
   repository writes checks against, so the function is exercised
   here against a stub bucket instead of being discovered in
   production tomorrow morning.

   It checks the things that are silently wrong rather than loudly
   wrong: that no table anyone would regret losing has been left
   out, that the two tables which must never be backed up are not,
   that a missing table does not lose the other seven, and that
   deleting an aged-out snapshot deletes exactly one key and never
   touches a photo.
   ============================================================ */

import { writeSnapshot, articleBackup, fullSnapshot, BACKUP_FORMAT }
  from "../functions/_lib/backup.js";

/** One row of any table, which is all a stub database needs to
    know about one. The ten tables below are ten different shapes
    and the stub is deliberately indifferent to which it is
    holding: what it has to get right is the COLUMN LIST, and that
    comes out of the SQL rather than out of the row. */
type Row = Record<string, unknown>;

let failures = 0;
const check = (name: string, got: unknown, want: unknown): void => {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a === b) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${a}\n       want ${b}`);
};
const okay = (name: string, cond: unknown): void => check(name, !!cond, true);

/* ---------- a D1 stub that answers the queries backup.js runs ---------- */

const TABLES: Record<string, Row[]> = {
  articles: [
    { slug: "live-one", section: "insights", title: "A live piece", body: "<p>hi</p>",
      status: "live", dek: "", tag: "", topics: "", lang: "en", minutes: 3,
      cover: "", published_at: "2026-08-01", created_at: "2026-08-01",
      updated_at: "2026-08-01", notion_page_id: "secret-notion-id", notion_synced_at: null },
    { slug: "a-draft", section: "insights", title: "Not finished", body: "<p>TODO</p>",
      status: "draft", dek: "", tag: "", topics: "", lang: "en", minutes: 1,
      cover: "", published_at: null, created_at: "2026-08-02",
      updated_at: "2026-08-02", notion_page_id: null, notion_synced_at: null },
  ],
  article_versions: [{ id: 1, slug: "live-one", body: "<p>older</p>" }],
  questions: [{ id: 1, name: "Ayesha", email: "reader@example.com", body: "কত টাকা?" }],
  subscribers: [{ email: "someone@example.com", token: "confirm-me" }],
  enquiries: [{ id: 1, email: "client@example.com", message: "Can you model this?" }],
  reactions: [{ slug: "live-one", kind: "useful", count: 3 }],
  views: [{ path: "/insights/live-one", day: "2026-08-14", count: 11 }],
  settings: [{ key: "admin_password", value: "scrypt$notarealhash" }],
  // Present in the database and required to be absent from both backups.
  sessions: [{ token: "a-live-session", expires_at: "2099-01-01" }],
  throttle: [{ bucket: "x", count: 1, resets: "2026-08-15" }],
};

/**
 * A D1 stub that honours the SELECT list.
 *
 * That last part is the point rather than a detail. The whole
 * safety of the public backup is which columns its query names,
 * and a stub that hands back the entire row whatever it was asked
 * for cannot tell a correct column list from a `SELECT *`. It
 * would have passed this test with the Notion id still in it.
 *
 * `all()` in db.js calls prepare().bind().all(), and this mirrors
 * exactly that shape and nothing else.
 */
const d1 = (missing = new Set<string>()) => ({
  prepare(sql: string) {
    const table = sql.match(/FROM (\w+)/)?.[1];
    const list = sql.match(/SELECT([\s\S]*?)FROM/)?.[1] ?? "*";
    const columns = list.trim() === "*"
      ? null
      : list.split(",").map((c) => c.trim()).filter(Boolean);

    const project = (row: Row) => (columns
      ? Object.fromEntries(columns.map((c) => [c, row[c]]))
      : row);

    return {
      bind: () => ({
        all: async () => {
          if (table && missing.has(table)) throw new Error("no such table");
          let rows = TABLES[String(table)] ?? [];
          if (/WHERE status = 'live'/.test(sql)) {
            rows = rows.filter((a: Row) => a.status === "live");
          }
          return { results: rows.map(project) };
        },
      }),
    };
  },
});

/** One table out of a snapshot.

    `fullSnapshot()` fills its `tables` by assigning into an empty
    object, so what TypeScript infers for the property is `{}` and
    no table is a member of that. This says what the loop really
    puts there, in the one place the checks below read a table by
    name, rather than restating the whole return shape: that shape
    belongs beside `backup.js` on the day it becomes a `.ts`, and
    a copy of it here would be a second one to delete. */
const tableOf = (snap: { tables: object }, name: string): Row[] =>
  (snap.tables as Record<string, Row[]>)[name] ?? [];

console.log("the nightly snapshot");

/* ---------- 1. the public backup, again, through the real function ---------- */
{
  const backup = await articleBackup(d1());
  const text = JSON.stringify(backup);

  check("format", backup.format, BACKUP_FORMAT);
  check("kind", backup.kind, "articles");
  check("live only", backup.articles.map((a: Row) => a.slug), ["live-one"]);
  okay("no draft", !text.includes("a-draft"));
  okay("no reader email", !text.includes("reader@example.com"));
  okay("no subscriber token", !text.includes("confirm-me"));
  okay("no password hash", !text.includes("scrypt$"));
  okay("no session token", !text.includes("a-live-session"));
  okay("no Notion id", !text.includes("secret-notion-id"));
  okay("the note explains itself", /deliberately absent/.test(backup.note));
}

/* ---------- 2. the private snapshot ---------- */
{
  const snap = await fullSnapshot(d1());
  const names = Object.keys(snap.tables).sort();
  const articles = tableOf(snap, "articles");

  check("every table worth keeping", names, [
    "article_versions", "articles", "enquiries", "questions",
    "reactions", "settings", "subscribers", "views",
  ]);
  okay("sessions never", !("sessions" in snap.tables));
  okay("throttle never", !("throttle" in snap.tables));
  okay("sessions not in the text either",
    !JSON.stringify(snap).includes("a-live-session"));
  okay("drafts ARE here, unlike the public one",
    articles.some((a) => a.status === "draft"));
  check("counts are counted", snap.counts.articles, 2);
  check("nothing missing", snap.missing, []);
}

/* ---------- 3. a table that does not exist yet ---------- */
{
  const snap = await fullSnapshot(d1(new Set(["reactions", "views"])));
  check("the missing ones are named", snap.missing.sort(), ["reactions", "views"]);
  check("and the rest survived", Object.keys(snap.tables).length, 6);
  okay("articles still there", tableOf(snap, "articles").length === 2);
}

/* ---------- 4. writing it to R2 ---------- */
{
  /** What the stub bucket remembers about one write. The content
      type is kept because a snapshot written as anything but JSON
      is one nothing would open, and the byte count because the two
      copies have to be the same file. */
  interface Put {
    key: string;
    bytes: number;
    meta: { httpMetadata: { contentType: string } };
  }

  const put: Put[] = [];
  const deleted: string[] = [];
  const env = {
    MEDIA: {
      put: async (key: string, body: string, meta: Put["meta"]) => {
        put.push({ key, bytes: body.length, meta });
      },
      delete: async (key: string) => { deleted.push(key); },
    },
  };

  const report = await writeSnapshot(env, d1());
  const today = new Date().toISOString().slice(0, 10);

  okay("it reports success", report.ok);
  check("two keys written", put.map((p) => p.key).sort(),
    [`backups/${today}.json`, "backups/latest.json"].sort());
  check("one key deleted", deleted.length, 1);
  okay("and the deleted one is a dated backup, not a photo",
    /^backups\/\d{4}-\d{2}-\d{2}\.json$/.test(deleted[0]));
  okay("the deleted one is older than the one just written",
    deleted[0] < `backups/${today}.json`);
  okay("content type is JSON",
    put[0].meta.httpMetadata.contentType.startsWith("application/json"));
  okay("both copies are the same bytes", put[0].bytes === put[1].bytes);
  /* `report.bytes` is absent on the no-R2 branch, which is the
     branch the last check in this block is about. Read through a
     default rather than asserted away: undefined is not a size. */
  okay("it says how big it was", (report.bytes ?? 0) > 0);

  /* The one that would matter at three in the morning: no R2
     binding must be a report, not a throw, or the cron dies and
     takes the log line with it. */
  const none = await writeSnapshot({}, d1());
  check("no R2 is a reason, not an exception", none, { ok: false, reason: "no-r2" });
}

console.log(failures ? `\n${failures} failure(s)` : "\nall good: the nightly snapshot does what it says");
process.exit(failures ? 1 : 0);

/* ============================================================
   scripts/comments.test.mjs: the endpoint, against real SQLite
   and real signatures.

     node scripts/comments.test.mjs

   The two rules this whole stage exists to enforce are the two
   that are easiest to get subtly wrong, so they are tested
   directly rather than inferred:

     nobody posts as anybody else   the author comes from a
                                    verified token, never from the
                                    request body
     nothing appears until approved including from me

   `readerFrom()` has its own suite in reader.test.mjs, which does
   the attacks. This one checks the endpoint that uses it: that it
   refuses to write without a good token, that it writes the
   author from the token rather than the body, that a pending
   comment is invisible to the public read, and that a reply
   cannot be smuggled onto a different piece.
   ============================================================ */

import { DatabaseSync } from "node:sqlite";
import { webcrypto } from "node:crypto";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

let failures = 0;
const check = (name, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
};
const okay = (name, cond) => check(name, !!cond, true);

/* ---------- a database with the real schema ---------- */

const db = new DatabaseSync(":memory:");
db.exec(`
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL, section TEXT NOT NULL DEFAULT 'insights',
  parent_id INTEGER,
  author_id TEXT NOT NULL, author_name TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL, approved_at TEXT);
CREATE TABLE throttle (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, resets TEXT NOT NULL);
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE sessions (token TEXT PRIMARY KEY, label TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL, expires_at TEXT NOT NULL);
`);

/* The D1 shape, over node:sqlite. prepare().bind().all()/first()/run() */
const D1 = {
  prepare(sql) {
    const make = (args) => ({
      all: async () => ({ results: db.prepare(sql).all(...args) }),
      first: async () => db.prepare(sql).get(...args) ?? null,
      run: async () => { db.prepare(sql).run(...args); return { success: true }; },
    });
    return { bind: (...args) => make(args), ...make([]) };
  },
  /* db() applies the schema through batch() on first use, so this
     runs it for real. That makes the migrations themselves part of
     what this test covers. */
  batch: async (statements) => {
    for (const st of statements) await st.run();
    return [];
  },
};

/* ---------- a signing key, and the JWKS behind it ---------- */

const pair = await webcrypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]
);
const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
jwk.kid = "k1"; jwk.alg = "ES256";

const SUPABASE_URL = "https://project.supabase.co";
const b64url = (b) => Buffer.from(b).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const enc = (o) => b64url(Buffer.from(JSON.stringify(o)));

async function tokenFor(sub, name) {
  const head = enc({ alg: "ES256", typ: "JWT", kid: "k1" });
  const body = enc({
    sub, iss: `${SUPABASE_URL}/auth/v1`, exp: Math.floor(Date.now() / 1000) + 3600,
    email: `${sub}@example.com`, user_metadata: { full_name: name },
  });
  const sig = await webcrypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" },
    pair.privateKey, new TextEncoder().encode(`${head}.${body}`));
  return `${head}.${body}.${b64url(sig)}`;
}

globalThis.fetch = async (url) =>
  String(url).endsWith("/auth/v1/.well-known/jwks.json")
    ? new Response(JSON.stringify({ keys: [jwk] }), { status: 200 })
    : new Response("no", { status: 404 });

/* ---------- the handler ----------

   No stubbing of db(): the handler is given its database exactly
   the way the Worker gives it one, through `env.DB`, and the real
   db() runs the real migrations against it. So this test also
   proves the CREATE TABLE statements in _lib/db.js are valid
   SQLite, which is the other thing that would fail in production
   and nowhere else. */
const { onRequest } = await import("../functions/api/comments/[[id]].js");

const env = { DB: D1, SUPABASE_URL };
const ctx = (request, params = {}) => ({ request, env, params, data: {} });

const call = async (method, path, { token, body: payload } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const request = new Request(`https://reiad.co.uk/api/comments${path}`, {
    method, headers, body: payload ? JSON.stringify(payload) : undefined,
  });
  const id = path.match(/^\/(\d+)/)?.[1];
  const res = await onRequest(ctx(request, { id: id ? [id] : [] }));
  return { status: res.status, body: await res.json() };
};

const rows = (sql) => db.prepare(sql).all();

console.log("comments");

const ayesha = await tokenFor("user-a", "Ayesha Rahman");
const rony = await tokenFor("user-b", "Rony");

/* ---------- 1. writing needs a verified reader ---------- */
{
  const out = await call("POST", "", { body: { slug: "dse-basics", body: "Hello" } });
  check("no token: refused", out.body.reason, "sign-in-required");
  check("and nothing was written", rows(`SELECT * FROM comments`).length, 0);

  const bad = await call("POST", "", {
    token: "not.a.token", body: { slug: "dse-basics", body: "Hello" },
  });
  check("a rubbish token: refused", bad.body.reason, "bad-token");
  check("still nothing written", rows(`SELECT * FROM comments`).length, 0);
}

/* ---------- 2. the author comes from the token, not the body ---------- */
{
  const out = await call("POST", "", {
    token: ayesha,
    body: {
      slug: "dse-basics", body: "A useful comment.",
      /* The attack: naming somebody else in the payload. */
      author_id: "user-b", author_name: "Rony", status: "live",
    },
  });
  okay("accepted", out.body.ok);

  const [row] = rows(`SELECT * FROM comments`);
  check("the author is the one who signed the token", row.author_id, "user-a");
  check("and so is the name", row.author_name, "Ayesha Rahman");
  check("status cannot be set from the body", row.status, "pending");
}

/* ---------- 3. pending is invisible ---------- */
{
  const out = await call("GET", "?slug=dse-basics");
  check("a pending comment shows to nobody", out.body.comments, []);

  db.prepare(`UPDATE comments SET status='live' WHERE id=1`).run();
  const after = await call("GET", "?slug=dse-basics");
  check("approved, it shows", after.body.comments.length, 1);
  check("with the author's name", after.body.comments[0].author_name, "Ayesha Rahman");
  okay("and never the author's id", after.body.comments[0].author_id === undefined);
}

/* ---------- 4. replies are one level, on the right piece ---------- */
{
  const ok1 = await call("POST", "", {
    token: rony, body: { slug: "dse-basics", body: "A reply.", parent_id: 1 },
  });
  okay("a reply to a live comment is accepted", ok1.body.ok);
  db.prepare(`UPDATE comments SET status='live' WHERE id=2`).run();

  const wrongPiece = await call("POST", "", {
    token: rony, body: { slug: "onions", body: "Smuggled.", parent_id: 1 },
  });
  check("a reply cannot point at another piece's comment", wrongPiece.body.reason, "no-such-parent");

  const deep = await call("POST", "", {
    token: rony, body: { slug: "dse-basics", body: "Deeper.", parent_id: 2 },
  });
  check("and replies do not nest twice", deep.body.reason, "replies-are-one-level");

  const thread = await call("GET", "?slug=dse-basics");
  check("the thread is one comment with one reply",
    [thread.body.comments.length, thread.body.comments[0].replies.length], [1, 1]);
}

/* ---------- 5. moderation needs the admin, not a reader ---------- */
{
  const asReader = await call("PATCH", "/1", { token: ayesha, body: { status: "binned" } });
  check("a reader cannot moderate", asReader.body.reason, "unauthorised");
  check("and the comment is untouched",
    rows(`SELECT status FROM comments WHERE id=1`)[0].status, "live");

  const queue = await call("GET", "?status=pending");
  check("nor read the queue", queue.body.reason, "unauthorised");
}

/* ---------- 6. the awkward inputs ---------- */
{
  const empty = await call("POST", "", { token: ayesha, body: { slug: "dse-basics", body: " " } });
  check("an empty comment is refused", empty.body.reason, "empty");

  const noSlug = await call("POST", "", { token: ayesha, body: { body: "Where?" } });
  check("a comment with no piece is refused", noSlug.body.reason, "slug-required");

  const nasty = await call("POST", "", {
    token: ayesha,
    body: { slug: "../../etc/passwd", body: "Traversal." },
  });
  check("a slug that is not a slug is refused", nasty.body.reason, "slug-required");

  /* Markup is stored exactly as typed, because nothing ever parses
     it. The page writes it with textContent. */
  const script = "<script>alert('x')</script> & <b>bold</b>";
  await call("POST", "", { token: ayesha, body: { slug: "onions", body: script } });
  const stored = rows(`SELECT body FROM comments WHERE slug='onions'`)[0].body;
  check("markup is kept verbatim, not mangled and not executed", stored, script);
}

console.log(failures
  ? `\n${failures} failure(s)`
  : "\nall good: the author is proven and nothing appears unapproved");
process.exit(failures ? 1 : 0);

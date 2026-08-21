/* ============================================================
   scripts/comments.test.ts: the endpoint, against real SQLite
   and real signatures.

     node scripts/comments.test.ts

   The two rules this whole stage exists to enforce are the two
   that are easiest to get subtly wrong, so they are tested
   directly rather than inferred:

     nobody posts as anybody else   the author comes from a
                                    verified token, never from the
                                    request body
     nothing appears until approved including from me

   `readerFrom()` has its own suite in reader.test.ts, which does
   the attacks. This one checks the endpoint that uses it: that it
   refuses to write without a good token, that it writes the
   author from the token rather than the body, that a pending
   comment is invisible to the public read, and that a reply
   cannot be smuggled onto a different piece.
   ============================================================ */

import { DatabaseSync } from "node:sqlite";
import { webcrypto } from "node:crypto";
import { d1Over } from "./sqlite-d1.ts";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

let failures = 0;
const check = (name: string, got: unknown, want: unknown): void => {
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
};
const okay = (name: string, cond: unknown): void => check(name, !!cond, true);

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

/* The D1 binding over it, from `sqlite-d1.ts`. Shared with the
   builders rather than stubbed here, so what this test drives is
   the interface the Worker really hands a handler. db() applies
   the schema through batch() on first use, so the migrations
   themselves are part of what this covers. */
const D1 = d1Over(db);

/* ---------- a signing key, and the JWKS behind it ---------- */

const pair = await webcrypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]
);
/* The exported JWK, widened so `kid` can be set on it. `kid` is
   optional in the spec and the lib type leaves it off, and this is
   the JWKS the stubbed fetch serves: a key with no `kid` is one
   `reader.js` cannot pick, so it is not optional here. */
const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey) as
  Record<string, unknown> & { kid?: string; alg?: string };
jwk.kid = "k1"; jwk.alg = "ES256";

const SUPABASE_URL = "https://project.supabase.co";
const b64url = (b: ArrayBuffer | Uint8Array): string =>
  Buffer.from(b as Uint8Array).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const enc = (o: unknown): string => b64url(Buffer.from(JSON.stringify(o)));

async function tokenFor(sub: string, name: string): Promise<string> {
  const head = enc({ alg: "ES256", typ: "JWT", kid: "k1" });
  const body = enc({
    sub, iss: `${SUPABASE_URL}/auth/v1`, exp: Math.floor(Date.now() / 1000) + 3600,
    email: `${sub}@example.com`, user_metadata: { full_name: name },
  });
  const sig = await webcrypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" },
    pair.privateKey, new TextEncoder().encode(`${head}.${body}`));
  return `${head}.${body}.${b64url(sig)}`;
}

globalThis.fetch = (async (url: unknown) =>
  String(url).endsWith("/auth/v1/.well-known/jwks.json")
    ? new Response(JSON.stringify({ keys: [jwk] }), { status: 200 })
    : new Response("no", { status: 404 })) as typeof fetch;

/* ---------- the handler ----------

   No stubbing of db(): the handler is given its database exactly
   the way the Worker gives it one, through `env.DB`, and the real
   db() runs the real migrations against it. So this test also
   proves the CREATE TABLE statements in _lib/db.ts are valid
   SQLite, which is the other thing that would fail in production
   and nowhere else. */
const { onRequest } = await import("../functions/api/comments/[[id]].ts");

/* A double, not a Worker. `SqliteD1` answers the one call path
   this handler takes and the context carries the three fields it
   reads, so the cast is what says so: widening `RouteContext` or
   `DbEnv` until a partial fake satisfied them would make those
   interfaces describe this test rather than the runtime. The
   three absent members, `waitUntil`, `passThroughOnException` and
   `next`, are three the comments endpoint never calls. */
const env = { DB: D1, SUPABASE_URL };
const ctx = (request: Request, params: Record<string, string[]> = {}) =>
  ({ request, env, params, data: {} } as unknown as
    Parameters<typeof onRequest>[0]);

/** What this endpoint answers, across all six of its shapes, and
    every field is optional because which of them is present is
    exactly what the checks below are about: `ok` on a write that
    was taken, `reason` on one that was refused, `comments` on a
    read. Named once so that reading a reply is reading a field
    rather than an `unknown`. */
interface Reply {
  ok?: boolean;
  reason?: string;
  comments?: Comment[];
}

interface Comment {
  id?: number;
  author_id?: string;
  author_name?: string;
  body?: string;
  replies?: Comment[];
}

const call = async (
  method: string, path: string,
  { token, body: payload }: { token?: string; body?: unknown } = {},
): Promise<{ status: number; body: Reply }> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const request = new Request(`https://reiad.co.uk/api/comments${path}`, {
    method, headers, body: payload ? JSON.stringify(payload) : undefined,
  });
  const id = path.match(/^\/(\d+)/)?.[1];
  const res = await onRequest(ctx(request, { id: id ? [id] : [] }));
  return { status: res.status, body: await res.json() as Reply };
};

/** The comments in a read, when the check expects some. A read
    that answered a refusal instead fails here with a sentence,
    rather than three lines later as "undefined has no length". */
const commentsIn = (reply: Reply): Comment[] => {
  if (!reply.comments) throw new Error(`expected comments, got ${JSON.stringify(reply)}`);
  return reply.comments;
};

/** One row of the comments table, as SQLite hands it back. */
type Row = Record<string, unknown>;
const rows = (sql: string): Row[] => db.prepare(sql).all() as Row[];

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
  const after = commentsIn((await call("GET", "?slug=dse-basics")).body);
  check("approved, it shows", after.length, 1);
  check("with the author's name", after[0].author_name, "Ayesha Rahman");
  okay("and never the author's id", after[0].author_id === undefined);
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

  const thread = commentsIn((await call("GET", "?slug=dse-basics")).body);
  check("the thread is one comment with one reply",
    [thread.length, thread[0].replies?.length], [1, 1]);
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

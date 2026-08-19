/* ============================================================
   scripts/reader.test.ts: the signature check, and the attacks.

     node scripts/reader.test.ts

   `readerFrom()` is the only thing standing between "a comment
   signed by this reader" and "a comment signed by whoever typed
   the nicest user id into a string". Its happy path is four lines
   and its value is entirely in what it REFUSES, so that is most of
   what is tested here.

   Real keys, real signatures, real WebCrypto. Nothing about the
   verification is stubbed, because a stub of a signature check is
   a test of nothing.
   ============================================================ */

import { webcrypto } from "node:crypto";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const { readerFrom, forgetKeys } = await import("../functions/_lib/reader.js");

let failures = 0;
const check = (name: string, got: unknown, want: unknown): void => {
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
};
/* `okay()` was here and nothing called it: the whole of this file
   compares a value against another, which is what `check` is for.
   The compiler is what noticed. */

/** Did it refuse, and roughly why? */
async function refuses(name: string, request: Request, env: unknown): Promise<void> {
  try {
    const who = await readerFrom(request, env);
    failures += 1;
    console.log(`  FAIL ${name}\n       it ACCEPTED and returned ${JSON.stringify(who)}`);
  } catch (err) {
    console.log(`  ok   ${name}  (${(err as Error).message})`);
  }
}

const b64url = (bytes: ArrayBuffer): string =>
  Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const bytes = (s: string): ArrayBuffer => {
  const b = Buffer.from(s);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};
const enc = (obj: unknown): string => b64url(bytes(JSON.stringify(obj)));

const SUPABASE_URL = "https://project.supabase.co";
const ISS = `${SUPABASE_URL}/auth/v1`;
const soon = () => Math.floor(Date.now() / 1000) + 3600;

/* ---------- a real ES256 key pair, and its JWKS ---------- */

const pair = await webcrypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]
);
/* The exported JWK, widened so `kid` can be set on it. `kid` is
   optional in the spec and the lib type leaves it off, and this
   is the JWKS the stubbed fetch serves: a key with no `kid` is
   one `reader.js` cannot pick, so the field is not optional
   here. */
const publicJwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey) as
  Record<string, unknown> & { kid?: string; alg?: string };
publicJwk.kid = "key-1";
publicJwk.alg = "ES256";

const other = await webcrypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]
);

async function signES(
  claims: unknown,
  { kid = "key-1", alg = "ES256", key = pair.privateKey }: {
    kid?: string; alg?: string; key?: CryptoKey;
  } = {},
): Promise<string> {
  const head = enc({ alg, typ: "JWT", kid });
  const body = enc(claims);
  const sig = await webcrypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, key,
    new TextEncoder().encode(`${head}.${body}`)
  );
  return `${head}.${body}.${b64url(sig)}`;
}

/* The network, replaced by exactly one answer. */
/** Every URL the code under test asked for, so a check can say
    it went to the network once rather than per request. */
const served: string[] = [];
globalThis.fetch = (async (url: unknown) => {
  served.push(String(url));
  if (String(url).endsWith("/auth/v1/.well-known/jwks.json")) {
    return new Response(JSON.stringify({ keys: [publicJwk] }),
      { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response("no", { status: 404 });
}) as typeof fetch;

const env = { SUPABASE_URL };
const req = (token?: string): Request => new Request("https://reiad.co.uk/api/comments", {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

console.log("verifying a reader");

/* ---------- 1. the happy path ---------- */
{
  forgetKeys();
  const token = await signES({
    sub: "user-123", email: "reader@example.com", iss: ISS, exp: soon(),
    user_metadata: { full_name: "Ayesha Rahman" },
  });
  const who = await readerFrom(req(token), env);
  check("a properly signed token is accepted", who?.id, "user-123");
  check("and carries the name", who?.name, "Ayesha Rahman");
  check("and the email", who?.email, "reader@example.com");
}

/* ---------- 2. no token is not an error ---------- */
{
  check("no Authorization header is simply nobody", await readerFrom(req(), env), null);
  check("an empty Bearer is nobody too",
    await readerFrom(new Request("https://x/", { headers: { Authorization: "Bearer " } }), env), null);
}

/* ---------- 3. the attacks ---------- */
console.log("\n  refusing what it must refuse");
{
  // alg: none, the classic.
  const head = enc({ alg: "none", typ: "JWT" });
  const body = enc({ sub: "admin", iss: ISS, exp: soon() });
  await refuses("alg: none", req(`${head}.${body}.`), env);
  await refuses("alg: none with a signature attached", req(`${head}.${body}.aaaa`), env);

  // A valid token, signed by somebody else's key.
  const forged = await signES({ sub: "user-123", iss: ISS, exp: soon() }, { key: other.privateKey });
  await refuses("a signature from the wrong key", req(forged), env);

  // The payload edited after signing, which is the whole point.
  const good = await signES({ sub: "user-123", iss: ISS, exp: soon() });
  const [h, , s] = good.split(".");
  const tampered = `${h}.${enc({ sub: "somebody-else", iss: ISS, exp: soon() })}.${s}`;
  await refuses("a payload swapped under a good signature", req(tampered), env);

  // Expired, and not-yet-valid.
  await refuses("an expired token",
    req(await signES({ sub: "u", iss: ISS, exp: Math.floor(Date.now() / 1000) - 120 })), env);
  await refuses("a token that is not valid yet",
    req(await signES({ sub: "u", iss: ISS, exp: soon(), nbf: soon() })), env);

  // Somebody else's project.
  await refuses("a token from another issuer",
    req(await signES({ sub: "u", iss: "https://someone-else.supabase.co/auth/v1", exp: soon() })), env);

  // A key we have never heard of.
  await refuses("an unknown kid",
    req(await signES({ sub: "u", iss: ISS, exp: soon() }, { kid: "not-a-key" })), env);

  // Shapes that are not tokens.
  await refuses("two segments", req("aaa.bbb"), env);
  await refuses("not base64 at all", req("!!!.???.###"), env);
  await refuses("no subject claim", req(await signES({ iss: ISS, exp: soon() })), env);

  // HS256 with no secret configured must refuse, not fall through.
  const hsHead = enc({ alg: "HS256", typ: "JWT" });
  const hsBody = enc({ sub: "u", iss: ISS, exp: soon() });
  await refuses("HS256 with no secret set", req(`${hsHead}.${hsBody}.aaaa`), env);
}

/* ---------- 4. HS256, when the secret IS set ---------- */
console.log("\n  HS256, for older projects");
{
  const secret = "a-long-enough-shared-secret-for-testing";
  const key = await webcrypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]
  );
  const head = enc({ alg: "HS256", typ: "JWT" });
  const body = enc({ sub: "old-user", iss: ISS, exp: soon() });
  const sig = await webcrypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${head}.${body}`));
  const token = `${head}.${body}.${b64url(sig)}`;

  const hsEnv = { SUPABASE_URL, SUPABASE_JWT_SECRET: secret };
  const who = await readerFrom(req(token), hsEnv);
  check("a correctly signed HS256 token is accepted", who?.id, "old-user");

  await refuses("but not with the wrong secret",
    req(token), { SUPABASE_URL, SUPABASE_JWT_SECRET: "not-the-secret" });
}

/* ---------- 5. the keys are fetched once ---------- */
console.log("\n  and it does not hammer the network");
{
  forgetKeys();
  served.length = 0;
  const token = await signES({ sub: "u", iss: ISS, exp: soon() });
  for (let i = 0; i < 5; i += 1) await readerFrom(req(token), env);
  check("five verifications, one JWKS fetch",
    served.filter((u) => u.includes("jwks")).length, 1);
}

console.log(failures
  ? `\n${failures} failure(s)`
  : "\nall good: identity is checked, not taken on trust");
process.exit(failures ? 1 : 0);

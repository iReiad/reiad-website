#!/usr/bin/env node
/* ============================================================
   drive.test.mjs: the service account's half of `_lib/drive.ts`,
   and the ticket beside it.

       node functions/_lib/drive.test.mjs

   ---- what this can and cannot check ----

   It cannot ask Google anything, and it is not trying to. What it
   checks is the part that is this repository's to get wrong: a
   JWT that Google will accept has to be a real RS256 signature
   over the exact bytes of `header.claims`, and every step of
   producing one is a chance to get base64url, PEM parsing or the
   signed message wrong in a way that reads perfectly.

   None of those fail loudly. A bad signature comes back from
   Google as `invalid_grant`, which is the same thing it says when
   a clock is wrong or a key has been deleted, so the first guess
   is always the credential and never the code.

   So: a real RSA key is generated here, the module's own
   `pemToDer` and signing path are driven, and the signature is
   verified with the public half. If that passes, what is left
   between this and a working token is Google's side.

   The ticket is checked the same way: it is an HMAC this
   repository invented, so nothing else in the world will tell us
   it is wrong.
   ============================================================ */

import { generateKeyPairSync } from "node:crypto";
import { accessToken, canReachDrive, forgetToken } from "./drive.ts";
import { canTicket, checkTicket, mintTicket } from "./ticket.ts";

let bad = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "  ok " : "FAIL"}  ${name}${cond ? "" : `\n        ${detail}`}`);
  if (!cond) bad += 1;
};

/* A throwaway key pair, so this needs no secret and no network. */
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const ENV = { GOOGLE_SA_EMAIL: "course-reader@example.iam.gserviceaccount.com",
  GOOGLE_SA_KEY: privateKey };

/* ============================================================ */

console.log("\n--- is the credential there at all ---");

ok("no secrets, no Drive", !canReachDrive({}));
ok("half the secrets is still no Drive",
  !canReachDrive({ GOOGLE_SA_EMAIL: ENV.GOOGLE_SA_EMAIL }));
ok("both, and it is connected", canReachDrive(ENV));
ok("with no credential the token is null, not a throw",
  await accessToken({}) === null);

/* ============================================================
   The assertion, caught on its way out
   ============================================================ */

console.log("\n--- the JWT it signs ---");

let sent = null;
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  sent = { url: String(url), body: String(init?.body ?? "") };
  return {
    ok: true,
    status: 200,
    json: async () => ({ access_token: "an-access-token", expires_in: 3600 }),
    text: async () => "",
  };
};

forgetToken();
const token = await accessToken(ENV);

ok("it returns the access token Google gave it", token === "an-access-token");
ok("it asks Google's token endpoint",
  sent?.url === "https://oauth2.googleapis.com/token", sent?.url);

const form = new URLSearchParams(sent.body);
ok("with the JWT bearer grant",
  form.get("grant_type") === "urn:ietf:params:oauth:grant-type:jwt-bearer",
  form.get("grant_type"));

const jwt = form.get("assertion") ?? "";
const [head64, claims64, sig64] = jwt.split(".");
ok("and an assertion in three parts", Boolean(head64 && claims64 && sig64));

const fromB64url = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
const header = JSON.parse(fromB64url(head64).toString());
const claims = JSON.parse(fromB64url(claims64).toString());

ok("signed RS256", header.alg === "RS256", JSON.stringify(header));
ok("issued by the service account", claims.iss === ENV.GOOGLE_SA_EMAIL);
ok("for the token endpoint", claims.aud === "https://oauth2.googleapis.com/token");
ok("asking only to read",
  claims.scope === "https://www.googleapis.com/auth/drive.readonly", claims.scope);
ok("and it expires", claims.exp > claims.iat && claims.exp - claims.iat <= 3600,
  `iat ${claims.iat} exp ${claims.exp}`);

/* The one that actually matters: is the signature real, over the
   exact bytes Google will verify? */
const verified = await crypto.subtle.verify(
  "RSASSA-PKCS1-v1_5",
  await crypto.subtle.importKey(
    "spki",
    (() => {
      const body = publicKey.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
      return Buffer.from(body, "base64");
    })(),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  ),
  fromB64url(sig64),
  new TextEncoder().encode(`${head64}.${claims64}`),
);

ok("the signature verifies against the public key", verified,
  "Google would answer invalid_grant, which reads as a bad credential");

/* ---- the shape the key arrives in ---- */

console.log("\n--- the key, however it was pasted ---");

forgetToken();
const escaped = { ...ENV, GOOGLE_SA_KEY: privateKey.replace(/\n/g, "\\n") };
ok("a key with literal backslash-n still works",
  await accessToken(escaped) === "an-access-token",
  "that is the form you get copying private_key out of the JSON");

/* ---- the cache ---- */

console.log("\n--- one exchange per isolate ---");

forgetToken();
await accessToken(ENV);
sent = null;
await accessToken(ENV);
ok("a second call does not exchange again", sent === null);

/* Only that an exchange happened, not that the assertion differs:
   two JWTs minted in the same second are byte for byte the same,
   because `iat` and `exp` are whole seconds. Comparing them was a
   test that would pass or fail on how fast the machine was. */
forgetToken();
await accessToken(ENV);
ok("and forgetting it exchanges again", sent !== null);

globalThis.fetch = realFetch;

/* ============================================================
   The ticket
   ============================================================ */

console.log("\n--- the pass a <video> carries ---");

const FILE = "1_IKISVsSY37Razzt-6GUPdj1-aD7Jozz";
const OTHER = "1xvZxgk22McGmBRU7zQKsIc43-OnKPFE2";

ok("no key, no tickets", !canTicket({}));
ok("the service account key is the key", canTicket(ENV));

const pass = await mintTicket(ENV, FILE);
ok("a ticket is minted", Boolean(pass));
ok("it opens the file it names", await checkTicket(ENV, FILE, pass));
ok("it does NOT open another file", !await checkTicket(ENV, OTHER, pass),
  "one pass for every lesson would be the whole course");
ok("a missing ticket opens nothing", !await checkTicket(ENV, FILE, null));
ok("a forged signature opens nothing",
  !await checkTicket(ENV, FILE, `${Date.now() + 60000}.notasignature`));
ok("a ticket from a different key opens nothing",
  !await checkTicket({ GOOGLE_SA_KEY: "some other key" }, FILE, pass));

const stale = `${Date.now() - 1000}.${(await mintTicket(ENV, FILE)).split(".")[1]}`;
ok("an expired ticket opens nothing", !await checkTicket(ENV, FILE, stale));
ok("and nonsense opens nothing",
  !await checkTicket(ENV, FILE, "rubbish") && !await checkTicket(ENV, FILE, ""));

/* ============================================================ */

console.log(bad ? `\n${bad} check(s) failed.\n` : "\nAll checks passed.\n");
process.exit(bad ? 1 : 0);

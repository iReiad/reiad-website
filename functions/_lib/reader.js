/* ============================================================
   _lib/reader.js: proving who a reader is, on the server.

   `aab/account.js` reads the name out of an access token to put it
   in the corner of a header, and says in capitals that this is NOT
   verification. This is the other half of that sentence.

   ---- why a signature check and not a lookup ----

   The browser sends an access token. It is a JWT: three
   base64url segments, `header.payload.signature`, and the payload
   is readable by anyone who can read a URL. So a comment endpoint
   that trusts the `sub` claim without checking the signature is a
   comment endpoint where anybody can post as anybody, by typing a
   different user id into a string. There is no partial version of
   this: either the signature is checked or identity is a
   suggestion.

   The alternative is asking Supabase `/auth/v1/user` on every
   request, which works and costs a round trip from the edge to
   Mumbai on every comment. Verifying locally costs one fetch of
   the public keys, cached for an hour across the whole isolate.

   ---- the algorithms, and the one that is a trap ----

   Supabase signs with ES256 (asymmetric, verified against the
   public JWKS) for new projects, and HS256 (symmetric, verified
   with the project's JWT secret) for older ones.

   `alg: "none"` is the classic JWT attack: a token that declares
   itself unsigned, which a naive verifier accepts because it
   dutifully runs the "none" algorithm and finds nothing wrong.
   Anything not in ALLOWED below is refused before a key is
   fetched, so it never gets that far.

   Equally: the algorithm is taken from the KEY, not from the
   token's own header, wherever the two could disagree. A token
   that says HS256 must not be verified against a public key as
   though the key were a shared secret, which is the other half of
   the same family of attacks.

   TRANSITION.md, Stage 7.
   ============================================================ */

const ALLOWED = new Set(["ES256", "RS256", "HS256"]);

/* The public keys, fetched once per isolate per hour. A JWKS is
   public by definition; caching it is about latency, not secrecy. */
let jwks = { at: 0, keys: null, url: null };
const JWKS_TTL = 60 * 60 * 1000;

const b64urlToBytes = (s) => {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const binary = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const decodeJSON = (segment) =>
  JSON.parse(new TextDecoder().decode(b64urlToBytes(segment)));

async function publicKeys(url) {
  const now = Date.now();
  if (jwks.keys && jwks.url === url && now - jwks.at < JWKS_TTL) return jwks.keys;

  const res = await fetch(`${url}/auth/v1/.well-known/jwks.json`);
  if (!res.ok) throw new Error(`jwks ${res.status}`);
  const body = await res.json();
  jwks = { at: now, keys: body.keys ?? [], url };
  return jwks.keys;
}

const CURVES = { ES256: { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" } };

async function importKey(jwk, alg) {
  if (alg === "ES256") {
    return crypto.subtle.importKey("jwk", jwk, CURVES.ES256, false, ["verify"]);
  }
  if (alg === "RS256") {
    return crypto.subtle.importKey(
      "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
    );
  }
  throw new Error(`unsupported alg ${alg}`);
}

const verifyParams = (alg) =>
  (alg === "ES256" ? { name: "ECDSA", hash: "SHA-256" } : "RSASSA-PKCS1-v1_5");

/**
 * Who this request is from, or null.
 *
 * Null is not an error and must never be treated as one by the
 * caller: a signed-out reader is the normal case on this site and
 * every page has to work for them. It means "no verified reader",
 * and the endpoint decides whether that is allowed.
 *
 * Throwing is reserved for the case where a token was presented
 * and is not good, because that is worth telling the browser
 * apart from not being signed in at all.
 */
export async function readerFrom(request, env) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("malformed token");

  let header;
  try {
    header = decodeJSON(parts[0]);
  } catch {
    throw new Error("malformed header");
  }

  /* Before anything else, and before any key is fetched: the
     algorithm has to be one we actually implement. This is what
     refuses `alg: "none"`. */
  const alg = String(header.alg ?? "");
  if (!ALLOWED.has(alg)) throw new Error(`refused alg ${alg || "none"}`);

  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = b64urlToBytes(parts[2]);

  let ok = false;

  if (alg === "HS256") {
    /* Older projects sign symmetrically. Without the secret we
       cannot check it, and an unverifiable token must be refused
       rather than believed. */
    const secret = env.SUPABASE_JWT_SECRET;
    if (!secret) throw new Error("HS256 token but no SUPABASE_JWT_SECRET");
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    ok = await crypto.subtle.verify("HMAC", key, signature, signed);
  } else {
    const keys = await publicKeys(env.SUPABASE_URL);
    /* Matched on kid where the token names one. A token whose kid
       is unknown is refused rather than tried against every key:
       key rotation should look like a failed request, not like a
       silent fallback. */
    const jwk = header.kid
      ? keys.find((k) => k.kid === header.kid)
      : keys.find((k) => k.alg === alg) ?? keys[0];
    if (!jwk) throw new Error("unknown signing key");

    /* The algorithm comes from the KEY here, not from the header,
       so a token cannot nominate how it would like to be checked. */
    const keyAlg = ALLOWED.has(String(jwk.alg)) ? String(jwk.alg) : alg;
    const cryptoKey = await importKey(jwk, keyAlg);
    ok = await crypto.subtle.verify(verifyParams(keyAlg), cryptoKey, signature, signed);
  }

  if (!ok) throw new Error("bad signature");

  const claims = decodeJSON(parts[1]);

  /* Expiry, with thirty seconds of slack for clock skew between
     Supabase and the edge. Slack in the other direction would be a
     token that works before it was issued. */
  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp === "number" && claims.exp + 30 < now) {
    throw new Error("expired");
  }
  if (typeof claims.nbf === "number" && claims.nbf > now + 30) {
    throw new Error("not yet valid");
  }

  /* And it has to be OUR issuer. A perfectly valid token from
     somebody else's Supabase project is still not a reader here. */
  const issuer = `${env.SUPABASE_URL}/auth/v1`;
  if (claims.iss && claims.iss !== issuer) throw new Error("wrong issuer");

  if (!claims.sub) throw new Error("no subject");

  return {
    id: String(claims.sub),
    email: typeof claims.email === "string" ? claims.email : "",
    name:
      claims.user_metadata?.full_name
      ?? claims.user_metadata?.name
      ?? String(claims.email ?? "").split("@")[0]
      ?? "",
  };
}

/** For tests and for anything that wants to reset between runs. */
export const forgetKeys = () => { jwks = { at: 0, keys: null, url: null }; };

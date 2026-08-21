/* ============================================================
   /api/auth/*, setup, login, logout, me

   GET  /api/auth/params                 → { configured, scheme, salt, iterations }
   POST /api/auth/setup   { salt, iterations, dk }   once, when nothing is set
   POST /api/auth/login   { dk }         → HttpOnly session cookie
   POST /api/auth/logout
   POST /api/auth/revoke                 admin: every other device out
   GET  /api/auth/me                     → { configured, signedIn }

   `dk` is PBKDF2-SHA256(passphrase, salt, iterations), derived in
   the browser. It has to be: 210,000 iterations costs about 30ms
   of CPU and a Worker on the free plan gets 10ms per request, so
   deriving it here got the request killed every time. See the long
   note at the top of _lib/auth.ts for why this gives up nothing.
   ============================================================ */

import { db, setting } from "../../_lib/db.ts";
import type { DbEnv } from "../../_lib/db.ts";
import { body, fail, methods, notConfigured, ok, str } from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";
import {
  ADMIN_KEY, CLIENT_ITERATIONS, createSession, destroySession, isConfigured,
  isKey, isSalt, isSecure, keyParams, newSalt, readSession, requireAdmin,
  sessionCookie, setAdminKey, throttle, verifyKey, verifyPassword,
} from "../../_lib/auth.ts";

/* D1 and nothing else. The passphrase is a row in `settings` and a
   session is a row in `sessions`, so there is no secret to bind. */
export async function onRequest(
  context: RouteContext<DbEnv, { route?: string[] }>,
): Promise<Response> {
  const action = (context.params.route ?? [])[0] ?? "me";
  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  switch (action) {
    /* ---------- who am I ---------- */
    case "me":
      return methods(context.request, {
        GET: async () =>
          ok({
            configured: await isConfigured(d1),
            signedIn: !!(await readSession(context)),
          }),
      });

    /* ---------- what the browser needs before it can derive ----------
       On a fresh Studio there is nothing stored yet, so the server
       hands out a new salt; the browser derives over it and sends it
       straight back to be saved alongside the verifier. */
    case "params":
      return methods(context.request, {
        GET: async () => {
          const stored = await setting(d1, ADMIN_KEY);
          if (!stored) {
            return ok({ configured: false, scheme: "pbkdf2c", salt: newSalt(), iterations: CLIENT_ITERATIONS });
          }
          const { scheme, salt, iterations } = keyParams(stored);
          return ok({ configured: true, scheme, salt, iterations });
        },
      });

    /* ---------- first run ---------- */
    case "setup":
      return methods(context.request, {
        POST: async () => {
          // Only ever allowed while no password exists. After that
          // this endpoint is permanently closed.
          if (await isConfigured(d1)) return fail("already-configured", 409);

          const input = await body(context.request);
          const salt = str(input.salt, 64);
          const dk = str(input.dk, 128);
          const iterations = Number(input.iterations);

          // The passphrase itself never arrives here, so its length is
          // the browser's business. What the server can insist on is
          // that the derivation was actually expensive.
          if (!isSalt(salt)) return fail("bad-salt");
          if (!isKey(dk)) return fail("bad-key");
          if (!Number.isInteger(iterations) || iterations < 100_000) return fail("weak-iterations");

          await setAdminKey(d1, { salt, iterations, dk });
          const token = await createSession(d1, "setup");
          return ok({ signedIn: true }, { "Set-Cookie": sessionCookie(token, { secure: isSecure(context.request) }) });
        },
      });

    /* ---------- login ---------- */
    case "login":
      return methods(context.request, {
        POST: async () => {
          if (await throttle(context, "login", 12, 15)) {
            return fail("too-many-attempts", 429);
          }
          const stored = await setting(d1, ADMIN_KEY);
          if (!stored) return fail("not-configured", 409);

          const input = await body(context.request);

          // A database written by an older deploy still holds a
          // server-side hash. Verifying it may well exceed the CPU
          // limit, but failing to try would lock that Studio out
          // permanently, which is worse.
          const good = keyParams(stored).scheme === "pbkdf2c"
            ? await verifyKey(str(input.dk, 128), stored)
            : await verifyPassword(str(input.password, 200), stored);

          if (!good) return fail("bad-password", 401);

          const token = await createSession(d1, "login");
          return ok({ signedIn: true }, { "Set-Cookie": sessionCookie(token, { secure: isSecure(context.request) }) });
        },
      });

    /* ---------- logout ---------- */
    case "logout":
      return methods(context.request, {
        POST: async () => {
          await destroySession(context);
          return ok({ signedIn: false }, { "Set-Cookie": sessionCookie("", { clear: true, secure: isSecure(context.request) }) });
        },
      });

    /* ---------- sign every other device out ---------- */
    case "revoke":
      return methods(context.request, {
        POST: async () => {
          const guard = await requireAdmin(context);
          if (guard) return guard;
          await d1.prepare(`DELETE FROM sessions`).run();
          return ok({ signedIn: false }, { "Set-Cookie": sessionCookie("", { clear: true, secure: isSecure(context.request) }) });
        },
      });

    default:
      return fail("unknown-action", 404);
  }
}

// A cookie-authenticated API must never be cached anywhere.
export const config = { runtime: "edge" };

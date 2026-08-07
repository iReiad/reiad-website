/* ============================================================
   /api/auth/*  — setup, login, logout, me

   POST /api/auth/setup   { password }   once, when nothing is set
   POST /api/auth/login   { password }   → HttpOnly session cookie
   POST /api/auth/logout
   GET  /api/auth/me                     → { configured, signedIn }
   ============================================================ */

import { db } from "../../_lib/db.js";
import { body, fail, methods, notConfigured, ok, str } from "../../_lib/http.js";
import {
  createSession, destroySession, isConfigured, isSecure, readSession,
  requireAdmin, sessionCookie, setAdminPassword, throttle, verifyPassword,
} from "../../_lib/auth.js";
import { setting } from "../../_lib/db.js";
import { ADMIN_KEY } from "../../_lib/auth.js";

export async function onRequest(context) {
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

    /* ---------- first run ---------- */
    case "setup":
      return methods(context.request, {
        POST: async () => {
          // Only ever allowed while no password exists. After that
          // this endpoint is permanently closed.
          if (await isConfigured(d1)) return fail("already-configured", 409);

          const password = str((await body(context.request)).password, 200);
          if (password.length < 12) return fail("password-too-short");

          await setAdminPassword(d1, password);
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

          const password = str((await body(context.request)).password, 200);
          if (!(await verifyPassword(password, stored))) {
            return fail("bad-password", 401);
          }
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

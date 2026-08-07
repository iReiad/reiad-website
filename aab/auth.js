/* ============================================================
   auth.js — the Studio's front door.

   This used to do the checking itself, in the browser, and I was
   careful to describe that honestly: with no server there was
   nothing to verify against, so it kept the tool away from
   passers-by and no more.

   There is a server now. This file no longer decides anything —
   it collects a passphrase, hands it to /api/auth, and shows what
   comes back. The password is checked server-side against a
   PBKDF2 hash, the session lives in an HttpOnly cookie this code
   cannot read, and every admin endpoint re-checks it. The lock is
   real, and the code that enforces it is not shipped to visitors.

   If the database isn't connected yet, it falls back to the old
   browser-side gate so the Studio still opens on a purely static
   deployment — with a line on screen saying which mode you're in.
   ============================================================ */

import { auth } from "/api.js";
import { AUTH } from "/auth-config.js";

const KEY_LOCAL = "studio-unlocked-local";

/* ============================================================
   The lock screen
   ============================================================ */

function screen({ mode, server }) {
  const setup = mode === "setup";

  const wrap = document.createElement("div");
  wrap.className = "gate";
  wrap.innerHTML = `
    <div class="gate-card">
      <span class="lock" aria-hidden="true">${setup ? "✦" : "⌘"}</span>
      <h1>${setup ? "Set up Studio access" : "Is this you?"}</h1>
      <p>${setup
        ? "Nobody has claimed this Studio yet. Choose a passphrase — it's hashed and stored on the server, never in the page."
        : "The Article Studio is private. Sign in to write, publish and read what the site has collected."}</p>

      <form id="gate-form" autocomplete="on">
        <label class="visually-hidden" for="gate-pass">Passphrase</label>
        <input type="password" id="gate-pass" name="password" placeholder="Passphrase"
               autocomplete="${setup ? "new-password" : "current-password"}" required
               minlength="${setup ? 12 : 1}" autofocus>
        ${setup ? `
          <input type="password" id="gate-pass2" placeholder="Passphrase again"
                 autocomplete="new-password" required minlength="12">
          <p class="gate-fine" style="border:0;padding:0">Twelve characters minimum. A short
             sentence you'll remember beats a mangled word.</p>` : ""}
        <button class="btn btn-solid" type="submit" id="gate-go">
          ${setup ? "Create access" : "Sign in"}
        </button>
      </form>

      <p class="gate-msg mono" id="gate-msg" role="status" aria-live="polite"></p>

      <p class="gate-fine">${server
        ? "Checked on the server: your passphrase is compared against a PBKDF2-SHA256 "
          + "hash, and the session is an HttpOnly cookie this page cannot read. Wrong "
          + "guesses are rate-limited."
        : "The database isn't connected yet, so this check is running in your browser — "
          + "it keeps the Studio away from passers-by, but it is not a vault. Connect D1 "
          + "(see wrangler.toml) and this becomes a real server-side login."}</p>
    </div>`;
  return wrap;
}

/* ============================================================
   Fallback: the old browser-side check, for a static deployment
   ============================================================ */

const enc = new TextEncoder();
const toB64 = (b) => btoa(String.fromCharCode(...new Uint8Array(b)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveLocal(passphrase, salt, iterations) {
  const base = await crypto.subtle.importKey(
    "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveBits"]);
  return toB64(await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" }, base, 256));
}

async function checkLocal(passphrase) {
  if (!AUTH.configured) return null;                 // nothing to check against
  const hash = await deriveLocal(passphrase, fromB64(AUTH.salt), AUTH.iterations);
  return hash === AUTH.hash;
}

/* ============================================================
   Entry point
   ============================================================ */

export function requireOwner(protectedRoot) {
  return new Promise(async (resolve) => {
    const me = await auth.me();
    const server = !!me?.ok;

    // Already signed in, either way?
    if (server && me.signedIn) return resolve({ server: true });
    if (!server && sessionStorage.getItem(KEY_LOCAL) === "1") return resolve({ server: false });

    const mode = server
      ? (me.configured ? "signin" : "setup")
      : (AUTH.configured ? "signin" : "setup");

    protectedRoot.hidden = true;
    const gate = screen({ mode, server });
    protectedRoot.before(gate);

    const msg = gate.querySelector("#gate-msg");
    const form = gate.querySelector("#gate-form");
    const say = (text, cls = "") => {
      msg.textContent = text;
      msg.className = `gate-msg mono ${cls}`;
    };

    const letIn = () => {
      gate.remove();
      protectedRoot.hidden = false;
      resolve({ server });
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pass = gate.querySelector("#gate-pass").value;
      const go = gate.querySelector("#gate-go");
      go.disabled = true;

      try {
        if (mode === "setup" && gate.querySelector("#gate-pass2")?.value !== pass) {
          say("Those two don't match.", "err");
          return;
        }
        say("Checking…");

        /* ---------- the real path ---------- */
        if (server) {
          const result = mode === "setup" ? await auth.setup(pass) : await auth.login(pass);
          if (result?.ok) return letIn();
          const reason = result?.reason ?? "unreachable";
          say({
            "password-too-short": "Twelve characters minimum.",
            "bad-password": "Not quite. Try again.",
            "too-many-attempts": "Too many tries — wait a few minutes.",
            "already-configured": "Already set up — sign in instead.",
          }[reason] ?? "Couldn't reach the server.", "err");
          if (reason === "already-configured") setTimeout(() => location.reload(), 1200);
          return;
        }

        /* ---------- the static fallback ---------- */
        if (mode === "setup") {
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const hash = await deriveLocal(pass, salt, AUTH.iterations);
          sessionStorage.setItem(KEY_LOCAL, "1");
          say("Unlocked here. Connect the database for a real login.", "ok");
          console.info("auth-config.js block:\n" +
            `export const AUTH = {\n  configured: true,\n  salt: ${JSON.stringify(toB64(salt))},\n` +
            `  hash: ${JSON.stringify(hash)},\n  iterations: ${AUTH.iterations},\n` +
            `  rememberDays: ${AUTH.rememberDays},\n  label: ${JSON.stringify(AUTH.label)},\n};`);
          setTimeout(letIn, 500);
          return;
        }
        if (await checkLocal(pass)) {
          sessionStorage.setItem(KEY_LOCAL, "1");
          return letIn();
        }
        say("Not quite. Try again.", "err");
      } finally {
        go.disabled = false;
      }
    });
  });
}

/** Sign out — server session if there is one, local flag either way. */
export async function lock() {
  sessionStorage.removeItem(KEY_LOCAL);
  localStorage.removeItem("studio-unlocked");
  await auth.logout();
  location.reload();
}

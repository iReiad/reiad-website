/* ============================================================
   auth.js — the Studio's "is this actually you?" gate.

   Two ways in:

     PASSKEY   Face ID, Touch ID, Windows Hello, a security key.
               Registered once per device with WebAuthn; after
               that, unlocking is a fingerprint. The private key
               never leaves the device's secure hardware.

     PASSPHRASE  The fallback, and what you use on a new device
               before it has a passkey. Put through PBKDF2-
               SHA256 600,000 times and compared to the hash
               committed in auth-config.js — the passphrase
               itself is never stored anywhere.

   Wrong guesses back off exponentially, so guessing is slow.

   The honest limit: a static site has no server, so this check
   happens in the visitor's browser and the page's code is
   public, like every static site's. It's a real lock on the
   door of a glass house — it stops people wandering in, it
   isn't a vault. Nothing confidential should live behind it.
   ============================================================ */

import { AUTH } from "/auth-config.js";

const KEY_SESSION = "studio-unlocked";
const KEY_CRED = "studio-passkey-id";
const KEY_FAILS = "studio-fails";
const ENC = new TextEncoder();

/* ---------- passphrase hashing ---------- */

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function derive(passphrase, salt, iterations) {
  const base = await crypto.subtle.importKey(
    "raw", ENC.encode(passphrase), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" }, base, 256
  );
  return toB64(bits);
}

/** Compare without leaking where the first difference is. */
function sameSecret(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---------- session ---------- */

function grant(days) {
  const until = Date.now() + days * 864e5;
  sessionStorage.setItem(KEY_SESSION, "1");
  if (days > 0) localStorage.setItem(KEY_SESSION, String(until));
  localStorage.removeItem(KEY_FAILS);
}

function isUnlocked() {
  if (sessionStorage.getItem(KEY_SESSION) === "1") return true;
  const until = Number(localStorage.getItem(KEY_SESSION) ?? 0);
  if (until > Date.now()) return true;
  localStorage.removeItem(KEY_SESSION);
  return false;
}

export function lock() {
  sessionStorage.removeItem(KEY_SESSION);
  localStorage.removeItem(KEY_SESSION);
  location.reload();
}

/* ---------- lockout after wrong guesses ---------- */

function failDelay() {
  const fails = Number(localStorage.getItem(KEY_FAILS) ?? 0);
  return Math.min(30000, fails ? 2 ** (fails - 1) * 500 : 0);
}
const noteFail = () =>
  localStorage.setItem(KEY_FAILS, String(Number(localStorage.getItem(KEY_FAILS) ?? 0) + 1));

/* ---------- passkeys (WebAuthn) ---------- */

const passkeySupported = () =>
  !!window.PublicKeyCredential && location.protocol === "https:";

async function registerPasskey() {
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: { name: AUTH.label, id: location.hostname },
      user: {
        id: ENC.encode("studio-owner"),
        name: "studio",
        displayName: AUTH.label,
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
      authenticatorSelection: {
        userVerification: "required",       // biometrics or PIN, not just presence
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    },
  });
  localStorage.setItem(KEY_CRED, toB64(cred.rawId));
  return true;
}

async function usePasskey() {
  const stored = localStorage.getItem(KEY_CRED);
  await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rpId: location.hostname,
      userVerification: "required",
      timeout: 60000,
      allowCredentials: stored
        ? [{ type: "public-key", id: fromB64(stored) }]
        : [],
    },
  });
  // The device verified the human. With no server there's no signature to
  // check, so this confirms "the person holding this device passed its
  // biometric check" — which is exactly what the gate is for.
  return true;
}

/* ============================================================
   The lock screen
   ============================================================ */

function screen({ mode }) {
  const setup = mode === "setup";

  const wrap = document.createElement("div");
  wrap.className = "gate";
  wrap.innerHTML = `
    <div class="gate-card">
      <span class="lock" aria-hidden="true">${setup ? "✦" : "⌘"}</span>
      <h1>${setup ? "Set up Studio access" : "Is this you?"}</h1>
      <p>${setup
        ? "Nobody has claimed this Studio yet. Choose a passphrase and I'll give you the line to commit — after that, this screen asks for it."
        : "The Article Studio is a private tool. Unlock it with your passphrase, or with this device if you've added a passkey."}</p>

      ${!setup && passkeySupported() && localStorage.getItem(KEY_CRED) ? `
        <button class="btn btn-solid" id="gate-passkey">Unlock with this device</button>
        <span class="gate-or">or</span>` : ""}

      <form id="gate-form" autocomplete="on">
        <label class="visually-hidden" for="gate-pass">Passphrase</label>
        <input type="password" id="gate-pass" name="password" placeholder="Passphrase"
               autocomplete="${setup ? "new-password" : "current-password"}" required
               minlength="${setup ? 12 : 1}" autofocus>
        ${setup ? `
          <input type="password" id="gate-pass2" placeholder="Passphrase again"
                 autocomplete="new-password" required minlength="12">
          <p class="gate-fine" style="border:0;padding:0">Twelve characters minimum. A short
             sentence you'll remember beats a mangled word.</p>` : `
          <label class="row-flex" style="font-size:0.84rem;color:var(--ink-soft)">
            <input type="checkbox" id="gate-remember" checked style="width:auto">
            Stay unlocked on this device for ${AUTH.rememberDays} days
          </label>`}
        <button class="btn btn-solid" type="submit" id="gate-go">
          ${setup ? "Create access" : "Unlock"}
        </button>
      </form>

      <p class="gate-msg mono" id="gate-msg" role="status" aria-live="polite"></p>

      <p class="gate-fine">
        This gate runs in your browser — a static site has no server to ask.
        It keeps the Studio private from visitors and search engines; it is not
        a vault, so don't keep secrets here. Everything you write in the Studio
        stays on this device either way.
      </p>
    </div>`;
  return wrap;
}

function sheet(title, body) {
  const dialog = document.createElement("dialog");
  dialog.className = "sheet";
  dialog.innerHTML = `
    <div class="pane-bar">
      <span class="mono">${title}</span>
      <button class="icon-btn push" id="s-copy">Copy</button>
      <button class="icon-btn" id="s-close" aria-label="Close">✕</button>
    </div>
    <div class="sheet-body"><pre></pre></div>`;
  dialog.querySelector("pre").textContent = body;
  document.body.append(dialog);
  dialog.querySelector("#s-close").onclick = () => dialog.close();
  dialog.querySelector("#s-copy").onclick = () =>
    navigator.clipboard.writeText(body).catch(() => {});
  dialog.showModal();
  return dialog;
}

/* ============================================================
   Entry point: resolves once the visitor is allowed in.
   ============================================================ */
export function requireOwner(protectedRoot) {
  return new Promise((resolve) => {
    if (isUnlocked()) return resolve(true);

    protectedRoot.hidden = true;
    const mode = AUTH.configured ? "unlock" : "setup";
    const gate = screen({ mode });
    protectedRoot.before(gate);

    const msg = gate.querySelector("#gate-msg");
    const form = gate.querySelector("#gate-form");
    const say = (text, cls = "") => { msg.textContent = text; msg.className = `gate-msg mono ${cls}`; };

    const letIn = async () => {
      gate.remove();
      protectedRoot.hidden = false;
      resolve(true);
      // offer to make next time a fingerprint
      if (passkeySupported() && !localStorage.getItem(KEY_CRED)) offerPasskey();
    };

    gate.querySelector("#gate-passkey")?.addEventListener("click", async () => {
      say("Waiting for your device…");
      try {
        await usePasskey();
        grant(AUTH.rememberDays);
        letIn();
      } catch {
        say("That didn't check out — use the passphrase.", "err");
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pass = gate.querySelector("#gate-pass").value;
      const go = gate.querySelector("#gate-go");
      go.disabled = true;

      try {
        if (mode === "setup") {
          if (pass !== gate.querySelector("#gate-pass2").value) {
            say("Those two don't match.", "err");
            return;
          }
          say("Deriving the key — this is meant to be slow…");
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const hash = await derive(pass, salt, AUTH.iterations);
          const block =
`export const AUTH = {
  configured: true,
  salt: ${JSON.stringify(toB64(salt))},
  hash: ${JSON.stringify(hash)},
  iterations: ${AUTH.iterations},
  rememberDays: ${AUTH.rememberDays},
  label: ${JSON.stringify(AUTH.label)},
};`;
          sheet("Paste this over the AUTH block in auth-config.js, then commit", block);
          grant(AUTH.rememberDays);
          say("Unlocked on this device. Commit that block to make it work everywhere.", "ok");
          setTimeout(letIn, 400);
          return;
        }

        const wait = failDelay();
        if (wait) {
          say(`Too many tries — waiting ${Math.round(wait / 1000)}s…`);
          await new Promise((r) => setTimeout(r, wait));
        }
        say("Checking…");
        const hash = await derive(pass, fromB64(AUTH.salt), AUTH.iterations);
        if (sameSecret(hash, AUTH.hash)) {
          grant(gate.querySelector("#gate-remember")?.checked ? AUTH.rememberDays : 0);
          letIn();
        } else {
          noteFail();
          say("Not quite. Try again.", "err");
          gate.querySelector("#gate-pass").select();
        }
      } finally {
        go.disabled = false;
      }
    });
  });
}

/** After a successful unlock, offer to make next time a fingerprint. */
async function offerPasskey() {
  const bar = document.createElement("div");
  bar.className = "note row-flex";
  bar.style.marginTop = "0";
  bar.innerHTML = `
    <span style="flex:1">Unlock this faster next time — add a passkey and it's
      a fingerprint instead of a passphrase.</span>
    <button class="btn btn-ghost" id="pk-add">Add a passkey</button>
    <button class="icon-btn" id="pk-no" aria-label="Not now">✕</button>`;
  document.querySelector("main .wrap")?.prepend(bar);

  bar.querySelector("#pk-no").onclick = () => bar.remove();
  bar.querySelector("#pk-add").onclick = async () => {
    try {
      await registerPasskey();
      bar.textContent = "Passkey added — this device can unlock the Studio on its own now.";
    } catch {
      bar.textContent = "That didn't work. The passphrase still does.";
    }
  };
}

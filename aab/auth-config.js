/* ============================================================
   auth-config.js — who is allowed into /studio.html.

   RIGHT NOW THIS IS UNCONFIGURED, so the first visit to the
   Studio shows a one-time setup screen: pick a passphrase, and
   it hands you the exact block to paste in here. Commit that,
   and from then on the Studio asks for the passphrase (or your
   fingerprint / Face ID, once you've added a passkey).

   Nothing secret lives in this file. `hash` is the passphrase
   put through PBKDF2-SHA256 600,000 times with `salt`; you
   cannot work backwards from it to the passphrase.

   BE HONEST ABOUT WHAT THIS IS. This is a static site — there
   is no server to check anything, so the gate runs in the
   visitor's own browser. It keeps the Studio out of the hands
   of anyone who wanders in, and keeps it out of Google. A
   determined person with developer tools can still read the
   page's code, because every static site's code is public. Do
   not put anything genuinely confidential behind it.
   ============================================================ */

export const AUTH = {
  // Replace this whole object with the block the setup screen gives you.
  configured: false,
  salt: "",
  hash: "",
  iterations: 600000,

  // How long an unlock lasts before it asks again.
  rememberDays: 30,

  // Shown on the lock screen so you know you're on the right site.
  label: "Reiad's Library · Article Studio",
};

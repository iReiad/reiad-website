/* auth-config.ts: who is allowed into /studio/. Unconfigured
   until the Studio's setup screen prints a block to paste here.
   Nothing secret: `hash` is the passphrase through PBKDF2-SHA256.
   The gate runs in the visitor's browser, so it keeps the Studio
   away from passers-by and out of Google. Do not put anything
   genuinely confidential behind it. */

/** What the setup screen writes out, and what `auth.ts` reads.
    Not `as const`: the block below is meant to be REPLACED
    wholesale by the one the setup screen prints, so every field
    here is a value the gate compares rather than a literal it
    can be narrowed to. */
export interface AuthConfig {
  configured: boolean;
  salt: string;
  hash: string;
  iterations: number;
  rememberDays: number;
  label: string;
}

export const AUTH: AuthConfig = {
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

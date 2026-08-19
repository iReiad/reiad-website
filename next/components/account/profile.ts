"use client";

/* ============================================================
   account/profile.ts: the reader's own row, without fetching it
   twice.

   `aab/account.js` already caches the profile on the device and
   dispatches `profile:changed` on `document` every time it
   changes: on the read at sign-in, on every save, and with null
   on sign-out. So a component that needs a field off it reads the
   cache and listens, and asks the network nothing.

   That seam existed before this port and nothing used it. The
   alternative was every component calling `getProfile()`, which
   is one Supabase round trip each for one row they would all get
   the same answer from.
   ============================================================ */

import { useEffect, useState } from "react";
import type { Profile } from "/account.js";
import { runtimeModule } from "./runtime";

type AccountModule = typeof import("/account.js");

export const accountModule = () => runtimeModule<AccountModule>("/account.js");

/** The profile as this device last knew it, kept current.

    Null means either "not signed in" or "not read yet", and this
    page draws nothing for either: everything on it is behind
    `#account-in`, which stays hidden until somebody is. */
export function useProfile(): Profile | null {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let live = true;
    accountModule().then((m) => {
      if (live) setProfile(m.cachedProfile());
    }).catch(() => { /* signed out, and the page shows nothing */ });

    const heard = (e: Event) => {
      setProfile((e as CustomEvent<Profile | null>).detail ?? null);
    };
    document.addEventListener("profile:changed", heard);
    return () => {
      live = false;
      document.removeEventListener("profile:changed", heard);
    };
  }, []);

  return profile;
}

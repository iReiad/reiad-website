/* Is this reader the owner? `isAdmin()` in `functions/_lib/admins.ts` is
   the only place that decides, and `/api/work-alpha` is where it is asked.

   THE SERVER RENDER HAS NO READER: the session is a bearer in
   localStorage, so no request for a page carries one. The answer is
   therefore asked for in the browser and CACHED, and the boot script in
   `shell.tsx` reads that cache before the first paint into `data-owner`
   on `<html>`, which is what the rail draws its entry from. A page load
   after the first never waits on the network for it. */

import { runtimeModule } from "../account/runtime";

const OWNER_KEY = "work-alpha-owner";

export type Owner = "yes" | "no";

/** What this browser last heard. Null when it has never asked. */
export function known(): Owner | null {
  try {
    const v = localStorage.getItem(OWNER_KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch { return null; }
}

function remember(owner: boolean): void {
  try { localStorage.setItem(OWNER_KEY, owner ? "yes" : "no"); } catch { /* private mode */ }
  if (owner) document.documentElement.setAttribute("data-owner", "yes");
  else document.documentElement.removeAttribute("data-owner");
}

type AccountModule = typeof import("/account.js");

let asking: Promise<boolean> | null = null;

/** Ask, and remember the answer. A plain fetch rather than
    `readerCall`, because the status IS the answer: a stranger gets
    a 404, exactly as they do for the page. One request however
    many components ask at once: the mark in the shell and the
    mount on the page both do, on the same load. */
export function askOwner(): Promise<boolean> {
  asking ??= ask().finally(() => { asking = null; });
  return asking;
}

async function ask(): Promise<boolean> {
  try {
    const acc = await runtimeModule<AccountModule>("/account.js");
    const bearer = acc.current() ? await acc.token() : null;
    if (!bearer) { remember(false); return false; }
    const res = await fetch("/api/work-alpha", {
      headers: { Authorization: `Bearer ${bearer}`, accept: "application/json" },
    });
    remember(res.ok);
    return res.ok;
  } catch {
    return known() === "yes";
  }
}

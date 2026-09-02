"use client";

/* ============================================================
   research/keys.ts: the studio's single-letter keys, and the
   guard that makes them safe.

   `RESEARCH.md` section 6. `aab/src/app.ts` binds `/`, Ctrl+K,
   `?`, `t` and `g` on `window` on every page, and a shortcut that
   collides does the other thing: the desk took `/` for one build
   and the palette opened over it every time. So nothing here
   binds one of those, and every key below is guarded by
   `typing()`, which is what makes a single letter safe.
   ============================================================ */

import { useEffect } from "react";

/** Is the focus in something a single letter would type into? */
export const typing = (): boolean => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
};

/** The site's own, never bound here. */
export const SITES_OWN = new Set(["/", "?", "t", "g"]);

export type KeyMap = Record<string, (e: KeyboardEvent) => void>;

/** Bind single letters for the life of a room. A key the site
    owns is refused at bind time rather than at press time, so the
    collision is a thrown error in development and not a page
    doing two things. */
export function useKeys(map: KeyMap, enabled = true): void {
  useEffect(() => {
    if (!enabled) return undefined;
    for (const key of Object.keys(map)) {
      if (SITES_OWN.has(key)) throw new Error(`"${key}" is the site's own shortcut`);
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      /* Escape in a plain field takes the caret back out, so that
         f, Escape, j is a way through the list with no mouse. Not
         inside the palette or a popover, which close on it
         themselves, and not in an editor, where it is the
         editor's. */
      if (e.key === "Escape" && typing() && !document.querySelector("dialog[open], [popover]:popover-open")) {
        const el = document.activeElement as HTMLElement;
        if (!el.isContentEditable) { el.blur(); return; }
      }
      if (typing()) return;
      if (document.querySelector("dialog[open], [popover]:popover-open")) return;
      const fn = map[e.key];
      if (!fn) return;
      e.preventDefault();
      fn(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [map, enabled]);
}

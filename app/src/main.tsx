/* ============================================================
   main.tsx: the gate, then React.

   The auth gate is the site's own `requireOwner()` from
   `/auth.js`, unchanged and un-ported. It is the one piece of this
   page that must not be rewritten as part of a UI experiment: it
   is the thing keeping the desk private, it already works, and
   Stage 9 is explicitly about porting UI only.

   So React mounts AFTER the gate resolves, into the element the
   gate un-hides, exactly where the old desk's own render call sat.
   ============================================================ */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Desk } from "./Desk.tsx";

import { requireOwner } from "/auth.js";

/* The site's own script: header, menu, palette, theme, sign-in.
   Imported for its side effects so the desk is an ordinary page of
   this site rather than an island that has to reimplement the
   furniture. Left external by vite.config.ts, so this stays a
   runtime import of the file the rest of the site already uses. */
import "/app.js";

const root = document.getElementById("desk-root");

if (root) {
  /* Awaited, not raced. Rendering first and hiding later would put
     the desk in the DOM for anyone who opened the page, which is
     the opposite of what the gate is for. */
  requireOwner(root).then(() => {
    root.hidden = false;
    createRoot(root).render(
      <StrictMode>
        <Desk />
      </StrictMode>
    );
  });
}

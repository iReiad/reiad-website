/* ============================================================
   main.tsx: the gate, then React.

   The auth gate is the site's own `requireOwner()` from
   `/auth.js`, unchanged and un-ported. It is the one piece of this
   page that must not be rewritten as part of a UI experiment: it
   is the thing keeping the Studio private, it already works, and
   Stage 9 is explicitly about porting UI only.

   What the gate answers with matters as well as when. A server
   session unlocks publishing and the desk; without one the Studio
   still runs, still saves drafts on this device, and says so. That
   was true of the old page and is the reason `dynamic` is a prop
   rather than something a component works out for itself.
   ============================================================ */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Studio } from "./Studio.tsx";

import { requireOwner } from "/auth.js";

/* The site's own script: header, menu, palette, theme, sign-in.
   Imported for its side effects so the Studio is an ordinary page
   of this site rather than an island that has to reimplement the
   furniture. Left external by vite.config.ts, so this stays a
   runtime import of the file the rest of the site already uses. */
import "/app.js";

const root = document.getElementById("studio-root");

if (root) {
  /* Awaited, not raced. Rendering first and hiding later would put
     the Studio in the DOM for anyone who opened the page, which is
     the opposite of what the gate is for. */
  requireOwner(root).then((session) => {
    root.hidden = false;
    createRoot(root).render(
      <StrictMode>
        <Studio dynamic={Boolean(session?.server)} />
      </StrictMode>
    );
  });
}

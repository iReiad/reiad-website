"use client";

/* ============================================================
   scripts.tsx: the site's own modules, loaded after React has
   finished hydrating and not one moment before.

   ---- the bug this file exists for ----

   Every calculator on this site went blank on the day its page
   became a route. The markup was right, the module was right, the
   module even ran: the compounding tool computed ৳41.63 lakh and
   wrote it into the page about fifty milliseconds after load, and
   then the number went back to being a dash. Every stat on
   /tools/index.html, the whole verdict on /tools/stock.html and
   five of the seven case studies, all of them showing the empty
   markup a reader is meant to see for an instant.

   A `<script type="module">` in the body is deferred: it runs when
   the document has been parsed, which is BEFORE React hydrates.
   Hydration is React walking the server's HTML and adopting it as
   its own, and a tool script has by then filled in text React did
   not render and appended children React does not know about. That
   is a hydration mismatch, and React's answer to one is to make the
   DOM match what it rendered: it rewrites the text and removes the
   children. The console says "Minified React error #418" and
   nothing else, on a page that looks merely unfinished.

   None of this happened while these pages were files, because
   nothing hydrated them. It is not a fault in any of the modules
   and no amount of reading them finds it.

   ---- what this does instead ----

   The module is fetched as early as it ever was, by a
   `modulepreload` link that ships in the server's HTML, and it is
   EXECUTED from an effect, which React runs after the commit that
   finishes hydration. By then React has adopted the whole tree and
   will not touch it again: these pages hold no state and never
   re-render, so what a module writes into them stays written.

   Order is kept twice over. Effects run in tree order, so a page's
   own modules are appended before `/app.js` in the shell below
   them; and `async = false` on a script the page appends itself is
   what makes the browser run them in the order they were appended
   rather than in whatever order they arrive.
   ============================================================ */

import { useEffect } from "react";

/** A module at a path, or a classic script that is not one.

    `/read-aloud.js` is the only classic one an article loads, and
    it stays classic: a file written for a `<script>` tag is not
    always a file that survives being loaded as a module, and this
    is not the change to find that out in. */
export type ScriptSpec = string | { src: string; classic?: boolean; crossOrigin?: boolean };

const spec = (s: ScriptSpec) => (typeof s === "string" ? { src: s } : s);

export function SiteScripts({ srcs }: { srcs: ScriptSpec[] }) {
  /* The dependency is the list written out, not the array itself:
     a fresh array on every render would re-run the effect and load
     every module a second time. */
  const key = srcs.map((s) => spec(s).src).join(" ");

  useEffect(() => {
    const added = srcs.map((entry) => {
      const { src, classic, crossOrigin } = spec(entry);
      const el = document.createElement("script");
      if (!classic) el.type = "module";
      if (crossOrigin) el.crossOrigin = "";
      el.src = src;
      /* Appended scripts are async by default, which would run
         them in whichever order the network answered. */
      el.async = false;
      document.body.appendChild(el);
      return el;
    });

    /* React runs an effect's cleanup before re-running it. Nothing
       on this site navigates between two of these pages without a
       full load, so this should never fire; if it ever does, it
       takes the tags out rather than leaving a second copy of each
       module behind. */
    return () => added.forEach((el) => el.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  /* The fetch still starts with the document. What moved is when
     the browser is allowed to RUN what it fetched. */
  return (
    <>
      {srcs.map((entry) => {
        const { src, classic, crossOrigin } = spec(entry);
        return (
          <link
            key={src}
            rel={classic ? "preload" : "modulepreload"}
            as={classic ? "script" : undefined}
            href={src}
            crossOrigin={crossOrigin ? "" : undefined}
          />
        );
      })}
    </>
  );
}

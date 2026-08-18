/* ============================================================
   runtime.ts: importing a module this site serves at a path.

   `/prefs.js`, `/saved.js` and five others are served by the
   OTHER Worker at those addresses and are precached. They are not
   files in this project, so nothing here can resolve them at
   build time and nothing should try.

   ---- why the specifier is a variable ----

   `turbopackIgnore` is enough for Turbopack and is not enough on
   its own. A `"use client"` component is also built for the
   SERVER render, and `opennextjs-cloudflare` bundles that copy
   with esbuild, which resolves what Turbopack was told to leave:

       Could not resolve "/prefs.js"
       .open-next/server-functions/default/.next/server/chunks/ssr/…

   `next build` passes and the Cloudflare build fails, which is
   the second time in one day that gap has cost a red tick, so it
   is written down here rather than rediscovered.

   A specifier that is not a literal cannot be analysed by either,
   so both leave it alone and the browser resolves it at run time,
   which is where it was always going to be resolved. The two
   comments stay for the bundlers that do read a literal through
   a variable.

   ---- and it never runs on the server ----

   Every caller is inside `useEffect` or an event handler, so the
   server render reaches none of them. That is not an accident of
   this file: what these modules read is one reader's own session
   and their own localStorage, and the server has neither.
   ============================================================ */

const loaded = new Map<string, Promise<unknown>>();

/**
 * One import per path per page, however many components ask.
 *
 * @param path the address the module is served at, `/saved.js`.
 */
export function runtimeModule<T>(path: string): Promise<T> {
  let m = loaded.get(path);
  if (!m) {
    m = import(/* turbopackIgnore: true */ /* webpackIgnore: true */ path);
    loaded.set(path, m);
  }
  return m as Promise<T>;
}

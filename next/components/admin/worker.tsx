"use client";

/* ============================================================
   admin/worker.tsx: what THIS BROWSER is holding.

   Every other panel on this page describes the server. This one
   describes the machine the page is being read on, and it is the
   only thing here that draws before anything is fetched: no
   credential, no endpoint, no state a failure can leave pending.
   That is the whole point of it.

   THE FAILURE THIS EXISTS FOR. /admin showed its heading and its
   two credential cards and none of its thirteen panels, across
   days and several reloads, while the HTML, the chunks, the
   stylesheet and every endpoint on the server were correct, and
   every check said so. Driving the same production page in a
   browser with no worker in the way rendered all sixteen
   headings. Nothing on the page could say which copy was being
   read, so the difference could only be found by proxying the
   live site into a local browser, and the reader looking at the
   broken page had no way to say anything except that it was
   broken.

   ---- what a `waiting` worker means, and why it is the answer ----

   A new worker installs and then WAITS while the old one goes on
   answering every request. `skipWaiting()` is what skips that,
   and it only runs in the NEW worker, which means a browser that
   has not fetched the new script yet keeps the old one however
   many times it reloads. Until it does, it is served an older
   build's answers from a cache the server cannot see.

   So this says which state it is in, and then offers the one
   thing that ends it without devtools. Unregister and empty every
   cache rather than asking the worker to stand down: that needs
   no cooperation from the copy that is already wrong, which is
   the copy this is for.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";
import { Surface } from "../ui/surface";
import { Button } from "../ui/button";
import { Row } from "./row";

interface Held {
  /** Is a worker answering THIS page's requests right now. A
      registration with no controller is a worker that will take
      over on the next navigation and is not serving this one. */
  controlling: boolean;
  script: string | null;
  waiting: boolean;
  installing: boolean;
  caches: string[];
}

export function WorkerPanel() {
  const [held, setHeld] = useState<Held | null>(null);
  const [supported, setSupported] = useState(true);
  const [clearing, setClearing] = useState(false);

  const look = useCallback(async () => {
    if (!("serviceWorker" in navigator)) { setSupported(false); return; }
    const reg = await navigator.serviceWorker.getRegistration().catch(() => null);
    /* `caches` is absent on an insecure origin even where the
       worker API is not, so it is asked for separately. */
    const keys = "caches" in self
      ? await caches.keys().catch((): string[] => [])
      : [];
    setHeld({
      controlling: Boolean(navigator.serviceWorker.controller),
      script: reg?.active?.scriptURL ? new URL(reg.active.scriptURL).pathname : null,
      waiting: Boolean(reg?.waiting),
      installing: Boolean(reg?.installing),
      caches: keys,
    });
  }, []);

  useEffect(() => { void look(); }, [look]);

  /* Unregister every worker and delete every cache, then reload.
     Deliberately not `registration.update()`: that asks the
     server for a new script and leaves the old one controlling
     until it decides to stand down, which is the state this is
     most often used to escape. Nothing here is a reader's own
     data: progress lives in localStorage and in the account, and
     a cache is a copy of something the network can send again. */
  const clear = async () => {
    setClearing(true);
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      if ("caches" in self) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch { /* reload anyway: a partial clear still helps */ }
    location.reload();
  };

  if (!supported) {
    return (
      <Surface material="pane" className="ad-panel">
        <h3>This browser</h3>
        <p className="ad-quiet">
          No service worker API here, so nothing is being served out of a cache
          this page cannot see. Whatever is on screen came from the network.
        </p>
      </Surface>
    );
  }

  return (
    <Surface material="pane" className="ad-panel">
      <h3>This browser</h3>

      {held === null ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : (
        <>
          <div className="ad-rows">
            <Row label="Worker answering this page"
                 state={held.controlling ? "up" : "unset"}
                 note={held.script ?? "none registered"} />
            <Row label="A newer one waiting to take over"
                 state={held.waiting ? "down" : "up"}
                 note={held.waiting
                   ? "the old one is still answering, so this page may be an older build"
                   : held.installing ? "one is installing now" : "no"} />
            <Row label="Caches on this device"
                 state={held.caches.length ? "up" : "unset"}
                 note={held.caches.join(", ") || "none"} />
          </div>

          {held.waiting ? (
            <p className="ad-quiet">
              A newer worker has installed and the one answering this page is the
              old one. Until that changes you are reading an earlier build,
              however many times you reload, and the server cannot tell.
            </p>
          ) : null}

          <Button kind="ghost" size="sm" onClick={clear} disabled={clearing}>
            {clearing ? "clearing…" : "Clear this browser's copy and reload"}
          </Button>
          <p className="ad-quiet">
            Unregisters every worker, empties every cache and reloads. It costs
            nothing that is yours: what you have read is in your account, and a
            cache is a copy of something the network can send again.
          </p>
        </>
      )}
    </Surface>
  );
}

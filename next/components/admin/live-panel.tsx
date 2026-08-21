"use client";

/* ============================================================
   Live portfolio: what a stranger is being shown.

   ADMIN.md §3 C 11 says the broker panel on `/tools/live` moves
   here. This is the half of that move which is safe to make now:
   the STATE, read from `/api/broker/me` and `/api/broker/site`,
   which are the two routes that already answer it.

   The levers stay on `/tools/live` for one more stage. Moving a
   control that writes is not the same job as moving a readout: a
   button here that drops the cached snapshot, or replaces the key
   behind the public feed, has to be tested against a broker
   nobody wants to call from a test, and `/tools/live` has that
   code working today. Two copies of a write path is how a site
   ends up with two of them disagreeing, so there is one, and this
   panel says where it is.

   ---- three states, and the middle one is the common one ----

   The broker has no key configured on a working site until
   somebody sets one. So "not set" is grey rather than red, and
   the note names the secret rather than saying "unreachable",
   which would send somebody looking for a fault that is a
   setting.
   ============================================================ */

import { useEffect, useState } from "react";
import { Surface } from "../ui/surface";
import { Row } from "./row";

interface Me {
  admin?: boolean;
  hasKey?: boolean;
  configured?: boolean;
  sealed?: boolean;
}

interface Site {
  view?: Record<string, boolean>;
  updated?: string | null;
  positions?: unknown[];
}

export function LivePanel() {
  const [me, setMe] = useState<Me | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [state, setState] = useState<"loading" | "denied" | "error" | "ok">("loading");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetch("/api/broker/me", { headers: { accept: "application/json" } });
        if (!live) return;
        if (!r.ok) { setState("error"); return; }
        /* Read through a default rather than asserted. Every field
           on `Me` is optional and every use of one below goes
           through `?.`, so the only way this panel could throw
           during render is a body that is not an object at all,
           and a throw in a client component unmounts the WHOLE
           route: `/admin` goes to "This page couldn't load" and
           Health goes with it. See the same guard in health.tsx. */
        const answer = await r.json().catch(() => null) as unknown;
        const who: Me = (answer && typeof answer === "object" ? answer : {}) as Me;
        setMe(who);
        if (!who.admin) { setState("denied"); return; }

        /* Only an admin may ask for this one, so it is asked only
           after `me` has said so rather than by trying it and
           reading a 403. A panel that learns what it is allowed to
           do from an error is a panel that logs errors on a
           working site. */
        const s = await fetch("/api/broker/site", { headers: { accept: "application/json" } });
        if (!live) return;
        const shape = s.ok ? await s.json().catch(() => null) as unknown : null;
        setSite(shape && typeof shape === "object" ? shape as Site : null);
        setState("ok");
      } catch { if (live) setState("error"); }
    })();
    return () => { live = false; };
  }, []);

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Live portfolio</h3>

      {state === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {state === "denied" ? (
        <p className="ad-quiet">
          This account is not an admin. The public page still works: a stranger
          sees the site&apos;s own portfolio in percentages, which is what it is for.
        </p>
      ) : null}
      {state === "error" ? (
        <p className="ad-quiet">
          The broker seam did not answer. Nothing here talks to Trading 212
          directly, so this is the Worker rather than the broker.
        </p>
      ) : null}

      {state === "ok" && me ? (
        <>
          <div className="ad-rows">
            <Row label="Public feed key" state={me.configured ? "up" : "unset"}
                 note={me.configured
                   ? "configured"
                   : "T212_PUBLIC_TOKEN, or set one from the dashboard"} />
            <Row label="Sealing key" state={me.sealed ? "up" : "unset"}
                 note={me.sealed
                   ? "BROKER_TOKEN_KEY set"
                   : "no BROKER_TOKEN_KEY: a key can only be pasted per session"} />
            <Row label="Your own key" state={me.hasKey ? "up" : "unset"}
                 note={me.hasKey ? "saved, sealed" : "none saved"} />
            <Row label="Snapshot" state={site?.updated ? "up" : "unset"}
                 note={site?.updated
                   ? `${site.positions?.length ?? 0} positions, ${site.updated}`
                   : "not fetched yet"} />
          </div>

          {site?.view ? (
            <div className="ad-rows">
              {Object.entries(site.view).map(([k, on]) => (
                <Row key={k} label={`A stranger sees: ${k}`}
                     state={on ? "up" : "unset"} note={on ? "shown" : "hidden"} />
              ))}
            </div>
          ) : null}

          <p className="ad-quiet">
            The levers are on <a href="/tools/live">the dashboard</a>, and stay there
            until they can move with their tests. One write path, not two.
          </p>
        </>
      ) : null}
    </Surface>
  );
}

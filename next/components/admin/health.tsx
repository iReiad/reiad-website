"use client";

/* ============================================================
   admin/health.tsx: is anything broken.

   The one panel on the admin page that needs no credential, and
   `functions/api/admin/[[route]].ts` says at length why: a page
   that can only tell you the site is healthy once you have proved
   who you are cannot tell you that the sign-in is what is down,
   which is the one moment somebody opens it in a hurry.

   ---- every row is a live answer ----

   Nothing here is a build-time constant and nothing is a
   sentence. The two stores are a round trip each, the secrets are
   booleans off the Worker's own environment, and the service
   worker is read out of the registration the browser is actually
   holding rather than out of the file this build shipped. That
   last one is the point of the row: a stale service worker is
   invisible from the server, because the server is serving the
   new one perfectly to a browser that is not asking.
   ============================================================ */

import { useEffect, useState } from "react";
import { Surface } from "../ui/surface";
import { Row, type State } from "./row";

interface Store { bound?: boolean; configured?: boolean; ok: boolean; ms: number }

interface Health {
  commit: string | null;
  stores: { d1: Store; supabase: Store };
  secrets: { drive: boolean; brokerSeal: boolean; adminReaders: number };
}

/** Is this really a health answer?

    Asserted rather than assumed, and the reason is what this
    panel is FOR. It read `d.stores.d1` off whatever came back,
    so an endpoint answering a different shape threw during
    render, and a throw in a client component takes the WHOLE
    route down: the page said "This page couldn't load" and every
    other panel went with it. The one panel that has to work on
    the day something is broken was the one that could break
    everything. */
/** The endpoint's answer to a caller with no credential. It is a
    success, not a failure, and drawing it as one would be the
    "locked panel shown as a broken panel" mistake this page is
    built to avoid. */
const isLockedHealth = (d: unknown): boolean =>
  Boolean(d) && typeof d === "object" && (d as { detail?: boolean }).detail === false;

const isHealth = (d: unknown): d is Health => {
  const h = d as Health | null;
  return !!h && typeof h === "object"
    && !!h.stores && !!h.stores.d1 && !!h.stores.supabase
    && !!h.secrets;
};

export function AdminHealth() {
  const [health, setHealth] = useState<Health | null>(null);
  const [failed, setFailed] = useState(false);
  const [locked, setLocked] = useState(false);
  const [sw, setSw] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/health", { headers: { accept: "application/json" } })
      .then(async (r): Promise<unknown> => (r.ok ? r.json() : null))
      .then((d) => {
        if (!live) return;
        if (isHealth(d)) setHealth(d);
        else if (isLockedHealth(d)) setLocked(true);
        else setFailed(true);
      })
      .catch(() => { if (live) setFailed(true); });

    /* What this browser is actually holding, which is a different
       question from what the site is serving. */
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration()
        .then((reg) => {
          if (!live) return;
          const url = reg?.active?.scriptURL ?? null;
          setSw(url ? new URL(url).pathname : null);
        })
        .catch(() => {});
    }
    return () => { live = false; };
  }, []);

  if (failed) {
    return (
      <Surface material="pane" className="ad-panel">
        <h3>Health</h3>
        {/* The Worker not answering IS the answer, and saying it
            plainly beats an empty panel, which is the rule
            next/admin.test.ts was written for. */}
        <Row label="The Worker" state="down" note="no usable answer from /api/admin/health" />
        <p className="ad-quiet">
          Either it did not answer, or it answered something that is not a health
          report. Everything else on this page is served by the same Worker, so
          expect it to be unavailable too.
        </p>
      </Surface>
    );
  }

  /* The Worker answered and would not say more, which is itself
     the answer worth having: whatever is wrong with this page is
     not the Worker. What it used to say here instead was which
     stores are up, which secrets are set and how many admin
     readers there are, to anybody at all. */
  if (locked) {
    return (
      <Surface material="pane" className="ad-panel">
        <h3>Health</h3>
        <div className="ad-rows">
          <Row label="The Worker" state="up" note="answering" />
        </div>
        <p className="ad-quiet">
          The rest needs a credential. Which stores are reachable, which secrets
          are configured and how many admin readers there are is a map of this
          site for anybody who asks, so it is not something a stranger is told.
          The Worker answering is, because a panel that is not working when it
          does is not the Worker&apos;s fault.
        </p>
      </Surface>
    );
  }

  if (!health) return <p className="ad-quiet" role="status">Asking…</p>;

  const store = (s: Store): State =>
    (s.bound ?? s.configured) ? (s.ok ? "up" : "down") : "unset";

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Health</h3>

      <div className="ad-rows">
        <Row label="D1" state={store(health.stores.d1)}
             note={health.stores.d1.ok ? `${health.stores.d1.ms}ms` : undefined} />
        <Row label="Supabase" state={store(health.stores.supabase)}
             note={health.stores.supabase.ok ? `${health.stores.supabase.ms}ms` : undefined} />
        <Row label="Drive credential" state={health.secrets.drive ? "up" : "unset"}
             note={health.secrets.drive ? "configured" : "the course section will say it is not connected"} />
        <Row label="Broker seal" state={health.secrets.brokerSeal ? "up" : "unset"}
             note={health.secrets.brokerSeal ? "configured" : "keys are per session only"} />
        <Row label="Admin readers listed"
             state={health.secrets.adminReaders > 0 ? "up" : "unset"}
             note={`${health.secrets.adminReaders} in wrangler.toml`} />
        <Row label="Service worker" state={sw ? "up" : "unset"}
             note={sw ?? "none registered in this browser"} />
      </div>

      {health.commit ? (
        <p className="ad-quiet mono">deployed from {health.commit.slice(0, 8)}</p>
      ) : (
        <p className="ad-quiet">
          The deploy does not pass a commit through yet, so this cannot say
          which one is live.
        </p>
      )}
    </Surface>
  );
}

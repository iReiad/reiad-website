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

interface Store { bound?: boolean; configured?: boolean; ok: boolean; ms: number }

interface Health {
  commit: string | null;
  stores: { d1: Store; supabase: Store };
  secrets: { drive: boolean; brokerSeal: boolean; adminReaders: number };
}

/** A green dot, an amber one, or a grey one. Three states and not
    two, because "not configured" is not the same as "broken" and
    a panel that paints them the same sends somebody looking for a
    fault that is a setting. */
type State = "up" | "down" | "unset";

function Row({ label, state, note }: { label: string; state: State; note?: string }) {
  return (
    <div className="ad-row" data-state={state}>
      <span className="ad-dot" aria-hidden="true" />
      <span className="ad-row-label">{label}</span>
      <span className="ad-row-note mono">{note ?? (
        state === "up" ? "ok" : state === "down" ? "unreachable" : "not set"
      )}</span>
    </div>
  );
}

export function AdminHealth() {
  const [health, setHealth] = useState<Health | null>(null);
  const [failed, setFailed] = useState(false);
  const [sw, setSw] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/health", { headers: { accept: "application/json" } })
      .then(async (r): Promise<Health | null> => (r.ok ? r.json() : null))
      .then((d) => { if (live) { if (d) setHealth(d); else setFailed(true); } })
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
            app/desk.test.ts was written for. */}
        <Row label="The Worker" state="down" note="no answer from /api/admin/health" />
        <p className="ad-quiet">
          Everything else on this page is served by the same Worker, so expect
          it to be unavailable too.
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

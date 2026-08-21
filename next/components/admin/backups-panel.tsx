"use client";

/* ============================================================
   Backups: what the nightly cron has actually written.

   ADMIN.md §3 B 8 asks for three things and this panel can answer
   two of them. The R2 half is `GET /api/backup/status`: when the
   snapshot last ran, how big it was, and how many are still held.

   ---- the third is not answerable from here, and says so ----

   "The last commit of `content/articles.backup.json`" is a fact
   about git. The Worker cannot see the repository, the file is
   not served, and the deploy passes through one commit hash for
   the whole site rather than a date per file. So this says where
   that half lives instead of drawing a row that would be a guess.
   Stage 3's routine panel is the same decision: a control that
   cannot work is worse than a sentence saying so.

   ---- and there is no restore button, deliberately ----

   §4: "No destructive one-click." `scripts/restore.ts` prints SQL
   to read before running it, and a button that ran it would be a
   button with one catastrophic outcome and no way to check the
   answer first.
   ============================================================ */

import { useEffect, useState } from "react";
import { adminCall, isLocked } from "../../lib/admin-api";
import { Surface } from "../ui/surface";
import { Row } from "./row";

/** One nightly snapshot in R2. `at` is a Date on the way out of
    the bucket and a string by the time it is here. */
interface Snapshot {
  key: string;
  bytes: number;
  at: string;
}

interface Status {
  /** Whether the bucket is bound at all. Unbound is a setting,
      not a fault, and is painted as one. */
  r2: boolean;
  snapshots: Snapshot[];
}

/** Is this really a status answer? The guard `health.tsx` carries
    and for its reason: a throw during render in a client component
    unmounts the whole route, every other panel with it. */
const isStatus = (d: unknown): d is Status => {
  const s = d as Status | null;
  return !!s && typeof s === "object" && Array.isArray(s.snapshots);
};

const size = (n: number): string =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} kB`;

const day = (iso: string): string => String(iso ?? "").slice(0, 10);

export function BackupsPanel() {
  const [phase, setPhase] = useState<"loading" | "locked" | "error" | "ready">("loading");
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      const r = await adminCall<Status>("backup/status");
      if (!live) return;
      if (isLocked(r)) { setPhase("locked"); return; }
      if (!r.ok || !isStatus(r.data)) { setPhase("error"); return; }
      setStatus(r.data);
      setPhase("ready");
    })();
    return () => { live = false; };
  }, []);

  /* The endpoint sorts newest first, and this reads the first one
     rather than sorting again: two orderings of the same list is
     one of them being wrong later. */
  const last = status?.snapshots[0] ?? null;
  const held = status?.snapshots.length ?? 0;
  const bytes = (status?.snapshots ?? []).reduce((n, s) => n + s.bytes, 0);

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Backups</h3>

      {phase === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held, so what R2 is holding is not readable from
          here. Sign in at <a href="/studio">the Studio</a>.
        </p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">
          /api/backup/status did not answer. That is the endpoint rather than
          the backup: the cron writes on its own schedule and does not need this
          page to be working.
        </p>
      ) : null}

      {phase === "ready" && status ? (
        <>
          <div className="ad-rows">
            <Row label="The bucket" state={status.r2 ? "up" : "unset"}
                 note={status.r2 ? "bound" : "MEDIA is not bound, so nothing is being written"} />
            <Row label="Last nightly snapshot"
                 state={last ? "up" : status.r2 ? "down" : "unset"}
                 note={last
                   ? `${day(last.at)} · ${size(last.bytes)}`
                   : status.r2
                     ? "none in the bucket, so the cron has not written one"
                     : "nowhere to write one"} />
            <Row label="Held" state={held > 0 ? "up" : "unset"}
                 note={`${held} under backups/, ${size(bytes)} in all`} />
          </div>

          <p className="ad-quiet">
            The whole database, nightly, into R2 under{" "}
            <span className="mono">backups/</span> and kept a fortnight. Not
            public, and the same provider as the thing it is backing up, which
            is a weaker guarantee and is written down as one.
          </p>

          <p className="ad-quiet">
            The other backup is <span className="mono">content/articles.backup.json</span>,
            committed nightly by the workflow and holding live articles only.
            When that last changed is a fact about git rather than about this
            site, and the Worker cannot see the repository, so this panel does
            not pretend to know: the commit log is where that half is.
          </p>

          <p className="ad-quiet">
            Restoring stays a command line. <span className="mono">scripts/restore.ts</span>{" "}
            prints SQL to read before running, and a button that ran it would
            have one catastrophic outcome and nothing to check first.
          </p>

          {status.snapshots.length > 0 ? (
            <ul className="m-0 grid max-h-64 w-full list-none gap-1 overflow-y-auto p-0">
              {status.snapshots.map((s) => (
                <li key={s.key}
                    className="flex flex-wrap items-baseline justify-between gap-2
                               border-b border-hairline py-1">
                  <span className="mono min-w-0 break-all">{s.key}</span>
                  <span className="mono text-[var(--t-2)] text-ink-soft">
                    {size(s.bytes)} · {day(s.at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </Surface>
  );
}

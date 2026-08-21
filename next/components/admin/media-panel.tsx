"use client";

/* ============================================================
   Media: what R2 is holding, and what nothing points at.

   ADMIN.md §3 B 6. Three of the four things it asks for were
   already answerable from the bucket listing; the fourth, "what
   nothing references", is a join between that listing and the
   database, and it is `GET /api/media/usage` rather than two
   fetches compared here.

   That is not tidiness. Two answers taken a second apart can
   disagree: a photo uploaded between them is referenced by a body
   the first fetch did not see, so it reads as loose. This is the
   panel whose buttons delete bytes, and the join belongs where
   both halves are read in one breath.

   ---- the delete ----

   One object, named, with a confirm, and only on a key the
   endpoint has just said nothing points at. ADMIN.md §4 allows
   exactly this shape and no more: deleting one stored file is
   "delete a comment", not "restore a backup". The endpoint
   decides which keys the DELETE route would accept, so this draws
   no button that cannot work.

   ---- and the state that is not empty ----

   `requireAdmin()` answers 401 without a passphrase session and
   this reads it. An empty bucket and a locked one draw the same
   nothing, which is the failure `app/desk.test.ts` exists for.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";
import { adminCall, isLocked } from "../../lib/admin-api";
import { Surface } from "../ui/surface";
import { Button } from "../ui/button";

/** One stored object, as `/api/media/usage` answers it. */
interface Stored {
  key: string;
  url: string;
  size: number;
  /** ISO: R2 hands back a Date and JSON makes it a string. */
  uploaded: string;
  /** How many places point at it, of which `where` names three. */
  refs: number;
  where: string[];
  /** Whether `DELETE /api/media/<key>` would take this key. */
  removable: boolean;
}

interface Usage {
  media: Stored[];
  listed: number;
  count: number;
  bytes: number;
  unreferenced: number;
  unreferencedBytes: number;
  snapshots: { count: number; bytes: number };
  scanned: { articles: number; versions: number; lessons: number };
  truncated: boolean;
}

/** Is this really a usage answer?

    Asserted rather than assumed, and not defensiveness for its own
    sake: a throw during render in a client component unmounts the
    WHOLE route, Health with it, so an endpoint answering some other
    shape would take down the one panel whose purpose is working on
    the day something is broken. `health.tsx` carries the same
    guard for the same reason. */
const isUsage = (d: unknown): d is Usage => {
  const u = d as Usage | null;
  return !!u && typeof u === "object"
    && Array.isArray(u.media) && u.media.every((m) => Array.isArray(m.where))
    && !!u.snapshots && !!u.scanned;
};

/** Never a bare byte count: the question this panel answers is how
    much deleting something would recover. */
const size = (n: number): string =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} kB`;

const day = (iso: string): string => String(iso ?? "").slice(0, 10);

export function MediaPanel() {
  const [phase, setPhase] = useState<"loading" | "locked" | "error" | "ready">("loading");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    const r = await adminCall<Usage>("media/usage");
    if (isLocked(r)) { setPhase("locked"); return; }
    if (!r.ok || !isUsage(r.data)) { setPhase("error"); return; }
    setUsage(r.data);
    setPhase("ready");
  }, []);

  useEffect(() => { void load(); }, [load]);

  /* The key carries a slash and it is part of the address, so it
     is not encoded: `/api/media/<slug>/<hash>.<ext>` is what the
     route splits back into its own parameter. */
  const remove = async (m: Stored): Promise<void> => {
    if (!window.confirm(
      `Delete ${m.key} from R2?\n\nNothing in the database points at it, `
      + "and the bytes do not come back.")) return;
    setBusy(m.key);
    const r = await adminCall(`media/${m.key}`, { method: "DELETE" });
    setBusy(null);
    if (isLocked(r)) { setPhase("locked"); return; }
    if (r.ok) await load();
  };

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Media</h3>

      {phase === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held, so the bucket is not readable from here.
          Sign in at <a href="/studio">the Studio</a>: it is the same session,
          and nothing on this page can mint it.
        </p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">
          /api/media/usage did not answer. That is the endpoint or the bucket
          binding, not the credential: Health above says whether the database
          is reachable.
        </p>
      ) : null}

      {phase === "ready" && usage ? (
        <>
          <div className="stat-row">
            <div className="stat stat-lead" data-stat="stored">
              <span className="k">Stored</span>
              <span className="v">{usage.count}</span>
              <span className="n">{size(usage.bytes)} of photos</span>
            </div>
            <div className="stat" data-stat="loose">
              <span className="k">Nothing points at</span>
              <span className="v">{usage.unreferenced}</span>
              <span className="n">{size(usage.unreferencedBytes)} to recover</span>
            </div>
            <div className="stat" data-stat="snapshots">
              <span className="k">Nightly snapshots</span>
              <span className="v">{usage.snapshots.count}</span>
              <span className="n">{size(usage.snapshots.bytes)}, kept a fortnight</span>
            </div>
          </div>

          <p className="ad-quiet">
            One bucket, two jobs: the photos every piece and lesson carries, and
            the database&apos;s own backups under <span className="mono">backups/</span>.
            The snapshots are counted apart and are never offered for deletion,
            which is the Backups panel&apos;s business.
          </p>

          <p className="ad-quiet">
            &quot;Nothing points at this&quot; was decided against every row that
            could hold a reference: {usage.scanned.articles} piece
            {usage.scanned.articles === 1 ? "" : "s"} and their share cards,{" "}
            {usage.scanned.versions} earlier version
            {usage.scanned.versions === 1 ? "" : "s"} of a body, and{" "}
            {usage.scanned.lessons} lesson
            {usage.scanned.lessons === 1 ? "" : "s"}. Drafts count, and so does a
            version nobody has restored: a photo only an old body names comes
            back the moment somebody puts that body back.
          </p>

          {usage.truncated || usage.listed < usage.count ? (
            <p className="ad-quiet">
              Showing {usage.listed} of {usage.count}, the ones nothing points at
              first and the largest within that.
              {usage.truncated
                ? " The bucket is longer than this endpoint walks, so the totals"
                  + " are a floor rather than the whole."
                : ""}
            </p>
          ) : null}

          {usage.media.length === 0 ? (
            <p className="ad-quiet">
              The bucket holds no photos. That is a real state on a site whose
              pieces carry none, and it is not this panel failing to read it.
            </p>
          ) : (
            <ul className="m-0 grid max-h-[28rem] list-none gap-2 overflow-y-auto p-0">
              {usage.media.map((m) => (
                <li key={m.key}
                    className="grid gap-1 rounded-[var(--radius-sm)] border
                               border-hairline p-2"
                    data-busy={busy === m.key ? "" : undefined}>
                  <p className="m-0 flex flex-wrap items-baseline justify-between gap-2">
                    <a className="mono min-w-0 break-all" href={m.url}
                       target="_blank" rel="noopener">{m.key}</a>
                    <span className="mono text-[var(--t-2)] text-ink-soft">
                      {size(m.size)} · {day(m.uploaded)}
                    </span>
                  </p>

                  {m.refs > 0 ? (
                    <p className="m-0 text-[var(--t-2)] text-ink-soft">
                      {m.where.join(" · ")}
                      {m.refs > m.where.length
                        ? ` and ${m.refs - m.where.length} more`
                        : ""}
                    </p>
                  ) : (
                    <p className="m-0 flex flex-wrap items-center gap-2
                                  text-[var(--t-2)] text-ink-soft">
                      <span>Nothing points at this.</span>
                      {m.removable ? (
                        <Button size="sm" kind="quiet" disabled={busy === m.key}
                                onClick={() => void remove(m)}>
                          Delete
                        </Button>
                      ) : (
                        <span>
                          Its key is not one the media route will delete, so it has
                          to go from the bucket itself.
                        </span>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </Surface>
  );
}

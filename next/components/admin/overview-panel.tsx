"use client";

/* ============================================================
   Overview: what is waiting, and where it is.

   ADMIN.md §3 B 1. Every number here is a count of rows, asked of
   the endpoint that owns them, and every one is a link into the
   panel that holds them. Nothing is remembered and nothing is
   added up in two places: that is the rule at the top of
   CLAUDE.md, one directory along.

   It is four fetches rather than one summary endpoint, and that is
   deliberate while it stays four. A summary route would be a fifth
   place that knows what "waiting" means for each of them, and the
   four already answer it: `counts` on questions, a filtered list
   on comments, a status on enquiries, and the piece list itself.
   ============================================================ */

import { useEffect, useState } from "react";
import { adminCall, isLocked } from "../../lib/admin-api";
import { Surface } from "../ui/surface";

interface Waiting {
  drafts: number;
  live: number;
  questions: number;
  comments: number;
  enquiries: number;
}

/** One number, and where to go and deal with it. The anchor is a
    fragment rather than a route because every panel is on this
    page: there is nowhere else to send anybody. */
function Tally(
  { label, n, href, tone }:
  { label: string; n: number; href: string; tone?: "waiting" },
) {
  return (
    <a href={href}
       className="flex items-baseline justify-between gap-3 rounded-[var(--radius-sm)]
                  border border-hairline px-3 py-2 no-underline"
       data-glow="control">
      <span>{label}</span>
      <strong className={`mono ${tone === "waiting" && n > 0 ? "text-accent" : "text-ink-soft"}`}>
        {n}
      </strong>
    </a>
  );
}

export function OverviewPanel() {
  const [phase, setPhase] = useState<"loading" | "locked" | "error" | "ready">("loading");
  const [n, setN] = useState<Waiting | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      const [pieces, questions, comments, enquiries] = await Promise.all([
        adminCall<{ articles?: Array<{ status: string }> }>("articles?all=1"),
        adminCall<{ counts?: Record<string, number> }>("questions?status=pending"),
        adminCall<{ comments?: unknown[] }>("comments?status=pending"),
        adminCall<{ enquiries?: Array<{ status: string }> }>("enquiries"),
      ]);
      if (!live) return;
      /* Any one of the four is enough to know: they share a
         session, so a refusal from one is a refusal from all. */
      if ([pieces, questions, comments, enquiries].some(isLocked)) {
        setPhase("locked"); return;
      }
      if (!pieces.ok) { setPhase("error"); return; }

      const articles = pieces.data?.articles ?? [];
      setN({
        drafts: articles.filter((a) => a.status !== "live").length,
        live: articles.filter((a) => a.status === "live").length,
        questions: questions.data?.counts?.pending ?? 0,
        comments: comments.data?.comments?.length ?? 0,
        enquiries: (enquiries.data?.enquiries ?? []).filter((e) => e.status === "new").length,
      });
      setPhase("ready");
    })();
    return () => { live = false; };
  }, []);

  return (
    <Surface material="pane" className="ad-panel" id="waiting">
      <h3>Waiting</h3>

      {phase === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held, so none of these can be counted. Sign in at{" "}
          <a href="/studio">the Studio</a>.
        </p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">The endpoints did not answer.</p>
      ) : null}

      {phase === "ready" && n ? (
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))]">
          <Tally label="Comments to approve" n={n.comments} href="#comments" tone="waiting" />
          <Tally label="Questions to answer" n={n.questions} href="#questions" tone="waiting" />
          <Tally label="Enquiries unread" n={n.enquiries} href="#enquiries" tone="waiting" />
          <Tally label="Drafts" n={n.drafts} href="#published" />
          <Tally label="Live pieces" n={n.live} href="#published" />
        </div>
      ) : null}
    </Surface>
  );
}

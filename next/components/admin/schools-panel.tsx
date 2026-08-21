"use client";

/* ============================================================
   Schools: the prose, as opposed to the ladder.

   ADMIN.md §3 B 7. `check-schools.ts` compares the ladder in
   `shared/curricula/` against the ladder in the snapshot and runs
   on a laptop with no network. This is the other half, and it can
   only be asked of the database: which lessons have no words in
   them, which rows no stage declares, and which links inside a
   lesson body go nowhere.

   ---- three answers about a link, not two ----

   `GET /api/schools/audit` decides a link against the rows, so it
   decides completely inside the space those rows describe and
   says so about everything else. An old spelling that answers
   through a 301 is neither alive nor dead and is counted apart:
   calling it dead would be a wrong word for a real thing, and
   burying it would lose the one list worth acting on.

   ---- and a soon stage is not a broken one ----

   An unwritten lesson in a stage marked `soon` is the ladder
   keeping a promise it has not got to yet. An unwritten lesson in
   a LIVE stage is a page a reader can reach today with nothing on
   it, so only that one is painted as a fault. Three states, for
   the reason the health dot has three.
   ============================================================ */

import { useEffect, useState } from "react";
import { adminCall, isLocked } from "../../lib/admin-api";
import { Surface } from "../ui/surface";
import { Row, type State } from "./row";

interface AuditStage {
  slug: string;
  title: string;
  status: string;
  url: string;
  total: number;
  written: number;
  empty: Array<{ slug: string; title: string }>;
}

interface AuditSchool {
  school: string;
  total: number;
  written: number;
  stages: AuditStage[];
}

interface AuditLink {
  school: string;
  stage: string;
  slug: string;
  href: string;
  to: string;
}

interface Audit {
  schools: AuditSchool[];
  undeclared: Array<{ school: string; stage: string; slug: string; why: string }>;
  undeclaredCount: number;
  links: {
    checked: number;
    alive: number;
    dead: AuditLink[];
    deadCount: number;
    redirected: AuditLink[];
    redirectedCount: number;
    elsewhere: AuditLink[];
    elsewhereCount: number;
  };
}

/** Is this really an audit answer?

    The same guard `health.tsx` and `courses-panel.tsx` carry: a
    throw during render in a client component unmounts the whole
    route and every other panel on it, so the shape is checked as
    deep as this file dereferences it. */
const isAudit = (d: unknown): d is Audit => {
  const a = d as Audit | null;
  return !!a && typeof a === "object"
    && Array.isArray(a.schools)
    && a.schools.every((s) => Array.isArray(s.stages)
      && s.stages.every((stage) => Array.isArray(stage.empty)))
    && Array.isArray(a.undeclared)
    && !!a.links && Array.isArray(a.links.dead)
    && Array.isArray(a.links.redirected) && Array.isArray(a.links.elsewhere);
};

/** A stage's dot. Written out in full is `up`; a `soon` stage or
    one with no rows at all is `unset`, because neither is broken;
    a LIVE stage with an empty lesson in it is `down`, because that
    is a page somebody can open today and read nothing on. */
const stageState = (s: AuditStage): State => {
  if (s.total === 0) return "unset";
  if (s.written === s.total) return "up";
  return s.status === "live" ? "down" : "unset";
};

function LinkList({ what, links, shown }: {
  what: string; links: AuditLink[]; shown: number;
}) {
  if (links.length === 0) return null;
  return (
    <div className="grid w-full gap-1">
      <p className="ad-quiet m-0">{what}</p>
      <ul className="m-0 grid max-h-64 list-none gap-1 overflow-y-auto p-0">
        {links.map((l, i) => (
          <li key={`${l.school}/${l.stage}/${l.slug}/${l.href}/${i}`}
              className="flex flex-wrap items-baseline justify-between gap-2
                         border-b border-hairline py-1">
            <span className="mono min-w-0 break-all">{l.href}</span>
            <span className="mono text-[var(--t-2)] text-ink-soft">
              in {l.school}/{l.stage}/{l.slug}
            </span>
          </li>
        ))}
      </ul>
      {shown > links.length ? (
        <p className="ad-quiet m-0">
          and {shown - links.length} more, which the endpoint counts and does
          not carry.
        </p>
      ) : null}
    </div>
  );
}

export function SchoolsPanel() {
  const [phase, setPhase] = useState<"loading" | "locked" | "error" | "ready">("loading");
  const [audit, setAudit] = useState<Audit | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      const r = await adminCall<Audit>("schools/audit");
      if (!live) return;
      if (isLocked(r)) { setPhase("locked"); return; }
      if (!r.ok || !isAudit(r.data)) { setPhase("error"); return; }
      setAudit(r.data);
      setPhase("ready");
    })();
    return () => { live = false; };
  }, []);

  const total = (audit?.schools ?? []).reduce((n, s) => n + s.total, 0);
  const written = (audit?.schools ?? []).reduce((n, s) => n + s.written, 0);

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Schools</h3>

      {phase === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held, so the lessons are not readable from here.
          Sign in at <a href="/studio">the Studio</a>, which is where a lesson is
          written too.
        </p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">
          /api/schools/audit did not answer. That is the endpoint, not the
          ladder: the schools themselves are rendered from the same rows and
          Health above says whether the database is reachable.
        </p>
      ) : null}

      {phase === "ready" && audit ? (
        <>
          <div className="stat-row">
            <div className="stat stat-lead" data-stat="written">
              <span className="k">Lessons written</span>
              <span className="v">{written}</span>
              <span className="n">of {total} the ladders declare</span>
            </div>
            <div className="stat" data-stat="dead">
              <span className="k">Links that go nowhere</span>
              <span className="v">{audit.links.deadCount}</span>
              <span className="n">of {audit.links.checked} inside a lesson</span>
            </div>
            <div className="stat" data-stat="undeclared">
              <span className="k">Rows no stage declares</span>
              <span className="v">{audit.undeclaredCount}</span>
              <span className="n">a lesson nothing can reach</span>
            </div>
          </div>

          {audit.schools.map((s) => (
            <div key={s.school} className="grid w-full gap-2">
              <p className="mono m-0 flex flex-wrap items-baseline justify-between gap-2">
                <span>{s.school}</span>
                <span className="text-[var(--t-2)] text-ink-soft">
                  {s.written} of {s.total} written
                </span>
              </p>
              <div className="ad-rows">
                {s.stages.map((stage) => (
                  <Row key={stage.slug}
                       label={`${stage.slug} · ${stage.title}`}
                       state={stageState(stage)}
                       note={stage.total === 0
                         ? "no lessons in the database"
                         : `${stage.written}/${stage.total}${stage.status === "live" ? "" : ` · ${stage.status}`}`} />
                ))}
              </div>
              {s.stages
                .filter((stage) => stage.status === "live" && stage.empty.length > 0)
                .map((stage) => (
                  <p key={`${stage.slug}-empty`} className="ad-quiet m-0">
                    <span className="mono">{stage.slug}</span> is live and these have
                    no words in them:{" "}
                    <span className="mono">
                      {stage.empty.map((l) => l.slug).join(", ")}
                    </span>
                  </p>
                ))}
            </div>
          ))}

          {audit.undeclared.length > 0 ? (
            <div className="grid w-full gap-1">
              <p className="ad-quiet m-0">
                In the database and in no ladder, so nothing links them and no
                ring counts them:
              </p>
              <div className="ad-rows">
                {audit.undeclared.map((u) => (
                  <Row key={`${u.school}/${u.stage}/${u.slug}`}
                       label={`${u.school}/${u.stage}/${u.slug}`}
                       state="down" note={u.why} />
                ))}
              </div>
            </div>
          ) : null}

          <p className="ad-quiet">
            {audit.links.checked} site-relative link
            {audit.links.checked === 1 ? "" : "s"} inside a lesson body:{" "}
            {audit.links.alive} answer directly, {audit.links.redirectedCount} through
            a redirect, {audit.links.deadCount} not at all, and{" "}
            {audit.links.elsewhereCount} point outside the four schools, where the
            database cannot decide and <span className="mono">check-routes.ts</span>{" "}
            can.
          </p>

          <LinkList what="Nothing answers these:"
                    links={audit.links.dead} shown={audit.links.deadCount} />
          <LinkList
            what={"These answer through a 301 in aab/_redirects, so they are alive. "
              + "Worth rewriting even so: an address on this site has no .html."}
            links={audit.links.redirected} shown={audit.links.redirectedCount} />
          <LinkList what="Outside the four schools, so not decided here:"
                    links={audit.links.elsewhere} shown={audit.links.elsewhereCount} />
        </>
      ) : null}
    </Surface>
  );
}

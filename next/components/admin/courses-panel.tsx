"use client";

/* ============================================================
   Courses: whether the third-party section works.

   ADMIN.md §3 C. The section is already behind `isAdmin()`; this
   is the panel that says whether it is CONNECTED, which is a
   different question and the one nobody could answer before.

   ---- every number is counted, and counted in the Worker ----

   `/api/courses/status` walks `shared/courses.data.json` and
   returns totals. It has to be the Worker rather than this file:
   `next/` may not import the value half of `shared/courses.ts`,
   because a bundle carrying it would put 1,629 Drive ids at an
   address anybody can fetch, and the page would look identical.
   `check-courses.ts` fails on that import; this component only
   ever sees totals and a dozen lesson titles.

   ---- what "not connected" looks like ----

   Two wrangler secrets make Drive reachable and the site works
   without them. So a red row here is a statement about
   configuration, not a bug, and it says which secret is missing
   rather than drawing an empty list. That is the rule
   `app/desk.test.ts` was written for.
   ============================================================ */

import { useEffect, useState } from "react";
import { Surface } from "../ui/surface";
import { Row } from "./row";

interface Status {
  courses: number;
  modules: number;
  lessons: number;
  ids: number;
  videos: number;
  missingCaptions: number;
  samples: Array<{ course: string; lesson: string }>;
  drive: boolean;
  tickets: boolean;
}

export function CoursesPanel() {
  const [state, setState] = useState<"loading" | "denied" | "error" | "ok">("loading");
  const [data, setData] = useState<Status | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/courses/status", { headers: { accept: "application/json" } })
      .then(async (r) => {
        if (!live) return;
        if (r.status === 401 || r.status === 403) { setState("denied"); return; }
        if (!r.ok) { setState("error"); return; }
        setData(await r.json() as Status);
        setState("ok");
      })
      .catch(() => { if (live) setState("error"); });
    return () => { live = false; };
  }, []);

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Courses</h3>

      {state === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {state === "denied" ? (
        <p className="ad-quiet">
          Sign in with the admin account to see this. The catalogue is one
          person&apos;s own copy of a bought course and is not published.
        </p>
      ) : null}
      {state === "error" ? (
        <p className="ad-quiet">
          The catalogue did not answer. That is the Worker, not Drive: the
          numbers below come from a file in the repository.
        </p>
      ) : null}

      {state === "ok" && data ? (
        <>
          <div className="stat-row">
            <div className="stat stat-lead" data-stat="lessons">
              <span className="k">Lessons</span>
              <span className="v">{data.lessons}</span>
              <span className="n">{data.courses} courses, {data.modules} modules</span>
            </div>
            <div className="stat" data-stat="ids">
              <span className="k">Drive ids</span>
              <span className="v">{data.ids}</span>
              <span className="n">counted, never typed</span>
            </div>
            <div className="stat" data-stat="captions">
              <span className="k">Videos without captions</span>
              <span className="v">{data.missingCaptions}</span>
              <span className="n">of {data.videos} videos</span>
            </div>
          </div>

          <div className="ad-rows">
            <Row label="Drive" state={data.drive ? "up" : "unset"}
                 note={data.drive ? "reachable"
                   : "GOOGLE_SA_EMAIL and GOOGLE_SA_KEY, and the folder shared with it"} />
            <Row label="Passes" state={data.tickets ? "up" : "unset"}
                 note={data.tickets ? "signing"
                   : "GOOGLE_CLIENT_SECRET: video and captions will not open"} />
          </div>

          {data.samples.length > 0 ? (
            <>
              <p className="ad-quiet">
                A video with no captions has a button that turns nothing on, which
                looks finished. The first {data.samples.length}:
              </p>
              <div className="ad-rows">
                {data.samples.map((s, i) => (
                  <Row key={i} label={s.lesson} state="down" note={s.course} />
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </Surface>
  );
}

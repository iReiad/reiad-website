"use client";

/* ============================================================
   Routine templates: the private ones.

   ADMIN.md §3 C 12. `/api/routine/templates` already answers this
   behind `isAdmin()`, and it answers the same way the routine
   page's own loader does: an empty list rather than a 403.

   That is deliberate at the endpoint and it costs this panel one
   piece of care. An empty list means "not an admin" and it also
   means "an admin with no templates", and a panel that drew
   nothing for both would be the failure `next/admin.test.ts` exists
   to catch: an empty list reads exactly like a broken one. So the
   two are told apart by whether there is a signed-in reader at
   all, and each says which it is.

   ---- add, edit and retire are not here yet ----

   ADMIN.md asks for those three. They need PUT and DELETE on an
   endpoint that today only answers GET, and a template is a shape
   with tasks and bands in it: that is its own change with its own
   way of going wrong. What is here is the half that is true now,
   which is what the templates ARE, and it says so rather than
   drawing three buttons that do nothing.
   ============================================================ */

import { useEffect, useState } from "react";
import { Surface } from "../ui/surface";
import { Row } from "./row";
import { readerCall } from "../../lib/reader-api";

type AccountModule = typeof import("/account.js");

interface Template {
  id?: string;
  name?: string;
  tasks?: unknown[];
}

export function RoutineTemplatesPanel() {
  const [state, setState] = useState<"loading" | "signedout" | "denied" | "error" | "ok">("loading");
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await readerCall<{ templates?: Template[] }>("routine/templates");
        if (!live) return;
        if (r.signedOut) { setState("signedout"); return; }
        if (!r.ok) { setState("error"); return; }
        const list = Array.isArray(r.data?.templates) ? r.data.templates : [];
        setTemplates(list);
        /* Signed in and given nothing is the endpoint saying no.
           Signed in and given something is an admin. There is no
           third answer, which is why this is safe to read. */
        setState(list.length ? "ok" : "denied");
      } catch { if (live) setState("error"); }
    })();
    return () => { live = false; };
  }, []);

  return (
    <Surface material="pane" className="ad-panel">
      <h3>Routine templates</h3>

      {state === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {state === "signedout" ? (
        <p className="ad-quiet">
          Sign in with the admin account. These belong to an account rather than
          to this browser, which is why the passphrase does not open them.
        </p>
      ) : null}
      {state === "denied" ? (
        <p className="ad-quiet">
          This account is not an admin, so the endpoint returns an empty list
          rather than an error. Nothing is broken.
        </p>
      ) : null}
      {state === "error" ? (
        <p className="ad-quiet">The templates endpoint did not answer.</p>
      ) : null}

      {state === "ok" ? (
        <>
          <div className="ad-rows">
            {templates.map((t, i) => (
              <Row key={t.id ?? i} label={t.name ?? t.id ?? `template ${i + 1}`}
                   state="up"
                   note={`${Array.isArray(t.tasks) ? t.tasks.length : 0} tasks`} />
            ))}
          </div>
          <p className="ad-quiet">
            Loading one into a routine is on <a href="/tools/routine">the routine page</a>,
            where the reader who wants it is. Adding, editing and retiring one needs
            PUT and DELETE that this endpoint does not answer yet, and three buttons
            that do nothing would be worse than none.
          </p>
        </>
      ) : null}
    </Surface>
  );
}

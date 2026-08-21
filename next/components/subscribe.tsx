"use client";

/* ============================================================
   subscribe.tsx: the email box under the Insights hub's RSS line.

   Confirmed opt-in: the address is stored as pending until the
   link in the email is clicked, and every mail carries a one-click
   unsubscribe. `/api/subscribers` is where that happens; this is
   the box and the four things it can say back.

   ---- it ships hidden, and only this unhides it ----

   A site with no database shows the RSS line and nothing that
   looks as though it might work, so the form is `hidden` in the
   HTML the server sends and stays hidden until `backendReady()`
   has answered. That is a fact about a deployment rather than
   about a reader, so the server cannot know it and must not
   guess: rendering the form open and closing it afterwards would
   flash a box that does not work.

   ---- what this replaces ----

   The second half of `archive/modules/hub.js`, which found the
   form and the status line by id and wrote `hidden`,
   `textContent`, `innerHTML` and `className` into them. The `innerHTML` was the
   confirm link, and it is ordinary JSX here: one fewer place on
   this site where a string becomes markup.
   ============================================================ */

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { runtimeModule } from "./account/runtime";

type ApiModule = typeof import("/api.js");

const apiModule = () => runtimeModule<ApiModule>("/api.js");

/** What the line under the box says, and how it is coloured.
    `gate-msg mono` plus `ok` or `err` is the site's own set. */
type Said =
  | { kind: "" | "ok" | "err"; text: string }
  | { kind: "ok"; confirmUrl: string };

const WORKING: Said = { kind: "", text: "Signing you up…" };
const ALREADY: Said = { kind: "ok", text: "You're already on the list." };
const CHECK: Said = { kind: "ok", text: "Check your email to confirm." };
const FAILED: Said = { kind: "err", text: "That didn't work, the RSS feed always does." };

export function SubscribeBox() {
  const [ready, setReady] = useState(false);
  const [sent, setSent] = useState(false);
  const [said, setSaid] = useState<Said | null>(null);

  useEffect(() => {
    let live = true;
    apiModule()
      .then((api) => api.backendReady())
      .catch(() => false)
      .then((ok) => { if (live && ok) setReady(true); });
    return () => { live = false; };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setSaid(WORKING);

    const api = await apiModule().catch(() => null);
    const result = await api?.subscribe({ ...fields, source: "insights" });

    if (result?.already) { setSaid(ALREADY); return; }
    if (!result?.ok) { setSaid(FAILED); return; }

    /* The form goes rather than emptying, because there is
       nothing left to do in it: the next step is in an inbox. */
    setSent(true);
    const url = typeof result.confirmUrl === "string" ? result.confirmUrl : "";
    setSaid(url ? { kind: "ok", confirmUrl: url } : CHECK);
  };

  return (
    <>
      <form className="subscribe-form" id="subscribe-form"
            hidden={!ready || sent} onSubmit={submit}>
        <Field id="sub-email" name="email" type="email" required hideLabel
               label="Email address" placeholder="you@example.com"
               autoComplete="email" />
        {/* Never a labelled field, and never `<Field>`: a box a
            person can see is a box a person fills in. */}
        <input className="honeypot" type="text" name="website" tabIndex={-1}
               autoComplete="off" aria-hidden="true" />
        <Button kind="solid" type="submit">Email me new pieces</Button>
      </form>

      {/* Announced rather than only shown, and empty until there
          is something to say so it is not read out on load. */}
      <p className={`gate-msg mono${said?.kind ? ` ${said.kind}` : ""}`}
         id="sub-msg" role="status" style={{ marginTop: "8px" }}>
        {said === null ? "" : "confirmUrl" in said ? (
          <>
            Almost: <a href={said.confirmUrl}>confirm your address</a> to finish.
          </>
        ) : said.text}
      </p>
    </>
  );
}

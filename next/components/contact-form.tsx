"use client";

/* ============================================================
   contact-form.tsx: the contact form, and the three ways sending
   it can go.

   Best first, and a visitor sees the same thing in every case:

     1. the site's own `/api/enquiries`, so the message becomes a
        row somebody can track rather than an email that gets
        buried
     2. Web3Forms, exactly as before, if the database is not
        connected
     3. NO JAVASCRIPT AT ALL: the form POSTs to Web3Forms on its
        own and their page confirms it

   ---- the third one is why the markup is the markup ----

   `action`, `method` and the hidden fields are rendered by the
   route rather than assembled here, and `onSubmit` only ever
   prevents a submit it is about to do better. Take this component
   off the page and the form still works. That is not a nicety on
   a contact form: it is the one page where a reader with a broken
   script is trying to reach a person.

   ---- what this replaces ----

   `aab/contact-form.js`, which was an inline module at the bottom
   of `aab/contact.html` before that page was a route, and a
   served module afterwards because a route cannot carry an inline
   module without putting the lines inside a template string.
   Neither is true any more: the form is a component and its
   handler is a function beside it.

   It found the form, the button and the status line by id and
   wrote `textContent` and `className` into them. Three ids, one
   of which the route had to keep and comment. There are none now:
   `#form-status` stays because a live region needs to be found by
   anything announcing into it, and because the test names it.
   ============================================================ */

import { useCallback, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { runtimeModule } from "./account/runtime";

type ApiModule = typeof import("/api.js");

const apiModule = () => runtimeModule<ApiModule>("/api.js");

type State = { text: string; kind: "" | "ok" | "err" };

const SENT: State = {
  text: "Sent: thanks! I usually reply within one business day.",
  kind: "ok",
};
const FAILED: State = {
  text: "Couldn't send just now: please email i@reiad.co.uk instead.",
  kind: "err",
};

export function ContactForm({ action, children }: {
  /** Where the form posts with no JavaScript, and the fallback
      here. Rendered by the route on to the `<form>` itself, so it
      is the same address either way. */
  action: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setState({ text: "Sending…", kind: "" });

    const fields = new FormData(form);
    const value = (name: string) => String(fields.get(name) ?? "");

    try {
      const api = await apiModule().catch(() => null);
      if (api && await api.backendReady()) {
        const result = await api.sendEnquiry({
          name: value("name"), email: value("email"),
          message: value("message"), kind: "general",
        });
        if (result?.ok) {
          form.reset();
          setState(SENT);
          return;
        }
      }

      /* Web3Forms, with the form's own action and its own fields,
         which is exactly what the browser would have posted. */
      const res = await fetch(action, {
        method: "POST",
        body: fields,
        headers: { Accept: "application/json" },
      });
      const json = await res.json() as { success?: boolean; message?: string };
      if (!json.success) throw new Error(json.message || "failed");
      form.reset();
      setState(SENT);
    } catch {
      setState(FAILED);
    } finally {
      setBusy(false);
    }
  }, [action]);

  return (
    /* `--measure` wide, which is the site's answer for a box
       somebody types prose into: the comment form under a piece
       is the same, and the settings form on the account page is
       620px, which is what 66ch comes to. Full width, a message
       field runs to 850px and the eye loses the start of the line
       on the way back, and it disagrees with the lede two
       paragraphs above it that wraps at the measure. */
    <form action={action} method="POST" onSubmit={submit}
          className="grid max-w-[var(--measure)] gap-4">
      {children}

      <Button type="submit" kind="solid" size="lg" disabled={busy}>
        Send message
      </Button>

      {/* Announced rather than only shown. `role="status"` with
          `aria-live="polite"` is what makes "Sent" reach somebody
          who cannot see the line change, and it is empty until
          there is something to say so it is not read on load. */}
      <p id="form-status" role="status" aria-live="polite"
         className={`text-t2 ${state?.kind === "ok" ? "text-green"
           : state?.kind === "err" ? "text-danger" : "text-ink-soft"}`}>
        {state?.text ?? ""}
      </p>
    </form>
  );
}

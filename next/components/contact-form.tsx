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

   `archive/modules/contact-form.js`, which was an inline module at
   the bottom of `aab/contact.html` before that page was a route,
   and a served module afterwards because a route cannot carry an
   inline module without putting the lines inside a template
   string.
   Neither is true any more: the form is a component and its
   handler is a function beside it.

   It found the form, the button and the status line by id and
   wrote `textContent` and `className` into them. Three ids, one
   of which the route had to keep and comment. There are none now:
   `#form-status` stays because a live region needs to be found by
   anything announcing into it, and because the test names it.
   ============================================================ */

import { useCallback, useState, type FormEvent } from "react";
import { Field, Select, TextArea } from "./ui/field";
import { Button } from "./ui/button";
import { runtimeModule } from "./account/runtime";

type ApiModule = typeof import("/api.js");

const apiModule = () => runtimeModule<ApiModule>("/api.js");

const PROMPTS: Record<string, string> = {
  general: "Tell me what you need. For a project, include the goal and deliverables; for a role, the job link; for a reading question, the page link.",
  project: "What decision should this help you make? Include the deliverables, available data, budget range and any examples.",
  hiring: "Share the role or job link, team, location or remote arrangement, and your hiring timeline.",
  reader: "Link to the page or lesson, tell me where you got stuck, and what you have tried. Bangla or English is welcome.",
};

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
  const [kind, setKind] = useState("general");

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
          message: value("message") + (value("deadline")
            ? `\n\nRequested deadline: ${value("deadline")}` : ""),
          kind: value("kind") || "general",
          website: value("botcheck"),
        });
        if (result?.ok) {
          form.reset();
          setKind("general");
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
      setKind("general");
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
      <Field id="contact-name" name="name" label="Name" type="text"
             required autoComplete="name" maxLength={120} placeholder="Your name" />
      <Field id="contact-email" name="email" label="Email" type="email"
             required autoComplete="email" hint="So I can reply. Nothing else is done with it."
             placeholder="you@example.com" />
      <Select id="contact-kind" name="kind" label="Enquiry type (optional)"
              value={kind} onChange={(event) => setKind(event.target.value)}>
        <option value="general">General enquiry / not sure</option>
        <option value="project">Client: a project</option>
        <option value="hiring">Recruiter: a role</option>
        <option value="reader">Reader: a question</option>
      </Select>
      <Field id="contact-deadline" name="deadline" label="Deadline (optional)"
             type="date" hint="A preferred date, if you have one. I will confirm availability in my reply." />
      <TextArea id="contact-message" name="message" label="Message" required
                minLength={10} maxLength={7800} rows={6}
                hint={<span aria-live="polite">{PROMPTS[kind]}</span>}
                placeholder="A few lines about what you need." />

      <Button type="submit" kind="solid" size="lg" disabled={busy}>
        Send message
      </Button>

      {/* Announced rather than only shown. `role="status"` with
          `aria-live="polite"` is what makes "Sent" reach somebody
          who cannot see the line change, and it is empty until
          there is something to say so it is not read on load. */}
      <p id="form-status" role="status" aria-live="polite"
         className={`text-t4 ${state?.kind === "ok" ? "text-green"
           : state?.kind === "err" ? "text-danger" : "text-ink-soft"}`}>
        {state?.text ?? ""}
      </p>
    </form>
  );
}

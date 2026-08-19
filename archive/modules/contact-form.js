/* ============================================================
   contact-form.js: the contact form, when there is JavaScript.

   It was an inline module at the bottom of `aab/contact.html`,
   which is where a page's own behaviour goes while the page is a
   file somebody wrote by hand. archive/TRANSITION.md Stage 11.5 makes
   that page a Next.js route, and a route cannot carry an inline
   module without putting these lines inside a template string,
   unreadable and unlintable. Same reasoning as `hub.js`.

   The form works without any of this: it POSTs to Web3Forms on
   its own and their page confirms it, which is the third of the
   three ways below and the one that needs nothing from here.
   ============================================================ */

/* Three ways this can go, best first:
     1. the site's own /api/enquiries: the message becomes a row you
        can track, not just an email that gets buried
     2. Web3Forms, exactly as before, if the database isn't connected
     3. no JavaScript at all: the form still POSTs to Web3Forms and
        their page confirms it
   The visitor sees the same thing in every case. */
import { sendEnquiry, backendReady } from "/api.js";

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const button = document.getElementById("form-submit");
const useApi = await backendReady();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "";
  status.textContent = "Sending…";
  button.disabled = true;

  const data = Object.fromEntries(new FormData(form));
  const done = () => {
    form.reset();
    status.className = "ok";
    status.textContent = "Sent: thanks! I usually reply within one business day.";
  };

  try {
    if (useApi) {
      const result = await sendEnquiry({
        name: data.name, email: data.email, message: data.message, kind: "general",
      });
      if (result?.ok) return done();
    }
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "failed");
    done();
  } catch {
    status.className = "err";
    status.textContent = "Couldn't send just now: please email i@reiad.co.uk instead.";
  } finally {
    button.disabled = false;
  }
});

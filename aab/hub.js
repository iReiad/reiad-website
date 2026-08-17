/* ============================================================
   hub.js: the two pieces of behaviour the Insights index needs
   that are not the site's own furniture.

   The subscribe box, and the topic chips above the article cards.
   Both were an inline <script type="module"> at the bottom of
   insights.html, which is where a page's own behaviour goes when
   the page is a file somebody wrote by hand. archive/TRANSITION.md Stage
   11.1 makes that page a Next.js route, and a route cannot carry
   an inline module without a second copy of these lines living
   inside a template string, unreadable and unlintable.

   So they moved here, and both pages load this one file. That is
   the same answer `shared/look.js` is to the same question, one
   floor down: the thing that must not be written twice is the
   thing that has to behave the same in two places.

   Everything in here is defensive about what it finds, because
   the two pages hand it different DOMs: the hand-written page
   builds its chips in the browser (app.js does it, from the same
   counts) and the rendered one arrives with them already in the
   HTML. Neither page has to know which.
   ============================================================ */

import { backendReady, subscribe } from "/api.js";

/* ---------- the topic chips ----------

   Only when the chips came down in the HTML, which is the case
   only on the rendered hub. On the hand-written page they are
   built after a fetch by `initTopicFilter()` in app.js, which
   attaches its own listener as it goes; binding a second one here
   would toggle every card twice. The attribute is how the
   rendered page says "these are mine, and nothing else is coming
   for them".

   The chips do not filter the list on the server, deliberately.
   Filtering by topic is a way of looking at a page you already
   have, not a different page: a round trip for it would be slower
   than the reader's own eyes. */
function chips() {
  const row = document.querySelector("[data-filter-ready]");
  const cards = row?.closest("section")?.querySelector(".cards");
  if (!row || !cards) return;

  row.addEventListener("click", (event) => {
    const pressed = event.target.closest("[data-topic]");
    if (!pressed) return;

    const topic = pressed.dataset.topic;
    row.querySelectorAll("[data-topic]").forEach((chip) =>
      chip.setAttribute("aria-pressed", String(chip === pressed)));

    cards.querySelectorAll("[data-topics]").forEach((card) => {
      card.hidden = topic !== "" && !card.dataset.topics.split("|").includes(topic);
    });
  });
}

/* ---------- the subscribe box ----------

   Confirmed opt-in: the address is stored as pending until the
   link in the email is clicked, and every mail carries a one-click
   unsubscribe. The form is hidden in the markup and only ever
   unhidden here, so a site with no database shows the RSS line and
   nothing that looks like it might work. */
async function subscribeBox() {
  const form = document.getElementById("subscribe-form");
  const msg = document.getElementById("sub-msg");
  if (!form || !msg || !(await backendReady())) return;

  form.hidden = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    msg.textContent = "Signing you up…";
    msg.className = "gate-msg mono";

    const result = await subscribe({ ...data, source: "insights" });
    if (result?.already) {
      msg.textContent = "You're already on the list.";
      msg.className = "gate-msg mono ok";
    } else if (result?.ok) {
      form.hidden = true;
      msg.innerHTML = result.confirmUrl
        ? `Almost: <a href="${result.confirmUrl}">confirm your address</a> to finish.`
        : "Check your email to confirm.";
      msg.className = "gate-msg mono ok";
    } else {
      msg.textContent = "That didn't work, the RSS feed always does.";
      msg.className = "gate-msg mono err";
    }
  });
}

chips();
subscribeBox();

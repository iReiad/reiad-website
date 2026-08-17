/* ============================================================
   schools/hub.js: the parts of a school's front page that are
   the same drawing in every school.

   ---- why this file exists ----

   Three hubs, 291, 247 and 240 lines, and ten functions each in
   the same order doing the same thing. Four of those ten were
   identical but for the Bangla in them: the resume card's
   markup, the bar at the top, the reset button and the boot
   sequence. Three more were helpers copied verbatim, `bn`, `el`
   and the progress ring, so the ring was drawn by three files
   and a change to its stroke width was three edits or a school
   that quietly looked different.

   What is NOT here is each school's ladder row. That is where
   the schools genuinely differ: a Stufe shows sections and a
   practice book, a ধাপ shows days, a term shows neither, and
   folding three of those into one function with a config would
   be a bigger knot than the three readable copies. A row is
   drawn by the school; everything around it is drawn here.

   The money school is not a caller: its hub is a Next.js route
   and its ticks are React. These three still need a browser
   module because their practice books are generated static HTML.
   ============================================================ */

/** Bangla numerals, so a counter on a Bangla page doesn't read
    half in one script and half in another. */
export const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/** An element, its properties, and its children in one call.
    Falsy children are dropped so a caller can write a condition
    inline instead of building an array. */
export const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/** The little ring showing a stage's progress. One drawing for
    four schools, deliberately: one visual language. */
export function ring(pct) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 36 36");
  svg.setAttribute("class", "ring");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    `<circle class="ring-track" cx="18" cy="18" r="${r}" fill="none" stroke-width="3"/>` +
    `<circle class="ring-fill" cx="18" cy="18" r="${r}" fill="none" stroke-width="3"` +
    ` stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"` +
    ` transform="rotate(-90 18 18)" stroke-linecap="round"/>`;
  return svg;
}

/** Where a learner stands on the ladder, in words. Nothing is
    ever actually locked: a stage they haven't earned simply
    says so. */
export const STATE_LABEL = {
  done: "শেষ",
  now: "এখানে আছেন",
  next: "পরবর্তী",
  past: "এড়িয়ে গেছেন",
  later: "পরে",
};

/** The resume card. The school decides WHAT to resume, which is
    the interesting half and is different in each of them; this
    draws it.

    `target` is { label, title, where, url, art, pct } and `icon`
    is the school's own drawing set. Pass no target to hide the
    card, which is what a first-time visitor should see: a clean
    start, not an empty box telling them they have done nothing. */
export function paintResume(host, target, icon) {
  if (!host) return;
  if (!target) {
    host.hidden = true;
    return;
  }

  host.hidden = false;
  host.className = "resume";
  host.textContent = "";
  host.append(
    el("span", { className: "resume-art", innerHTML: icon(target.art) }),
    el("div", { className: "resume-text" },
      el("span", { className: "mono resume-label", textContent: target.label }),
      el("strong", { className: "bn-h", textContent: target.title }),
      el("span", { className: "resume-where", textContent: target.where }),
    ),
    el("div", { className: "resume-actions" },
      el("a", { className: "btn btn-solid", href: target.url, textContent: "চালিয়ে যান →" }),
      el("span", { className: "mono resume-pct", textContent: `${bn(target.pct)}%` }),
    ),
  );
}

/** The bar across the top, and the reset button that appears
    beside it only once there is something to reset. */
export function paintBar(school, { pct, count, anything }) {
  const line = document.getElementById(`${school}-progress`);
  if (!line) return;
  line.querySelector(".track i").style.width = `${pct}%`;
  line.querySelector(".count").textContent = count;

  const reset = document.getElementById(`${school}-reset`);
  if (reset) reset.hidden = !anything;
}

/** The reset button. Asks first, in the school's own words. */
export function wireReset(school, question, resetAll) {
  const reset = document.getElementById(`${school}-reset`);
  if (!reset) return;
  reset.addEventListener("click", () => {
    if (!confirm(question)) return;
    resetAll();
  });
}

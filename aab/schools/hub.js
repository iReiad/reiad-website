/* schools/hub.js: the parts of a school's front page that are
   the same drawing in every school. Shared by deutsch, english
   and quran, so the ring is drawn once rather than three times.

   What is NOT here is each school's LADDER ROW, which is where
   the schools genuinely differ: a Stufe shows sections and a
   practice book, a ধাপ shows days, a term shows neither. A row
   is drawn by the school; everything around it is drawn here.
   The money school is not a caller: its hub is a route and its
   ticks are React. */

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
    four schools, deliberately: one visual language.

    The DOM here is `<Ring>` in `next/components/deck.tsx`, node
    for node, and that is the point of it rather than a
    coincidence. There were two rings: this one put `.ring` on
    the SVG and turned it with a `transform` attribute, deck's
    wraps the SVG in a span and turns it with a `rotate` in the
    stylesheet. Both were styled by rules called `.ring`, in two
    layers, and deck's came later and won. What kept this one
    looking right was that `.ring svg` did not match an SVG that
    was itself the `.ring`, so it never got a second rotation.

    Relying on a selector not matching is not a design. One
    shape, one rule, and the rotation is the stylesheet's in both
    places now.

    The class is `progress-ring`, not `ring`: `ring` is a Tailwind
    utility and this file is one of the sources its scanner reads,
    so the name drew a 1px square around every ring on the site. */
export function ring(pct) {
  const r = 19;
  const c = 2 * Math.PI * r;
  const wrap = document.createElement("span");
  wrap.className = "progress-ring";
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML =
    `<svg viewBox="0 0 44 44">` +
    `<circle class="ring-track" cx="22" cy="22" r="${r}" fill="none" stroke-width="4"/>` +
    `<circle class="ring-fill" cx="22" cy="22" r="${r}" fill="none" stroke-width="4"` +
    ` stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/>` +
    `</svg>`;
  return wrap;
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

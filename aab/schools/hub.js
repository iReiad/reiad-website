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

/** The little ring showing a stage's progress. THE DOM HERE IS
    `<Ring>` IN `next/components/deck.tsx`, NODE FOR NODE: two
    shapes both styled by rules called `.ring` in two layers is a
    design that depends on a selector not matching. The rotation
    is the stylesheet's in both places.

    The class is `progress-ring`, not `ring`: `ring` is a Tailwind
    utility and this file is one of the sources its scanner reads,
    so that name drew a 1px square around every ring on the site. */
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
  settle(line);

  const reset = document.getElementById(`${school}-reset`);
  if (reset) reset.hidden = !anything;
}

/** The first value a bar shows is drawn at once and only the ones
    after it slide: the stylesheet transitions a bar's fill only
    under `data-live`, which this sets a frame after the first paint.
    Without it every page load swept the reader's progress in from
    nought, which read as the bar jumping. */
/** `requestAnimationFrame` where there is one: the tests build these
    pages in linkedom, which has no frames. */
const nextFrame = (fn) =>
  (typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout)(fn);

export function settle(bar) {
  if (!bar || bar.dataset.live !== undefined) return;
  nextFrame(() => nextFrame(() => { bar.dataset.live = ""; }));
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

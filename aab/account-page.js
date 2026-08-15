/* ============================================================
   account-page.js: the one page that is about the reader.

   Everything else on this site is about the writing. This is where
   somebody can see what signing in actually got them, set the few
   things it can act on, and leave.

   It is deliberately plain about what is kept. A page that says
   "we value your privacy" and lists nothing is worth less than a
   page that lists four keys and a count.

   THE RULE THIS PAGE IS BUILT AROUND

   Nothing is asked for that the site does not then use. Three
   questions, and each one changes something the reader can point
   at afterwards:

     the name      appears beside anything they write
     the courses   the home page's band offers them first, and
                   offers a followed course they have not started
     the pace      the last seven days are counted against it here

   A fourth question would be a form. The reason there is no
   birthday, no country and no "how did you hear about us" is that
   nothing on this site would do anything with them.

   And the answers start filled in. Somebody who has read three
   English parts on this device arrives with English ticked: the
   setup card is there to confirm what the site already knows and
   to catch what it cannot know, which is what they are about to
   start.

   TRANSITION.md, Stages 5 and 6.
   ============================================================ */

import { current, signOut, getProfile, saveProfile } from "/account.js";
import { sync, forgetOnAccount } from "/sync.js";
import { COURSES } from "/content.js";
import { daysIn, run } from "/streak.js";

const $ = (sel) => document.querySelector(sel);

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

const say = (node, text, state) => {
  if (!node) return;
  node.textContent = text ?? "";
  if (state) node.dataset.state = state;
  else delete node.dataset.state;
};

/* How often somebody means to practise. The ids are what goes in
   the column; the constraint in the migration holds them to
   exactly these three. */
const PACES = [
  { id: "daily", label: "Every day", note: "or as near as life allows" },
  { id: "often", label: "Most days", note: "four or five a week" },
  { id: "sometimes", label: "When I can", note: "no particular rhythm" },
];

const PACE_TARGET = { daily: 7, often: 5, sometimes: 0 };

/* ============================================================
   What this account keeps, counted rather than described
   ============================================================ */

/* The same keys sync.js carries, in the words a reader would use.
   Counting them here rather than importing a number from each
   course keeps this page honest even if a course changes shape:
   it reports what is actually stored. */
const KEPT = [
  { key: "learn-read", course: "learn", one: "lesson read", many: "lessons read" },
  { key: "learn-last", course: "learn", single: true },
  { key: "deutsch-read", course: "deutsch", one: "part read", many: "parts read" },
  { key: "deutsch-days", course: "deutsch", one: "practice day done", many: "practice days done" },
  { key: "english-read", course: "english", one: "part read", many: "parts read" },
  { key: "english-days", course: "english", one: "practice day done", many: "practice days done" },
  { key: "quran-done", course: "quran", one: "day done", many: "days done" },
];

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
};

function countOf(entry) {
  const value = readLocal(entry.key);
  if (value === undefined || value === null) return 0;
  if (entry.single) return value?.id ? 1 : 0;
  return Array.isArray(value) ? value.length : 0;
}

/** Which courses this device has any progress in at all. */
const startedCourses = () =>
  new Set(KEPT.filter((entry) => countOf(entry) > 0).map((entry) => entry.course));

const courseName = (id) => {
  const course = COURSES.find((c) => c.id === id);
  return course ? `${course.bn} · ${course.en}` : id;
};

function paintKept() {
  const host = $("#account-kept");
  if (!host) return;

  /* One card per course, not per key, because "German: 14 parts, 9
     practice days" is a sentence and four rows of storage keys is
     an audit log. */
  const byCourse = new Map();
  for (const entry of KEPT) {
    const count = countOf(entry);
    if (!count) continue;
    if (!byCourse.has(entry.course)) byCourse.set(entry.course, []);
    /* "1 parts read" is the sort of thing that makes a page feel
       generated rather than written, and it is one ternary. */
    byCourse.get(entry.course).push(
      entry.single ? "where you were"
        : `${count} ${count === 1 ? entry.one : entry.many}`
    );
  }

  if (!byCourse.size) {
    host.replaceChildren(el("p", { className: "muted", textContent:
      "Nothing yet. Open a lesson and tick it off, and it will appear here "
      + "and on your other devices." }));
    return;
  }

  host.replaceChildren(...[...byCourse].map(([id, bits]) =>
    el("div", { className: "cell" },
      el("h3", { textContent: courseName(id) }),
      el("p", { textContent: bits.join(" · ") })
    )));
}

/* ---------- the last seven days ----------

   Facts, and no more than facts. It says what happened and, if a
   pace was set, what was asked for. It never says a run has
   ended, never counts down to anything, and there is nothing
   here that turns red. */
function paintWeek(pace) {
  const line = $("#account-week");
  if (!line) return;

  const week = daysIn(7);
  const streak = run();

  if (!week && !streak) { line.hidden = true; return; }

  const bits = [week === 1
    ? "One of the last seven days had something on it."
    : `${week} of the last seven days had something on them.`];

  if (streak >= 2) bits.push(`Today makes ${streak} in a row.`);

  const target = PACE_TARGET[pace] ?? 0;
  if (target && week >= target) bits.push("That is the pace you set.");
  else if (target) bits.push(`You said you were aiming for ${
    pace === "daily" ? "every day" : "most days"}.`);

  line.hidden = false;
  line.textContent = bits.join(" ");
}

/* ============================================================
   The three questions
   ============================================================ */

function buildCourses(chosen, started) {
  const host = $("#account-courses");
  if (!host) return;

  host.replaceChildren(...COURSES.map((course) => {
    const id = `course-${course.id}`;
    const box = el("input", {
      type: "checkbox", id, value: course.id,
      checked: chosen.has(course.id),
    });
    return el("label", { className: "choice", htmlFor: id },
      box,
      el("span", { className: "choice-body" },
        el("strong", { className: "bn-h", textContent: `${course.bn} · ${course.en}` }),
        /* Said out loud, because a box that is already ticked
           without explanation reads as a default somebody chose
           for you. */
        started.has(course.id)
          ? el("small", { textContent: "you have already started this" })
          : el("small", { textContent: course.blurb ?? "" })
      )
    );
  }));
}

function buildPace(chosen) {
  const host = $("#account-pace");
  if (!host) return;

  host.replaceChildren(...PACES.map((pace) => {
    const id = `pace-${pace.id}`;
    return el("label", { className: "choice choice-pace", htmlFor: id },
      el("input", { type: "radio", name: "pace", id, value: pace.id,
        checked: chosen === pace.id }),
      el("span", { className: "choice-body" },
        el("strong", { textContent: pace.label }),
        el("small", { textContent: pace.note })
      )
    );
  }));
}

const chosenCourses = () =>
  [...document.querySelectorAll("#account-courses input:checked")].map((b) => b.value);

const chosenPace = () =>
  document.querySelector("#account-pace input:checked")?.value ?? "";

/* ============================================================
   The page, in its two states
   ============================================================ */

function paintIdentity() {
  const user = current();
  $("#account-out").hidden = !!user;
  $("#account-in").hidden = !user;
  if (!user) return;

  $("#account-hello").textContent = user.name ? `Hello, ${user.name}.` : "Hello.";
  $("#account-email").textContent = user.email ?? "";
  const field = $("#account-name");
  if (field && !field.value) field.value = user.name ?? "";
  paintKept();
}

/** Setup asks; settings tells. Same form either way. */
function frame(isSetup) {
  say($("#settings-label"), isSetup ? "Set up your account" : "Your settings");
  $("#settings-intro").textContent = isSetup
    ? "Three things, and none of them required. Some of it is filled in "
      + "already from what this device knows. Change what is wrong, tick "
      + "what you are about to start, and this becomes your settings page."
    : "Three things, none of them required. You can change any of them "
      + "whenever you like.";
  $("#settings-skip").hidden = !isSetup;
  $("#settings-form").dataset.mode = isSetup ? "setup" : "settings";
}

let profile = null;

async function boot() {
  paintIdentity();
  if (!current()) return;

  /* Filled in from the device first, so the form is usable before
     the network answers and stays usable if it never does. */
  const started = startedCourses();
  buildCourses(started, started);
  buildPace("");
  paintWeek("");

  /* The profile row is what counts. The token carries whatever
     Google said at sign-in, which may be older. */
  profile = await getProfile();
  if (profile) {
    const field = $("#account-name");
    if (profile.display_name && field) field.value = profile.display_name;

    /* Union, not replacement. Somebody who follows German on their
       laptop and has just started English on this phone should see
       both ticked, not have the phone quietly drop German. */
    const following = new Set([...(profile.following ?? []), ...started]);
    buildCourses(following, started);
    buildPace(profile.pace ?? "");
    frame(!profile.setup_at);
    paintWeek(profile.pace ?? "");
  } else {
    frame(false);
  }

  // A fresh sync, so the counts on this page are not yesterday's.
  const done = await sync();
  say($("#account-synced"), done
    ? "Up to date with your other devices, as of a moment ago."
    : "Could not reach the account just now, so these are this device's numbers.");
  paintKept();
  paintWeek(profile?.pace ?? "");
}

/* ---------- saving ---------- */

async function save(patch, note) {
  const button = $("#settings-form button[type=submit]");
  button.disabled = true;
  try {
    await saveProfile(patch);
    profile = { ...profile, ...patch };
    say($("#settings-note"), note, "ok");
    paintIdentity();
    paintWeek(profile.pace ?? "");
    frame(false);
    return true;
  } catch (err) {
    say($("#settings-note"), err.message || "That did not save.", "warn");
    return false;
  } finally {
    button.disabled = false;
  }
}

$("#settings-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#account-name").value.trim();
  if (!name) { say($("#settings-note"), "A name cannot be empty.", "warn"); return; }

  await save({
    display_name: name,
    following: chosenCourses(),
    pace: chosenPace(),
    /* Answered, so stop asking. Set on the first save whether or
       not anything was actually ticked: somebody who saves a name
       and nothing else has still been through setup. */
    setup_at: new Date().toISOString(),
  }, "Saved.");
});

/* "Not now" is a real answer and is recorded as one. Without
   this it would ask again on every visit, which is how a polite
   question becomes nagging. */
$("#settings-skip")?.addEventListener("click", async () => {
  await save({ setup_at: new Date().toISOString() },
    "Fine. Everything above is here whenever you want it.");
});

/* ---------- leaving ---------- */

$("#account-signin")?.addEventListener("click", () => {
  document.querySelector(".account-btn")?.click();
});

$("#account-signout")?.addEventListener("click", async () => {
  await signOut();
  paintIdentity();
});

$("#account-forget")?.addEventListener("click", async () => {
  const note = $("#exit-note");
  if (!confirm("Remove everything this account has saved?\n\n"
    + "What is stored on this device stays. This cannot be undone.")) return;

  const gone = await forgetOnAccount();
  say(note, gone
    ? "Removed. This device keeps its own copy until you clear it in each course."
    : "That did not work. Nothing was removed.", gone ? "ok" : "warn");
});

document.addEventListener("account:changed", paintIdentity);
boot();

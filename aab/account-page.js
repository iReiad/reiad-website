/* ============================================================
   account-page.js: the one page that is about the reader.

   Everything else on this site is about the writing. This is where
   somebody can see what signing in actually got them, change the
   one thing it stores about them, and leave.

   It is deliberately plain about what is kept. A page that says
   "we value your privacy" and lists nothing is worth less than a
   page that lists four keys and a count.

   TRANSITION.md, Stage 5 and Stage 6.
   ============================================================ */

import { current, signOut, getProfile, setDisplayName } from "/account.js";
import { sync, forgetOnAccount } from "/sync.js";

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

/* ============================================================
   What this account keeps, counted rather than described
   ============================================================ */

/* The same keys sync.js carries, in the words a reader would use.
   Counting them here rather than importing a number from each
   school keeps this page honest even if a school changes shape:
   it reports what is actually stored. */
const KEPT = [
  { key: "learn-read", school: "The money ladder", unit: "lessons read" },
  { key: "learn-last", school: "The money ladder", unit: "bookmark", single: true },
  { key: "deutsch-read", school: "German", unit: "parts read" },
  { key: "deutsch-days", school: "German", unit: "practice days done" },
  { key: "english-read", school: "English", unit: "parts read" },
  { key: "english-days", school: "English", unit: "practice days done" },
  { key: "quran-done", school: "Qur'anic Arabic", unit: "days done" },
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

function paintKept() {
  const host = $("#account-kept");
  if (!host) return;

  /* One card per school, not per key, because "German: 14 parts, 9
     practice days" is a sentence and four rows of storage keys is
     an audit log. */
  const bySchool = new Map();
  for (const entry of KEPT) {
    const count = countOf(entry);
    if (!count) continue;
    if (!bySchool.has(entry.school)) bySchool.set(entry.school, []);
    bySchool.get(entry.school).push(
      entry.single ? "where you were" : `${count} ${entry.unit}`
    );
  }

  if (!bySchool.size) {
    host.replaceChildren(el("p", { className: "muted", textContent:
      "Nothing yet. Open a lesson and tick it off, and it will appear here "
      + "and on your other devices." }));
    return;
  }

  host.replaceChildren(...[...bySchool].map(([school, bits]) =>
    el("div", { className: "cell" },
      el("h3", { textContent: school }),
      el("p", { textContent: bits.join(" · ") })
    )));
}

/* ============================================================
   The page, in its two states
   ============================================================ */

function paint() {
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

async function boot() {
  paint();
  if (!current()) return;

  /* The name on the profile row is the one that counts; the token
     carries whatever Google said when you signed in, which may be
     older. */
  const profile = await getProfile();
  const field = $("#account-name");
  if (profile?.display_name && field) field.value = profile.display_name;

  // A fresh sync, so the counts on this page are not yesterday's.
  const done = await sync();
  say($("#account-synced"), done
    ? "Up to date with your other devices, as of a moment ago."
    : "Could not reach the account just now, so these are this device's numbers.");
  paintKept();
}

/* ---------- the name ---------- */

$("#name-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const field = $("#account-name");
  const note = $("#name-note");
  const name = field.value.trim();

  if (!name) { say(note, "A name cannot be empty.", "warn"); return; }

  const button = e.target.querySelector("button");
  button.disabled = true;
  try {
    await setDisplayName(name);
    say(note, "Saved.", "ok");
    paint();
  } catch (err) {
    say(note, err.message || "That did not save.", "warn");
  } finally {
    button.disabled = false;
  }
});

/* ---------- leaving ---------- */

$("#account-signin")?.addEventListener("click", () => {
  document.querySelector(".account-btn")?.click();
});

$("#account-signout")?.addEventListener("click", async () => {
  await signOut();
  paint();
});

$("#account-forget")?.addEventListener("click", async () => {
  const note = $("#exit-note");
  if (!confirm("Remove everything this account has saved?\n\n"
    + "What is stored on this device stays. This cannot be undone.")) return;

  const gone = await forgetOnAccount();
  say(note, gone
    ? "Removed. This device keeps its own copy until you clear it in each school."
    : "That did not work. Nothing was removed.", gone ? "ok" : "warn");
});

document.addEventListener("account:changed", paint);
boot();

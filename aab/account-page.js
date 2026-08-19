/* ============================================================
   account-page.ts: what is left of the account page.

   Nine sections of this page were drawn from here and are
   components under `next/components/account/` now. Four jobs
   remain, and each is here for a reason rather than because it
   has not been got to yet:

     1. WHICH HALF OF THE PAGE SHOWS. `#account-out` and
        `#account-in` are two branches of one route, and which one
        a reader gets is not a fact the server has: it is a token
        in this browser. Both start hidden and this reveals one.
     2. THE EXCHANGE, and the sentence about it. `sync()` writes
        the account's rows on to this device, and every component
        that counts anything redraws on the `sync:done` it fires.
        Something has to start it, once, and this is the only
        script the page loads.
     3. TAKE A COPY. One button, one blob, and it needs the whole
        account at once, which no single component has.
     4. LEAVING: sign out, and erase everything.

   THE ORDER IN (2) IS LOAD-BEARING AND IS THE OPPOSITE OF WHAT IT
   WAS. This page used to count localStorage immediately and
   correct itself when the network answered, because localStorage
   was a real second record that might be ahead of the account. It
   is the account's MIRROR now, so anything drawn before the
   exchange is the last visit's numbers, about to move.

   THE RULE THE PAGE IS STILL BUILT AROUND, wherever the drawing
   lives: nothing is asked for that the site does not then use,
   and nothing is shown that the site cannot measure.
   ============================================================ */
import { current, signOut, getProfile } from "/account.js";
import { sync, forgetOnAccount, SYNCED_KEYS } from "/sync.js";
import { listScenarios, removeScenario, listTargets, removeTarget, listLibrary, removeLibraryRow, } from "/saved.js";
import { today } from "/streak.js";
const $ = (sel) => document.querySelector(sel);
const say = (node, text, state) => {
    if (!node)
        return;
    node.textContent = text ?? "";
    if (state)
        node.dataset.state = state;
    else
        delete node.dataset.state;
};
/* ============================================================
   1. Which half of the page shows, and who it greets
   ============================================================ */
function paintIdentity() {
    const user = current();
    $("#account-out").hidden = !!user;
    $("#account-in").hidden = !user;
    if (!user)
        return;
    $("#account-hello").textContent = user.name ? `Hello, ${user.name}.` : "Hello.";
    $("#account-email").textContent = user.email ?? "";
    const face = $("#account-face");
    if (face)
        face.textContent = (user.name ?? "?").trim().charAt(0).toUpperCase() || "?";
}
/* ============================================================
   3. Taking a copy

   Everything, in one file, readable in a text editor. Not an
   export button that produces something only this site can read:
   the whole argument for an account on a site like this one is
   that leaving is as easy as arriving.

   It is assembled in the browser out of the tables plus the
   mirror, rather than by asking the server for a bundle, because
   there is no server here that could assemble one: Supabase
   answers tables and the Worker never sees a reader's rows at
   all.
   ============================================================ */
let profile = null;
async function exportEverything() {
    const button = $("#account-export");
    const note = $("#exit-note");
    button.disabled = true;
    say(note, "Gathering it up…");
    try {
        const [scenarios, targets, rows] = await Promise.all([
            listScenarios(), listTargets(), listLibrary(),
        ]);
        /* Every synced key, whatever it is, rather than the eleven a
           reader is shown a count of. `components/account/mirror.ts`
           is that other list and this deliberately does not share it:
           a copy of somebody's account that quietly left a key out
           because nothing draws it would be the worst kind of wrong. */
        const progress = {};
        for (const key of SYNCED_KEYS) {
            try {
                const raw = localStorage.getItem(key);
                if (raw !== null)
                    progress[key] = JSON.parse(raw);
            }
            catch { /* a half-written value is nothing to take a copy of */ }
        }
        const bundle = {
            what: "Everything Reiad's Library holds for this account.",
            taken: new Date().toISOString(),
            account: { name: current()?.name ?? "", email: current()?.email ?? "" },
            profile,
            progress,
            library: rows,
            targets,
            scenarios,
        };
        /* A blob and an object URL, revoked immediately after the
           click: a data: URL of the same thing would be governed by
           the page's own navigation policy and is capped at a few
           megabytes in some browsers, and this bundle has no ceiling
           anybody has measured. */
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reiad-library-${today()}.json`;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        say(note, "Downloaded. It is yours: nothing about that file is sent anywhere.", "ok");
    }
    catch (err) {
        say(note, err.message || "That did not work.", "warn");
    }
    finally {
        button.disabled = false;
    }
}
/* ============================================================
   2. The exchange
   ============================================================ */
async function boot() {
    paintIdentity();
    if (!current())
        return;
    say($("#account-synced"), "Reading your account…");
    const done = await sync();
    say($("#account-synced"), done
        ? "Up to date with your other devices, as of a moment ago."
        : "Could not reach your account just now, so this is the last copy this "
            + "device saw.");
    /* The profile row, for the bundle above. Nothing on this page is
       painted from it any more: every component that shows part of
       the profile reads it off the `profile:changed` this
       dispatches. Awaited here so a copy is never taken without a
       name in it. */
    profile = await getProfile();
}
/* ============================================================
   4. Leaving
   ============================================================ */
$("#account-signin")?.addEventListener("click", () => {
    document.querySelector(".account-btn")?.click();
});
$("#account-export")?.addEventListener("click", exportEverything);
$("#account-signout")?.addEventListener("click", async () => {
    await signOut();
    paintIdentity();
});
$("#account-forget")?.addEventListener("click", async () => {
    const note = $("#exit-note");
    if (!confirm("Erase everything this account has saved?\n\n"
        + "Your position, your checkpoints, your reading list, your notes, your "
        + "targets and your saved scenarios. This cannot be undone."))
        return;
    const button = $("#account-forget");
    button.disabled = true;
    say(note, "Erasing…");
    let gone = await forgetOnAccount();
    try {
        await Promise.all([
            ...(await listTargets()).map((t) => removeTarget(t.id)),
            ...(await listScenarios()).map((s) => removeScenario(s.id)),
            ...(await listLibrary()).map((r) => removeLibraryRow(r.id)),
        ]);
    }
    catch (err) {
        console.warn("account: could not remove everything", err);
        gone = false;
    }
    say(note, gone
        ? "Erased. Nothing of yours is stored on this account or on this device."
        : "Some of that did not work. Reload and try again.", gone ? "ok" : "warn");
    /* The sections this file does not draw hear about it here.
  
       `components/account/` reads the same rows and cannot know that
       a button in this file has just emptied them. `forgetOnAccount()`
       clears the mirror and fires the school events, which covers
       everything counted out of localStorage; this covers the four
       that are Supabase tables. */
    document.dispatchEvent(new CustomEvent("account:refresh"));
    button.disabled = false;
});
document.addEventListener("account:changed", () => {
    paintIdentity();
    if (current())
        boot();
});
boot();

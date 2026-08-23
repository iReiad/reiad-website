"use client";

/* ============================================================
   How far you are, per school, on the front page.

   ---- a count, and deliberately not a bar ----

   A bar needs a denominator, and how many lessons a school HAS
   comes down with that school's ladder: this page reads no
   ladder, and reading four would make the one page whose whole
   job is to be instant wait on four queries.

   So it says the true thing it can say. A bar drawn against a
   number this page guessed would be a bar that disagrees with the
   school's own hub two taps away, which is the failure at the top
   of `CLAUDE.md` wearing a progress bar. The Android app's
   version of this widget makes the same choice for the same
   reason, and the two agreeing is the point.

   ---- and it subscribes ----

   Anything drawing a number out of the progress keys subscribes,
   and `subscribe()` listens for three things. The third,
   `sync:done`, is the one that is easy to leave out and the one
   that matters for a signed-in reader: `aab/sync.js` writes the
   account's rows straight into localStorage, which fires neither
   of the other two. Without it this is drawn against what storage
   held BEFORE the exchange, and stays there.
   ============================================================ */

import { useSyncExternalStore } from "react";
import { LADDER_SCHOOLS } from "@reiad/shared/nav";
import { readSet, subscribe } from "../../lib/progress";
import { Icon } from "../icons";

const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export function SchoolMeters() {
  /* The counts joined into one string, not the object built from
     them: React compares snapshots by identity and a fresh object
     every read would loop. */
  const snapshot = useSyncExternalStore(
    subscribe,
    () => LADDER_SCHOOLS.map((s) => `${s.key}:${readSet(s.key).size}`).join(","),
    () => LADDER_SCHOOLS.map((s) => `${s.key}:0`).join(","),
  );
  const counts = new Map(
    snapshot.split(",").map((pair) => {
      const [key, n] = pair.split(":");
      return [key, Number(n) || 0] as const;
    }),
  );
  const any = [...counts.values()].some((n) => n > 0);

  return (
    <section className="pane meters">
      <h2 className="bn-h" lang="bn">কতটা হলো</h2>
      {any ? null : (
        <p className="meters-none" lang="bn">
          একটা পাঠ পড়া হলে টিক দিন, এখানে জমতে থাকবে।
        </p>
      )}
      <ul className="meters-list">
        {LADDER_SCHOOLS.map((school) => {
          const done = counts.get(school.key) ?? 0;
          return (
            <li key={school.key} style={{ ["--accent" as string]: school.accent }}>
              <a href={school.href}>
                <Icon name="skills" size={15} />
                <span className="min-w-0 truncate" lang="bn">{school.bn}</span>
                <b className="mono" data-done={done > 0 ? "yes" : "no"} lang="bn">
                  {bn(done)}টা পাঠ
                </b>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

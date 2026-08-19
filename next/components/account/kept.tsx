"use client";

/* ============================================================
   account/kept.tsx: what this account actually holds, listed.

   The page is deliberately plain about what is stored. A page
   that says "we value your privacy" and lists nothing is worth
   less than a page that lists every key and a count, and
   `mirror.ts` is the list.

   ONE CARD PER COURSE, not per key, because "German: 14 parts, 9
   practice days" is a sentence and four rows of storage keys is
   an audit log.
   ============================================================ */

import { useEffect, useState } from "react";
import { schoolName } from "../../lib/nav";
import { subscribe } from "../../lib/progress";
import { KEPT, countOf, plural } from "./mirror";

export function Kept() {
  /* Null until the mirror has been read once, which is not the
     same as "nothing kept" and must not look like it. */
  const [rows, setRows] = useState<Array<[string, string[]]> | null>(null);

  useEffect(() => {
    const gather = () => {
      const byCourse = new Map<string, string[]>();
      for (const entry of KEPT) {
        const n = countOf(entry);
        if (!n) continue;
        if (!byCourse.has(entry.course)) byCourse.set(entry.course, []);
        byCourse.get(entry.course)!.push(
          entry.single ? "where you were" : plural(n, entry.one!, entry.many!));
      }
      setRows([...byCourse]);
    };
    gather();
    /* Including `sync:done`: on a first visit from a new device
       this list is empty until the account's rows land. */
    return subscribe(gather);
  }, []);

  if (rows === null) return null;

  if (!rows.length) {
    return (
      <p className="acct-empty">
        Nothing yet. Open a lesson and tick it off, and it will appear here
        and on your other devices.
      </p>
    );
  }

  return (
    <>
      {rows.map(([course, bits]) => (
        <div className="cell" key={course}>
          <h3 className="bn-h">{schoolName(course)}</h3>
          <p>{bits.join(" · ")}</p>
        </div>
      ))}
    </>
  );
}

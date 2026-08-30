"use client";

/* ============================================================
   used.tsx: which calculators this reader actually opens.

   One line of work, and the interesting part is what it does NOT
   record. Not a count, not a duration, not a path through the
   site: a timestamp per tool, replaced each time. See
   `lib/progress.ts` for why a count is the wrong shape (two
   devices each saying five cannot be added or compared) and
   `SHOWN` below for what it is for.

   It is rendered by the shell, and only where the page's rail key
   names a tool, so a tool added to `shared/nav.ts` is recorded
   without anybody coming here and a page that is not a tool
   records nothing at all.
   ============================================================ */

import { useEffect } from "react";
import { markToolUsed } from "../lib/progress";

export function Used({ id }: { id: string }) {
  useEffect(() => { markToolUsed(id); }, [id]);
  return null;
}

/* ============================================================
   useRows.ts: the one hook every panel wanted.

   Each desk panel is the same shape: ask the API for a list, show
   "Loading…", show the rows, and let an action reload them. The
   old desk wrote that four times, once per panel, as four
   `async function renderX(host)` that each ended by calling
   themselves to redraw.

   Written down once, it also fixes something the old version had
   wrong in all four places: a reply that arrives after the reader
   has changed filter, or left the panel, used to paint anyway.
   Here the request knows whether it is still the current one.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from "react";

interface Result<T> {
  rows: T[];
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useRows<T>(
  load: () => Promise<{ ok: boolean } & Record<string, unknown> | null>,
  pick: (reply: Record<string, unknown>) => T[],
  deps: unknown[]
): Result<T> {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [nonce, setNonce] = useState(0);

  /* Which request is the current one. A stale reply is dropped
     rather than painted, which is what stops a slow answer for
     "pending" overwriting a fast one for "approved". */
  const run = useRef(0);

  useEffect(() => {
    const mine = ++run.current;
    setLoading(true);
    setFailed(false);

    load()
      .then((reply) => {
        if (mine !== run.current) return;
        if (!reply?.ok) { setFailed(true); setRows([]); return; }
        setRows(pick(reply as Record<string, unknown>));
      })
      .catch(() => { if (mine === run.current) setFailed(true); })
      .finally(() => { if (mine === run.current) setLoading(false); });

    /* `load` and `pick` are recreated on every render by design, so
       they are not dependencies: the caller says what to watch. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { rows, loading, failed, reload };
}

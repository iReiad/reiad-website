"use client";

/* ============================================================
   account/saved.tsx: a filled-in calculator under a name.

   `public.scenarios` in Supabase, behind the same row-level
   security progress has. The stock check stores its own query
   string, which is the format it has shared analyses in since it
   was written, so opening a saved check is a LINK rather than a
   restore and there is one encoder.

   ---- it reads the module at run time ----

   `/saved.js` is served by the other Worker at that address and
   this imports it after hydration, which is the arrangement the
   Studio and the desk already use for seven modules. The note at
   the top of `account/prefs.tsx` gives the argument once.

   ---- nothing on the server ----

   Every row here belongs to one reader and is fetched with their
   own token. The server has no session, so there is nothing for
   it to render and it renders nothing: the empty line appears
   only once the account has answered, because "you have saved
   nothing" and "this has not loaded yet" must not look the same.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";
import type { Scenario } from "/saved.js";
import { Button, ButtonLink } from "../ui/button";
import { when } from "./when";

type SavedModule = typeof import("/saved.js");

let loading: Promise<SavedModule> | null = null;
export const savedModule = (): Promise<SavedModule> =>
  (loading ??= import(/* turbopackIgnore: true */ "/saved.js"));

/* Where a saved thing opens, by the tool that saved it. One
   entry, and the fallback is the calculators' own index rather
   than a broken link, because a tool can be renamed out of this
   table and its rows outlive it. */
const TOOL_PAGE: Record<string, string> = { stock: "/tools/stock.html" };
const TOOL_NAME: Record<string, string> = { stock: "The stock check" };

const openAt = (row: Scenario): string => {
  const page = TOOL_PAGE[row.tool] ?? "/tools/index.html";
  const query = typeof row.inputs?.query === "string" ? row.inputs.query : "";
  return query ? `${page}?${query.replace(/^\?/, "")}` : page;
};

export function Scenarios({ onError }: { onError?: (message: string) => void }) {
  const [rows, setRows] = useState<Scenario[] | null>(null);

  const reload = useCallback(async () => {
    const m = await savedModule();
    setRows(await m.listScenarios());
  }, []);

  useEffect(() => {
    reload().catch(() => setRows([]));

    /* `account-page.ts` still owns "erase everything", and it
       empties this table without knowing anything draws it. It
       says so on this channel; the listener goes when that file
       does. */
    const again = () => { reload().catch(() => setRows([])); };
    document.addEventListener("account:refresh", again);
    return () => document.removeEventListener("account:refresh", again);
  }, [reload]);

  const rename = useCallback(async (row: Scenario) => {
    const next = prompt("Call it what?", row.name ?? "");
    if (next === null) return;
    try {
      const m = await savedModule();
      await m.updateScenario(row.id, { name: next.trim().slice(0, 80) });
      await reload();
    } catch (err) {
      onError?.((err as Error).message);
    }
  }, [reload, onError]);

  const drop = useCallback(async (row: Scenario) => {
    if (!confirm(`Remove "${row.name || "this scenario"}"?`)) return;
    try {
      const m = await savedModule();
      await m.removeScenario(row.id);
      await reload();
    } catch (err) {
      onError?.((err as Error).message);
    }
  }, [reload, onError]);

  if (rows === null) return null;

  if (rows.length === 0) {
    return (
      <p className="acct-empty">
        Nothing saved. Fill in the stock check and press Save, and it will be
        here on every device you sign in on.
      </p>
    );
  }

  return (
    <>
      {rows.map((row) => (
        <div className="saved-row" key={row.id}>
          <div className="saved-body">
            <h3>{row.name || "Untitled"}</h3>
            <p className="saved-line">
              {[TOOL_NAME[row.tool] ?? row.tool, row.summary, when(row.updated_at)]
                .filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="saved-actions">
            <ButtonLink kind="solid" size="sm" href={openAt(row)}>Open</ButtonLink>
            <Button kind="ghost" size="sm" onClick={() => rename(row)}>Rename</Button>
            <Button kind="ghost" size="sm" onClick={() => drop(row)}>Remove</Button>
          </div>
        </div>
      ))}
    </>
  );
}

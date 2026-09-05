"use client";

/* Keeps `data-owner` on `<html>` true, on every page, with nothing drawn.

   The boot script in `shell.tsx` restores the cached answer before the
   first paint; this asks `/api/work-alpha` once per browser for a
   signed-in reader it has never asked about, and again whenever the
   account changes, so signing out takes the rail's entry away and the
   next person at this machine does not inherit it. */

import { useEffect } from "react";
import { askOwner, known } from "./owner";

export function OwnerMark() {
  useEffect(() => {
    if (known() === null) void askOwner();
    const again = (): void => { void askOwner(); };
    document.addEventListener("account:changed", again);
    return () => document.removeEventListener("account:changed", again);
  }, []);
  return null;
}

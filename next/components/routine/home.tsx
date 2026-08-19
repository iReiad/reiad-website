"use client";

/* ============================================================
   routine/home.tsx: the two tabs, and which one opens.

   THE DAY IS FIRST AND IS THE DEFAULT, always. The whole brief
   is that somebody can open this, mark three things and close
   it in under twenty seconds, and a page that opens on a chart
   is a page that has forgotten what it is for.

   `ui/tab-panels.tsx` is the same arrangement `/account` uses:
   the fragment chooses, `replaceState` rather than assigning
   `location.hash`, arrows and Home and End on a roving
   tabindex, and nothing hides until the first effect has run.

   The year is a SEPARATE component rather than a section of the
   day, because it reads every entry the account has and the day
   reads one. Loading a year of rows to draw today would be the
   twenty seconds spent before the first tick.
   ============================================================ */

import { useMemo } from "react";
import { TabPanels } from "../ui/tab-panels";
import { RoutineDay } from "./day";
import { RoutineYear } from "./year";

export function RoutineHome() {
  const panels = useMemo(() => ([
    { id: "today", label: "আজ · Today", node: <RoutineDay /> },
    { id: "year", label: "বছর · The year", node: <RoutineYear /> },
  ]), []);

  return <TabPanels panels={panels} label="Routine" />;
}

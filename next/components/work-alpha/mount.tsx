"use client";

/* The host for the engine, and the gate in front of it.

   The route renders this and nothing else about the app: the server has
   no reader (see `owner.ts`), so the page is an empty host until the
   browser has asked `/api/work-alpha`, and a reader who is not the owner
   gets `notFound()` rather than a page saying what they may not have. */

import { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { mount, type Plan } from "./engine";
import { askOwner } from "./owner";
import { supabaseStorage } from "./storage";
import plan from "./plan.json";
import "./style.css";

export function WorkAlphaMount() {
  const ref = useRef<HTMLDivElement>(null);
  const [owner, setOwner] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    askOwner().then((o) => { if (live) setOwner(o); });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (owner && ref.current) void mount(ref.current, plan as Plan, supabaseStorage());
  }, [owner]);

  if (owner === false) notFound();
  return <div ref={ref} className="wa-host" aria-busy={owner === null || undefined} />;
}

import type { Metadata } from "next";
import { InsightsHub } from "../../components/hub";
import { hubMetadata } from "../../lib/metadata";
import { piecesIn } from "../../lib/pieces";

/* This route has no dynamic segment, so Next would render it once
   at build time and serve that for ever: a hub whose list of
   pieces was true on the day it was built, which is the whole
   failure this stage is undoing. It reads the database on every
   request, like the article route beside it, and says so here
   rather than being caught out by a default.

   The two Bangla hubs need no such line: they sit under a dynamic
   `[section]`, which is server-rendered on demand already. */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return hubMetadata("insights");
}

export default async function InsightsHubPage() {
  return <InsightsHub pieces={await piecesIn("insights")} />;
}

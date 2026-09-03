/* /tools/research/tools/<slug>: one tool of the workshop, a page a
   reader can link to. The thirty are prerendered from the table
   and nothing else answers here. RESEARCH.md 19. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../../components/research/frame";
import { Workshop } from "../../../../../../components/research/rooms-client";
import { RESEARCH_TOOLS, researchTool } from "../../../../../../lib/research-tools";
import { notFound } from "next/navigation";

/* NO `dynamicParams = false` HERE, and that is not a style
   choice. On this deployment a route with a dynamic segment and
   that flag answers 404 for EVERY param, including the ones
   `generateStaticParams` names: the prerendered page is in
   `.open-next/cache` and the runtime will not render on demand,
   so it has nothing to serve. Reproduced on workerd and on the
   live site; `/tools/research/tools/which-test` was dead from the
   day it shipped. The params below still prerender; an id the
   list does not name renders on demand and `notFound()` is what
   makes it a 404. */

export function generateStaticParams(): { tool: string }[] {
  return RESEARCH_TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  const t = researchTool(tool);
  return {
    ...pageMeta({
      path: `/tools/research/tools/${tool}`,
      title: `${t?.name.en ?? "A tool"} · The workshop · Research Studio · Reiad's Library`,
      description: t?.dek.en ?? "One small tool of the Research Studio's workshop.",
      ogTitle: `${t?.name.en ?? "A tool"} · Research Studio`,
      card: "tools",
    }),
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (!researchTool(tool)) notFound();
  return (
    <ResearchFrame href="/tools/research/tools" wide>
      <Workshop tool={tool} />
    </ResearchFrame>
  );
}

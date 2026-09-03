/* /tools/research/tools/<slug>: one tool of the workshop, a page a
   reader can link to. The thirty are prerendered from the table
   and nothing else answers here. RESEARCH.md 19. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../../components/research/frame";
import { Workshop } from "../../../../../../components/research/workshop";
import { RESEARCH_TOOLS, researchTool } from "../../../../../../lib/research-tools";

export const dynamicParams = false;

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
  return (
    <ResearchFrame href="/tools/research/tools" wide>
      <Workshop tool={tool} />
    </ResearchFrame>
  );
}

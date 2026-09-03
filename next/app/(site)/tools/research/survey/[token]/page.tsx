/* /tools/research/survey/<token>: a field room survey as a stranger
   sees it. Not a room of the studio and not behind an account: the
   form reads itself from /api/survey/<token> with no bearer and
   posts the answers back to the same address, and it stands outside
   the studio's frame on purpose, which scripts/check-research.ts
   knows by name. RESEARCH.md 15. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../../lib/pageMeta";
import { SurveyForm } from "../../../../../../components/research/survey-form";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/tools/research/survey",
    title: "A survey · Research Studio · Reiad's Library",
    description: "A short survey from the Research Studio's field room.",
    ogTitle: "A survey · Research Studio",
    card: "tools",
  }),
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="grid gap-4 max-w-[46rem] mx-auto px-4 py-6">
      <SurveyForm token={token} />
    </main>
  );
}

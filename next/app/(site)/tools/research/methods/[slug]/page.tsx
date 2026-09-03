/* /tools/research/methods/<slug>: one lesson written here, in the
   article's own vocabulary, for a method no piece covers yet. The
   twelve are prerendered from `lib/methods/index.ts` and nothing
   else answers here. A live piece with the same slug is what the
   room links instead, so this page is the fallback and never a
   second copy. RESEARCH.md 20. */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../../lib/pageMeta";
import { ResearchFrame } from "../../../../../../components/research/frame";
import { TBlock } from "../../../../../../components/research/lang";
import { METHOD_LESSONS, methodLesson } from "../../../../../../lib/methods";
import { researchMethod } from "../../../../../../lib/research-methods";
import { notFound } from "next/navigation";
import { MethodLessonFoot } from "../../../../../../components/research/method-lesson";

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

export function generateStaticParams(): { slug: string }[] {
  return METHOD_LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = researchMethod(slug);
  return pageMeta({
    path: `/tools/research/methods/${slug}`,
    title: `${m?.title.en ?? "A method"} · The methods room · Research Studio · Reiad's Library`,
    description: m?.dek.en ?? "How to do a thing, as a lesson with a worked example.",
    ogTitle: `${m?.title.en ?? "A method"} · Research Studio`,
    ogDescription: m?.dek.en ?? "How to do a thing, as a lesson with a worked example.",
    card: "tools",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = methodLesson(slug);
  const m = researchMethod(slug);
  if (!lesson || !m) notFound();
  return (
    <ResearchFrame title={{ en: m.title.en, bn: m.title.bn }} lede={{ en: m.dek.en, bn: m.dek.bn }}>
      <article className="article rs-lesson" data-testid="rs-method-lesson" data-minutes={lesson.minutes}>
        <TBlock
          en={<div dangerouslySetInnerHTML={{ __html: lesson.en }} />}
          bn={<div dangerouslySetInnerHTML={{ __html: lesson.bn }} />}
        />
      </article>
      <MethodLessonFoot slug={slug} kind={m.kind} tools={m.tools ?? []} rooms={m.rooms ?? []} />
    </ResearchFrame>
  );
}

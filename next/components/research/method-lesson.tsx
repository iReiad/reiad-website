/* ============================================================
   research/method-lesson.tsx: what sits under a lesson's prose.

   The tools and rooms the lesson is the "how to" for, out of the
   same table the frame reads the other way round, and the other
   lessons of its kind. A SERVER component: nothing here changes
   after the first paint.
   ============================================================ */

import { toneVar } from "@reiad/shared/research";
import { ChipLink } from "../ui/chip";
import { T, W } from "./lang";
import { KIND_TONE, RESEARCH_METHODS, type MethodKind } from "../../lib/research-methods";
import { RESEARCH_PAGES } from "../../lib/research-pages";
import { researchTool } from "../../lib/research-tools";
import { methodLesson } from "../../lib/methods";

export function MethodLessonFoot({ slug, kind, tools, rooms }: { slug: string; kind: MethodKind; tools: string[]; rooms: string[] }) {
  const places = [
    ...rooms.map((key) => RESEARCH_PAGES.find((p) => p.key === key)).filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({ href: p.href, title: p.title })),
    ...tools.map((t) => researchTool(t)).filter((t): t is NonNullable<typeof t> => Boolean(t))
      .map((t) => ({ href: `/tools/research/tools/${t.slug}`, title: t.name })),
  ];
  const others = RESEARCH_METHODS.filter((m) => m.kind === kind && m.slug !== slug && methodLesson(m.slug));
  return (
    <footer className="grid gap-4 mt-8" style={{ "--accent": toneVar(KIND_TONE[kind]) } as React.CSSProperties} data-testid="rs-lesson-foot">
      {places.length ? (
        <p className="flex flex-wrap items-center gap-2 text-t1 text-ink-soft" data-testid="rs-lesson-places">
          <W k="rs.me.where" />
          {places.map((p) => <ChipLink key={p.href} href={p.href}><T en={p.title.en} bn={p.title.bn} /></ChipLink>)}
        </p>
      ) : null}
      {others.length ? (
        <p className="flex flex-wrap items-center gap-2 text-t1 text-ink-soft">
          <W k="rs.me.also" />
          {others.map((m) => <ChipLink key={m.slug} href={`/tools/research/methods/${m.slug}`}><T en={m.title.en} bn={m.title.bn} /></ChipLink>)}
        </p>
      ) : null}
      <p className="text-t1 text-ink-soft"><ChipLink href="/tools/research/methods"><W k="rs.rooms" /></ChipLink></p>
    </footer>
  );
}

"use client";

/* The whole path, down to the lesson. Every other section's trail is the
   server's; this one cannot be, because the catalogue is admin-only and
   `check-courses.ts` refuses a value import of it into `next/`. The shape
   is the URL's and is known at once; the names arrive with a fetch.

   A single `…` crumb rewritten with `last.textContent = text` after the
   fetch is why this exists: that `<li>` holds the separator, the popover
   of what else is at that level, and the label, so `textContent` replaces
   all three with one text node and the arrow disappears, with the course
   and module levels missing entirely.

   THE SHAPE IS KNOWN BEFORE ANYTHING IS FETCHED: `usePathname()` runs on
   the server render of a client component too, so the full trail, with
   every href and a name read out of each slug, is in the first HTML and
   the fetch only upgrades the words.

   AND EACH ARROW OPENS ITS OWN LEVEL. One fetch of the shelf plus one of
   `/api/courses/<programme>/<course>` carries all four levels, so it
   costs nothing extra to be the fastest way sideways through a
   certificate. */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Crumbs, type Crumb, type CrumbLink } from "../ui/crumbs";
import { trailFor } from "../../lib/crumbs";
import { readerCall } from "../../lib/reader-api";

/* The half of the catalogue's shape this needs, written out
   because the values may not be imported. `check-courses.ts` is
   what holds these names to the ones `forBrowser()` emits. */
interface LessonRow { slug: string; title?: string; position?: number }
interface ModuleRow {
  slug: string; title?: string; position?: number; lessons?: LessonRow[];
}
interface CourseRow { slug: string; title?: string; modules?: ModuleRow[] }
interface CourseCard { slug: string; title?: string; modules?: number }
/** A programme with its courses nested, which is what the shelf
    sends: a flat list with a programme name repeated on each row
    is what this section had before anybody noticed the eight
    courses belonged to one certificate. */
interface ProgrammeCard { slug: string; title?: string; courses?: CourseCard[] }

/** A slug read as words. What a crumb says before the catalogue
    answers, and what it goes on saying for anybody the catalogue
    never answers for. Better than `…`, which says nothing and is
    indistinguishable from a trail that is still loading when it
    is in fact one that failed. */
const fromSlug = (slug: string): string =>
  decodeURIComponent(slug).replace(/[-_]+/g, " ").replace(/^./, (c) => c.toUpperCase());

const at = (
  programme?: string, course?: string, mod?: string, lesson?: string,
): string =>
  ["/skills/courses", programme, course, mod, lesson].filter(Boolean).join("/");

export function CourseTrail() {
  const path = usePathname() ?? "";
  const [, , programme, course, mod, lesson] = path.split("/").filter(Boolean);

  const [row, setRow] = useState<CourseRow | null>(null);
  const [shelf, setShelf] = useState<ProgrammeCard[]>([]);

  useEffect(() => {
    if (!programme) return () => {};
    let live = true;
    /* Both at once, and neither is fatal. A trail that failed to
       find its names still has the ones out of the URL, which is
       the whole reason those are the starting value rather than
       a spinner. */
    void Promise.all([
      course
        ? readerCall<{ course?: CourseRow }>(`courses/${programme}/${course}`)
        : null,
      readerCall<{ courses?: ProgrammeCard[] }>("courses"),
    ]).then(([one, list]) => {
      if (!live) return;
      if (one?.ok && one.data?.course) setRow(one.data.course);
      if (list.ok && Array.isArray(list.data?.courses)) setShelf(list.data.courses);
    });
    return () => { live = false; };
  }, [programme, course]);

  if (!programme) {
    return <Bar trail={trailFor("skills", [{ href: "/skills/courses", label: "কোর্স" }])} />;
  }

  const card = shelf.find((p) => p.slug === programme);
  const courses = card?.courses ?? [];
  const modules = row?.modules ?? [];
  const here = modules.find((m) => m.slug === mod);
  const lessons = here?.lessons ?? [];

  /* Every programme beside this one. `here` marks the one you are
     on, which is listed rather than linked, the same way a
     school's menu lists the school you are reading. */
  const programmeMenu: CrumbLink[] = shelf.map((p) => ({
    href: at(p.slug),
    label: p.title ?? fromSlug(p.slug),
    count: p.courses?.length,
    here: p.slug === programme,
  }));

  const courseMenu: CrumbLink[] = courses.map((c) => ({
    href: at(programme, c.slug),
    label: c.title ?? fromSlug(c.slug),
    count: c.modules,
    here: c.slug === course,
  }));

  const moduleMenu: CrumbLink[] = modules.map((m) => ({
    href: at(programme, course, m.slug),
    kicker: typeof m.position === "number" ? `${m.position}` : undefined,
    label: m.title ?? fromSlug(m.slug),
    count: m.lessons?.length,
    here: m.slug === mod,
  }));

  const lessonMenu: CrumbLink[] = lessons.map((l) => ({
    href: at(programme, course, mod, l.slug),
    kicker: typeof l.position === "number" ? `${l.position}` : undefined,
    label: l.title ?? fromSlug(l.slug),
    here: l.slug === lesson,
  }));

  const deep: Crumb[] = [{ href: "/skills/courses", label: "কোর্স" }];

  deep.push({
    href: at(programme),
    label: card?.title ?? fromSlug(programme),
    menu: programmeMenu,
    menuLabel: "The other programmes",
  });

  if (course) {
    deep.push({
      href: at(programme, course),
      label: row?.title ?? courses.find((c) => c.slug === course)?.title ?? fromSlug(course),
      menu: courseMenu,
      menuLabel: "The other courses in this programme",
    });
  }

  if (mod) {
    deep.push({
      href: at(programme, course, mod),
      label: here?.title ?? fromSlug(mod),
      menu: moduleMenu,
      menuLabel: "The other modules of this course",
    });
  }

  if (lesson) {
    deep.push({
      href: at(programme, course, mod, lesson),
      label: lessons.find((l) => l.slug === lesson)?.title ?? fromSlug(lesson),
      menu: lessonMenu,
      menuLabel: "The other lessons in this module",
    });
  }

  return <Bar trail={trailFor("skills", deep)} />;
}

/** The bar's own trail, said once. Every prop here has to match
    what `shell.tsx` passes for every other page: this replaces
    that row rather than sitting beside it, and a trail that
    looked slightly different on one section would read as a
    different site. */
function Bar({ trail }: { trail: Crumb[] }) {
  return <Crumbs trail={trail} skip={1} label="পথ" className="crumbs-bar" min={2} />;
}

/* Where you are standing, out of the one table. A route knows its own
   section, its own parents and its own name without reading
   `location.pathname` or importing four curricula, and `shared/nav.ts` is
   already what the rail, the footer and `/skills/` are drawn from.

   It lives in the BAR: a row of its own under the bar is a second thing
   at the top of every page saying where you are while the bar says the
   site's name. One line, with the mark as the first crumb.

   Everything above the page is free: `trailFor("quran")` is
   Home > Skills > Qur'anic Arabic, because the table says which group the
   school is in. A route DEEPER than its section passes the rest, because
   a stage and a lesson are rows rather than table entries. */

import { stageUrl, type SchoolStage } from "@reiad/shared/schools";
import type { Crumb, CrumbLink } from "../components/ui/crumbs";
import { NAV, type NavGroup, type NavItem } from "@reiad/shared/nav";
import { SCHOOL_STAGES } from "./school-stages";

/** The label of a crumb the server cannot fill in, rewritten by
    the browser once it knows. One section uses it: the course
    catalogue is admin-only, so a course page's own name arrives
    with the fetch. It is left out of the JSON-LD, because a
    machine-readable trail saying "…" is worse than a short one. */
export const PENDING = "…";

/** The learning group's own index, which every school sits
    under. It is a nav item like any other, so it is looked up
    rather than written out: the day it moves, this moves. */
const SKILLS_KEY = "skills";

const LEARN = NAV.find((g) => g.id === "learn");

/** Bangla first, which is what the site is. `sub` is the Bangla
    name in the table and `label` the English one, and a few items
    have only the second. */
const name = (item: { label: string; sub?: string }): string =>
  item.sub ?? item.label;

/** The siblings of one nav item: everything else in its group,
    itself included and marked.

    `unlisted` is skipped for the reason the flag exists. A link
    in the chrome to a page that answers 403 is a promise the
    site cannot keep, and the course catalogue is admin-only. */
const besides = (group: NavGroup, item: NavItem): CrumbLink[] =>
  group.items
    .filter((i) => !i.unlisted)
    .map((i) => ({
      href: i.href,
      label: name(i),
      kicker: i.sub ? i.label : undefined,
      here: i === item,
    }));

/** A school's ladder, as a menu.

    `SCHOOL_STAGES` is generated from the schools' own rows by
    `scripts/build-school-tree.ts`, which is also where the tree
    in the bar reads them, so a stage added in the Studio appears
    in both without an edit here. It is generated rather than
    queried because half this site's routes are prerendered where
    there is no database to ask. */
const ladderOf = (school: string, on?: string): CrumbLink[] =>
  (SCHOOL_STAGES[school] ?? []).map((stage) => ({
    /* The same helper the hub, the tree and the lesson footer
       use, so a stage is addressed one way rather than by
       rebuilding its URL here. */
    href: stageUrl(school, { slug: stage.slug } as SchoolStage),
    label: stage.label,
    kicker: stage.kicker,
    count: stage.lessons,
    here: stage.slug === on,
  }));

    /**
     * The trail down to a page, from the section it is in.
     *
     * `current` is the same value the rail and the shell already take, so
     * a page that marks its place in the rail gets a trail for nothing.
     * `tail` is for the levels below a section: a stage, a lesson, a case
     * study.
     *
     * `stage` is the slug of the stage a school page is inside, and it is
     * what makes a lesson's trail complete: without it the row says
     * Home > Skills > German on a page three levels down.
     */
export function trailFor(
  current: string | null | undefined,
  tail: Crumb[] = [],
  stage?: string,
): Crumb[] {
  const home: Crumb = { href: "/", label: "হোম" };
  if (!current) return tail.length ? [home, ...tail] : [];

  for (const group of NAV) {
    const item = group.items.find((i) => i.key === current);
    if (!item) continue;

    const trail: Crumb[] = [home];
    /* A school is inside the skills index, and the skills index
       is not inside itself. Only the learning group has a level
       between the home page and its items. */
    const inSkills = group.id === "learn" && item.key !== SKILLS_KEY;
    const skills = inSkills ? LEARN?.items.find((i) => i.key === SKILLS_KEY) : undefined;
    if (skills) {
      trail.push({
        href: skills.href,
        label: name(skills),
        /* The arrow before it opens the whole learning group,
           which is where somebody who wanted a different subject
           was heading. */
        menu: besides(group, skills),
        menuLabel: "Other sections",
        accent: group.accent,
      });
    }
    /* The page you are on is not a link, and `<Crumbs>` drops the
       href of the last one anyway. It keeps one here so that a
       route adding a tail turns this into a working link without
       this file knowing whether it did. */
    trail.push({
      href: item.href,
      label: name(item),
      menu: besides(group, item),
      menuLabel: `Everything in ${group.label}`,
      accent: item.accent ?? group.accent,
    });

    /* The ladder, where the page is inside one. `item.key` is the
       school's own id, which is the key the generated ladder is
       filed under, so the two need no mapping between them. */
    const rungs = stage && item.ladder && item.key ? ladderOf(item.key, stage) : [];
    const on = rungs.find((r) => r.here);
    if (on) {
      trail.push({
        href: on.href,
        label: on.kicker ?? on.label,
        menu: rungs,
        menuLabel: `Every stage of ${item.label}`,
        accent: item.accent ?? group.accent,
      });
    }

    return [...trail, ...tail];
  }

  /* A page the table does not list: an article, a case study, a
     practice book. It still has a trail if the route gave one. */
  return tail.length ? [home, ...tail] : [];
}

    /**
     * The same trail as `application/ld+json`, which is what puts it in a
     * search result instead of a bare URL. Absolute URLs, because
     * `BreadcrumbList` items are compared by identity and a relative one
     * is not one.
     */
export function trailJsonLd(trail: Crumb[], origin: string): string | null {
  const items = trail
    .filter((c) => typeof c.label === "string" && c.label !== PENDING);
  if (items.length < 2) return null;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: origin + c.href } : {}),
    })),
  });
}

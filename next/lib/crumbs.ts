/* ============================================================
   crumbs.ts: where you are standing, out of the one table.

   The trail used to be `aab/src/crumbs.ts`: 402 lines in the
   browser that read `location.pathname` and `document.title`,
   imported all four curricula to do it, and had to GUESS three
   things. It is archived. A route knows its own section, its own
   parents and its own name without guessing, and `lib/nav.ts` is
   already the one table the rail, the footer and `/skills/` are
   all drawn from.

   ---- it lives in the bar now ----

   It was a row of its own under the bar, which is a second thing
   at the top of every page saying where you are while the bar
   said the site's name. One line: the mark is the first crumb and
   the trail continues out of it.

   ---- what a route adds ----

   Everything above the page is free: `trailFor("quran")` is
   Home > Skills > Qur'anic Arabic, because the table says the
   Qur'an school is in the learning group and that group's index
   is /skills/. A route that is DEEPER than its section passes the
   rest, because a stage and a lesson are rows rather than table
   entries.
   ============================================================ */

import type { Crumb } from "../components/ui/crumbs";
import { NAV } from "./nav";

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

/**
 * The trail down to a page, from the section it is in.
 *
 * `current` is the same value the rail and the shell already
 * take, so a page that marks its place in the rail gets a trail
 * for nothing. `tail` is for the levels below a section: a
 * stage, a lesson, a case study.
 */
export function trailFor(
  current: string | null | undefined,
  tail: Crumb[] = [],
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
    if (group.id === "learn" && item.key !== SKILLS_KEY) {
      const skills = LEARN?.items.find((i) => i.key === SKILLS_KEY);
      if (skills) trail.push({ href: skills.href, label: name(skills) });
    }
    /* The page you are on is not a link, and `<Crumbs>` drops the
       href of the last one anyway. It keeps one here so that a
       route adding a tail turns this into a working link without
       this file knowing whether it did. */
    trail.push({ href: item.href, label: name(item) });
    return [...trail, ...tail];
  }

  /* A page the table does not list: an article, a case study, a
     practice book. It still has a trail if the route gave one. */
  return tail.length ? [home, ...tail] : [];
}

/**
 * The same trail as `application/ld+json`, which is what puts it
 * in a search result instead of a bare URL.
 *
 * `aab/crumbs.js` emitted this and is archived; it is the one
 * thing that file did which the row on the page did not, so it
 * moves here rather than being lost. Absolute URLs, because
 * `BreadcrumbList` items are compared by identity and a relative
 * one is not one.
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

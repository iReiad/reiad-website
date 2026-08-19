/* ============================================================
   /tools/routine/settings

   Everything that shapes the routine: the list, the templates,
   and your own copy of all of it.

   A SEPARATE SURFACE from the day, and the build spec is right
   about why: the day has to open, take three marks and close in
   under twenty seconds, and a page carrying a task editor is not
   that page. Reached from the day and from `/account`, never
   from the rail.

   The address is `/tools/routine/settings` rather than the
   spec's `/settings/tools/routine` because there is no
   `/settings` tree on this site: `/account` is the settings
   page, and inventing a second top-level section for one tool is
   a bigger change than the tool.

   Client-filled for the reason `/tools/routine` is: what this
   shows is one person's own rows, read with their own token out
   of their own localStorage, and the server has neither.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { RoutineSettings } from "../../../../../components/routine/settings";
import { ButtonLink } from "../../../../../components/ui/button";

export const metadata: Metadata = pageMeta({
  path: "/tools/routine/settings",
  title: "Routine settings · your list and your copy · Reiad's Library",
  description: "Shape your routine: add and reorder what is on your list, "
    + "start from a template, and take a copy of everything whenever you "
    + "like.",
  ogTitle: "Routine settings",
  ogDescription: "Your list, your templates, and your own copy of everything.",
  card: "tools",
});

export default function RoutineSettingsPage() {
  return (
    <main id="main" className="wrap rt-page">
      <h1 className="rt-title">রুটিন · settings</h1>
      <p className="rt-back">
        <ButtonLink kind="quiet" size="sm" href="/tools/routine">
          ‹ back to today
        </ButtonLink>
      </p>
      <RoutineSettings />
    </main>
  );
}

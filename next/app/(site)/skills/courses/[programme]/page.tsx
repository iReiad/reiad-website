/* /skills/courses/<programme>: one certificate, its courses in
   order, and how much of each there is.

   New with the level: the eight courses were always the eight of
   one certificate, and a flat list said nothing about which
   belonged to which. `programmeCounts()` and `countsOf()` in
   `shared/courses.ts` are the numbers this draws, and it draws
   them in the browser for the reason every page in this section
   does: the catalogue may not be rendered by the server. */
import type { Metadata } from "next";
import { CourseShell, courseMeta } from "../../../../../components/course-shell";

export const metadata: Metadata = courseMeta("Programme");

export default function ProgrammePage() {
  return <CourseShell />;
}

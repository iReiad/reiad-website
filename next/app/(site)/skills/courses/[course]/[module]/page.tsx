/* /skills/courses/<course>/<module>/index.html: the module
   summary, which is where the last lesson of a module lands. */
import type { Metadata } from "next";
import { CourseShell, courseMeta } from "../../../../../../../components/course-shell";

export const metadata: Metadata = courseMeta("Module");

export default function ModulePage() {
  return <CourseShell />;
}

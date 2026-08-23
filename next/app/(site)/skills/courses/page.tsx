/* /skills/courses: the shelf of programmes.

   Not the eight courses any more. They are the eight of one
   certificate, and listing them flat was the same mistake as
   listing eight lessons of one module as eight modules: a second
   certificate would have sat beside them with nothing saying
   which belonged to which. */
import type { Metadata } from "next";
import { CourseShell, courseMeta } from "../../../../components/course-shell";

export const metadata: Metadata = courseMeta("Courses");

export default function CoursesPage() {
  return <CourseShell />;
}

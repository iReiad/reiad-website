/* /skills/courses/<course>/index.html: one course, and the deep
   link into the first lesson its reader has not ticked. */
import type { Metadata } from "next";
import { CourseShell, courseMeta } from "../../../../../../components/course-shell";

export const metadata: Metadata = courseMeta("Course");

export default function CoursePage() {
  return <CourseShell here="Course" />;
}

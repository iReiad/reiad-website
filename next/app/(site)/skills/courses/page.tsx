/* /skills/courses: the eight courses. */
import type { Metadata } from "next";
import { CourseShell, courseMeta } from "../../../../components/course-shell";

export const metadata: Metadata = courseMeta("Courses");

export default function CoursesPage() {
  return <CourseShell />;
}

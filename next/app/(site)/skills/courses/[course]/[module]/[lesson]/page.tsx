/* /skills/courses/<course>/<module>/<lesson>.html: the lesson,
   its video, its files and the button that finishes it.

   The `.html` is part of the `[lesson]` value rather than a
   segment of its own, which is the same arrangement the school
   lesson route uses: App Router cannot have a literal suffix on a
   dynamic segment, so the route takes `sectors.html` and the
   module strips the extension. */
import type { Metadata } from "next";
import { CourseShell, courseMeta } from "../../../../../../../components/course-shell";

export const metadata: Metadata = courseMeta("Lesson");

export default function LessonPage() {
  return <CourseShell here="Lesson" />;
}

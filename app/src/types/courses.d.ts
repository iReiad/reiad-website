export interface CourseFile {
    name: string;
    ext: string;
    drive: string;
}
export interface Lesson {
    slug: string;
    title: string;
    kind: string;
    section: string;
    position: number;
    video: string | null;
    reading: string | null;
    quiz: string | null;
    exam: string | null;
    transcript: string | null;
    captions: string | null;
    files: CourseFile[];
}
export interface Module {
    slug: string;
    n: number;
    title: string;
    pending: boolean;
    lessons: Lesson[];
}
export interface Course {
    slug: string;
    n: number;
    title: string;
    modules: Module[];
}
export interface CourseSummary {
    slug: string;
    n: number;
    title: string;
    modules: number;
    lessons: number;
    videos: number;
    pending: number;
}
/** What the one-course answer says about the programme it is in.

    Sent beside the course rather than inside it, so nothing that
    reads a course has to know about certificates. Absent only
    from an older Worker's answer, which is the one case a course
    page names the level instead of the certificate. */
export interface ProgrammeName {
    slug: string;
    title: string;
}
/** One row of `listForBrowser()`: a programme, its totals, and
    the courses in it.

    `courses` is the ARRAY, not a count: that function spreads
    `programmeCounts()`, whose `courses` IS a count, and then
    writes the array over it. How many courses there are is
    `courses.length`. */
export interface ProgrammeSummary {
    slug: string;
    n: number;
    title: string;
    courses: CourseSummary[];
    modules: number;
    lessons: number;
    videos: number;
    pending: number;
}
/** Which of the five, and everything the address named.

    A union rather than one shape with four optional fields, so a
    view cannot be drawn with a segment the address never
    carried. */
type Where = {
    view: "catalogue";
} | {
    view: "programme";
    programme: string;
} | {
    view: "course";
    programme: string;
    course: string;
} | {
    view: "module";
    programme: string;
    course: string;
    module: string;
} | {
    view: "lesson";
    programme: string;
    course: string;
    module: string;
    lesson: string;
};
/** Read the address rather than being told by the page.

    The five routes are shells with no data in them, so there is
    nothing for a shell to tell this module that the URL does not
    already say, and a `data-` attribute per route would be a
    sixth place that knows what a course address looks like. */
export declare function whereAmI(path: string): Where | null;
export declare function start(root: HTMLElement): Promise<void>;
export {};

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
interface Where {
    view: "catalogue" | "course" | "module" | "lesson";
    course?: string;
    module?: string;
    lesson?: string;
}
/** Read the address rather than being told by the page.

    The four routes are shells with no data in them, so there is
    nothing for a shell to tell this module that the URL does not
    already say, and a `data-` attribute per route would be a
    fifth place that knows what a course address looks like. */
export declare function whereAmI(path: string): Where | null;
export declare function start(root: HTMLElement): Promise<void>;
export {};

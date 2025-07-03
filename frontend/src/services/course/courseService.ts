import { createApiCaller } from "../../utils/apiFactory";

export interface Course {
    course_id: string;
    course_title_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    last_edited: string;
    [key: string]: string;
}

/**
 * Fetches a new course_id for the given user.
 */
export const getNewCourseId = (
    userId: string
): Promise<{ course_id: string } | null> => {
    return createApiCaller<{ course_id: string }>({
        url: "getNewCourseId/",
        method: "POST",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        data: { user: userId },
    })();
};

/**
 * Updates (or creates) the values for a given course_id.
 */
export const updateCourseValues = (
    course_id: string,
    values: Record<string, string>
): Promise<void | null> => {
    return createApiCaller<void>({
        url: "updateValue/",
        method: "POST",
        withCredentials: true,
        data: {
            course_id,
            dict_of_columns_and_vals: values,
        },
    })();
};

/**
 * Loads all courses for the current user.
 */
export const getCourses = async (): Promise<Course[] | null> => {
    const raw = await createApiCaller<Record<string, Record<string, string>>>({
        url: "getSheet/",
        method: "POST",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        data: {}, // empty body for POST
    })();

    if (!raw) return null;

    return Object.entries(raw).map(([course_id, courseData]) => ({
        course_id,
        course_title_syllabus: courseData["Course Title"] || "",
        instructor_name_syllabus: courseData["Instructor Name"] || "",
        term_syllabus: `${courseData["Year"] ?? ""}-${courseData["Semester"] ?? ""}`,
        last_edited: courseData["Last Edited"] || "",
        ...courseData,
    }));
};

/**
 * Fetches the full data object for a single course row.
 */
export const getCourseData = (
    course_id: string
): Promise<Record<string, string> | null> => {
    return createApiCaller<Record<string, string>>({
        url: "getValue/",
        method: "POST",
        withCredentials: true,
        data: { course_id },
    })();
};

/**
 * (Alternative path) Creates a new course row and returns its ID.
 * If you end up switching to this on the backend, you can call it instead of getNewCourseId.
 */
export const createNewCourse = (
    data: Record<string, string>
): Promise<{ course_id: string } | null> => {
    return createApiCaller<{ course_id: string }>({
        url: "createNewCourse/",
        method: "POST",
        withCredentials: true,
        data: { dict_of_columns_and_vals: data },
    })();
};

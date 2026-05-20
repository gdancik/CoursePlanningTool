import { createApiCaller } from "../../utils/apiFactory";
import {SHEET_COLUMNS} from "../../utils/handlers/sheetColumns";
import {FormState, FormValue} from "../../utils/types";

export interface Course {
    course_id: string;
    course_title_syllabus: string;
    subj_code_syllabus: string;
    crse_number_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    year_syllabus: string;
    last_edited: string;
    created_at?: string;
    course_type?: string;
    [key: string]: FormValue;
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
            course_id: course_id,
            dict_of_columns_and_vals: values,
        },
    })();
};

/**
 * Loads all courses for the current user.
 */
export const getCourses = async (): Promise<Course[] | null> => {
    const raw = await createApiCaller<Record<string, FormState>>({
        url: "getSheet/",
        method: "POST",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        data: {}, // empty body for POST
    })();

    if (!raw) return null;

    return Object.keys(raw).map((courseId) => ({
       ...raw[courseId],
       course_id: courseId,
    })) as Course[];
};


/**
 * Fetches the full data object for a single course row.
 */
export const getCourseData = (
    course_id: string
): Promise<FormState | null> => {
    return createApiCaller<FormState>({
        url: "getCourse/",
        method: "POST",
        withCredentials: true,
        data: {
            course_id
        },
    })();
};

/**
 * (Alternative path) Creates a new course row and returns its ID.
 * If you end up switching to this on the backend, you can call it instead of getNewCourseId.
 */


export const createNewCourse = (
    data: FormState
): Promise<{course_id: string }| null> => {
    return createApiCaller<Record<string, any>>({
        url: "createNewCourse/",
        method: "POST",
        withCredentials: true,
        data: { dict_of_columns_and_vals: data },
    })().then(raw => {
        if (!raw) return null;
        // Normalize whatever key the backend gives us:
        const id =
            (raw as any).course_id ||
            (raw as any).courseId ||
            (raw as any)["courseId:"];
        if (!id) return null;
        return { course_id: id };
    });
};

export const deleteCourseRow = (
    course_id: string ): Promise <{course_id: string} | null> => {
    return createApiCaller<{ course_id: string}> ({
        url: "deleteCourse/",
        method: "POST",
        withCredentials: true,
        headers: {"content-Type" : "application/json"},
        data: {course_id},
    })();
};

export const duplicateCourse = (
    course_id: string
): Promise <any> => {
    return createApiCaller<{ course_id: string}> ({
        url: "duplicateCourse/",
        method: "POST",
        withCredentials: true,
        headers: {"content-Type" : "application/json"},
        data: {course_id},
    })();
};

export const previewSyllabus = async (course_id: string): Promise<Blob | null> => {
    return await createApiCaller<Blob>({
        method: "POST",
        url: "/preview/",
        data: { course_id },
        responseType: "blob",
    })();
};

export const logoutUser = async () => {
    return await createApiCaller<void>({
        method: "GET",
        url: "/logout/",
    })();
};


import { createApiCaller } from "../../utils/apiFactory";
import {SHEET_COLUMNS} from "../../utils/handlers/sheetColumns";

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
    [key: string]: string | undefined;
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
    //const raw = await createApiCaller<any>({
    const raw = await createApiCaller<Record<string, Record<string, string>>>({
        url: "getSheet/",
        method: "POST",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        data: {}, // empty body for POST
    })();

    if (!raw) return null;

    const course_list = Object.keys(raw).map((key) => ({
        course_id: key,
        course_title_syllabus: raw[key]["Course Title"] || "",
        subj_code_syllabus:   raw[key]["Course Code"]  || "",
        crse_number_syllabus: raw[key]["Course Number"]|| "",
        instructor_name_syllabus: raw[key]["Instructor Name"] || "",
        term_syllabus: raw[key]["Semester"] || "",
        year_syllabus: raw[key]["Year"]     || "",
        last_edited:   raw[key]["Last Edited"] || "",
        created_at: raw[key]["Created"] || raw[key]["Created At"] || "",
        course_type: raw[key]["Course Type"] || raw[key]["Type"] || "General Education",
        ...raw[key],
    }));

    return course_list;
};


/**
 * Fetches the full data object for a single course row.
 */
export const getCourseData = (
    course_id: string
): Promise<Record<string, string> | null> => {
    return createApiCaller<Record<string, string>>({
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

export interface CreateCourseResponse {
    course_id: string;
}

export const createNewCourse = (
    data: Record<string, string>
): Promise<CreateCourseResponse | null> => {
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
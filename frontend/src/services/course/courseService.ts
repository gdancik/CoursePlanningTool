import {createApiCaller} from "../../utils/apiFactory";


export interface Course {
    course_id: string;
    course_title_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    last_edited: string;
    [key: string]: string;
}

export const getNewCourseId = (): Promise<{ course_id: string } | null> => {
    return createApiCaller<{ course_id: string }>({
        url: "getNewCourseId",
        method: "GET",
        withCredentials: true,
    })();
};


export const updateValue = (
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

//  Get all user courses (different from getSheet)
export const getCourses = async (): Promise<Course[] | null> => {
    const raw = await createApiCaller<Record<string, Record<string, string>>>({
        url: "getSheet/",
        method: "POST",
        withCredentials: true,
        data: {}, // needed for POST with JSON
        headers: {
            "Content-Type": "application/json"
        }
    })();

    if (!raw) return null;

    const transformed = Object.entries(raw).map(([course_id, courseData]) => ({
        course_id,
        course_title_syllabus: courseData["Course Title"] || "",
        instructor_name_syllabus: courseData["Instructor Name"] || "",
        term_syllabus: `${courseData["Year"] ?? ""}-${courseData["Semester"] ?? ""}`,
        last_edited: courseData["Last Edited"] || "",
        ...courseData
    }));

    return transformed;
};

export const getValue = (
    course_id: string
): Promise<Record<string, string> | null> => {
    return createApiCaller<Record<string, string>>({
        url: "getValue",
        method: "POST",
        withCredentials: true,
        data: { course_id },
    })();
};

export const createNewCourse = (
    data: Record<string, string>
): Promise<{ course_id: string } | null> => {
    return createApiCaller<{ course_id: string }>({
        url: "createNewCourse/",
        method: "POST",
        withCredentials: true,
        data: {
            dict_of_columns_and_vals: data,
        },
    })();
};
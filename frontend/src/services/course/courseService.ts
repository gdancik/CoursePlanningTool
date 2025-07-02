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
export const getCourses = (): Promise<Course[] | null> => {
    return createApiCaller<Course[]>({
        url: "getSheet/",
        method: "POST",
        withCredentials: true,
    })();
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
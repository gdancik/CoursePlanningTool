import {createApiCaller} from "../../utils/apiFactory";


export interface Course {
    course_id: string;
    course_title_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    last_edited: string;
    [key: string]: string;
}

export const fetchCourses = createApiCaller<Course[]>({
    url: "getSheet/",
    method: "POST",
    withCredentials: true,
});
export const createNewCourse = (data: Record<string, string>): Promise<{ course_id: string } | null> => {
    return createApiCaller<{ course_id: string }>({
        url: "createNewCourse/",
        method: "POST",
        withCredentials: true,
        data: {
            dict_of_columns_and_vals: data,
        },
    })();
};
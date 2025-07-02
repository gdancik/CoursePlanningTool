import { createApiCaller } from "../../utils/apiFactory";

export interface Course {
    course_id: string;
    course_title_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    last_edited: string;
    [key: string]: string;
}

// Fetch all courses
export const fetchCourses = createApiCaller<Course[]>({
    url: "https://gdancik.pythonanywhere.com/api/getSheet/",
    method: "POST",
    withCredentials: true,
    transformResponse: (data) => data ?? [],
});

// Create a new course and get back the new course_id
export const createNewCourse = (data: Record<string, string>) =>
    createApiCaller<{ course_id: string }>({
        url: "/createNewCourse/",
        method: "POST",
        withCredentials: true,
        data: {
            dict_of_columns_and_vals: data,
        },
    })();

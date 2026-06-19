// utils/handlers/courseHandler.ts

import {
    createNewCourse,
    getCourseData,
    getCourses as apiFetchCourses,
    Course,
} from "../../../services/course/courseService";
import {FormState} from "../../PageRenderEngine/types";
import type {ModalFactory} from "../../useModalFactory";

type rawCourseData = FormState & {
    "Course Title"?: string;
    "Course Code"?: string;
    "Course Number"?: string;
    "Instructor Name"?: string;
    "Semester"?: string;
    "Year"?: string;
    "Last Edited"?: string;
}

export const createCourseHandler = (
    modal: ModalFactory,
    setCourses: (courses: Course[]) => void
) => {
    return async (formData: FormState) => {
        modal.showRedirect( "Creating Course", "Creating your course...", "loading"
        );

        try {

            const createResult = await createNewCourse(formData);
            const newId = createResult?.course_id;

            if (!newId) {
                throw new Error("No course_id returned from createNewCourse");
            }

            // 2) Persist that ID
            localStorage.setItem("currentCourseId", newId);

            // 3) Fetch the new row
            const raw = (await getCourseData(newId)) as rawCourseData | null;
            if (!raw) {
                throw new Error(`Could not fetch data for course ${newId}`);
            }

            // 4) Build Course object
            const newCourse: Course = {
                ...raw,
                course_id: newId,
                course_title_syllabus: raw["Course Title"]    || "",
                subj_code_syllabus:     raw["Course Code"]     || "",
                crse_number_syllabus:   raw["Course Number"]   || "",
                instructor_name_syllabus: raw["Instructor Name"] || "",
                term_syllabus:          raw["Semester"]        || "",
                year_syllabus:          raw["Year"]            || "",
                last_edited:            raw["Last Edited"]     || "",

            };

            // 5) Persist full data & refresh list
            localStorage.setItem("currentCourseData", JSON.stringify(newCourse));

            const all = (await apiFetchCourses()) || [];
            setCourses(all);

            modal.showRedirect(
                "Course Created",
                `Course ${newId} created!`,
                "success"
            );
        } catch (err: unknown) {
            console.error("Course creation failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred.";

            modal.showError?.(message);
        }
    };
};

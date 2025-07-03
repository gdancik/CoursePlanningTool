// utils/handlers/courseHandler.ts
import { jsonFieldsMapper } from "../jsonFieldsMapper";
import {
    createNewCourse,
    getCourseData,
    getCourses as apiFetchCourses,
    Course,
} from "../../services/course/courseService";
import { Dispatch, SetStateAction } from "react";

export type ModalControls = {
    setVisible: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<"loading" | "success" | "error">>;
    setTitle: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
};

/**
 * Creates a new course (which also populates the sheet),
 * then fetches that row back, maps it into your Course interface,
 * stores it in localStorage, and finally refreshes the full list.
 */
export const createCourseHandler = (
    userId: string,
    modal: ModalControls,
    setCourses: (courses: Course[]) => void
) => {
    return async (formData: Record<string, string>) => {
        // 1) Show loading
        modal.setTitle("Creating Course");
        modal.setMessage("Please wait while we create your course...");
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            // 2) Create & get back the exact new ID
            const mapped = jsonFieldsMapper(formData);
            const result = await createNewCourse(mapped);
            if (!result?.course_id) {
                throw new Error("No course_id returned from createNewCourse");
            }
            const newId = result.course_id;
            localStorage.setItem("currentCourseId", newId);

            // 3) Fetch *that* row’s data
            const raw = await getCourseData(newId);
            if (!raw) {
                throw new Error(`Could not fetch data for course ${newId}`);
            }

            // 4) Shape it into your Course interface
            const newCourse: Course = {
                course_id: newId,
                course_title_syllabus: raw["Course Title"]    || "",
                instructor_name_syllabus: raw["Instructor Name"] || "",
                term_syllabus: `${raw["Year"] ?? ""}-${raw["Semester"] ?? ""}`,
                last_edited: raw["Last Edited"]             || "",
                ...raw,
            };

            // 5) Persist it for your form/UI
            localStorage.setItem("currentCourseData", JSON.stringify(newCourse));

            // 6) Refresh the full list if you need it
            const all = (await apiFetchCourses()) || [];
            setCourses(all);

            // 7) Success UI
            modal.setStatus("success");
            modal.setTitle("Course Created");
            modal.setMessage(`Course ${newId} created!`);
            setTimeout(() => modal.setVisible(false), 1500);
        } catch (err: any) {
            console.error("Course creation failed:", err);
            modal.setStatus("error");
            modal.setTitle("Error Creating Course");
            modal.setMessage(err.message || "An unexpected error occurred.");
            setTimeout(() => modal.setVisible(false), 3000);
        }
    };
};

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
 * 1) Calls /createNewCourse/ (which returns { course_id: "c8" }),
 * 2) Uses that course_id to fetch the row,
 * 3) Maps it into a Course,
 * 4) Refreshes the list.
 */
export const createCourseHandler = (
    userId: string,
    modal: ModalControls,
    setCourses: (courses: Course[]) => void
) => {
    return async (formData: Record<string, string>) => {
        // Show loading
        modal.setTitle("Creating Course");
        modal.setMessage("Please wait while we create your course...");
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            // 1) Create the row & extract the new ID
            const mapped = jsonFieldsMapper(formData);
            const createResult = await createNewCourse(mapped);
            if (!createResult?.course_id) {
                throw new Error("No course_id returned from createNewCourse");
            }
            const newId: string = createResult.course_id;

            // 2) Fetch the newly created row
            const raw = await getCourseData(newId);
            if (!raw) {
                throw new Error(`Could not fetch data for course ${newId}`);
            }

            // 3) Shape into your front-end Course interface
            const newCourse: Course = {
                course_id:              newId,
                course_title_syllabus:  raw["Course Title"]    || "",
                instructor_name_syllabus: raw["Instructor Name"] || "",
                term_syllabus:          `${raw["Year"] ?? ""}-${raw["Semester"] ?? ""}`,
                last_edited:            raw["Last Edited"]     || "",
                ...raw,
            };

            // 4) Persist & refresh UI
            localStorage.setItem("currentCourseData", JSON.stringify(newCourse));
            const all = (await apiFetchCourses()) || [];
            setCourses(all);

            // Success feedback
            modal.setStatus("success");
            modal.setTitle("Course Created");
            modal.setMessage(`Course ${newId} created!`);
        } catch (err: any) {
            console.error("Course creation failed:", err);
            modal.setStatus("error");
            modal.setTitle("Error Creating Course");
            modal.setMessage(err.message || "An unexpected error occurred.");
        } finally {
            setTimeout(() => modal.setVisible(false), 1500);
        }
    };
};

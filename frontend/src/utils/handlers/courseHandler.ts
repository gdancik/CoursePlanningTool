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

export const createCourseHandler = (
    modal: ModalControls,
    setCourses: (courses: Course[]) => void
) => {
    return async (formData: Record<string, string>) => {
        modal.setTitle("Creating Course");
        modal.setMessage("Please wait while we create your course...");
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            // 1) Create & get back the new ID
            const mapped = jsonFieldsMapper(formData);
            const createResult = await createNewCourse(mapped);
            const newId = createResult?.course_id;
            if (!newId) {
                throw new Error("No course_id returned from createNewCourse");
            }

            // 2) Persist that ID
            localStorage.setItem("currentCourseId", newId);

            // 3) Fetch the new row
            const raw = await getCourseData(newId);
            if (!raw) {
                throw new Error(`Could not fetch data for course ${newId}`);
            }

            // 4) Build Course object
            const newCourse: Course = {
                course_id:               newId,
                course_title_syllabus:   raw["Course Title"]    || "",
                instructor_name_syllabus:raw["Instructor Name"] || "",
                term_syllabus:           `${raw["Year"]}-${raw["Semester"]}`,
                last_edited:             raw["Last Edited"]     || "",
                ...raw,
            };

            // 5) Persist full data & refresh list
            localStorage.setItem("currentCourseData", JSON.stringify(newCourse));
            const all = (await apiFetchCourses()) || [];
            setCourses(all);

            // 6) Success
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

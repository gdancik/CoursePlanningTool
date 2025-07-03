// utils/handlers/courseHandler.ts
import { jsonFieldsMapper } from "../jsonFieldsMapper";
import {
    createNewCourse,
    getCourseData,
    getCourses as apiFetchCourses,
    getNewCourseId,
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
 * then retrieves the new ID from the backend, fetches that row,
 * maps it into your Course interface, stores it in localStorage,
 * and finally refreshes the full list.
 */
export const createCourseHandler = (
    userId: string,
    modal: ModalControls,
    setCourses: (courses: Course[]) => void
) => {
    return async (formData: Record<string, string>) => {
        // Show loading state
        modal.setTitle("Creating Course");
        modal.setMessage("Please wait while we create your course...");
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            //  Create the row in one go
            const mapped = jsonFieldsMapper(formData);
            const createResult = await createNewCourse(mapped);
            if (!createResult?.course_id) {
                throw new Error("No course_id returned from createNewCourse");
            }

            //  Retrieve the fresh ID from the backend
            const idResp = await getNewCourseId(userId);
            if (!idResp?.course_id) {
                throw new Error("No course_id returned from getNewCourseId");
            }
            const newId: string = idResp.course_id;
            localStorage.setItem("currentCourseId", newId);

            //  Fetch the newly created row
            const raw = await getCourseData(newId);
            if (!raw) {
                throw new Error(`Could not fetch data for course ${newId}`);
            }

            //  Map into the Course interface
            const newCourse: Course = {
                course_id: newId,
                course_title_syllabus: raw["Course Title"] || "",
                instructor_name_syllabus: raw["Instructor Name"] || "",
                term_syllabus: `${raw["Year"] ?? ""}-${raw["Semester"] ?? ""}`,
                last_edited: raw["Last Edited"] || "",
                ...raw,
            };

            localStorage.setItem(
                "currentCourseData",
                JSON.stringify(newCourse)
            );

            const all = (await apiFetchCourses()) || [];
            setCourses(all);
            
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

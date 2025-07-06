// utils/handlers/courseHandler.ts
import {
    getCourseData,
    getCourses as apiFetchCourses,
    Course,
} from "../../services/course/courseService";
import {previewSyllabus} from "../../services/TestServices/syllabusService";
import { Dispatch, SetStateAction } from "react";

export type ModalControls = {
    setVisible: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<"loading" | "success" | "error">>;
    setTitle: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
};

/**
 * Loads an existing course into localStorage, refreshes the list,
 * and navigates to the overview page.
 */
export const createEditHandler = (
    modal: ModalControls,
    setCourses: (courses: Course[]) => void,
    navigate: (path: string) => void
) => {
    return async (courseId: string) => {
        modal.setTitle("Loading Course");
        modal.setMessage(`Fetching data for course ${courseId}…`);
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            // 1) Clear stale data
            localStorage.removeItem("currentCourseData");
            localStorage.removeItem("currentCourseId");

            // 2) Fetch from backend
            const raw = await getCourseData(courseId);
            if (!raw) throw new Error(`No data for course ${courseId}`);

            // 3) Build Course object
            const course: Course = {
                course_id: courseId,
                course_title_syllabus:    raw["Course Title"]    || "",
                subj_code_syllabus:       raw["Course Code"]     || "",
                crse_number_syllabus:     raw["Course Number"]   || "",
                instructor_name_syllabus: raw["Instructor Name"] || "",
                term_syllabus:            raw["Semester"]        || "",
                year_syllabus:            raw["Year"]            || "",
                last_edited:              raw["Last Edited"]     || "",
                ...raw,
            };

            // 4) Persist & refresh
            localStorage.setItem("currentCourseId", courseId);
            localStorage.setItem("currentCourseData", JSON.stringify(course));
            const all = (await apiFetchCourses()) || [];
            setCourses(all);

            // 5) DONE → go to overview
            navigate("/overview");

            // 6) Optional: feedback (modal hides automatically below)
            modal.setStatus("success");
            modal.setTitle("Course Loaded");
            modal.setMessage(`Routing to overview…`);
        } catch (err: any) {
            console.error("Edit handler failed:", err);
            modal.setStatus("error");
            modal.setTitle("Error Loading Course");
            modal.setMessage(err.message || "Something went wrong.");
        } finally {
            setTimeout(() => modal.setVisible(false), 500);
        }
    };
};

export const createPreviewHandler = (
    modal: ModalControls,
    courseId: string,
    courseTitle: string
) => {
    return async () => {
        modal.setTitle("Generating Preview");
        modal.setMessage(`Downloading syllabus for "${courseTitle}"…`);
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            const blob = await previewSyllabus(courseId);
            if (!blob) throw new Error("Empty preview response");

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `syllabus_preview_${courseId}.docx`;
            a.click();
            window.URL.revokeObjectURL(url);

            modal.setStatus("success");
            modal.setTitle("Preview Ready!");
            modal.setMessage(`Downloaded "${courseTitle}".`);
        } catch (err: any) {
            console.error("Preview failed:", err);
            modal.setStatus("error");
            modal.setTitle("Preview Failed");
            modal.setMessage(err.message || `Could not download "${courseTitle}".`);
        } finally {
            setTimeout(() => modal.setVisible(false), 1500);
        }
    };
};

export const deleteRowHandler{

};
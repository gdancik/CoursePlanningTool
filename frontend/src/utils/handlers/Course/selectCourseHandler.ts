// utils/handlers/courseHandler.ts
import {
    getCourseData,
    getCourses as apiFetchCourses,
    Course, deleteCourseRow, duplicateCourse
} from "../../../services/course/courseService";
import {previewSyllabus} from "../../../services/TestServices/syllabusService";
import type {ModalFactory} from "../../useModalFactory";

/**
 * Loads an existing course into localStorage, refreshes the list,
 * and navigates to the overview page.
 */
export const createEditHandler = (
    modal: ModalFactory,
    setCourses: (courses: Course[]) => void,
    navigate: (path: string) => void
) => {
    return async (courseId: string, courseTitle: string) => {
        modal.showRedirect("Loading Course", `Fetching data for course ${courseId}...`, "loading")

        try {
            // 1) Clear stale data
            localStorage.removeItem("currentCourseData");
            localStorage.removeItem("currentCourseId");

            // 2) Fetch from backend
            const raw = await getCourseData(courseId);
            if (!raw) {
                throw new Error(`No data for course ${courseId}`);
            }

            // 3) Build Course object
            const course: Course = {
                ...raw,
                course_id: courseId,
            } as Course;

            // 4) Persist & refresh
            localStorage.setItem("currentCourseId", courseId);
            localStorage.setItem("currentCourseData", JSON.stringify(course));

            const all = (await apiFetchCourses()) || [];
            setCourses(all);

            // 5) DONE → go to overview
            navigate("/overview");
        } catch (err: unknown) {
            console.error("Edit handler failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong.";

            modal.showError(message);
        }
    };
};

export const createPreviewHandler = (
    modal: ModalFactory,
    courseId: string,
    courseTitle: string
) => {
    return async () => {
        modal.showRedirect( "Generating Sylabus Preview",`Downloading syllabus for "${courseTitle}"…`, "loading" );

        try {
            const blob = await previewSyllabus(courseId);

            if (!blob) throw new Error("Empty preview response");

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `syllabus_preview_${courseId}.docx`;
            a.click();
            window.URL.revokeObjectURL(url);

            modal.showRedirect(
                "Preview Ready!",
                `Downloaded "${courseTitle}".`,
                "success"
            );

            setTimeout(() => {
                modal.hide();
            }, 3000);

        } catch (err: unknown) {
            console.error("Preview failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : `Could not download "${courseTitle}".`;

            modal.showError(message);
        }
    };
};

export const createDeleteRowHandler = (
    modal: ModalFactory,
    setCourses: (courses: Course[]) => void,
) => {
    return async (courseId: string, courseTitle: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this course? This action cannot be undone");

        if (!confirmed) {
            return;
        }

        modal.showRedirect(
            "Deleting Course",
            "Please wait while we remove the course…",
            "loading"
        );

        try {
            const response = await deleteCourseRow(courseId);
            if (!response) throw new Error("Course could not be deleted");

            const updatedCourses = (await apiFetchCourses() || []);
            setCourses(updatedCourses);

            modal.showRedirect(
                "Course Deleted",
                `Course ${courseTitle} has been removed.`,
                "success"
            );

            setTimeout(() => {modal.hide();}, 3000);


        } catch (err: unknown) {
            console.error("Delete handler failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong while deleting the course.";

            modal.showError(message);
        }
    };
};

export const createDuplicateRowHandler = (
    modal: ModalFactory,
    setCourses: (courses: Course[]) => void,
) => {
    return async (courseId: string, courseTitle: string) => {
        modal.showRedirect(
            "Duplicating Course",
            "Please wait while we duplicate the course…",
            "loading"
        );

        try {
            const response = await duplicateCourse(courseId);

            const newId = response?.course_id;

            if (typeof newId !== "string") {
                throw new Error("Course could not be duplicated");
            }

            const updatedCourses = (await apiFetchCourses()) || [];
            setCourses(updatedCourses);

            modal.showRedirect(
                "Course Duplicated",
                `${courseTitle} has been duplicated with ID: ${newId}`,
                "success"
            );

            setTimeout(() => {
                modal.hide();
            }, 3000);
        } catch (err: unknown) {
            console.error("Duplicate handler failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong while duplicating the course.";

            modal.showError(message);
        }
    };
};
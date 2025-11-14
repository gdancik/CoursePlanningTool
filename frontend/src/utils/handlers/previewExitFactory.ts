// src/utils/handlers/previewExitFactory.ts

import { previewSyllabus, updateCourseValues } from "../../services/course/courseService";
import { createNewCourse } from "../../services/course/courseService";

type ModalControls = {
    setVisible: (visible: boolean) => void;
    setStatus: (status: "loading" | "success") => void;
    setTitle: (title: string) => void;
    setMessage: (message: string) => void;
};

export const createSaveHandler = (
    formData: Record<string, string>,
    modal: ModalControls,
    fields?: { content: string; backendKey?: string; type: string }[]
) => {
    return async () => {
        modal.setTitle("Saving Changes");
        modal.setMessage("Please wait while we save your progress...");
        modal.setStatus("loading");
        modal.setVisible(true);

        const saved = localStorage.getItem("currentCourseData");
        let course_id: string | undefined;

        if (saved) {
            try {
                const savedData = JSON.parse(saved);
                course_id = savedData.course_id;
            } catch {
                console.warn("Invalid saved course data");
            }
        }

        let mappedData: Record<string, string>;
        if (fields) {

            mappedData = fields.reduce((acc, field) => {
                if (
                    (field.type === "text-box" || field.type === "syllabus-text") &&
                    field.backendKey &&
                    formData[field.content]
                ) {
                    acc[field.backendKey] = formData[field.content];
                }
                return acc;
            }, {} as Record<string, string>);
        } else {

            mappedData = { ...formData };
        }

        if (!course_id) {
            const result = await createNewCourse(mappedData);
            const newId = result?.course_id;
            if (!newId) {
                modal.setVisible(false);
                return;
            }
            course_id = newId;
        }

        mappedData["course_id"] = course_id;

        localStorage.setItem("currentCourseData", JSON.stringify({ ...mappedData, course_id }));

        const result = await updateCourseValues(course_id, mappedData);
        if (result !== null) {
            modal.setStatus("success");
            modal.setTitle("Saved!");
            modal.setMessage("Your changes were saved successfully.");
            setTimeout(() => modal.setVisible(false), 1500);
        } else {
            modal.setVisible(false);
        }
    };
};


export const createSaveAndExitHandler = (
    formData: Record<string, string>,
    navigate: (path: string) => void,
    modal: ModalControls,
    fields?: { content: string; backendKey?: string; type: string }[]
) => {
    return async () => {
        modal.setTitle("Saving & Exiting");
        modal.setMessage("Hold on, we're saving and redirecting you...");
        modal.setStatus("loading");
        modal.setVisible(true);

        let mappedData: Record<string, string>;

        if (fields) {
            mappedData = fields.reduce((acc, field) => {
                if (
                    (field.type === "text-box" || field.type === "syllabus-text") &&
                    field.backendKey &&
                    formData[field.content]
                ) {
                    acc[field.backendKey] = formData[field.content];
                }
                return acc;
            }, {} as Record<string, string>);
        } else {
            mappedData = { ...formData };
        }

        let course_id = mappedData["course_id"];

        if (!course_id) {
            const result = await createNewCourse(mappedData);
            const newId = result?.course_id;
            if (!newId) {
                modal.setVisible(false);
                return;
            }
            course_id = newId;
            mappedData["course_id"] = course_id;
            localStorage.setItem("currentCourseData", JSON.stringify(mappedData));
        }

        const saveResult = await updateCourseValues(course_id, mappedData);
        if (saveResult !== null) {
            modal.setStatus("success");
            modal.setTitle("Saved & Exiting");
            modal.setMessage("Redirecting you to My Courses Home Page...");
            setTimeout(() => {
                modal.setVisible(false);
                navigate("/course-page");
            }, 1500);
        } else {
            modal.setVisible(false);
        }
    };
};


export const createPreviewHandler = (
    formData: Record<string, string>,
    modal: ModalControls,
    fields?: { content: string; backendKey?: string; type: string }[]
) => {
    return async () => {
        modal.setTitle("Generating Preview");
        modal.setMessage("Please wait while we generate your syllabus...");
        modal.setStatus("loading");
        modal.setVisible(true);

        let mappedData: Record<string, string>;

        if (fields) {
            mappedData = fields.reduce((acc, field) => {
                if (
                    (field.type === "text-box" || field.type === "syllabus-text") &&
                    field.backendKey &&
                    formData[field.content]
                ) {
                    acc[field.backendKey] = formData[field.content];
                }
                return acc;
            }, {} as Record<string, string>);
        } else {
            mappedData = { ...formData };
        }

        const saved = localStorage.getItem("currentCourseData");
        if (saved) {
            const savedData = JSON.parse(saved);
            if (savedData.course_id) {
                mappedData["course_id"] = savedData.course_id;
            }
        }

        let course_id = mappedData["course_id"];

        if (!course_id) {
            const result = await createNewCourse(mappedData);
            const newId = result?.course_id;
            if (!newId) {
                modal.setVisible(false);
                return;
            }
            course_id = newId;
            mappedData["course_id"] = course_id;
        }

        localStorage.setItem("currentCourseData", JSON.stringify(mappedData));

        const saveResult = await updateCourseValues(course_id, mappedData);
        if (saveResult !== null) {
            const blob = await previewSyllabus(course_id);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "syllabus_preview.docx";
                a.click();
                window.URL.revokeObjectURL(url);

                modal.setStatus("success");
                modal.setTitle("Preview Ready!");
                modal.setMessage("Your preview has been downloaded.");
                setTimeout(() => modal.setVisible(false), 1500);
            } else {
                modal.setVisible(false);
            }
        } else {
            modal.setVisible(false);
        }
    };
};

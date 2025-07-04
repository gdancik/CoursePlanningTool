// src/utils/handlers/formHandlersFactory.ts

import { saveToBackend, logoutUser, previewSyllabus } from "../../services/TestServices/syllabusService";
import { saveJsonFile } from "../../components/Button/ButtonLogic";
import { jsonFieldsMapper } from "../jsonFieldsMapper";
import { createNewCourse } from "../../services/course/courseService";

type ModalControls = {
    setVisible: (visible: boolean) => void;
    setStatus: (status: "loading" | "success") => void;
    setTitle: (title: string) => void;
    setMessage: (message: string) => void;
};

export const createSaveHandler = (
    formData: Record<string, string>,
    modal: ModalControls
) => {
    return async () => {
        modal.setTitle("Saving Changes");
        modal.setMessage("Please wait while we save your progress...");
        modal.setStatus("loading");
        modal.setVisible(true);

        // 1) Try to load any existing course_id
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

        // 2) Map form data (without course_id)
        const mappedData = jsonFieldsMapper(formData);

        // 3) Create new course if we don’t already have an ID
        if (!course_id) {
            const result = await createNewCourse(mappedData);
            const newId = result?.course_id;
            if (!newId) {
                modal.setVisible(false);
                return;
            }
            course_id = newId;
        }

        // 4) Now we know course_id is a string—assign & persist
        mappedData["course_id"] = course_id!;
        localStorage.setItem("currentCourseData", JSON.stringify({ ...mappedData, course_id }));

        // 5) Save to backend
        const result = await saveToBackend(course_id!, mappedData);
        if (result !== null) {
            saveJsonFile(mappedData, "form_data.json");
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
    modal: ModalControls
) => {
    return async () => {
        modal.setTitle("Saving & Exiting");
        modal.setMessage("Hold on, we're saving and logging you out...");
        modal.setStatus("loading");
        modal.setVisible(true);

        const mappedData = jsonFieldsMapper(formData);
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

        const saveResult = await saveToBackend(course_id, mappedData);
        if (saveResult !== null) {
            saveJsonFile(mappedData, "form_data_exit.json");
            const logoutResult = await logoutUser();
            if (logoutResult !== null) {
                modal.setStatus("success");
                modal.setTitle("Saved & Logged Out");
                modal.setMessage("Redirecting you to login...");
                setTimeout(() => {
                    modal.setVisible(false);
                    navigate("/");
                }, 1500);
            } else {
                modal.setVisible(false);
            }
        } else {
            modal.setVisible(false);
        }
    };
};

export const createPreviewHandler = (
    formData: Record<string, string>,
    modal: ModalControls
) => {
    return async () => {
        modal.setTitle("Generating Preview");
        modal.setMessage("Please wait while we generate your syllabus...");
        modal.setStatus("loading");
        modal.setVisible(true);

        const mappedData = jsonFieldsMapper(formData);

        // Inject existing ID if we saved one previously
        const saved = localStorage.getItem("currentCourseData");
        if (saved) {
            const savedData = JSON.parse(saved);
            if (savedData.course_id) {
                mappedData["course_id"] = savedData.course_id;
            }
        }

        let course_id = mappedData["course_id"];

        // If no ID yet, create one
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

        // Persist latest values + ID
        localStorage.setItem("currentCourseData", JSON.stringify(mappedData));

        const saveResult = await saveToBackend(course_id, mappedData);
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

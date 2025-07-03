import { saveToBackend, logoutUser, previewSyllabus} from "../../services/TestServices/syllabusService";
import {saveJsonFile} from "../../components/Button/ButtonLogic";
import {jsonFieldsMapper} from "../jsonFieldsMapper";
import {createNewCourse} from "../../services/course/courseService";

type ModalControls = {
    setVisible: (visible: boolean) => void;
    setStatus: (status: "loading" | "success") => void;
    setTitle: (title: string) => void;
    setMessage: (message: string) => void;
}

export const createSaveHandler = (
    formData: Record<string, string>,
    modal: ModalControls
) => {
    return async () => {
        modal.setTitle("Saving Changes");
        modal.setMessage("Please wait while we save your progress...");
        modal.setStatus("loading");
        modal.setVisible(true);

        //  Extract saved course_id first
        const saved = localStorage.getItem("newCourseData");
        let course_id: string | undefined;

        if (saved) {
            try {
                const savedData = JSON.parse(saved);
                course_id = savedData.course_id;
            } catch (err) {
                console.warn("Invalid saved course data");
            }
        }

        //  Map form data (without course_id)
        const mappedData = jsonFieldsMapper(formData);

        //  Use or create course_id
        if (!course_id) {
            const result = await createNewCourse(mappedData);
            if (!result?.course_id) {
                modal.setVisible(false);
                return;
            }
            course_id = result.course_id;
        }

        //  Always set it on mappedData for saving
        mappedData["course_id"] = course_id;

        //  Save locally
        localStorage.setItem("newCourseData", JSON.stringify({ ...mappedData, course_id }));

        //  Save to backend
        const result = await saveToBackend(course_id, mappedData);
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
            if (!result?.course_id) {
                modal.setVisible(false);
                return;
            }
            course_id = result.course_id;
            mappedData["course_id"] = course_id;
            localStorage.setItem("newCourseData", JSON.stringify(mappedData));
        }

        const saveResult = await saveToBackend(course_id, mappedData);
        if (saveResult !== null) {
            saveJsonFile(mappedData, "form_data_exit.json");
            const logoutResult = await logoutUser();
            if (logoutResult !== null) {
                modal.setStatus("success");
                modal.setTitle("Saved & Logged Out");
                modal.setMessage("Redirecting you to login...");
                setTimeout(()=> {
                    modal.setVisible(false);
                    navigate("/");
                }, 1500);
            } else {
                modal.setVisible(false);
            }
        } else {
            modal.setVisible(false)
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

        //  Always generate fresh mappedData
        const mappedData = jsonFieldsMapper(formData);

        //  Inject course_id from localStorage if available
        const saved = localStorage.getItem("newCourseData");
        if (saved) {
            const savedData = JSON.parse(saved);
            if (savedData.course_id) {
                mappedData["course_id"] = savedData.course_id;
            }
        }

        let course_id = mappedData["course_id"];

        //  Create new course if not already created
        if (!course_id) {
            const result = await createNewCourse(mappedData);
            if (!result?.course_id) {
                modal.setVisible(false);
                return;
            }
            course_id = result.course_id;
            mappedData["course_id"] = course_id;
        }

        // Save latest values + ID to localStorage for reuse
        localStorage.setItem("newCourseData", JSON.stringify(mappedData));

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
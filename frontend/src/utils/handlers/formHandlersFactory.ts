import { saveToBackend, logoutUser, previewSyllabus, getNewCourseId} from "../../services/TestServices/syllabusService";
import { getOrGenerateCourseId } from "../../utils/getOrGenerateCourseId";
import {saveJsonFile} from "../../components/Button/ButtonLogic";
import {jsonFieldsMapper} from "../jsonFieldsMapper";

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

        const mappedData = jsonFieldsMapper(formData);

        const course_id = await getOrGenerateCourseId(mappedData);
        if (!course_id){
            modal.setVisible(false);
            return;
        };

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

        const course_id = await getOrGenerateCourseId(mappedData);
        if (!course_id) {
            modal.setVisible(false);
            return;
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

        const mappedData = jsonFieldsMapper(formData);
        const course_id = await getOrGenerateCourseId(mappedData);
        if (!course_id) {
            modal.setVisible(false);
            return;
        }

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